#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Google Scholar BibTeX Exporter
--------------------------------------
Author: Song Liu
Email: liusong299@gmail.com
Date: Oct 27, 2025

Description:
    A command-line tool to automatically export publication data
    from a Google Scholar author profile.

Features:
    ✅ Automatically extract author name from the Google Scholar page
    ✅ Create a folder named after the author
    ✅ Export all publications as a .bib file
    ✅ Optional: export metadata as .csv (--csv)
    ✅ Optional: download open-access PDFs (--pdf)
    ✅ Organize all outputs under the author folder

Dependencies:
    pip install scholarly tqdm requests pandas
"""

import re
import sys
import os
import time
import requests
import pandas as pd
import asyncio
from scholarly2 import scholarly
from tqdm import tqdm


def extract_author_id(url: str) -> str:
    """Extract author ID from Google Scholar URL"""
    match = re.search(r"user=([\w-]+)", url)
    if not match:
        raise ValueError("❌ Could not find author ID. Please check your URL.")
    return match.group(1)


def sanitize_filename(name: str) -> str:
    """Sanitize filenames for safe saving"""
    return re.sub(r"[\\/:*?\"<>|]+", "_", name.strip())


def download_pdf(url: str, out_dir: str, title: str):
    """Download a PDF file from the given URL"""
    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200 and r.headers.get(
            "content-type", ""
        ).lower().startswith("application/pdf"):
            safe_title = sanitize_filename(title)
            filepath = os.path.join(out_dir, f"{safe_title}.pdf")
            with open(filepath, "wb") as f:
                f.write(r.content)
            print(f"📄 Downloaded: {safe_title}.pdf")
        else:
            print(f"⚠️ Could not download PDF for {title} ({r.status_code})")
    except Exception as e:
        print(f"⚠️ PDF download failed for {title}: {e}")


def fetch_bib(author_id: str, output_dir: str, download_pdfs=False, export_csv=False):
    print(f"🔍 Fetching publication data for Google Scholar author ID: {author_id}\n")
    author = scholarly.search_author_id(author_id)
    author = scholarly.fill(author, sections=["publications"])
    author_name = sanitize_filename(author.get("name", f"Author_{author_id}"))
    author_dir = os.path.join(output_dir, author_name)
    os.makedirs(author_dir, exist_ok=True)

    bib_path = os.path.join(author_dir, "papers.bib")
    pdf_dir = os.path.join(author_dir, "PDFs") if download_pdfs else None
    if pdf_dir:
        os.makedirs(pdf_dir, exist_ok=True)

    # Load existing BibTeX entries if resuming
    existing_bibs = set()
    if os.path.exists(bib_path):
        with open(bib_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("@article{"):
                    existing_bibs.add(line.strip())

    # Load existing PDFs if resuming
    existing_pdfs = set()
    if pdf_dir and os.path.exists(pdf_dir):
        for fname in os.listdir(pdf_dir):
            if fname.endswith(".pdf"):
                existing_pdfs.add(fname)

    pubs = author.get("publications", [])
    records = []
    all_bibs = []

    for pub in tqdm(pubs, desc="Fetching publications"):
        try:
            pub = scholarly.fill(pub)
            bib = pub.get("bib", {})
            title = str(bib.get("title", "Untitled")).replace("\n", " ")
            safe_title = sanitize_filename(title)

            # ---- Build BibTeX ----
            bibtex_id = "@article{{{},".format(re.sub(r"[^A-Za-z0-9]+", "", title)[:40])
            bibtex_entry = bibtex_id
            for key, value in bib.items():
                val_str = (
                    str(value).replace("{", "").replace("}", "").replace("\n", " ")
                )
                bibtex_entry += f"  {key} = {{{val_str}}},\n"
            bibtex_entry += "}\n"

            # Skip if BibTeX already exists
            if bibtex_id.strip() in existing_bibs:
                print(f"⏩ Skipping BibTeX for: {title}")
            else:
                all_bibs.append(bibtex_entry)
                existing_bibs.add(bibtex_id.strip())

            # ---- Save metadata for CSV ----
            records.append(
                {
                    "Title": title,
                    "Authors": bib.get("author", ""),
                    "Year": bib.get("year", ""),
                    "Journal": bib.get("journal", ""),
                    "DOI": bib.get("doi", ""),
                    "URL": pub.get("pub_url", ""),
                }
            )

            print(f"✅ {title}")

            # ---- Download PDF ----
            pdf_url = pub.get("eprint_url") or pub.get("pub_url")
            pdf_filename = f"{safe_title}.pdf"
            if (
                download_pdfs
                and pdf_url
                and any(
                    x in pdf_url
                    for x in ["biorxiv", "arxiv", "chemrxiv", "openreview", "pdf"]
                )
            ):
                if pdf_filename in existing_pdfs:
                    print(f"⏩ Skipping PDF for: {title}")
                else:
                    download_pdf(pdf_url, pdf_dir, title)
                    existing_pdfs.add(pdf_filename)

            time.sleep(1)
        except Exception as e:
            print(f"⚠️ Skipped publication: {bib.get('title', '[Unknown]')} ({e})")
            print("EXITING")
            break

    # ---- Write BibTeX ----
    if all_bibs:
        mode = "a" if os.path.exists(bib_path) else "w"
        with open(bib_path, mode, encoding="utf-8") as f:
            f.write("\n\n".join(all_bibs))
    print(f"\n🎉 Exported {len(all_bibs)} new publications → {bib_path}")

    # ---- Write CSV ----
    if export_csv and records:
        csv_file = os.path.join(author_dir, f"{author_name}.csv")
        pd.DataFrame(records).to_csv(csv_file, index=False)
        print(f"📊 CSV exported → {csv_file}")

    if download_pdfs:
        print(f"📁 PDFs saved under {pdf_dir}")


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python scholar_bib_export.py <Google_Scholar_URL> [--pdf] [--csv]"
        )
        sys.exit(1)

    url = sys.argv[1]
    output_dir = os.getcwd()
    download_pdfs = "--pdf" in sys.argv
    export_csv = "--csv" in sys.argv

    author_id = extract_author_id(url)
    fetch_bib(author_id, output_dir, download_pdfs, export_csv)


if __name__ == "__main__":
    main()

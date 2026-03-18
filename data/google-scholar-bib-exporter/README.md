# Google Scholar BibTeX Exporter

**Author:** Song Liu  
**Email:** liusong299@gmail.com  
**Date:** Oct 27, 2025  

---

## 📘 Overview

This script automates the process of **downloading publication data** from a Google Scholar author profile.

Given a Google Scholar author URL, the script will:

- 🔹 Automatically extract the author’s name and create a dedicated folder  
- 🔹 Export all publications in **BibTeX (.bib)** format  
- 🔹 Optionally export a **CSV** file containing publication metadata  
- 🔹 Optionally download **open-access PDF files** (e.g., from arXiv, bioRxiv, ChemRxiv, OpenReview)  
- 🔹 Organize all outputs neatly inside the author’s folder

---

## ⚙️ Features

| Function | Description |
|-----------|--------------|
| **Automatic author name detection** | Parses the author name from the Google Scholar profile |
| **BibTeX export** | Creates a single `.bib` file with all publications |
| **CSV export (`--csv`)** | Outputs publication metadata (title, authors, year, DOI, URL) |
| **PDF download (`--pdf`)** | Automatically downloads open-access PDFs |
| **Organized output** | Creates a clean folder structure per author |

---

## 🧩 Installation

Install the required Python packages:

```bash
pip install scholarly tqdm requests pandas
```

---

## 🚀 Usage

### 1️⃣ Basic BibTeX export
```bash
python scholar_bib_export.py "https://scholar.google.ca/citations?user=meZAXjoAAAAJ&hl=en"
```

This will create a folder:
```
./Song_Liu/
 └── Song_Liu.bib
```

---

### 2️⃣ Export BibTeX + CSV
```bash
python scholar_bib_export.py "https://scholar.google.ca/citations?user=meZAXjoAAAAJ&hl=en" --csv
```
Outputs:
```
./Song_Liu/
 ├── Song_Liu.bib
 └── Song_Liu.csv
```

---

### 3️⃣ Export BibTeX + CSV + PDFs
```bash
python scholar_bib_export.py "https://scholar.google.ca/citations?user=meZAXjoAAAAJ&hl=en" --pdf --csv
```
Outputs:
```
./Song_Liu/
 ├── Song_Liu.bib
 ├── Song_Liu.csv
 └── PDFs/
     ├── Adaptive_partitioning_by_local_density_peaks.pdf
     ├── ...
```

---

## 📂 Output Example

| Title | Authors | Year | Journal | DOI | URL |
|--------|----------|------|----------|-----|-----|
| Adaptive partitioning by local density-peaks | Liu, Song; Zhu, Lizhe; Sheong, Fu Kit; Wang, Wei; Huang, Xuhui | 2017 | *J. Comput. Chem.* | 10.1002/jcc.24664 | [link](https://doi.org/10.1002/jcc.24664) |
| TAPS: A traveling-salesman based automated path searching method | Zhu, Lizhe; Sheong, Fu Kit; Cao, Siqin; Liu, Song; Huang, Xuhui | 2019 | *J. Chem. Phys.* | 10.1063/1.5082633 | [link](https://doi.org/10.1063/1.5082633) |

---

## 🧠 Notes

- The script uses the [`scholarly`](https://pypi.org/project/scholarly/) library (unofficial Google Scholar API).  
- Requests are rate-limited with small delays to prevent temporary blocking.  
- Only open-access PDFs (e.g., arXiv/bioRxiv) are downloaded automatically.

---

## 📜 License

This project is released for academic and personal research purposes.  
Feel free to modify and distribute with attribution.

---

© 2025 **Song Liu** · liusong299@gmail.com
# google-scholar-bib-exporter

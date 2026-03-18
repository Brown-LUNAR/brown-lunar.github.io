import os
import yaml
import jinja2
import bibtexparser
from markdown import markdown
from pathlib import Path

PREFIX = Path(__file__).parent.parent
DATA_DIR = PREFIX / "data"
TEMPLATES_DIR = PREFIX / "templates"
OUTPUT_DIR = PREFIX
BLOG_DIR = PREFIX / "blog"
ASSETS_DIR = PREFIX / "assets"

# Set up Jinja2 environment
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATES_DIR))


def render_about():
    with open(os.path.join(DATA_DIR, "about.yaml")) as f:
        about = yaml.safe_load(f)
    template = jinja_env.get_template("about.html")
    html = template.render(**about, title="About")
    with open(os.path.join(OUTPUT_DIR, "about.html"), "w") as f:
        f.write(html)


def render_members():
    with open(os.path.join(DATA_DIR, "members.yaml")) as f:
        members = yaml.safe_load(f)
    template = jinja_env.get_template("members.html")
    html = template.render(members=members["members"], title="Members")
    with open(os.path.join(OUTPUT_DIR, "members.html"), "w") as f:
        f.write(html)


def render_research():
    with open(os.path.join(DATA_DIR, "papers.bib")) as f:
        bib_database = bibtexparser.load(f)
    papers = []
    import sys

    sys.path.append(str(TEMPLATES_DIR.parent / "scripts"))
    from tagging import get_tags_for_abstract

    def format_apa(entry):
        authors = entry.get("author", "").split(" and ")
        n = len(authors)
        if n > 6:
            authors = authors[:3] + ["..."] + authors[-3:]

        def apa_name(name):
            parts = name.split()
            if len(parts) == 0 or name == "...":
                return name
            last = parts[-1]
            initials = [p[0] + "." for p in parts[:-1] if p != "..."]
            return f"{last}, {' '.join(initials)}"

        apa_authors = ", ".join([apa_name(a) for a in authors])
        year = entry.get("pub_year", entry.get("year", ""))
        venue = entry.get("journal", entry.get("booktitle", ""))
        return apa_authors, f"({year}). {venue}."

    import json

    cache_path = DATA_DIR / "tag_cache.json"
    if cache_path.exists():
        with open(cache_path) as f:
            tag_cache = json.load(f)
    else:
        tag_cache = {}

    papers = []
    cache_updated = False
    for entry in bib_database.entries:
        apa_authors, apa_rest = format_apa(entry)
        abstract = entry.get("abstract", "")
        title = entry.get("title", "")
        cache_key = title.strip()[:80]  # Use truncated title as key
        tags = tag_cache.get(cache_key)
        if tags is None and abstract:
            tags = get_tags_for_abstract(abstract)
            tag_cache[cache_key] = tags
            cache_updated = True
        elif tags is None:
            tags = []
        year = entry.get("pub_year", entry.get("year", ""))
        try:
            sort_year = int(str(year).split("/")[0])
        except Exception:
            sort_year = 0
        papers.append(
            {
                "title": title,
                "apa_authors": apa_authors,
                "apa_rest": apa_rest,
                "abstract": abstract,
                "author": entry.get("author", ""),
                "year": year,
                "venue": entry.get("journal", entry.get("booktitle", "")),
                "tags": tags,
                "sort_year": sort_year,
            }
        )
    if cache_updated:
        with open(cache_path, "w") as f:
            json.dump(tag_cache, f, indent=2)
    # Sort papers by reverse chronological order
    papers.sort(key=lambda p: p["sort_year"], reverse=True)
    template = jinja_env.get_template("research.html")
    html = template.render(papers=papers, title="Research")
    with open(os.path.join(OUTPUT_DIR, "research.html"), "w") as f:
        f.write(html)


def render_blog_index():
    posts = []
    tags_set = set()
    for fname in sorted(os.listdir(BLOG_DIR), reverse=True):
        if fname.endswith(".md"):
            with open(os.path.join(BLOG_DIR, fname)) as f:
                lines = f.readlines()
            meta = {}
            if lines[0].strip() == "---":
                i = 1
                while i < len(lines) and lines[i].strip() != "---":
                    line = lines[i].strip()
                    if ":" in line:
                        key, val = line.split(":", 1)
                        meta[key.strip()] = val.strip()
                    i += 1
                meta["tags"] = meta.get("tags", "").split(",")
                tags_set.update(meta["tags"])
                meta["filename"] = f"blog/{fname.replace('.md', '.html')}"
                meta["date"] = fname[:10]
                posts.append(meta)
    template = jinja_env.get_template("blog_index.html")
    html = template.render(posts=posts, tags=sorted(tags_set), title="Blog")
    with open(os.path.join(BLOG_DIR, "index.html"), "w") as f:
        f.write(html)


def render_blog_posts():
    for fname in os.listdir(BLOG_DIR):
        if fname.endswith(".md"):
            with open(os.path.join(BLOG_DIR, fname)) as f:
                content = f.read()
            # Extract metadata
            if content.startswith("---"):
                parts = content.split("---", 2)
                meta = {}
                for line in parts[1].split("\n"):
                    if ":" in line:
                        key, val = line.split(":", 1)
                        meta[key.strip()] = val.strip()
                meta["tags"] = meta.get("tags", "").split(",")
                html_content = markdown(parts[2])
            else:
                meta = {}
                html_content = markdown(content)
            template = jinja_env.get_template("base.html")
            html = template.render(
                title=meta.get("title", "Blog Post"), content=html_content
            )
            outname = fname.replace(".md", ".html")
            with open(os.path.join(BLOG_DIR, outname), "w") as f:
                f.write(html)


def render_news():
    news_path = os.path.join(DATA_DIR, "news.yaml")
    if os.path.exists(news_path):
        with open(news_path) as f:
            news = yaml.safe_load(f)
        events = news.get("events", [])
    else:
        events = []
    template = jinja_env.get_template("news.html")
    html = template.render(events=events, title="News & Events")
    with open(os.path.join(OUTPUT_DIR, "news.html"), "w") as f:
        f.write(html)


def main():
    render_about()
    render_members()
    render_research()
    render_blog_posts()
    render_blog_index()
    render_news()


if __name__ == "__main__":
    main()

# LUNAR Lab website

Site for the Language Understanding and Representation Lab at Brown.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Editing content

People, alumni, and publications are JSON files under `content/`. Each file is validated against the schemas in `lib/schemas/`. To check every content file before pushing:

```bash
npm run validate
```

Member photos live in `public/images/people/`.

## Publishing

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`), which serves [lunar.cs.brown.edu](https://lunar.cs.brown.edu).

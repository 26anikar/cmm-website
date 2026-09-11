# Caltech Math Meet

The Caltech Math Meet website, migrated from Wix to a responsive static site.

**Website:** https://26anikar.github.io/cmm-website/

## Update a page

Edit its HTML fragment in `content/pages/`, then commit to `main`. GitHub Actions builds, checks, and publishes the site automatically.

- Homepage: `content/pages/home.html`
- Registration: `content/pages/registration.html`
- Schedule: `content/pages/scheduling.html`
- An archive page: `content/pages/problems__cmm-2026-problems.html`
- Colors and layout: `public/assets/site.css`
- Navigation and shared header/footer: `scripts/build.mjs`
- Page list and site address: `content/site.json`
- PDFs: `public/_files/ugd/`
- Original images: `public/assets/images/`

Use internal links like `/registration/` and `/_files/ugd/example.pdf` in content. The build adds the GitHub project prefix automatically. For a new page, add its fragment and an entry in `content/site.json`.

## Preview locally

Install Node.js 24, then run:

```sh
npm ci
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4173/cmm-website/. After edits, run `npm run build` and refresh.

With Google Chrome installed, run `npm run test:browser` while the preview server is running. It checks every page at desktop and mobile widths, image decoding, JavaScript errors, and navigation.

Run `npm run test:slideshow` to check banner rotation, controls, responsive layout, reduced motion, and fallbacks. The three local banner images and controls are added by `scripts/home-slideshow.mjs`; the five-second interval and pause behavior are in `public/assets/site.js`. Both CSS and JavaScript URLs are versioned automatically at build time.

## Deployment

The workflow in `.github/workflows/pages.yml` publishes `dist/` with GitHub Actions. In repository **Settings → Pages**, the source is **GitHub Actions**. Check the **Actions** tab after a commit to see deployment progress.

All 35 pages and 176 PDFs are stored in the repository. The build does not fetch anything from Wix. Original images are preserved and small WebP versions are generated for the website. Registration continues to use the existing external Google Form.

See [MIGRATION.md](MIGRATION.md) for the migration inventory and content needing review.
See [TYPOGRAPHY-AUDIT.md](TYPOGRAPHY-AUDIT.md) for the original-site comparison and typography corrections across all 35 pages.

## Custom domain later

The existing `caltechmathmeet.org` domain was not changed. If you later move it to GitHub Pages, configure it in repository Pages settings, update DNS at your domain provider, change `content/site.json`'s `url`, and set `BASE_PATH` to an empty string in the build and check workflow steps. Check [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) before changing DNS.

## Migration utilities

`scripts/crawl.mjs`, `scripts/inspect-browser.mjs`, and `scripts/import.mjs` were used for the initial import. They are **not** part of routine editing or deployment. Re-running the importer overwrites content fragments, so preserve any later edits first. Raw Wix responses and screenshots are ignored in `.cache/`.

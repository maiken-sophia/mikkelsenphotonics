# mikkelsenphotonics.com

Source for the Mikkelsen Photonics group website (Niels Bohr Institute, University of Copenhagen).
Built with [Astro](https://astro.build), plain CSS, and Markdown/YAML content. No frameworks, no database.

## How the site is organised

```
src/
  content/
    research/      one Markdown file per research area (front page card + subpage)
    discoveries/   one file per "selected discovery" card
    people/        one file per group member
    news/          news items (the News page appears automatically once there are ≥3)
  pages/           the pages themselves (index, research, people, publications, join, contact)
  components/      header, footer, research card
  layouts/         the page shell (head, fonts, metadata)
  styles/          global.css — colours, type and spacing live here
  data/            publications.json (generated — do not edit by hand)
public/
  images/          all images (JPEG, web-sized)
  cv.pdf           add Maiken's CV here (linked from the People page)
publications.bib   the bibliography; `npm run bib` turns it into src/data/publications.json
scripts/           the BibTeX converter
```

## Editing content (no build tools needed)

Every routine change is a text edit in `src/content/` — you can do it in GitHub's web editor and the site rebuilds itself.

- **Add a person:** copy `src/content/people/maiken-mikkelsen.md`, change the fields, drop a photo in `public/images/`.
- **Add a news item:** create `src/content/news/2026-11-01-some-title.md` with `title`, `date`, and optionally `url` in the front matter. The News page and nav link appear once there are three items (see `Header.astro` / `pages` to enable).
- **Add a paper:** paste the BibTeX into `publications.bib`. The Publications page and the "Key papers" lists on research pages are generated from it. To feature a paper on a research subpage, add its BibTeX key to that area's `keyPapers:` list.
- **Change research text:** edit the Markdown body of the file in `src/content/research/`. The `summary:` field is the two-sentence blurb on the front page; the body is the subpage.
- **Swap an image:** replace the file in `public/images/` (keep the name) or change the `image:` path in the content file.

`publications.bib` contains the group's 55 publications; all but one book chapter have DOIs (merged from ORCID in September 2026). When adding a paper, include a `doi = {...}` field so the "DOI" link appears.

- **Add a journal cover:** put the image in `public/images/covers/` (3:4, about 840 px wide) and add an entry to `src/data/covers.json`. The "On the cover" band on the front page and Publications page updates itself.
- **Add a new page:** also add its address to `public/sitemap.xml` (a plain list of the site's pages for search engines).
- **Share image:** `public/images/share.jpg` (1200 × 630) is what LinkedIn, Slack etc. show when the site is linked.

## Running locally (for design changes)

Requires Node.js 20 or newer.

```
npm install
npm run dev        # http://localhost:4321
npm run build      # generates dist/
```

`npm run build` runs the BibTeX conversion first, then Astro.

## Deploying (GitHub → Cloudflare)

1. Create a **public** GitHub repository and push this folder.
2. In Cloudflare: Workers & Pages → Create → connect the repository.
   Build command: `npm run build` · Output directory: `dist` · Node version: 20.
3. Add the custom domain `mikkelsenphotonics.com` in the project's settings (and `www`, redirected to the apex). If the domain's DNS is at Cloudflare this is one click; otherwise point the domain's CNAME at the `*.pages.dev` address Cloudflare gives you.
4. Set up `maikenmikkelsen.com` as a redirect to `https://mikkelsenphotonics.com` at its registrar.

Every push to `main` deploys in about a minute; every previous version stays available in the Cloudflare dashboard.

## Optional: a form-based editor

If you'd rather not edit Markdown at all, add [Keystatic](https://keystatic.com) or [Decap CMS](https://decapcms.org) — both give a web form that writes these same files. Not needed to start.

## Design notes

- Colours and type are CSS variables in `src/styles/global.css`. The accent is a deep red used only for labels, the primary button, and link underlines.
- Light and dark mode both work; dark follows the visitor's system setting.
- Fonts load from Google Fonts (IBM Plex Sans). To self-host instead, put the woff2 files in `public/fonts/` and replace the `<link>` in `Base.astro` with an `@font-face`.
- Images should be JPEG or WebP, ≤1400 px wide for full-width, ≤900 px for cards. Cite the paper in the `imageCredit` field when a figure is reused.

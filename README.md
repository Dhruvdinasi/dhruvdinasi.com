# dhruvdinasi.com

Personal website and portfolio of **Dhruv Dinasi** — served at [dhruvdinasi.com](https://dhruvdinasi.com), with [dhruvdinasi.in](https://dhruvdinasi.in) redirecting to it.

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion · Lucide · React Router 6.
Every page is **prerendered to static HTML at build time** (fast first paint, full content for search engines and link previews, works without JavaScript), then hydrated into a single-page app.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # lint + type-check + production build + link check
```

Requires Node.js 20+.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload (content is re-validated on every save) |
| `npm run content` | Validate `content/` and regenerate `src/content/generated.json` |
| `npm run build` | Validate content → type-check → client build → SSR build → prerender every route into `dist/` (+ `404.html`, `sitemap.xml`, `robots.txt`) |
| `npm run lint` | ESLint (TypeScript, React hooks, jsx-a11y), zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:links` | Checks every internal link, `#anchor`, `<title>`, description, canonical, single `<h1>` and image `alt` in `dist/` |
| `npm test` | All of the above |

> `vite preview` falls back to the home page for URLs without a trailing slash, which causes harmless hydration warnings locally. Vercel and Netlify serve `/about` → `about/index.html` correctly.

---

## Editing content

**Everything is editable at `/admin`** — a browser-based editor (Sveltia CMS) that saves to GitHub; Vercel then rebuilds automatically. Add certificates, projects and internships, change your bio, “Now” list, hobbies, headings, skills, achievements or the resume PDF without touching code.

→ **[docs/EDITING.md](docs/EDITING.md)** — one-time setup (a GitHub token, ~5 min) and how-tos.

Under the hood all content is JSON in **`content/`** (one file per certificate/project/experience entry, plus settings files). `scripts/build-content.ts` validates it against `src/content/schema.ts`, checks that referenced images and projects exist, measures images, builds the About-page timeline, and writes `src/content/generated.json`, which is all the site imports. A bad edit fails the build with a readable message, so it never reaches the live site.

The rule for all content: **describe what exists**. Planned work goes in a project’s *Planned improvements*; each case study has a *Source note* saying where its facts came from.

## Contact form (optional)

By default the contact page shows your email and links — **no form is rendered**, so there’s nothing that looks like it works but doesn’t.

To enable a real form with [Formspree](https://formspree.io) (free tier, no backend, no secrets):

1. Create a form at formspree.io and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In your host’s environment variables, set `VITE_CONTACT_ENDPOINT` to that URL (see `.env.example`), and redeploy.

The form has client-side validation, a honeypot field, loading/success/error states, and falls back to your email on failure. The endpoint URL is public by design — it isn’t a secret. If you use a provider other than Formspree, add its domain to `connect-src` and `form-action` in the Content-Security-Policy in `vercel.json` / `netlify.toml`.

---

## Deploying (Vercel — recommended)

`vercel.json` is already configured: build command, clean URLs, security headers, long-term caching for hashed assets, and **301 redirects from `dhruvdinasi.in`, `www.dhruvdinasi.in` and `www.dhruvdinasi.com` to `https://dhruvdinasi.com`**.

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/Dhruvdinasi/dhruvdinasi.com.git
   git push -u origin main
   ```
2. **Import into Vercel** — vercel.com → Add New → Project → pick the repo. Framework preset: *Vite*. Vercel reads `vercel.json`; no other settings needed. You get a `*.vercel.app` URL — check it before touching DNS.
3. **Add all four domains** — Project → Settings → Domains, add:
   `dhruvdinasi.com`, `www.dhruvdinasi.com`, `dhruvdinasi.in`, `www.dhruvdinasi.in`.
   Mark **`dhruvdinasi.com`** as the primary. (You can also set the other three to “Redirect to dhruvdinasi.com” in this screen — it matches what `vercel.json` does.)
4. **Configure DNS at each registrar** (Vercel shows the exact values for your account — use those if they differ):

   | Domain | Type | Name | Value |
   | --- | --- | --- | --- |
   | dhruvdinasi.com | A | `@` | `76.76.21.21` |
   | dhruvdinasi.com | CNAME | `www` | `cname.vercel-dns.com` |
   | dhruvdinasi.in | A | `@` | `76.76.21.21` |
   | dhruvdinasi.in | CNAME | `www` | `cname.vercel-dns.com` |

   Remove any old A/AAAA/CNAME records for those names (e.g. registrar parking pages). Alternatively, point each domain’s nameservers at Vercel.
5. **HTTPS** — Vercel issues certificates automatically once DNS resolves (minutes to a few hours). HSTS is set in `vercel.json`.
6. **(Optional) Contact form** — set `VITE_CONTACT_ENDPOINT` under Settings → Environment Variables, then redeploy.
7. **Set up the editor** — create a GitHub token and sign in at `/admin` ([docs/EDITING.md](docs/EDITING.md)).

### Netlify instead

`netlify.toml` contains the same build, redirects and headers. Import the repo in Netlify, add `dhruvdinasi.com` as the primary domain and `dhruvdinasi.in` (+ `www` variants) as domain aliases, then follow Netlify’s DNS instructions. Don’t deploy to both hosts.

### Verify the live site

```bash
curl -sI https://dhruvdinasi.in/projects | grep -iE "^(HTTP|location)"      # 301 → https://dhruvdinasi.com/projects
curl -sI http://dhruvdinasi.com | grep -iE "^(HTTP|location)"               # redirect to https
curl -sI https://dhruvdinasi.com/nope | head -1                             # 404
curl -s  https://dhruvdinasi.com/sitemap.xml | head
```

Then:
- Paste `https://dhruvdinasi.com` into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to check the preview card.
- Add the domain to [Google Search Console](https://search.google.com/search-console) (DNS verification) and submit `https://dhruvdinasi.com/sitemap.xml`.
- Run [PageSpeed Insights](https://pagespeed.web.dev/) against the live URL.

---

## Project structure

```
content/                ← all editable content (JSON) — edited at /admin
public/                 static files (resume PDF, certificate images, screenshots, icons, og.png)
  admin/                the /admin editor (self-hosted Sveltia CMS + config.yml)
scripts/
  build-content.ts      validates content/ and writes src/content/generated.json
  prerender.ts          renders each route to dist/<route>/index.html, writes 404/sitemap/robots
  check-links.ts        post-build link & metadata checker
  assets/               OG image template + renderer
src/
  content/              schema.ts (field rules), index.ts (loader), constants.ts
  components/           Layout (nav, footer), Hero, Motif artwork, ProjectCard, diagram, ThemeToggle
  pages/                Home, About, Projects, ProjectCaseStudy, Resume, Certifications, Contact, NotFound
  lib/hooks.ts          scroll reveal, document meta, scroll restoration, reduced motion
  seo.ts                per-route titles, descriptions, canonical, Open Graph, JSON-LD
  entry-server.tsx      SSR entry used by the prerenderer
  main.tsx              client entry (hydrates prerendered HTML)
vercel.json / netlify.toml   hosting, redirects, headers
```

## Accessibility & performance notes

- Semantic landmarks, skip link, one `<h1>` per page, visible focus rings, 44 px touch targets.
- Rotating hero headline: full sentence available to screen readers; pause button; static when `prefers-reduced-motion` is set.
- Scroll reveals are progressive enhancement — content is visible without JavaScript and with reduced motion.
- Fonts are self-hosted (no third-party requests) and the two above-the-fold fonts are preloaded.
- No analytics or tracking scripts.

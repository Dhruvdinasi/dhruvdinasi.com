# Testing report — 11 Oct 2026 (updated after the /admin editor was added)

All results below were measured on the production build (`npm run build`), served locally by a static server configured like Vercel (clean URLs, `404.html`, gzip). Nothing here was measured on the live domain, which isn’t deployed yet — re-run Lighthouse / PageSpeed Insights after deploying.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run lint` (ESLint + jsx-a11y, 0 warnings allowed) | ✅ pass |
| `npm run typecheck` (strict TypeScript) | ✅ pass |
| `npm run build` (client + SSR + prerender of 10 routes + 404) | ✅ pass |
| `npm run check:links` — 11 HTML pages: internal links, `#anchors`, title, description, canonical, single `<h1>`, `img alt` | ✅ 0 problems |

## Browser checks (Chromium via Playwright)

Every route was loaded at **1440×900** and **390×844** (22 page loads):

- ✅ No JavaScript errors or React hydration errors on any page
- ✅ No horizontal scrolling on mobile
- ✅ Correct `<title>` per page; unknown URLs return HTTP 404 with the custom 404 page

Interaction tests — **28 / 28 passed**:

| Area | Checks |
| --- | --- |
| Theme | Dark by default · toggle to light · persists after reload |
| Hero | Headline rotates · pause button stops it · full sentence in accessible name |
| Navigation | Client-side nav updates title and canonical · project card opens its case study |
| Project filter | “Computer vision” shows 1 card · `aria-pressed` set · “All” restores 4 visible cards |
| Certificates | Lightbox opens as modal · Escape closes · focus returns to the card |
| Resume | PDF served as `application/pdf` (90,590 bytes, the original file) · Download button saves `Dhruv-Dinasi-Resume.pdf` |
| Contact | No form rendered without an endpoint · `mailto:` present |
| Keyboard | First Tab focuses “Skip to content” |
| Mobile menu | Opens · Escape closes · link navigates and closes it |
| Reduced motion | Headline static · reveal content fully visible |
| No JavaScript | Case-study content present and visible |

Contact form, tested separately with `VITE_CONTACT_ENDPOINT` pointing at a mock server:

- ✅ Empty submit shows three inline errors and focuses the first invalid field
- ✅ Valid submit POSTs JSON `{name, email, message}` and shows the success state
- ✅ Server error (HTTP 500) shows an alert with the email fallback

## Content editing (/admin)

| Check | Result |
| --- | --- |
| `/admin` loads the editor with the site config — 0 configuration warnings or errors | ✅ |
| Sign-in options offered: GitHub, access token, local repository | ✅ |
| Simulated editor save of a **new certificate** (blank optional fields saved as `""`, as the editor does) → appears on /certifications, /resume and the About timeline | ✅ |
| Simulated **new project** with only required fields → page prerendered, empty sections hidden, added to sitemap | ✅ |
| **Invalid edit** (empty title, wrong date format, unknown group, URL without https) → build fails listing all 4 problems by file and field | ✅ |
| Validator library (zod) absent from the browser bundle | ✅ |
| Signing in to GitHub and saving through the live editor | ⚠️ not testable here (needs your GitHub account) — do one test save after setup |

After the change, `npm test` and the 28 interaction checks were re-run: all pass, 0 console errors. Lighthouse mobile: `/` 96, `/projects/cinemeta` 95, `/certifications` 95 — accessibility, best practices and SEO 100, CLS 0.

## Lighthouse 12 (simulated throttling)

| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Mobile | 96 | 100 | 100 | 100 | 2.3 s | 0 |
| `/about` | Mobile | 96 | 100 | 100 | 100 | 2.4 s | 0 |
| `/projects/smart-energy-meter` | Mobile | 92 | 100 | 100 | 100 | 2.9 s | 0 |
| `/certifications` | Mobile | 98 | 100 | 100 | 100 | 2.1 s | 0 |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 |
| `/projects/smart-energy-meter` | Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 |
| `/certifications` | Desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 |

Scores come from a local server; numbers on the live CDN will differ. The first run scored mobile performance 73–82 — fixed by preloading the two above-the-fold fonts (and measuring with gzip, as the hosts serve it) — and flagged one `label-content-name-mismatch` on the home link, also fixed.

Page weight (gzip): 250–353 KB including fonts and images.

## Not tested here

- Live DNS, HTTPS and the `.in` → `.com` redirects (need the deployed site — commands in README).
- External links: GitHub repos for CrowdX, Smart-Energy-Meter and AI-Travel-Planner were confirmed to exist by cloning them. LinkedIn and the Streamlit demo couldn’t be fetched from the build machine — click them once after deploying.
- Safari and Firefox (only Chromium was automated).
- A screen reader pass (structure was checked with jsx-a11y and Lighthouse only).

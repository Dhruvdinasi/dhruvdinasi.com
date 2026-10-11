# Editing your site

Everything on the site — certificates, projects, experience, your bio, the “Now” list, skills, achievements, page headings, the resume page and the resume PDF — can be changed at **dhruvdinasi.com/admin**, with no code.

```
You edit at /admin  →  saved as a JSON file in GitHub (content/…)  →  Vercel rebuilds (~1 min)  →  live
```

If an edit breaks a rule (say, an empty title or a date in the wrong format), the rebuild stops and **the previous version of the site stays live**. Vercel shows the exact problem, e.g.
`content/certifications/x.json → date: Use YYYY-MM-DD`.

---

## One-time setup (5 minutes)

Do this after the site is on GitHub and Vercel (see README → Deploying).

1. **Check the repo name.** Open `public/admin/config.yml` and make sure `repo:` matches your GitHub repository (default `Dhruvdinasi/dhruvdinasi.com`). Commit if you change it.
2. **Create a GitHub access token** — the key the editor uses to save to your repo:
   - GitHub → your avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - **Repository access:** *Only select repositories* → your site repo.
   - **Permissions → Repository permissions → Contents:** *Read and write*.
   - Expiration: up to a year. Copy the token (starts with `github_pat_`).
3. Open **https://dhruvdinasi.com/admin** → **Sign In Using Access Token** → paste it.

The token is stored only in that browser. Use it on your own devices only; if you lose one, delete the token on GitHub and make a new one.

> “Sign In with GitHub” (the button) needs a small extra login service; the token method does the same job without one. See the Sveltia CMS docs if you ever want the button.

---

## Adding a new certificate

1. **/admin → Certifications → New Certification.**
2. Fill in **Title**, **Issuer**, **Date issued** and **Group** (AI & data, Software engineering, Cloud, Security or Internship).
3. **Certificate image** — upload a PNG/JPG/WebP. If you only have a PDF, take a screenshot of it (or export page 1 as an image). This is what visitors see. 
4. Optional: attach the **PDF**, add **Topics**, a **Credential ID**, and a **Verification link** (`https://…`).
5. Turn on **Show on resume page** if you want it listed there.
6. **Save.** About a minute later it appears on `/certifications` (newest first) and in the About-page timeline.

To take one down without deleting it, turn on **Hide from the site**.

## Adding an internship or job

**/admin → Experience → New.** Fill in role, organisation, dates (`YYYY-MM`; leave *End* empty if it’s ongoing), a summary and “What I did” points. Link its certificate if you have one. It shows on the resume page, the home page strip (the entry with the lowest *Order*), and the timeline.

## Adding a project

**/admin → Projects → New Project.** Only the basics are required: title, one-line summary, dates, context, overview. Every case-study section you leave empty is hidden. Turn on **Feature on home page** to put it in Selected Work, or turn off **Has a full case-study page** for a small project. Upload screenshots under **Screenshots**.

The project’s URL is created from its title the first time you save (e.g. “PDF2LEARN” → `/projects/pdf2learn`) and doesn’t change if you rename it later.

## Other common edits

| I want to change… | Go to |
| --- | --- |
| The “Now” list | Site settings → About page & Now |
| Hobbies / Beyond code | Site settings → About page & Now → Interests |
| The rotating headline words | Site settings → Home page → Rotating words |
| Headings on any page | Site settings → Page headings (or Home page / About page) |
| The downloadable resume | Site settings → Profile, links & SEO → Resume PDF (upload) and *Resume last updated* |
| Education, resume summary, skills table | Site settings → Resume page |
| Skill groups on About / Home | Site settings → Skills |
| Cricket and other achievements | Site settings → Achievements |
| Email, LinkedIn, graduation year | Site settings → Profile, links & SEO |

**Italic accent words:** in any headline, wrap words in asterisks — `Projects, *explained.*` — to get the blue italic style.

---

## Editing without GitHub (on your laptop)

1. `npm run dev`
2. In Chrome or Edge, open `http://localhost:5173/admin` → **Work with Local Repository** → select the project folder.
3. Edits save straight into `content/`, and the preview at `http://localhost:5173` updates as you go.
4. Commit and push when you’re happy — Vercel publishes it.

## Editing the files directly

Everything lives in `content/` as plain JSON (one file per certificate, project and experience entry). `npm run content` checks it; `npm run dev` re-checks on every save.

| Path | Holds |
| --- | --- |
| `content/certifications/*.json` | One certificate per file |
| `content/projects/*.json` | One project per file (file name = URL) |
| `content/experience/*.json` | One internship/job per file |
| `content/site.json` | Name, links, email, college, graduation, resume PDF |
| `content/home.json` · `about.json` · `pages.json` | Page copy |
| `content/achievements.json` · `skills.json` · `resume.json` | Lists |

Images go in `public/` (`public/certs`, `public/projects/…`, `public/uploads`) and are referenced from the JSON as `/certs/name.webp` etc.

The timeline on the About page is generated from all of the above, so it never needs editing.

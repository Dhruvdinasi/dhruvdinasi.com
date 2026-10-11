# Content audit & open items

Sources: `DHRUV_RESUME 7.pdf`, eight certificate PDFs, and the public repos CINEMETA, CrowdX, Smart-Energy-Meter and AI-Travel-Planner. Everything on the site traces to one of these or to what you told me.

## Resolved (11 Oct 2026)

- **CINEMETA** — case study rewritten from the code (`backend/ml`, `server.ts`), with GitHub link.
- **Graduation year** — 2027 (expected), shown on About, Resume and Contact.
- **Photo** — none, by choice.
- **Agentic AI Saksham** — it’s a *project-based Applied AI Residency Internship* with Capabl (2 months, certificate CPBL26PI959, issued 18 Sep 2026). Added as both **Experience** and a certificate; it replaces the old “Agentic AI Fellowship” line.
- **Editing** — the whole site is now editable at `/admin` (see `docs/EDITING.md`).

## Please send or fill in (all editable at /admin)

| # | Item | Where |
| --- | --- | --- |
| 1 | **What you built in the Capabl internship** — 2–4 bullet points, and start month if you know it. The entry currently has only the certificate’s wording. | Experience → Applied AI Residency Intern → *What I did* |
| 2 | **Hobbies** beyond cricket, if any. | Site settings → About page & Now → Interests |
| 3 | **Screenshots** for CINEMETA, CrowdX and AI Travel Planner. | Projects → *Screenshots* |
| 4 | Certificates for **Microsoft Azure Fundamentals** and **Data Structures and Algorithms** (still listed under “Other credentials”). | Certifications → open each → upload image |
| 5 | Click the **Streamlit demo** link once after deploying — the build machine couldn’t reach it. | — |

## Left out on purpose

- **OCI GenAI Professional, Cisco Networking Basics, DSA in C++, PDF2LEARN** — no evidence yet. Add through /admin when you have it.
- **C++, Docker** in the skills list — not in the resume. (CINEMETA ships a Dockerfile, so you could reasonably add Docker now.)
- **Phone number** — on the resume PDF but not on any web page.
- **CINEMETA evaluation numbers** — see below.

## Where the README / resume and the code disagree

The site follows the code. Worth fixing at the source, since recruiters may read both.

**CINEMETA (README)**

| README says | Code shows | Site says |
| --- | --- | --- |
| Meta-learning controller switching between content-based and **matrix factorisation** (80/20, 55/45, 65/35) | One content/preference-based hybrid ranker; stage weights are hand-set per stage (e.g. content similarity 14% → 28% → 36%). No matrix-factorisation model; the “collaborative” endpoint calls the same engine with a different label | Stage-adaptive hybrid; MF listed as a planned improvement |
| Stage thresholds N ≤ 2, 3–6, > 6 seed films | `< 2`, `2–7`, `≥ 8` signals, counting seed films *plus* favourite genres | Code’s thresholds |
| Precision@K, NDCG etc. as evaluation | Computed against a heuristic relevance rule derived from the same signals; returns hard-coded 0.94/0.92… when the list is empty | Module described; no numbers quoted |

**CrowdX (resume)**

| Resume says | Code shows | Site says |
| --- | --- | --- |
| DeepSORT tracking | Per-frame index in `core/tracker.py` | Per-frame counting; DeepSORT planned |
| Linear-regression trend engine | Two-point slope over a 10 s window | Growth rate + 10 s projection |
| FastAPI | Flask + Flask-SocketIO | Flask + Socket.IO |

**AI Travel Planner (brief)** — no Groq or Geoapify calls in the repo; itineraries come from a local `buildPlan()`. Listed as planned.

The web resume uses code-accurate wording; the PDF is unchanged — upload a corrected one at /admin when ready.

## Things I noticed in your repos (not on the site)

- **CrowdX publishes four phone numbers** (`alerts/alert_manager.py`), including yours. Move them to `.env` and scrub git history.
- **CrowdX confidence filter bug** — `server.py` filters on `d[-1]`, which is the box height, not the detection score.
- **CrowdX** `SIM_MODE = True` by default; `winsound` makes it Windows-only.
- **CINEMETA has a fallback JWT secret** in `backend/security/auth.ts` (and an example secret in the README). If `JWT_SECRET` is unset in production, anyone who reads the repo can forge logins. Make the server refuse to start without it.

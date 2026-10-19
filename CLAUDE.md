# THIS REPOSITORY IS BOOKBUG HM — NOT BOOKBUG

> **You are editing Bookbug HM**, the Horace Mann copy of Bookbug.
> - Repository: `jakegoldwasser-hm/bookbug-hm` (Jake's school GitHub account, `jakegoldwasser-hm`). Local checkout: `~/code/bookbug-hm`.
> - Live site: https://jakegoldwasser-hm.github.io/bookbug-hm/ (BETA, @horacemann.org accounts only).
>
> **Regular Bookbug is a different product** in a different repository: `jakegoldwasser/jake-goldwasser-2026`
> (folder `bookbug/`, live at jake-goldwasser.com/bookbug). A change Jake asks for "in Bookbug HM" goes
> **here** and must not change regular Bookbug. A change asked for "in Bookbug" goes **there**, and reaches
> Bookbug HM the next morning through the daily sync.
>
> Before every change, say which product it is for. If Jake's request doesn't say, ask.

## What belongs to Bookbug HM alone (edit these here)

- `hm.sh` — turns Bookbug's page into Bookbug HM's (the Horace Mann shield and BETA after the wordmark, its own
  Terms and Privacy links, site files served from here, Horace Mann-only sign-in, and the administrators' script).
  **All HM differences in `index.html` go through `hm.sh`.**
- `admin.html` — the administrator view (read-only access to every book written in Bookbug HM).
- `hm-admin.js` — puts "Administrator" at the top of the page for administrators, linking to `admin.html`.
- `hm-shield.svg` (Horace Mann's lion shield, shown in place of "HM" after the wordmark), `privacy.html`,
  `terms.html`, `README.md`, this file, `.github/workflows/sync.yml`.

## What is NOT edited here

- `index.html` — rebuilt every morning from Bookbug's `bookbug/index.html` by the "Sync from Bookbug" action.
  Hand edits are overwritten. Change `hm.sh` instead (or change Bookbug in the main repository).
- `cloud-sync-backend/` — copied from the main repository by the same action, for reference. Bookbug's fonts,
  `vendor/` scripts, picture-book template, icons and `selection-highlight.js` are copied straight into the
  published site, not kept here.
- The server (`chapbook-builder-api` Lambda, `ChapbookBuilderUsers` and `BookbugImages` tables, Jake's AWS account)
  is **shared by Bookbug and Bookbug HM**: edit `cloud-sync-backend/index.mjs` in `jakegoldwasser/jake-goldwasser-2026`,
  and Jake deploys it. A request from this page's origin (`https://jakegoldwasser-hm.github.io`) is Bookbug HM's:
  @horacemann.org only, and its books are stored under `hm#<sub>`, apart from the same person's Bookbug books.
  A server change for Bookbug HM only must be fenced the same way.

## Administrators (Bookbug HM only)

- Primary administrator: `cassandra_parets@horacemann.org` (`HM_PRIMARY_ADMINS` in the server). She adds or removes
  other administrators (only @horacemann.org addresses) on `admin.html` → Administrators. Bookbug HM's list is its
  own, separate from Luddite HM's.
- **Jake must not be able to see Bookbug HM's books.** `jake_goldwasser@horacemann.org` is in `HM_ADMIN_MANAGERS`:
  he can add and remove administrators, and nothing else (no books, no access log). Never add a way for Jake to read
  Horace Mann students' or teachers' books. The data is still in Jake's own AWS account; the real fix is moving
  Bookbug HM to a server in an AWS account Horace Mann owns.
- Administrators can **read** every book written in Bookbug HM (every type, on Home, archived or recently deleted,
  with comments and pictures); they can't change anything. Every book opened is logged (`admin.html` → Access log).
- Server side: `routeHmAdmin` (`/hm-admin/*`) in `cloud-sync-backend/index.mjs`. It answers only requests from
  `https://jakegoldwasser-hm.github.io` (the Origin header), only for administrators, and only about `hm#` items,
  so regular Bookbug is unaffected.
- The Privacy Policy and Terms describe this access. Keep them true if it changes.

## Pushing

This Mac's saved GitHub sign-in is Jake's personal account (`jakegoldwasser`), which can't push here. Changes go up
through GitHub's web upload in Chrome, signed in as `jakegoldwasser-hm`, or with that account's own credentials.
A push runs the sync action, which rebuilds and publishes the site.

## Words

Use Bookbug's words (see the main repository's CLAUDE.md): **Bookbug** (one capital B), **book type**, **poem**,
**chapter**, **spread**, **illustration**, **cartoon batch**, **comic**, **archive**, **Recently deleted**, **Home**.

# Bookbug HM

Bookbug for Horace Mann, served by GitHub Pages at
https://jakegoldwasser-hm.github.io/bookbug-hm/

It is a copy of Bookbug from Jake's site (jake-goldwasser.com/bookbug, repository
jakegoldwasser/jake-goldwasser-2026), in beta, for @horacemann.org accounts only.

**Don't edit `index.html` here.** Five times a day (6:15 and 9:15 a.m., 12:15, 3:15 and 7:15 p.m. New York) the "Sync from Bookbug" action
(`.github/workflows/sync.yml`) fetches Bookbug's newest page and rebuilds `index.html`
from it with `hm.sh`, which holds every Bookbug HM difference (the Horace Mann shield
and BETA after the wordmark, its own Terms and Privacy links, the Horace Mann-only
sign-in, and the administrators' link). Change Bookbug in the main repository, or
change `hm.sh` here. If a Bookbug change stops `hm.sh` from fitting, the action fails
and the live site stays as it was. To sync at once: Actions -> Sync from Bookbug ->
Run workflow.

The page's fonts (`fonts/`), scripts (`vendor/`), the picture-book template and the
icons aren't kept here: the action copies them from the main repository into the
published site each time.

`privacy.html`, `terms.html`, `admin.html` (the administrator view), `hm-admin.js` (the
"Administrator" link at the top of the page for administrators) and `hm-shield.svg`
(Horace Mann's lion shield) are Bookbug HM's own and are not synced. See `CLAUDE.md`
for what Bookbug HM's administrators can see.

The page talks to the same server as Bookbug (the `chapbook-builder-api` Lambda on
Jake's AWS), but Bookbug HM's books are stored apart from Bookbug's, so the two never
mix. `cloud-sync-backend/` is a copy of that server's code, kept for reference. Deploy
server changes from the main repository, not from here.

For sign-in and Drive import to work from this address, three settings must list
`https://jakegoldwasser-hm.github.io`:

1. AWS Lambda `chapbook-builder-api` -> Configuration -> Function URL -> CORS -> Allow origin.
2. Google Cloud project `chapbook-builder` -> APIs & Services -> Credentials -> the web
   client ("Chapbook Builder Web") -> Authorized JavaScript origins.
3. The same project's API key (Picker) -> Website restrictions:
   `https://jakegoldwasser-hm.github.io/*`.

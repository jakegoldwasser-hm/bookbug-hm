#!/usr/bin/env bash
# Turns Bookbug's page (bookbug/index.html in jakegoldwasser/jake-goldwasser-2026)
# into Bookbug HM's: the name with the Horace Mann shield and BETA, its own Terms and Privacy pages,
# the site files it needs served from here, sign-in only for @horacemann.org
# accounts, and the administrators' link (hm-admin.js).
# Usage: ./hm.sh bookbug.html > index.html
# Stops with an error if Bookbug has changed so that a step no longer fits,
# so the sync never publishes a page that isn't Bookbug HM's.
set -euo pipefail
src="$1"
tmp="$(mktemp)"
cp "$src" "$tmp"

step() { # step <name> <perl substitution>
  before="$(shasum < "$tmp")"
  perl -0pi -e "$2" "$tmp"
  if [ "$before" = "$(shasum < "$tmp")" ]; then echo "hm.sh: step '$1' no longer fits Bookbug's page" >&2; exit 1; fi
}

step title       's#<title>Bookbug[^<]*</title>#<title>Bookbug HM</title>#'
step reader-title 's#\x27 · Bookbug\x27;#\x27 · Bookbug HM\x27;#'
# The wordmark: "bookbug", then Horace Mann's shield (hm-shield.svg) and a small BETA. The g's second antenna
# was drawn on the h1's last child, which is now the BETA tag, so it's
# pointed at the g itself (the seventh letter).
step wordmark    's#(<span class="c4">g</span>)</h1>#$1<img class="hm" src="hm-shield.svg" alt="HM"><small class="beta">BETA</small></h1>#g'
step g-antenna   's#h1\.appname span:last-child#h1.appname span:nth-child(7)#g'
step hm-style    's#(\n  \.signin-gate-card h1\.appname \{[^\n]*)#$1\n  h1.appname .hm { height: .8em; width: auto; vertical-align: baseline; margin-left: .3em; }\n  h1.appname .beta { font: 600 .22em/1 "Work Sans", system-ui, sans-serif; letter-spacing: .08em; color: var(--ink-soft); vertical-align: super; margin-left: .35em; }#'
# Files that Bookbug takes from the rest of jake-goldwasser.com are served
# from here (the sync copies them), or linked there.
step favicon     's#href="\.\./(favicon|apple-touch-icon)#href="$1#g'
step highlight   's#src="/selection-highlight\.js#src="selection-highlight.js#'
step terms       's#href="\.\./terms\.html"#href="terms.html"#g'
step storyplotter 's#href="\.\./storyplotter/"#href="https://jake-goldwasser.com/storyplotter/"#g'
# Google's account chooser offers Horace Mann accounts first...
step hd-hint     's#(use_fedcm_for_prompt: true, itp_support: true)#$1, hd: \x27horacemann.org\x27#'
step gate-note   's#<p>Sign in with Google to start\.#<p id="hmGateNote">Sign in with your Horace Mann Google account to start.#'
# ...and anyone else is signed straight back out.
step hm-only     's#(\n(\s*)googleUserEmail = payload\.email \|\| \x27your account\x27;\n)#$1$2if (!/\@horacemann\\.org\$/i.test(payload.email || \x27\x27)) { signOut(); document.getElementById(\x27hmGateNote\x27).textContent = \x27Bookbug HM is only for Horace Mann accounts. Sign in with your \@horacemann.org address.\x27; return; }\n#'

# Horace Mann administrators get "Administrator" at the top, linking to admin.html.
step hm-admin    's#</body>#<script src="hm-admin.js" defer></script>\n</body>#'

cat "$tmp"
rm -f "$tmp"

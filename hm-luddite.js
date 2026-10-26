// Bookbug HM only (not part of Bookbug). hm.sh adds this script to the page.
// Adds a "From Luddite HM" tab to the Bring in panel: a student brings in their
// own Luddite HM writing, one writing session at a time, either the whole file
// (every draft, oldest first, each its own entry) or the final draft only (the
// draft they marked final, else their latest). It uses the student's Luddite HM
// sign-in saved in this browser (same site, luddite.auth.v1) and Luddite's
// GET /luddite/mywork, which answers only Luddite HM's address and only with
// the student's own writing: never comments or grades. The one link between
// Luddite HM and Bookbug HM (Jake, 2026-10-26); regular Luddite and Bookbug
// stay unconnected.
(function () {
  'use strict';
  var API = 'https://2zzmrvoptttg6stc5cfjdsz3za0cryjt.lambda-url.us-east-1.on.aws';
  var AUTH_KEY = 'luddite.auth.v1';
  var LUDDITE = '../luddite-hm/';

  function token() { try { return localStorage.getItem(AUTH_KEY); } catch (e) { return null; } }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function day(t) { return t ? new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : ''; }
  async function get(path) {
    var t = token();
    if (!t) throw new Error('signed_out');
    var r = await fetch(API + path, { headers: { Authorization: 'Bearer ' + t } });
    if (r.status === 401) throw new Error('signed_out');
    if (!r.ok) throw new Error('failed');
    return r.json();
  }
  // Luddite keeps bold and italic as **…** and *…*, as Bookbug does; underline
  // (__…__) has no place in Bookbug, and \ only escapes a literal * or _.
  function clean(text) {
    return String(text || '').replace(/\r/g, '').split('\n').map(function (line) {
      return line.replace(/__([^_]+)__/g, '$1').replace(/\\([\\*_])/g, '$1').replace(/^###/, '​###');
    }).join('\n').trim();
  }

  var src = {
    id: 'luddite',
    label: 'From Luddite HM',
    build: function (pane, tools) {
      pane.appendChild(el('div', 'hint-box', 'Bring in your own writing from Luddite HM. Pick a writing session, then bring in the whole file (every draft, each as its own entry) or just your final draft. Only your writing comes in, never your teacher’s comments.'));
      var status = el('div', 'status-line');
      var list = el('div', 'doc-list');
      list.style.marginTop = '10px';
      pane.appendChild(status);
      pane.appendChild(list);
      var setStatus = function (msg, bad) { status.textContent = msg || ''; status.style.color = bad ? 'var(--danger, #a33)' : ''; };
      var loadedFor = null;

      function signIn() {
        list.innerHTML = '';
        setStatus('');
        list.appendChild(el('div', 'status-line', 'To bring in your writing, sign in to Luddite HM in this browser with the same Horace Mann account, then come back here.'));
        var row = el('div', 'drive-choices');
        var open = el('button', 'btn btn-primary', 'Open Luddite HM');
        open.type = 'button';
        open.addEventListener('click', function () { window.open(LUDDITE, '_blank', 'noopener'); });
        var again = el('button', 'btn', 'I’ve signed in');
        again.type = 'button';
        again.addEventListener('click', function () { loadedFor = null; load(); });
        row.appendChild(open);
        row.appendChild(again);
        list.appendChild(row);
      }

      async function load() {
        var t = token();
        if (!t) { loadedFor = null; signIn(); return; }
        if (loadedFor === t) return;
        loadedFor = t;
        list.innerHTML = '';
        setStatus('Loading your writing sessions…');
        var data;
        try { data = await get('/luddite/mywork'); }
        catch (e) { loadedFor = null; if (e.message === 'signed_out') signIn(); else setStatus('Couldn’t reach Luddite HM. Try again in a moment.', true); return; }
        setStatus('');
        var sessions = data.sessions || [];
        if (!sessions.length) { list.appendChild(el('div', 'status-line', 'You haven’t written anything in Luddite HM yet.')); return; }
        sessions.forEach(function (s) { list.appendChild(sessionRow(s)); });
      }

      function sessionRow(s) {
        var box = el('div');
        var row = el('button', 'doc-row');
        row.type = 'button';
        row.appendChild(el('span', 'doc-title', s.title || 'Writing session'));
        row.appendChild(el('span', 'doc-meta', [s.teacherName, day(s.at), plural(s.words || 0, 'word', 'words'), s.drafts > 1 ? plural(s.drafts, 'draft', 'drafts') : ''].filter(Boolean).join(' · ')));
        var choices = el('div', 'drive-choices');
        choices.style.margin = '6px 0 4px';
        choices.hidden = true;
        var add = function (label, how) {
          var b = el('button', 'btn btn-sm', label);
          b.type = 'button';
          b.addEventListener('click', function () { bring(s, how, b); });
          choices.appendChild(b);
        };
        if (s.drafts > 1) { add('Whole file (' + plural(s.drafts, 'draft', 'drafts') + ')', 'all'); add('Final draft only', 'final'); }
        else add('Bring it in', 'final');
        row.addEventListener('click', function () { choices.hidden = !choices.hidden; });
        box.appendChild(row);
        box.appendChild(choices);
        return box;
      }

      async function bring(s, how, btn) {
        btn.disabled = true;
        setStatus('Bringing in “' + (s.title || 'your writing') + '”…');
        var d;
        try { d = await get('/luddite/mywork?code=' + encodeURIComponent(s.code)); }
        catch (e) { btn.disabled = false; if (e.message === 'signed_out') signIn(); else setStatus('Couldn’t bring that in. Try again.', true); return; }
        var title = d.title || s.title || 'Writing';
        var drafts = (d.drafts || []).filter(function (x) { return String(x.text || '').trim(); });
        if (!drafts.length) { btn.disabled = false; setStatus('There’s no writing in that session yet.', true); return; }
        var label = function (x) { return 'Draft ' + x.n + (x.name ? ' · ' + x.name : '') + (d.final === x.n ? ' · Final' : ''); };
        var text;
        if (how === 'all' && drafts.length > 1) {
          text = drafts.map(function (x) { return '### ' + title + ' · ' + label(x) + '\n\n' + clean(x.text); }).join('\n\n');
        } else {
          var pick = drafts.filter(function (x) { return x.n === d.final; })[0] || drafts[drafts.length - 1];
          text = '### ' + title + (d.drafts.length > 1 ? ' · ' + label(pick) : '') + '\n\n' + clean(pick.text);
        }
        try { await tools.importText(text, title, setStatus); }
        catch (e) { setStatus('Couldn’t bring that in. Try again.', true); }
        btn.disabled = false;
      }

      load();
      // Signing in to Luddite HM in another tab changes the saved sign-in; follow it.
      setInterval(function () { if (token() !== loadedFor) load(); }, 3000);
    }
  };

  window.bookbugImportTabs = (window.bookbugImportTabs || []).concat([src]);
  if (window.bookbugImportTab) window.bookbugImportTab(src);
})();

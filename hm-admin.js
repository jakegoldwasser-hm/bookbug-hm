// Bookbug HM only (not part of Bookbug). hm.sh adds this script to the page.
// For Horace Mann administrators it puts "Administrator" at the top of the
// page, linking to admin.html, where they can read every book written in
// Bookbug HM. Everyone else sees nothing: the server answers /hm-admin/me
// only for administrators.
(function () {
  'use strict';
  var API = 'https://lpf3k6atmbmhwch2e47tjqu6sy0qqdpv.lambda-url.us-east-1.on.aws';
  var AUTH_KEY = 'poetryBooklet.cloudAuth.v1'; // the page's own saved sign-in
  var checked = null, bar = null;

  function token() { try { return localStorage.getItem(AUTH_KEY); } catch (e) { return null; } }

  // For the administrator managers (Jake) only: a Horace Mann maroon frame round
  // the window and a tag at the foot, so this is never mistaken for Bookbug's
  // unforked original.
  var frame = null;
  function showFrame() {
    if (frame) return;
    var st = document.createElement('style');
    st.textContent =
      '.hm-frame { position: fixed; inset: 0; border: 6px solid #802629; pointer-events: none; z-index: 2147483646; }' +
      '.hm-frame-tag { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); z-index: 2147483647; pointer-events: none;' +
      ' background: #802629; color: #fff; font: 600 12px/1 system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; padding: 7px 16px; border-radius: 8px 8px 0 0; }' +
      '@media print { .hm-frame, .hm-frame-tag { display: none; } }';
    document.head.appendChild(st);
    frame = document.createElement('div');
    frame.className = 'hm-frame';
    var tag = document.createElement('div');
    tag.className = 'hm-frame-tag';
    tag.textContent = 'Horace Mann · Bookbug HM';
    frame.appendChild(tag);
    document.body.appendChild(frame);
  }
  function hideFrame() { if (frame) { frame.remove(); frame = null; } }

  function show(admin) {
    if (admin.manager) showFrame();
    if (bar) return;
    var style = document.createElement('style');
    style.textContent =
      '.hm-admin-bar { position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 9999;' +
      ' font: 600 12px/1 "Work Sans", system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase;' +
      ' background: #2B2118; color: #FAF6EC; padding: 6px 12px; border-radius: 0 0 8px 8px; text-decoration: none; }' +
      '.hm-admin-bar:hover { background: #4E6B3A; }' +
      '@media print { .hm-admin-bar { display: none; } }';
    document.head.appendChild(style);
    bar = document.createElement('a');
    bar.className = 'hm-admin-bar';
    bar.href = 'admin.html';
    bar.textContent = 'Administrator';
    bar.title = admin.manager ? 'Add or remove Bookbug HM administrators' : 'Open the administrator view';
    document.body.appendChild(bar);
  }
  function hide() { if (bar) { bar.remove(); bar = null; } hideFrame(); }

  function check() {
    var t = token();
    if (t === checked) return;
    checked = t;
    if (!t) { hide(); return; }
    fetch(API + '/hm-admin/me', { headers: { Authorization: 'Bearer ' + t } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (token() !== t) return; if (d && d.admin) show(d.admin); else hide(); })
      .catch(function () { checked = null; });
  }
  check();
  // Signing in or out changes the saved sign-in; follow it.
  setInterval(check, 3000);
})();

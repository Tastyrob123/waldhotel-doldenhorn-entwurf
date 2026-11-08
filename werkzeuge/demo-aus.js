// Vorschau statt Veröffentlichen (Robert 17.10.2026: «dass wir das erstmal ausstellen für die Demo … man kann es dann da einmal anschauen,
// kurz in der Vorschau»; danach «in allen»). Liegt nur in der Online-Fassung der Werkzeuge (werkzeuge_online.py hängt es an), lokal nie.
// Jeder Knopf «Veröffentlichen» bleibt sichtbar, ist aber blass und sagt beim Klick, dass er in der Vorschau aus ist. Die Server-Teile
// lehnen das Veröffentlichen online zusätzlich selbst ab (probe.py, carte.py), dieses Skript ist nur die sichtbare Seite davon.
(function () {
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
  var SATZ = 'In der Vorschau ist Veröffentlichen aus. Ansehen und ausprobieren geht, die Website bleibt, wie sie ist.';
  var css = document.createElement('style');
  css.textContent = '.demo-aus{opacity:.45!important;cursor:not-allowed!important}' +
    '.demo-aus-satz{position:fixed;left:50%;bottom:96px;z-index:2147483000;transform:translateX(-50%);max-width:min(460px,calc(100vw - 32px));padding:12px 18px;border-radius:14px;' +
    'background:#101c2c;color:#f1ece2;font:400 14px/1.45 system-ui,sans-serif;box-shadow:0 0 0 1px rgba(227,210,166,.5),0 18px 30px -12px rgba(0,0,0,.7);opacity:0;transition:opacity .25s;pointer-events:none}' +
    '.demo-aus-satz.da{opacity:1}';
  document.head.appendChild(css);
  function knopf(el) {
    var b = el && el.closest && el.closest('button,a,[role="button"]');
    return b && /Veröffentlichen/i.test(b.textContent || '') ? b : null;
  }
  function markiere() {
    document.querySelectorAll('button,a,[role="button"]').forEach(function (b) {
      if (/Veröffentlichen/i.test(b.textContent || '')) { b.classList.add('demo-aus'); b.setAttribute('title', SATZ); b.setAttribute('aria-disabled', 'true'); }
    });
  }
  // Anleitungen (Projektleitung 18.10.2026): oben eine Zeile, dass die Vorschau nichts veröffentlicht
  if (/anleitung/i.test(location.pathname)) {
    var zeile = function () {
      if (document.querySelector('.demo-aus-zeile')) return;
      var p = document.createElement('p'); p.className = 'demo-aus-zeile';
      p.textContent = 'Vorschau: Alles lässt sich ansehen und ausprobieren. Veröffentlicht wird nichts, die Website bleibt, wie sie ist.';
      document.body.insertBefore(p, document.body.firstChild);
    };
    /* Endprüfung 19.10.2026: in La Carte war die Zeile dunkel auf dunkel und nur 554 px breit (Seitenregeln für p): Farben und Breite fest */
    css.textContent += '.demo-aus-zeile{position:relative;z-index:50;display:block;box-sizing:border-box;width:100%!important;max-width:none!important;align-self:stretch;margin:0!important;padding:10px 16px!important;text-align:center;background:#101c2c!important;color:#f1ece2!important;font:400 13.5px/1.45 system-ui,sans-serif!important;border-bottom:1px solid rgba(227,210,166,.45)}';
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', zeile); else zeile();
  }
  var satz = null, weg = 0;
  function zeige() {
    if (!satz) { satz = document.createElement('div'); satz.className = 'demo-aus-satz'; satz.setAttribute('role', 'status'); satz.textContent = SATZ; document.body.appendChild(satz); }
    satz.classList.add('da'); clearTimeout(weg); weg = setTimeout(function () { satz.classList.remove('da'); }, 3600);
  }
  document.addEventListener('click', function (ev) {
    if (knopf(ev.target)) { ev.preventDefault(); ev.stopImmediatePropagation(); zeige(); }
  }, true);
  var plan = 0;
  new MutationObserver(function () { if (!plan) plan = requestAnimationFrame(function () { plan = 0; markiere(); }); })
    .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', markiere); else markiere();
})();

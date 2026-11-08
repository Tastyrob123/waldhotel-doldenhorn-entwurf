/* Hängt «Eingang» (Anfragen von der Website, eingang.html) ins Menü des Studios, mit der Zahl neuer Anfragen. Das Studio baut sein Menü selbst neu,
   deshalb wird nachgesehen, sobald es sich ändert (wie gast_nav.js für «Gäste & Anfragen»). */
(function () {
  var neu = 0;
  function rein() {
    var nav = document.querySelector('#rand nav');
    if (!nav) return;
    var a = nav.querySelector('.eingang-link');
    if (!a) {
      a = document.createElement('a');
      a.className = 'eingang-link'; a.href = 'eingang.html';
      nav.appendChild(a);
    }
    if (a.dataset.neu === String(neu)) return;   // nur neu schreiben, wenn sich die Zahl geändert hat (sonst weckt jedes Schreiben den Beobachter)
    a.dataset.neu = String(neu);
    a.innerHTML = '<span class="ik"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>Eingang' + (neu ? '<b>' + neu + '</b>' : '');
  }
  function zahl() {
    fetch('/api/anfragen', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (!j) return; neu = (j.anfragen || []).filter(function (x) { return x.stand === 'neu'; }).length; rein(); }).catch(function () {});
  }
  new MutationObserver(rein).observe(document.documentElement, { childList: true, subtree: true });
  rein(); zahl(); setInterval(zahl, 120000);
})();

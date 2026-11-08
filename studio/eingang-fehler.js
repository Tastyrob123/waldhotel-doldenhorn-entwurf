/* Weiter zu La Réception (17.10.2026): Der Eingang ist in La Réception aufgegangen (dieselben Anfragen über /api/anfragen, dazu Abteilungen, Brief,
   Chat). Antwortet La Réception unter dieser Adresse (lokal /_werkzeuge/reception/, online /werkzeuge/reception/), geht es dorthin zum Eingang, mit
   der Abteilung aus ?an= (rezeption|spa|event|personal). Antwortet sie nicht (z. B. am Hausserver :8916 oder bevor sie online ist), bleibt dieser Eingang
   wie bisher: keine Anfrage geht verloren. ?bleiben zeigt immer diesen Eingang. Die Seite bleibt bis zur Entscheidung ruhig (höchstens 1,6 s). */
(function () {
  /* Stile (und damit Schriften und Bilder) erst laden, wenn feststeht, dass dieser Eingang bleibt: sonst bricht die Weiterleitung ihre Downloads ab
     (Firefox meldet das als Fehler). Bis dahin stehen die Stile auf media=print und die Seite ist unsichtbar. */
  var an = function () { [].forEach.call(document.querySelectorAll('link[data-eg-css]'), function (l) { l.media = 'all'; }); };
  var stile = function () { an(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', an); };
  var q = new URLSearchParams(location.search);
  if (q.has('bleiben')) return stile();
  var d = document.documentElement; d.style.visibility = 'hidden';
  var zeig = function () { stile(); d.style.visibility = ''; }, fertig = setTimeout(zeig, 1600);
  var AB = { rezeption: 'Rezeption', spa: 'Spa', event: 'Event', personal: 'Personal' };
  var wurzel = location.pathname.replace(/studio\/[^\/]*$/, '');
  var ziele = [wurzel + '_werkzeuge/reception/', wurzel + 'werkzeuge/reception/'];
  (function probe(i) {
    if (i >= ziele.length) { clearTimeout(fertig); return zeig(); }
    fetch(ziele[i] + 'api/ueberblick', { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) { return r.ok && /json/.test(r.headers.get('content-type') || '') ? r.json() : null; })
      .then(function (j) {
        if (!j || typeof j.anfragen_neu !== 'number') return probe(i + 1);
        try { var a = AB[(q.get('an') || '').toLowerCase()]; if (a) sessionStorage.setItem('re-dh-abt', a); } catch (e) { /* */ }
        location.replace(ziele[i] + '#eingang');
      })
      .catch(function () { probe(i + 1); });
  })(0);
})();
/* Fehlerfänger des Eingangs (läuft vor allem anderen, wie im Studio): Skriptfehler landen in localStorage «dh_fehler», die Prüfung des Studios (pruefung.html) zeigt sie.
   Höchstens 20 je Seite, Netzfehler nicht. Steht nach zwölf Sekunden noch nichts da, erscheint die Tür «Der Eingang startet nicht.» mit dem Weg zur Prüfung. */
(function () {
  var n = 0;
  function merk(t) {
    if (++n > 20) return;
    try { var a = JSON.parse(localStorage.getItem('dh_fehler') || '[]'); a.push({ z: new Date().toISOString(), t: ('Eingang: ' + String(t)).slice(0, 300) }); localStorage.setItem('dh_fehler', JSON.stringify(a.slice(-20))); } catch (x) {}
  }
  addEventListener('error', function (e) { if (e.target && e.target !== window) return; merk((e.message || 'Fehler') + ' (' + String(e.filename || '').split('/').pop() + ':' + (e.lineno || 0) + ')'); }, true);
  addEventListener('unhandledrejection', function (e) { var r = e.reason; if (r && r.netz) return; merk('Unerledigt: ' + (r && r.message || r)); });
  setTimeout(function () {
    if (document.documentElement.classList.contains('eg-bereit') || document.getElementById('eg-tuer')) return;
    var d = document.createElement('div'); d.id = 'eg-tuer'; d.className = 'eg-tuer'; d.setAttribute('role', 'alert');
    d.innerHTML = '<h1>Der Eingang startet nicht.</h1><p>Die Oberfläche hat nach zwölf Sekunden noch nicht geladen. Oft hilft einmal neu laden.</p><a class="link" href="pruefung.html">Prüfung öffnen</a>';
    (document.body || document.documentElement).appendChild(d);
  }, 12000);
})();

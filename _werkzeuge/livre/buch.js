/* Markenbuch · «Als PDF sichern» öffnet das Druckfenster des Browsers (je Kapitel eine A4-Seite quer, buch.css @media print). */
'use strict';
(function () {
  const b = document.getElementById('bu-pdf');
  /* Querprüfung 21.10.2026 (Fehlerbuch 10a, Schlössli): vor dem Druck alle Fotos holen (lazy laden sonst nicht, Safari druckt ohne sie); Warten mit addEventListener, nie onload = */
  const alle = () => Promise.all([...document.images].map(i => { i.loading = 'eager'; return i.complete ? 0 : new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }); }));
  if (b) b.addEventListener('click', () => alle().then(() => window.print()));
  addEventListener('beforeprint', () => { [...document.images].forEach(i => { i.loading = 'eager'; }); });
  addEventListener('load', () => setTimeout(alle, 1200));
  /* Schutzraum: der gestrichelte Rand liegt ein Viertel der Höhe des Zeichens ausserhalb */
  const z = document.querySelector('.bu-schutz img');
  const setze = () => { if (z) z.style.setProperty('--h', z.getBoundingClientRect().height + 'px'); };
  if (z) { z.complete ? setze() : z.addEventListener('load', setze); addEventListener('resize', setze); }
})();

/* Auftritte (Robert 18.10.2026, 17:46, Markenbuch: «und da fehlen die ganzen Animationen … stell das bitte überall sicher»).
   Kapitel schweben herein, Fotos zoomen in ihren Rahmen, Farbfelder füllen sich von links, Tannen und Tapeten kommen an ihren Platz.
   Nach der Uhr, sobald etwas am unteren Rand auftaucht, einmal (kein Rücksprung). Nur Bewegung, alles ist von Anfang an deckend. */
(function () {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const zu = (sel, art) => document.querySelectorAll(sel).forEach(e => { if (!e.dataset.bw) e.dataset.bw = art; });
  zu('.bu-titel img', 'tanne'); zu('.bu-titel h1, .bu-titel p', 'hoch');
  zu('.bu-foto, .bu-bilder figure', 'zoom'); zu('.bu-her__b', 'hoch');
  zu('.bu-farben', 'farben'); zu('.bu-tafel, .bu-schutz, .bu-paar, .bu-schrift', 'tanne'); zu('.bu-tapete', 'tapete');
  zu('.bu-k', 'blatt');
  document.querySelectorAll('.bu-farben').forEach(g => g.querySelectorAll('.bu-farbe').forEach((f, i) => f.style.setProperty('--i', i)));
  document.documentElement.classList.add('bu-bew');
  const io = new IntersectionObserver(es => { let k = 0; es.forEach(x => { if (x.isIntersecting && (x.intersectionRatio >= 0.2 || x.intersectionRect.height >= innerHeight * 0.2)) { x.target.style.setProperty('--bw-i', Math.min(k++, 4)); x.target.classList.add('da'); io.unobserve(x.target); } }); },
    { rootMargin: '100000px 0px 0px 0px', threshold: [0, 0.05, 0.1, 0.15, 0.2] });   /* los bei einem Fünftel im Bild (Robert 18.10.2026, 18:17) */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  if (!location.hash) scrollTo(0, 0);
  document.querySelectorAll('[data-bw]').forEach(e => io.observe(e));
  addEventListener('beforeprint', () => document.querySelectorAll('[data-bw]').forEach(e => e.classList.add('da')));
})();

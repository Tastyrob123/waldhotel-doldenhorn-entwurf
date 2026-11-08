/* Anleitung Le Registre · Waldhotel Doldenhorn: Bild gross mit Klick, Esc schliesst; das Zeichen des Hauses (drei Tannen) aus assets/logo/tannen.svg
   (eigene Datei: online laufen eingebettete Skripte ohne Prüfsumme nicht). */
(function () {
  var g = document.getElementById('gross'), im = g.querySelector('img');
  function zu() { g.hidden = true; }
  document.addEventListener('click', function (e) { var b = e.target.closest('.bild'); if (b) { im.src = b.querySelector('img').src; im.alt = b.querySelector('img').alt; g.hidden = false; } else if (e.target.closest('#gross')) zu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') zu(); });
  try { fetch('../../assets/logo/tannen.svg').then(function (r) { return r.text(); }).then(function (t) { var p = (t.match(/<path[^>]*\/>/g) || []).join(''); if (p) document.getElementById('zeichen').innerHTML = p; }).catch(function () {}); } catch (e) {}
})();

/* Einheitliches Startbild der Werkzeuge des Waldhotel Doldenhorn (17.10.2026, startbild.css): DHStart({werkzeug, h1, satz, kn:[{t, href, neu, attr}], zusatz, foto})
   gibt das Markup zurück; jedes Werkzeug setzt es auf seiner Startansicht statt seines eigenen Kopfes. Text bleibt je Werkzeug eigen.
   Das Foto bekommt «da», sobald es gemalt ist (ein Zuhörer für alle, kein eingebettetes Skript, läuft auch mit script-src 'self'). */
(function () {
  var PF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  window.DHStart = function (o) {
    var foto = o.foto || 'haus-abend';
    var kn = (o.kn || []).map(function (k) {
      return '<a class="dh-st__k" href="' + esc(k.href) + '"' + (k.neu ? ' target="_blank" rel="noopener"' : '') + (k.attr || '') + '>' + esc(k.t) + '<i>' + PF + '</i></a>';
    }).join('');
    return '<header class="dh-st" data-dh-start>' +
      '<figure class="dh-st__foto" aria-hidden="true"><img class="dh-st__img" src="/assets/img/' + foto + '-m.webp" srcset="/assets/img/' + foto + '-n.webp 1200w, /assets/img/' + foto + '-m.webp 1500w" sizes="(max-width:900px) 100vw, 1500px" alt="" decoding="async" fetchpriority="high"></figure>' +
      '<p class="dh-st__zier">' + (window.DHStartZeichen || '') + '<span>' + esc(o.werkzeug) + ' · Waldhotel Doldenhorn · Kandersteg</span><i></i></p>' +
      '<h1 class="dh-st__h">' + o.h1 + '</h1>' +
      (o.satz ? '<p class="dh-st__satz">' + o.satz + '</p>' : '') +
      ((kn || o.zusatz) ? '<div class="dh-st__kn">' + kn + (o.zusatz ? '<div class="dh-st__zusatz">' + o.zusatz + '</div>' : '') + '</div>' : '') +
      '</header>';
  };
  window.DHStartZeichen = '<svg viewBox="282.26 400.65 31.24 45.18" aria-hidden="true"><path fill-rule="nonzero" fill="currentColor" d="M 283.816406 441.621094 L 282.855469 445.226562 L 298.234375 445.226562 L 297.273438 441.621094 Z M 285.019531 436.9375 L 284.054688 440.78125 L 297.035156 440.78125 L 296.074219 436.9375 Z M 298.355469 436.9375 L 297.394531 440.78125 L 312.894531 440.78125 L 311.8125 436.9375 Z M 286.21875 432.25 L 285.136719 436.09375 L 295.832031 436.09375 L 294.871094 432.25 Z M 299.558594 432.25 L 298.476562 436.09375 L 311.574219 436.09375 L 310.613281 432.25 Z M 287.421875 427.683594 L 286.460938 431.53125 L 288.503906 431.53125 L 289.34375 427.683594 Z M 290.183594 427.683594 L 289.105469 431.53125 L 298.835938 431.53125 L 299.796875 427.683594 Z M 300.757812 427.683594 L 299.675781 431.53125 L 310.371094 431.53125 L 309.410156 427.683594 Z M 288.621094 422.996094 L 287.660156 426.84375 L 289.703125 426.84375 L 290.664062 422.996094 Z M 291.386719 422.996094 L 290.425781 426.84375 L 300.039062 426.84375 L 301 422.996094 Z M 301.960938 422.996094 L 300.878906 426.84375 L 309.167969 426.84375 L 308.207031 422.996094 Z M 289.824219 418.3125 L 288.863281 422.15625 L 290.90625 422.15625 L 291.625 419.394531 L 291.265625 418.3125 Z M 292.589844 418.3125 L 291.625 422.15625 L 301.238281 422.15625 L 301.71875 419.992188 L 301.238281 418.3125 Z M 303.164062 418.3125 L 302.082031 422.15625 L 307.96875 422.15625 L 307.007812 418.3125 Z M 289.945312 417.46875 L 291.027344 417.46875 L 290.546875 415.425781 Z M 293.789062 413.625 L 292.828125 417.46875 L 301.121094 417.46875 L 300.160156 413.625 Z M 304.363281 413.625 L 303.28125 417.46875 L 306.765625 417.46875 L 305.804688 413.625 Z M 304.484375 412.785156 L 305.566406 412.785156 L 304.964844 410.742188 C 305.085938 410.742188 304.484375 412.785156 304.484375 412.785156 M 294.992188 408.9375 L 294.03125 412.785156 L 299.917969 412.785156 L 298.957031 408.9375 Z M 297.035156 401.25 L 295.230469 408.097656 L 298.714844 408.097656 Z M 297.035156 401.25 "/></svg>';   // die drei Tannen (assets/logo/tannen.svg)
  function gruss() { var h = new Date().getHours(); return h >= 5 && h < 11 ? 'Guten Morgen.' : h >= 11 && h < 18 ? 'Guten Tag.' : 'Guten Abend.'; }
  window.DHStart.gruss = gruss;
  document.addEventListener('load', function (ev) { var t = ev.target; if (t && t.classList && t.classList.contains('dh-st__img')) { var f = t.parentNode; (t.decode ? t.decode() : Promise.resolve()).then(null, function () {}).then(function () { f.classList.add('da'); }); } }, true);
  document.addEventListener('error', function (ev) { var t = ev.target; if (t && t.classList && t.classList.contains('dh-st__img') && (t.__z || 0) < 2) { t.__z = (t.__z || 0) + 1; t.src = t.__z === 1 ? t.src.replace('-m.webp', '-l.webp') : t.src.replace('-l.webp', '.webp'); }   /* 18.10.2026 (Robert 22:09 Ladezeiten): 1500er reicht, das Startbild steht nie breiter als 760 px */ }, true);
})();

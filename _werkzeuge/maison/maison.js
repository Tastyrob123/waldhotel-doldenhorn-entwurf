/* Kontrollpanel · Waldhotel Doldenhorn (17.10.2026). Gebaut von _werkzeuge/maison/bau.py aus quelle/maison.js, nicht in der Ausgabe ändern.
   Gruss, Datum, Wegweiser, Auftritte und der Stand je Werkzeug. Stand nur aus den Daten der Werkzeuge selbst (nichts geschätzt): Wege als Daten
   in der Seite (#maison-wege), ein Weg darf eine Liste sein (antwortet der erste nicht, gilt der nächste). Werte gehen nur als Zahl in die Seite. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* Nur ganze Zahlen ab 0 und unter einer Milliarde gelten; alles andere (Text, Schadcode, 1e21, negativ) zählt als 0 (Prüf-Chat 17.10.2026: parseInt machte aus 1e21 eine 1) */
  var ganz = function (x) { var n = typeof x === 'number' ? x : /^\s*\d+\s*$/.test(String(x)) ? Number(x) : NaN; return isFinite(n) && n > 0 && n < 1e9 ? Math.floor(n) : 0; };
  var gilt = function (x) { return (typeof x === 'number' || /^\s*\d+\s*$/.test(String(x))) && isFinite(Number(x)) && Number(x) >= 0 && Number(x) < 1e9; };
  var tag = function (d) { return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  var setze = function (key, html) { $$('[data-stand="' + key + '"]').forEach(function (el) { el.innerHTML = html; }); };
  var zahl = function (key, wert) { $$('[data-zahl="' + key + '"]').forEach(function (el) { el.textContent = wert; }); };

  /* Gruss und Datum; ?gruss=morgen|tag|abend für das Standbild der Werkbank */
  var h = new Date().getHours();
  var fest = { morgen: 8, tag: 13, abend: 20 }[(/[?&]gruss=(morgen|tag|abend)/.exec(location.search) || [])[1]]; if (fest) h = fest;
  $('#gruss').textContent = h >= 5 && h < 11 ? 'Guten Morgen.' : h >= 11 && h < 18 ? 'Guten Tag.' : 'Guten Abend.';
  var dat = $('#datum'); if (dat) dat.textContent = new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  /* Einheitliches Startbild (17.10.2026): Hausfoto bekommt «da», sobald es gemalt ist; fehlt die grosse Fassung, die normale */
  $$('.dh-st__img').forEach(function (im) {
    var da = function () { (im.decode ? im.decode() : Promise.resolve()).then(null, function () {}).then(function () { im.parentNode.classList.add('da'); }); };
    if (im.complete && im.naturalWidth) da(); else { im.addEventListener('load', da); im.addEventListener('error', function () { if (!im.__z) { im.__z = 1; im.src = im.src.replace('-l.webp', '.webp'); } }); }
  });

  /* Buchstaben-Rollen nur in den Namen der Leiste */
  $$('.rl').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (z, i) { return '<b style="--n:' + i + '">' + esc(z) + '</b>'; }).join('');
  });

  /* Wegweiser: die Schilder steigen auf, wenn die sechs runden Raumbilder dekodiert sind (höchstens 1,4 s) */
  var pfosten = $('.ww__pfosten');
  (function () {
    if (!pfosten) return;
    var los = function () { pfosten.classList.add('bereit'); };
    var uhr = setTimeout(los, 1400);
    Promise.all($$('.ws__raum', pfosten).map(function (im) { return (im.decode ? im.decode() : Promise.resolve()).catch(function () {}); }))
      .then(function () { clearTimeout(uhr); requestAnimationFrame(los); });
  })();

  /* Raum zum Schild: Zeiger, Tastatur-Fokus oder Antippen eines Schilds zeigt links seinen Raum, harter Schnitt, erst wenn das Bild da ist */
  var S = $$('.ws'), R = $$('.ww__raum'), U = $$('.ww__unter span'), jetzt = 0, will = 0;
  var zeige = function (i) {
    will = i; if (i === jetzt || !R[i]) return;
    var im = R[i]; if (im.loading === 'lazy') im.loading = 'eager';
    var fertig = function () {
      if (will !== i) return;
      R.forEach(function (r, j) { r.classList.toggle('an', j === i); });
      U.forEach(function (u, j) { u.classList.toggle('an', j === i); });
      S.forEach(function (s, j) { s.classList.toggle('an', j === i); });
      jetzt = i;
    };
    (im.decode ? im.decode() : Promise.resolve()).then(fertig, fertig);   /* immer erst entpacken, dann zeigen: sonst entpackt der Browser beim Umschalten im selben Bild */
  };
  /* Vorschau statt Raum (Robert 18.10.2026, 16:11: «wenn ich dort über die Sachen streiche rechts, möchte ich, dass links eine kurze Vorschau von der jeweiligen Seite
     angezeigt wird. Aber so, dass es auch wirklich passt in die Kachel»): Maus oder Tastatur auf einem Schild blendet links die Startseite des Werkzeugs weich ein,
     ohne Schild steht wieder die Halle. Am Handy (Antippen) keine Vorschau, das Schild öffnet das Werkzeug. */
  var V = $$('.ww__vorschau'), UN = $('.ww__unter'), unterAlt = UN ? UN.innerHTML : '', vJetzt = -1, vWill = -1;
  var vorschau = function (i) {
    vWill = i; if (i === vJetzt) return;
    var fertig = function () {
      if (vWill !== i) return;
      V.forEach(function (v, j) { v.classList.toggle('an', j === i); });
      S.forEach(function (s, j) { s.classList.toggle('an', j === i); });
      if (UN) UN.innerHTML = i < 0 ? unterAlt : '<span class="an">Vorschau · ' + esc((S[i].querySelector('.ws__t b') || {}).textContent || '') + '</span>';
      vJetzt = i;
    };
    if (i < 0 || !V[i]) { fertig(); return; }
    var im = V[i]; if (im.loading === 'lazy') im.loading = 'eager';
    (im.decode ? im.decode() : Promise.resolve()).then(fertig, fertig);
  };
  S.forEach(function (s, i) {
    s.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') vorschau(i); });
    s.addEventListener('focus', function () { vorschau(i); });
    s.addEventListener('blur', function () { vorschau(-1); });
  });
  if (pfosten) pfosten.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') vorschau(-1); });
  /* Vorschaubilder ruhig vorladen, sobald die Seite steht */
  addEventListener('load', function () { setTimeout(function () { V.forEach(function (v) { v.loading = 'eager'; }); }, 1200); });
  /* Die übrigen Räume laden, sobald der erste da ist (ruhig, nach dem Auftakt) */
  if (R[0]) {
    var weiter = function () { setTimeout(function () { R.forEach(function (r) { if (r.loading === 'lazy') r.loading = 'eager'; r.addEventListener('load', function () { if (r.decode) r.decode().catch(function () {}); }, { once: true }); }); }, 900); };
    if (R[0].complete) weiter(); else R[0].addEventListener('load', weiter, { once: true });
  }

  /* Taste 1 bis 6 öffnet das Werkzeug des Schilds (M12), still, solange der Rundgang offen ist */
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || document.querySelector('.rdg-karte')) return;
    var k = S[+e.key - 1]; if (k) { vorschau(+e.key - 1); k.classList.add('gedrueckt'); setTimeout(function () { location.href = k.href; }, 180); }
  });

  /* Auftritte: ein Abschnitt fährt als Ganzes los, sobald er am unteren Rand auftaucht; jedes Stück mit seiner Staffel (--i) */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}   /* jede Seite öffnet oben */
  if (!location.hash) window.scrollTo(0, 0);
  var alle = $$('[data-r]');
  /* Kommt ein Stück an, lädt es seine Bilder sofort (M15: der Safari-Kern am Handy holte ein Bild im Blick sonst nie) */
  var wecke = function (el) { (el.tagName === 'IMG' ? [el] : $$('img[loading="lazy"]', el)).forEach(function (i) { if (!i.complete || !i.naturalWidth) i.loading = 'eager'; }); };
  var an = function (el) { el.classList.add('da'); wecke(el); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && (e.intersectionRatio >= 0.2 || e.intersectionRect.height >= innerHeight * 0.2)) { an(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '100000px 0px 0px 0px', threshold: [0, 0.05, 0.1, 0.15, 0.2] });   /* Robert 18.10.2026, 18:17: los bei einem Fünftel im Bild */   /* Prüf-Chat 18.10.2026: Auslöser am unteren Rand, nicht 12 % darunter (sonst lief der Auftritt ungesehen ab) */
    var gruppe = function (el) { return el.closest('section, .m-saal, .m-empfang, footer') || el; };
    var gesehen = new Set();
    var gio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting || gesehen.has(e.target)) return; gesehen.add(e.target); gio.unobserve(e.target);
        alle.forEach(function (el) { if (gruppe(el) === e.target && el.getBoundingClientRect().top < innerHeight) { an(el); io.unobserve(el); } }); });   /* gemeinsam starten nur, was schon im Bild ist; der Rest kommt, wenn er auftaucht */
    }, { rootMargin: '0px', threshold: 0 });
    alle.forEach(function (el) { io.observe(el); var g = gruppe(el); if (!gesehen.has(g) && g !== el) gio.observe(g); });
    /* Goldband läuft nur, solange es im Bild ist (M07) */
    var band = $('[data-laufband]');
    if (band) new IntersectionObserver(function (es) { band.classList.toggle('laeuft', es[0].isIntersecting); }).observe(band);
    /* Leiste: die Etappe im Blick ist markiert (M01) */
    var punkte = {};
    $$('.m-insel__p').forEach(function (a) { punkte[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var a = punkte[e.target.id]; if (a) a.classList.toggle('an', e.isIntersecting); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(punkte).forEach(function (id) { var s = document.getElementById(id); if (s) sio.observe(s); });
  } else {
    alle.forEach(function (el) { el.classList.add('da'); });
  }

  /* Stand-Wege (gesetzt von bau.py als Daten, kein eingebettetes Skript wegen der Sicherheitsregel online) */
  var WEGE = {}; try { WEGE = JSON.parse($('#maison-wege').textContent) || {}; } catch (e) { /* ohne Wege: jede Zeile ohne Zahl */ }
  var hole = function (k) {
    var w = [].concat(WEGE[k] || []).filter(Boolean);
    var weiter = function (i) {
      return i >= w.length ? Promise.reject(new Error('kein Weg')) : fetch(w[i], { cache: 'no-store', credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
        .then(function (d) { return d && typeof d === 'object' ? d : Promise.reject(new Error('leer')); })
        .catch(function () { return weiter(i + 1); });
    };
    return weiter(0);
  };

  /* Website bearbeiten: {aenderungen, zuletzt:{zeit}, bereiche:[…], seiten, sprachen?} */
  hole('bureau').then(function (u) {
    var a = ganz(u.aenderungen), z = u.zuletzt;
    if (Array.isArray(u.bereiche) && u.bereiche.length) zahl('bereiche', u.bereiche.length);
    if (ganz(u.seiten)) zahl('seiten', ganz(u.seiten));
    var sp = Array.isArray(u.sprachen) ? u.sprachen.length : ganz(u.sprachen);
    /* Website bearbeiten meldet zusätzliche Sprachen; 0 oder leer heisst: die Website ist nur deutsch («Nur Deutsch, nichts zu übersetzen») */
    if (sp) zahl('sprachen', sp); else if (u.sprachen === 0 || (Array.isArray(u.sprachen) && !u.sprachen.length)) zahl('sprachen', 'Deutsch');
    var zd = z && z.zeit ? new Date(String(z.zeit).replace(' ', 'T')) : null, zul = zd && !isNaN(zd) ? tag(zd) : '';
    setze('bureau-kurz', a ? '<b>' + a + ' im Entwurf</b>' : (zul ? 'Veröffentlicht ' + esc(zul) : 'Nichts offen'));
    setze('bureau', (a ? '<b>' + a + ' Änderung' + (a > 1 ? 'en' : '') + ' im Entwurf.</b> ' : 'Nichts offen im Entwurf. ') + (zul ? 'Zuletzt veröffentlicht am ' + esc(zul) + '.' : 'Noch nichts veröffentlicht.'));
  }).catch(function () { setze('bureau-kurz', 'Website des Hauses'); setze('bureau', 'Der Stand ist gerade nicht abrufbar.'); });

  /* Karten & Preislisten: {karten:[{entwurf, pdf_zeit:"dd.mm.yyyy hh:mm"}]} */
  hole('carte').then(function (d) {
    var k = Array.isArray(d.karten) ? d.karten : null; if (!k) throw new Error('ohne Karten');
    var e = k.filter(function (x) { return x && x.entwurf; }).length;
    var sortier = function (s) { var m = String(s).match(/(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/); return m ? m[3] + m[2] + m[1] + m[4] + m[5] : ''; };
    var pdf = k.map(function (x) { return x && x.pdf_zeit || ''; }).filter(function (s) { return sortier(s); }).sort(function (a, b) { return sortier(a) < sortier(b) ? 1 : -1; })[0];
    zahl('karten', k.length);
    zahl('entwurf', e);
    if (pdf) { var m = String(pdf).match(/(\d+)\.(\d+)\./); zahl('pdf', ('0' + m[1]).slice(-2) + '.' + ('0' + m[2]).slice(-2) + '.'); }
    /* «alle veröffentlicht» nur, wenn jede Karte eine PDF hat; Karten & Preislisten zeigt eine Karte ohne pdf_zeit als «Noch keine PDF veröffentlicht» (Mittagsmenü) */
    var ohne = k.filter(function (x) { return x && !x.pdf_zeit; }).length;
    setze('carte-kurz', e ? '<b>' + e + ' im Entwurf</b>' : ohne ? k.length + (k.length === 1 ? ' Karte' : ' Karten') + ' · ' + ohne + ' noch ohne PDF'
      : k.length + (k.length === 1 ? ' Karte, veröffentlicht' : ' Karten, alle veröffentlicht'));
  }).catch(function () { setze('carte-kurz', 'Karten des Hauses'); });

  /* Drucksachen & Feed: keine Änderungen, die sich zeigen liessen; die Zahl der fertigen Vorlagen aus ihrer Liste [{art, format, zahl}] */
  hole('imprimerie').then(function (l) {
    if (!Array.isArray(l) || !l.length) throw new Error('leer');
    var z = 0, arten = {}; l.forEach(function (x) { z += ganz(x && x.zahl); if (x && x.art) arten[String(x.art)] = 1; });
    var a = Object.keys(arten).length; if (!z) throw new Error('leer');
    setze('imprimerie-kurz', z + (z === 1 ? ' Vorlage in ' : ' Vorlagen in ') + a + (a === 1 ? ' Art' : ' Arten'));
  }).catch(function () { setze('imprimerie-kurz', 'Vorlagen, druckfertig'); });

  /* Anfragen & Chat: {anfragen_neu, anfragen_offen, ohne_antwort, fragen_gesamt} */
  hole('reception').then(function (r) {
    var u = {}; ['anfragen_neu', 'anfragen_offen', 'ohne_antwort', 'fragen_gesamt'].forEach(function (k) { u[k] = ganz(r[k]); });
    var teile = [];
    if (u.anfragen_neu) teile.push('<b>' + u.anfragen_neu + (u.anfragen_neu === 1 ? ' neue Anfrage' : ' neue Anfragen') + '</b>');
    else if (u.anfragen_offen) teile.push(u.anfragen_offen + (u.anfragen_offen === 1 ? ' Anfrage offen' : ' Anfragen offen'));
    if (u.ohne_antwort) teile.push('<b>' + u.ohne_antwort + (u.ohne_antwort === 1 ? ' Frage ohne Antwort' : ' Fragen ohne Antwort') + '</b>');
    var kurz = teile.length ? teile.join(' · ') : 'Nichts offen';
    setze('reception-kurz', kurz);
    setze('reception', teile.length ? kurz : 'Nichts offen · ' + u.fragen_gesamt + (u.fragen_gesamt === 1 ? ' Frage' : ' Fragen') + ' bisher');
  }).catch(function () { setze('reception-kurz', 'Rezeption im Chat'); setze('reception', '&nbsp;'); });

  /* Markenbuch: stand:{fotos, ki, ue, dateien} (ki = mit KI erzeugt, ue = nachgeschärft) */
  hole('livre').then(function (d) {
    var s = d.stand || {}, f = ganz(s.fotos), da = ganz(s.dateien), ki = ganz(s.ki), ue = ganz(s.ue);
    if (!f && !da) throw new Error('leer');
    var fo = function (z) { return z + (z === 1 ? ' Foto' : ' Fotos'); }, di = function (z) { return z + (z === 1 ? ' Datei' : ' Dateien'); };
    setze('livre-kurz', fo(f) + ' · ' + di(da));
    var dazu = [ki ? ki + ' mit KI erzeugt' : '', ue ? ue + ' nachgeschärft' : ''].filter(Boolean);
    setze('livre', fo(f) + ' in fertigen Grössen' + (dazu.length ? ', davon ' + dazu.join(' und ') + ', alle gekennzeichnet' : '') + '. ' + di(da) + ' für Agenturen und Druckereien, dazu die Markenprüfung.');
  }).catch(function () { setze('livre-kurz', 'Fotos, Dateien, Markenprüfung'); setze('livre', '&nbsp;'); });

  /* Besucher: Werte der Zählung ohne Cookies. Vorführ-Betrieb: Beispielwerte, als Beispiel beschriftet (R20) */
  var RN = {}; try { RN = JSON.parse($('#maison-registre').textContent) || {}; } catch (e) {}
  /* Ersatzweg Besucher (abgelegte Beispielwerte beispiel/30.json): die Ablage enthält heute den ganzen Tag. Was nach der jetzigen Uhrzeit von
     Kandersteg begänne, fällt weg, genau wie im Werkzeug (registre.js kuerzen/werteAus, dh-registre 17.10.2026), sonst stünde «heute» zu hoch (F31). */
  var jetztZuerich = function () {
    try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date()); }
    catch (e) { return new Date().toTimeString().slice(0, 8); }
  };
  var pyRund = function (x, st) {   /* wie Python round() (registre.js pyRund) */
    st = st || 0; if (x == null || !isFinite(x)) return x;
    var f = Math.pow(10, st), y = Math.abs(x) * f, b = Math.floor(y), r = y - b;
    var k = r > 0.5 + 1e-9 ? b + 1 : r < 0.5 - 1e-9 ? b : (b % 2 ? b + 1 : b);
    return (x < 0 ? -k : k) / f;
  };
  var ART = { angebot: ['angebote.html', 'reisen-ohne-stress.html'], restaurant: ['kueche.html', 'au-gourmet.html', 'restaurant-doldenhorn.html', 'bistro.html', 'halbpension.html'],
    spa: ['spa.html', 'sauna-welt.html'], feiern: ['feste.html', 'heiraten.html', 'seminare.html', 'veranstaltungen.html'] };
  var artVon = function (x) { return x === 'index.html' ? 'start' : /^zimmer[.-]/.test(x) ? 'zimmer' : Object.keys(ART).filter(function (k) { return ART[k].indexOf(x) >= 0; })[0] || 'sonst'; };
  var kuerze = function (d) {
    var R = d.roh; if (!R || !R.heute_voll || !Array.isArray(d.besuche) || !Array.isArray(d.je_tag) || !d.summe) return d;
    var jetzt = jetztZuerich(), heute = d.bis, u = d.summe, t = d.je_tag[d.je_tag.length - 1];
    var weg = d.besuche.filter(function (b) { return b.tag === heute && (b.zs || b.z + ':00') > jetzt; });
    if (!weg.length) return d;
    var SS = {}; (R.S || []).forEach(function (x) { SS[x[0] + '|' + x[1] + '|' + x[2]] = x[3]; });
    var laender = {}; (R.laender || []).forEach(function (x) { laender[x.k] = x.n; });
    weg.forEach(function (b) {
      u.besuche--; u.seiten -= b.seiten; if (b.buchung) u.buchung--; u.heute--;
      t.besuche--; t.seiten -= b.seiten; if (b.buchung) t.buchung--;
      var l = b.l || '??'; if (l in laender) laender[l]--;
      (b.weg || []).forEach(function (x) { var a = artVon(x.s); ['seite'].concat(x.e || []).forEach(function (e) { var k = e + '|' + a + '|' + b.g; SS[k] = (SS[k] || 0) - 1; }); });
    });
    u.laender = Object.keys(laender).filter(function (k) { return laender[k] > 0 && k !== '??' && k !== ''; }).length;
    var sum = function (e, a) { var z = 0; Object.keys(SS).forEach(function (k) { var p = k.split('|'); if (p[0] === e && (a == null || p[1] === a)) z += SS[k]; }); return z; };
    var wert = function (z, v, mehr) { var o = { zahl: z, von: v, anteil: v ? pyRund(Math.min(100, 100 * z / v), 1) : null }; for (var k in mehr || {}) o[k] = mehr[k]; return o; };
    var auf = sum('seite');
    d.werte = { start: wert(sum('buchung', 'start'), sum('seite', 'start')), zimmer: wert(sum('buchung', 'zimmer'), sum('seite', 'zimmer')),
      angebot: wert(sum('buchung', 'angebot'), sum('seite', 'angebot')), abbruch: wert(Math.max(0, sum('fenster') - sum('buchung')), sum('fenster')),
      tisch: wert(sum('tisch'), auf, { kueche: sum('tisch', 'restaurant') }), anfrage: wert(sum('anfrage') + sum('spa'), auf, { anfrage: sum('anfrage'), spa: sum('spa') }),
      kontakt: wert(sum('anruf') + sum('mail'), auf, { anruf: sum('anruf'), mail: sum('mail') }), chat: wert(sum('chat'), auf) };
    d.leer = !u.besuche;
    return d;
  };
  if ($('#registre')) hole('registre').then(kuerze).then(function (m) {
    var n = function (x) { return gilt(x) ? Number(x).toLocaleString('de-CH') : '–'; };   /* nie «NaN»: ohne gültige Zahl «–» */
    var w = m.werte || {};
    var aufrufe = function (z) { return z === 1 ? 'Aufruf' : 'Aufrufen'; };
    Object.keys(RN).forEach(function (key) {
      var x = w[key] || {}, von = ganz(x.von), da = von > 0, anteil = Number(x.anteil);
      /* Sätze wie im Werkzeug (registre.js, Ansicht «Zur Buchung») */
      var mal = function (z) { z = ganz(z); return z === 1 ? 'einmal' : n(z) + ' Mal'; };
      var bei = ', bei ' + n(von) + ' ' + aufrufe(von);
      var klein = key === 'kontakt' ? mal(x.anruf) + ' die Nummer, ' + mal(x.mail) + ' die Mail-Adresse' + bei
        : key === 'abbruch' ? n(x.zahl) + ' von ' + n(von) + (von === 1 ? ' geöffneten Fenster' : ' geöffneten Fenstern')
        : key === 'tisch' ? mal(x.zahl) + bei
        : key === 'anfrage' ? n(x.anfrage) + (ganz(x.anfrage) === 1 ? ' Anfrage, ' : ' Anfragen, ') + n(x.spa) + (ganz(x.spa) === 1 ? ' Spa-Termin' : ' Spa-Termine') + bei
        : key === 'chat' ? mal(x.zahl) + ' geöffnet' + bei
        : n(x.zahl) + ' von ' + n(von) + ' ' + aufrufe(von) + (RN[key] ? ' ' + RN[key] : '');
      $$('[data-mw="' + key + '"]').forEach(function (el) { el.textContent = da && isFinite(anteil) ? anteil.toLocaleString('de-CH', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace('.', ',') + ' %' : '–'; });
      $$('[data-mk="' + key + '"]').forEach(function (el) { el.textContent = da ? klein : 'Noch nichts gezählt'; });
    });
    var u = m.summe || {};
    /* Der Weg des Gastes (Robert 18.10.2026, 20:03 Wahl «C»): Besuche → Buchungsfenster → weiter zu SimpleBooking → gebucht (zählt nur SimpleBooking).
       Die Zahlen werden von Stufe zu Stufe kleiner und zählen einmal hoch; darunter ein Satz in Worten statt Prozent */
    var ORD = { 2: 'zweite', 3: 'dritte', 4: 'vierte', 5: 'fünfte', 6: 'sechste', 7: 'siebte', 8: 'achte', 9: 'neunte', 10: 'zehnte', 11: 'elfte', 12: 'zwölfte', 13: 'dreizehnte', 14: 'vierzehnte', 15: 'fünfzehnte', 16: 'sechzehnte', 17: 'siebzehnte', 18: 'achtzehnte', 19: 'neunzehnte', 20: 'zwanzigste' };
    var prozent = function (r) { return (r * 100).toLocaleString('de-CH', { maximumFractionDigits: 1 }).replace('.', ',') + ' %'; };
    var jeder = function (z, v) { z = Number(z); v = Number(v); if (!(z > 0 && v > 0)) return '&nbsp;'; var r = z / v; if (r >= 0.5) return 'mehr als die Hälfte der Besuche';
      var x = v / z, k = Math.round(x); if (!ORD[k]) return prozent(r) + ' der Besuche'; return (Math.abs(x - k) < 0.08 ? 'jeder ' : (x > k ? 'fast jeder ' : 'gut jeder ')) + ORD[k] + ' Besuch'; };
    var teil = function (z, v) { z = Number(z); v = Number(v); if (!(z >= 0 && v > 0)) return '&nbsp;'; var p = Math.round(100 * z / v);
      return p >= 90 ? 'fast alle davon' : p >= 72 ? 'rund drei Viertel davon' : p >= 62 ? 'rund zwei Drittel davon' : p >= 55 ? 'gut die Hälfte davon' : p >= 45 ? 'rund die Hälfte davon' : p >= 30 ? 'rund ein Drittel davon' : p >= 20 ? 'rund ein Viertel davon' : prozent(z / v) + ' davon'; };
    var fen = w.abbruch ? Number(w.abbruch.von) : NaN;
    var kenn = { besuche: [u.besuche, gilt(m.tage) ? 'auf der Website, in ' + (Number(m.tage) === 30 ? 'dreissig' : n(m.tage)) + ' Tagen' : 'auf der Website'],
      fenster: [fen, jeder(fen, u.besuche)], buchung: [u.buchung, teil(u.buchung, fen)] };
    Object.keys(kenn).forEach(function (k) {
      var z = kenn[k][0], el = $('[data-mz="' + k + '"]'), kl = $('[data-mzk="' + k + '"]');
      if (kl) kl.innerHTML = gilt(z) ? kenn[k][1] : '&nbsp;';
      if (!el) return;
      if (!gilt(z)) { el.textContent = '–'; return; }
      el.textContent = n(z); el.dataset.ziel = z;
    });
    setze('weg', m.leer ? 'Noch keine Besuche gezählt.' : (m.beispiel ? 'Beispielwerte, bis die Website echte Besuche zählt · ' : '') + (gilt(m.tage) ? 'letzte ' + n(m.tage) + ' Tage' : ''));
    var kz = $('.m-weg');
    if (kz && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var ko = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; ko.disconnect();
        $$('[data-mz][data-ziel]').forEach(function (el) {
          var ziel = Number(el.dataset.ziel), t0 = performance.now();
          (function schritt(t) { var p = Math.min(1, Math.max(0, (t - t0) / 1400)), e = 1 - Math.pow(1 - p, 3); el.textContent = n(Math.round(ziel * e)); if (p < 1) requestAnimationFrame(schritt); })(t0);
        });
      }, { threshold: .4 });
      ko.observe(kz);
    }
    /* «Heute»: Besuche und Klicks zur Buchung des heutigen Tages (letzter Eintrag in je_tag, F40); ohne Wert «–» */
    var jt = Array.isArray(m.je_tag) && m.je_tag.length ? m.je_tag[m.je_tag.length - 1] : null;
    setze('registre-heute', gilt(u.heute) ? n(u.heute) : '–');
    setze('registre-buchung', jt && gilt(jt.buchung) ? n(jt.buchung) : '–');
    /* Die Zeile darunter nur mit gültigen Zahlen, sonst ohne Zahl (Prüf-Chat 17.10.2026: kaputte Werte zeigten «Letzte NaN Tage · NaN Besuche») */
    if (!m.leer && !(gilt(m.tage) && gilt(u.besuche) && gilt(u.seiten))) { setze('besuche', 'Die Zählung ist gerade nicht abrufbar.'); return; }
    if (!gilt(u.laender)) u.laender = 0;
    if (m.beispiel) $$('.ww__zeile').forEach(function (z) { z.classList.add('beispiel'); z.setAttribute('title', 'Beispielwerte, bis die Website echte Besuche zählt'); });
    setze('besuche', m.leer ? 'Noch keine Besuche gezählt.'
      : (m.beispiel ? 'Beispielwerte · ' : '') + 'Letzte ' + n(m.tage) + ' Tage · ' + n(u.besuche) + (u.besuche === 1 ? ' Besuch' : ' Besuche') + ' · ' + n(u.seiten) + (u.seiten === 1 ? ' angesehene Seite' : ' angesehene Seiten') + (u.laender ? ' · ' + n(u.laender) + (u.laender === 1 ? ' Land' : ' Länder') : ''));
  }).catch(function () { setze('besuche', 'Die Zählung ist gerade nicht abrufbar.'); setze('registre-heute', '–'); setze('registre-buchung', '–'); });
  window.MAISON_BEREIT = true;   /* Startfehler-Tür (R04): ohne dieses Zeichen öffnet fehler.js die Tür */
})();

/* Robert 18.10.2026 23:49 «Da laden die Bilder viel zu lange»: die Bilder der übrigen Räume der Halle und die Vorschauen laden gleich nach der Seite,
   damit beim Darüberfahren sofort etwas steht. */
(function () {
  function vor() { [].forEach.call(document.querySelectorAll('.ww img[loading="lazy"]'), function (i) { i.loading = 'eager'; }); }
  if (document.readyState === 'complete') setTimeout(vor, 200); else window.addEventListener('load', function () { setTimeout(vor, 200); });
})();

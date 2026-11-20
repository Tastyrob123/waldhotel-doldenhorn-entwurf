// La Maison · Waldhotel Doldenhorn · Prüfung durch Bedienen (17.10.2026, Master Werkzeug-Bau Abschnitt 8, Vorbild Carlton pruefung/pruefe.js).
//   node _werkzeuge/maison/pruefung/pruefe.js chromium|webkit|firefox [http://localhost:8950]
// Bedient jede Zeile bei 1440 × 900, 1366 × 650, 390 × 844 und 320 × 640. Nur lesen: der Fehlermelder wird abgefangen und erreicht nie einen Server.
// Ergebnis: ergebnis-<browser>.json (ok = grün, rot, offen = hängt an einem Werkzeug, das noch nicht läuft), Belege in belege/.
const PW = require('/Users/robertreff/Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ART = process.argv[2] || 'chromium';
const BASIS = (process.argv[3] || '').replace(/\/$/, '');
const URL_ = BASIS + '/_werkzeuge/maison/';
const BELEGE = path.join(__dirname, 'belege');
fs.mkdirSync(BELEGE, { recursive: true });
const GROESSEN = [[1440, 900], [1366, 650], [390, 844], [320, 640]];
const NUR = (process.env.NUR || '').split(',').filter(Boolean);
const erg = [];
const notiz = (gr, nr, name, ok, beleg) => {
  erg.push({ browser: ART, groesse: gr, nr, name, ok: ok === null ? null : !!ok, beleg: String(beleg || '').slice(0, 400) });
  console.log((ok === null ? 'offen ' : ok ? 'ok    ' : 'ROT   ') + ART + ' ' + gr + ' ' + nr + ' ' + name + (beleg ? ' · ' + String(beleg).slice(0, 170) : ''));
};
const holen = u => new Promise(a => { const m = /^https:/.test(u) ? require('https') : http; m.get(u, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => a({ s: r.statusCode, d })); }).on('error', () => a({ s: 0, d: '' })); });
const json = async u => { const r = await holen(u); if (r.s !== 200) throw new Error(r.s); return JSON.parse(r.d); };
const erster = async wege => { for (const w of [].concat(wege || []).filter(Boolean)) { try { return await json(BASIS + w); } catch (e) { } } return null; };
const ohneZahl = t => !/\d/.test(t || '');
const fang = p => p.route('**/studio/api/fehler', r => r.fulfill({ status: 200, body: '{}', contentType: 'application/json' }));

(async () => {
  const browser = await PW[ART].launch();
  const seite = (await holen(URL_)).d;
  const WEGE = JSON.parse(seite.match(/id="maison-wege">([^<]*)</)[1]);
  const REG = JSON.parse(seite.match(/id="maison-registre">([^<]*)</)[1]);
  const D = {}; for (const k of Object.keys(WEGE)) D[k] = await erster(WEGE[k]);
  console.log('Stand-Wege antworten:', Object.keys(D).map(k => k + '=' + (D[k] ? 'ja' : 'nein')).join(' '));
  try {
    for (const [w, h] of GROESSEN) {
      const gr = w + 'x' + h, handy = w < 800;
      if (NUR.length && !NUR.includes(String(w))) continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(handy && ART !== 'firefox' ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
      const p = await ctx.newPage(); await fang(p);
      const fehler = [], tot = [];
      const standweg = u => Object.values(WEGE).flat().some(x => x && u.includes(x.split('?')[0]));
      p.on('pageerror', e => fehler.push(String(e)));
      p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) fehler.push(m.text()); });
      p.on('response', r => { if (r.status() >= 400 && !standweg(r.url())) tot.push(r.status() + ' ' + r.url()); });
      const t0 = Date.now();
      await p.goto(URL_, { waitUntil: 'load' });
      await p.waitForTimeout(2000);
      notiz(gr, 'M00', 'Öffnen ohne Fehler', true, 'geladen in ' + (Date.now() - t0) + ' ms');
      await p.screenshot({ path: path.join(BELEGE, `${ART}-${gr}-oben.jpg`), type: 'jpeg', quality: 70 });
      const ueber = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      notiz(gr, 'R07', 'Kein seitliches Verrutschen', ueber[0] <= ueber[1], ueber.join(' / '));

      // M03 Gruss und Datum
      const gd = await p.evaluate(() => [document.querySelector('#gruss').textContent, document.querySelector('#datum').textContent]);
      notiz(gr, 'M03a', 'Gruss nach Tageszeit, Datum ausgeschrieben (de-CH)', /^Guten (Morgen|Tag|Abend)\.$/.test(gd[0]) && /\d{4}/.test(gd[1]) && /[A-Za-z]/.test(gd[1]), gd.join(' · '));
      if (w === 1440) for (const [q, soll] of [['morgen', 'Guten Morgen.'], ['tag', 'Guten Tag.'], ['abend', 'Guten Abend.']]) {
        const p2 = await ctx.newPage(); await fang(p2);
        await p2.goto(URL_ + '?gruss=' + q, { waitUntil: 'load' }); const g = await p2.textContent('#gruss'); await p2.close();
        notiz(gr, 'M03b', '?gruss=' + q, g === soll, g);
      }

      // M04 Wegweiser: sechs Schilder mit Raum, Raum gross daneben
      const k = await p.evaluate(() => [...document.querySelectorAll('.ws')].map(a => ({ href: a.getAttribute('href'), t: a.innerText.replace(/\s+/g, ' '), img: (() => { const i = a.querySelector('img'); return i.complete && i.naturalWidth > 0; })() })));
      const buehne = await p.evaluate(() => { const i = document.querySelector('.ww__raum.an'); return i && i.complete && i.naturalWidth > 0 && i.getBoundingClientRect().width > 100; });
      notiz(gr, 'M04', 'Sechs Schilder mit Raumbild, Raum gross daneben', k.length === 6 && k.every(x => x.img) && buehne, k.map(x => x.t.slice(0, 32)).join(' | '));
      if (!handy) {
        const wechsel = [];
        for (let i = 0; i < 6; i++) {
          await p.hover('.ws >> nth=' + i); await p.waitForTimeout(ART === 'webkit' ? 700 : 450);
          wechsel.push(await p.evaluate(i => { const r = document.querySelector('.ww__raum.an'); return r && r.dataset.raum === String(i) && r.complete && r.naturalWidth > 0 && document.querySelector('.ww__unter .an').dataset.raum === String(i); }, i));
        }
        notiz(gr, 'M04e', 'Zeiger auf einem Schild zeigt seinen Raum (harter Wechsel)', wechsel.every(Boolean), wechsel.join(','));
        await p.focus('.ws >> nth=3'); await p.waitForTimeout(500);
        const fokus = await p.evaluate(() => document.querySelector('.ww__raum.an').dataset.raum);
        notiz(gr, 'M04f', 'Tastatur-Fokus auf einem Schild zeigt seinen Raum', fokus === '3', 'Raum ' + fokus);
        const ueberblend = await p.evaluate(() => getComputedStyle(document.querySelector('.ww__raum')).transitionDuration);
        notiz(gr, 'M04g', 'Bildwechsel ohne Überblendung', /^0s/.test(ueberblend), ueberblend);
        await p.mouse.move(5, h - 5);
      }

      // M05 Stand je Werkzeug, so wie das Werkzeug ihn liefert; ohne Antwort ein Satz ohne Zahl
      for (const k0 of ['bureau', 'carte', 'reception', 'livre']) D[k0] = await erster(WEGE[k0]);   // frisch: andere Chats arbeiten gerade an den Werkzeugen
      await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1800);   // Seite und Werkzeug zur selben Zeit lesen
      const kurz = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-stand$="-kurz"]')].map(e => [e.dataset.stand, e.textContent.trim()])));
      const zahlen = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-zahl]')].map(e => [e.dataset.zahl, e.textContent.trim()])));
      if (D.bureau) {
        notiz(gr, 'M05a', 'Le Bureau: Stand aus dem Werkzeug', D.bureau.aenderungen > 0 ? kurz['bureau-kurz'].includes(String(D.bureau.aenderungen)) : /Nichts offen|Veröffentlicht/.test(kurz['bureau-kurz']), kurz['bureau-kurz']);
        notiz(gr, 'M05d', 'Le Bureau: Bereiche und Seiten aus dem Werkzeug', zahlen.bereiche === String((D.bureau.bereiche || []).length || '–') && zahlen.seiten === String(D.bureau.seiten || '–'), JSON.stringify(zahlen));
      } else notiz(gr, 'M05a', 'Le Bureau antwortet nicht: Satz ohne Zahl, «–»', ohneZahl(kurz['bureau-kurz']) && zahlen.bereiche === '–' && zahlen.seiten === '–', kurz['bureau-kurz'] + ' · ' + zahlen.bereiche + '/' + zahlen.seiten);
      if (D.carte) notiz(gr, 'M05b', 'La Carte: Karten und Entwürfe aus dem Werkzeug', zahlen.karten === String(D.carte.karten.length) && zahlen.entwurf === String(D.carte.karten.filter(x => x.entwurf).length), kurz['carte-kurz'] + ' · ' + JSON.stringify(zahlen));
      else notiz(gr, 'M05b', 'La Carte antwortet nicht: Satz ohne Zahl, «–»', ohneZahl(kurz['carte-kurz']) && zahlen.karten === '–', kurz['carte-kurz']);
      if (D.reception) notiz(gr, 'M05c', 'La Réception: Stand aus dem Eingang', D.reception.anfragen_neu ? kurz['reception-kurz'].includes(String(D.reception.anfragen_neu)) : true, kurz['reception-kurz']);
      else notiz(gr, 'M05c', 'La Réception antwortet nicht: Satz ohne Zahl', ohneZahl(kurz['reception-kurz']), kurz['reception-kurz']);
      if (D.livre && D.livre.stand) notiz(gr, 'M05e', 'Le Livre: Fotos und Dateien aus livre.json', kurz['livre-kurz'] === `${D.livre.stand.fotos} Fotos · ${D.livre.stand.dateien} Dateien`, kurz['livre-kurz']);
      else notiz(gr, 'M05e', 'Le Livre antwortet nicht: Satz ohne Zahl', ohneZahl(kurz['livre-kurz']), kurz['livre-kurz']);
      D.imprimerie = await erster(WEGE.imprimerie);
      if (Array.isArray(D.imprimerie)) notiz(gr, 'M05f', 'L’Imprimerie: Zahl der Vorlagen und Arten aus ihrer Liste', kurz['imprimerie-kurz'] === D.imprimerie.reduce((a, x) => a + x.zahl, 0) + ' Vorlagen in ' + new Set(D.imprimerie.map(x => x.art)).size + ' Arten', kurz['imprimerie-kurz']);
      else notiz(gr, 'M05f', 'L’Imprimerie antwortet nicht: Satz ohne Zahl', ohneZahl(kurz['imprimerie-kurz']), kurz['imprimerie-kurz']);

      // M06 Zahlenzeile: heute, Tageswert zur Buchung (F40), als Beispiel beschriftet
      const zl = await p.evaluate(() => { const z = document.querySelector('.ww__zeile'); return { t: z.innerText.replace(/\s+/g, ' '), b: z.classList.contains('beispiel'), nach: getComputedStyle(z.querySelector('span'), '::after').content, heute: z.querySelector('[data-stand="registre-heute"]').textContent, buch: z.querySelector('[data-stand="registre-buchung"]').textContent, a: z.querySelector('a').getAttribute('href') }; });
      let R2 = null; try { R2 = await json(BASIS + [].concat(WEGE.registre)[0]); } catch (e) { }
      if (!R2) {   // Dienst aus: die Seite liest die Ablage und kürzt sie auf jetzt; Vergleich mit dem Werkzeug selbst, das dieselbe Ablage gleich kürzt
        const pw3 = await ctx.newPage(); await pw3.route('**/api/registre*', r => r.fulfill({ status: 503, body: 'x' }));
        await pw3.goto(BASIS + '/_werkzeuge/registre/', { waitUntil: 'load' }); await pw3.waitForTimeout(2500);
        R2 = await pw3.evaluate(() => { try { return JSON.parse(JSON.stringify(S.d)); } catch (e) { return null; } }); await pw3.close();
      }
      if (R2) {
        const jt = R2.je_tag && R2.je_tag[R2.je_tag.length - 1];
        const R3 = await json(BASIS + [].concat(WEGE.registre)[0]).catch(() => null);   // Beispielwerte laufen «genau bis jetzt» mit (G11): vor und nach dem Lesen der Seite gelten beide
        if (R3 && String(R3.summe.heute) === zl.heute) R2.summe.heute = R3.summe.heute;
        notiz(gr, 'M06', 'Zahlenzeile: heute, Tageswert zur Buchung, «Beispiel»', zl.heute === String(R2.summe.heute) && zl.buch === (jt && jt.buchung !== undefined ? String(jt.buchung) : '–') && (!R2.beispiel || (zl.b && /Beispiel/.test(zl.nach))), zl.t + ' ' + zl.nach + ' · erwartet heute ' + R2.summe.heute + ', Buchung ' + (jt && jt.buchung));
      } else notiz(gr, 'M06', 'Zahlenzeile ohne Zählung: «–»', zl.heute === '–' && zl.buch === '–', zl.t);

      // M01 Leiste
      const insel = await p.evaluate(() => [...document.querySelectorAll('.m-insel__p')].map(a => ({ h: a.getAttribute('href'), sichtbar: getComputedStyle(a).display !== 'none' && a.getBoundingClientRect().width > 0 })));
      if (w >= 1360) {
        notiz(gr, 'M01a', 'Insel: Zeichen, «La Maison», sechs Sprungmarken', insel.length === 6 && insel.every(x => x.sichtbar) && await p.evaluate(() => !!document.querySelector('.m-insel__marke svg.tn') && /La Maison/.test(document.querySelector('.m-insel__marke').textContent)), insel.map(x => x.h).join(' '));
        for (const x of insel) {
          await p.click(`.m-insel__p[href="${x.h}"]`); await p.waitForTimeout(700);
          for (let n = 0, alt = -1, ruhig = 0; n < 24 && ruhig < 2; n++) { await p.waitForTimeout(250); const y = await p.evaluate(() => scrollY); ruhig = y === alt ? ruhig + 1 : 0; alt = y; }
          await p.waitForTimeout(300);
          const lage = await p.evaluate(h => { const s = document.querySelector(h).getBoundingClientRect(); return [Math.round(s.top), document.querySelector(`.m-insel__p[href="${h}"]`).classList.contains('an')]; }, x.h);
          notiz(gr, 'M01b', 'Sprungmarke ' + x.h + ' springt, ist markiert', Math.abs(lage[0]) < h * 0.5 && lage[1], 'Oberkante ' + lage[0] + ', markiert ' + lage[1]);
        }
        await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400);
        const vor = await p.evaluate(() => getComputedStyle(document.querySelector('.m-insel__p .rl b')).transform);
        await p.hover('.m-insel__p >> nth=0'); await p.waitForTimeout(160);
        const nach = await p.evaluate(() => getComputedStyle(document.querySelector('.m-insel__p .rl b')).transform);
        notiz(gr, 'M01c', 'Buchstaben rollen beim Überfahren', vor !== nach, vor + ' → ' + nach);
      } else notiz(gr, 'M01d', 'Unter 1360 px nur die Marke in der Insel', insel.every(x => !x.sichtbar), insel.map(x => x.sichtbar).join(','));

      // M02 Eck-Knöpfe
      const ecken = await p.evaluate(() => [...document.querySelectorAll('.m-oben__ecke')].map(a => ({ t: a.textContent.trim(), h: a.getAttribute('href'), z: a.target, glanz: a.classList.contains('glanz-kn'), sichtbar: a.getBoundingClientRect().width > 0 && getComputedStyle(a).display !== 'none' })));
      notiz(gr, 'M02a', 'Eck-Knöpfe «Anleitungen» und «Website ansehen» mit Glanzkante', ecken.length === 2 && ecken.every(e => e.glanz) && ecken[1].z === '_blank' && ecken[1].h === '/index.html', JSON.stringify(ecken.map(e => e.t + ' ' + e.h + ' ' + e.sichtbar)));
      if (ecken[0].sichtbar) { await p.click('.m-oben__ecke >> nth=0'); await p.waitForTimeout(1500); const f = await p.evaluate(() => Math.round(document.querySelector('#fuss').getBoundingClientRect().top)); notiz(gr, 'M02b', '«Anleitungen» springt zum Fuss', f < h, 'Fuss oben bei ' + f); }
      else notiz(gr, 'M02b', '«Anleitungen» am Handy ausgeblendet (wie Vorlage)', true, 'nicht sichtbar');

      // M07 Goldband
      await p.evaluate(() => document.querySelector('.m-goldband').scrollIntoView({ block: 'center', behavior: 'instant' })); await p.waitForTimeout(900);
      const gb = await p.evaluate(() => [document.querySelector('.m-goldband').classList.contains('laeuft'), getComputedStyle(document.querySelector('.m-goldband__zug')).animationPlayState]);
      if (!handy) { await p.hover('.m-goldband'); await p.waitForTimeout(200); }
      const halt = handy ? 'paused' : await p.evaluate(() => getComputedStyle(document.querySelector('.m-goldband__zug')).animationPlayState);
      await p.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(900);
      const gb2 = await p.evaluate(() => document.querySelector('.m-goldband').classList.contains('laeuft'));
      notiz(gr, 'M07', 'Goldband läuft nur im Bild, hält beim Überfahren', gb[0] && gb[1] === 'running' && !gb2 && halt === 'paused', `im Bild ${gb.join('/')}, überfahren ${halt}, ausserhalb läuft=${gb2}`);

      // M08/M09 Etappen
      await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const hoehe = await p.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < hoehe; y += Math.round(h * 0.6)) { await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(140); }
      await p.waitForTimeout(1600);
      const offen = await p.evaluate(() => [...document.querySelectorAll('[data-r]')].filter(e => !e.classList.contains('da')).map(e => e.className || e.tagName));
      notiz(gr, 'M09a', 'Nach dem Durchscrollen ist jedes Stück angekommen', offen.length === 0, offen.slice(0, 6).join(', ') || 'alle da');
      const platte = await p.evaluate(() => [...document.querySelectorAll('.m-saal+.m-saal')].every(s => parseFloat(getComputedStyle(s).borderTopLeftRadius) > 10 && parseFloat(getComputedStyle(s).marginTop) < 0));
      notiz(gr, 'M09b', 'Jede Etappe schiebt sich als Platte mit runden Ecken über die vorige', platte, String(platte));
      const bilder = await p.evaluate(() => [...document.querySelectorAll('img')].filter(i => i.getClientRects().length && getComputedStyle(i).display !== 'none' && getComputedStyle(i).visibility !== 'hidden' && !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src')));
      notiz(gr, 'M15', 'Alle Bilder geladen, wenn ihr Stück ankommt', bilder.length === 0, bilder.join(', ') || 'alle');
      const saele = await p.evaluate(() => [...document.querySelectorAll('.m-saal')].map(s => ({ id: s.id, titel: s.querySelector('.m-titel').textContent.trim(), tafel: [...s.querySelectorAll('.m-tafel__z b')].map(b => b.textContent), kn: [...s.querySelectorAll('a.kn')].map(a => a.getAttribute('href')), zahlen: s.querySelectorAll('.m-zahl [data-mw]').length, schirme: s.querySelectorAll('.m-schirm').length, platz: s.querySelectorAll('.m-schirm--platz').length })));
      notiz(gr, 'M08a', 'Sechs Etappen mit Zeichen, Titel, Satz, Bühne, Tafel «So geht’s» und Knopf', saele.length === 6 && saele.every(s => (s.tafel.length >= 3 || (s.id === 'registre' && s.zahlen >= 4)) && s.kn.length >= 1 && s.schirme >= 1), saele.map(s => s.id + ':' + s.tafel.length + '/' + s.schirme).join(' '));
      const platz = saele.filter(s => s.platz).map(s => s.id + ' ' + s.platz);
      notiz(gr, 'M08b', 'Echte Bildschirme der Werkzeuge (Platzhalter nur, wo noch nicht geliefert)', platz.length === 0 ? true : null, platz.length ? 'Platzhalter: ' + platz.join(', ') : 'alle echt');
      await p.screenshot({ path: path.join(BELEGE, `${ART}-${gr}-ganz.jpg`), type: 'jpeg', quality: 50, fullPage: true });

      // M10 Fuss
      const fuss = await p.evaluate(() => ({ t: document.querySelector('#fuss').innerText.replace(/\s+/g, ' '), a: [...document.querySelectorAll('#fuss a')].map(a => a.getAttribute('href')) }));
      notiz(gr, 'M10', 'Fuss: Haus, Anleitungen (wo es sie gibt), Fragen, kein fester Werkbank-Knopf', /Doldenhornstrasse 26, 3718 Kandersteg/.test(fuss.t) && /robert@tasty-studios\.de/.test(fuss.t) && !fuss.a.some(x => /werkbank/.test(x)), fuss.a.join(' '));

      notiz(gr, 'K01', 'Keine Skriptfehler', fehler.length === 0, fehler.join(' | ') || 'keine');
      notiz(gr, 'K02', 'Keine toten Anfragen (ausser Stand-Wegen nicht laufender Werkzeuge)', tot.length === 0, tot.join(' | ') || 'keine');

      // M12 Taste 1 bis 6, M04b Klick auf jedes Schild (Ziel muss antworten, sonst «offen»: Werkzeug-Server läuft nicht)
      if (!handy) {
        for (let i = 1; i <= 6; i++) {
          await p.goto(URL_, { waitUntil: 'load' }); await p.waitForTimeout(600);
          const soll = await p.evaluate(i => document.querySelectorAll('.ws')[i - 1].href, i);
          const lebt = (await holen(soll)).s === 200;
          if (!lebt) { notiz(gr, 'M12', 'Taste ' + i + ' öffnet das Werkzeug', null, 'Werkzeug antwortet nicht: ' + soll); continue; }
          await Promise.all([p.waitForURL(u => String(u).startsWith(soll.split('#')[0]), { timeout: 15000 }).catch(() => { }), p.keyboard.press(String(i))]);
          notiz(gr, 'M12', 'Taste ' + i + ' öffnet das Werkzeug', p.url().startsWith(soll.split('#')[0]), p.url());
        }
        for (let i = 0; i < 6; i++) {
          await p.goto(URL_, { waitUntil: 'load' }); await p.waitForTimeout(500);
          const soll = await p.evaluate(i => document.querySelectorAll('.ws')[i].href, i);
          if ((await holen(soll)).s !== 200) { notiz(gr, 'M04b', 'Klick auf Schild ' + (i + 1) + ' öffnet das Werkzeug', null, 'Werkzeug antwortet nicht: ' + soll); continue; }
          await Promise.all([p.waitForURL(u => String(u).startsWith(soll), { timeout: 15000 }).catch(() => { }), p.click('.ws >> nth=' + i)]);
          let da = false;
          for (let n = 0; n < 14 && !da; n++) { await p.waitForTimeout(500); da = await p.evaluate(() => document.body.innerText.length > 200 && !/startet nicht/.test(document.body.innerText.slice(0, 300))).catch(() => false); }
          notiz(gr, 'M04b', 'Klick auf Schild ' + (i + 1) + ' öffnet das Werkzeug', p.url().startsWith(soll) && da, p.url());
          await p.goBack({ waitUntil: 'load' }).catch(() => { });
          notiz(gr, 'M04c', 'Zurück in La Maison', /\/maison\//.test(p.url()), p.url());
        }
      } else {
        await p.goto(URL_, { waitUntil: 'load' }); await p.waitForTimeout(800);
        const soll = await p.evaluate(() => document.querySelectorAll('.ws')[0].href);
        if ((await holen(soll)).s !== 200) notiz(gr, 'M04b', 'Antippen von Schild 1 öffnet das Werkzeug', null, 'Werkzeug antwortet nicht: ' + soll);
        else { await Promise.all([p.waitForURL(u => String(u).startsWith(soll), { timeout: 15000 }).catch(() => { }), p.tap ? p.tap('.ws >> nth=0').catch(() => p.click('.ws >> nth=0')) : p.click('.ws >> nth=0')]); notiz(gr, 'M04b', 'Antippen von Schild 1 öffnet das Werkzeug', p.url().startsWith(soll), p.url()); }
      }

      // L01 Jeder Link antwortet
      if (w === 1440) {
        await p.goto(URL_, { waitUntil: 'load' });
        const links = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /^http/.test(h)).map(h => h.split('#')[0]))]);
        const kaputt = [], aus = [];
        for (const l of links) { const s = (await holen(l)).s; if (s === 200) continue; (/localhost:(89[3-4]\d)/.test(l) && !l.startsWith(BASIS) ? aus : kaputt).push(s + ' ' + l); }
        notiz(gr, 'L01', 'Jeder Link antwortet (' + links.length + ')', kaputt.length === 0 ? (aus.length ? null : true) : false, (kaputt.concat(aus.map(x => 'Werkzeug läuft nicht: ' + x)).join(' | ')) || 'alle 200');
      }

      // M11 Rundgang
      const pr = await ctx.newPage(); await fang(pr);
      await pr.goto(URL_ + '?rundgang', { waitUntil: 'load' }); await pr.waitForSelector('.rdg-karte', { timeout: 12000 }).catch(() => { });
      let schritte = 0; const titel = [];
      for (let i = 0; i < 8; i++) {
        const k2 = await pr.$('.rdg-karte'); if (!k2) break;
        titel.push((await k2.innerText()).split('\n').filter(Boolean)[1] || ''); schritte++;
        if (i === 0) { await pr.keyboard.press('2'); await pr.waitForTimeout(400); }
        const los = await pr.$('.rdg-karte .rdg-los'); if (!los) break; await los.click(); await pr.waitForTimeout(900);
      }
      notiz(gr, 'M11a', 'Rundgang mit ?rundgang: fünf Schritte bis zum Ende, Taste 2 still', schritte === 5 && /\/maison\//.test(pr.url()) && !(await pr.$('.rdg-karte')), schritte + ' Karten: ' + titel.join(' / '));
      await pr.screenshot({ path: path.join(BELEGE, `${ART}-${gr}-rundgang-ende.jpg`), type: 'jpeg', quality: 55 });
      await pr.close();
      const pw2 = await ctx.newPage(); await fang(pw2); await pw2.goto(URL_, { waitUntil: 'load' }); await pw2.waitForTimeout(2000);
      notiz(gr, 'M11b', 'Prüfbrowser (webdriver) sieht keinen Rundgang', !(await pw2.$('.rdg-karte')), 'kein Rundgang');
      await pw2.close();

      // R19 Zur Werkbank nur mit Herkunft aus der Werkbank
      const pz = await ctx.newPage(); await fang(pz);
      await pz.goto(URL_, { waitUntil: 'load' }); await pz.waitForTimeout(1200);
      const ohne = !!(await pz.$('#zur-werkbank'));
      await pz.goto(URL_ + '?wb=de.werkzeuge', { waitUntil: 'load' }); await pz.waitForTimeout(1500);
      const mit = await pz.evaluate(() => { const w = document.querySelector('#zur-werkbank'); if (!w) return null; const a = w.shadowRoot ? w.shadowRoot.querySelector('a') : w.querySelector('a'); return a ? a.href : 'ohne Link'; });
      notiz(gr, 'R19', '«Zur Werkbank» nur aus der Werkbank geöffnet', !ohne && mit && /werkbank\/(index\.html)?#werkzeuge/.test(mit) && !/wb=/.test(pz.url()), `ohne Herkunft: ${ohne}, mit: ${mit}, Adresse danach ${pz.url()}`);
      if (mit) await pz.screenshot({ path: path.join(BELEGE, `${ART}-${gr}-zur-werkbank.jpg`), type: 'jpeg', quality: 60 });
      await pz.close();
      await ctx.close();

      // R17 Weniger Bewegung
      const cr = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
      const prm = await cr.newPage(); await fang(prm);
      await prm.goto(URL_, { waitUntil: 'load' }); await prm.waitForTimeout(500);
      const ruhig0 = await prm.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && a.animationName).map(a => a.animationName + ' ' + (a.effect && a.effect.target && a.effect.target.className)));
      await prm.evaluate(() => document.querySelector('#imprimerie').scrollIntoView()); await prm.waitForTimeout(150);
      const ruhig = await prm.evaluate(() => { const s = [...document.querySelectorAll('[data-r]')].filter(e => getComputedStyle(e).opacity !== '1').map(e => 'unsichtbar ' + e.className); const a = document.getAnimations().filter(a => a.playState === 'running' && !/^(color|background-color|border-color|box-shadow)$/.test(a.transitionProperty || '')).map(a => 'läuft ' + (a.animationName || a.transitionProperty || '?')); return s.concat(a); });
      const band = await prm.evaluate(() => getComputedStyle(document.querySelector('.m-goldband__zug')).animationName);
      notiz(gr, 'R17', '«Weniger Bewegung»: Schilder und Stücke stehen sofort, Band steht', ruhig0.length === 0 && ruhig.length === 0 && band === 'none', (ruhig0.concat(ruhig).slice(0, 4).join(' ; ') || 'alles ruhig') + ' · Band ' + band);
      await cr.close();

      // R04 Startfehler-Tür und R03 Fehlermelder
      const cf = await browser.newContext({ viewport: { width: w, height: h } });
      const pf = await cf.newPage(); let gemeldet = '';
      await pf.route('**/studio/api/fehler', r => { gemeldet = r.request().postData() || ''; r.fulfill({ status: 200, body: '{}' }); });
      await pf.route('**/maison/maison.js*', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: 'throw new Error("Probefehler der Prüfung")' }));
      pf.on('pageerror', () => { });
      await pf.goto(URL_, { waitUntil: 'load' }); await pf.waitForTimeout(1300);
      const tuer = await pf.evaluate(() => ({ offen: !document.querySelector('#tuer').hidden, t: document.querySelector('#tuer').innerText.replace(/\s+/g, ' '), js: document.documentElement.classList.contains('js'), merk: localStorage.getItem('dh_fehler'), schilder: [...document.querySelectorAll('.ws')].every(s => getComputedStyle(s).opacity === '1') }));
      notiz(gr, 'R04', 'Startfehler-Tür mit Grund und «Prüfung öffnen», Seite bleibt sichtbar', tuer.offen && /startet nicht/.test(tuer.t) && /Prüfung öffnen/i.test(tuer.t) && !tuer.js && tuer.schilder, tuer.t);
      notiz(gr, 'R03', 'Fehlermelder schreibt nach dh_fehler und an Le Bureau (abgefangen)', /Probefehler/.test(tuer.merk || '') && /La Maison · .*Probefehler/.test(gemeldet), (tuer.merk || '').slice(0, 110) + ' · ' + gemeldet.slice(0, 80));
      await pf.screenshot({ path: path.join(BELEGE, `${ART}-${gr}-startfehler.jpg`), type: 'jpeg', quality: 60 });
      const pf2 = await cf.newPage(); await fang(pf2);
      await pf2.route('**/maison/maison.js*', r => r.fulfill({ status: 404, body: 'weg' }));
      await pf2.goto(URL_, { waitUntil: 'load' }); await pf2.waitForTimeout(1000);
      const t2 = await pf2.evaluate(() => !document.querySelector('#tuer').hidden && document.querySelector('#tuer-t').textContent);
      notiz(gr, 'R04b', 'Tür auch, wenn maison.js fehlt', !!t2, t2);
      // Zwanzig Fehler höchstens, Netzfehler nie
      const pf3 = await cf.newPage(); let anzahl = 0;
      await pf3.route('**/studio/api/fehler', r => { anzahl++; r.fulfill({ status: 200, body: '{}' }); }); pf3.on('pageerror', () => { });
      await pf3.goto(URL_, { waitUntil: 'load' }); await pf3.waitForTimeout(600);
      await pf3.evaluate(() => { for (let i = 0; i < 30; i++) setTimeout(() => { throw new Error('Serie ' + i); }, i); setTimeout(() => { throw new Error('Failed to fetch'); }, 40); });
      await pf3.waitForTimeout(800);
      notiz(gr, 'R03b', 'Fehlermelder: höchstens 20 je Seite, Netzfehler nie', anzahl === 20, anzahl + ' gemeldet');
      await cf.close();

      // M05 mit Antworten in der Form aus Master 4.1 (Probe-Antworten, so wie die Werkzeuge sie liefern), dann Ausfall und Netz weg
      const cs = await browser.newContext({ viewport: { width: w, height: h } });
      const ps = await cs.newPage(); await fang(ps);
      const probe = { bureau: { aenderungen: 3, zuletzt: { zeit: '2026-10-16 18:05:00' }, bereiche: [1, 2, 3, 4, 5, 6, 7], seiten: 25, sprachen: ['de'] }, carte: { karten: [{ entwurf: true, pdf_zeit: '16.10.2026 17:40' }, { entwurf: false, pdf_zeit: '15.10.2026 09:12' }, { entwurf: false, pdf_zeit: '' }] },
        reception: { anfragen_neu: 2, anfragen_offen: 5, ohne_antwort: 1, fragen_gesamt: 14 }, livre: { stand: { fotos: 180, ki: 4, ue: 12, dateien: 33 } } };
      const pfad = { bureau: '**/studio/api/ueberblick*', carte: '**/_werkzeuge/carte/api/status*', reception: '**/_werkzeuge/reception/api/ueberblick*', livre: /\/(marke|_werkzeuge\/livre)\/livre\.json/ };
      for (const k2 of Object.keys(probe)) await ps.route(pfad[k2], r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(probe[k2]) }));
      await ps.goto(URL_, { waitUntil: 'load' }); await ps.waitForTimeout(1500);
      const s = await ps.evaluate(() => ({ kurz: Object.fromEntries([...document.querySelectorAll('[data-stand]')].map(e => [e.dataset.stand, e.textContent.trim()])), z: Object.fromEntries([...document.querySelectorAll('[data-zahl]')].map(e => [e.dataset.zahl, e.textContent.trim()])) }));
      notiz(gr, 'M05g', 'Probe-Antworten: Bureau 3 im Entwurf, 7 Bereiche, 25 Seiten, 1 Sprache', s.kurz['bureau-kurz'] === '3 im Entwurf' && s.z.bereiche === '7' && s.z.seiten === '25' && s.z.sprachen === '1' && /16\.10\.2026/.test(s.kurz.bureau), s.kurz['bureau-kurz'] + ' · ' + s.kurz.bureau);
      notiz(gr, 'M05h', 'Probe-Antworten: Carte 3 Karten, 1 Entwurf, neueste PDF 16.10.', s.z.karten === '3' && s.z.entwurf === '1' && s.z.pdf === '16.10.' && s.kurz['carte-kurz'] === '1 im Entwurf', JSON.stringify(s.z));
      notiz(gr, 'M05j', 'Probe-Antworten: Réception 2 neue, 1 Frage ohne Antwort', s.kurz['reception-kurz'] === '2 neue Anfragen · 1 Frage ohne Antwort', s.kurz['reception-kurz']);
      notiz(gr, 'M05k', 'Probe-Antworten: Livre 180 Fotos, 33 Dateien, KI und nachgeschärft getrennt', s.kurz['livre-kurz'] === '180 Fotos · 33 Dateien' && /4 mit KI erzeugt und 12 nachgeschärft/.test(s.kurz.livre), s.kurz.livre);
      for (const k2 of Object.keys(probe)) await ps.unroute(pfad[k2]);
      await ps.route(pfad.bureau, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(Object.assign({}, probe.bureau, { sprachen: 0, aenderungen: 0 })) }));
      await ps.reload({ waitUntil: 'load' }); await ps.waitForTimeout(1200);
      const sp = await ps.evaluate(() => [document.querySelector('[data-zahl="sprachen"]').textContent, document.querySelector('[data-stand="bureau-kurz"]').textContent]);
      notiz(gr, 'M05l', 'Le Bureau meldet keine weitere Sprache: «Deutsch»; nichts offen: «Veröffentlicht <Datum>»', sp[0] === 'Deutsch' && sp[1] === 'Veröffentlicht 16.10.2026', sp.join(' · '));
      await ps.unroute(pfad.bureau);
      await ps.route(pfad.carte, r => r.fulfill({ status: 500, body: 'x' }));
      await ps.route(pfad.bureau, r => r.abort('internetdisconnected'));
      await ps.route(pfad.reception, r => r.fulfill({ status: 200, contentType: 'application/json', body: '' }));
      await ps.route(pfad.livre, r => r.fulfill({ status: 404, body: 'weg' }));
      await ps.route('**/vorlagen/index.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
      await ps.route('**/api/registre*', r => r.fulfill({ status: 503, body: 'x' })); await ps.route('**/registre/beispiel/30.json', r => r.fulfill({ status: 404, body: 'x' }));
      await ps.reload({ waitUntil: 'load' }); await ps.waitForTimeout(1500);
      const s2 = await ps.evaluate(() => ({ kurz: Object.fromEntries([...document.querySelectorAll('[data-stand]')].map(e => [e.dataset.stand, e.textContent.trim()])), z: Object.fromEntries([...document.querySelectorAll('[data-zahl]')].map(e => [e.dataset.zahl, e.textContent.trim()])) }));
      const alleOhne = ['bureau-kurz', 'carte-kurz', 'reception-kurz', 'livre-kurz', 'imprimerie-kurz', 'bureau'].every(x => ohneZahl(s2.kurz[x])) && Object.values(s2.z).every(v => v === '–') && s2.kurz['registre-heute'] === '–' && s2.kurz['registre-buchung'] === '–';
      notiz(gr, 'M05i', 'Werkzeug fällt aus (500, leer, 404, Netz weg): Satz ohne Zahl, «–», nichts geschätzt', alleOhne && /nicht abrufbar/.test(s2.kurz.bureau) && /nicht abrufbar/.test(s2.kurz.besuche), JSON.stringify(s2.kurz).slice(0, 300));
      // M14 Ersatzweg: erster Weg Le Registre fällt aus, zweiter antwortet
      await ps.unroute('**/registre/beispiel/30.json');
      await ps.route('**/registre/beispiel/30.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tage: 30, beispiel: true, leer: false, summe: { heute: 17, besuche: 400, seiten: 900, laender: 5 }, je_tag: [{ buchung: 9 }, { buchung: 4 }], werte: {} }) }));
      await ps.reload({ waitUntil: 'load' }); await ps.waitForTimeout(1500);
      const s3 = await ps.evaluate(() => [document.querySelector('[data-stand="registre-heute"]').textContent, document.querySelector('[data-stand="registre-buchung"]').textContent, document.querySelector('[data-stand="besuche"]').textContent]);
      notiz(gr, 'M14', 'Stand-Weg mit Ersatz: erster fällt aus, zweiter gilt; «zur Buchung» = Tageswert (4, nicht 13)', s3[0] === '17' && s3[1] === '4' && /^Beispielwerte · Letzte 30 Tage/.test(s3[2]), s3.join(' · '));
      // M14b Ersatzweg mit der abgelegten Datei des Werkzeugs: auf jetzt gekürzt, gleiche Zahlen wie das Werkzeug selbst (Le Registre ohne Dienst, gleiche Ablage)
      await ps.unroute('**/registre/beispiel/30.json');
      await ps.reload({ waitUntil: 'load' }); await ps.waitForTimeout(1500);
      const s4 = await ps.evaluate(() => [document.querySelector('[data-stand="registre-heute"]').textContent, document.querySelector('[data-stand="besuche"]').textContent, (document.querySelector('[data-mw="start"]') || {}).textContent]);
      const pr2 = await cs.newPage(); await pr2.route('**/api/registre*', r => r.fulfill({ status: 503, body: 'x' }));
      await pr2.goto(BASIS + '/_werkzeuge/registre/', { waitUntil: 'load' }); await pr2.waitForTimeout(2500);
      const wz = await pr2.evaluate(() => { try { return [String(S.d.summe.heute), S.d.summe.besuche.toLocaleString('de-CH'), S.d.werte.start.anteil.toLocaleString('de-CH', { maximumFractionDigits: 1 }) + '\u00a0%', S.ablage]; } catch (e) { return null; } });
      notiz(gr, 'M14b', 'Ersatzweg (abgelegte Beispielwerte): auf jetzt gekürzt, gleiche Zahlen wie das Werkzeug', wz && s4[0] === wz[0] && s4[1].includes(wz[1] + ' Besuche') && s4[2] === wz[2], s4.join(' · ') + ' · Werkzeug ' + JSON.stringify(wz));
      await pr2.close();
      await cs.close();

      // S01/S02 Ungewöhnliche Werte aus den Werkzeugen
      const cx = await browser.newContext({ viewport: { width: w, height: h } });
      const px = await cx.newPage(); await fang(px);
      const boes = '<img src=x onerror="window.__boes=1">', lang = 'Ä'.repeat(5000);
      await px.route('**/studio/api/ueberblick*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ aenderungen: boes, seiten: '<b>9</b>', bereiche: [1, 2, 3], sprachen: boes, zuletzt: { zeit: '🙂 ' + lang } }) }));
      await px.route(/\/(marke|_werkzeuge\/livre)\/livre\.json/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ stand: { fotos: boes, dateien: 'Ünïcödé 🙂 ' + lang, ki: '<script>window.__boes=2</script>', ue: '🙂' } }) }));
      await px.route('**/_werkzeuge/carte/api/status*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ karten: [{ entwurf: boes, pdf_zeit: boes + lang }] }) }));
      await px.route('**/_werkzeuge/reception/api/ueberblick*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ anfragen_neu: boes, ohne_antwort: '🙂', fragen_gesamt: lang }) }));
      await px.route('**/api/registre*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tage: boes, beispiel: true, summe: { heute: boes, besuche: lang, seiten: '🙂' }, werte: { start: { zahl: boes, von: 3, anteil: '<b>' } }, je_tag: [{ buchung: boes }] }) }));
      await px.route('**/vorlagen/index.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ art: boes, zahl: boes }, { art: lang, zahl: '<b>3</b>' }]) }));
      const fx = []; px.on('pageerror', e => fx.push(String(e)));
      await px.goto(URL_, { waitUntil: 'load' }); await px.waitForTimeout(1500);
      const sx = await px.evaluate(() => ({ boes: window.__boes, img: document.querySelectorAll('img[src="x"]').length, script: [...document.querySelectorAll('script')].some(s => /__boes/.test(s.textContent)), breit: document.documentElement.scrollWidth, innen: innerWidth, bureau: document.querySelector('[data-stand="bureau"]').textContent.slice(0, 80), livre: document.querySelector('[data-stand="livre-kurz"]').textContent.slice(0, 60), impr: document.querySelector('[data-stand="imprimerie-kurz"]').textContent.slice(0, 60), heute: document.querySelector('[data-stand="registre-heute"]').textContent }));
      notiz(gr, 'S01', 'Schadcode aus Werkzeug-Antworten wird nicht ausgeführt, nur Zahlen gehen in die Seite', !sx.boes && !sx.img && !sx.script && fx.length === 0, JSON.stringify(sx).slice(0, 300));
      notiz(gr, 'S02', '5000 Zeichen, Emoji, Umlaute: kein seitliches Verrutschen', sx.breit <= sx.innen, sx.breit + ' / ' + sx.innen);
      await cx.close();

      // M04d Schilder deckend ab dem ersten Bild, Auftakt nach dem Dekodieren
      const c4 = await browser.newContext({ viewport: { width: w, height: h } }); const p4 = await c4.newPage(); await fang(p4);
      await p4.goto(URL_, { waitUntil: 'commit' });
      await p4.waitForSelector('.ws'); const op = await p4.evaluate(() => [...document.querySelectorAll('.ws, .ww__raum.an, .ww__titel')].map(k => getComputedStyle(k).opacity));
      await p4.waitForTimeout(2500); const bereit = await p4.evaluate(() => document.querySelector('.ww__pfosten').classList.contains('bereit'));
      notiz(gr, 'M04d', 'Schilder deckend ab dem ersten Bild, Auftakt nach dem Dekodieren', op.every(o => o === '1') && bereit, op.join(',') + ' · bereit ' + bereit);
      await c4.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(__dirname, `ergebnis-${ART}.json`), JSON.stringify(erg, null, 1));
    const rot = erg.filter(x => x.ok === false), offen = erg.filter(x => x.ok === null);
    console.log(`\n${ART}: ${erg.length - rot.length - offen.length} grün, ${rot.length} rot, ${offen.length} offen (von ${erg.length})`);
  }
})();

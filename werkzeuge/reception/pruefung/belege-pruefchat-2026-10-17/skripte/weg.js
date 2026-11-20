// Prüf-Chat La Réception Doldenhorn (17.10.2026): keine Anfrage geht verloren. Bedient die echten Fenster der Website (assets/js/anfrage.js) wie ein Gast,
// dann La Réception wie das Team. Läuft nur gegen die Probe-Kopie B (Hausserver HAUS, La Réception RECEPTION), Wegwerf-Daten, Probe-Antworten.
//   node weg.js <motor> <breite> <hoehe> <beleg-ordner>
const path = require('path'), fs = require('fs');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const [, , MOTOR = 'chromium', BREITE = '1440', HOEHE = '900', BEL = '/tmp'] = process.argv;
const W = +BREITE, H = +HOEHE, HANDY = W < 700;
const HAUS = process.env.HAUS || 'http://127.0.0.1:18955', RO = process.env.RO || 'http://localhost:18954', R = RO + '/_werkzeuge/reception/';
const M = MOTOR.slice(0, 2) + W;   // Kennung je Lauf, kurz (keine 8 Ziffern am Stück: ABDECKEN)
const res = [], fehler = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (b, was) => { if (!b) throw new Error(was); };
const haus = async (m, d) => (await fetch(HAUS + '/api/anfragen', { method: m, headers: { 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'same-origin' }, body: d ? JSON.stringify(d) : undefined })).json();
const rez = async (was, d) => (await fetch(R + 'api/' + was, d ? { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: RO }, body: JSON.stringify(d) } : {})).json();

(async () => {
  fs.mkdirSync(BEL, { recursive: true });
  const br = await pw[MOTOR].launch();
  const ctx = await br.newContext({ viewport: { width: W, height: H }, locale: 'de-CH', hasTouch: HANDY, isMobile: HANDY && MOTOR === 'chromium', acceptDownloads: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('reception-name', 'Prüf Chat'); localStorage.setItem('rundgang-dh-reception', '1'); localStorage.setItem('dh-cookie', '1'); } catch (e) { /* */ } });
  const p = await ctx.newPage(); p.setDefaultTimeout(15000);
  p.on('pageerror', e => fehler.push('JS ' + String(e).slice(0, 160)));
  p.on('dialog', d => d.accept().catch(() => {}));
  p.on('request', r => { if (r.method() === 'POST' && /\/api\/anfragen$/.test(r.url())) fs.appendFileSync(path.join(BEL, `post-${MOTOR}-${W}.log`), new Date().toISOString() + ' ' + (r.postData() || '').slice(0, 400) + '\n'); });
  const schritt = async (name, fn) => {
    const f0 = fehler.length;
    try { const info = await fn(); const neu = fehler.slice(f0); res.push({ name, stand: neu.length ? 'rot' : 'grün', info: (neu.length ? 'Skriptfehler: ' + neu.join(' | ') + ' · ' : '') + (info || '') }); }
    catch (e) { res.push({ name, stand: 'rot', info: String(e.message || e).split('\n')[0].slice(0, 260) }); await p.screenshot({ path: path.join(BEL, `rot-${name.split(' ')[0]}-${MOTOR}-${W}.jpg`), type: 'jpeg', quality: 60 }).catch(() => {}); }
    const r = res[res.length - 1]; console.log(`${r.stand === 'grün' ? 'ok ' : 'ROT'} ${r.name} · ${r.info.slice(0, 200)}`);
  };
  const foto = n => p.screenshot({ path: path.join(BEL, `${n}-${MOTOR}-${W}x${H}.jpg`), type: 'jpeg', quality: 70 });
  const seite = async s => { await p.goto('about:blank'); await p.goto(HAUS + '/' + s, { waitUntil: 'load' }); await sleep(700); };
  const druecke = async l => { await l.evaluate(e => e.scrollIntoView({ block: 'center' })); await sleep(150); await l.click(); };
  // Anfrage-Fenster ausfüllen und senden; gibt den Dank-Text zurück
  const fenster = async (o) => {
    const d = p.locator('dialog.anf[open]').first(); await d.waitFor({ state: 'visible', timeout: 8000 });
    const team = (await d.locator('.anf__kl').innerText()).replace(/\s+/g, ' ');
    await sleep(400);   // wie ein Mensch: erst lesen, dann tippen (das Fenster setzt nach 80 ms den Fokus, W7)
    if (o.nachricht !== undefined) await d.locator('textarea[name=nachricht]').fill(o.nachricht);
    const nachFill = await d.locator('textarea[name=nachricht]').inputValue();
    if (o.personen && await d.locator('input[name=personen]').isVisible()) await d.locator('input[name=personen]').fill(String(o.personen));
    await d.locator('input[name=name]').fill(o.name); await d.locator('input[name=kontakt]').fill(o.kontakt);
    const vorSenden = await d.locator('textarea[name=nachricht]').inputValue();
    if (o.nachricht && vorSenden !== o.nachricht) fs.appendFileSync(path.join(BEL, `post-${MOTOR}-${W}.log`), `FELD VERLOREN ${o.kurz}: nach fill «${nachFill.slice(0,40)}», vor Senden «${vorSenden.slice(0,40)}»\n`);
    await druecke(d.locator('button[type=submit]'));
    await d.locator('.anf__danke:not([hidden])').waitFor({ timeout: 10000 });
    const dank = (await d.locator('.anf__danke').innerText()).replace(/\s+/g, ' ');
    await foto('website-' + o.kurz); await druecke(d.locator('[data-zu]'));
    return team + ' → ' + dank.slice(0, 70);
  };
  const imEingang = async name => (await rez('anfragen')).anfragen.find(a => a.name === name);

  const FAELLE = [
    { kurz: 'spa-knopf', s: 'spa.html', sel: 'a[href^="mailto:spa@doldenhorn.ch?subject=Termin"]', name: 'Spa Knopf ' + M, kontakt: 'spa-knopf@example.com', nachricht: 'Gern am Sonntag um 10 Uhr eine Massage für zwei.', personen: 2, abt: 'Spa', an: 'spa@doldenhorn.ch', art: 'spa', sp: 'de', team: /Spa-Team/ },
    { kurz: 'event', s: 'feste.html', sel: 'a[href^="mailto:event@doldenhorn.ch?subject=Bankett"]', name: 'Event Bankett ' + M, kontakt: '+41 79 000 11 22', nachricht: 'Firmenessen für 45 Personen im Dezember, Grüner Saal?', personen: 45, abt: 'Event', an: 'event@doldenhorn.ch', art: 'feier', sp: 'de', team: /Event-Team/ },
    { kurz: 'tisch-en', s: 'au-gourmet.html', sel: 'a[href^="mailto:info@doldenhorn.ch"]', name: 'Table English ' + M, kontakt: 'table-en@example.com', nachricht: 'Hello, we would like to book a table for two at Au Gourmet on Saturday evening. Could you please confirm? Thank you.', personen: 2, abt: 'Rezeption', an: 'info@doldenhorn.ch', art: null, sp: 'en', team: /Rezeption/ },
    { kurz: 'zimmer-fr', s: 'zimmer.html', sel: 'a[href^="mailto:info@doldenhorn.ch"]', name: 'Chambre Français ' + M, kontakt: 'chambre-fr@example.com', nachricht: 'Bonjour, nous souhaiterions réserver une chambre avec vue pour deux nuits en janvier. Merci beaucoup, Madame Dubois', personen: 2, abt: 'Rezeption', an: 'info@doldenhorn.ch', art: null, sp: 'fr', team: /Rezeption/ },
    { kurz: 'spa-it', s: 'spa.html', sel: 'a[href^="mailto:spa@doldenhorn.ch"]', name: 'Spa Italiano ' + M, kontakt: 'spa-it@example.com', nachricht: 'Buongiorno, vorremmo prenotare due massaggi per sabato pomeriggio, siamo una coppia. Grazie, cordiali saluti', personen: 2, abt: 'Spa', an: 'spa@doldenhorn.ch', art: 'spa', sp: 'it', team: /Spa-Team/ },
  ];
  for (const f of FAELLE) {
    await schritt(`W ${f.kurz}: Fenster auf ${f.s} (${f.an}) bedient, landet mit Abteilung ${f.abt}, Sprache ${f.sp}`, async () => {
      await seite(f.s); const l = p.locator(f.sel + ':visible').first(); ok(await l.count(), 'Verweis fehlt: ' + f.sel); await druecke(l);
      const info = await fenster(f); ok(f.team.test(info), 'Fenster nennt ' + info);
      await sleep(4500); const a = await imEingang(f.name);
      ok(a, 'nicht im Eingang von La Réception'); ok(a.abteilung === f.abt && a.an === f.an && a.web && a.status === 'neu', `Abteilung ${a.abteilung}, an ${a.an}, web ${a.web}, Stand ${a.status}`);
      if (f.art) ok(a.art === f.art, 'Art ' + a.art); ok(a.sprache === f.sp, 'Sprache ' + a.sprache + ' statt ' + f.sp);
      ok(a.seite_name && a.nachricht.includes(f.nachricht.slice(0, 30)), 'Seite/Nachricht: ' + a.seite_name + ' / ' + a.nachricht.slice(0, 40));
      return `${info} · Eingang: ${a.abteilung}, ${a.art}, ${a.sprache}, Seite ${a.seite_name}, Personen ${a.personen}`;
    });
  }
  await schritt('W spa-termin: Termin-Fenster (Calendly-Verweis) mit Behandlung, Tag, Uhrzeit → Spa, Datum mit Uhrzeit', async () => {
    await seite('spa.html'); const l = p.locator('a[href*="calendly.com/spa-doldenhorn"]').first(); ok(await l.count(), 'kein Termin-Verweis'); await druecke(l);
    const d = p.locator('dialog.anf--termin[open]'); await d.waitFor({ timeout: 8000 });
    await druecke(d.locator('.ter__b').first()); await p.waitForFunction(() => !/geladen/.test((document.querySelector('[data-zeit-hinweis]') || {}).textContent || ''), null, { timeout: 20000 }); await sleep(300);
    const tag = d.locator('[data-tage] button:not([disabled])').first(); if (await tag.count() && !(await d.locator('[data-wunsch]').isVisible())) { await druecke(tag); await sleep(700); }
    const z = d.locator('[data-zeiten] button:not([disabled])').first(); if (await z.count()) await druecke(z); else { const w = d.locator('[data-wunsch] input'); if (await w.isVisible()) await w.fill('15:30'); }
    await d.locator('input[name=name]').fill('Spa Termin ' + M); await d.locator('input[name=kontakt]').fill('termin@example.com'); await d.locator('input[name=notiz]').fill('Zimmer 12');
    await druecke(d.locator('button[type=submit]')); await d.locator('[data-danke]:not([hidden])').waitFor({ timeout: 10000 }); await foto('website-spa-termin');
    const dank = (await d.locator('[data-danke]').innerText()).replace(/\s+/g, ' ');
    await sleep(4500); const a = await imEingang('Spa Termin ' + M); ok(a, 'nicht im Eingang');
    ok(a.abteilung === 'Spa' && a.art === 'spa' && a.an === 'spa@doldenhorn.ch' && /Uhr/.test(a.datum) && /Behandlung:/.test(a.nachricht) && /Zimmer 12/.test(a.nachricht), JSON.stringify(a).slice(0, 220));
    return dank.slice(0, 60) + ' · Eingang: ' + a.anliegen + ' · ' + a.datum;
  });
  await schritt('W bewerbung: offene Stelle → «Jetzt bewerben» → Personal (ohne Datum, Personen)', async () => {
    await seite('karriere.html'); const s = p.locator('[data-stelle]').first(); ok(await s.count(), 'keine Stelle'); await druecke(s);
    const sb = p.locator('dialog.anf--stelle[open]'); await sb.waitFor(); const titel = await sb.locator('#stb-titel').innerText(); await druecke(sb.locator('[data-bewerben]'));
    const d = p.locator('dialog.anf:not(.anf--stelle):not(.anf--termin)[open]'); await d.waitFor(); ok(!(await d.locator('input[name=personen]').isVisible()), 'Personen-Feld bei Bewerbung');
    const info = await fenster({ kurz: 'bewerbung', name: 'Bewerbung ' + M, kontakt: 'bewerbung@example.com', nachricht: 'Ich bewerbe mich mit Freude.' });
    await sleep(4500); const a = await imEingang('Bewerbung ' + M); ok(a && a.abteilung === 'Personal' && a.an === 'jobs@doldenhorn.ch' && new RegExp(titel.slice(0, 8)).test(a.anliegen), JSON.stringify(a || {}).slice(0, 200));
    return info + ' · ' + a.anliegen;
  });
  await schritt('W weiterreichen: Website über den Server von La Réception (heiraten.html) → Event', async () => {
    await p.goto('about:blank'); await p.goto(RO + '/heiraten.html', { waitUntil: 'load' }); await sleep(600);
    const l = p.locator('a[href^="mailto:event@doldenhorn.ch"]').first(); ok(await l.count(), 'kein event@'); await druecke(l);
    const info = await fenster({ kurz: 'heiraten', name: 'Hochzeit ' + M, kontakt: 'hochzeit@example.com', nachricht: 'Hochzeit mit 70 Gästen im Juni', personen: 70 });
    await sleep(1500); const a = await imEingang('Hochzeit ' + M); ok(a && a.abteilung === 'Event' && a.personen === 70, JSON.stringify(a || {}).slice(0, 200)); return info;
  });
  await schritt('W leer: ohne Name und Kontakt geht nichts ab, Meldung im Fenster', async () => {
    await seite('spa.html'); await druecke(p.locator('a[href^="mailto:spa@doldenhorn.ch"]').first());
    const d = p.locator('dialog.anf[open]').first(); await d.waitFor(); const vor = (await haus('GET')).gesamt;
    await druecke(d.locator('button[type=submit]')); await sleep(800); const m = (await d.locator('.anf__meldung').innerText()).trim();
    ok(/Namen/.test(m) && (await haus('GET')).gesamt === vor, 'Meldung: ' + m); await d.locator('.anf__zu').click(); return m.slice(0, 80);
  });

  // ------------------------------------------------------- La Réception: Stand, Löschen, alter Eingang
  const oeffne = async name => {
    await p.goto('about:blank'); await p.goto(R + '#eingang', { waitUntil: 'load' }); await p.waitForSelector('.re-liste .re-a', { timeout: 30000 }); await sleep(600);
    await p.locator('.re-filter [data-filter="alle"]').click().catch(() => {}); await p.locator('.re-abt [data-abt="alle"]').click().catch(() => {}); await sleep(300);
    const k = p.locator('.re-liste .re-a', { hasText: name }).first(); await druecke(k); await p.waitForSelector('#detail .re-d', { timeout: 15000 }); await sleep(900);
  };
  await schritt('E Abteilung Spa im Eingang: Filter zeigt die Spa-Anfragen der Website', async () => {
    await p.goto(R + '#eingang', { waitUntil: 'load' }); await p.waitForSelector('.re-abt'); await druecke(p.locator('.re-abt [data-abt="Spa"]')); await sleep(600);
    const txt = (await p.locator('.re-liste').innerText()).replace(/\s+/g, ' '); await foto('eingang-spa');
    ok(['Spa Knopf ', 'Spa Italiano ', 'Spa Termin '].every(n => txt.includes(n + M)) && !txt.includes('Event Bankett ' + M), 'Liste Spa: ' + txt.slice(0, 200));
    await druecke(p.locator('.re-abt [data-abt="alle"]')); return 'drei Spa-Anfragen, keine fremde';
  });
  await schritt('E Detail einer Website-Anfrage: An, Über, Seite, Nachricht; Öffnen = gelesen an der Website', async () => {
    await oeffne('Spa Termin ' + M); const d = (await p.locator('#detail .re-d').innerText()).replace(/\s+/g, ' ');
    ok(/spa@doldenhorn\.ch/.test(d) && /Anfrage-Fenster/.test(d) && /Spa/.test(d) && /Zimmer 12/.test(d), d.slice(0, 220)); await sleep(800);
    const x = (await haus('GET')).anfragen.find(a => a.name === 'Spa Termin ' + M); ok(x && x.stand === 'gelesen', 'Website: ' + (x && x.stand)); await foto('detail-spa-termin');
    return 'Website-Stand gelesen';
  });
  await schritt('E Brief der Spa-Anfrage: Kopf mit Adresse und Telefon des Hauses, Absender spa@, Unterschrift Spa', async () => {
    const b = p.locator('#brief'); await b.waitFor({ timeout: 30000 }); await sleep(600); const t = (await b.innerText()).replace(/\s+/g, ' ');
    ok(/Waldhotel Doldenhorn/.test(t) && /Doldenhornstrasse 26 · 3718 Kandersteg/i.test(t) && /\+41 33 675 81 81/.test(t) && /info@doldenhorn\.ch/i.test(t) && /seit 1976/i.test(t), 'Kopf/Fuss: ' + t.slice(0, 160) + ' … ' + t.slice(-90));
    const von = await p.evaluate(() => [...document.querySelectorAll('#brief .gs--an, #detail .gs--an')].map(e => e.innerText).join(' ')); ok(/spa@doldenhorn\.ch/.test(von), 'Absender ' + von);
    ok(/Spa/.test(t.slice(-200)), 'Unterschrift: ' + t.slice(-120)); await foto('brief-spa'); return t.slice(0, 90);
  });
  await schritt('E Erledigt → Website erledigt; Wieder offen → Website gelesen', async () => {
    await druecke(p.locator('#detail [data-akt="erledigt"]')); await sleep(1300); let x = (await haus('GET')).anfragen.find(a => a.name === 'Spa Termin ' + M); ok(x.stand === 'erledigt', x.stand);
    await druecke(p.locator('#detail [data-akt="offen"]')); await sleep(1300); x = (await haus('GET')).anfragen.find(a => a.name === 'Spa Termin ' + M); ok(x.stand === 'gelesen', x.stand); return 'beide Richtungen';
  });
  await schritt('E Im alten Eingang gelöscht → verschwindet in La Réception', async () => {
    const x = (await haus('GET')).anfragen.find(a => a.name === 'Hochzeit ' + M); await haus('POST', { tun: 'loeschen', id: x.id }); await sleep(4500);
    ok(!(await imEingang('Hochzeit ' + M)), 'noch in La Réception'); return 'weg';
  });
  await schritt('E Löschen in La Réception (zweiter Klick) → auch an der Website weg, kommt nicht wieder', async () => {
    await oeffne('Event Bankett ' + M); await druecke(p.locator('#detail [data-akt="weg"]')); await p.waitForSelector('#fenster:not([hidden]) #f-los'); await p.locator('#f-los').click(); await sleep(1500);
    ok(!(await haus('GET')).anfragen.find(a => a.name === 'Event Bankett ' + M), 'an der Website noch da'); await sleep(4500); ok(!(await imEingang('Event Bankett ' + M)), 'wieder da'); return 'weg an beiden Stellen';
  });
  await schritt('E Protokoll: Erledigt, Wieder offen und Löschen stehen mit dem gemerkten Namen drin (E06)', async () => {
    const f = process.env.PROTO; if (!f) return 'übersprungen (PROTO fehlt)';
    const z = fs.readFileSync(f, 'utf8').trim().split('\n').map(x => JSON.parse(x)).filter(x => x.wer === 'Prüf Chat').slice(-6).map(x => x.was);
    ok(z.includes('erledigt') && z.includes('wieder offen') && z.includes('gelöscht'), 'Protokoll: ' + z.join(', ')); return z.join(', ');
  });
  await schritt('E Alte Adresse /studio/eingang.html?an=spa am Server von La Réception → Eingang, Abteilung Spa gewählt; am Hausserver bleibt der alte Eingang', async () => {
    await p.goto('about:blank'); await p.goto(RO + '/studio/eingang.html?an=spa', { waitUntil: 'load' }); await p.waitForURL(/_werkzeuge\/reception\/#eingang/, { timeout: 10000 }); await p.waitForSelector('.re-abt'); await sleep(700);
    ok(await p.locator('.re-abt [data-abt="Spa"][aria-pressed="true"]').count() === 1, 'Spa nicht gewählt'); await foto('weiter-spa');
    await p.goto('about:blank'); await p.goto(HAUS + '/studio/eingang.html', { waitUntil: 'load' }); await p.waitForFunction(() => document.documentElement.classList.contains('eg-bereit'), null, { timeout: 15000 }).catch(() => {}); await sleep(1500); await foto('alter-eingang'); const u = p.url(); const alt = await p.locator('.eg-kopf').count();
    const zahl = (await p.locator('body').innerText()).includes('Spa Knopf ' + M);
    await p.goto('about:blank'); await p.goto(R + '#eingang'); await p.waitForSelector('.re-abt'); await druecke(p.locator('.re-abt [data-abt="alle"]'));
    ok(/studio\/eingang\.html/.test(u) && alt === 1 && zahl, `Hausserver: ${u}, alter Eingang ${alt}, Anfrage sichtbar ${zahl}`); return 'weiter mit Abteilung, alter Eingang zeigt dieselben Anfragen';
  });
  fs.writeFileSync(path.join(BEL, `weg-${MOTOR}-${W}x${H}.json`), JSON.stringify({ motor: MOTOR, W, H, res, fehler }, null, 1));
  const g = res.filter(r => r.stand === 'grün').length; console.log(`weg ${MOTOR} ${W}x${H}: ${g} grün, ${res.length - g} rot von ${res.length}`);
  await br.close();
})().catch(e => { console.log('ABBRUCH', e); process.exit(2); });

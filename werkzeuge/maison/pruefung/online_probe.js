// La Maison · Online-Fassung lokal nachgestellt (M13, Falle «eingebettete Skripte online», Master Werkzeug-Bau 9).
//   node _werkzeuge/maison/pruefung/online_probe.js chromium|webkit|firefox [http://localhost:8950]
// Liefert _werkzeuge/maison/online/ unter /maison/ aus, mit der strengen Sicherheitsregel (keine eingebetteten Skripte), und prüft:
// keine Blockade, keine Skriptfehler, Tür zu, kein localhost, kein Platzhalter, jedes Linkziel liegt online wirklich (statik der Andock-Dateien).
const PW = require('/Users/robertreff/Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ART = process.argv[2] || 'chromium';
const BASIS = (process.argv[3] || '').replace(/\/$/, '');
const ROOT = path.resolve(__dirname, '../../..');
const ON = path.resolve(__dirname, '../online');
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'";
const ART_ = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.json': 'application/json' };
// online liegt, was eine Andock-Datei unter «statik» mitnimmt, dazu alles ohne _ am Anfang (online.py)
const statik = [], um = [];
for (const w of fs.readdirSync(path.join(ROOT, '_werkzeuge'))) {
  const f = path.join(ROOT, '_werkzeuge', w, 'online.json'); if (!fs.existsSync(f)) continue;
  try { const d = JSON.parse(fs.readFileSync(f, 'utf8')); for (const [q, z] of Object.entries(d.statik || {})) statik.push([q, z.replace(/^\/|\/$/g, '')]); for (const u of d.umleitungen || []) um.push(u); } catch (e) { }
}
const liegtOnline = (weg, tiefe = 0) => {
  // Umleitungen der Andock-Dateien (vercel.json rewrites): «/a/:pfad*» → «/b/:pfad*», «/a/» → «/b/index.html»
  const nackt = weg.split('#')[0].split('?')[0];
  for (const u of um) {
    if (tiefe > 2 || /\/api\b|__weg/.test(u.destination)) continue;
    const quelle = u.source.replace(/:pfad\*$/, '');
    if (u.source.includes(':pfad*') ? nackt.startsWith(quelle) : nackt === u.source) return liegtOnline(u.destination.replace(':pfad*', nackt.slice(quelle.length)), tiefe + 1);
  }
  const r = decodeURIComponent(weg.split('#')[0].split('?')[0]).replace(/^\//, '');
  const datei = r === '' || r.endsWith('/') ? r + 'index.html' : r;
  for (const [q, z] of statik) {
    if (datei === z) return fs.existsSync(path.join(ROOT, q));
    if (datei.startsWith(z + '/')) return fs.existsSync(path.join(ROOT, q, datei.slice(z.length + 1)));
  }
  return !datei.startsWith('_') && fs.existsSync(path.join(ROOT, datei));
};

(async () => {
  const b = await PW[ART].launch();
  const erg = [];
  const notiz = (nr, name, ok, beleg) => { erg.push({ nr, name, ok: !!ok, beleg }); console.log((ok ? 'ok   ' : 'ROT  ') + ART + ' ' + nr + ' ' + name + ' · ' + String(beleg).slice(0, 220)); };
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h } });
    const p = await c.newPage();
    const fehler = [], csp = [];
    p.on('pageerror', e => fehler.push(String(e)));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) fehler.push(m.text()); if (/Content Security Policy|Content-Security-Policy|CSP/i.test(m.text())) csp.push(m.text()); });
    await p.route('**/studio/api/fehler', r => r.fulfill({ status: 200, body: '{}' }));
    await p.route(u => new URL(u).pathname.startsWith('/maison/'), r => {
      const rel = decodeURIComponent(new URL(r.request().url()).pathname.slice('/maison/'.length)) || 'index.html';
      const f = path.join(ON, rel);
      if (!f.startsWith(ON) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: 'fehlt' });
      r.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'content-type': ART_[path.extname(f)] || 'application/octet-stream', 'content-security-policy': CSP } });
    });
    await p.goto(BASIS + '/maison/', { waitUntil: 'load' }); await p.waitForTimeout(2200);
    await p.evaluate(() => { document.addEventListener('securitypolicyviolation', e => (window.__csp = (window.__csp || []).concat(e.violatedDirective + ' ' + e.blockedURI))); });
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(90); }
    await p.waitForTimeout(1200);
    const s = await p.evaluate(() => ({ tuer: !document.querySelector('#tuer').hidden, bereit: !!window.MAISON_BEREIT, js: document.documentElement.classList.contains('js'), csp: window.__csp || [],
      html: document.documentElement.outerHTML, links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')), platz: document.querySelectorAll('.m-schirm--platz').length,
      wege: JSON.parse(document.querySelector('#maison-wege').textContent), kurz: [...document.querySelectorAll('[data-stand$="-kurz"]')].map(e => e.textContent.trim()) }));
    const gr = w + 'x' + h;
    notiz('O01 ' + gr, 'Online-Fassung läuft unter strenger Sicherheitsregel (keine eingebetteten Skripte)', s.bereit && s.js && !s.tuer && !csp.length && !s.csp.length && !fehler.length, JSON.stringify({ csp: csp.concat(s.csp), fehler }).slice(0, 300));
    notiz('O02 ' + gr, 'Kein localhost, kein Platzhalter in der Online-Fassung', !/localhost|127\.0\.0\.1/.test(s.html) && s.platz === 0, 'Platzhalter ' + s.platz);
    const fremd = s.links.filter(l => !/^(mailto:|#)/.test(l) && !/^https:\/\//.test(l));
    const fehlt = fremd.filter(l => !liegtOnline(l.startsWith('/') ? l : '/maison/' + l));
    notiz('O03 ' + gr, 'Jedes Linkziel liegt online wirklich (' + fremd.length + ' Links)', fehlt.length === 0, fehlt.join(' | ') || [...new Set(fremd)].join(' '));
    notiz('O04 ' + gr, 'Stand-Wege online aus den Andock-Dateien, ohne Antwort Satz ohne Zahl', Object.values(s.wege).flat().every(x => !x || x.startsWith('/')), JSON.stringify(s.wege) + ' · ' + s.kurz.join(' | '));
    await p.screenshot({ path: path.join(__dirname, 'belege', `online-${ART}-${gr}.jpg`), type: 'jpeg', quality: 60, fullPage: w < 800 ? false : false });
    await c.close();
  }
  await b.close();
  fs.writeFileSync(path.join(__dirname, `online-${ART}.json`), JSON.stringify(erg, null, 1));
  console.log(`${ART}: ${erg.filter(x => x.ok).length} von ${erg.length} grün`);
})();

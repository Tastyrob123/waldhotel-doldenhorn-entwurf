// Schnellblick: node blick.js <browser> <breite> <hoehe> <datei> [scrollY|ganz] [adresse]
const pw = require('/Users/robertreff/Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright');
const [,, br = 'webkit', w = '1440', h = '900', datei = '/tmp/b.jpg', sy = '0', adr = '/_werkzeuge/maison/?gruss=tag'] = process.argv;
(async () => {
  const b = await pw[br].launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const fehler = []; p.on('pageerror', e => fehler.push(String(e))); p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.goto(adr, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  if (sy === 'ganz') {
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
    await p.screenshot({ path: datei, type: 'jpeg', quality: 70, fullPage: true });
  } else {
    await p.evaluate(y => scrollTo(0, y), +sy); await p.waitForTimeout(1500);
    await p.screenshot({ path: datei, type: 'jpeg', quality: 80 });
  }
  const ueber = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(JSON.stringify({ fehler, ueber }));
  await b.close();
})();

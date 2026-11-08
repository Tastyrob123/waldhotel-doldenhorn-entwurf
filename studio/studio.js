/* Studio · Waldhotel Doldenhorn. Das Werkzeug, mit dem das Haus seine Seite pflegt. Ohne Bibliothek, nach dem Vorbild des Studios von Salt & Silver. */
(() => {
'use strict';
/* Le Bureau (17.10.2026): dieses frühere Studio läuft als alt.html weiter; Le Bureau bettet seine Ansichten ein (Listen, Karten der Website, Menü & Seiten,
   Bilder, Zahlen, Zugang). Eingebettet ohne Rand und Leiste; jede gespeicherte Änderung meldet es an Le Bureau, dann stimmen Leiste, Rand und Zahlen dort sofort. */
const EIN = new URLSearchParams(location.search).has('eingebettet') && window.parent !== window;
if (EIN) document.documentElement.classList.add('eingebettet');
const melden = () => { if (EIN) window.parent.postMessage({ bureau: 'geaendert' }, '*'); };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const PF = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5"/></svg>';
const SYM = {
  links: '<svg viewBox="0 0 14 14"><path d="m9 2-5 5 5 5"/></svg>', rechts: '<svg viewBox="0 0 14 14"><path d="m5 2 5 5-5 5"/></svg>',
  hoch: '<svg viewBox="0 0 14 14"><path d="m2.5 9 4.5-4.5L11.5 9"/></svg>', runter: '<svg viewBox="0 0 14 14"><path d="m2.5 5 4.5 4.5L11.5 5"/></svg>',
  zu: '<svg viewBox="0 0 14 14"><path d="m3 3 8 8M11 3l-8 8"/></svg>', auge: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><circle cx="8" cy="7" r="1.9"/></svg>',
  augezu: '<svg viewBox="0 0 16 14"><path d="M1 7s2.6-4.5 7-4.5S15 7 15 7s-2.6 4.5-7 4.5S1 7 1 7Z"/><path d="m3 1 10 12"/></svg>',
  bild: '<svg viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="2"/><path d="m3 11 3.2-3 2.3 2 2-1.6L13 11"/></svg>',
  korb: '<svg viewBox="0 0 14 14"><path d="M2.5 4h9M5.5 4V2.5h3V4M3.5 4l.6 7.5h5.8L10.5 4"/></svg>',
  rechner: '<svg viewBox="0 0 16 14"><rect x="1.5" y="1.5" width="13" height="8.5" rx="1.4"/><path d="M5.5 12.5h5"/></svg>', handy: '<svg viewBox="0 0 14 16"><rect x="3.5" y="1.5" width="7" height="13" rx="1.6"/></svg>',
};
/* Zeichen der Bereiche: feine Linien, wie die Pfeile der Seite */
const IK = {
  tanne: '<svg viewBox="0 0 24 24"><path d="M12 3 7 11h3l-4 6h12l-4-6h3z"/><path d="M12 17v4"/></svg>',
  seite: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  bett: '<svg viewBox="0 0 24 24"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6h5v3M3 18v2M21 18v2"/></svg>',
  gabel: '<svg viewBox="0 0 24 24"><path d="M7 3v7a2 2 0 0 0 4 0V3M9 12v9M16 3c-1.5 1.5-2 4-2 7h3v11M17 3v7"/></svg>',
  tropfen: '<svg viewBox="0 0 24 24"><path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3Z"/><path d="M9 15a3 3 0 0 0 3 3"/></svg>',
  glas: '<svg viewBox="0 0 24 24"><path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8 20h8"/></svg>',
  kalender: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3M13 14h3M8 18h3"/></svg>',
  uhr: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bild: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 17 5-5 4 4 3-3 4 4"/><circle cx="16" cy="9" r="1.5"/></svg>',
  personen: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5a3 3 0 0 1 0 6M21 20c0-2.8-1.6-5-4-5.7"/></svg>',
  stern: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  glocke: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>',
  menue: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  lupe: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
  liste: '<svg viewBox="0 0 24 24"><path d="M9 6h12M9 12h12M9 18h12"/><path d="m3 6 1.3 1.3L6.5 5M3 12l1.3 1.3L6.5 11M3 18l1.3 1.3L6.5 17"/></svg>',
  verlauf: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/><path d="M12 8v4l3 2"/></svg>',
  schluessel: '<svg viewBox="0 0 24 24"><circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M17 5l2 2M14 8l2 2"/></svg>',
  text: '<svg viewBox="0 0 24 24"><path d="M5 5h14M12 5v14M8 19h8"/></svg>',
  preis: '<svg viewBox="0 0 24 24"><path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z"/><circle cx="8.5" cy="8.5" r="1.3"/></svg>',
  haken: '<svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg>',
  tannen: '<svg viewBox="0 0 48 56"><path d="M24 2 14 20h6l-8 14h24l-8-14h6zM10 14 4 24h4l-5 9h14M38 14l6 10h-4l5 9H31"/><path d="M24 34v20M8 33v12M40 33v12"/></svg>',
};
const ik = n => `<span class="ik" aria-hidden="true">${IK[n] || IK.tanne}</span>`;
const NAV = [['uebersicht', 'Übersicht', 'tanne'], ['seiten', 'Seiten & Texte', 'seite'], ['zimmer', 'Zimmer', 'bett'], ['kueche', 'Küche & Karten', 'gabel'], ['spa', 'Spa', 'tropfen'], ['feste', 'Feste & Seminare', 'glas'], ['angebote', 'Angebote & Termine', 'kalender'], ['haus', 'Haus & Zeiten', 'uhr'], ['bilder', 'Bilder', 'bild'],
  null, ['team', 'Team & Stellen', 'personen'], ['ehren', 'Auszeichnungen', 'stern'], ['hinweis', 'Hinweis für Gäste', 'glocke'], ['menue', 'Menü & Seiten', 'menue'], ['google', 'Google & Co.', 'lupe'],
  null, ['zahlen', 'Zahlen', 'liste'], ['aenderungen', 'Änderungen', 'liste'], ['verlauf', 'Verlauf', 'verlauf'], ['zugang', 'Zugang', 'schluessel'], ['pruefung', 'Prüfung', 'haken']];
const ARTZ = { fakt: 'uhr', text: 'text', karte: 'gabel', bild: 'bild', liste: 'liste', hinweis: 'glocke', seite: 'menue', google: 'lupe' };
/* Welche Listen und Karten in welchem Bereich stehen */
const BEREICHE = {
  kueche: { titel: 'Küche <em>& Karten.</em>', text: 'Die Grosse Karte, die Bistrokarte und das Foodkonzept. Jede Zeile hat „Bearbeiten“, Pfeile, ein Auge zum Ausblenden und einen Papierkorb. Gruppen lassen sich umbenennen, sortieren und neu anlegen.', karten: ['karte', 'bistro'], listen: ['kueche.food_drei', 'kueche.halbpension'], pdfs: ['pdf.karte', 'pdf.bistro', 'pdf.wein'], seite: 'kueche.html' },
  spa: { titel: 'Doldenhorn <em>Spa.</em>', text: 'Das Massage-Menü mit Dauer und Preis, die Sauna World mit Temperaturen und die Spa-Etikette. Die Öffnungszeit des Hallenbads steht unter „Haus & Zeiten“.', karten: ['massage', 'saunen'], listen: ['spa.etikette', 'spa.saunagang'], pdfs: ['pdf.massage', 'pdf.etikette'], seite: 'spa.html' },
  feste: { titel: 'Feste <em>& Seminare.</em>', text: 'Die Hochzeits-Packages, die Säle, die Seminarpauschale mit ihren Leistungen und das Rahmenprogramm.', karten: [], listen: ['feste.pakete', 'feste.pakete_beide', 'feste.pakete_zusatz', 'feste.saele'], karten2: ['seminar'], listen2: ['feste.seminar_leistung', 'feste.rahmenprogramm', 'feste.raummiete'], pdfs: ['pdf.hochzeit', 'pdf.seminar'], seite: 'feste.html' },
  angebote: { titel: 'Angebote <em>& Termine.</em>', text: 'Alles aus dem Hausmagazin: Gourmet-Aufenthalt, Küchenfeste, Reisen ohne Stress mit den offenen Wochen, Curling und die Überraschung bei der Ankunft. Vergangene Termine nehmen Sie heraus, neue setzen Sie dazu.', karten: ['gourmet'], listen: ['angebote.gourmet_liste', 'termine.kuechenfeste'], karten2: ['reisen'], listen2: ['angebote.reisen_liste', 'termine.reisen', 'termine.curling', 'umgebung.orte'], karten3: ['ueberraschung'], pdfs: ['pdf.magazin'], seite: 'angebote.html' },
  team: { titel: 'Team <em>& Stellen.</em>', text: 'Ihre Gastgeber, die Dienstjahre, die Meilensteine des Hauses, die offenen Stellen und die drei Fragen, die jede Bewerberin zuerst stellt.', karten: [], listen: ['haus.team', 'karriere.stellen', 'karriere.fragen', 'karriere.dienstjahre', 'haus.jahre'], seite: 'karriere.html' },
  ehren: { titel: 'Aus<em>zeichnungen.</em>', text: 'Das Band mit den Zeichen unter dem Auftakt und auf der Küche-Seite. Reihenfolge, Namen und Links ändern Sie hier, ein neues Zeichen laden Sie als Bild hoch.', karten: [], listen: ['ehren'], seite: 'index.html' },
};
const sicht = $('#sicht');
let Z = null, W = null, V = null, OFFEN = false, PROBE = false;

// ---------------------------------------------------------------- Verbindung
async function api(was, daten, roh) {
  const o = daten === undefined ? {} : { method: 'POST', headers: roh ? { 'X-Studio': '1' } : { 'X-Studio': '1', 'Content-Type': 'application/json' }, body: roh ? daten : JSON.stringify(daten) };
  let r;
  try { r = await fetch('/studio/api/' + was, o); } catch (e) { throw new Error('Keine Verbindung zum Studio.'); }
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && was !== 'status') { tor('an'); throw new Error(j.fehler || 'Bitte anmelden.'); }
  if (!r.ok) throw new Error(j.fehler || 'Das hat nicht geklappt.');
  return j;
}
async function aendern(a) { Z = await api('aendern', a); rand(); leiste(); melden(); return Z; }
function sag(text, fehler) {
  $$('#meldung div').forEach(x => { if (x.textContent === text) x.remove(); });
  const d = document.createElement('div');
  d.textContent = text;
  if (fehler) d.className = 'f';
  $('#meldung').appendChild(d);
  setTimeout(() => d.remove(), fehler ? 5200 : 2600);
}
const mal = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;
function datum(z) {
  const d = new Date(z);
  return isNaN(d) ? '' : d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
}
const FESTK = new Set(['auftakt', 'fenster-wiese', 'fenster-tal', 'fenster-bach', 'fenster-salz', 'fenster-tisch', 'schluss']);
const bildadr = (k, g = 's') => (FESTK.has(k) || /^u-[0-9a-f]{10}f$/.test(k)) ? `/assets/img/${k}-k.webp` : `/assets/img/${k}-${g}.webp`;
const logoadr = k => `/assets/logo/ehre-${k}.webp`;

// ---------------------------------------------------------------- Tor
function tor(art) {
  $('#app').hidden = true;
  const t = $('#tor');
  t.hidden = false;
  const neu = art === 'neu';
  t.innerHTML = `<img class="tor__bild" src="/assets/img/haus-abend-l.webp" alt="">
  <div class="tor__k">
    <div class="tor__z"><svg viewBox="0 0 48 56"><use href="/assets/logo/tannen.svg#zeichen"/></svg></div>
    <h1>Studio <em>Doldenhorn.</em></h1>
    <p>${neu ? 'Legen Sie ein Passwort fest. Damit kommt nur Ihr Haus an die Inhalte der Website.' : 'Hier pflegen Sie Ihre Website: Zimmer, Karten, Zeiten, Angebote, Texte und Bilder.'}</p>
    <form autocomplete="off">
      <label class="feld"><span>${neu ? 'Neues Passwort' : 'Passwort'}</span><input type="password" name="p" autocomplete="${neu ? 'new-password' : 'current-password'}" required minlength="${neu ? 10 : 1}" autofocus></label>
      ${neu ? '<label class="feld"><span>Noch einmal</span><input type="password" name="p2" autocomplete="new-password" required></label>' : ''}
      <div class="fehler" role="alert"></div>
      <button class="kn kn--breit" type="submit">${neu ? 'Passwort festlegen' : 'Öffnen'}</button>
    </form>
    ${neu ? '<p class="tor__f">Mindestens 10 Zeichen. Sie können es später unter „Zugang“ ändern.</p>' : ''}
    <p class="tor__f"><a class="link" href="pruefung.html">Prüfung des Studios</a></p>
  </div>`;
  const tz = $('.tor__z', t);
  fetch('/assets/logo/tannen.svg').then(r => r.text()).then(s => { const m = s.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?(<path[\s\S]*?)<\/svg>/); if (m) tz.innerHTML = `<svg viewBox="${m[1]}">${m[2]}</svg>`; }).catch(() => {});
  const f = $('form', t), fe = $('.fehler', t);
  f.addEventListener('submit', async ev => {
    ev.preventDefault();
    fe.textContent = '';
    if (neu && f.p.value !== f.p2.value) { fe.textContent = 'Die beiden Eingaben sind nicht gleich.'; return; }
    try {
      await api(neu ? 'einrichten' : 'anmelden', { passwort: f.p.value });
      t.hidden = true;
      t.innerHTML = '';
      await laden();
    } catch (e) { fe.textContent = e.message; }
  });
}

// ---------------------------------------------------------------- Rahmen
async function laden() {
  Z = await api('stand');
  $('#app').hidden = false;
  rand();
  leiste();
  zeige();
}
function rand() {
  const n = Z.aenderungen.length, teil = location.hash.split('/')[1] || 'uebersicht', an = teil === 'seite' ? 'seiten' : teil;
  $('#rand').innerHTML = `<a class="rand__marke" href="#/uebersicht"><img src="/assets/logo/wortmarke-leiste.webp" width="760" height="141" alt="Waldhotel Doldenhorn"><span>Studio</span></a>
  <nav aria-label="Bereiche">${NAV.map(p => p ? `<a href="${p[0] === 'pruefung' ? 'pruefung.html' : '#/' + p[0]}" class="${an === p[0] ? 'an' : ''}">${ik(p[2])}${p[1]}${p[0] === 'aenderungen' && n ? `<b>${n}</b>` : ''}</a>` : '<div class="rand__trenn"></div>').join('')}</nav>
  <div class="rand__fuss"><a href="/live/index.html" target="_blank" rel="noopener">Website ansehen ${PF}</a>${OFFEN || PROBE ? '' : '<button type="button" data-akt="abmelden">Abmelden</button>'}</div>`;
  const aktiv = $('#rand nav a.an');
  if (aktiv && innerWidth <= 860) aktiv.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function kopf(titel, text, rechts = '') {
  return `<header class="kopfz"><div><h1>${titel}</h1>${text ? `<p>${text}</p>` : ''}</div><div class="kopfz__r">${rechts}</div></header>`;
}
let hier = location.hash;
function zeige(halte) {
  if (!Z) return;
  const [, name = 'uebersicht', arg] = location.hash.split('/');
  W = null;
  offen = null;
  hier = location.hash;
  if (halte !== true) sicht.scrollTop = 0;
  (SICHTEN[name] || uebersicht)(arg ? decodeURIComponent(arg) : undefined);
  const nav = NAV.find(p => p && p[0] === (name === 'seite' ? 'seiten' : name));
  document.title = (nav ? nav[1] + ' · ' : '') + 'Studio · Waldhotel Doldenhorn';
  rand();
}
addEventListener('hashchange', () => {
  if (offen && offen() && location.hash !== hier) {
    const ziel = location.hash;
    history.replaceState(null, '', hier || '#/uebersicht');
    frage('Noch nicht <em>gespeichert.</em>', 'Sie haben Angaben geändert und noch nicht auf „Speichern“ gedrückt. Wenn Sie weitergehen, gehen sie verloren.', 'Ohne Speichern weiter', async () => { offen = null; location.hash = ziel; });
    return;
  }
  if (!Z) return;
  zeige();
  leiste();
});

// ---------------------------------------------------------------- Entwurfsleiste, Liste, Quittung
const HAKEN = IK.haken;
let letzteZahl = null, BLITZ = null, offen = null;
function vor(z) {
  const m = Math.round((Date.now() - new Date(z)) / 60000);
  return isNaN(m) ? '' : m < 1 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : datum(z);
}
const nachZeit = () => [...Z.aenderungen].sort((a, b) => (b.zeit || '').localeCompare(a.zeit || ''));
function leiste() {
  const el = $('#leiste'), n = Z.aenderungen.length, neueste = nachZeit()[0], zuletzt = Z.verlauf.find(v => !v.anfang);
  el.innerHTML = n ? `<button class="leiste__l" type="button" data-akt="lade" aria-label="Liste der Änderungen zeigen"><i class="leiste__z">${n}</i><span><b>${n === 1 ? 'Änderung' : 'Änderungen'} im Entwurf</b><small>Zuletzt: ${h(neueste.satz)}${neueste.zeit ? ' · ' + vor(neueste.zeit) : ''}</small></span></button>
    <div class="leiste__r"><button class="kn kn--klein kn--linie" type="button" data-akt="lade">Liste zeigen</button><a class="kn kn--klein kn--linie" href="/entwurf/${W ? encodeURIComponent(W.datei) : 'index.html'}" target="_blank" rel="noopener">Entwurf ansehen ${PF}</a><button class="kn kn--hell" type="button" data-akt="raus">Veröffentlichen</button></div>`
    : `<div class="leiste__l"><i class="leiste__z ok">${HAKEN}</i><span><b>Alles veröffentlicht</b><small>${zuletzt ? 'Stand vom ' + datum(zuletzt.zeit) : 'Die Website zeigt den neuesten Stand.'}</small></span></div>
    <div class="leiste__r"><a class="kn kn--klein kn--linie" href="/live/index.html" target="_blank" rel="noopener">Website ansehen ${PF}</a></div>`;
  if (letzteZahl !== null && letzteZahl !== n && n) $('.leiste__z', el).classList.add('hupf');
  letzteZahl = n;
  if (!$('#lade').hidden) lade();
}
function kurzdiff(c) {
  if (c.art === 'bild') return `<span class="mini"><img src="${h(c.vorher)}" alt=""><i>→</i><img src="${h(c.nachher)}" alt=""></span>`;
  if (c.art === 'karte' || c.art === 'liste') return c.punkte.slice(0, 4).map(p => `<span class="zl"><b>${h(p.name)}</b> ${h(p.text)}</span>`).join('') + (c.punkte.length > 4 ? `<span class="zl">und ${c.punkte.length - 4} weitere</span>` : '');
  if (c.art === 'google') return c.teile.slice(0, 4).map(t => `<span class="zl">${h(t.feld)}: ${t.vorher ? `<s>${h(t.vorher)}</s> → ` : ''}<b>${h(t.nachher)}</b></span>`).join('');
  return `<span class="zl"><s>${h(c.vorher) || 'leer'}</s> → <b>${h(c.nachher) || 'leer'}</b></span>`;
}
function lade() {
  const l = $('#lade'), cs = nachZeit();
  l.hidden = false;
  l.innerHTML = `<div class="lade__k" role="dialog" aria-label="Ihr Entwurf"><header><div><h2>Ihr <em>Entwurf.</em></h2><p>${cs.length ? 'Gespeichert, aber noch nicht auf der Website. Erst „Veröffentlichen“ macht es für Gäste sichtbar.' : 'Nichts offen. Alles steht auf der Website.'}</p></div>
      <button class="rund" type="button" data-akt="ladezu" aria-label="Schliessen">${SYM.zu}</button></header>
    <ol class="lade__l">${cs.map(c => `<li data-id="${h(c.id)}"><span class="lade__z">${ik(ARTZ[c.art])}</span><div><b>${h(c.titel)}</b><small>${h(c.ort || '')}${c.zeit ? ' · ' + vor(c.zeit) : ''}</small><p>${kurzdiff(c)}</p>
      <div class="lade__a">${c.stellen.length ? '<button class="link" type="button" data-akt="sehen">Auf der Seite ansehen</button>' : ''}<button class="link" type="button" data-akt="weg">Zurücknehmen</button></div></div></li>`).join('')}</ol>
    ${cs.length ? `<footer><button class="link" type="button" data-akt="alles">Alles zurücknehmen</button><button class="kn kn--hell" type="button" data-akt="raus">Veröffentlichen</button></footer>` : ''}</div>`;
}
function ladeZu() { const l = $('#lade'); l.hidden = true; l.innerHTML = ''; }
async function aktAenderung(akt, id, seite) {
  const c = Z.aenderungen.find(x => x.id === id), n = Z.aenderungen.length;
  try {
    if (akt === 'sehen' && c) { ladeZu(); vergleich(c, seite); }
    else if (akt === 'weg' && c) { await aendern({ art: 'verwerfen', id: c.id }); sag('Zurückgenommen: ' + c.titel); neuZeichnen(); }
    else if (akt === 'alles') frage('Alles <em>zurücknehmen?</em>', `${mal(n, 'Änderung geht', 'Änderungen gehen')} verloren. Die Website bleibt, wie sie ist.`, 'Alles zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'alles' }); sag('Der Entwurf ist leer.'); neuZeichnen(); });
    else if (akt === 'raus') { ladeZu(); veroeffentlichen(); }
  } catch (e) { sag(e.message, true); }
}
function quittung(titel, text, o = {}) {
  const m = $('#meldung');
  $$('.quitt', m).forEach(x => x.remove());
  const d = document.createElement('div'), c = o.id && Z.aenderungen.find(x => x.id === o.id);
  d.className = 'quitt';
  d.setAttribute('role', 'status');
  d.innerHTML = `<i>${HAKEN}</i><div><b>${h(titel)}</b>${text ? `<span>${h(text)}</span>` : ''}<small>Im Entwurf gespeichert. Auf der Website erst nach dem Veröffentlichen.</small>
    <div class="quitt__a">${c && c.stellen.length ? '<button type="button" data-q="sehen">Vorher/Nachher ansehen</button>' : ''}${o.zurueck ? '<button type="button" data-q="zurueck">Rückgängig</button>' : ''}</div></div>
    <button class="quitt__zu" type="button" data-q="zu" aria-label="Schliessen">${SYM.zu}</button>`;
  d.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-q]');
    if (!b) return;
    d.remove();
    if (b.dataset.q === 'sehen') { const x = Z.aenderungen.find(y => y.id === o.id); if (x) vergleich(x, o.seite); }
    if (b.dataset.q === 'zurueck') { try { await aendern(o.zurueck); sag('Rückgängig gemacht.'); neuZeichnen(); } catch (e) { sag(e.message, true); } }
  });
  m.appendChild(d);
  setTimeout(() => d.remove(), 10000);
}
async function tun(a, q) {
  try { await aendern(a); if (q) quittung(q.titel, q.text, q); return true; } catch (e) { sag(e.message, true); return false; }
}
function neuZeichnen() {
  if (W) return neuLaden({});
  const y = sicht.scrollTop;
  zeige(true);
  sicht.scrollTop = y;
}
const chipsH = (name, opt, wert) => `<div class="chips" data-chips="${name}">${opt.map(([v, t]) => `<button type="button" data-v="${h(v)}" class="${String(v) === String(wert) ? 'an' : ''}">${h(t)}</button>`).join('')}</div>`;
const schalter = (id, an, text) => `<label class="schalter"><input type="checkbox" id="${id}"${an ? ' checked' : ''}><i></i><span>${text}</span></label>`;
document.addEventListener('click', ev => {
  const c = ev.target.closest('.chips button');
  if (!c) return;
  $$('button', c.parentNode).forEach(x => x.classList.toggle('an', x === c));
  c.parentNode.dispatchEvent(new CustomEvent('wahl', { bubbles: true, detail: { name: c.parentNode.dataset.chips, wert: c.dataset.v } }));
});

// ---------------------------------------------------------------- Übersicht
function uebersicht() {
  const n = Z.aenderungen.length, st = new Date().getHours(), cs = nachZeit();
  const tuer = (akt, z, titel, text) => `<button class="tuer" type="button" data-los="${akt}">${ik(z)}<b>${titel}</b><span>${text}</span><i>${PF}</i></button>`;
  const zeit = p => (Z.felder[p] || {}).wert || '';
  sicht.innerHTML = `<div class="in">${kopf(st < 11 ? 'Guten <em>Morgen.</em>' : st < 18 ? 'Guten <em>Tag.</em>' : 'Guten <em>Abend.</em>', 'Suchen Sie sich aus, was Sie tun möchten. Alles wird zuerst im Entwurf gespeichert. Unten sehen Sie jederzeit, was offen ist, und stellen es mit einem Knopf auf die Website.')}
  ${Z.fehler ? `<p class="hinweis" style="margin-bottom:14px"><b>Der Entwurf lässt sich gerade nicht bauen.</b> ${h(Z.fehler)} <a class="link" href="pruefung.html">Zur Prüfung</a></p>` : ''}
  <h2 class="zw" style="margin-top:0">Was möchten Sie tun?</h2>
  <div class="raster r-3">
    ${tuer('zimmer', 'bett', 'Zimmerpreis ändern', 'Preis ab, Grösse, Belegung und Fotos je Kategorie.')}
    ${tuer('gericht', 'gabel', 'Gericht auf die Karte', 'Neues Gericht auf die Grosse Karte oder die Bistrokarte setzen.')}
    ${tuer('haus', 'uhr', 'Öffnungszeiten ändern', 'Restaurant, Au Gourmet, Bistro und Hallenbad. Einmal ändern, auf jeder Seite richtig.')}
    ${tuer('termin', 'kalender', 'Termin eintragen', 'Küchenfest, Reise-Woche oder Curling-Turnier.')}
    ${tuer('seiten', 'text', 'Text oder Überschrift ändern', 'Seite öffnen, auf den Text klicken, schreiben.')}
    ${tuer('bilder', 'bild', 'Bild tauschen', 'Ein Foto ersetzen, überall wo es zu sehen ist.')}
    ${tuer('spa', 'tropfen', 'Massage-Preis ändern', 'Das Massage-Menü mit Dauer und Preis, die Saunen.')}
    ${tuer('team', 'personen', 'Stelle ausschreiben', 'Offene Stellen auf der Karriere-Seite und auf „Das Haus“.')}
    ${tuer('hinweis', 'glocke', 'Hinweis für Gäste', 'Betriebsferien oder Feiertage, unten auf jeder Seite.')}
  </div>
  ${n ? `<h2 class="zw">Im Entwurf<span>${String(n).padStart(2, '0')}</span></h2><section class="blatt offenes">${cs.slice(0, 4).map(c => `<div class="offenes__z" data-id="${h(c.id)}"><span class="lade__z">${ik(ARTZ[c.art])}</span><div><b>${h(c.satz)}</b><small>${h(c.ort || '')}${c.zeit ? ' · ' + vor(c.zeit) : ''}</small></div>
      ${c.stellen.length ? '<button class="kn kn--klein kn--linie" type="button" data-akt="sehen">Ansehen</button>' : ''}</div>`).join('')}
      <div class="offenes__f"><button class="link" type="button" data-akt="lade">${n > 4 ? `Alle ${n} zeigen` : 'Liste öffnen'}</button><button class="kn kn--klein" type="button" data-akt="raus">Veröffentlichen</button></div></section>` : ''}
  <h2 class="zw">Die Zeiten</h2>
  <div class="raster r-4">${[['salon', 'Au Gourmet', zeit('gourmet.zeiten')], ['gruener-saal', 'Restaurant Doldenhorn', zeit('rest.zeiten') + (zeit('rest.ruhetage') ? ' · ' + zeit('rest.ruhetage') : '')], ['kamin', 'Bistro', zeit('bistro.zeiten')], ['becken', 'Hallenbad', zeit('spa.bad')]].map(([b, name, z]) => `<a class="hk" href="#/haus"><span class="hk__b"><img src="${bildadr(b)}" alt="" loading="lazy"></span>
    <span class="hk__t"><b>${h(name)}</b><span>${h(z)}</span><i>Zeiten ändern</i></span></a>`).join('')}</div></div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const t = ev.target.closest('[data-los]'), s = ev.target.closest('[data-akt="sehen"]');
    if (s) return aktAenderung('sehen', s.closest('[data-id]').dataset.id);
    if (!t) return;
    const los = t.dataset.los;
    if (los === 'gericht') gerichtFenster({ key: 'karte' });
    else if (los === 'termin') { location.hash = '#/angebote'; setTimeout(() => listeFenster('termine.kuechenfeste'), 60); }
    else location.hash = '#/' + los;
  });
}

// ---------------------------------------------------------------- Seiten
function seiten() {
  const gruppen = [...new Set(Z.seiten.map(s => s.gruppe))];
  sicht.innerHTML = `<div class="in">${kopf('Seiten <em>& Texte.</em>', 'Suchen Sie sich eine Seite aus. Sie öffnet sich so, wie Gäste sie sehen. Ein Klick auf einen Text oder ein Bild, und Sie können es ändern.')}
  ${gruppen.map(g => `<h2 class="zw">${g}<span>${String(Z.seiten.filter(s => s.gruppe === g).length).padStart(2, '0')}</span></h2><div class="raster r-4">${Z.seiten.filter(s => s.gruppe === g).map(s =>
    `<a class="sk" href="#/seite/${encodeURIComponent(s.datei)}"><span class="sk__b">${s.bild ? `<img src="${bildadr(s.bild)}" alt="" loading="lazy">` : ''}</span><span class="sk__t"><b>${h(s.name)}</b><span>${mal(s.texte, 'Text', 'Texte')} · ${mal(s.bilder, 'Bild', 'Bilder')}</span></span></a>`).join('')}</div>`).join('')}</div>`;
}

// ---------------------------------------------------------------- Seite bearbeiten
const RSTIL = `.studio-hov,.studio-an{position:absolute;z-index:2147483000;pointer-events:none;border-radius:5px;display:none;box-sizing:border-box}
.studio-hov{outline:calc(1.5px*var(--studio-k,1)) dashed #b89850;outline-offset:calc(4px*var(--studio-k,1))}
.studio-hov::before{content:attr(data-w);position:absolute;left:-4px;bottom:calc(100% + 9px*var(--studio-k,1));background:#b89850;color:#0f1620;font:500 10px/1 'DM Mono',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;padding:6px 8px;border-radius:5px;white-space:nowrap;transform:scale(var(--studio-k,1));transform-origin:0 100%}
.studio-hov[data-w=""]::before{display:none}
.studio-an{outline:calc(2px*var(--studio-k,1)) solid #b89850;outline-offset:calc(4px*var(--studio-k,1));background:rgba(184,152,80,.09)}
.studio-werk [data-e]{cursor:text}.studio-werk img[data-b]{cursor:pointer;pointer-events:auto!important}
.studio-werk .glanz{display:none!important}`;
function richte(d, werk) {
  if (!d.getElementById('studio-stil')) {
    const s = d.createElement('style');
    s.id = 'studio-stil';
    s.textContent = RSTIL;
    d.head.appendChild(s);
  }
  if (werk) d.documentElement.classList.add('studio-werk');
  const k = c => { const b = d.createElement('div'); b.className = c; d.body.appendChild(b); return b; };
  return { hov: k('studio-hov'), an: k('studio-an') };
}
function rahme(box, el, wort) {
  if (!box) return;
  const r = el && el.isConnected ? el.getBoundingClientRect() : null;
  if (!r || (!r.width && !r.height)) { box.style.display = 'none'; return false; }
  const d = el.ownerDocument, w = d.defaultView, wirt = el.closest('dialog') || d.body;
  if (box.parentNode !== wirt) wirt.appendChild(box);
  let x = r.left + w.scrollX, y = r.top + w.scrollY;
  if (wirt !== d.body) { const wr = wirt.getBoundingClientRect(); x = r.left - wr.left + wirt.scrollLeft - wirt.clientLeft; y = r.top - wr.top + wirt.scrollTop - wirt.clientTop; }
  Object.assign(box.style, { display: 'block', left: x + 'px', top: y + 'px', width: r.width + 'px', height: r.height + 'px' });
  box.dataset.w = wort || '';
  return true;
}
function passe(fr, wirt, soll) {
  const tu = () => {
    if (wirt.classList.contains('handy')) { fr.style.cssText = ''; try { fr.contentDocument.documentElement.style.setProperty('--studio-k', '1'); } catch (e) {} return; }
    const w = wirt.clientWidth, hoch = wirt.clientHeight;
    if (!w) return;
    const k = Math.min(1, w / soll);
    fr.style.cssText = `position:absolute;left:0;top:0;width:${k < 1 ? soll : w}px;height:${hoch / k}px;transform-origin:0 0;transform:${k < 1 ? `scale(${k})` : 'none'}`;
    try { fr.contentDocument.documentElement.style.setProperty('--studio-k', (1 / k).toFixed(3)); } catch (e) {}
  };
  fr.addEventListener('load', tu);
  new ResizeObserver(tu).observe(wirt);
  tu();
  return tu;
}
function zeig(el) {
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.hidden) p.hidden = false;
    if (p.tagName === 'DIALOG' && !p.open) { try { p.showModal(); } catch (e) { p.setAttribute('open', ''); } }
    if (p.tagName === 'DETAILS') p.open = true;
    if (p.classList.contains('tafel__w') && !p.classList.contains('an')) [...p.parentElement.children].forEach(c => c.classList.toggle('an', c === p));
    if (p.classList.contains('wahl__blatt') && !p.classList.contains('an')) [...p.parentElement.children].forEach(c => c.classList.toggle('an', c === p));
  }
}
function artVon(q, rein) {
  if (!rein) return 'text';
  if (q[0].startsWith('k:')) return 'gericht';
  if (q[0].startsWith('kg:')) return 'gruppe';
  if (q[0].startsWith('l:')) return 'liste';
  if (q[0].startsWith('seite:')) return 'eigene';
  if (q[0].startsWith('hinweis.')) return 'hinweis';
  return 'angabe';
}
const WORT = { gericht: 'Zeile der Karte ändern', gruppe: 'Gruppe ändern', liste: 'Eintrag bearbeiten', eigene: 'Seite bearbeiten', hinweis: 'Hinweis bearbeiten', angabe: 'Angabe ändern', text: 'Text ändern' };
function ziel(d, x, y) {
  const els = d.elementsFromPoint(x, y).filter(e => !/^studio-/.test(e.className));
  if (!els.length) return null;
  let t = els[0].closest('[data-e]') || els.slice(0, 5).find(e => e.matches('[data-e]'));
  const b = els.find(e => e.matches('img[data-b]'));
  if (!t && b) return { art: 'bild', el: b, wort: 'Bild tauschen' };
  if (!t) return null;
  const q = (t.dataset.q || '').split(' ').filter(Boolean), rein = t.hasAttribute('data-rein');
  const art = artVon(q, rein);
  return { art, el: t, q, wort: WORT[art] };
}
function zielVon(el) {
  const q = (el.dataset.q || '').split(' ').filter(Boolean), rein = el.hasAttribute('data-rein');
  return { art: artVon(q, rein), el, q };
}
function seite(datei) {
  const s = Z.seiten.find(x => x.datei === datei) || Z.seiten[0];
  const gruppen = [...new Set(Z.seiten.map(x => x.gruppe))];
  sicht.innerHTML = `<div class="werk">
    <div class="werk__leiste">
      <a class="rund" href="#/seiten" title="Zurück zu den Seiten" aria-label="Zurück zu den Seiten">${SYM.links}</a>
      <select id="w-seite" aria-label="Seite">${gruppen.map(g => `<optgroup label="${g}">${Z.seiten.filter(x => x.gruppe === g).map(x => `<option value="${h(x.datei)}"${x.datei === s.datei ? ' selected' : ''}>${h(x.name)}</option>`).join('')}</optgroup>`).join('')}</select>
      <button class="rund an" type="button" data-akt="geraet" data-g="rechner" title="Wie am Rechner" aria-label="Wie am Rechner">${SYM.rechner}</button>
      <button class="rund" type="button" data-akt="geraet" data-g="handy" title="Wie am Handy" aria-label="Wie am Handy">${SYM.handy}</button>
      <span class="werk__hin">Klicken Sie in der Seite auf einen Text oder ein Bild. Rechts ändern Sie es und bestätigen mit „Übernehmen“.</span>
    </div>
    <div class="werk__buehne" id="w-buehne"><iframe id="w-rahmen" title="${h(s.name)}" src="/entwurf/${encodeURIComponent(s.datei)}?nomotion"></iframe></div>
    <aside class="pruef" id="w-pruef" aria-live="polite"></aside>
  </div>`;
  W = { datei: s.datei, fr: $('#w-rahmen'), sel: null, y: 0, wieder: null };
  W.passe = passe(W.fr, $('#w-buehne'), 1200);
  W.fr.addEventListener('load', werkBereit);
  $('#w-seite').addEventListener('change', ev => { location.hash = '#/seite/' + encodeURIComponent(ev.target.value); });
  pruefLeer();
}
function werkBereit() {
  if (!W) return;
  const d = W.fr.contentDocument;
  if (!d || !d.body) return;
  const w = d.defaultView;
  Object.assign(W, richte(d, true), { sel: null });
  d.addEventListener('mousemove', ev => { const t = ziel(d, ev.clientX, ev.clientY); rahme(W.hov, t && (!W.sel || t.el !== W.sel.el) ? t.el : null, t && t.wort); }, true);
  d.documentElement.addEventListener('mouseleave', () => W && rahme(W.hov, null));
  d.addEventListener('click', ev => {
    if (ev.target.closest && ev.target.closest('a[href]')) ev.preventDefault();
    const t = ziel(d, ev.clientX, ev.clientY);
    if (t) waehle(t);
  }, true);
  d.addEventListener('submit', ev => ev.preventDefault(), true);
  const nach = () => { if (W && W.sel) rahme(W.an, W.sel.el); };
  w.addEventListener('scroll', nach, { passive: true, capture: true });
  w.addEventListener('resize', nach);
  if (W.wieder) {
    const m = W.wieder, el = m.q ? d.querySelector(`[data-q="${m.q}"]`) : m.b ? d.querySelector(`img[data-b="${m.b}"][data-bn="${m.n}"]`) : m.e ? d.querySelector(`[data-e="${m.e}"][data-en="${m.n}"]`) : null;
    W.wieder = null;
    if (el) {
      zeig(el);
      el.scrollIntoView({ block: 'center', inline: 'center' });
      setTimeout(() => { if (W && el.isConnected) waehle(el.matches('img') ? { art: 'bild', el } : zielVon(el)); }, 150);
      return;
    }
    w.scrollTo(0, W.y);
  }
  pruefLeer();
}
function neuLaden(merk) {
  if (!W) return;
  const w = W.fr.contentWindow;
  W.y = w.scrollY;
  W.wieder = merk || {};
  w.location.reload();
}
function pruefLeer() {
  if (!W) return;
  W.sel = null;
  rahme(W.an, null);
  const hier = Z.aenderungen.filter(c => c.stellen.some(x => x.seite === W.datei));
  $('#w-pruef').innerHTML = `<div class="pruef__leer">${ik('tannen')}<b>Klicken Sie in die Seite.</b><p>Alles, was gold umrandet wird, können Sie ändern.</p>
    <ul><li><b>Text</b>Überschriften, Absätze, Knöpfe</li><li><b>Bild</b>Foto tauschen</li><li><b>Angabe</b>Zeiten, Preise, Zimmer, Termine</li></ul></div>
    ${hier.length ? `<div class="pruef__offen"><h3>Auf dieser Seite im Entwurf</h3>${hier.slice(0, 6).map(c => `<button type="button" data-id="${h(c.id)}"><b>${h(c.satz)}</b><small>Vorher/Nachher ansehen</small></button>`).join('')}</div>` : ''}`;
  $$('.pruef__offen button').forEach(b => b.addEventListener('click', () => aktAenderung('sehen', b.dataset.id, W.datei)));
}
function waehle(t) {
  if (W.sel && W.sel.orig !== undefined && W.sel.el.isConnected && !W.sel.fertig) spiegel(W.sel, W.sel.orig);
  W.sel = t;
  rahme(W.hov, null);
  rahme(W.an, t.el);
  const nach = {
    text: pruefText, angabe: pruefAngabe, bild: pruefBild,
    gericht: t => { const [, key, gi, i] = t.q[0].split(':'); pruefLeer(); gerichtFenster({ key, gi: +gi, i: +i }); },
    gruppe: t => { const [, key, gi] = t.q[0].split(':'); pruefLeer(); gruppeFenster(key, +gi); },
    liste: t => { const [, key, i] = t.q[0].split(':'); pruefLeer(); listeFenster(key, +i); },
    eigene: t => { pruefLeer(); seiteFenster(t.q[0].split(':')[1]); },
    hinweis: () => { location.hash = '#/hinweis'; },
  };
  nach[t.art](t);
}
const woSteht = (n, s) => n > 1 ? `Steht an <b>${n} Stellen</b>${s > 1 ? ` auf <b>${s} Seiten</b>` : ''}.` : '';
function spiegel(t, html) {
  const d = t.el.ownerDocument, alle = t.ueberall ? $$(`[data-e="${t.el.dataset.e}"]:not([data-rein])`, d) : [t.el];
  alle.forEach(e => { e.innerHTML = html; });
  $$(`[data-spiegel] [data-e="${t.el.dataset.e}"][data-en="${t.el.dataset.en}"]`, d).forEach(e => { e.innerHTML = html; });  // unsichtbare Kopien (Schatten, Laufband) folgen sofort mit
  rahme(W.an, t.el);
}
function rein(html) {
  return html.replace(/<div[^>]*>|<p[^>]*>/gi, '<br>').replace(/<\/(div|p)>/gi, '').replace(/\r?\n/g, '<br>').replace(/^(<br>)+/, '').replace(/&nbsp;/g, ' ');
}
function pruefText(t) {
  const el = t.el, hs = el.dataset.e, n = +el.dataset.en, lauf = el.hasAttribute('data-lauf'), m = Z.mehrfach[hs];
  const tag = el.closest('h1,h2,h3,h4,.d1,.d2,.d3') ? 'Überschrift' : el.closest('a,button') ? 'Knopf oder Link' : 'Text';
  const link = el.closest('a[href]'), intern = link && /^[\w\-]+\.html/.test(link.getAttribute('href') || '') ? link.getAttribute('href').split('#')[0] : null;
  t.orig = el.innerHTML;
  t.ueberall = !!m;
  const angaben = t.q.filter(q => Z.felder[q]).map(q => Z.felder[q]);
  const listen = t.q.filter(q => /^(l|k|kg):/.test(q));
  $('#w-pruef').innerHTML = `<h2>${tag}</h2>
    <div class="schreib" id="w-schreib" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true" aria-label="${tag}"></div>
    ${m ? `<div><div class="wahl2" role="group" aria-label="Wo ändern"><button type="button" class="an" data-wo="1">Überall</button><button type="button" data-wo="0">Nur an dieser Stelle</button></div>
      <p class="hinweis" style="margin-top:10px" id="w-wo">${woSteht(m[0], m[1])} Sie ändern alle auf einmal.</p></div>` : ''}
    ${angaben.length ? `<p class="hinweis">In diesem Satz steht eine Angabe, die an vielen Stellen gleich ist: <b>${angaben.map(a => h(a.label)).join(', ')}</b>. Ändern Sie sie besser unter „Haus & Zeiten“. Schreiben Sie den Satz hier um, folgt er ihr nicht mehr von selbst.</p>` : ''}
    ${listen.length ? '<p class="hinweis">In diesem Satz steckt ein Eintrag aus einer Liste oder Karte (Zimmer, Termin, Preis). Ändern Sie ihn besser dort. Schreiben Sie den Satz hier um, folgt er dem Eintrag nicht mehr.</p>' : ''}
    <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Übernehmen</button>
      <button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button>
      ${el.hasAttribute('data-neu') ? '<button class="link" type="button" id="w-ur" style="justify-self:center">Ursprünglichen Text zurückholen</button>' : ''}
      ${intern && Z.seiten.some(s => s.datei === intern) ? `<a class="link" href="#/seite/${encodeURIComponent(intern)}" style="justify-self:center">Zur verlinkten Seite wechseln</a>` : ''}</div>`;
  const box = $('#w-schreib');
  box.innerHTML = t.orig.replace(/\s*\n\s*/g, ' ');
  const anfang = rein(box.innerHTML);
  box.addEventListener('input', () => spiegel(t, rein(box.innerHTML)));
  box.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); if (!lauf && !ev.metaKey && !ev.ctrlKey) document.execCommand('insertLineBreak'); else if (ev.metaKey || ev.ctrlKey) $('#w-ok').click(); }
  });
  box.addEventListener('paste', ev => { ev.preventDefault(); document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text/plain')); });
  $$('.wahl2 button').forEach(b => b.addEventListener('click', () => {
    spiegel(t, t.orig);
    t.ueberall = b.dataset.wo === '1';
    $$('.wahl2 button').forEach(x => x.classList.toggle('an', x === b));
    $('#w-wo').innerHTML = t.ueberall ? `${woSteht(m[0], m[1])} Sie ändern alle auf einmal.` : 'Nur diese eine Stelle ändert sich. Alle anderen bleiben, wie sie sind.';
    spiegel(t, rein(box.innerHTML));
  }));
  $('#w-ab').addEventListener('click', () => { spiegel(t, t.orig); pruefLeer(); });
  const ur = $('#w-ur');
  if (ur) ur.addEventListener('click', async () => {
    try { await aendern({ art: 'text-weg', h: hs, seite: W.datei, n }); t.fertig = true; sag('Der ursprüngliche Text steht wieder da.'); neuLaden({ e: hs, n }); } catch (e) { sag(e.message, true); }
  });
  $('#w-ok').addEventListener('click', async () => {
    const neu = rein(box.innerHTML);
    if (neu === t.orig || neu === anfang) { spiegel(t, t.orig); pruefLeer(); return; }
    try {
      await aendern({ art: 'text', h: hs, seite: W.datei, n, neu, ueberall: t.ueberall, lauf });
      t.fertig = true;
      el.setAttribute('data-neu', '');
      pruefLeer();
      quittung('Text gespeichert', box.textContent.trim().slice(0, 90), { id: t.ueberall ? `t:${hs}||` : `t:${hs}|${W.datei}|${n}`, seite: W.datei });
    } catch (e) { sag(e.message, true); }
  });
  box.focus();
  const sel = getSelection(), r = document.createRange();
  r.selectNodeContents(box);
  r.collapse(false);
  sel.removeAllRanges();
  sel.addRange(r);
}
function pruefAngabe(t) {
  const felder = t.q.map(q => [q, Z.felder[q]]).filter(x => x[1]);
  if (!felder.length) return pruefLeer();
  const f0 = felder[0][1], bereich = Z.bereiche[f0.bereich];
  $('#w-pruef').innerHTML = `<h2>${bereich ? h(bereich) : 'Angabe'}</h2>
    ${felder.map(([q, f]) => `<label class="feld"><span>${h(f.label)}</span><input data-p="${q}" value="${h(f.wert)}"></label>`).join('')}
    <p class="hinweis">${woSteht(f0.stellen, f0.seiten) || 'Diese Angabe gilt für die ganze Website.'} Sie ändern sie hier für alle auf einmal.</p>
    <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Übernehmen</button><button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button>
    <a class="link" href="#/haus" style="justify-self:center">Alle Angaben des Hauses</a></div>`;
  const ins = $$('#w-pruef input');
  ins.forEach(i => i.addEventListener('keydown', ev => { if (ev.key === 'Enter') $('#w-ok').click(); }));
  $('#w-ab').addEventListener('click', pruefLeer);
  $('#w-ok').addEventListener('click', async () => {
    try {
      const werte = {}, alte = {};
      ins.forEach(i => { if (i.value.trim() !== Z.felder[i.dataset.p].wert) { werte[i.dataset.p] = i.value; alte[i.dataset.p] = Z.felder[i.dataset.p].wert; } });
      const ps = Object.keys(werte);
      if (!ps.length) return pruefLeer();
      await aendern({ art: 'fakten', werte });
      quittung(mal(ps.length, 'Angabe', 'Angaben') + ' gespeichert', `${bereich || 'Ganze Website'} · ${ps.map(p => Z.felder[p].label).join(', ')}`, { id: 'f:' + ps[0], seite: W.datei, zurueck: { art: 'fakten', werte: alte } });
      neuLaden({ e: t.el.dataset.e, n: t.el.dataset.en });
    } catch (e) { sag(e.message, true); }
  });
  ins[0].focus();
  ins[0].select();
}
function pruefBild(t, neu) {
  const key = t.el.dataset.b, b = Z.bilder.find(x => x.key === key) || { seiten: [], fest: false };
  const sende = async (wert, titel) => { if (await tun({ art: 'bild', key, neu: wert }, { titel, text: mal(b.seiten.length, 'Seite', 'Seiten') + ' betroffen', id: 'b:' + key, seite: W.datei, zurueck: { art: 'bild', key, neu: b.neu || null } })) neuLaden({ b: key, n: t.el.dataset.bn }); };
  if (neu) {
    $('#w-pruef').innerHTML = `<h2>Neues Bild</h2><div class="bildvor"><img src="${h(neu.adresse)}" alt=""></div>
      <p class="hinweis">Es ersetzt das bisherige Bild${b.seiten.length > 1 ? ` auf <b>${b.seiten.length} Seiten</b>` : ''}.${neu.hinweis ? ' ' + h(neu.hinweis) : ''}</p>
      <div class="pruef__kn"><button class="kn kn--breit" type="button" id="w-ok">Bild übernehmen</button><button class="link" type="button" id="w-ab" style="justify-self:center">Abbrechen</button></div>`;
    $('#w-ok').addEventListener('click', () => sende(neu.key, 'Bild getauscht'));
    $('#w-ab').addEventListener('click', () => pruefBild(t));
    return;
  }
  $('#w-pruef').innerHTML = `<h2>Bild</h2><div class="bildvor"><img src="${h(t.el.currentSrc || t.el.src)}" alt=""></div>
    <p class="hinweis">${b.seiten.length > 1 ? `Dieses Bild ist auf <b>${b.seiten.length} Seiten</b> zu sehen: ${b.seiten.slice(0, 6).map(s => h(s.name)).join(', ')}${b.seiten.length > 6 ? ' …' : ''}. Ein neues Bild ersetzt es überall.` : 'Dieses Bild ist nur auf dieser Seite zu sehen.'}
    ${b.sonder ? ` Als ${b.sonder} wird das neue Foto automatisch abgedunkelt, damit die Schrift darauf lesbar bleibt.` : ''}</p>
    <div class="ablage" id="w-ablage" tabindex="0" role="button"><b>Neues Bild wählen</b><span>oder hierher ziehen · JPG, PNG, WebP</span></div>
    ${b.fest ? '' : '<button class="link" type="button" id="w-vorrat" style="justify-self:center;align-self:center">Aus den Fotos der Seite wählen</button>'}
    ${b.neu ? '<button class="link" type="button" id="w-alt" style="justify-self:center;align-self:center">Ursprüngliches Bild zurückholen</button>' : ''}`;
  ablage($('#w-ablage'), key, r => pruefBild(t, r));
  const alt = $('#w-alt'), vorrat = $('#w-vorrat');
  if (alt) alt.addEventListener('click', () => sende(null, 'Ursprüngliches Bild zurückgeholt'));
  if (vorrat) vorrat.addEventListener('click', () => bildWahl(k => { if (k !== key) sende(k, 'Bild getauscht'); }, key));
}

// ---------------------------------------------------------------- Hochladen
function waehleDatei(accept) {
  return new Promise(ok => {
    const i = $('#datei');
    i.value = '';
    if (accept) i.accept = accept;
    i.onchange = () => { ok(i.files[0] || null); i.accept = 'image/jpeg,image/png,image/webp'; };
    i.click();
  });
}
async function ladeHoch(datei, fuer) {
  if (!datei) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(datei.type)) { sag('Bitte ein JPG, PNG oder WebP wählen.', true); return null; }
  sag('Das Bild wird vorbereitet …');
  try {
    const r = await api('hochladen?fuer=' + encodeURIComponent(fuer || ''), datei, true);
    if (r.hinweis) sag(r.hinweis, true);
    return r;
  } catch (e) { sag(e.message, true); return null; }
}
async function hochladen(fuer) { return ladeHoch(await waehleDatei(), fuer); }
function ablage(el, fuer, dann) {
  const los = async d => { const r = await ladeHoch(d, fuer); if (r) dann(r); };
  el.addEventListener('click', async () => los(await waehleDatei()));
  el.addEventListener('keydown', async ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); los(await waehleDatei()); } });
  el.addEventListener('dragover', ev => { ev.preventDefault(); el.classList.add('drauf'); });
  el.addEventListener('dragleave', () => el.classList.remove('drauf'));
  el.addEventListener('drop', ev => { ev.preventDefault(); el.classList.remove('drauf'); los(ev.dataTransfer.files[0]); });
}
/* Aus den Fotos der Seite wählen (legt sich über ein offenes Fenster oder öffnet ein eigenes) */
function bildWahl(dann, gewaehlt) {
  const alle = Z.bilder.filter(b => !b.fest), f = $('#fenster');
  const wand = `<div class="bildwand">${alle.map(b => `<button class="bk${b.key === gewaehlt ? ' gewaehlt' : ''}" type="button" data-k="${h(b.key)}" title="${h(b.was || b.key)}"><img src="${bildadr(b.key)}" alt="" loading="lazy"></button>`).join('')}</div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" id="bw-hoch">Neues Foto hochladen</button><button class="kn kn--linie" type="button" id="bw-zu">${f.hidden ? 'Abbrechen' : 'Zurück'}</button></div>`;
  if (f.hidden) {
    fenster(`<h2>Foto <em>wählen.</em></h2><p>Alle Fotos, die schon auf der Seite liegen. Oder Sie laden ein neues hoch.</p>${wand}`, true);
    const schliess = () => fensterZu();
    $('#bw-zu').addEventListener('click', schliess);
    $$('.bildwand .bk', f).forEach(b => b.addEventListener('click', () => { fensterZu(); dann(b.dataset.k); }));
    $('#bw-hoch').addEventListener('click', async () => { const r = await hochladen(''); if (r) { fensterZu(); dann(r.key); } });
    return;
  }
  const k = $('.fenster__k', f), rest = [...k.children].filter(c => !c.matches('.zu'));
  const w = document.createElement('div');
  w.innerHTML = `<h2>Foto <em>wählen.</em></h2>${wand}`;
  const war = rest.map(c => c.hidden);
  rest.forEach(c => { c.hidden = true; });
  k.appendChild(w);
  k.scrollTop = 0;
  const zurueck = () => { w.remove(); rest.forEach((c, i) => { c.hidden = war[i]; }); };
  $('#bw-zu', w).addEventListener('click', zurueck);
  $$('.bildwand .bk', w).forEach(b => b.addEventListener('click', () => { zurueck(); dann(b.dataset.k); }));
  $('#bw-hoch', w).addEventListener('click', async () => { const r = await hochladen(''); if (r) { zurueck(); dann(r.key); } });
}

// ---------------------------------------------------------------- Karten (Gruppen mit Zeilen: Name, Zusatz, Preis)
function platzNach(stand, y, liste, nameJetzt, nameStand) {
  for (let k = stand.indexOf(y) - 1; k >= 0; k--) {
    const j = liste.findIndex(x => nameJetzt(x) === nameStand(stand[k]));
    if (j >= 0) return j + 1;
  }
  return 0;
}
function karteStatus(k) {
  /* je Gruppe und Zeile: '' · 'neu' · 'anders'; dazu die entfernten Zeilen je Gruppe */
  const a = k.stand, b = k.gruppen, ta = a.map(g => g.t), tb = b.map(g => g.t);
  return b.map((g, gi) => {
    const j = ta.includes(g.t) ? ta.indexOf(g.t) : (gi < a.length && !tb.includes(ta[gi]) ? gi : -1);
    if (j < 0) return { gruppe: 'neu', zeilen: g.z.map(() => 'neu'), weg: [] };
    const za = a[j].z, na = za.map(x => x.n), nb = g.z.map(x => x.n), gleich = za.length === g.z.length;
    const zeilen = g.z.map((x, i) => { const kk = na.includes(x.n) ? na.indexOf(x.n) : (gleich && !nb.includes(na[i]) ? i : -1); if (kk < 0) return 'neu'; const y = za[kk]; return (y.n !== x.n || y.z !== x.z || y.p !== x.p || y.aus !== x.aus) ? 'anders' : ''; });
    return { gruppe: g.t !== a[j].t ? 'anders' : '', zeilen, weg: za.filter((y, i) => !nb.includes(y.n) && !(gleich && !na.includes(nb[i]))), stand: za };
  });
}
function karteBlatt(key) {
  const k = Z.karten[key];
  if (!k) return '';
  const st = karteStatus(k), ohnePreis = false;
  /* Bilder in jeder Liste (Robert 19.10.2026): ein Gericht zeigt nur ein Foto, das es wirklich zeigt; sonst trägt die Rubrik ihr Bild */
  const kb = (art, n) => window.kartenBild ? window.kartenBild(key, art, n) : '';
  const zeile = (x, gi, i, s, letzte) => `<div class="gz${kb('z', x.n) ? '' : ' gz--ohne'}${x.aus ? ' aus' : ''}${BLITZ === `${key}:${gi}:${i}` ? ' blitz' : ''}" data-gi="${gi}" data-i="${i}">
      ${kb('z', x.n) ? `<button class="gz__b" type="button" data-akt="edit" tabindex="-1" aria-hidden="true"><img src="${kb('z', x.n)}" alt="" loading="lazy" decoding="async"></button>` : ''}
      <button class="gz__t" type="button" data-akt="edit" title="Bearbeiten"><b>${h(x.n)}</b>${x.z ? `<span>${h(x.z)}</span>` : ''}</button>
      <span class="gz__s">${x.aus ? '<i class="marke grau">Ausgeblendet</i>' : ''}${s === 'neu' ? '<i class="marke rot">Neu im Entwurf</i>' : s === 'anders' ? '<i class="marke rot">Geändert</i>' : ''}</span>
      <span class="gz__p">${h(x.p)}</span>
      <div class="gz__r"><button class="rund" type="button" data-akt="hoch" title="Nach oben" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" title="Nach unten" aria-label="Nach unten"${letzte ? ' disabled' : ''}>${SYM.runter}</button>
        <button class="rund" type="button" data-akt="aus" title="${x.aus ? 'Wieder zeigen' : 'Vorübergehend ausblenden'}" aria-label="${x.aus ? 'Wieder zeigen' : 'Ausblenden'}">${x.aus ? SYM.augezu : SYM.auge}</button>
        <button class="rund" type="button" data-akt="weg" title="Von der Karte nehmen" aria-label="Von der Karte nehmen">${SYM.korb}</button>
        <button class="kn kn--klein kn--linie" type="button" data-akt="edit">Bearbeiten</button></div></div>`;
  const gruppeH = (g, gi) => `<div class="untergruppe" data-gi="${gi}">
      ${k.eine ? '' : `<div class="untergruppe__k">${kb('g', g.t) ? `<span class="ug__b" aria-hidden="true"><img src="${kb('g', g.t)}" alt="" loading="lazy" decoding="async"></span>` : ''}<h4>${h(g.t)}</h4><span>${String(g.z.filter(x => !x.aus).length).padStart(2, '0')}</span>${st[gi].gruppe === 'neu' ? '<i class="marke rot">Neue Gruppe</i>' : st[gi].gruppe === 'anders' ? '<i class="marke rot">Umbenannt</i>' : ''}
        <div class="gk"><button class="rund" type="button" data-akt="g-hoch" aria-label="Gruppe nach oben"${gi === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="g-runter" aria-label="Gruppe nach unten"${gi === k.gruppen.length - 1 ? ' disabled' : ''}>${SYM.runter}</button><button class="rund" type="button" data-akt="g-weg" title="Gruppe entfernen" aria-label="Gruppe entfernen">${SYM.korb}</button><button class="kn kn--klein kn--linie" type="button" data-akt="g-edit">Umbenennen</button><button class="kn kn--klein kn--linie" type="button" data-akt="neu">Zeile hinzufügen</button></div></div>`}
      ${g.z.map((x, i) => zeile(x, gi, i, st[gi].zeilen[i], i === g.z.length - 1)).join('')}
      ${st[gi].weg.map(y => `<div class="gz gz--ohne weg"><span class="gz__t"><b>${h(y.n)}</b></span><span class="gz__s"><i class="marke grau">Entfernt, noch nicht veröffentlicht</i></span><span class="gz__p"></span><div class="gz__r"><button class="kn kn--klein kn--linie" type="button" data-akt="hol" data-n="${h(y.n)}">Zurückholen</button></div></div>`).join('')}
      ${g.z.length || st[gi].weg.length ? '' : '<p class="gz leer">Noch nichts in dieser Gruppe.</p>'}</div>`;
  return `<section class="blatt gruppe" data-k="${h(key)}"><div class="gruppe__k"><h3>${h(k.titel)}<span>${String(k.gruppen.reduce((a, g) => a + g.z.filter(x => !x.aus).length, 0)).padStart(2, '0')}</span></h3>${k.geaendert ? '<i class="marke rot">Im Entwurf geändert</i>' : ''}
      ${k.eine ? '<button class="kn kn--klein" type="button" data-akt="neu" data-gi="0">Zeile hinzufügen</button>' : '<button class="kn kn--klein" type="button" data-akt="g-neu">Gruppe anlegen</button>'}</div>
    <p class="gruppe__u">${h(k.unter)} · Spalten: Name, ${h(k.zusatz)}, ${h(k.preis)}</p>
    ${k.gruppen.map(gruppeH).join('')}
    ${k.gruppen.length ? '' : '<p class="gz leer">Noch keine Gruppe. Legen Sie oben eine an.</p>'}
    ${k.geaendert ? '<div class="gruppe__f"><button class="link" type="button" data-akt="std">Alle Änderungen an dieser Karte zurücknehmen</button></div>' : ''}</section>`;
}
const kopie = x => JSON.parse(JSON.stringify(x));
function karteKlick(ev) {
  const b = ev.target.closest('[data-akt]'), sec = b && b.closest('[data-k]');
  if (!sec) return false;
  const key = sec.dataset.k, k = Z.karten[key], akt = b.dataset.akt;
  const ug = b.closest('[data-gi]'), gi = ug ? +ug.dataset.gi : (b.dataset.gi !== undefined ? +b.dataset.gi : 0), z = b.closest('.gz'), i = z && z.dataset.i !== undefined ? +z.dataset.i : -1;
  const alt = kopie(k.gruppen), l = kopie(k.gruppen);
  const sende = async (gruppen, titel, text) => { if (await tun({ art: 'karte', key, gruppen }, { titel, text, id: 'k:' + key, zurueck: { art: 'karte', key, gruppen: alt } })) neuZeichnen(); };
  if (akt === 'neu') gerichtFenster({ key, gi: k.gruppen.length ? gi : undefined });
  else if (akt === 'edit') gerichtFenster({ key, gi, i });
  else if (akt === 'g-neu') gruppeFenster(key);
  else if (akt === 'g-edit') gruppeFenster(key, gi);
  else if (akt === 'std') frage('Änderungen <em>zurücknehmen?</em>', `„${k.titel}“ steht danach wieder so da wie auf der Website.`, 'Zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'k:' + key }); sag('Zurückgenommen: ' + k.titel); neuZeichnen(); });
  else if (akt === 'g-hoch' && gi > 0) { [l[gi - 1], l[gi]] = [l[gi], l[gi - 1]]; sende(l, 'Reihenfolge gespeichert', `${l[gi - 1].t} steht jetzt weiter oben`); }
  else if (akt === 'g-runter' && gi < l.length - 1) { [l[gi + 1], l[gi]] = [l[gi], l[gi + 1]]; sende(l, 'Reihenfolge gespeichert', `${l[gi + 1].t} steht jetzt weiter unten`); }
  else if (akt === 'g-weg') frage('Gruppe <em>entfernen?</em>', `„${l[gi].t}“ und ${mal(l[gi].z.length, 'ihre Zeile', 'ihre Zeilen')} verschwinden von der Karte. Bis zum Veröffentlichen lässt sich das zurücknehmen.`, 'Entfernen', async () => { const n = l[gi].t; l.splice(gi, 1); await sende(l, 'Gruppe entfernt', n); });
  else if (akt === 'hol') { const s = karteStatus(k)[gi], y = s.weg.find(x => x.n === b.dataset.n); l[gi].z.splice(platzNach(s.stand, y, l[gi].z, x => x.n, x => x.n), 0, { ...y }); BLITZ = `${key}:${gi}:0`; sende(l, 'Wieder auf der Karte', y.n); }
  else if (akt === 'hoch' && i > 0) { const zz = l[gi].z; [zz[i - 1], zz[i]] = [zz[i], zz[i - 1]]; BLITZ = `${key}:${gi}:${i - 1}`; sende(l, 'Reihenfolge gespeichert', `${zz[i - 1].n} steht jetzt weiter oben`); }
  else if (akt === 'runter' && i >= 0 && i < l[gi].z.length - 1) { const zz = l[gi].z; [zz[i + 1], zz[i]] = [zz[i], zz[i + 1]]; BLITZ = `${key}:${gi}:${i + 1}`; sende(l, 'Reihenfolge gespeichert', `${zz[i + 1].n} steht jetzt weiter unten`); }
  else if (akt === 'aus' && i >= 0) { const x = l[gi].z[i]; x.aus = !x.aus; BLITZ = `${key}:${gi}:${i}`; sende(l, x.aus ? 'Ausgeblendet' : 'Wieder sichtbar', x.aus ? `${x.n} steht vorerst nicht auf der Karte` : x.n); }
  else if (akt === 'weg' && i >= 0) frage('Von der Karte <em>nehmen?</em>', `„${l[gi].z[i].n}“ verschwindet aus ${k.titel}. Bis zum Veröffentlichen holen Sie es mit einem Klick zurück.`, 'Von der Karte nehmen', async () => { const n = l[gi].z[i].n; l[gi].z.splice(i, 1); await sende(l, 'Von der Karte genommen', n); });
  else return false;
  return true;
}
function gerichtFenster({ key, gi, i }) {
  const k = Z.karten[key], neu = i === undefined;
  let grW = gi !== undefined && k.gruppen[gi] ? gi : 0, pos = 'ende';
  const st = neu ? { n: '', z: '', p: '', aus: false } : { ...k.gruppen[gi].z[i] };
  const wort = key === 'karte' || key === 'bistro' ? 'Gericht' : key === 'massage' ? 'Behandlung' : key === 'saunen' ? 'Sauna' : 'Zeile';
  fenster(`<h2>${neu ? `${wort} <em>hinzufügen.</em>` : `${wort} <em>bearbeiten.</em>`}</h2><p class="form2__ort">${h(k.titel)}${!k.eine && !neu ? ' · ' + h(k.gruppen[gi].t) : ''}</p>
    <div class="form2"><div class="form2__l">
      ${neu && !k.eine ? `<div class="feld"><span>Gruppe</span>${chipsH('gruppe', k.gruppen.map((g, n) => [n, g.t]), grW)}</div>` : ''}
      <label class="feld"><span>Name</span><input id="g-n" maxlength="160" value="${h(st.n)}" placeholder="${key === 'saunen' ? 'z. B. Kräutersauna' : key === 'massage' ? 'z. B. Rückenmassage' : 'z. B. Kalbsgeschnetzeltes'}"></label>
      <label class="feld"><span>${h(k.zusatz)}</span><textarea id="g-z" rows="2" maxlength="400" placeholder="${key === 'massage' ? 'z. B. 50 min' : key === 'saunen' ? 'Ein Satz zur Sauna' : 'Zutaten oder Erläuterung, freiwillig'}">${h(st.z)}</textarea></label>
      <label class="feld"><span>${h(k.preis)}</span><input id="g-p" maxlength="60" value="${h(st.p)}" placeholder="${key === 'saunen' ? 'z. B. etwa 65 °C' : 'z. B. 42.00 oder 35.00 / 44.00'}"><small>${key === 'saunen' ? 'So, wie es auf der Seite stehen soll.' : 'Preis in CHF, ohne Währung. Zwei Preise mit Schrägstrich: klein / gross.'}</small></label>
      ${neu ? `<div class="feld"><span>Platz</span>${chipsH('pos', [['ende', 'Am Ende'], ['anfang', 'Ganz oben']], pos)}</div>` : ''}
      ${schalter('g-an', !st.aus, 'Auf der Karte zeigen')}
    </div><div class="form2__r"><span class="mono leise">So steht es auf der Seite</span><div id="g-vor"></div></div></div>
    <div class="fehler" id="g-f" role="alert"></div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="g-ok">${neu ? 'Auf die Karte setzen' : 'Speichern'}</button></div>`, true);
  const f = $('#fenster');
  const mal2 = () => {
    const n = $('#g-n').value.trim() || `Name`, z = $('#g-z').value.trim(), p = $('#g-p').value.trim(), aus = !$('#g-an').checked;
    $('#g-vor').innerHTML = `<div class="vw${aus ? ' aus' : ''}"><div><b>${h(n)}</b>${z ? `<small>${h(z)}</small>` : ''}</div><i>${h(p)}</i></div><p class="vor__h">${aus ? 'Ausgeblendet: steht vorerst nicht auf der Karte.' : h(k.titel) + (k.eine ? '' : ' · ' + h(k.gruppen[grW].t))}</p>`;
  };
  mal2();
  f.oninput = () => { mal2(); $('#g-f').textContent = ''; };
  f.bei = ev => { if (ev.detail.name === 'gruppe') grW = +ev.detail.wert; if (ev.detail.name === 'pos') pos = ev.detail.wert; mal2(); };
  $('#g-ok').addEventListener('click', async ev => {
    const n = $('#g-n').value.trim(), alt = kopie(k.gruppen), l = kopie(k.gruppen);
    if (!n) { $('#g-f').textContent = 'Bitte einen Namen eintragen.'; $('#g-n').focus(); return; }
    const gg = l[neu ? grW : gi];
    if (gg.z.some((x, j) => x.n.toLowerCase() === n.toLowerCase() && (neu || j !== i))) { $('#g-f').textContent = `„${n}“ steht schon in dieser Gruppe. Bitte einen anderen Namen wählen.`; return; }
    const eintrag = { n, z: $('#g-z').value.trim(), p: $('#g-p').value.trim(), aus: !$('#g-an').checked };
    if (neu) { if (pos === 'anfang') gg.z.unshift(eintrag); else gg.z.push(eintrag); } else gg.z[i] = eintrag;
    if (!neu && ['n', 'z', 'p', 'aus'].every(q => (eintrag[q] || '') === (alt[gi].z[i][q] || ''))) { fensterZu(); sag('Nichts geändert, nichts gespeichert.'); return; }
    ev.target.disabled = true;
    const ok = await tun({ art: 'karte', key, gruppen: l }, { titel: neu ? `${wort} hinzugefügt` : `${wort} gespeichert`, text: `${n} · ${k.titel}`, id: 'k:' + key, zurueck: { art: 'karte', key, gruppen: alt } });
    ev.target.disabled = false;
    if (!ok) return;
    fensterZu();
    BLITZ = `${key}:${neu ? grW : gi}:${neu ? (pos === 'anfang' ? 0 : gg.z.length - 1) : i}`;
    const zielH = bereichVon(key);
    if (W) neuLaden({}); else if (location.hash !== zielH) location.hash = zielH; else neuZeichnen();
  });
  $('#g-n').focus();
}
function bereichVon(key) { for (const [n, b] of Object.entries(BEREICHE)) if ([...(b.karten || []), ...(b.karten2 || []), ...(b.karten3 || []), ...(b.listen || []), ...(b.listen2 || [])].includes(key)) return '#/' + n; return key === 'zimmer' ? '#/zimmer' : '#/uebersicht'; }
function gruppeFenster(key, gi) {
  const k = Z.karten[key], neu = gi === undefined;
  fenster(`<h2>${neu ? 'Neue <em>Gruppe.</em>' : 'Gruppe <em>umbenennen.</em>'}</h2><p class="form2__ort">${h(k.titel)}</p><div class="form1">
    <label class="feld"><span>Name der Gruppe</span><input id="gr-t" maxlength="80" value="${h(neu ? '' : k.gruppen[gi].t)}" placeholder="z. B. Herbstgerichte"></label>
    ${neu ? `<div class="feld"><span>Platz</span>${chipsH('pos', [['ende', 'Am Ende'], ['anfang', 'Ganz oben']], 'ende')}</div>` : ''}</div>
    <div class="fehler" id="gr-f"></div><div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="gr-ok">${neu ? 'Anlegen' : 'Speichern'}</button></div>`);
  let pos = 'ende';
  $('#fenster').bei = ev => { if (ev.detail.name === 'pos') pos = ev.detail.wert; };
  $('#gr-ok').addEventListener('click', async () => {
    const t = $('#gr-t').value.trim(), alt = kopie(k.gruppen), l = kopie(k.gruppen);
    if (!t) { $('#gr-f').textContent = 'Bitte einen Namen eintragen.'; return; }
    if (l.some((g, j) => g.t.toLowerCase() === t.toLowerCase() && (neu || j !== gi))) { $('#gr-f').textContent = 'Diesen Namen gibt es schon.'; return; }
    if (neu) { if (pos === 'anfang') l.unshift({ t, z: [] }); else l.push({ t, z: [] }); } else l[gi].t = t;
    if (await tun({ art: 'karte', key, gruppen: l }, { titel: neu ? 'Gruppe angelegt' : 'Gruppe umbenannt', text: `${t} · ${k.titel}`, id: 'k:' + key, zurueck: { art: 'karte', key, gruppen: alt } })) { fensterZu(); if (W) neuLaden({}); else neuZeichnen(); }
  });
  $('#gr-t').focus();
}

// ---------------------------------------------------------------- Listen (Zimmer, Termine, Packages, Team, Stellen, Auszeichnungen …)
const feldWert = (x, f) => f[2] === 'liste' ? (x[f[0]] || []).join(', ') : f[2] === 'bilder' ? mal((x[f[0]] || []).length, 'Foto', 'Fotos') : f[2] === 'logo' ? ((Z.logos[x[f[0]]] || {}).name || x[f[0]] || '') : f[2] === 'id' ? '' : String(x[f[0]] ?? '');
const listeName = (x, g) => { const f = g.felder.find(f => f[2] === 'text' && x[f[0]]) || g.felder.find(f => f[2] === 'logo' && x[f[0]]) || g.felder.find(f => f[2] === 'lang' && x[f[0]]); return f ? feldWert(x, f).slice(0, 80) : feldWert(x, g.felder.find(f => f[2] !== 'id') || g.felder[0]); };
function listeStatus(g) {
  const norm = l => JSON.stringify(l.map(x => Object.fromEntries(g.felder.filter(f => f[2] !== 'id').map(f => [f[0], ['liste', 'bilder'].includes(f[2]) ? (x[f[0]] || []) : (x[f[0]] ?? '')]))));
  const a = g.stand, b = g.liste, na = a.map(x => listeName(x, g)), nb = b.map(x => listeName(x, g)), gleich = a.length === b.length;
  return { status: b.map((x, i) => { const j = na.includes(nb[i]) ? na.indexOf(nb[i]) : (gleich && !nb.includes(na[i]) ? i : -1); return j < 0 ? 'neu' : (norm([a[j]]) !== norm([x]) ? 'anders' : ''); }), weg: a.filter((y, i) => !nb.includes(na[i]) && !(gleich && !na.includes(nb[i]))) };
}
function listeBlatt(key) {
  const g = Z.listen[key];
  if (!g) return '';
  const st = listeStatus(g), bildF = g.felder.find(f => f[2] === 'bild' || f[2] === 'logo' || f[2] === 'bilder'), zweit = g.felder.filter(f => !['bild', 'logo', 'bilder', 'liste', 'id'].includes(f[2]) && f !== g.felder.find(f => f[2] === 'text')).slice(0, 3);
  const nurPunkte = g.felder.length === 1;
  /* Bilder in jeder Liste (Robert 19.10.2026): ohne eigenes Foto das Bild aus /assets/js/listenbilder.js */
  const lbild = (x, i) => window.listenBild ? window.listenBild(key, i, listeName(x, g)) : '';
  const zeile = (x, i) => `<div class="gz${bildF || lbild(x, i) ? '' : ' gz--ohne'} gz--ohnepreis${BLITZ === key + ':' + i ? ' blitz' : ''}" data-i="${i}">
      ${bildF ? `<button class="gz__b${bildF[2] === 'logo' ? ' gz__b--logo' : ''}" type="button" data-akt="edit" tabindex="-1" aria-hidden="true">${bildF[2] === 'logo' && x[bildF[0]] ? `<img src="${logoadr(x[bildF[0]])}" alt="" loading="lazy">` : bildF[2] === 'bilder' && (x[bildF[0]] || [])[0] ? `<img src="${bildadr(x[bildF[0]][0])}" alt="" loading="lazy">` : bildF[2] === 'bild' && x[bildF[0]] ? `<img src="${bildadr(x[bildF[0]])}" alt="" loading="lazy">` : lbild(x, i) ? `<img src="${lbild(x, i)}" alt="" loading="lazy" decoding="async">` : SYM.bild}</button>` : lbild(x, i) ? `<button class="gz__b" type="button" data-akt="edit" tabindex="-1" aria-hidden="true"><img src="${lbild(x, i)}" alt="" loading="lazy" decoding="async"></button>` : ''}
      <button class="gz__t" type="button" data-akt="edit" title="Bearbeiten"><b>${h(listeName(x, g)) || '<i>ohne Namen</i>'}</b>${zweit.map(f => feldWert(x, f)).filter(Boolean).length ? `<span>${h(zweit.map(f => feldWert(x, f)).filter(Boolean).join(' · '))}</span>` : ''}</button>
      <span class="gz__s">${st.status[i] === 'neu' ? '<i class="marke rot">Neu im Entwurf</i>' : st.status[i] === 'anders' ? '<i class="marke rot">Geändert</i>' : ''}</span>
      <div class="gz__r"><button class="rund" type="button" data-akt="hoch" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten"${i === g.liste.length - 1 ? ' disabled' : ''}>${SYM.runter}</button>
        <button class="rund" type="button" data-akt="weg" title="Entfernen" aria-label="Entfernen">${SYM.korb}</button><button class="kn kn--klein kn--linie" type="button" data-akt="edit">Bearbeiten</button></div></div>`;
  return `<section class="blatt gruppe" data-l="${h(key)}"><div class="gruppe__k"><h3>${h(g.label)}<span>${String(g.liste.length).padStart(2, '0')}</span></h3>${g.eigen ? '<i class="marke rot">Im Entwurf geändert</i>' : ''}<button class="kn kn--klein" type="button" data-akt="neu">${h(g.wort || 'Eintrag')} hinzufügen</button></div>
    ${g.hinweis ? `<p class="gruppe__hin">${h(g.hinweis)}</p>` : ''}
    <div class="zeilen">${g.liste.map(zeile).join('')}${st.weg.map(y => `<div class="gz gz--ohne gz--ohnepreis weg"><span class="gz__t"><b>${h(listeName(y, g))}</b></span><span class="gz__s"><i class="marke grau">Entfernt, noch nicht veröffentlicht</i></span><div class="gz__r"><button class="kn kn--klein kn--linie" type="button" data-akt="hol" data-n="${h(listeName(y, g))}">Zurückholen</button></div></div>`).join('')}
      ${g.liste.length || st.weg.length ? '' : '<p class="gz leer">Noch nichts in dieser Liste.</p>'}</div>
    ${g.eigen ? '<div class="gruppe__f"><button class="link" type="button" data-akt="std">Alle Änderungen in dieser Liste zurücknehmen</button></div>' : ''}</section>`;
}
function listenKlick(ev) {
  const b = ev.target.closest('[data-akt]'), sec = b && b.closest('[data-l]');
  if (!sec) return false;
  const key = sec.dataset.l, g = Z.listen[key], z = b.closest('.gz'), i = z && z.dataset.i !== undefined ? +z.dataset.i : -1, akt = b.dataset.akt;
  const alt = kopie(g.liste), l = kopie(g.liste);
  const sende = async (liste, titel, text) => { if (await tun({ art: 'liste', key, liste }, { titel, text, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } })) neuZeichnen(); };
  if (akt === 'neu') listeFenster(key);
  else if (akt === 'edit') listeFenster(key, i);
  else if (akt === 'std') frage('Änderungen <em>zurücknehmen?</em>', `„${g.label}“ steht danach wieder so da wie auf der Website.`, 'Zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'l:' + key }); sag('Zurückgenommen: ' + g.label); neuZeichnen(); });
  else if (akt === 'hol') { const y = g.stand.find(x => listeName(x, g) === b.dataset.n), pos = platzNach(g.stand, y, l, x => listeName(x, g), x => listeName(x, g)); l.splice(pos, 0, { ...y }); BLITZ = key + ':' + pos; sende(l, 'Wieder da', listeName(y, g)); }
  else if (akt === 'hoch' && i > 0) { [l[i - 1], l[i]] = [l[i], l[i - 1]]; BLITZ = key + ':' + (i - 1); sende(l, 'Reihenfolge gespeichert', listeName(l[i - 1], g)); }
  else if (akt === 'runter' && i < l.length - 1) { [l[i + 1], l[i]] = [l[i], l[i + 1]]; BLITZ = key + ':' + (i + 1); sende(l, 'Reihenfolge gespeichert', listeName(l[i + 1], g)); }
  else if (akt === 'weg') frage('Eintrag <em>entfernen?</em>', `„${listeName(alt[i], g)}“ verschwindet aus „${g.label}“. Bis zum Veröffentlichen können Sie es zurückholen.`, 'Entfernen', async () => { l.splice(i, 1); await sende(l, 'Entfernt', listeName(alt[i], g)); });
  else return false;
  return true;
}
function feldH(f, wert, id) {
  const [k, label, art] = f;
  if (art === 'id') return '';
  if (art === 'lang') return `<label class="feld"><span>${h(label)}</span><textarea id="${id}" rows="4">${h(wert ?? '')}</textarea><small>Eine Leerzeile beginnt einen neuen Absatz.</small></label>`;
  if (art === 'liste') return `<label class="feld"><span>${h(label)}</span><textarea id="${id}" rows="4" placeholder="Ein Punkt je Zeile">${h((wert || []).join('\n'))}</textarea><small>Ein Punkt je Zeile.</small></label>`;
  if (art === 'zahl') return `<label class="feld"><span>${h(label)}</span><input id="${id}" inputmode="decimal" value="${h(String(wert ?? '').replace('.', ','))}"></label>`;
  if (art === 'link') return `<label class="feld"><span>${h(label)}</span><input id="${id}" inputmode="url" value="${h(wert ?? '')}" placeholder="https://…"></label>`;
  if (art === 'bild') return `<div class="feld" data-bildfeld="${k}"><span>${h(label)}</span><div class="fotowahl">${wert ? `<img src="${bildadr(wert)}" alt="">` : `<div class="fotowahl__leer">${ik('tannen')}</div>`}<div><button class="kn kn--klein kn--linie" type="button" data-akt="foto">${wert ? 'Anderes Foto' : 'Foto wählen'}</button>${wert ? '<button class="link" type="button" data-akt="ohnefoto">Ohne Foto</button>' : ''}</div></div></div>`;
  if (art === 'bilder') return `<div class="feld" data-bilderfeld="${k}"><span>${h(label)}</span><div class="fotos">${(wert || []).map((b, i) => `<div class="foto"><img src="${bildadr(b)}" alt="">${i === 0 ? '<i>Erstes</i>' : `<button class="foto__v" type="button" data-akt="fvor" data-i="${i}">Nach vorn</button>`}<button class="foto__x" type="button" data-akt="fweg" data-i="${i}" aria-label="Foto entfernen">${SYM.zu}</button></div>`).join('')}
      ${(wert || []).length < 12 ? `<button class="foto foto--neu" type="button" data-akt="fneu"><b>+</b><span>Foto hinzufügen</span></button>` : ''}</div><small>Das erste Foto steht gross, die weiteren daneben und in der Fotoschau.</small></div>`;
  if (art === 'logo') return `<div class="feld" data-logofeld="${k}"><span>${h(label)}</span><div class="fotowahl">${wert ? `<span class="logovor"><img src="${logoadr(wert)}" alt=""></span>` : `<div class="fotowahl__leer">${ik('stern')}</div>`}<div><button class="kn kn--klein kn--linie" type="button" data-akt="logo">${wert ? 'Anderes Zeichen hochladen' : 'Zeichen hochladen'}</button><button class="link" type="button" data-akt="logowahl">Vorhandenes Zeichen wählen</button></div></div></div>`;
  return `<label class="feld"><span>${h(label)}</span><input id="${id}" maxlength="400" value="${h(wert ?? '')}"></label>`;
}
function listeFenster(key, i) {
  const g = Z.listen[key], neu = i === undefined, st = neu ? {} : kopie(g.liste[i]);
  const wort = g.wort || 'Eintrag';
  fenster(`<h2>${neu ? `${h(wort)} <em>hinzufügen.</em>` : `${h(wort)} <em>bearbeiten.</em>`}</h2><p class="form2__ort">${h(g.label)}</p>
    <div class="form1">${g.felder.map((f, n) => feldH(f, st[f[0]], 'lf-' + n)).join('')}</div>
    <div class="fehler" id="lf-f" role="alert"></div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="lf-ok">${neu ? 'Hinzufügen' : 'Speichern'}</button></div>`, true);
  const f = $('#fenster');
  const lies = () => { g.felder.forEach((fd, n) => { const el = $('#lf-' + n); if (!el) return; st[fd[0]] = fd[2] === 'liste' ? el.value.split('\n').map(x => x.trim()).filter(Boolean) : el.value; }); };
  const neuMal = () => { lies(); for (const art of ['bild', 'bilder', 'logo']) { const bf = g.felder.find(x => x[2] === art); if (bf) { const el = $(`[data-${art}feld="${bf[0]}"]`, f); if (el) el.outerHTML = feldH(bf, st[bf[0]], ''); } } };
  f.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const bf = g.felder.find(x => x[2] === 'bild'), bbf = g.felder.find(x => x[2] === 'bilder'), lf = g.felder.find(x => x[2] === 'logo'), akt = b.dataset.akt, n = +b.dataset.i;
    lies();
    if (akt === 'foto' && bf) bildWahl(k => { st[bf[0]] = k; neuMal(); });
    if (akt === 'ohnefoto' && bf) { st[bf[0]] = ''; neuMal(); }
    if (akt === 'fneu' && bbf) bildWahl(k => { st[bbf[0]] = (st[bbf[0]] || []).concat([k]); neuMal(); });
    if (akt === 'fweg' && bbf) { st[bbf[0]].splice(n, 1); neuMal(); }
    if (akt === 'fvor' && bbf) { st[bbf[0]].unshift(st[bbf[0]].splice(n, 1)[0]); neuMal(); }
    if (akt === 'logo' && lf) { const d = await waehleDatei(); if (!d) return; const r = await ladeLogo(d, st.name || ''); if (r) { st[lf[0]] = r.key; neuMal(); const nf = g.felder.findIndex(x => x[0] === 'name'); if (nf >= 0 && $('#lf-' + nf) && !$('#lf-' + nf).value) $('#lf-' + nf).value = r.name; } }
    if (akt === 'logowahl' && lf) logoWahl(k => { st[lf[0]] = k; neuMal(); const nf = g.felder.findIndex(x => x[0] === 'name'); if (nf >= 0 && $('#lf-' + nf) && !$('#lf-' + nf).value && Z.logos[k]) $('#lf-' + nf).value = Z.logos[k].name; });
  };
  $('#lf-ok').addEventListener('click', async ev => {
    lies();
    const fe = $('#lf-f');
    fe.textContent = '';
    if (!listeName(st, g)) { fe.textContent = 'Bitte mindestens das erste Feld ausfüllen.'; return; }
    const bbf = g.felder.find(x => x[2] === 'bilder');
    if (bbf && !(st[bbf[0]] || []).length) { fe.textContent = 'Bitte mindestens ein Foto wählen.'; return; }
    const alt = kopie(g.liste), liste = kopie(g.liste);
    if (neu) liste.push(st); else liste[i] = st;
    ev.target.disabled = true;
    const ok = await tun({ art: 'liste', key, liste }, { titel: neu ? `${wort} hinzugefügt` : `${wort} gespeichert`, text: `${listeName(st, g)} · ${g.label}`, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } });
    ev.target.disabled = false;
    if (!ok) return;
    fensterZu();
    BLITZ = key + ':' + (neu ? liste.length - 1 : i);
    const zielH = bereichVon(key);
    if (W) neuLaden({}); else if (location.hash !== zielH) location.hash = zielH; else neuZeichnen();
  });
  const erstes = $('#lf-0') || $('#lf-1');
  if (erstes) erstes.focus();
}
async function ladeLogo(datei, name) {
  if (!/^image\/(jpeg|png|webp)$/.test(datei.type)) { sag('Bitte ein PNG, JPG oder WebP wählen.', true); return null; }
  sag('Das Zeichen wird vorbereitet …');
  try {
    const r = await api('hochladen?art=logo&name=' + encodeURIComponent(name || datei.name.replace(/\.[^.]+$/, '')), datei, true);
    Z.logos[r.key] = { name: r.name, w: r.w, h: r.h, neu: true };
    return r;
  } catch (e) { sag(e.message, true); return null; }
}
function logoWahl(dann) {
  const k = $('#fenster .fenster__k'), rest = [...k.children].filter(c => !c.matches('.zu'));
  const w = document.createElement('div');
  w.innerHTML = `<h2>Zeichen <em>wählen.</em></h2><div class="logowand">${Object.entries(Z.logos).map(([key, l]) => `<button type="button" data-k="${h(key)}" title="${h(l.name)}"><img src="${logoadr(key)}" alt=""><small>${h(l.name)}</small></button>`).join('')}</div>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" id="lw-zu">Zurück</button></div>`;
  const war = rest.map(c => c.hidden);
  rest.forEach(c => { c.hidden = true; });
  k.appendChild(w);
  k.scrollTop = 0;
  const zurueck = () => { w.remove(); rest.forEach((c, i) => { c.hidden = war[i]; }); };
  $('#lw-zu', w).addEventListener('click', zurueck);
  $$('.logowand button', w).forEach(b => b.addEventListener('click', () => { zurueck(); dann(b.dataset.k); }));
}

// ---------------------------------------------------------------- Bereiche aus Karten, Listen und PDFs (Küche, Spa, Feste, Angebote, Team, Auszeichnungen)
function pdfBlatt(pfade) {
  if (!pfade || !pfade.length) return '';
  return `<h2 class="zw">Unterlagen als PDF</h2><section class="blatt" data-pdfs><p class="gruppe__hin" style="padding:0 0 10px">Hinter den Verweisen „… als PDF“ auf den Seiten. Laden Sie die neue Datei hoch, der Verweis zeigt danach auf sie.</p>
    ${pfade.map(p => { const f = Z.felder[p]; return f ? `<div class="pdfzeile"><div><b>${h(f.label)}${f.wert !== f.stand ? ' <i class="marke rot">Im Entwurf geändert</i>' : ''}</b><small>${h(f.wert)}</small></div><div style="display:flex;gap:8px;align-items:center"><a class="link" href="/entwurf/${h(f.wert)}" target="_blank" rel="noopener">Ansehen</a><button class="kn kn--klein kn--linie" type="button" data-pdf="${p}">Neue PDF hochladen</button></div></div>` : ''; }).join('')}</section>`;
}
function bereich(name) {
  const b = BEREICHE[name];
  sicht.innerHTML = `<div class="in">${kopf(b.titel, b.text, `<a class="kn kn--linie" href="/entwurf/${b.seite}" target="_blank" rel="noopener">Seite im Entwurf ansehen</a>`)}
    ${(b.karten || []).map(karteBlatt).join('')}${(b.listen || []).map(listeBlatt).join('')}
    ${(b.karten2 || []).map(karteBlatt).join('')}${(b.listen2 || []).map(listeBlatt).join('')}${(b.karten3 || []).map(karteBlatt).join('')}
    ${pdfBlatt(b.pdfs)}</div>`;
  const blitz = $('.blitz', sicht);
  BLITZ = null;
  if (blitz) blitz.scrollIntoView({ block: 'center' });
  sicht.querySelector('.in').addEventListener('click', ev => { const pd = ev.target.closest('[data-pdf]'); if (pd) return pdfHoch(pd.dataset.pdf); if (karteKlick(ev)) return; listenKlick(ev); });
}

// ---------------------------------------------------------------- Zimmer
function zimmer() {
  const g = Z.listen.zimmer, st = listeStatus(g);
  const karte = (x, i) => `<article class="zk${BLITZ === 'zimmer:' + i ? ' blitz' : ''}" data-i="${i}"><div class="zk__b"><img src="${bildadr(x.titel || (x.bilder || [])[0])}" alt=""><span>${mal((x.bilder || []).length, 'Foto', 'Fotos')}</span></div>
    <div class="zk__t"><h3>${h(x.name)}${st.status[i] === 'neu' ? '<i class="marke rot">Neu im Entwurf</i>' : st.status[i] === 'anders' ? '<i class="marke rot">Geändert</i>' : ''}</h3>
      <p>${h(x.satz)}</p><div class="zk__w"><span>${h(x.pers)}</span><span>${h(x.groesse)}</span><b>${h(x.preis)}</b></div>
      <div class="zk__r"><div class="gz__r"><button class="rund" type="button" data-akt="hoch" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten"${i === g.liste.length - 1 ? ' disabled' : ''}>${SYM.runter}</button><button class="rund" type="button" data-akt="weg" title="Zimmer von der Seite nehmen" aria-label="Entfernen">${SYM.korb}</button></div><button class="kn kn--klein" type="button" data-akt="edit">Bearbeiten</button></div></div></article>`;
  sicht.innerHTML = `<div class="in">${kopf('Zim<em>mer.</em>', 'Jede Kategorie mit Satz, Belegung, Grösse, Preis ab und ihren Fotos. Das Titelfoto steht auf der Startseite, die Fotos auf der Zimmer-Seite. Die Buchung läuft weiter über SimpleBooking.', `<a class="kn kn--linie" href="/entwurf/zimmer.html" target="_blank" rel="noopener">Zimmer im Entwurf ansehen</a><button class="kn" type="button" data-akt="neu">Zimmer hinzufügen</button>`)}
    <div data-l="zimmer">${g.liste.map(karte).join('')}
    ${st.weg.map(y => `<div class="gz gz--ohne gz--ohnepreis weg" style="margin-top:12px;border-radius:16px;background:var(--blatt)"><span class="gz__t"><b>${h(y.name)}</b></span><span class="gz__s"><i class="marke grau">Entfernt, noch nicht veröffentlicht</i></span><div class="gz__r"><button class="kn kn--klein kn--linie" type="button" data-akt="hol" data-n="${h(y.name)}">Zurückholen</button></div></div>`).join('')}
    <button class="zk zk--neu" type="button" data-akt="neu"><b>+ Zimmer hinzufügen</b><span>Name, Satz, Belegung, Grösse, Preis, Fotos</span></button>
    ${g.eigen ? '<div class="gruppe__f" style="border:0;padding-left:0"><button class="link" type="button" data-akt="std">Alle Änderungen an den Zimmern zurücknehmen</button></div>' : ''}</div>
    <p class="hinweis" style="margin-top:22px;max-width:760px">Der Grundriss auf der Startseite (Flächen im Verhältnis 20, 30, 50 und 70 m²) gilt für die vier Kategorien des Hauses. Kommt ein Zimmer dazu oder fällt eines weg, stehen die Kategorien dort als gleich grosse Kacheln.</p></div>`;
  const blitz = $('.blitz', sicht);
  BLITZ = null;
  if (blitz) blitz.scrollIntoView({ block: 'center' });
  sicht.querySelector('.in').addEventListener('click', ev => { if (ev.target.closest('[data-akt]')) listenKlickZ(ev); });
}
function listenKlickZ(ev) {
  /* die Zimmer-Karten sind keine .gz-Zeilen: Index aus der Karte lesen, dann wie bei Listen */
  const b = ev.target.closest('[data-akt]'), z = b.closest('.zk'), key = 'zimmer', g = Z.listen[key], i = z && z.dataset.i !== undefined ? +z.dataset.i : -1, akt = b.dataset.akt;
  const alt = kopie(g.liste), l = kopie(g.liste);
  const sende = async (liste, titel, text) => { if (await tun({ art: 'liste', key, liste }, { titel, text, id: 'l:' + key, zurueck: { art: 'liste', key, liste: alt } })) neuZeichnen(); };
  if (akt === 'neu') return listeFenster(key);
  if (akt === 'edit') return listeFenster(key, i);
  if (akt === 'std') return frage('Änderungen <em>zurücknehmen?</em>', 'Die Zimmer stehen danach wieder so da wie auf der Website.', 'Zurücknehmen', async () => { await aendern({ art: 'verwerfen', id: 'l:' + key }); sag('Zurückgenommen: Zimmer'); neuZeichnen(); });
  if (akt === 'hol') { const y = g.stand.find(x => x.name === b.dataset.n), pos = platzNach(g.stand, y, l, x => x.name, x => x.name); l.splice(pos, 0, { ...y }); BLITZ = key + ':' + pos; return sende(l, 'Wieder da', y.name); }
  if (akt === 'hoch' && i > 0) { [l[i - 1], l[i]] = [l[i], l[i - 1]]; BLITZ = key + ':' + (i - 1); return sende(l, 'Reihenfolge gespeichert', l[i - 1].name); }
  if (akt === 'runter' && i >= 0 && i < l.length - 1) { [l[i + 1], l[i]] = [l[i], l[i + 1]]; BLITZ = key + ':' + (i + 1); return sende(l, 'Reihenfolge gespeichert', l[i + 1].name); }
  if (akt === 'weg' && i >= 0) return frage('Zimmer <em>entfernen?</em>', `„${alt[i].name}“ verschwindet von der Zimmer-Seite und der Startseite. Bis zum Veröffentlichen können Sie es zurückholen.`, 'Entfernen', async () => { l.splice(i, 1); await sende(l, 'Entfernt', alt[i].name); });
}

// ---------------------------------------------------------------- Haus & Zeiten (Angaben)
function haus() {
  const feld = (p, f) => `<label class="feld" data-p="${p}"><span>${h(f.label)}${f.wert !== f.stand ? '<i class="marke rot">Im Entwurf geändert</i>' : ''}</span><input value="${h(f.wert)}"${f.art === 'link' ? ' inputmode="url"' : f.art === 'mail' ? ' inputmode="email"' : f.art === 'kontakt' ? ' inputmode="tel"' : ''}>
      <small>${f.stellen ? `steht an ${mal(f.stellen, 'Stelle', 'Stellen')} auf ${mal(f.seiten, 'Seite', 'Seiten')}` : (f.art === 'link' ? 'hinter den Knöpfen der Seite' : '')}${f.wert !== f.stand ? ` · <button class="link" type="button" data-sehen="f:${p}">vorher/nachher ansehen</button>` : ''}</small></label>`;
  const fuss = '<div class="sichern"><i></i><span></span><button class="link" type="button" data-akt="verwerfen">Verwerfen</button><button class="kn kn--klein" type="button" data-akt="sichern">Speichern</button></div>';
  const karte = (k, bild, arten) => { const fs = Object.entries(Z.felder).filter(([p, f]) => f.bereich === k && f.art !== 'pdf'); if (!fs.length) return ''; return `<section class="blatt haus" data-karte="${k}">${bild ? `<div class="haus__b"><img src="${bildadr(bild)}" alt=""><b>${h(Z.bereiche[k])}</b></div>` : `<div class="haus__t" style="padding-bottom:0"><h3>${h(Z.bereiche[k])}</h3></div>`}
      <div class="haus__t">${arten ? `<div class="sosteht"><span>So steht es auf der Seite</span><div></div></div>` : ''}${fs.map(([p, f]) => feld(p, f)).join('')}</div>${fuss}</section>`; };
  sicht.innerHTML = `<div class="in">${kopf('Haus <em>& Zeiten.</em>', 'Jede Angabe gibt es nur einmal. Tragen Sie sie ein und drücken Sie unten an der Karte auf „Speichern“. Danach stimmt sie auf jeder Seite: Startseite, Restaurants, Spa, Fuss der Seite, Tisch-Fenster.')}
    <h2 class="zw" style="margin-top:0">Öffnungszeiten</h2>
    <div class="raster r-2">${karte('rest', 'gruener-saal', true)}${karte('gourmet', 'salon', true)}${karte('bistro', 'kamin', true)}${karte('spa', 'becken', true)}</div>
    <h2 class="zw">Kontakt, Adresse, Links</h2>
    <div class="raster r-3">${karte('kontakt')}${karte('adresse')}${karte('link')}</div>
    ${pdfBlatt(Object.keys(Z.felder).filter(p => p.startsWith('pdf.')))}</div>`;
  const wurzel = sicht.querySelector('.in');
  const pruefe = karte => {
    const anders = $$('.feld', karte).filter(l => { const d = $('input', l).value.trim() !== Z.felder[l.dataset.p].wert; l.classList.toggle('offen', d); return d; });
    const s = $('.sichern', karte), imEntwurf = $$('.feld', karte).filter(l => Z.felder[l.dataset.p].wert !== Z.felder[l.dataset.p].stand).length;
    s.classList.toggle('offen', !!anders.length);
    s.classList.toggle('entwurf', !anders.length && !!imEntwurf);
    $$('button', s).forEach(b => { b.disabled = !anders.length; });
    $('span', s).textContent = anders.length ? mal(anders.length, 'Angabe', 'Angaben') + ' noch nicht gespeichert' : imEntwurf ? `Gespeichert, ${imEntwurf} im Entwurf` : 'Nichts geändert';
    const so = $('.sosteht div', karte);
    if (so) so.textContent = $$('.feld input', karte).map(i => i.value.trim()).filter(Boolean).join(' · ');
    return anders;
  };
  $$('.haus', wurzel).forEach(pruefe);
  offen = () => !!$('.feld.offen', sicht);
  wurzel.addEventListener('input', ev => { const k = ev.target.closest('.haus'); if (k) pruefe(k); });
  wurzel.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.matches('.feld input')) { ev.preventDefault(); const k = ev.target.closest('.haus'); if (pruefe(k).length) $('[data-akt="sichern"]', k).click(); } });
  wurzel.addEventListener('click', async ev => {
    const s = ev.target.closest('[data-sehen]'), pd = ev.target.closest('[data-pdf]'), b = ev.target.closest('[data-akt]'), karte = b && b.closest('.haus');
    if (s) { ev.preventDefault(); const c = Z.aenderungen.find(x => x.id === s.dataset.sehen); if (c) vergleich(c); return; }
    if (pd) { ev.preventDefault(); pdfHoch(pd.dataset.pdf); return; }
    if (!karte) return;
    if (b.dataset.akt === 'verwerfen') { $$('.feld', karte).forEach(l => { $('input', l).value = Z.felder[l.dataset.p].wert; }); pruefe(karte); return; }
    if (b.dataset.akt === 'sichern') {
      const anders = pruefe(karte), werte = {}, alte = {};
      anders.forEach(l => { werte[l.dataset.p] = $('input', l).value; alte[l.dataset.p] = Z.felder[l.dataset.p].wert; });
      const namen = anders.map(l => Z.felder[l.dataset.p].label), k = karte.dataset.karte, erste = Object.keys(werte)[0];
      b.disabled = true;
      const ok = await tun({ art: 'fakten', werte }, { titel: mal(anders.length, 'Angabe', 'Angaben') + ' gespeichert', text: `${Z.bereiche[k] || ''} · ${namen.slice(0, 3).join(', ')}${namen.length > 3 ? ' …' : ''}`, id: 'f:' + erste, zurueck: { art: 'fakten', werte: alte } });
      b.disabled = false;
      if (ok) { offen = null; neuZeichnen(); }
    }
  });
}
async function pdfHoch(pfad) {
  const d = await waehleDatei('application/pdf,.pdf');
  if (!d) return null;
  if (d.type !== 'application/pdf' && !/\.pdf$/i.test(d.name)) { sag('Bitte eine PDF wählen.', true); return null; }
  sag('Die PDF wird abgelegt …');
  try {
    const r = await api('hochladen?art=pdf&name=' + encodeURIComponent(d.name), d, true);
    if (await tun({ art: 'fakt', pfad, wert: r.pfad }, { titel: 'PDF ersetzt', text: `${Z.felder[pfad].label} · ${d.name} (${r.kb} kB)`, id: 'f:' + pfad, zurueck: { art: 'fakt', pfad, wert: Z.felder[pfad].wert } })) neuZeichnen();
  } catch (e) { sag(e.message, true); }
}

// ---------------------------------------------------------------- Bilder
function bilder(filter) {
  const wahl = [['', 'Alle']].concat(Z.seiten.filter(s => s.gruppe !== 'Rechtliches').map(s => [s.datei, s.name]));
  const liste = Z.bilder.filter(b => !filter || b.seiten.some(s => s.datei === filter));
  sicht.innerHTML = `<div class="in">${kopf('Bil<em>der.</em>', 'Jedes Foto der Website. Klicken Sie auf ein Bild, wählen Sie ein neues und bestätigen Sie. Es ändert sich dann überall, wo es zu sehen ist. Startbild, Fenster und Schlussbild werden beim Tausch automatisch abgedunkelt, damit die Schrift lesbar bleibt.')}
    <div class="filter">${wahl.map(([d, n]) => `<button type="button" data-f="${h(d)}" class="${(filter || '') === d ? 'an' : ''}">${h(n)}</button>`).join('')}</div>
    <div class="mauer">${liste.map(b => `<button class="bk" type="button" data-key="${h(b.key)}" title="${h(b.was || '')}"><img src="${bildadr(b.neu || b.key)}" alt="" loading="lazy">${b.neu ? '<i>Getauscht</i>' : ''}<span>${b.sonder || mal(b.seiten.length, 'Seite', 'Seiten')}</span><em>Tauschen</em></button>`).join('')}</div></div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const f = ev.target.closest('[data-f]'), k = ev.target.closest('[data-key]');
    if (f) location.hash = '#/bilder' + (f.dataset.f ? '/' + encodeURIComponent(f.dataset.f) : '');
    if (k) bildFenster(k.dataset.key);
  });
}
function bildFenster(key, neu) {
  const b = Z.bilder.find(x => x.key === key);
  if (!b) return;
  const jetzt = b.neu || b.key;
  fenster(`<h2>Bild <em>tauschen.</em></h2>
    ${neu ? `<div class="vn vn--bild"><div class="alt"><span>Bisher</span><img src="${bildadr(jetzt, 'm')}" alt=""></div><svg viewBox="0 0 22 22"><path d="M3 11h15M13 6l5 5-5 5"/></svg><div class="neu"><span>Neu</span><img src="${h(neu.adresse || bildadr(neu.key, 'm'))}" alt=""></div></div>
      <p>Das neue Bild ersetzt das bisherige auf ${b.seiten.length > 1 ? `<b>${b.seiten.length} Seiten</b>: ${b.seiten.slice(0, 6).map(s => h(s.name)).join(', ')}${b.seiten.length > 6 ? ' …' : ''}` : `der Seite <b>${h(b.seiten[0].name)}</b>`}.${neu.hinweis ? ' ' + h(neu.hinweis) : ''}</p>
      <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn kn--linie" type="button" id="f-anders">Anderes Bild</button><button class="kn" type="button" id="f-ok">Bild übernehmen</button></div>`
    : `<div class="bz"><div class="bz__b"><img src="${bildadr(jetzt, 'm')}" alt=""></div>
      <div><p style="margin:0"><b>Zu sehen auf</b></p><ul>${b.seiten.slice(0, 8).map(s => `<li>${h(s.name)}${s.zahl > 1 ? ` (${s.zahl} ×)` : ''}</li>`).join('')}${b.seiten.length > 8 ? `<li>und ${b.seiten.length - 8} weiteren Seiten</li>` : ''}</ul>
        ${b.sonder ? `<p class="hinweis" style="margin-top:14px">Dieses Foto ist das ${b.sonder}. Ein neues Bild wird in dieselben Masse gebracht und automatisch abgedunkelt, damit die Schrift darauf lesbar bleibt. Am besten ein Querformat mit mindestens 2400 Pixeln Breite.</p>` : ''}
        <div class="ablage" id="f-ablage" tabindex="0" role="button" style="margin-top:16px"><b>Neues Bild wählen</b><span>oder hierher ziehen · JPG, PNG, WebP</span></div>
        ${b.fest ? '' : '<p style="margin-top:14px;text-align:center"><button class="link" type="button" id="f-vorrat">Aus den Fotos der Seite wählen</button></p>'}
        ${b.neu ? '<p style="margin-top:14px;text-align:center"><button class="link" type="button" id="f-alt">Ursprüngliches Bild zurückholen</button></p>' : ''}</div></div>`}`, true);
  const sende = async (wert, titel) => {
    if (await tun({ art: 'bild', key, neu: wert }, { titel, text: mal(b.seiten.length, 'Seite', 'Seiten') + ' betroffen', id: 'b:' + key, zurueck: { art: 'bild', key, neu: b.neu || null } })) { fensterZu(); neuZeichnen(); }
  };
  if (neu) {
    $('#f-ok').addEventListener('click', () => sende(neu.key, 'Bild getauscht'));
    $('#f-anders').addEventListener('click', async () => { const r = await hochladen(key); if (r) bildFenster(key, r); });
  } else {
    ablage($('#f-ablage'), key, r => bildFenster(key, r));
    const alt = $('#f-alt'), vorrat = $('#f-vorrat');
    if (alt) alt.addEventListener('click', () => sende(null, 'Ursprüngliches Bild zurückgeholt'));
    if (vorrat) vorrat.addEventListener('click', () => bildWahl(k => { if (k !== key) bildFenster(key, { key: k, adresse: bildadr(k, 'm') }); }, key));
  }
}

// ---------------------------------------------------------------- Änderungen
function aenderungenS() {
  const cs = nachZeit(), n = cs.length;
  const pfeil = '<svg viewBox="0 0 22 22"><path d="M3 11h15M13 6l5 5-5 5"/></svg>';
  const kern = c => {
    if (c.art === 'bild') return `<div class="vn"><div class="alt"><span>Vorher</span><img src="${h(c.vorher)}" alt=""></div>${pfeil}<div class="neu"><span>Nachher</span><img src="${h(c.nachher)}" alt=""></div></div>`;
    if (c.art === 'karte' || c.art === 'liste') return `<ul class="punkte">${c.punkte.map(p => `<li class="${p.was}"><i>${{ neu: 'Neu', weg: 'Entfernt', anders: 'Geändert', reihe: 'Sortiert' }[p.was]}</i><div><b>${h(p.name)}</b> <span>${h(p.text)}</span></div></li>`).join('')}</ul>`;
    if (c.art === 'google') return c.teile.map(t => `<div class="vn"><div class="alt"><span>${h(t.feld)} vorher</span>${h(t.vorher) || '–'}</div>${pfeil}<div class="neu"><span>${h(t.feld)} nachher</span>${h(t.nachher)}</div></div>`).join('');
    return `<div class="vn"><div class="alt"><span>Vorher</span>${h(c.vorher) || '–'}</div>${pfeil}<div class="neu"><span>Nachher</span>${h(c.nachher) || '–'}</div></div>`;
  };
  const karteC = c => `<article class="aend" data-id="${h(c.id)}"><div class="aend__z">${ik(ARTZ[c.art])}</div>
    <div><h3>${h(c.titel)}<small>${h(c.ort || '')}${c.zeit ? ' · gespeichert ' + vor(c.zeit) : ''}</small></h3>${kern(c)}
      ${c.verwaist ? '<p class="hinweis" style="margin-top:14px">Diese Stelle gibt es auf der Seite nicht mehr. Die Änderung hat deshalb keine Wirkung.</p>' : ''}
      ${c.seiten.length ? `<div class="wo"><span>${c.anzahl > 1 ? mal(c.anzahl, 'Stelle', 'Stellen') + ' auf' : 'Steht auf'}</span>${c.seiten.slice(0, 9).map(s => `<button type="button" data-akt="sehen" data-seite="${h(s.datei)}">${h(s.name)}${s.zahl > 1 ? `<b>${s.zahl}</b>` : ''}</button>`).join('')}${c.seiten.length > 9 ? `<span>und ${c.seiten.length - 9} weiteren</span>` : ''}</div>` : ''}</div>
    <div class="aend__r">${c.stellen.length ? '<button class="kn kn--klein" type="button" data-akt="sehen">Vorher/Nachher ansehen</button>' : ''}<button class="link" type="button" data-akt="weg">Zurücknehmen</button></div></article>`;
  sicht.innerHTML = `<div class="in">${kopf('Ände<em>rungen.</em>', n ? 'Das ist im Entwurf gespeichert. Schauen Sie sich jede Stelle vorher und nachher an. Erst mit „Veröffentlichen“ sehen es Ihre Gäste.' : '',
      n ? `<button class="kn kn--linie" type="button" data-akt="alles">Alles zurücknehmen</button><button class="kn" type="button" data-akt="raus">${mal(n, 'Änderung', 'Änderungen')} veröffentlichen</button>` : '')}
    ${n ? cs.map(karteC).join('') : `<div class="leerbild">${ik('tannen')}<b>Nichts offen.</b><p>Alles, was Sie geändert haben, steht auf der Website.</p><a class="kn" href="#/uebersicht">Zur Übersicht</a></div>`}</div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b || !['sehen', 'weg'].includes(b.dataset.akt)) return;
    ev.stopPropagation();
    aktAenderung(b.dataset.akt, b.closest('.aend').dataset.id, b.dataset.seite);
  });
}
function veroeffentlichen() {
  const cs = nachZeit(), n = cs.length;
  if (!n) return;
  fenster(`<h2>Auf die Website <em>stellen?</em></h2><p>${mal(n, 'Änderung wird', 'Änderungen werden')} sofort für alle sichtbar. Jeden früheren Stand können Sie im Verlauf zurückholen.</p>
    <ul class="quittliste">${cs.map(c => `<li>${ik(ARTZ[c.art])}<span>${h(c.satz)}</span></li>`).join('')}</ul>
    <label class="feld" style="margin-top:18px"><span>Notiz für den Verlauf (freiwillig)</span><input id="f-notiz" maxlength="200" placeholder="z. B. Herbstkarte"></label>
    <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ok">Jetzt veröffentlichen</button></div>`);
  $('#f-ok').addEventListener('click', async ev => {
    ev.target.disabled = true;
    ev.target.textContent = 'Wird veröffentlicht …';
    try {
      Z = await api('veroeffentlichen', { notiz: $('#f-notiz').value }); melden();
      rand();
      leiste();
      fenster(`<div class="erfolg"><i>${HAKEN}</i><h2>Veröffent<em>licht.</em></h2><p>Die Website zeigt jetzt den neuen Stand. Das ist live:</p></div>
        <ul class="quittliste ok">${cs.map(c => `<li><i>${HAKEN}</i><span>${h(c.satz)}</span></li>`).join('')}</ul>
        <div class="fenster__kn"><a class="kn kn--linie" href="/live/index.html" target="_blank" rel="noopener">Website ansehen</a><button class="kn" type="button" data-zu>Fertig</button></div>`);
      if (W) neuLaden({}); else zeige(true);
    } catch (e) { sag(e.message, true); ev.target.disabled = false; ev.target.textContent = 'Jetzt veröffentlichen'; }
  });
}

// ---------------------------------------------------------------- Hinweis für Gäste
function hinweisS() {
  const hw = Z.hinweis, aktiv = hw.an && hw.text;
  sicht.innerHTML = `<div class="in">${kopf('Hinweis für <em>Gäste.</em>', 'Ein Band unten am Bildschirm, auf jeder Seite: Betriebsferien, Feiertage, geschlossene Gesellschaft. Sie können es zeitlich begrenzen, dann verschwindet es von selbst.')}
    <section class="blatt" style="max-width:760px"><div class="form1" style="margin-top:0">
      ${schalter('hw-an', hw.an, 'Hinweis zeigen')}
      <label class="feld"><span>Text</span><textarea id="hw-text" rows="2" maxlength="300" placeholder="z. B. Betriebsferien vom 10. bis 24. November. Ab dem 25. sind wir wieder für Sie da.">${h(hw.text)}</textarea></label>
      <div class="raster r-2"><label class="feld"><span>Zeigen ab (freiwillig)</span><input id="hw-von" type="date" value="${h(hw.von)}"></label><label class="feld"><span>Zeigen bis (freiwillig)</span><input id="hw-bis" type="date" value="${h(hw.bis)}"></label></div>
      <div class="raster r-2"><label class="feld"><span>Link (freiwillig)</span><select id="hw-link"><option value="">Kein Link</option>${Z.seiten.map(s => `<option value="${h(s.datei)}"${hw.link === s.datei ? ' selected' : ''}>${h(s.name)}</option>`).join('')}</select></label><label class="feld"><span>Beschriftung des Links</span><input id="hw-lt" maxlength="60" value="${h(hw.linktext)}" placeholder="Mehr"></label></div>
      <div class="feld"><span>So sieht es aus</span><div class="hwvor${aktiv ? '' : ' aus'}" id="hw-vor"></div></div>
      <div class="sichern sichern--still offen"><i></i><span id="hw-stand"></span><button class="kn kn--klein" type="button" id="hw-ok">Speichern</button></div>
    </div></section></div>`;
  const vor = () => { const t = $('#hw-text').value.trim(), lt = $('#hw-lt').value.trim() || 'Mehr', an = $('#hw-an').checked; $('#hw-vor').className = 'hwvor' + (an && t ? '' : ' aus'); $('#hw-vor').innerHTML = `${ik('glocke')}<p>${h(t || 'Ihr Hinweis …')}${$('#hw-link').value ? ` <a>${h(lt)}</a>` : ''}</p>`; $('#hw-stand').textContent = an && t ? 'Wird unten auf jeder Seite gezeigt' : 'Ausgeschaltet, nichts zu sehen'; };
  vor();
  sicht.querySelector('.in').addEventListener('input', vor);
  $('#hw-ok').addEventListener('click', async () => {
    const neu = { an: $('#hw-an').checked, text: $('#hw-text').value, von: $('#hw-von').value, bis: $('#hw-bis').value, link: $('#hw-link').value, linktext: $('#hw-lt').value };
    if (await tun({ art: 'hinweis', hinweis: neu }, { titel: neu.an && neu.text.trim() ? 'Hinweis gespeichert' : 'Hinweis ausgeschaltet', text: neu.text.trim().slice(0, 80), id: 'h:hinweis', zurueck: { art: 'hinweis', hinweis: hw } })) neuZeichnen();
  });
}

// ---------------------------------------------------------------- Menü & eigene Seiten
function menueS() {
  const nav = Z.nav, bekannt = Z.seiten.map(s => [s.datei, s.name]).concat(Object.entries(Z.eigene_seiten).map(([k, p]) => [k + '.html', p.titel]));
  const name = hf => (bekannt.find(([d]) => d === hf) || [hf, hf])[1];
  sicht.innerHTML = `<div class="in">${kopf('Menü <em>& Seiten.</em>', 'Das Hauptmenü oben auf jeder Seite und Ihre eigenen Seiten. Eine neue Seite bekommt Foto, Einleitung und Abschnitte und kann ins Menü.', `<button class="kn" type="button" data-akt="seite-neu">Neue Seite</button>`)}
    <h2 class="zw" style="margin-top:0">Hauptmenü</h2>
    <section class="blatt gruppe" data-nav><div class="gruppe__k"><h3>Menüpunkte<span>${String(nav.filter(x => !x.aus).length).padStart(2, '0')}</span></h3><button class="kn kn--klein" type="button" data-akt="nav-neu">Menüpunkt hinzufügen</button></div>
      <div class="zeilen">${nav.map((x, i) => `<div class="gz gz--nav${window.seitenBild && window.seitenBild(x.h) ? '' : ' gz--ohne'} gz--ohnepreis${x.aus ? ' aus' : ''}" data-i="${i}">${window.seitenBild && window.seitenBild(x.h) ? `<span class="gz__b" aria-hidden="true"><img src="${window.seitenBild(x.h)}" alt="" loading="lazy" decoding="async"></span>` : ''}<span class="gz__t"><input class="n" value="${h(x.t)}" maxlength="40" aria-label="Beschriftung"><span>${h(name(x.h))}</span></span><span class="gz__s"></span>
        <div class="gz__r"><button class="rund" type="button" data-akt="hoch" aria-label="Nach oben"${i === 0 ? ' disabled' : ''}>${SYM.hoch}</button><button class="rund" type="button" data-akt="runter" aria-label="Nach unten"${i === nav.length - 1 ? ' disabled' : ''}>${SYM.runter}</button><button class="rund" type="button" data-akt="aus" aria-label="${x.aus ? 'Zeigen' : 'Ausblenden'}" title="${x.aus ? 'Im Menü zeigen' : 'Aus dem Menü nehmen'}">${x.aus ? SYM.augezu : SYM.auge}</button></div></div>`).join('')}</div>
      <div class="gruppe__f"><span class="leise" style="font-size:13.5px">Die Beschriftung ändern Sie direkt in der Zeile. Höchstens neun Punkte passen in die Leiste.</span><div class="sichern sichern--still offen" style="margin:0 0 0 auto"><i></i><span>Menü</span><button class="kn kn--klein" type="button" data-akt="nav-ok">Speichern</button></div></div></section>
    <h2 class="zw">Eigene Seiten<span>${String(Object.keys(Z.eigene_seiten).length).padStart(2, '0')}</span></h2>
    <div class="raster r-4">${Object.entries(Z.eigene_seiten).map(([slug, p]) => `<button class="sk" type="button" data-akt="seite" data-slug="${h(slug)}"><span class="sk__b">${p.bild ? `<img src="${bildadr(p.bild)}" alt="">` : ''}</span><span class="sk__t"><b>${h(p.titel)}</b><span>${slug}.html${Z.nav.some(x => x.h === slug + '.html' && !x.aus) ? ' · im Menü' : ''}</span></span></button>`).join('')}
      <button class="tuer" type="button" data-akt="seite-neu" style="min-height:200px">${ik('seite')}<b>Neue Seite</b><span>mit Foto, Text und Abschnitten</span><i>${PF}</i></button></div></div>`;
  const wurzel = sicht.querySelector('.in');
  const liesNav = () => $$('[data-nav] .gz').map(z => ({ t: $('.n', z).value.trim(), h: nav[+z.dataset.i].h, aus: z.classList.contains('aus') }));
  wurzel.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const akt = b.dataset.akt, z = b.closest('.gz');
    if (akt === 'seite-neu') return seiteFenster();
    if (akt === 'seite') return seiteFenster(b.dataset.slug);
    if (akt === 'nav-neu') {
      const frei = bekannt.filter(([d]) => !nav.some(x => x.h === d));
      fenster(`<h2>Menüpunkt <em>hinzufügen.</em></h2><label class="feld" style="margin-top:18px"><span>Seite</span><select id="nv-h">${frei.map(([d, n]) => `<option value="${h(d)}">${h(n)}</option>`).join('')}</select></label><label class="feld" style="margin-top:14px"><span>Beschriftung im Menü</span><input id="nv-t" maxlength="40"></label>
        <div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="nv-ok">Hinzufügen</button></div>`);
      $('#nv-h').addEventListener('change', () => { $('#nv-t').value = name($('#nv-h').value); });
      $('#nv-t').value = frei.length ? name(frei[0][0]) : '';
      $('#nv-ok').addEventListener('click', async () => { const l = liesNav().concat([{ t: $('#nv-t').value.trim() || name($('#nv-h').value), h: $('#nv-h').value, aus: false }]); if (await tun({ art: 'nav', liste: l }, { titel: 'Menüpunkt hinzugefügt', text: l[l.length - 1].t, zurueck: { art: 'nav', liste: nav } })) { fensterZu(); neuZeichnen(); } });
      return;
    }
    const l = liesNav(), i = z ? +z.dataset.i : -1;
    if (akt === 'hoch' && i > 0) [l[i - 1], l[i]] = [l[i], l[i - 1]];
    else if (akt === 'runter' && i >= 0 && i < l.length - 1) [l[i + 1], l[i]] = [l[i], l[i + 1]];
    else if (akt === 'aus' && i >= 0) l[i].aus = !l[i].aus;
    else if (akt !== 'nav-ok') return;
    if (await tun({ art: 'nav', liste: l }, { titel: 'Menü gespeichert', text: l.filter(x => !x.aus).map(x => x.t).join(' · '), zurueck: { art: 'nav', liste: nav } })) neuZeichnen();
  });
}
function seiteFenster(slug) {
  const neu = !slug, p0 = neu ? null : Z.eigene_seiten[slug];
  const st = neu ? { titel: '', kopfz: '', h1: '', intro: '', beschr: '', bild: null, im_menue: true, abschnitte: [{ u: '', t: '', b: null }] } : kopie(p0);
  if (!neu) st.im_menue = Z.nav.some(x => x.h === slug + '.html' && !x.aus);
  fenster(`<h2>${neu ? 'Neue <em>Seite.</em>' : 'Seite <em>bearbeiten.</em>'}</h2>${neu ? '' : `<p class="form2__ort">${h(slug)}.html</p>`}
    <div class="form1">
      <div class="raster r-2"><label class="feld"><span>Titel der Seite</span><input id="ps-titel" maxlength="80" value="${h(st.titel)}" placeholder="z. B. Winter in Kandersteg"></label><label class="feld"><span>Kleine Zeile über der Überschrift</span><input id="ps-kopfz" maxlength="60" value="${h(st.kopfz)}" placeholder="z. B. Saison"></label></div>
      <label class="feld"><span>Grosse Überschrift</span><input id="ps-h1" maxlength="120" value="${h(st.h1)}" placeholder="Leer = Titel der Seite"></label>
      <label class="feld"><span>Einleitung</span><textarea id="ps-intro" rows="3" maxlength="600">${h(st.intro)}</textarea></label>
      <div class="feld" id="ps-bild"></div>
      <div class="feld"><span>Abschnitte</span><div id="ps-abs"></div><button class="link" type="button" data-akt="abs-neu" style="justify-self:start;margin-top:8px">Abschnitt hinzufügen</button></div>
      ${schalter('ps-menue', st.im_menue, 'Im Hauptmenü zeigen')}
      <label class="feld"><span>Beschreibung bei Google (freiwillig)</span><input id="ps-beschr" maxlength="320" value="${h(st.beschr)}"></label>
    </div>
    <div class="fehler" id="ps-f" role="alert"></div>
    <div class="fenster__kn">${neu ? '' : '<button class="link" type="button" id="ps-weg" style="margin-right:auto">Seite löschen</button>'}<button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="ps-ok">${neu ? 'Seite anlegen' : 'Speichern'}</button></div>`, true);
  const f = $('#fenster');
  const lies = () => { st.titel = $('#ps-titel').value.trim(); st.kopfz = $('#ps-kopfz').value.trim(); st.h1 = $('#ps-h1').value.trim(); st.intro = $('#ps-intro').value; st.beschr = $('#ps-beschr').value.trim(); st.im_menue = $('#ps-menue').checked; $$('.abs', f).forEach((a, i) => { st.abschnitte[i].u = $('.abs-u', a).value.trim(); st.abschnitte[i].t = $('.abs-t', a).value; }); };
  const mal2 = () => {
    $('#ps-bild').innerHTML = `<span>Foto im Seitenkopf</span><div class="fotowahl">${st.bild ? `<img src="${bildadr(st.bild)}" alt="">` : `<div class="fotowahl__leer">${ik('tannen')}</div>`}<div><button class="kn kn--klein kn--linie" type="button" data-akt="foto">${st.bild ? 'Anderes Foto' : 'Foto wählen'}</button>${st.bild ? '<button class="link" type="button" data-akt="ohnefoto">Ohne Foto</button>' : '<small>Ohne Foto steht die Halle im Kopf.</small>'}</div></div>`;
    $('#ps-abs').innerHTML = st.abschnitte.map((a, i) => `<div class="abs" data-i="${i}"><div class="abs__k"><b>Abschnitt ${i + 1}</b><button class="link" type="button" data-akt="abs-weg" data-i="${i}">Entfernen</button></div><input class="abs-u" maxlength="120" value="${h(a.u)}" placeholder="Überschrift"><textarea class="abs-t" rows="4" placeholder="Text. Eine Leerzeile beginnt einen neuen Absatz.">${h(a.t)}</textarea>
      <div class="abs__b">${a.b ? `<img src="${bildadr(a.b)}" alt="">` : ''}<button class="link" type="button" data-akt="abs-foto" data-i="${i}">${a.b ? 'Anderes Foto' : 'Foto zum Abschnitt'}</button>${a.b ? `<button class="link" type="button" data-akt="abs-ohne" data-i="${i}">Ohne Foto</button>` : ''}</div></div>`).join('');
  };
  mal2();
  f.onclick = async ev => {
    const b = ev.target.closest('[data-akt]');
    if (!b) return;
    const akt = b.dataset.akt, i = +b.dataset.i;
    lies();
    if (akt === 'foto') return bildWahl(k => { st.bild = k; mal2(); });
    if (akt === 'ohnefoto') st.bild = null;
    else if (akt === 'abs-neu') st.abschnitte.push({ u: '', t: '', b: null });
    else if (akt === 'abs-weg') st.abschnitte.splice(i, 1);
    else if (akt === 'abs-foto') return bildWahl(k => { st.abschnitte[i].b = k; mal2(); });
    else if (akt === 'abs-ohne') st.abschnitte[i].b = null;
    else return;
    mal2();
  };
  const weg = $('#ps-weg');
  if (weg) weg.addEventListener('click', () => frage('Seite <em>löschen?</em>', `„${p0.titel}“ verschwindet von der Website und aus dem Menü.`, 'Löschen', async () => { if (await tun({ art: 'seite-weg', slug }, { titel: 'Seite gelöscht', text: p0.titel })) { fensterZu(); neuZeichnen(); } }));
  $('#ps-ok').addEventListener('click', async ev => {
    lies();
    if (!st.titel) { $('#ps-f').textContent = 'Bitte einen Titel eintragen.'; return; }
    ev.target.disabled = true;
    try {
      const davor = new Set(Object.keys(Z.eigene_seiten));
      await aendern({ art: 'seite', slug: slug || '', seite: st });
      const ns = slug || Object.keys(Z.eigene_seiten).find(k => !davor.has(k));
      if (ns) {
        const hf = ns + '.html', da = Z.nav.find(x => x.h === hf);
        if (st.im_menue && !da) await aendern({ art: 'nav', liste: Z.nav.concat([{ t: st.titel, h: hf, aus: false }]) }).catch(e => sag(e.message, true));
        else if (st.im_menue && da && da.aus) await aendern({ art: 'nav', liste: Z.nav.map(x => x.h === hf ? { ...x, aus: false } : x) }).catch(e => sag(e.message, true));
        else if (!st.im_menue && da && !da.aus) await aendern({ art: 'nav', liste: Z.nav.filter(x => x.h !== hf) }).catch(e => sag(e.message, true));
      }
      quittung(neu ? 'Seite angelegt' : 'Seite gespeichert', `${st.titel} · ${ns}.html`, { id: 'p:' + ns, zurueck: neu ? { art: 'seite-weg', slug: ns } : { art: 'seite', slug, seite: p0 } });
      fensterZu();
      if (location.hash.startsWith('#/menue')) neuZeichnen(); else location.hash = '#/menue';
    } catch (e) { $('#ps-f').textContent = e.message; }
    ev.target.disabled = false;
  });
  $('#ps-titel').focus();
}

// ---------------------------------------------------------------- Google-Texte und Bildbeschreibungen
function googleS(filter) {
  const seiten = Z.seiten;
  const datei = filter && Z.seo[filter] ? filter : 'index.html', so = Z.seo[datei], sd = Z.seiten.find(s => s.datei === datei);
  const alts = Object.entries(Z.alt).filter(([k]) => Z.bilder.some(b => b.key === k && b.seiten.some(x => x.datei === datei)));
  sicht.innerHTML = `<div class="in">${kopf('Google <em>& Co.</em>', 'Was Google und andere Suchmaschinen über jede Seite zeigen, und die Beschreibung jedes Bildes für Menschen, die nicht sehen können.')}
    <div class="filter">${seiten.map(s => `<button type="button" data-f="${h(s.datei)}" class="${s.datei === datei ? 'an' : ''}">${h(s.name)}</button>`).join('')}</div>
    <section class="blatt" style="max-width:820px"><h3>Bei Google: ${h(sd ? sd.name : datei)}</h3><div class="form1" style="margin-top:16px">
      <label class="feld"><span>Titel (so steht es im Browser-Reiter und bei Google)</span><input id="se-titel" maxlength="120" value="${h(so.eigen.titel || '')}" placeholder="${h(so.titel)}"><small><span id="se-tz">${(so.eigen.titel || so.titel).length}</span> Zeichen, bis 60 sind ideal</small></label>
      <label class="feld"><span>Beschreibung (die zwei Zeilen unter dem Titel)</span><textarea id="se-beschr" rows="3" maxlength="320" placeholder="${h(so.beschr)}">${h(so.eigen.beschr || '')}</textarea><small><span id="se-bz">${(so.eigen.beschr || so.beschr).length}</span> Zeichen, bis 155 sind ideal · leer lassen heisst: Vorgabe behalten</small></label>
      <div class="gvor"><b id="gv-t">${h(so.eigen.titel || so.titel)}</b><i>doldenhorn.ch › ${h(datei.replace('.html', ''))}</i><p id="gv-b">${h(so.eigen.beschr || so.beschr)}</p></div>
      <div class="sichern sichern--still offen"><i></i><span>Google-Text</span><button class="kn kn--klein" type="button" id="se-ok">Speichern</button></div></div></section>
    <h2 class="zw">Bildbeschreibungen<span>${String(alts.length).padStart(2, '0')}</span></h2>
    <section class="blatt" style="padding:4px 0">${alts.map(([k, a]) => `<div class="ware" data-alt="${h(k)}"><img src="${bildadr(k)}" alt=""><label class="feld"><span>Beschreibung${a.eigen ? ' <i class="marke rot">Im Entwurf geändert</i>' : ''}</span><input maxlength="200" value="${h(a.eigen || '')}" placeholder="${h(a.standard || 'Was ist auf dem Bild zu sehen?')}"></label><button class="kn kn--klein kn--linie" type="button" data-akt="alt-ok">Speichern</button></div>`).join('') || '<p class="gz leer">Auf dieser Seite gibt es keine Bilder.</p>'}</section></div>`;
  const wurzel = sicht.querySelector('.in');
  wurzel.addEventListener('input', () => { const t = $('#se-titel').value.trim() || so.titel, b = $('#se-beschr').value.trim() || so.beschr; $('#gv-t').textContent = t; $('#gv-b').textContent = b; $('#se-tz').textContent = t.length; $('#se-bz').textContent = b.length; });
  wurzel.addEventListener('click', async ev => {
    const f = ev.target.closest('[data-f]'), b = ev.target.closest('[data-akt]');
    if (f) { location.hash = '#/google/' + encodeURIComponent(f.dataset.f); return; }
    if (!b) return;
    if (b.dataset.akt === 'alt-ok') { const z = b.closest('[data-alt]'), k = z.dataset.alt, alt = Z.alt[k].eigen; if (await tun({ art: 'alt', key: k, text: $('input', z).value }, { titel: 'Bildbeschreibung gespeichert', text: $('input', z).value.trim().slice(0, 80) || 'Vorgabe', id: 'a:' + k, zurueck: { art: 'alt', key: k, text: alt } })) neuZeichnen(); }
  });
  $('#se-ok').addEventListener('click', async () => { if (await tun({ art: 'seo', datei, titel: $('#se-titel').value, beschr: $('#se-beschr').value }, { titel: 'Google-Text gespeichert', text: sd ? sd.name : datei, id: 'g:' + datei, zurueck: { art: 'seo', datei, titel: so.eigen.titel || '', beschr: so.eigen.beschr || '' } })) neuZeichnen(); });
}

// ---------------------------------------------------------------- Vergleich vorher / nachher
function vergleich(c, seiteDatei) {
  const stellen = c.stellen.length ? c.stellen : [];
  if (!stellen.length) return;
  V = { c, stellen, i: Math.max(0, seiteDatei ? stellen.findIndex(s => s.seite === seiteDatei) : 0), geraet: 'rechner', box: {}, seite: {} };
  const v = $('#vergleich');
  v.hidden = false;
  v.innerHTML = `<div class="vgl__k"><button class="rund" type="button" data-akt="zu" title="Schliessen" aria-label="Schliessen">${SYM.zu}</button>
      <h2>${h(c.titel)}<small>${h(c.ort || '')}</small></h2>
      <select id="v-seite" aria-label="Seite"${c.seiten.length < 2 ? ' hidden' : ''}>${c.seiten.map(s => `<option value="${h(s.datei)}">${h(s.name)}${s.zahl > 1 ? ` (${s.zahl} Stellen)` : ''}</option>`).join('')}</select>
      <div class="vgl__nav"><button class="rund" type="button" data-akt="vor" aria-label="Vorherige Stelle">${SYM.links}</button><span id="v-zahl"></span><button class="rund" type="button" data-akt="nach" aria-label="Nächste Stelle">${SYM.rechts}</button>
        <button class="rund an" type="button" data-g="rechner" aria-label="Wie am Rechner">${SYM.rechner}</button><button class="rund" type="button" data-g="handy" aria-label="Wie am Handy">${SYM.handy}</button></div></div>
    <div class="vgl__b" id="v-b">${['vorher', 'entwurf'].map(p => `<div class="vgl__s"><span>${p === 'vorher' ? 'Vorher <b>so steht es jetzt auf der Website</b>' : 'Nachher <b>so sieht es nach dem Veröffentlichen aus</b>'}</span>
      <div class="vgl__r"><iframe id="v-${p}" title="${p === 'vorher' ? 'Vorher' : 'Nachher'}"></iframe><div class="vgl__m" id="vm-${p}"></div><div class="vgl__leer" id="vl-${p}" hidden></div></div></div>`).join('')}</div>`;
  v.onclick = ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.akt === 'zu') return vglZu();
    if (b.dataset.akt === 'vor') V.i = (V.i - 1 + V.stellen.length) % V.stellen.length;
    else if (b.dataset.akt === 'nach') V.i = (V.i + 1) % V.stellen.length;
    else if (b.dataset.g) {
      V.geraet = b.dataset.g;
      $('#v-b').classList.toggle('handy', V.geraet === 'handy');
      $$('.vgl__r', v).forEach(r => r.classList.toggle('handy', V.geraet === 'handy'));
      $$('[data-g]', v).forEach(x => x.classList.toggle('an', x === b));
      V.passe.forEach(f => f());
      setTimeout(() => ['vorher', 'entwurf'].forEach(vglMarke), 350);
      return;
    }
    else return;
    vglLade();
  };
  $('#v-seite').addEventListener('change', ev => { V.i = Math.max(0, V.stellen.findIndex(s => s.seite === ev.target.value)); vglLade(); });
  V.passe = [];
  ['vorher', 'entwurf'].forEach(p => {
    const fr = $('#v-' + p);
    V.passe.push(passe(fr, fr.parentNode, 1280));
    fr.addEventListener('load', () => {
      const d = fr.contentDocument;
      if (!d || !d.body || !V) return;
      V.box[p] = richte(d, false).an;
      d.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('a[href]')) ev.preventDefault(); }, true);
      d.defaultView.addEventListener('wheel', () => requestAnimationFrame(() => { const a = $('#v-' + (p === 'vorher' ? 'entwurf' : 'vorher')); try { a.contentWindow.scrollTo(0, d.defaultView.scrollY); vglRahmen(); } catch (e) {} }), { passive: true });
      d.defaultView.addEventListener('scroll', vglRahmen, { passive: true });
      vglMarke(p);
    });
  });
  vglLade();
}
function vglZu() { V = null; const v = $('#vergleich'); v.hidden = true; v.innerHTML = ''; }
function vglFinde(d, st, p) {
  if (st.oben) return null;
  if (st.b) return d.querySelector(`img[data-b="${st.b}"][data-bn="${st.n}"]`);
  const genau = () => d.querySelector(`[data-e="${st.h}"][data-en="${st.n}"]`);
  if (!['karte', 'liste'].includes(V.c.art) || p === (st.vorher ? 'vorher' : 'entwurf')) return genau();
  return $$(`[data-e="${st.h}"]`, d).find(e => e.textContent.trim() === st.t) || null;
}
function vglRahmen() {
  if (!V) return;
  ['vorher', 'entwurf'].forEach(p => { const el = V.el && V.el[p]; if (el) rahme(V.box[p], el); });
}
function vglMarke(p) {
  if (!V) return;
  const fr = $('#v-' + p), d = fr.contentDocument, st = V.stellen[V.i], leer = $('#vl-' + p), m = $('#vm-' + p);
  if (!d || !d.body || V.seite[p] !== st.seite || d.readyState === 'loading') return;
  V.el = V.el || {};
  let el = vglFinde(d, st, p);
  leer.hidden = true;
  if (st.oben) { d.defaultView.scrollTo(0, 0); rahme(V.box[p], null); m.innerHTML = ''; V.el[p] = null; return; }
  if (el) {
    zeig(el);
    el = el.closest('.gang,.termin,.kal,.schau,.zk') || el;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    if (!rahme(V.box[p], el)) { leer.hidden = false; leer.textContent = 'Diese Stelle ist auf der Seite gerade eingeklappt und erst nach einem Klick zu sehen.'; }
  } else {
    rahme(V.box[p], null);
    leer.hidden = false;
    leer.textContent = p === 'vorher' ? 'Hier stand das vorher noch nicht.' : 'Hier steht es nach dem Veröffentlichen nicht mehr.';
  }
  V.el[p] = el;
  const hoehe = d.documentElement.scrollHeight || 1;
  m.innerHTML = V.stellen.map((s, i) => {
    if (s.seite !== st.seite) return '';
    const e = i === V.i ? el : vglFinde(d, s, p);
    const r = e && e.getBoundingClientRect();
    return r && (r.width || r.height) ? `<i class="${i === V.i ? 'an' : ''}" style="top:${((r.top + d.defaultView.scrollY) / hoehe * 100).toFixed(2)}%"></i>` : '';
  }).join('');
}
function vglLade() {
  const st = V.stellen[V.i], name = (V.c.seiten.find(s => s.datei === st.seite) || {}).name || st.seite;
  $('#v-zahl').textContent = `Stelle ${V.i + 1} von ${V.stellen.length} · ${name}`;
  $('#v-seite').value = st.seite;
  ['vorher', 'entwurf'].forEach(p => {
    const fr = $('#v-' + p);
    if (V.seite[p] !== st.seite) { V.seite[p] = st.seite; V.el = {}; fr.src = `/${p}/${encodeURIComponent(st.seite)}?nomotion`; } else vglMarke(p);
  });
}

// ---------------------------------------------------------------- Verlauf und Zugang
function verlauf() {
  const vs = Z.verlauf;
  sicht.innerHTML = `<div class="in">${kopf('Ver<em>lauf.</em>', vs.length ? 'Jede Veröffentlichung wird aufgehoben. Holen Sie einen früheren Stand zurück, liegt er zuerst als Entwurf bereit. Sie prüfen ihn und veröffentlichen dann.' : '')}
    ${vs.length ? `<ol class="lauf">${vs.map((v, i) => `<li><div class="blatt"><div><time>${v.anfang ? 'Ursprünglicher Stand' : datum(v.zeit)}</time>
      <p>${v.anfang ? 'So war die Website, bevor im Studio zum ersten Mal etwas geändert wurde.' : (v.notiz ? `<b>${h(v.notiz)}</b> · ` : '') + h(v.punkte.slice(0, 6).join(' · ')) + (v.punkte.length > 6 ? ` und ${v.punkte.length - 6} weitere` : '')}</p></div>
      ${i === 0 ? '<span class="mono leise">Das ist der Stand der Website</span>' : `<button class="kn kn--klein kn--linie" type="button" data-id="${h(v.id)}">Diesen Stand zurückholen</button>`}</div></li>`).join('')}</ol>`
    : `<div class="leerbild">${ik('verlauf')}<b>Noch nichts veröffentlicht.</b><p>Sobald Sie zum ersten Mal etwas veröffentlichen, finden Sie hier jeden Stand der Website und können ihn zurückholen.</p></div>`}</div>`;
  sicht.querySelector('.in').addEventListener('click', ev => {
    const b = ev.target.closest('[data-id]');
    if (!b) return;
    frage('Stand <em>zurückholen?</em>', 'Der frühere Stand wird als Entwurf geladen. Was Sie gerade an unveröffentlichten Änderungen haben, wird dabei ersetzt. Auf der Website ändert sich erst etwas, wenn Sie veröffentlichen.', 'Zurückholen', async () => {
      Z = await api('zurueck', { id: b.dataset.id }); melden();
      sag('Der frühere Stand liegt als Entwurf bereit.');
      location.hash = '#/aenderungen';
    });
  });
}
function zugang() {
  if (PROBE) {
    sicht.innerHTML = `<div class="in">${kopf('Zu<em>gang.</em>', 'Die Probe-Fassung braucht kein Passwort. Jeder Besucher arbeitet in seiner eigenen Kopie, die echte Website bleibt, wie sie ist.')}
      <section class="blatt" style="max-width:640px"><h3>Im echten Studio</h3><p style="margin-top:12px;color:rgba(15,22,32,.7)">Dort legen Sie beim ersten Öffnen Ihr eigenes Passwort fest und können es hier jederzeit ändern. Nach zwölf Stunden meldet es Sie von selbst ab.</p></section></div>`;
    return;
  }
  if (OFFEN) {
    sicht.innerHTML = `<div class="in">${kopf('Zu<em>gang.</em>', 'Das Studio ist gerade ohne Passwort offen. Sobald Sie wirklich damit arbeiten, wird der Schutz eingeschaltet.')}
      <section class="blatt" style="max-width:640px"><h3>Offen</h3><p style="margin-top:12px;color:rgba(15,22,32,.7)">Jeder, der die Adresse kennt, kann gerade ändern und veröffentlichen. Zum Einschalten des Schutzes sagen Sie Robert Bescheid.</p></section></div>`;
    return;
  }
  sicht.innerHTML = `<div class="in">${kopf('Zu<em>gang.</em>', 'Das Studio ist mit einem Passwort geschützt. Nach zwölf Stunden meldet es Sie von selbst ab.')}
    <div class="raster r-2"><section class="blatt"><h3>Passwort ändern</h3><form id="z-form" style="display:grid;gap:14px;margin-top:18px" autocomplete="off">
      <label class="feld"><span>Bisheriges Passwort</span><input type="password" name="alt" autocomplete="current-password" required></label>
      <label class="feld"><span>Neues Passwort</span><input type="password" name="neu" autocomplete="new-password" required minlength="10"><small>Mindestens 10 Zeichen</small></label>
      <label class="feld"><span>Noch einmal</span><input type="password" name="neu2" autocomplete="new-password" required></label>
      <div class="fehler" role="alert" style="text-align:left"></div><div><button class="kn" type="submit">Passwort ändern</button></div></form></section>
    <section class="blatt"><h3>Abmelden</h3><p style="margin:14px 0 20px;color:rgba(15,22,32,.7)">An einem fremden Rechner melden Sie sich am besten ab, wenn Sie fertig sind. Entwürfe bleiben erhalten.</p><button class="kn kn--linie" type="button" data-akt="abmelden">Abmelden</button></section></div></div>`;
  const f = $('#z-form');
  f.addEventListener('submit', async ev => {
    ev.preventDefault();
    const fe = $('.fehler', f);
    fe.textContent = '';
    if (f.neu.value !== f.neu2.value) { fe.textContent = 'Die beiden neuen Eingaben sind nicht gleich.'; return; }
    try { await api('passwort', { alt: f.alt.value, neu: f.neu.value }); f.reset(); sag('Das Passwort ist geändert.'); } catch (e) { fe.textContent = e.message; }
  });
}

// ---------------------------------------------------------------- Fenster
function fenster(html, breit) {
  const f = $('#fenster');
  f.hidden = false;
  f.oninput = f.onclick = f.bei = null;
  $$('.quitt').forEach(x => { if (!html.includes('class="erfolg"')) x.remove(); });
  f.innerHTML = `<div class="fenster__k${breit ? ' breit' : ''}" role="dialog" aria-modal="true"><button class="rund zu" type="button" data-zu aria-label="Schliessen">${SYM.zu}</button>${html}</div>`;
  const erstes = $('input,button.kn', f);
  if (erstes) erstes.focus();
}
function fensterZu() { const f = $('#fenster'); f.hidden = true; f.innerHTML = ''; }
function frage(titel, text, knopf, tun) {
  fenster(`<h2>${titel}</h2><p>${text}</p><div class="fenster__kn"><button class="kn kn--linie" type="button" data-zu>Abbrechen</button><button class="kn" type="button" id="f-ja">${knopf}</button></div>`);
  $('#f-ja').addEventListener('click', async () => { try { await tun(); fensterZu(); } catch (e) { sag(e.message, true); } });
}
$('#fenster').addEventListener('click', ev => { if (ev.target.closest('[data-zu]')) fensterZu(); });
$('#fenster').addEventListener('wahl', ev => { const f = $('#fenster'); if (f.bei) f.bei(ev); });
$('#lade').addEventListener('click', ev => { if (ev.target.id === 'lade') ladeZu(); });
addEventListener('keydown', ev => {
  if (ev.key !== 'Escape') return;
  if (!$('#fenster').hidden) fensterZu(); else if (V) vglZu(); else if (!$('#lade').hidden) ladeZu();
});
document.addEventListener('click', async ev => {
  const b = ev.target.closest('[data-akt]');
  if (!b) return;
  const akt = b.dataset.akt, imLade = b.closest('#lade');
  if (akt === 'abmelden') { try { await api('abmelden', {}); } catch (e) {} Z = null; ladeZu(); tor('an'); }
  if (akt === 'lade') { if ($('#lade').hidden) lade(); else ladeZu(); }
  if (akt === 'ladezu') ladeZu();
  if (akt === 'raus' || akt === 'alles') aktAenderung(akt);
  if (imLade && (akt === 'sehen' || akt === 'weg')) aktAenderung(akt, b.closest('[data-id]').dataset.id);
  if (akt === 'geraet' && W) {
    $('#w-buehne').classList.toggle('handy', b.dataset.g === 'handy');
    W.passe();
    $$('[data-akt="geraet"]').forEach(x => x.classList.toggle('an', x === b));
    setTimeout(() => { if (W && W.sel) rahme(W.an, W.sel.el); }, 300);
  }
});
// ---------------------------------------------------------------- Zahlen: was Gäste auf der Website tun (Tasty Studios, 10.10.2026, Vorlage Carlton Control)
// Die Website meldet Ereignisse an /api/zahlen (online im Blob-Speicher). Keine Kekse, keine Adressen, keine Namen.
async function zahlenS() {
  sicht.innerHTML = `<div class="in">${kopf('Zahlen.', 'Was Gäste auf der Website tun: Besuche, Klicks auf «Buchen», Tischanfragen, gefragte Zimmer, Anfragen der letzten 30 Tage.')}<div class="leerbild">${ik('tannen')}<b>Einen Moment.</b><p>Die Zahlen werden geladen.</p></div></div>`;
  let ev;
  try { const r = await fetch('/api/zahlen', { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); ev = (await r.json()).ereignisse || []; }
  catch (e) { sicht.querySelector('.in').innerHTML = kopf('Zahlen.', '') + `<div class="leerbild">${ik('tannen')}<b>Nur online.</b><p>Die Zahlen liegen im Speicher der Online-Fassung der Website.</p></div>`; return; }
  const n = t => ev.filter(e => e.t === t).length;
  const zaehle = (L, f) => { const m = {}; L.forEach(e => { const k = f(e); if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  const ZIMMER = { economy: 'Economy', ambiance: 'Ambiance', 'junior-suite': 'Junior Suite', suite: 'Suite', 'ruedihus-landhaus': 'Ruedihus, Doppelzimmer «Landhaus»', 'ruedihus-junior': 'Ruedihus, Junior Suite' };
  const FORM = { feste: 'Anfrage Feste und Seminare', gutschein: 'Gutschein', anreise: 'Vor der Anreise' };
  let land = k => k; try { const dn = new Intl.DisplayNames(['de-CH'], { type: 'region' }); land = k => { try { return dn.of(k); } catch (e) { return k; } }; } catch (e) {}
  const liste = (titel, L, name, leer) => { const max = L.length ? L[0][1] : 1; return `<section class="zrang"><h3>${titel}</h3>${L.length ? L.slice(0, 8).map(([k, v]) => `<div class="zrang__z"><span>${h(name ? name(k) : k)}</span><i style="--w:${Math.max(4, Math.round(v / max * 100))}%"></i><b>${v}</b></div>`).join('') : `<p class="zrang__leer">${leer}</p>`}</section>`; };
  const tage = []; for (let i = 13; i >= 0; i--) tage.push(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
  const proTag = tage.map(t => ev.filter(e => e.t === 'seite' && String(e.zeit).slice(0, 10) === t).length), maxT = Math.max(1, ...proTag);
  sicht.querySelector('.in').innerHTML = kopf('Zahlen.', 'Die letzten 30 Tage. Gezählt wird ohne Kekse und ohne Adressen, Prüfläufe zählen nicht mit.') +
    `<section class="zkacheln"><div><b>${n('seite')}</b><span>Seitenaufrufe</span></div><div><b>${n('buchen')}</b><span>Klicks auf «Buchen» und «Tisch»</span></div><div><b>${n('finder')}</b><span>Zimmer-Finder mit Preis</span></div><div><b>${n('tisch') + n('formular')}</b><span>Anfragen und Bestellungen</span></div></section>
    <section class="zrang"><h3>Seitenaufrufe, die letzten 14 Tage</h3><div class="ztage">${proTag.map((v, i) => `<div title="${v}"><i style="--h:${Math.max(2, Math.round(v / maxT * 100))}%"></i><span>${new Date(tage[i]).getDate()}.</span></div>`).join('')}</div></section>
    <div class="zrang-raster">
    ${liste('Gefragte Zimmer', zaehle(ev.filter(e => (e.t === 'zimmer' || e.t === 'finder') && e.z), e => e.z), k => ZIMMER[k] || k, 'Noch kein Zimmer über den Finder gewählt.')}
    ${liste('Tischanfragen', zaehle(ev.filter(e => e.t === 'tisch'), e => e.p), null, 'Noch keine Tischanfrage.')}
    ${liste('Anfragen und Bestellungen', zaehle(ev.filter(e => e.t === 'formular'), e => e.f), k => FORM[k] || k, 'Noch keine Anfrage über die Website.')}
    ${liste('Länder', zaehle(ev.filter(e => e.t === 'seite'), e => e.l), land, 'Noch kein Land erkannt.')}
    ${liste('Meistbesuchte Seiten', zaehle(ev.filter(e => e.t === 'seite'), e => e.s), null, 'Noch keine Besuche.')}
    </div>`;
}
const SICHTEN = { zahlen: zahlenS, uebersicht, seiten, seite, zimmer, haus, bilder, aenderungen: aenderungenS, verlauf, zugang, hinweis: hinweisS, menue: menueS, google: googleS, pruefung: () => location.replace('pruefung.html'),
  kueche: () => bereich('kueche'), spa: () => bereich('spa'), feste: () => bereich('feste'), angebote: () => bereich('angebote'), team: () => bereich('team'), ehren: () => bereich('ehren') };

(async () => {
  try {
    const s = await api('status');
    OFFEN = !!s.offen;
    PROBE = !!s.probe;
    if (s.offen) await laden(); else if (!s.eingerichtet) tor('neu'); else if (!s.angemeldet) tor('an'); else await laden();
  } catch (e) {
    document.body.insertAdjacentHTML('beforeend', `<div class="tor" style="display:grid"><div class="tor__k"><h1>Das Studio <em>startet nicht.</em></h1><p>${h(e.message)}</p>
      <div style="display:grid;gap:12px;margin-top:22px"><a class="kn kn--breit" href="pruefung.html">Prüfung öffnen</a><button class="link" type="button" onclick="location.reload()" style="justify-self:center">Noch einmal versuchen</button></div></div></div>`);
  }
})();
})();

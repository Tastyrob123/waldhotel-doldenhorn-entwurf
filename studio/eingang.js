/* Eingang · Studio · Waldhotel Doldenhorn. Die Anfragen aus dem Anfrage-Fenster der Website (assets/js/anfrage.js) für das Team.
   Fassung 2 (17.10.2026, Robert: «Mach das noch ein bisschen geiler wie die anderen Tools auch und bau da ein paar Beispiele ein»): Kopfleiste Nachtblau,
   heller Raum, Bühne mit dem Haus am Abend, Abteilungen als Kacheln, Liste nach Tagen mit Foto je Anliegen, Anfrage auf dunkler Platte mit der
   Antwort als Brief im Ton des Hauses. Vorbild: der Eingang von «Anfragen & Chat» des Grand Beau-Rivage (nur gelesen). Fassung 1: _sicherung/2026-10-17-eingang-v1/.
   Funktionen wie Fassung 1: gelesen beim Öffnen, erledigt / wieder offen, löschen mit zweitem Klick, nach Abteilung und Stand filtern, alle zwei Minuten
   nachsehen. Liest und schreibt nur über /api/anfragen (online api/anfragen.js, lokal serve.py). Aus dem Eingang wird nichts verschickt.
   Beispiele: neun erfundene Anfragen, überall «Beispiel» beschriftet, ohne Angaben über das Haus; ihr Stand lebt nur in diesem Browser. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const merk = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
const PF = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5"/></svg>';
const SVG = {
  tanne: '<svg viewBox="0 0 24 24"><path d="M12 3 7 11h3l-4 6h12l-4-6h3z"/><path d="M12 17v4"/></svg>',
  brief: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  glocke: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>',
  tropfen: '<svg viewBox="0 0 24 24"><path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3Z"/><path d="M9 15a3 3 0 0 0 3 3"/></svg>',
  glas: '<svg viewBox="0 0 24 24"><path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8 20h8"/></svg>',
  personen: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5a3 3 0 0 1 0 6M21 20c0-2.8-1.6-5-4-5.7"/></svg>',
  studio: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>',
  pruefung: '<svg viewBox="0 0 24 24"><path d="M5 12.5 9.5 17 19 7"/></svg>',
};
const ik = n => `<span class="ik">${SVG[n]}</span>`;
const HAUS = { name: 'Waldhotel Doldenhorn', adresse: 'Doldenhornstrasse 26 · 3718 Kandersteg', tel: '+41 33 675 81 81' };
/* an wen: wie im Anfrage-Fenster der Website (anfrage.js TEAM) */
const AB = { info: 'Rezeption', spa: 'Spa', event: 'Event', jobs: 'Personal' };
const AB_SATZ = { info: 'Zimmer, Tisch, Fragen', spa: 'Behandlungen, Spa-Tage', event: 'Feste, Hochzeiten, Seminare', jobs: 'Bewerbungen' };
const AB_IK = { info: 'glocke', spa: 'tropfen', event: 'glas', jobs: 'personen' };
const AB_BILD = { info: 'zimmer', spa: 'spa', event: 'hochzeit', jobs: 'empfang' };
const ab = a => { const k = String(a || '').split('@')[0]; return k in AB ? k : 'info'; };
/* Foto je Anliegen (eigene kleine Fassungen in eingang-bilder/, aus den Fotos der Website) */
function bild(a) {
  const t = [a.anliegen, a.nachricht, a.seite].join(' ').toLowerCase(), k = ab(a.an);
  if (k === 'spa') return /sauna/.test(t) ? 'sauna' : 'spa';
  if (k === 'event') return /hochzeit|heirat|wedding|mariage/.test(t) ? 'hochzeit' : /seminar|tagung|workshop|klausur|meeting/.test(t) ? 'seminar' : 'fest';
  if (k === 'jobs') return 'empfang';
  return /tisch|restaurant|gourmet|bistro|essen|dinner|table/.test(t) ? 'tisch' : /zimmer|nacht|nächte|room|night|chambre|aufenthalt|stay|séjour/.test(t) ? 'zimmer' : 'empfang';
}
const SEITEN = { 'index': 'Startseite', 'zimmer': 'Zimmer', 'spa': 'Spa', 'sauna-welt': 'Sauna World', 'feste': 'Feste', 'heiraten': 'Heiraten', 'seminare': 'Seminare', 'angebote': 'Angebote',
  'haus': 'Das Haus', 'karriere': 'Karriere', 'restaurant-doldenhorn': 'Restaurant', 'au-gourmet': 'Au Gourmet', 'bistro': 'Bistro', 'halbpension': 'Halbpension', 'anreise': 'Anreise',
  'abreise': 'Abreise', 'umgebung': 'Umgebung', 'veranstaltungen': 'Veranstaltungen', 'reisen-ohne-stress': 'Reisen ohne Stress', 'kueche': 'Küche' };
const seite = p => { const k = String(p || '').replace(/^\/+|\.html$/g, '').split('/').pop() || 'index'; return SEITEN[k] || (k.startsWith('zimmer-') ? 'Zimmer ' + k.slice(7).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : k); };
const SPRACHE = { de: 'Deutsch', en: 'Englisch', fr: 'Französisch', it: 'Italienisch' };
const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const probe = a => /\b(probe|prüfung|pruefung|test|qa)\b/i.test([a.name, a.anliegen, a.kontakt].join(' ')) || /@example\.(com|org)$/i.test(a.kontakt || '');

/* ---------------------------------------------------------------- Beispiele (erfunden, ohne Angaben über das Haus) */
const tag = (n, std = 0, min = 0) => { const d = new Date(); if (n) { d.setDate(d.getDate() - n); d.setHours(std, min, 0, 0); } else d.setTime(Date.now() - (std * 60 + min) * 60000); return d.toISOString(); };
const vor = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const BEISPIELE = [
  { id: 'bsp-1', zeit: tag(0, 0, 38), an: 'spa@doldenhorn.ch', anliegen: 'Zwei Massagen am Samstag', datum: vor(2), personen: '2', name: 'Lea und Jonas Brunner', kontakt: 'lea.brunner@example.com', seite: '/spa.html', sprache: 'de',
    nachricht: 'Grüezi, wir sind ab Freitag bei Ihnen zu Gast und würden am Samstagnachmittag gern zwei Massagen buchen, wenn möglich zur gleichen Zeit. Ab 14 Uhr passt uns alles.' },
  { id: 'bsp-2', zeit: tag(0, 2, 5), an: 'info@doldenhorn.ch', anliegen: 'Tisch für vier Personen', datum: vor(5), personen: '4', name: 'Peter Zbinden', kontakt: 'p.zbinden@example.com', seite: '/au-gourmet.html', sprache: 'de',
    nachricht: 'Wir feiern den 60. Geburtstag meines Vaters und würden gern zu viert bei Ihnen essen, am liebsten gegen 19 Uhr. Eine Person isst vegetarisch.' },
  { id: 'bsp-3', zeit: tag(0, 4, 50), an: 'event@doldenhorn.ch', anliegen: 'Hochzeit im nächsten Sommer', datum: vor(240), personen: '80', name: 'Sarah Meier und Luca Rossi', kontakt: 'sarah.meier@example.com', seite: '/heiraten.html', sprache: 'de',
    nachricht: 'Wir heiraten nächsten Sommer und suchen einen Ort für Apéro, Essen und Tanz mit rund 80 Gästen. Ein Teil der Gäste würde gern zwei Nächte bleiben. Könnten Sie uns die Möglichkeiten und Menuvorschläge zusenden?' },
  { id: 'bsp-4', zeit: tag(1, 21, 17), an: 'info@doldenhorn.ch', anliegen: 'Family stay in July', datum: vor(260), personen: '4', name: 'Emily Carter', kontakt: 'emily.carter@example.com', seite: '/zimmer.html', sprache: 'en', stand: 'gelesen',
    nachricht: 'Hello, we are a family of four (our children are 6 and 9) and would love to spend a week in Kandersteg next July. Could you send us an offer for a room for all of us, ideally with half board?' },
  { id: 'bsp-5', zeit: tag(1, 16, 42), an: 'jobs@doldenhorn.ch', anliegen: 'Bewerbung als Commis de cuisine', datum: '', personen: '', name: 'Nico Frei', kontakt: 'nico.frei@example.com', seite: '/karriere.html', sprache: 'de',
    nachricht: 'Guten Tag, ich habe meine Lehre als Koch im Sommer abgeschlossen und würde gern ab der Wintersaison in Ihrer Küche arbeiten. Meinen Lebenslauf und die Zeugnisse schicke ich Ihnen gern.' },
  { id: 'bsp-6', zeit: tag(1, 10, 3), an: 'spa@doldenhorn.ch', anliegen: 'Journée spa en novembre', datum: vor(19), personen: '1', name: 'Camille Martin', kontakt: 'camille.martin@example.com', seite: '/sauna-welt.html', sprache: 'fr', stand: 'gelesen',
    nachricht: 'Bonjour, je serai à Kandersteg en novembre et j’aimerais passer une journée dans votre spa et la sauna. Est-ce possible sans nuitée à l’hôtel ?' },
  { id: 'bsp-7', zeit: tag(2, 14, 26), an: 'event@doldenhorn.ch', anliegen: 'Seminar mit Übernachtung', datum: vor(45), personen: '16', name: 'Thomas Keller', kontakt: 'thomas.keller@example.com', seite: '/seminare.html', sprache: 'de', stand: 'erledigt',
    nachricht: 'Wir planen einen zweitägigen Workshop für unser Team mit 16 Personen und einer Übernachtung. Wir bräuchten einen Raum mit Beamer und am ersten Abend ein gemeinsames Essen.' },
  { id: 'bsp-8', zeit: tag(3, 19, 8), an: 'info@doldenhorn.ch', anliegen: 'Drei Nächte im Februar', datum: vor(118), personen: '2', name: 'Claudia Steiner', kontakt: 'claudia.steiner@example.com', seite: '/zimmer-ambiance.html', sprache: 'de', stand: 'erledigt',
    nachricht: 'Wir möchten im Februar drei Nächte bei Ihnen verbringen, gern in einem ruhigen Zimmer. Wir reisen mit dem Zug an und kommen am frühen Nachmittag in Kandersteg an.' },
  { id: 'bsp-9', zeit: tag(4, 11, 51), an: 'jobs@doldenhorn.ch', anliegen: 'Schnupperlehre im Service', datum: '', personen: '', name: 'Mia Gerber', kontakt: 'mia.gerber@example.com', seite: '/karriere.html', sprache: 'de',
    nachricht: 'Guten Tag, ich bin in der 8. Klasse und interessiere mich für eine Lehre als Restaurationsfachfrau. Darf ich bei Ihnen ein paar Tage schnuppern?' },
].map(b => ({ ...b, beispiel: true, start: b.stand || 'neu' }));

let GAESTE = null, A = null, FILTER = 'offen', ABT = 'alle', WAHL = null, ZULETZT = null, MITHALT = '', ERST = true;
let ZEIGE_BSP = merk('dh_eingang_beispiele') !== false;
const BSP_STAND = merk('dh_eingang_beispiel_stand') || {};
const BRIEFE = {};   // geänderte Briefe, solange die Seite offen ist

function sag(t, fehler) {
  const d = document.createElement('div'); d.className = fehler ? 'f' : ''; d.textContent = t;
  const m = $('#meldung'); m.appendChild(d); while (m.children.length > 3) m.firstChild.remove();
  setTimeout(() => d.remove(), 6000);
}
async function api(koerper) {
  let r;
  try { r = await fetch('/api/anfragen', koerper ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(koerper), cache: 'no-store' } : { cache: 'no-store' }); }
  catch (e) { const f = new Error('Keine Verbindung. Bitte die Internetverbindung prüfen und noch einmal versuchen.'); f.netz = true; throw f; }
  let j = {}; try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw new Error(r.status === 403 ? 'Der Eingang darf die Anfragen hier nicht lesen. Bitte über die Adresse des Studios öffnen.' : (j.fehler || 'Das hat nicht geklappt.'));
  return j;
}
const uhr = d => d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
function tagName(z) {
  const d = new Date(z), heute = new Date(), gestern = new Date(Date.now() - 864e5);
  if (d.toDateString() === heute.toDateString()) return 'Heute';
  if (d.toDateString() === gestern.toDateString()) return 'Gestern';
  return d.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' });
}
const zeitText = z => { const d = new Date(z); return isNaN(d) ? '' : tagName(z) + ', ' + uhr(d) + ' Uhr'; };
function wunsch(s, kurz) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('de-CH', kurz ? { day: 'numeric', month: 'long', year: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : String(s || '');
}
const personen = p => p ? p + (p === '1' ? ' Person' : ' Personen') : '';
const liste = () => (A || []).concat(ZEIGE_BSP ? BEISPIELE.filter(b => BSP_STAND[b.id] !== 'weg').map(b => Object.assign(b, { stand: BSP_STAND[b.id] || b.start })) : [])
  .sort((x, y) => String(y.zeit).localeCompare(String(x.zeit)));
const standPasst = (a, f) => f === 'alle' || (f === 'neu' ? a.stand === 'neu' : f === 'erledigt' ? a.stand === 'erledigt' : a.stand !== 'erledigt');
const passt = a => standPasst(a, FILTER) && (ABT === 'alle' || ab(a.an) === ABT);

// ---------------------------------------------------------------- Kopf und Rand
function kopf() {
  const neu = liste().filter(a => a.stand === 'neu' && (ABT === 'alle' || ab(a.an) === ABT)).length;
  $('#kopf').innerHTML = `<a class="eg-kopf__marke" href="./" title="Zum Studio"><span class="eg-kopf__z" aria-hidden="true">${SVG.tanne}</span><span><b>Eingang</b><small>Studio · ${HAUS.name}</small></span></a>
    <div class="eg-kopf__mitte"><b>${ABT === 'alle' ? 'Alle Anfragen' : AB[ABT]}</b><small>${neu ? neu + (neu === 1 ? ' neue Anfrage' : ' neue Anfragen') : 'Keine neuen Anfragen'}</small></div>
    <div class="eg-kopf__r"><a class="eg-rund" href="./" title="Zum Studio" aria-label="Zum Studio">${SVG.studio}</a><a class="eg-rund" href="pruefung.html" target="_blank" rel="noopener" title="Prüfung des Studios" aria-label="Prüfung">${SVG.pruefung}</a>
      <a class="eg-glanz" href="/" target="_blank" rel="noopener"><span>Website ansehen</span><i>${PF}</i></a></div>`;
}
function rand() {
  const l = liste(), offen = k => l.filter(a => a.stand !== 'erledigt' && (k === 'alle' || ab(a.an) === k)).length, neu = k => l.filter(a => a.stand === 'neu' && (k === 'alle' || ab(a.an) === k)).length;
  const zeile = k => `<button type="button" class="eg-rand__z${ABT === k ? ' an' : ''}" data-abt="${k}">${ik(AB_IK[k])}<span>${AB[k]}<small>${AB_SATZ[k]}</small></span>${neu(k) ? `<b class="neu">${neu(k)}</b>` : offen(k) ? `<b>${offen(k)}</b>` : ''}</button>`;
  $('#rand').innerHTML = `<button type="button" class="eg-rand__alle${ABT === 'alle' ? ' an' : ''}" data-abt="alle">${ik('brief')}<span>Alle Anfragen</span>${neu('alle') ? `<b>${neu('alle')}</b>` : ''}</button>
    <p class="eg-rand__t">Für das Team</p>
    ${Object.keys(AB).map(zeile).join('')}
    <p class="eg-rand__t">Wege</p>
    <a class="eg-rand__w" href="./">Zum Studio</a>
    <a class="eg-rand__w" href="gaeste.html" data-gaeste${GAESTE ? '' : ' hidden'}>Gäste &amp; Anfragen ${PF}</a>
    <a class="eg-rand__w" href="/" target="_blank" rel="noopener">Website ansehen ${PF}</a>
    <a class="eg-rand__w" href="pruefung.html" target="_blank" rel="noopener">Prüfung ${PF}</a>
    <div class="eg-rand__fuss"><button type="button" class="eg-schalter${ZEIGE_BSP ? ' an' : ''}" data-akt="beispiele" role="switch" aria-checked="${ZEIGE_BSP}"><i></i><span>Beispiele zeigen<small>${BEISPIELE.length} erfundene Anfragen, damit man sieht, wie es aussieht</small></span></button></div>`;
  if (GAESTE === null) { GAESTE = false; fetch('gaeste.html', { method: 'HEAD' }).then(r => { GAESTE = r.ok; const g = $('[data-gaeste]'); if (r.ok && g) g.hidden = false; }).catch(() => {}); }   // «Gäste & Anfragen» (Fragen an den Chat) gibt es nur online
}

// ---------------------------------------------------------------- Hauptfläche
function gruss() { const s = new Date().getHours(); return s >= 5 && s < 11 ? 'Guten Morgen.' : s >= 11 && s < 18 ? 'Guten Tag.' : 'Guten Abend.'; }
function zeichne() {
  const l = liste(), echt = (A || []).length, bsp = l.length - echt, neu = l.filter(a => a.stand === 'neu').length, offen = l.filter(a => a.stand !== 'erledigt').length;
  const sicht = l.filter(passt);
  if (WAHL && !l.some(a => a.id === WAHL)) WAHL = null;
  if (!WAHL && innerWidth > 980) WAHL = (sicht.find(a => a.stand === 'neu') || sicht[0] || {}).id || null;
  const zahl = (k, s) => l.filter(a => ab(a.an) === k && (s === 'neu' ? a.stand === 'neu' : a.stand !== 'erledigt')).length;
  const gruppen = []; sicht.forEach(a => { const t = tagName(a.zeit), g = gruppen[gruppen.length - 1]; if (g && g.t === t) g.l.push(a); else gruppen.push({ t, l: [a] }); });
  $('#ansicht').innerHTML = `
    <section class="eg-buehne"><img class="eg-buehne__b" src="eingang-bilder/buehne.webp" alt="" width="1000" height="667" decoding="async">
      <div class="eg-buehne__t"><p class="eg-zier"><span aria-hidden="true">${SVG.tanne}</span>Eingang · Kandersteg</p>
        <h1>${gruss()} <em>${neu ? (neu === 1 ? 'Eine Anfrage wartet.' : `${neu} Anfragen warten.`) : offen ? 'Alles gelesen.' : 'Alles beantwortet.'}</em></h1>
        <p>Was Gäste über das Anfrage-Fenster der Website schicken, landet hier, sortiert nach Rezeption, Spa, Event und Personal. Zu jeder Anfrage liegt eine Antwort als Brief bereit. Sie lesen, ergänzen und schicken selbst, aus dem Eingang geht nichts hinaus.</p>
        <p class="eg-buehne__zahl">${echt ? `${echt} ${echt === 1 ? 'Anfrage' : 'Anfragen'} von der Website` : 'Noch keine Anfrage von der Website'}${bsp ? ` · ${bsp} Beispiele` : ''}</p>
      </div></section>
    <section class="eg-kacheln" aria-label="Abteilungen">${Object.keys(AB).map(k => `<button type="button" class="eg-kachel${ABT === k ? ' an' : ''}" data-abt="${k}">
        <span class="eg-kachel__b"><img src="eingang-bilder/${AB_BILD[k]}.webp" alt="" width="200" height="200"></span>
        <span class="eg-kachel__t"><small>${AB[k]}</small><b>${zahl(k)} offen</b><span>${zahl(k, 'neu') ? `<i>${zahl(k, 'neu')} neu</i>` : h(AB_SATZ[k])}</span></span></button>`).join('')}</section>
    <div class="eg-werk">
      <div class="eg-spalte">
        <div class="eg-reiter" role="toolbar" aria-label="Stand">${[['alle', 'Alle'], ['neu', 'Neu'], ['offen', 'Offen'], ['erledigt', 'Erledigt']].map(([k, t]) => `<button type="button" data-f="${k}" class="${FILTER === k ? 'an' : ''}" aria-pressed="${FILTER === k}">${t} <i>${l.filter(a => (ABT === 'alle' || ab(a.an) === ABT) && standPasst(a, k)).length}</i></button>`).join('')}</div>
        ${ABT !== 'alle' ? `<button type="button" class="eg-nur" data-abt="alle">Nur ${AB[ABT]} <svg viewBox="0 0 14 14" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8"/></svg></button>` : ''}
        <div class="eg-liste">${gruppen.length ? gruppen.map(g => `<h2 class="eg-tag"><span>${h(g.t)}</span></h2>${g.l.map(karte).join('')}`).join('') : leer()}</div>
      </div>
      <div class="eg-detail" id="eg-detail">${detail(l.find(a => a.id === WAHL))}</div>
    </div>`;
  kopf(); rand();
  if (ERST) { ERST = false; auftritt(); }
}
function karte(a) {
  const k = ab(a.an), z = new Date(a.zeit);
  return `<button type="button" class="eg-a${a.id === WAHL ? ' an' : ''}${a.stand === 'neu' ? ' neu' : ''}${a.stand === 'erledigt' ? ' fertig' : ''}" data-id="${h(a.id)}">
    <span class="eg-a__b"><img src="eingang-bilder/${bild(a)}.webp" alt="" width="200" height="200"></span>
    <span class="eg-a__t"><span class="eg-a__k">${AB[k]} · ${isNaN(z) ? '' : uhr(z)}${a.beispiel ? ' · Beispiel' : probe(a) ? ' · Probe' : ''}${a.sprache && a.sprache !== 'de' ? ' · ' + h(a.sprache.toUpperCase()) : ''}</span>
      <b>${h(a.name)}</b><span class="eg-a__w">${h(a.anliegen || 'Ohne Betreff')}${a.datum ? ' · ' + h(wunsch(a.datum, true)) : ''}${a.personen ? ' · ' + h(personen(a.personen)) : ''}</span></span>
    <span class="eg-a__s">${a.stand === 'neu' ? '<em class="neu">Neu</em>' : a.stand === 'erledigt' ? '<em>Erledigt</em>' : '<em class="leise">Offen</em>'}</span></button>`;
}
function leer() {
  const satz = !liste().length ? 'Noch keine Anfrage im Eingang.' : FILTER === 'neu' ? 'Keine neue Anfrage.' : FILTER === 'erledigt' ? 'Noch nichts erledigt.' : 'Hier ist gerade nichts offen.';
  return `<div class="eg-leer"><span aria-hidden="true">${SVG.tanne}</span><b>${satz}</b><span>${ABT !== 'alle' ? 'Gefiltert nach ' + AB[ABT] + '. ' : ''}Sobald ein Gast das Fenster auf der Website abschickt, steht die Anfrage hier.</span>
    ${ZEIGE_BSP ? '' : '<button class="kn kn--linie kn--klein" type="button" data-akt="beispiele">Beispiele zeigen</button>'}</div>`;
}

// ---------------------------------------------------------------- Anfrage und Brief
const datumIn = (s, sprache) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(sprache, { day: 'numeric', month: 'long', year: 'numeric' }) : String(s || ''); };
const BRIEF = {
  de: { an: 'Guten Tag', dank: (a, b) => b ? `herzlichen Dank für Ihre Bewerbung${a.anliegen ? ' (' + a.anliegen.replace(/^Bewerbung( als)?\s*/i, '') + ')' : ''}.` : `herzlichen Dank für Ihre Anfrage${a.datum ? ' für den ' + datumIn(a.datum, 'de-CH') : ''}${a.personen ? ' (' + personen(a.personen) + ')' : ''}.`,
    luecke: 'Ihre Antwort', schluss: b => b ? 'Wir melden uns bald bei Ihnen.' : 'Wir freuen uns auf Sie.', gruss: 'Freundliche Grüsse', wer: 'Ihr Name' },
  en: { an: 'Dear', dank: a => `Thank you very much for your enquiry${a.datum ? ' for ' + datumIn(a.datum, 'en-GB') : ''}${a.personen ? ' (' + a.personen + (a.personen === '1' ? ' guest' : ' guests') + ')' : ''}.`,
    luecke: 'Your reply', schluss: () => 'We look forward to welcoming you.', gruss: 'Kind regards', wer: 'Your name' },
  fr: { an: 'Bonjour', dank: a => `Merci beaucoup pour votre demande${a.datum ? ' pour le ' + datumIn(a.datum, 'fr-CH') : ''}${a.personen ? ' (' + a.personen + (a.personen === '1' ? ' personne' : ' personnes') + ')' : ''}.`,
    luecke: 'Votre réponse', schluss: () => 'Nous nous réjouissons de vous accueillir.', gruss: 'Meilleures salutations', wer: 'Votre nom' },
};
function briefHtml(a) {
  if (BRIEFE[a.id]) return BRIEFE[a.id];
  const s = BRIEF[a.sprache] || BRIEF.de, jobs = ab(a.an) === 'jobs';
  const m = t => `<mark>${h(t)}</mark>`;
  return `<p>${s.an} ${h(String(a.name || '').trim())}</p><p>${h(s.dank(a, jobs))}</p><p>${m(s.luecke)}</p><p>${h(s.schluss(jobs))}</p><p>${s.gruss}<br>${m(s.wer)}<br>${HAUS.name} · ${AB[ab(a.an)]}</p>`;
}
const BETREFF = { de: 'Ihre Anfrage', en: 'Your enquiry', fr: 'Votre demande' };
function detail(a) {
  if (!a) return `<div class="eg-d eg-d--leer"><span aria-hidden="true">${SVG.brief}</span><b>Eine Anfrage wählen.</b><span>Links antippen. Hier steht dann alles, was der Gast geschickt hat, und die Antwort als Brief.</span></div>`;
  const k = ab(a.an), mail = MAIL.test(a.kontakt || ''), tel = !mail && /^[+\d][\d\s/().-]{5,}$/.test(a.kontakt || '');
  const zeile = (t, w) => `<div><dt>${t}</dt><dd>${w || '<span class="eg-leise">ohne Angabe</span>'}</dd></div>`;
  const betreff = (BETREFF[a.sprache] || BETREFF.de) + ': ' + (a.anliegen || HAUS.name);
  return `<article class="eg-d" data-id="${h(a.id)}">
    <header class="eg-d__k"><span class="eg-d__b"><img src="eingang-bilder/${bild(a)}.webp" alt="" width="200" height="200"></span>
      <div><p class="eg-d__ab">${AB[k]} · ${h(a.anliegen || 'Ohne Betreff')}${a.beispiel ? ' · <span class="eg-gold">Beispiel</span>' : probe(a) ? ' · <span class="eg-gold">Probe, nicht beantworten</span>' : ''}</p><h2>${h(a.name)}</h2>
        <p class="eg-d__z">${h(zeitText(a.zeit))}${a.seite ? ` · über <a href="${h(a.seite)}" target="_blank" rel="noopener">${h(seite(a.seite))}</a>` : ''}</p></div></header>
    <dl class="eg-d__l">${zeile('Datum', a.datum ? h(wunsch(a.datum)) : '')}${zeile('Personen', h(a.personen))}
      ${zeile('Kontakt', mail ? `<a href="mailto:${h(a.kontakt)}">${h(a.kontakt).replace('@', '@<wbr>')}</a>` : tel ? `<a href="tel:${h(a.kontakt.replace(/[^+\d]/g, ''))}">${h(a.kontakt)}</a>` : h(a.kontakt))}${zeile('Sprache', h(SPRACHE[a.sprache] || a.sprache || 'Deutsch'))}</dl>
    <blockquote class="eg-d__n">${a.nachricht ? h(a.nachricht).replace(/\n/g, '<br>') : '<span class="eg-leise">Der Gast hat nichts dazugeschrieben, nur das Anliegen oben.</span>'}</blockquote>
    <div class="eg-d__brief">
      <p class="eg-d__bt"><span>Antwort als Brief</span><small>Gelb markiert: hier ergänzen Sie. Der ganze Brief lässt sich ändern.</small></p>
      <div class="eg-brief">
        <div class="eg-brief__kopf"><span aria-hidden="true">${SVG.tanne}</span><b>${HAUS.name}</b><small>${HAUS.adresse} · ${HAUS.tel}</small></div>
        <dl class="eg-brief__an"><div><dt>An</dt><dd>${h(a.name)}${mail ? ' · ' + h(a.kontakt) : ''}</dd></div><div><dt>Betreff</dt><dd><input class="eg-brief__betreff" value="${h(betreff)}" aria-label="Betreff"></dd></div></dl>
        <div class="eg-brief__text" contenteditable="true" spellcheck="true" lang="${h(a.sprache || 'de')}" aria-label="Brief an den Gast">${briefHtml(a)}</div>
      </div>
    </div>
    <div class="eg-d__r">
      ${mail ? `<button class="eg-knauf" type="button" data-akt="mail"><span>Im Mailprogramm öffnen</span><i>${PF}</i></button>` : tel ? `<a class="eg-knauf" href="tel:${h(a.kontakt.replace(/[^+\d]/g, ''))}"><span>Anrufen</span><i>${PF}</i></a>` : ''}
      <button class="kn kn--linie kn--klein" type="button" data-akt="kopieren">Brief kopieren</button>
      ${a.stand === 'erledigt' ? '<button class="kn kn--linie kn--klein" type="button" data-akt="offen">Wieder offen</button>' : '<button class="kn kn--hell kn--klein" type="button" data-akt="erledigt">Erledigt</button>'}
      <button class="kn kn--linie kn--klein eg-weg" type="button" data-akt="loeschen">${MITHALT === a.id ? (a.beispiel ? 'Wirklich ausblenden?' : 'Wirklich löschen?') : a.beispiel ? 'Ausblenden' : 'Löschen'}</button>
    </div>
    <p class="eg-d__f">${a.beispiel ? 'Erfundenes Beispiel, kein echter Gast. Erledigt und Ausblenden merkt sich nur dieser Browser.' : mail ? '«Im Mailprogramm öffnen» legt den Brief mit der Adresse des Gastes in Ihr Mailprogramm. Abgeschickt wird erst dort, von Ihnen.' : tel ? 'Der Gast hat eine Telefonnummer angegeben.' : 'Der Gast hat weder Mail-Adresse noch Telefonnummer angegeben, nur das, was unter Kontakt steht.'}</p>
  </article>`;
}
function briefText() {
  const t = $('.eg-brief__text'); if (!t) return '';
  const p = $$('p', t).map(x => x.innerText.trim()).filter(Boolean);
  return p.length ? p.join('\n\n') : t.innerText.trim();
}

// ---------------------------------------------------------------- Bewegung: Stücke steigen gestaffelt auf, ab dem ersten Bild deckend (nur transform)
function auftritt() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const st = [$('.eg-buehne'), ...$$('.eg-kachel'), $('.eg-reiter'), ...$$('.eg-liste > *').slice(0, 8), $('.eg-d')].filter(Boolean).filter(e => e.getBoundingClientRect().top < innerHeight);
  st.slice(0, 22).forEach((e, i) => { e.style.setProperty('--eg-v', Math.min(i, 4) * 80 + 'ms'); e.classList.add('eg-rein'); });
  setTimeout(() => st.forEach(e => e.classList.remove('eg-rein')), 1800);
}

// ---------------------------------------------------------------- Bedienen
async function lade(still) {
  try {
    const j = await api();
    const neu = JSON.stringify(j.anfragen || []), alt = JSON.stringify(A || null);
    ZULETZT = new Date();
    if (neu !== alt) { A = j.anfragen || []; const aktiv = document.activeElement; if (!still || !aktiv || !aktiv.closest('.eg-d')) { merkeBrief(); zeichne(); } }
    document.documentElement.classList.add('eg-bereit');
  } catch (e) {
    if (!A) { tuer(e.message); return; }
    if (!still) sag(e.message, true);
  }
}
function tuer(grund) {
  document.documentElement.classList.add('eg-bereit');
  A = []; kopf(); rand();
  $('#ansicht').innerHTML = `<div class="eg-tuer eg-tuer--innen" role="alert"><h1>Der Eingang startet nicht.</h1><p>${h(grund)}</p>
    <div class="eg-d__r"><button class="kn kn--klein" type="button" data-akt="neu">Noch einmal versuchen</button><a class="link" href="pruefung.html">Prüfung öffnen</a></div></div>`;
}
function merkeBrief() { const t = $('.eg-brief__text'), d = $('.eg-d[data-id]'); if (t && d) BRIEFE[d.dataset.id] = t.innerHTML; }
async function setze(a, tun) {
  if (a.beispiel) {
    if (tun === 'loeschen') { BSP_STAND[a.id] = 'weg'; WAHL = null; sag('Beispiel ausgeblendet.'); }
    else { BSP_STAND[a.id] = tun === 'offen' ? 'gelesen' : (tun === 'gelesen' && a.stand === 'erledigt') ? 'erledigt' : tun; if (tun !== 'gelesen') sag(tun === 'erledigt' ? 'Als erledigt markiert.' : 'Wieder offen.'); }
    merk('dh_eingang_beispiel_stand', BSP_STAND); merkeBrief(); zeichne(); return;
  }
  const vorher = a.stand;
  try {
    const j = await api({ tun, id: a.id });
    if (tun === 'loeschen') { A = A.filter(x => x.id !== a.id); WAHL = null; sag('Gelöscht.'); }
    else { a.stand = j.stand || (tun === 'offen' ? 'gelesen' : tun); if (tun !== 'gelesen') sag(tun === 'erledigt' ? 'Als erledigt markiert.' : 'Wieder offen.'); }
    merkeBrief(); zeichne();
  } catch (e) { a.stand = vorher; sag(e.message, true); }
}
function waehle(id) {
  merkeBrief(); WAHL = id; MITHALT = '';
  const a = liste().find(x => x.id === id);
  zeichne();
  if (innerWidth <= 980) $('#eg-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (a && a.stand === 'neu') setze(a, 'gelesen');
}
document.addEventListener('click', ev => {
  const z = ev.target.closest('[data-akt],[data-f],[data-abt],.eg-a'); if (!z) return;
  if (z.dataset.f) { merkeBrief(); FILTER = z.dataset.f; MITHALT = ''; WAHL = null; return zeichne(); }
  if (z.dataset.abt) { merkeBrief(); ABT = ABT === z.dataset.abt && z.dataset.abt !== 'alle' ? 'alle' : z.dataset.abt; MITHALT = ''; WAHL = null; return zeichne(); }
  if (z.classList.contains('eg-a')) return waehle(z.dataset.id);
  const akt = z.dataset.akt;
  if (akt === 'neu') return lade();
  if (akt === 'beispiele') { merkeBrief(); ZEIGE_BSP = !ZEIGE_BSP; merk('dh_eingang_beispiele', ZEIGE_BSP); WAHL = null; if (!ZEIGE_BSP) { for (const k in BSP_STAND) delete BSP_STAND[k]; merk('dh_eingang_beispiel_stand', BSP_STAND); } return zeichne(); }
  const a = liste().find(x => x.id === (z.closest('.eg-d') || {}).dataset?.id); if (!a) return;
  if (akt === 'kopieren') navigator.clipboard.writeText(briefText()).then(() => sag('Brief kopiert.'), () => sag('Kopieren ging nicht. Bitte den Brief markieren und kopieren.', true));
  if (akt === 'mail') {
    if (a.beispiel) { sag('Beim Beispiel öffnet sich kein Mailprogramm. Bei echten Anfragen liegt der Brief dann mit der Adresse des Gastes bereit.'); return; }
    const betreff = ($('.eg-brief__betreff') || {}).value || '';
    location.href = 'mailto:' + encodeURIComponent(a.kontakt).replace(/%40/g, '@') + '?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(briefText());
  }
  if (akt === 'erledigt' || akt === 'offen') setze(a, akt);
  if (akt === 'loeschen') {
    if (MITHALT !== a.id) { MITHALT = a.id; z.textContent = a.beispiel ? 'Wirklich ausblenden?' : 'Wirklich löschen?'; setTimeout(() => { if (MITHALT === a.id) { MITHALT = ''; const b = $('.eg-d [data-akt="loeschen"]'); if (b) b.textContent = a.beispiel ? 'Ausblenden' : 'Löschen'; } }, 5000); return; }
    MITHALT = ''; setze(a, 'loeschen');
  }
});
document.addEventListener('keydown', ev => {
  if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
  if (ev.target.closest && ev.target.closest('input,textarea,[contenteditable="true"]')) return;
  const l = liste().filter(passt), i = l.findIndex(a => a.id === WAHL); if (!l.length) return;
  const n = l[Math.max(0, Math.min(l.length - 1, i + (ev.key === 'ArrowDown' ? 1 : -1)))]; if (!n || n.id === WAHL) return;
  ev.preventDefault(); waehle(n.id); const b = $(`.eg-a[data-id="${CSS.escape(n.id)}"]`); if (b) b.focus();
});
/* eingefügter Text im Brief nur als Text */
document.addEventListener('paste', ev => { if (!ev.target.closest || !ev.target.closest('.eg-brief__text')) return; ev.preventDefault(); document.execCommand('insertText', false, ev.clipboardData ? ev.clipboardData.getData('text/plain') : ''); });

kopf(); rand();
lade();
setInterval(() => { if (!document.hidden) lade(true); }, 120000);
addEventListener('visibilitychange', () => { if (!document.hidden && ZULETZT && Date.now() - ZULETZT > 60000) lade(true); });
})();

/* Aufklappen weich (Robert 18.10.2026, 18:19, Umgebung: «Das ist nicht sanft, sondern springt richtig einmal nach unten.» Gilt für jede Aufklapp-Zeile dieser Seite):
   die Höhe wächst und schrumpft in 0,5 s, beim Zuklappen bleibt der Inhalt stehen, bis die Zeile zu ist */
(function () {
  if (!window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("click", function (e) {
    var s = e.target.closest && e.target.closest("details > summary"); if (!s || e.defaultPrevented) return;
    var d = s.parentElement; if (!d.animate || d.closest("header, nav, .sprache") || d.hasAttribute("data-hart")) return;
    e.preventDefault();
    if (d._weich) d._weich.cancel();
    var h0 = d.getBoundingClientRect().height, auf = !d.open;
    d.open = false; var hZu = d.getBoundingClientRect().height; d.open = true; var hAuf = d.getBoundingClientRect().height;
    d.style.overflow = "hidden";
    var a = d._weich = d.animate([{ height: h0 + "px" }, { height: (auf ? hAuf : hZu) + "px" }], { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" });
    a.onfinish = function () { d.style.overflow = ""; d._weich = null; if (!auf) d.open = false; };
    a.oncancel = function () { d.style.overflow = ""; };
  }, true);
})();

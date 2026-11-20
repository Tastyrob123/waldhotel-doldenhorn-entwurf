// Gäste-Eingaben, die gefährlich oder unhandlich sind, über die Website in La Réception: nichts wird ausgeführt, alles steht als Text, nichts sprengt die Breite.
const path=require('path'),fs=require('fs');const pw=require(path.join(process.env.HOME,'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const [, , MOTOR='chromium', W='1440', H='900', BEL='/tmp']=process.argv; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const HAUS='http://127.0.0.1:18955', R='http://localhost:18954/_werkzeuge/reception/';
const lang='Lieber Herr Maeder, '+('wir freuen uns sehr auf den Aufenthalt im Waldhotel. ').repeat(70)+'Ende';
const wort='Doldenhorn'.repeat(80);
const F=[{n:'<img src=x onerror=alert(1)> XSS '+MOTOR,k:'xss@example.com',m:'<script>alert(2)</script><b>fett</b> 🌲🏔️ äöü ÄÖÜ é à ç '+wort},{n:'Lang '+MOTOR,k:'lang@example.com',m:lang}];
(async()=>{const br=await pw[MOTOR].launch();const c=await br.newContext({viewport:{width:+W,height:+H},isMobile:+W<700&&MOTOR==='chromium',hasTouch:+W<700});await c.addInitScript(()=>{localStorage.setItem('reception-name','Prüf Chat');localStorage.setItem('rundgang-dh-reception','1');});
const p=await c.newPage();let dialoge=0;p.on('dialog',d=>{dialoge++;d.dismiss().catch(()=>{});});const fehler=[];p.on('pageerror',e=>fehler.push(String(e).slice(0,120)));
for(const f of F){const r=await fetch(HAUS+'/api/anfragen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({an:'info@doldenhorn.ch',anliegen:'Probe '+f.n.slice(0,40),datum:'',personen:'2',nachricht:f.m,name:f.n,kontakt:f.k,seite:'/index.html',sprache:'de',website:''})});console.log('Website nimmt',r.status);}
await sleep(4500);
for(const f of F){await p.goto('about:blank');await p.goto(R+'#eingang');await p.waitForSelector('.re-liste .re-a');await sleep(500);await p.locator('.re-filter [data-filter="alle"]').click().catch(()=>{});
const k=p.locator('.re-liste .re-a',{hasText:f.n.slice(-12)}).first();await k.evaluate(e=>e.scrollIntoView({block:'center'}));await k.click();await p.waitForSelector('#detail .re-d');await sleep(1500);
const imgs=await p.evaluate(()=>document.querySelectorAll('#detail img[src="x"], .re-liste img[src="x"]').length);
const text=(await p.locator('#detail').innerText()).replace(/\s+/g,' ');
const breit=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
await p.locator('#detail summary, #detail [data-akt="gespraech"], #detail .re-verlauf__auf').first().click().catch(()=>{});await sleep(400);
await p.screenshot({path:path.join(BEL,`eingabe-${f.k.split('@')[0]}-${MOTOR}-${W}.jpg`),type:'jpeg',quality:60,fullPage:false});
console.log(MOTOR,W,f.k,'· Dialoge',dialoge,'· fremde Bilder',imgs,'· Name als Text',text.includes('<img src=x')||!f.n.includes('<'),'· Emoji',/🌲/.test(text)||!f.m.includes('🌲'),'· Überlauf',breit,'px · Skriptfehler',fehler.length,JSON.stringify(fehler));}
await br.close();})();

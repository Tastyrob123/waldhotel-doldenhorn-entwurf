const path=require('path');const pw=require(path.join(process.env.HOME,'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const BEL=process.argv[2];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{for(const m of ['chromium','webkit','firefox']){const b=await pw[m].launch();const c=await b.newContext({viewport:{width:1440,height:900}});await c.addInitScript(()=>{localStorage.setItem('rundgang-dh-reception','1');});const p=await c.newPage();
await p.route('**/_werkzeuge/reception/api/**',r=>r.abort());
await p.goto('http://localhost:18954/_werkzeuge/reception/');await sleep(14000);
const t=(await p.locator('body').innerText()).replace(/\s+/g,' ');
const knopf=await p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&/Prüfung/i.test(e.textContent+(e.title||'')+(e.getAttribute('aria-label')||''))).map(e=>e.outerHTML.slice(0,120)));
console.log(m,'Tür sichtbar:',await p.locator('#tuer').isVisible(),'|',t.slice(0,200),'| Prüfung-Knöpfe:',knopf.length,knopf[0]||'');
await p.screenshot({path:path.join(BEL,`tuer-${m}.jpg`),type:'jpeg',quality:60});await b.close();}})();

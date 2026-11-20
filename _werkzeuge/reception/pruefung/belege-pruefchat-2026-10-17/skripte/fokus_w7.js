const path=require('path');const pw=require(path.join(process.env.HOME,'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await pw.firefox.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
await p.goto('http://127.0.0.1:18955/feste.html',{waitUntil:'load'});await sleep(700);
for(let n=0;n<6;n++){await p.evaluate(()=>{const dl=document.querySelector('dialog.anf[open]');if(dl)dl.close();});
 await p.evaluate(()=>window.DHAnfrage.oeffne({an:'event@doldenhorn.ch',betreff:'Test'}));
 const d=p.locator('dialog.anf[open]').first();await sleep(n*15);
 // genau wie Playwright fill, aber mit gezielter Pause zwischen Fokus und Einfügen, um den Fokuswechsel nach 80 ms zu treffen
 await d.locator('textarea[name=nachricht]').focus();await sleep(70);await p.keyboard.insertText('Firmenessen');
 const v=await p.evaluate(()=>[document.querySelector('dialog.anf textarea[name=nachricht]').value,document.querySelector('dialog.anf input[name=name]').value,document.activeElement.name]);
 console.log('Versuch',n,'Nachricht',JSON.stringify(v[0]),'Name',JSON.stringify(v[1]),'Fokus',v[2]);
 await p.evaluate(()=>{document.querySelector('dialog.anf input[name=name]').value='';});}
await b.close();})();

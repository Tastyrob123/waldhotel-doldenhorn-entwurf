/* Mails: Pfeile am Laptop blättern das Band um eine Mail (wb_mails.py, 18.10.2026) */
(function () {
  var b = document.getElementById('mband'); if (!b) return;
  var k = document.querySelectorAll('.ms-pf');
  function schritt() { var m = b.querySelector('.mb'); return m ? m.getBoundingClientRect().width + parseFloat(getComputedStyle(b).columnGap || getComputedStyle(b).gap || 0) : b.clientWidth; }
  function lage() { k[0].disabled = b.scrollLeft < 4; k[1].disabled = b.scrollLeft > b.scrollWidth - b.clientWidth - 4; }
  [].forEach.call(k, function (x) { x.addEventListener('click', function () { b.scrollBy({ left: +x.dataset.r * schritt(), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); });
  b.addEventListener('scroll', lage, { passive: true }); addEventListener('resize', lage); lage();
})();

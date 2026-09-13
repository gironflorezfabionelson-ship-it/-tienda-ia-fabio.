(() => {
  const apply = () => {
    const card = document.querySelector('[data-name="maehihw cafetera portatil capsulas multicapsulas cafe molido viajes oficina camping"]');
    if (!card) return;

    const link = card.querySelector('.offer-button');
    if (link) link.href = 'https://amzn.to/3UUtwwe';

    const art = card.querySelector('.product-art');
    if (!art) return;
    art.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:14px;background:#fff;overflow:hidden;';
    art.innerHTML = '<img src="https://m.media-amazon.com/images/I/51s4Hc-uulL._SL500_.jpg" alt="Maehihw Cafetera Portátil Multicápsulas" loading="lazy" referrerpolicy="no-referrer" style="width:auto;height:auto;max-width:86%;max-height:86%;object-fit:contain;display:block;margin:auto">';
    art.removeAttribute('aria-hidden');
    art.setAttribute('role','img');
    art.setAttribute('aria-label','Maehihw Cafetera Portátil Multicápsulas');
  };

  const run = () => {
    apply();
    setTimeout(apply, 250);
    setTimeout(apply, 900);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
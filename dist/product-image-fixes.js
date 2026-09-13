(() => {
  function applyImage(cardName, imageUrl, altText, maxSize = '78%') {
    const card = document.querySelector(`.product-card[data-name="${cardName}"]`);
    if (!card) return;
    const art = card.querySelector('.product-art');
    if (!art) return;
    art.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:18px;background:#fff;overflow:hidden;';
    art.innerHTML = `<img src="${imageUrl}" alt="${altText}" loading="lazy" referrerpolicy="no-referrer" style="width:auto;height:auto;max-width:${maxSize};max-height:${maxSize};object-fit:contain;display:block;margin:auto" onerror="this.onerror=null;this.parentElement.innerHTML='<span style=\'font-size:46px\'>📦</span>'">`;
    art.removeAttribute('aria-hidden');
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', altText);
  }

  applyImage(
    'ugreen nexode cargador usb c 100w 4 puertos gan',
    'https://www.ugreen.com/cdn/shop/files/71CoEjN6L_L_d834df3a-4081-40b6-9f83-bae2c01ec97f.jpg?v=1766478296&width=1445',
    'UGREEN Nexode Cargador USB-C 100W de 4 puertos',
    '82%'
  );

  applyImage(
    'samsung t7 shield ssd portatil 1tb usb c',
    'https://images.samsung.com/is/image/samsung/p6pim/us/mu-pe1t0s-am/gallery/us-portable-ssd-t7-shield-mu-pe1t0s-am-552408700?$product-details-jpg$=',
    'Samsung T7 Shield SSD Portátil 1TB',
    '76%'
  );
})();

(() => {
  const apply = () => {
    const card = document.querySelector('[data-name="samsung t7 shield ssd portatil 1tb usb c"]');
    if (!card) return false;
    const link = card.querySelector('.offer-button');
    if (link) link.href = 'https://amzn.to/4duCnLp';
    const title = card.querySelector('h3');
    if (title) title.textContent = 'Samsung T7 Shield SSD Portátil 1TB Beige';
    const art = card.querySelector('.product-art');
    if (art) {
      art.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:18px;background:#fff;overflow:hidden;';
      art.innerHTML = '<img src="https://images.samsung.com/is/image/samsung/p6pim/uk/mu-pe1t0k-eu/gallery/uk-portable-ssd-t7-shield-mu-pe1t0k-eu-531941016?$1164_776_PNG$" alt="Samsung T7 Shield SSD Portátil 1TB Beige" loading="lazy" style="width:auto;height:auto;max-width:78%;max-height:78%;object-fit:contain;display:block;margin:auto" onerror="this.onerror=null;this.src=\'https://images.samsung.com/is/image/samsung/p6pim/uk/mu-pe1t0k-eu/gallery/uk-portable-ssd-t7-shield-mu-pe1t0k-eu-531941016\'">';
      art.removeAttribute('aria-hidden');
      art.setAttribute('role','img');
      art.setAttribute('aria-label','Samsung T7 Shield SSD Portátil 1TB Beige');
    }
    return true;
  };
  if (!apply()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (apply() || tries >= 40) clearInterval(timer);
    }, 100);
  }
})();

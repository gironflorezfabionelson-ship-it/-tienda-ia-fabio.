(() => {
  const run = () => {
    const cards = [...document.querySelectorAll('.product-card')];
    if (!cards.length) return;

    // Keep one clear purchase action per product. Secondary guide links stay useful,
    // while the share button is removed from cards to reduce decision friction.
    document.querySelectorAll('.share-product-button').forEach((button) => button.remove());

    cards.forEach((card) => {
      const offer = card.querySelector('.offer-button');
      const note = card.querySelector('.affiliate-note');
      const title = card.querySelector('h3')?.textContent?.trim() || 'este producto';
      if (!offer) return;

      offer.innerHTML = 'Comprobar precio en Amazon <span aria-hidden="true">→</span>';
      offer.setAttribute('aria-label', `Comprobar precio y disponibilidad de ${title} en Amazon`);
      offer.setAttribute('title', 'El precio, la entrega y la disponibilidad se confirman en Amazon');

      if (note) {
        note.textContent = 'Enlace de afiliado · El precio, el envío y la compra se confirman directamente en Amazon.';
      }

      const actions = card.querySelector('.product-actions');
      if (actions && !actions.querySelector('.amazon-checkout-note')) {
        const reassurance = document.createElement('div');
        reassurance.className = 'amazon-checkout-note';
        reassurance.innerHTML = '<span aria-hidden="true">✓</span><span>Compra y pago se realizan en Amazon</span>';
        actions.insertAdjacentElement('afterend', reassurance);
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      .amazon-checkout-note{display:flex;align-items:center;gap:7px;margin:10px 0 0;color:#475467;font-size:.82rem;line-height:1.35}
      .amazon-checkout-note>span:first-child{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#ecfdf3;color:#027a48;font-size:.72rem;font-weight:900;flex:0 0 auto}
      .mobile-buy-bar{display:none}
      @media(max-width:760px){
        .mobile-buy-bar{position:fixed;z-index:999;left:10px;right:10px;bottom:10px;display:flex;align-items:center;gap:10px;padding:10px 10px 10px 13px;border:1px solid #e4e7ec;border-radius:16px;background:rgba(255,255,255,.97);box-shadow:0 12px 34px rgba(16,24,40,.18);backdrop-filter:blur(10px);transform:translateY(130%);opacity:0;pointer-events:none;transition:transform .22s ease,opacity .22s ease}
        .mobile-buy-bar.is-visible{transform:translateY(0);opacity:1;pointer-events:auto}
        .mobile-buy-bar-copy{min-width:0;flex:1}
        .mobile-buy-bar-copy small{display:block;color:#667085;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
        .mobile-buy-bar-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#101828;font-size:.84rem}
        .mobile-buy-bar a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border-radius:11px;background:#ff9900;color:#111827;text-decoration:none;font-size:.8rem;font-weight:800}
        .mobile-buy-bar a:focus-visible{outline:3px solid #84adff;outline-offset:2px}
        body{padding-bottom:82px}
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'mobile-buy-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Acceso rápido al producto visible');
    bar.innerHTML = '<div class="mobile-buy-bar-copy"><small>Producto visible</small><strong></strong></div><a target="_blank" rel="nofollow sponsored noopener">Ver en Amazon</a>';
    document.body.appendChild(bar);

    const barTitle = bar.querySelector('strong');
    const barLink = bar.querySelector('a');
    let activeCard = null;

    const updateBar = (card) => {
      if (!card) return;
      const offer = card.querySelector('.offer-button');
      const title = card.querySelector('h3')?.textContent?.trim();
      if (!offer || !title) return;
      activeCard = card;
      barTitle.textContent = title;
      barLink.href = offer.href;
      barLink.setAttribute('aria-label', `Ver ${title} en Amazon`);
      barLink.dataset.productName = card.dataset.name || title;
    };

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.intersectionRatio));
      const best = [...visible.entries()]
        .filter(([, ratio]) => ratio >= 0.22)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      if (best) updateBar(best);
      const shouldShow = Boolean(best) && window.scrollY > 320 && window.innerWidth <= 760;
      bar.classList.toggle('is-visible', shouldShow);
    }, { threshold: [0, .22, .4, .6, .8] });

    cards.forEach((card) => observer.observe(card));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) bar.classList.remove('is-visible');
      else if (activeCard && window.scrollY > 320) bar.classList.add('is-visible');
    }, { passive: true });

    barLink.addEventListener('click', () => {
      // Mirror the existing affiliate click tracking for the sticky CTA.
      const sourceOffer = activeCard?.querySelector('.offer-button');
      if (sourceOffer) {
        try {
          const key = 'comprasmart-affiliate-clicks';
          const current = JSON.parse(localStorage.getItem(key) || '{}');
          const productKey = activeCard.dataset.name || activeCard.querySelector('h3')?.textContent || 'producto';
          current[productKey] = (current[productKey] || 0) + 1;
          localStorage.setItem(key, JSON.stringify(current));
        } catch (_) {}
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'affiliate_click', {
              product_name: activeCard.querySelector('h3')?.textContent?.trim() || '',
              product_key: activeCard.dataset.name || '',
              affiliate_url: barLink.href,
              merchant: 'Amazon España',
              click_placement: 'mobile_sticky'
            });
          }
        } catch (_) {}
      }
    }, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

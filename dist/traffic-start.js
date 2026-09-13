(() => {
  const run = () => {
    const smartia = document.querySelector('.product-card[data-name="smartia gafas inteligentes camara ia bluetooth"] .offer-button');
    if (smartia) smartia.href = 'https://amzn.to/4xUI5yH';

    const sendEvent = (name, params = {}) => {
      try {
        if (typeof window.gtag === 'function') window.gtag('event', name, params);
      } catch (_) {}
    };

    document.querySelectorAll('.product-card').forEach((card) => {
      const actions = card.querySelector('.product-actions');
      const title = card.querySelector('h3')?.textContent?.trim();
      const offer = card.querySelector('.offer-button');
      const productKey = card.dataset.name || title || 'producto';

      if (offer && !offer.dataset.trackingReady) {
        offer.dataset.trackingReady = '1';
        offer.addEventListener('click', () => {
          sendEvent('affiliate_click', {
            product_name: title || productKey,
            affiliate_url: offer.href,
            merchant: 'Amazon España'
          });
        });
      }

      if (!actions || !title || actions.querySelector('.share-product-button')) return;

      const share = document.createElement('button');
      share.type = 'button';
      share.className = 'guide-link share-product-button';
      share.textContent = 'Compartir producto ↗';
      share.style.cursor = 'pointer';

      share.addEventListener('click', async () => {
        const params = new URLSearchParams({
          utm_source: 'share',
          utm_medium: 'organic_social',
          utm_campaign: 'product_share',
          utm_content: productKey.replace(/\s+/g, '-').slice(0, 80)
        });
        const url = `${location.origin}${location.pathname}?${params.toString()}#productos`;
        const text = `${title} en CompraSmart IA`;
        sendEvent('share_product', { product_name: title, method: 'native_share' });
        try {
          if (navigator.share) {
            await navigator.share({ title, text, url });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${text} ${url}`);
            const old = share.textContent;
            share.textContent = 'Enlace copiado ✓';
            setTimeout(() => { share.textContent = old; }, 1800);
          }
        } catch (_) {}
      });

      actions.appendChild(share);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

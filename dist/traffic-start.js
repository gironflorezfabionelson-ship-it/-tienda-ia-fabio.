(() => {
  const run = () => {
    const smartia = document.querySelector('.product-card[data-name="smartia gafas inteligentes camara ia bluetooth"] .offer-button');
    if (smartia) smartia.href = 'https://amzn.to/4xUI5yH';

    window.dataLayer = window.dataLayer || [];

    const sendEvent = (name, params = {}) => {
      const payload = {
        ...params,
        page_path: location.pathname,
        page_title: document.title,
        event_timestamp_ms: Date.now()
      };

      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', name, payload);
          return;
        }
      } catch (_) {}

      try {
        window.dataLayer.push({ event: name, ...payload });
      } catch (_) {}
    };

    const saveLocalClick = (productKey) => {
      try {
        const key = 'comprasmart-affiliate-clicks';
        const current = JSON.parse(localStorage.getItem(key) || '{}');
        current[productKey] = (current[productKey] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(current));
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
          saveLocalClick(productKey);
          sendEvent('affiliate_click', {
            product_name: title || productKey,
            product_key: productKey,
            affiliate_url: offer.href,
            merchant: 'Amazon España',
            link_domain: (() => { try { return new URL(offer.href).hostname; } catch (_) { return ''; } })()
          });
        }, { capture: true });
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
        sendEvent('share_product', { product_name: title, product_key: productKey, method: 'native_share' });
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

    sendEvent('tracking_ready', { product_cards: document.querySelectorAll('.product-card').length });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

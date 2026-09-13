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
      try { window.dataLayer.push({ event: name, ...payload }); } catch (_) {}
    };

    const saveLocalClick = (productKey) => {
      try {
        const key = 'comprasmart-affiliate-clicks';
        const current = JSON.parse(localStorage.getItem(key) || '{}');
        current[productKey] = (current[productKey] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(current));
      } catch (_) {}
    };

    const trackAffiliate = (card, offer) => {
      const title = (card.querySelector('h3')?.textContent || card.dataset.name || 'Producto').trim();
      const productKey = card.dataset.name || title;
      saveLocalClick(productKey);
      sendEvent('affiliate_click', {
        product_name: title,
        product_key: productKey,
        affiliate_url: offer.href,
        merchant: 'Amazon España',
        link_domain: (() => { try { return new URL(offer.href).hostname; } catch (_) { return ''; } })()
      });
    };

    // Delegated tracking catches every current/future product card and avoids
    // missing dynamically inserted cards. The marker prevents duplicate sends.
    document.addEventListener('click', (event) => {
      const offer = event.target.closest?.('.offer-button');
      if (!offer) return;
      const card = offer.closest('.product-card');
      if (!card) return;
      const now = Date.now();
      if (Number(offer.dataset.lastAffiliateTrack || 0) + 750 > now) return;
      offer.dataset.lastAffiliateTrack = String(now);
      trackAffiliate(card, offer);
    }, true);

    document.querySelectorAll('.product-card').forEach((card) => {
      const actions = card.querySelector('.product-actions');
      const title = card.querySelector('h3')?.textContent?.trim();
      const productKey = card.dataset.name || title || 'producto';
      const offer = card.querySelector('.offer-button');
      if (offer) offer.dataset.trackingReady = 'delegated-v2';

      if (!actions || !title || actions.querySelector('.share-product-button')) return;
      const share = document.createElement('button');
      share.type = 'button';
      share.className = 'guide-link share-product-button';
      share.textContent = 'Compartir producto ↗';
      share.style.cursor = 'pointer';
      share.addEventListener('click', async () => {
        const params = new URLSearchParams({
          utm_source: 'share', utm_medium: 'organic_social', utm_campaign: 'product_share',
          utm_content: productKey.replace(/\s+/g, '-').slice(0, 80)
        });
        const url = `${location.origin}${location.pathname}?${params.toString()}#productos`;
        const text = `${title} en CompraSmart IA`;
        sendEvent('share_product', { product_name: title, product_key: productKey, method: 'native_share' });
        try {
          if (navigator.share) await navigator.share({ title, text, url });
          else if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${text} ${url}`);
            const old = share.textContent; share.textContent = 'Enlace copiado ✓';
            setTimeout(() => { share.textContent = old; }, 1800);
          }
        } catch (_) {}
      });
      actions.appendChild(share);
    });

    sendEvent('tracking_ready', { product_cards: document.querySelectorAll('.product-card').length, tracking_version: 'affiliate-v2' });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

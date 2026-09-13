(() => {
  const run = () => {
    // Mantener actualizado el enlace de afiliado SMARTIA.
    const smartia = document.querySelector('.product-card[data-name="smartia gafas inteligentes camara ia bluetooth"] .offer-button');
    if (smartia) smartia.href = 'https://amzn.to/4xUI5yH';

    // Añadir un botón de compartir a cada producto para facilitar tráfico orgánico.
    document.querySelectorAll('.product-card').forEach((card) => {
      const actions = card.querySelector('.product-actions');
      const title = card.querySelector('h3')?.textContent?.trim();
      if (!actions || !title || actions.querySelector('.share-product-button')) return;

      const share = document.createElement('button');
      share.type = 'button';
      share.className = 'guide-link share-product-button';
      share.textContent = 'Compartir producto ↗';
      share.style.cursor = 'pointer';

      share.addEventListener('click', async () => {
        const url = `${location.origin}${location.pathname}#productos`;
        const text = `${title} en CompraSmart IA`;
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
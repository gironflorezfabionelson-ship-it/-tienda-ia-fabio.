(() => {
  const images = [
    ['smartia gafas inteligentes camara ia bluetooth', 'assets/products/smartia-amazon.jpg', 'SMARTIA Gafas Inteligentes con Cámara e IA'],
    ['tp link tapo p110m enchufe inteligente matter energia', 'assets/products/tapo-p110m-amazon.jpg', 'TP-Link Tapo P110M Enchufe Inteligente Matter'],
    ['renpho elis 1 bascula inteligente composicion corporal', 'assets/products/renpho-elis1-amazon.jpg', 'RENPHO Elis 1 Báscula Inteligente'],
    ['logitech pebble mouse 2 m350s raton bluetooth silencioso', 'assets/products/logitech-m350s.png', 'Logitech Pebble Mouse 2 M350s']
  ];

  images.forEach(([name, src, alt]) => {
    const card = document.querySelector(`.product-card[data-name="${name}"]`);
    const art = card?.querySelector('.product-art');
    if (!art) return;
    art.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:18px;background:#fff;overflow:hidden;';
    art.innerHTML = `<img src="${src}?v=20260913-2" alt="${alt}" loading="eager" style="width:auto;height:auto;max-width:82%;max-height:82%;object-fit:contain;display:block;margin:auto">`;
    art.removeAttribute('aria-hidden');
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', alt);
  });
})();

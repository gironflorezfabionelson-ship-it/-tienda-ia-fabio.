(() => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  loadScript('app-core.js?v=5')
    .then(() => loadScript('traffic-start.js?v=2'))
    .catch((err) => console.error('CompraSmart script load error', err));
})();

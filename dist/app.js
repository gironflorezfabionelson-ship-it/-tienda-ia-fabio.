const markets = {
  es: { label: 'España', currency: 'EUR', stores: ['Amazon ES', 'AliExpress', 'eBay'] },
  co: { label: 'Colombia', currency: 'COP', stores: ['Mercado Libre', 'Amazon Global', 'AliExpress'] },
  global: { label: 'Global', currency: 'USD', stores: ['Amazon', 'AliExpress', 'eBay'] }
};

const countrySelect = document.querySelector('#countrySelect');
const marketButton = document.querySelector('#marketButton');
const cards = [...document.querySelectorAll('.product-card')];
const categoryButtons = [...document.querySelectorAll('.category')];
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
let activeCategory = 'all';

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* El sitio sigue funcionando aunque el navegador bloquee almacenamiento. */ }
}

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

function setMarket(code) {
  const resolvedCode = markets[code] ? code : 'global';
  const market = markets[resolvedCode];
  safeStorageSet('comprasmart-market', resolvedCode);
  if (marketButton) marketButton.textContent = `Mercado actual: ${market.label}`;
}

function filterProducts() {
  if (!searchInput || !emptyState) return;
  const query = normalizeText(searchInput.value);
  let visible = 0;

  cards.forEach(card => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const searchableText = `${card.dataset.name || ''} ${card.textContent || ''}`;
    const searchMatch = !query || normalizeText(searchableText).includes(query);
    card.hidden = !(categoryMatch && searchMatch);
    if (!card.hidden) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category || 'all';
  categoryButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  filterProducts();
}));

categoryButtons.forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});

if (searchInput) searchInput.addEventListener('input', filterProducts);
if (countrySelect) countrySelect.addEventListener('change', event => setMarket(event.target.value));
if (marketButton && countrySelect) marketButton.addEventListener('click', () => countrySelect.focus());

const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');

function closeMobileMenu() {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      menuButton.focus();
    }
  });
}

const savedMarket = safeStorageGet('comprasmart-market');
if (countrySelect) {
  if (savedMarket && markets[savedMarket]) countrySelect.value = savedMarket;
  setMarket(countrySelect.value);
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const visualClasses = ['charger','powerbank','headphones','dock','glasses','robot','watch','backpack','projector','coffee'];
cards.forEach((card,index) => {
  const art = card.querySelector('.product-art');
  if (!art || !visualClasses[index]) return;
  art.innerHTML = `<div class="product-visual"><div class="${visualClasses[index]}"></div></div><span class="visual-note">Imagen ilustrativa</span>`;
  art.removeAttribute('aria-hidden');
  art.setAttribute('role','img');
  art.setAttribute('aria-label', `Representación ilustrativa de ${card.querySelector('h3')?.textContent || 'producto'}`);
});

const verifiedRatings = [
  {rating:'4,7',reviews:'14.382'},
  {rating:'4,5',reviews:'15.747'},
  {rating:'4,6',reviews:'45.447'},
  {rating:'4,4',reviews:'2.349'},
  {rating:'3,6',reviews:'120'},
  {rating:'4,4',reviews:'389'},
  {rating:'4,2',reviews:'1.478'},
  {rating:'4,6',reviews:'9.934'},
  {rating:'3,9',reviews:'140'},
  {newOnAmazon:true}
];

cards.forEach((card,index) => {
  const info = verifiedRatings[index];
  const title = card.querySelector('h3');
  if (!info || !title || card.querySelector('.verified-rating')) return;

  const rating = document.createElement('div');
  rating.className = 'verified-rating';
  rating.style.cssText = 'display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:8px 0 10px;font-size:14px;font-weight:700;color:#172033';
  rating.innerHTML = info.newOnAmazon
    ? '<span style="display:inline-flex;padding:5px 9px;border-radius:999px;background:#f2f4f7;color:#344054">Nuevo en Amazon</span>'
    : `<span aria-label="${info.rating} de 5 estrellas" style="color:#f59e0b;letter-spacing:1px">★</span><span>${info.rating} de 5</span><span style="font-weight:600;color:#667085">(${info.reviews} valoraciones)</span>`;
  title.insertAdjacentElement('afterend', rating);
});

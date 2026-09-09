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
const toast = document.querySelector('#toast');
let activeCategory = 'all';
let toastTimer;

function setMarket(code) {
  const market = markets[code] || markets.global;
  localStorage.setItem('comprasmart-market', code);
  marketButton.textContent = `Mercado actual: ${market.label}`;
  document.querySelectorAll('.merchant').forEach((node, index) => {
    node.textContent = market.stores[index % market.stores.length];
  });
}

function filterProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  let visible = 0;
  cards.forEach(card => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const searchMatch = !query || card.dataset.name.includes(query) || card.textContent.toLocaleLowerCase('es').includes(query);
    card.hidden = !(categoryMatch && searchMatch);
    if (!card.hidden) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(item => item.classList.toggle('active', item === button));
  filterProducts();
}));

searchInput.addEventListener('input', filterProducts);
countrySelect.addEventListener('change', event => setMarket(event.target.value));
marketButton.addEventListener('click', () => countrySelect.focus());

document.querySelectorAll('.offer-button').forEach(button => button.addEventListener('click', () => {
  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.querySelector('span').textContent = `${button.dataset.product}: añadiremos aquí tu enlace de afiliado para ${markets[countrySelect.value].label}.`;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5200);
}));

const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}));

const savedMarket = localStorage.getItem('comprasmart-market');
if (savedMarket && markets[savedMarket]) countrySelect.value = savedMarket;
setMarket(countrySelect.value);
document.querySelector('#year').textContent = new Date().getFullYear();

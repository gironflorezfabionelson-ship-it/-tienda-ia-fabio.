const markets = {
  es: { label: 'España', currency: 'EUR', available: true },
  co: { label: 'Colombia', currency: 'COP', available: false },
  global: { label: 'Global', currency: 'USD', available: false }
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
  try { localStorage.setItem(key, value); } catch {}
}
function normalizeText(value = '') {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function setMarket(code) {
  const requested = markets[code];
  const market = requested?.available ? requested : markets.es;
  const selectedCode = requested?.available ? code : 'es';
  safeStorageSet('comprasmart-market', selectedCode);
  if (countrySelect && countrySelect.value !== selectedCode) countrySelect.value = selectedCode;
  if (marketButton) marketButton.textContent = `Mercado actual: ${market.label}`;
}
function filterProducts() {
  if (!searchInput || !emptyState) return;
  const query = normalizeText(searchInput.value.trim());
  let visible = 0;
  cards.forEach(card => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const searchable = normalizeText(`${card.dataset.name || ''} ${card.textContent || ''}`);
    const searchMatch = !query || searchable.includes(query);
    card.hidden = !(categoryMatch && searchMatch);
    if (!card.hidden) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(item => {
    const isActive = item === button;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  filterProducts();
}));
categoryButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === 0)));

if (searchInput) searchInput.addEventListener('input', filterProducts);
if (countrySelect) countrySelect.addEventListener('change', event => setMarket(event.target.value));
if (marketButton && countrySelect) marketButton.addEventListener('click', () => countrySelect.focus());

const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
    menuButton.textContent = isOpen ? 'Menú' : 'Cerrar';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menú';
  }));
}

const savedMarket = safeStorageGet('comprasmart-market');
if (countrySelect) {
  const initialMarket = savedMarket && markets[savedMarket]?.available ? savedMarket : 'es';
  countrySelect.value = initialMarket;
  setMarket(initialMarket);
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const visualClasses = ['charger','powerbank','headphones','dock','glasses','robot','watch','backpack','projector','coffee'];
cards.forEach((card,index)=>{
  const art=card.querySelector('.product-art');
  if(!art||!visualClasses[index]) return;
  art.innerHTML=`<div class="product-visual"><div class="${visualClasses[index]}"></div></div><span class="visual-note">Imagen ilustrativa</span>`;
  art.removeAttribute('aria-hidden');
  art.setAttribute('role','img');
  art.setAttribute('aria-label',`Representación ilustrativa de ${card.querySelector('h3')?.textContent||'producto'}`);
});

const verifiedRatings=[
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

cards.forEach((card,index)=>{
  const info=verifiedRatings[index], title=card.querySelector('h3');
  if(!info||!title||card.querySelector('.verified-rating')) return;
  const rating=document.createElement('div');
  rating.className='verified-rating';
  rating.style.cssText='display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:8px 0 10px;font-size:14px;font-weight:700;color:#172033';
  rating.innerHTML=info.newOnAmazon
    ? '<span style="display:inline-flex;padding:5px 9px;border-radius:999px;background:#f2f4f7;color:#344054">Nuevo en Amazon</span>'
    : `<span aria-label="${info.rating} de 5 estrellas" style="color:#f59e0b;letter-spacing:1px">★</span><span>${info.rating} de 5</span><span style="font-weight:600;color:#667085">(${info.reviews} valoraciones)</span>`;
  title.insertAdjacentElement('afterend',rating);
});

const decisionProfiles = [
  {ideal:'Quien carga móvil, tablet o portátil con un solo cargador.',strong:'65W y tres puertos en un formato compacto.',check:'Confirma la potencia que recibe cada dispositivo y el reparto entre puertos.'},
  {ideal:'Viajes, jornadas largas y personas que usan varios dispositivos.',strong:'20.000mAh, hasta 45W y cables USB-C integrados.',check:'Revisa peso, tamaño y compatibilidad con la carga rápida de tus equipos.'},
  {ideal:'Música, llamadas y uso diario sin buscar un modelo pesado.',strong:'Diseño ligero y hasta 50 horas de autonomía anunciada.',check:'Valora si prefieres formato supraaural y si necesitas cancelación de ruido.'},
  {ideal:'Usuarios con varios dispositivos Apple que quieren ordenar el escritorio.',strong:'Carga tres dispositivos y se puede plegar para transportar.',check:'Comprueba compatibilidad exacta con tu iPhone, Apple Watch, AirPods y funda.'},
  {ideal:'Quien quiere explorar cámara, audio y funciones de IA en unas gafas.',strong:'Combina cámara, manos libres y funciones inteligentes en una montura.',check:'Revisa autonomía, aplicación necesaria y privacidad antes de grabar o usar IA.'},
  {ideal:'Hogares que quieren reducir parte de la limpieza manual diaria.',strong:'Base todo en uno para automatizar más tareas de mantenimiento.',check:'Compara navegación, fregado, consumibles y espacio necesario para la base.'},
  {ideal:'Notificaciones, llamadas y seguimiento general de actividad desde la muñeca.',strong:'Llamadas Bluetooth, pantalla de 1,85 pulgadas y varios sensores.',check:'Las funciones de bienestar no sustituyen equipos médicos; revisa además compatibilidad y autonomía.'},
  {ideal:'Trabajo, estudio y viajes con portátil de hasta 15,6 pulgadas.',strong:'Compartimento para portátil, diseño antirrobo, material impermeable y puerto USB.',check:'Comprueba medidas reales del portátil, capacidad y comodidad para el peso que llevarás.'},
  {ideal:'Películas y entretenimiento en dormitorios o espacios donde puedas controlar la luz.',strong:'Formato portátil con Android 11, WiFi 6, Bluetooth y giro de 180°.',check:'Prioriza resolución nativa, brillo real y distancia de proyección, no solo la etiqueta “4K”.'},
  {ideal:'Viajes, oficina o camping cuando quieres preparar café fuera de casa.',strong:'Formato portátil compatible con cápsulas y café molido.',check:'Confirma si calienta el agua por sí sola, la alimentación y la limpieza necesaria.'}
];

const decisionStyle = document.createElement('style');
decisionStyle.textContent = `
  .decision-points{display:grid;gap:8px;margin:14px 0 8px;padding:13px 14px;border:1px solid #e5eaf1;border-radius:14px;background:#fbfcfe}
  .decision-row{display:grid;grid-template-columns:92px 1fr;gap:8px;align-items:start;font-size:.84rem;line-height:1.45}
  .decision-row strong{color:#172033;font-size:.76rem;text-transform:uppercase;letter-spacing:.035em}
  .decision-row span{color:#556274}
  .decision-row.caution{padding-top:8px;border-top:1px dashed #d9e0ea}
  .product-card:hover .decision-points{border-color:#cfd9e7}
  .editorial-order-note{margin:0 0 18px;padding:11px 14px;border-left:4px solid #315efb;border-radius:10px;background:#f5f8ff;color:#475467;font-size:.86rem;line-height:1.45}
  .editorial-order-note strong{color:#172033}
  .trust-pick{position:absolute;left:14px;top:14px;z-index:3;display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#fff;color:#174ea6;border:1px solid #d7e5ff;box-shadow:0 6px 16px rgba(35,74,120,.12);font-size:.68rem;font-weight:900;letter-spacing:.035em}
  @media(max-width:620px){
    .categories{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important;overflow:visible!important;padding:2px 0 10px!important}
    .category{min-width:0!important;padding:9px 2px!important;border-radius:12px!important;gap:4px!important;font-size:.62rem!important;line-height:1.05!important}
    .category span{width:30px!important;height:30px!important;border-radius:9px!important;font-size:.9rem!important}
    .product-trust{grid-template-columns:1fr!important;gap:8px!important;padding:13px 14px!important;margin-bottom:12px!important;border-radius:16px!important}
    .product-trust div{gap:8px!important}
    .product-trust .trust-icon{width:24px!important;height:24px!important;font-size:.78rem!important}
    .product-trust span{font-size:.78rem!important;line-height:1.35!important}
    .product-trust strong{font-size:.86rem!important;margin-bottom:1px!important}
    .editorial-order-note{margin-bottom:12px!important;padding:8px 10px!important;font-size:.74rem!important;line-height:1.32!important}
    .product-art{height:185px}
    .featured-card .product-art{padding-top:18px}
    .featured-card .product-visual{transform:scale(.88) translateY(10px)!important}
    .product-body{padding:19px}
    .product-body h3{font-size:1.2rem;margin-top:8px}
    .product-body>p:not(.affiliate-note){min-height:0;margin-bottom:12px}
    .verified-rating{margin:5px 0 8px!important;font-size:13px!important}
    .product-meta{padding-top:11px;align-items:center}
    .product-meta strong{font-size:.8rem}
    .product-actions{gap:8px;margin-top:10px}
    .offer-button{min-height:52px;margin-top:0;padding:13px 14px;font-size:.95rem;border-radius:13px;box-shadow:0 10px 22px rgba(8,103,242,.2)}
    .guide-link{min-height:42px;padding:9px 12px;font-size:.88rem}
    .decision-points{gap:5px;margin:9px 0 5px;padding:9px 10px;border-radius:12px}
    .decision-row{grid-template-columns:96px 1fr;gap:7px;font-size:.75rem;line-height:1.3}
    .decision-row strong{font-size:.62rem;line-height:1.2;padding-top:2px;white-space:nowrap}
    .decision-row.caution{padding-top:6px}
    .affiliate-note{margin-top:6px!important;font-size:.73rem!important}
    .trust-pick{top:11px;left:11px;font-size:.6rem;padding:5px 8px}
  }
`;
document.head.appendChild(decisionStyle);

cards.forEach((card,index)=>{
  const profile = decisionProfiles[index];
  const body = card.querySelector('.product-body');
  const actions = body?.querySelector('.product-actions');
  if(!profile || !body || !actions || body.querySelector('.decision-points')) return;
  const box = document.createElement('div');
  box.className = 'decision-points';
  box.innerHTML = `
    <div class="decision-row"><strong>Ideal para</strong><span>${profile.ideal}</span></div>
    <div class="decision-row"><strong>Punto fuerte</strong><span>${profile.strong}</span></div>
    <div class="decision-row caution"><strong>Revisa antes</strong><span>${profile.check}</span></div>`;
  actions.insertAdjacentElement('afterend', box);
});

const preferredProductOrder = [
  'sony wh ch520 auriculares bluetooth',
  'anker nano ii cargador usb c 65w',
  'wenig mochila antirrobo impermeable portatil 15.6 usb viaje trabajo',
  'anker zolo power bank 20000mah 45w',
  'robot aspirador roborock qrevo s pro hogar limpieza',
  'cargador inalambrico 3 en 1 iphone airpods apple watch',
  'kibfle reloj inteligente mujer hombre smartwatch bluetooth voz llamadas salud deporte',
  'reiie proyector mini 4k 1080p full hd android 11 wifi 6 bluetooth',
  'smartia gafas inteligentes camara ia bluetooth',
  'maehihw cafetera portatil capsulas multicapsulas cafe molido viajes oficina camping'
];

const productGrid = document.querySelector('#productGrid');
if (productGrid) {
  const cardByName = new Map(cards.map(card => [card.dataset.name, card]));
  preferredProductOrder.forEach(name => {
    const card = cardByName.get(name);
    if (card) productGrid.appendChild(card);
  });

  const topPicks = preferredProductOrder.slice(0, 4);
  topPicks.forEach(name => {
    const card = cardByName.get(name);
    if (!card) return;
    card.classList.add('featured-card');
    if (card.querySelector('.trust-pick')) return;
    const badge = document.createElement('span');
    badge.className = 'trust-pick';
    badge.textContent = 'SELECCIÓN DESTACADA';
    card.appendChild(badge);
  });

  const trustPanel = document.querySelector('.product-trust');
  if (trustPanel && !document.querySelector('.editorial-order-note')) {
    const note = document.createElement('p');
    note.className = 'editorial-order-note';
    note.innerHTML = '<strong>¿Por qué ves estos primero?</strong> Priorizamos valoración, opiniones y utilidad práctica. El orden es editorial.';
    trustPanel.insertAdjacentElement('afterend', note);
  }
}

// Preview mode for My Farm Grow.
// The site runs without the FastAPI backend: products come from the list below,
// and ordering, login, cart and admin features are switched off.
// To change a product, price or image, edit PREVIEW_PRODUCTS.

const PREVIEW_PRODUCTS = [
  {
    id: 1, name: "Regular Rice", category: "Rice", image: "images/regular-rice.jpg",
    description: "Everyday white rice for daily meals.",
    sizes: [{label: "25 kg", price: 1500}, {label: "50 kg", price: 2950}]
  },
  {
    id: 2, name: "Sona Masuri Rice", category: "Rice", image: "images/sona-masoori-rice.jpg",
    description: "Light, aromatic medium-grain rice from Andhra fields.",
    sizes: [{label: "25 kg", price: 2000}, {label: "50 kg", price: 3950}]
  },
  {
    id: 3, name: "Brown Rice", category: "Rice", image: "images/brown-rice.jpg",
    description: "Whole-grain rice with the bran kept on.",
    sizes: [{label: "25 kg", price: 2500}, {label: "50 kg", price: 4900}]
  },
  {id: 4, name: "Toor Dal", category: "Pulses", unit: "kg", price: 150, image: "images/toor-dal.jpg", description: "Cleaned and unpolished toor dal"},
  {id: 5, name: "Whole Green Gram", category: "Pulses", unit: "kg", price: 110, image: "images/whole-green-gram.jpg", description: "Cleaned whole green gram"},
  {id: 6, name: "Red Chilli Powder", category: "Spices", unit: "kg", price: 220, image: "images/red-chilli-powder.jpg", description: "Ground red chilli powder"},
  {id: 7, name: "Pure Ghee", category: "Ghee", unit: "kg", price: 700, image: "images/ghee.jpg", description: "Golden ghee for everyday cooking"},
  {id: 8, name: "Natural Jaggery", category: "Sweeteners", unit: "kg", price: 80, image: "images/jaggery.jpg", description: "Traditional cane jaggery"},
];

const PREVIEW_MESSAGE = "Online ordering is launching soon. Contact us for bulk enquiries.";
const PREVIEW_VIEWS = new Set(["home", "products", "about", "contact"]);
const chosenSize = {}; // product id -> index into sizes

// No backend, no saved login.
token = "";
currentUser = null;
try { localStorage.removeItem("mfg_access_token"); } catch {}
api = async () => { throw new Error("Not available in the preview."); };
loadMe = async () => {};
openAccount = () => notify(PREVIEW_MESSAGE);
addToCart = () => notify(PREVIEW_MESSAGE);
stepCartLine = () => notify(PREVIEW_MESSAGE);
loadCart = () => {};
updateCartBadge = () => {};

const _fullNavigate = window.navigate;
window.navigate = function (view) {
  if (!PREVIEW_VIEWS.has(view)) { notify(PREVIEW_MESSAGE); return; }
  _fullNavigate(view);
};

getProductImage = p => p.image || "";

function sizeIndex(p) { return chosenSize[p.id] || 0; }
function priceOf(p) { return p.sizes ? p.sizes[sizeIndex(p)].price : p.price; }
function unitOf(p) { return p.sizes ? p.sizes[sizeIndex(p)].label + " bag" : p.unit; }
function priceHtml(p) { return `${money(priceOf(p))} <small>/ ${esc(unitOf(p))}</small>`; }
function sizePills(p) {
  if (!p.sizes) return "";
  return `<div class="size-pills" role="group" aria-label="Bag size for ${esc(p.name)}">${p.sizes.map((s, i) =>
    `<button type="button" aria-pressed="${i === sizeIndex(p)}" onclick="chooseSize(${p.id},${i})">${esc(s.label)}</button>`
  ).join("")}</div>`;
}
const soonPill = '<span class="soon-pill">Ordering soon</span>';

// Switches bag size everywhere the product is shown, without re-rendering the cards.
function chooseSize(id, index) {
  chosenSize[id] = index;
  const p = PREVIEW_PRODUCTS.find(x => x.id === id);
  document.querySelectorAll(`[data-price-for="${id}"]`).forEach(el => { el.innerHTML = priceHtml(p); });
  document.querySelectorAll(`[aria-label="Bag size for ${CSS.escape(p.name)}"] button`).forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
}

loadCatalog = async function () {
  catalog = PREVIEW_PRODUCTS;
  const categories = [...new Set(catalog.map(p => p.category))].sort();
  document.getElementById("home-categories").innerHTML = categories.map(c => {
    const count = catalog.filter(p => p.category === c).length;
    return `<button class="cat-tile card-fx w-[calc(50%-.5rem)] sm:w-[calc(33.333%-.7rem)] lg:w-[calc(20%-.8rem)]" style="${categoryVars(c)}" data-category="${esc(c)}" onclick="filterCategory(this.dataset.category)"><span class="cat-tile-icon"><i data-lucide="${categoryStyle(c).icon}"></i></span><span class="cat-tile-name">${esc(c)}</span><span class="cat-tile-count">${count} ${count === 1 ? "product" : "products"}</span></button>`;
  }).join("");
  document.getElementById("category-filter-list").innerHTML = ["All", ...categories].map(c => {
    const active = c === selectedCategory;
    return `<li><button onclick="filterCategory(this.dataset.category)" data-category="${esc(c)}" class="cat-btn w-full text-left px-3 py-2 rounded-lg ${active ? "bg-brand-50 text-brand-700 font-semibold" : "hover:bg-stone-50 text-stone-600"}">${c === "All" ? "All Products" : esc(c)}</button></li>`;
  }).join("");
  document.querySelectorAll("[data-promo]").forEach(el => el.classList.toggle("hidden", !categories.includes(el.dataset.promo)));
  document.getElementById("home-tabs").innerHTML = ["All", ...categories].map(c =>
    `<button class="tab-pill" role="tab" data-tab="${esc(c)}" onclick="setHomeTab(this.dataset.tab)">${c === "All" ? "" : `<i style="--dot:${categoryStyle(c).bg}"></i>`}${esc(c)}</button>`
  ).join("");
  renderFeatured();
  if (window.lucide) lucide.createIcons();
};

renderHeroChips = function () {
  const picks = [];
  for (const p of catalog) {
    if (!picks.some(x => x.category === p.category)) picks.push(p);
    if (picks.length === 2) break;
  }
  const visual = document.getElementById("hero-visual");
  visual.querySelectorAll(".hero-chip").forEach(chip => chip.remove());
  visual.insertAdjacentHTML("beforeend", picks.map(p =>
    `<button class="hero-chip" data-category="${esc(p.category)}" onclick="filterCategory(this.dataset.category)"><img src="${esc(p.image)}" alt=""><span><b>${esc(p.name)}</b><span>From ${money(priceOf(p))} / ${esc(unitOf(p))}</span></span></button>`
  ).join(""));
};

renderFeatured = function () {
  const grid = document.getElementById("home-featured");
  document.querySelectorAll("#home-tabs .tab-pill").forEach(tab => tab.setAttribute("aria-selected", String(tab.dataset.tab === homeTab)));
  const items = catalog.filter(p => homeTab === "All" || p.category === homeTab).slice(0, 8);
  grid.innerHTML = items.map((p, i) => `<article class="feature-card fade-up" style="animation-delay:${i * 40}ms">
      <div class="feature-card-media" style="${categoryVars(p.category)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.classList.add('hidden')"></div>
      <h3>${esc(p.name)}</h3>
      ${sizePills(p)}
      <div class="feature-foot"><span class="feature-price" data-price-for="${p.id}">${priceHtml(p)}</span>${soonPill}</div>
    </article>`).join("");
  renderHeroChips();
};

renderProducts = async function () {
  const grid = document.getElementById("product-grid");
  const query = (document.getElementById("search-input")?.value || "").trim().toLowerCase();
  products = PREVIEW_PRODUCTS.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (!query || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query)));
  if (!products.length) { grid.innerHTML = '<div class="col-span-full py-12 text-center text-stone-500">No products found. Try another search or category.</div>'; return; }
  grid.innerHTML = products.map((p, i) => `<article class="product-card card-fx fade-up" style="animation-delay:${Math.min(i, 11) * 50}ms">
      <div class="product-card-media" style="${categoryVars(p.category)}">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.classList.add('hidden')">
        <span class="product-badge">${esc(p.category)}</span>
      </div>
      <div class="flex-1 pt-3 px-1">
        <h3 class="text-base font-bold text-stone-800">${esc(p.name)}</h3>
        <p class="text-xs text-stone-500 mt-1">${esc(p.description)}</p>
        ${p.sizes ? `<p class="text-[11px] text-stone-500 mt-3 mb-1 font-semibold uppercase tracking-wide">Bag size</p>${sizePills(p)}` : `<div class="mt-2 flex flex-wrap gap-2 text-xs"><span class="bg-stone-100 px-2 py-1 rounded">${esc(p.unit)}</span></div>`}
      </div>
      <div class="mt-3 px-1 pb-1 flex items-center justify-between gap-3">
        <div><p class="text-[11px] text-stone-500">Price</p><p class="feature-price text-lg" data-price-for="${p.id}">${priceHtml(p)}</p></div>
        <div class="w-36">${soonPill}</div>
      </div></article>`).join("");
};

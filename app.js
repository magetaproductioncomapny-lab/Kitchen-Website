const WHATSAPP_PHONE = "919779912753";
const CURRENCY = "ZAR";

const menuItems = [
  { id: 1, name: "Pasta & Wings", category: "Meals", price: 80, description: "Creamy pasta served with seasoned home-style chicken wings.", image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Cheesy Bake", category: "Meals", price: 80, description: "A rich, cheesy baked meal prepared fresh for the family table.", image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Steamed Bread / Dombolo", category: "Meals", price: 40, description: "Soft steamed bread, served on its own as a hearty side.", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Chicken Wrap", category: "Meals", price: 40, description: "Tender chicken and fresh salad wrapped for an easy meal on the go.", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Fish + Mash + Spinach", category: "Plates", price: 80, description: "Crispy fish with creamy mash and homestyle spinach.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Grill + Salad", category: "Plates", price: 80, description: "Juicy grilled meat with a fresh, crunchy salad.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85" },
  { id: 7, name: "Meatballs & Mash Potatoes", category: "Plates", price: 80, description: "Comforting meatballs and smooth mashed potatoes with gravy.", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=85" },
  { id: 8, name: "Pap & Meat Stew", category: "Plates", price: 80, description: "Traditional pap with tender meat stew and vegetables.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85" },
  { id: 9, name: "Cooldrink", category: "Drinks", price: 15, description: "A chilled soft drink to enjoy with your meal.", options: ["Coke", "Fanta", "Sprite"], image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=85" },
  { id: 10, name: "Bottled Water", category: "Drinks", price: 12, description: "Cold bottled water.", image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=800&q=85" },
  { id: 11, name: "Juice", category: "Drinks", price: 20, description: "A refreshing fruit juice.", options: ["Mango", "Orange", "Apple", "Tropical"], image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=85" }
];

let cart = [];
let activeCategory = "All";

const money = (value) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: CURRENCY }).format(value);
const getItem = (id) => menuItems.find((item) => item.id === id);

function renderFilters() {
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  document.querySelector("#filters").innerHTML = categories.map((category) => `<button class="filter ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>`).join("");
}

function renderMenu() {
  const visibleItems = activeCategory === "All" ? menuItems : menuItems.filter((item) => item.category === activeCategory);
  document.querySelector("#menu-grid").innerHTML = visibleItems.map((item) => `
    <article class="food-card">
      <div class="food-image" role="img" aria-label="${item.name}" style="background-image:url('${item.image}')"></div>
      <div class="food-info"><div class="food-top"><div><h3>${item.name}</h3><span class="price">${money(item.price)}</span></div></div>
      <p>${item.description}</p><div class="card-actions"><button class="details-link" type="button" data-details="${item.id}">View dish</button><button class="add-button" type="button" data-add="${item.id}">+ Add</button></div></div>
    </article>`).join("");
}

function addToCart(id, quantity = 1, option = "") {
  const existing = cart.find((line) => line.id === id && line.option === option);
  if (existing) existing.quantity += quantity;
  else cart.push({ id, quantity, option });
  renderCartCount();
}

function updateQuantity(id, change, option = "") {
  const line = cart.find((item) => item.id === id && item.option === option);
  if (!line) return;
  line.quantity += change;
  if (line.quantity <= 0) cart = cart.filter((item) => !(item.id === id && item.option === option));
  renderCartCount();
  renderCart();
}

function renderCartCount() {
  document.querySelector("#basket-count").textContent = cart.reduce((sum, line) => sum + line.quantity, 0);
}

function cartTotal() {
  return cart.reduce((sum, line) => sum + getItem(line.id).price * line.quantity, 0);
}

function renderCart() {
  const target = document.querySelector("#cart-content");
  if (!cart.length) { target.innerHTML = `<p class="panel-intro">Your basket is waiting for something delicious.</p><a class="primary" href="#menu" data-close="cart-overlay">Browse the menu</a>`; return; }
  target.innerHTML = `<div>${cart.map((line) => { const item = getItem(line.id); const displayName = line.option ? `${item.name} - ${line.option}` : item.name; return `<div class="cart-line"><div class="line-details"><div class="line-name">${displayName}</div><div class="line-price">${money(item.price)} each · ${money(item.price * line.quantity)}</div></div><div class="quantity"><button type="button" data-minus="${item.id}" data-option="${line.option}" aria-label="Decrease ${displayName}">−</button><span>${line.quantity}</span><button type="button" data-plus="${item.id}" data-option="${line.option}" aria-label="Increase ${displayName}">+</button></div><button class="remove" type="button" data-remove="${item.id}" data-option="${line.option}">Remove</button></div>`; }).join("")}</div>
    <div class="cart-total"><span>Grand total</span><span>${money(cartTotal())}</span></div>
    <p class="redirect-message">💚 Almost there! When you are ready, we will redirect you to WhatsApp. Thank you for using our website.</p>
    <form id="order-form"><label for="customer-name">Your name</label><input id="customer-name" name="name" required autocomplete="name" placeholder="e.g. Alex Morgan"><label for="customer-address">Delivery address</label><textarea id="customer-address" name="address" required autocomplete="street-address" placeholder="House number, street, area"></textarea><label for="customer-notes">Note for the kitchen <span>(optional)</span></label><input id="customer-notes" name="notes" placeholder="e.g. No coriander"><label class="terms-check"><input type="checkbox" name="terms" required> I agree to the <a href="#terms">terms and conditions</a> for placing this WhatsApp order.</label><button class="primary whatsapp" type="submit">☏ Place order via WhatsApp</button><p class="helper">WhatsApp will open with your order pre-filled. You will send it to the restaurant.</p></form>`;
}

function formatOrderMessage({ name, address, notes }) {
  const lines = cart.map((line) => { const item = getItem(line.id); const displayName = line.option ? `${item.name} - ${line.option}` : item.name; return `🍽️ ${displayName} × ${line.quantity} — ${money(item.price * line.quantity)}`; });
  return ["*NEW ORDER — MORODIPHOLOSO ENTERPRISE*", "", ...lines, "", `💰 *TOTAL: ${money(cartTotal())}*`, "", "📍 *DELIVERY DETAILS*", `Name: ${name}`, `Address: ${address}`, notes ? `Note: ${notes}` : ""].filter(Boolean).join("\n");
}

function submitOrder(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const message = formatOrderMessage({ name: form.get("name").trim(), address: form.get("address").trim(), notes: form.get("notes").trim() });
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

function openOverlay(id) { document.querySelector(`#${id}`).classList.add("open"); }
function closeOverlay(id) { document.querySelector(`#${id}`).classList.remove("open"); }

function openItemDetails(item) {
  const optionPicker = item.options ? `<label for="item-option">Choose flavour</label><select id="item-option">${item.options.map((option) => `<option value="${option}">${option}</option>`).join("")}</select>` : "";
  document.querySelector("#detail-content").innerHTML = `<div class="detail-photo" role="img" aria-label="${item.name}" style="background-image:url('${item.image}')"></div><h2 id="detail-title">${item.name}</h2><p class="detail-price">${money(item.price)}</p><p class="panel-intro">${item.description}</p>${optionPicker}<button class="primary detail-add" type="button" data-detail-add="${item.id}">Add to basket</button>`;
  openOverlay("detail-overlay");
}

function showAddedNotice(itemName, option = "") {
  const notice = document.querySelector("#added-notice");
  notice.querySelector(".notice-title").textContent = `${itemName}${option ? ` - ${option}` : ""} added to your basket`;
  notice.classList.add("show");
  window.clearTimeout(showAddedNotice.timeout);
  showAddedNotice.timeout = window.setTimeout(closeAddedNotice, 7000);
}

function closeAddedNotice() {
  document.querySelector("#added-notice").classList.remove("show");
}

document.addEventListener("click", (event) => {
  const category = event.target.closest("[data-category]");
  if (category) { activeCategory = category.dataset.category; renderFilters(); renderMenu(); }
  const add = event.target.closest("[data-add]");
  if (add) { const item = getItem(Number(add.dataset.add)); if (item.options) { openItemDetails(item); } else { addToCart(item.id); showAddedNotice(item.name); } }
  const details = event.target.closest("[data-details]");
  if (details) openItemDetails(getItem(Number(details.dataset.details)));
  const detailAdd = event.target.closest("[data-detail-add]");
  if (detailAdd) { const item = getItem(Number(detailAdd.dataset.detailAdd)); const option = document.querySelector("#item-option")?.value || ""; addToCart(item.id, 1, option); closeOverlay("detail-overlay"); showAddedNotice(item.name, option); }
  const plus = event.target.closest("[data-plus]");
  if (plus) updateQuantity(Number(plus.dataset.plus), 1, plus.dataset.option);
  const minus = event.target.closest("[data-minus]");
  if (minus) updateQuantity(Number(minus.dataset.minus), -1, minus.dataset.option);
  const remove = event.target.closest("[data-remove]");
  if (remove) { cart = cart.filter((line) => !(line.id === Number(remove.dataset.remove) && line.option === remove.dataset.option)); renderCartCount(); renderCart(); }
  const close = event.target.closest("[data-close]");
  if (close) closeOverlay(close.dataset.close);
  const basketAction = event.target.closest("[data-basket-action]");
  if (basketAction) { closeAddedNotice(); if (basketAction.dataset.basketAction === "basket") { renderCart(); openOverlay("cart-overlay"); } }
});

document.querySelector("#open-cart").addEventListener("click", () => { renderCart(); openOverlay("cart-overlay"); });
document.addEventListener("submit", (event) => { if (event.target.id === "order-form") submitOrder(event); });
document.querySelectorAll(".overlay").forEach((overlay) => overlay.addEventListener("click", (event) => { if (event.target === overlay) closeOverlay(overlay.id); }));
renderFilters();
renderMenu();
renderCartCount();

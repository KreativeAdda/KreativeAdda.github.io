const { content } = window.KreativeAdda;
const shop = content.shop || { products: [] };
const cart = [];
const stages = ["Order Placed", "Order Packed", "Order Shipped", "Out for Delivery", "Delivered"];
const shopGrid = document.querySelector("#shopGrid");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const paymentMode = document.querySelector("#paymentMode");
const upiBox = document.querySelector("#upiBox");
const upiAmount = document.querySelector("#upiAmount");
const upiPaid = document.querySelector("#upiPaid");
const upiReference = document.querySelector("#upiReference");
const checkoutForm = document.querySelector("#checkoutForm");
const orderConfirmation = document.querySelector("#orderConfirmation");
const trackingSteps = document.querySelector("#trackingSteps");
const reviewForm = document.querySelector("#reviewForm");
const reviewList = document.querySelector("#reviewList");

function setupMusic() {
  const audio = document.querySelector("#siteMusic");
  const toggle = document.querySelector("#musicToggle");
  if (!audio || !toggle || !content.music?.enabled || !content.music?.src) { if (toggle) toggle.hidden = true; return; }
  audio.src = content.music.src;
  audio.volume = 0.45;
  const setPlaying = (isPlaying) => { toggle.textContent = isPlaying ? "Pause music" : "Play music"; toggle.classList.toggle("playing", isPlaying); };
  const tryPlay = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  toggle.addEventListener("click", () => { if (audio.paused) tryPlay(); else { audio.pause(); setPlaying(false); } });
  window.addEventListener("pointerdown", function unlockMusic() { if (audio.paused) tryPlay(); window.removeEventListener("pointerdown", unlockMusic); }, { once: true });
  tryPlay();
}

function renderProducts() {
  shopGrid.innerHTML = "";
  const products = (shop.products || []).filter((product) => Number(product.stock || 0) > 0);
  if (!products.length) {
    shopGrid.innerHTML = "<p class='no-products'>No product is available.</p>";
    return;
  }
  products.forEach((product) => {
    const stock = Math.max(0, Number(product.stock || 0));
    const maxQty = Math.min(stock, 5);
    const qtyOptions = Array.from({ length: maxQty }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("");
    const card = document.createElement("article");
    card.className = "shop-card";
    const custom = yes(product.customizeAvailable) ? `<label>Customization input<textarea data-custom-for="${product.id}" placeholder="Write your customization request"></textarea></label>` : "";
    card.innerHTML = `<div class="shop-media"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false" /><span hidden>${escapeHtml(product.name.slice(0, 1))}</span></div><div class="shop-copy"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.about)}</p><dl><div><dt>Price</dt><dd>₹${Number(product.price || 0).toLocaleString("en-IN")}</dd></div><div><dt>Stock</dt><dd>${stock}</dd></div><div><dt>Customize Available</dt><dd>${escapeHtml(product.customizeAvailable)}</dd></div><div><dt>COD</dt><dd>${escapeHtml(product.codAvailable)}</dd></div><div><dt>ETA</dt><dd>${escapeHtml(product.eta)}</dd></div></dl><label>Quantity<select data-qty-for="${product.id}">${qtyOptions}</select></label>${custom}<div class="shop-actions"><button type="button" data-add="${product.id}">Add to cart</button><button type="button" data-buy="${product.id}">Buy now</button></div></div>`;
    shopGrid.append(card);
  });
}

function addToCart(productId) {
  const product = shop.products.find((item) => item.id === productId);
  if (!product || Number(product.stock || 0) <= 0) return;
  const qtyInput = document.querySelector(`[data-qty-for="${productId}"]`);
  const customInput = document.querySelector(`[data-custom-for="${productId}"]`);
  const stock = Number(product.stock || 0);
  const quantity = Math.min(Number(qtyInput?.value || 1), stock, 5);
  cart.push({ ...product, quantity, customRequest: customInput ? customInput.value.trim() : "" });
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = cart.length ? "" : "<p class='empty-cart'>Cart is empty.</p>";
  cart.forEach((item, index) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `<div><strong>${escapeHtml(item.name)}</strong><span>Qty ${item.quantity} × ₹${Number(item.price || 0).toLocaleString("en-IN")} = ₹${lineTotal.toLocaleString("en-IN")}</span>${item.customRequest ? `<small>Custom: ${escapeHtml(item.customRequest)}</small>` : ""}</div><button type="button" data-remove="${index}">Remove</button>`;
    cartItems.append(row);
  });
  const total = getCartTotal();
  cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
  if (upiAmount) upiAmount.textContent = `₹${total.toLocaleString("en-IN")}`;
  renderPaymentOptions();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
}

function renderPaymentOptions() {
  const selected = paymentMode.value;
  const codAllowed = cart.length > 0 && cart.every((item) => yes(item.codAvailable));
  paymentMode.innerHTML = codAllowed ? "<option value='COD'>Cash on Delivery</option><option value='UPI'>Prepaid UPI</option>" : "<option value='UPI'>Prepaid UPI</option>";
  if ([...paymentMode.options].some((option) => option.value === selected)) paymentMode.value = selected;
  updatePaymentUi();
}

function updatePaymentUi() {
  const isUpi = paymentMode.value === "UPI";
  upiBox.hidden = !isUpi;
  upiPaid.required = isUpi;
  upiReference.required = isUpi;
}

function placeOrder(event) {
  event.preventDefault();
  if (!cart.length) { alert("Please add at least one product to cart."); return; }
  if (paymentMode.value === "UPI" && (!upiPaid.checked || !isValidUpiReference(upiReference.value))) {
    alert("Please complete UPI payment and enter a valid UPI transaction/reference ID. Common UPI UTR is 12 digits.");
    return;
  }
  const data = new FormData(checkoutForm);
  const order = {
    id: createOrderId(),
    placedAt: new Date().toLocaleString("en-IN"),
    name: data.get("name"),
    phone: data.get("phone"),
    email: data.get("email"),
    address: data.get("address"),
    payment: data.get("payment"),
    upiReference: paymentMode.value === "UPI" ? upiReference.value.trim() : "",
    products: cart.map((item) => `${item.name} x ${item.quantity}${item.customRequest ? ` - Custom: ${item.customRequest}` : ""}`),
    total: getCartTotal(),
    eta: cart.map((item) => item.eta).filter(Boolean).join(" | "),
    stage: stages[0]
  };
  localStorage.setItem("kreativeAddaLastOrder", JSON.stringify(order));
  submitOrderToSheet(order);
  showConfirmation(order);
  renderTracking(order.stage);
  openEmailDraft(order);
}

function createOrderId() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KA-${stamp}-${random}`;
}

function submitOrderToSheet(order) {
  if (!shop.orderSheetEndpoint) return;
  const payload = new FormData();
  Object.entries({ orderId: order.id, placedAt: order.placedAt, customerName: order.name, phone: order.phone, email: order.email, address: order.address, payment: order.payment, upiReference: order.upiReference, products: order.products.join(" | "), total: order.total, eta: order.eta, stage: order.stage }).forEach(([key, value]) => payload.append(key, value));
  fetch(shop.orderSheetEndpoint, { method: "POST", body: payload, mode: "no-cors" }).catch(() => {});
}

function orderEmailUrl(order) {
  const to = content.profile?.email || "kreativeadda.avi@gmail.com";
  const subject = `Kreative.Adda Order ${order.id}`;
  const body = `New Kreative.Adda order\n\nOrder ID: ${order.id}\nPlaced At: ${order.placedAt}\nName: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email}\nAddress: ${order.address}\nPayment: ${order.payment}\nUPI Reference: ${order.upiReference || "N/A"}\nProducts: ${order.products.join(", ")}\nTotal: ₹${order.total}\nDelivery ETA: ${order.eta || "As mentioned on product"}\n\nPlease send this email to confirm the order.`;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openEmailDraft(order) {
  window.location.href = orderEmailUrl(order);
}

function showConfirmation(order) {
  const message = encodeURIComponent(`New Kreative.Adda order\nOrder ID: ${order.id}\nPlaced At: ${order.placedAt}\nName: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email}\nAddress: ${order.address}\nPayment: ${order.payment}\nUPI Reference: ${order.upiReference || "N/A"}\nProducts: ${order.products.join(", ")}\nTotal: ₹${order.total}\nDelivery ETA: ${order.eta || "As mentioned on product"}`);
  const emailUrl = orderEmailUrl(order);
  orderConfirmation.hidden = false;
  orderConfirmation.innerHTML = `<h3>Order placed: ${order.id}</h3><p>Delivery ETA: ${escapeHtml(order.eta || "As mentioned on product")}</p><p>Your email app should open with the order details ready. Please press Send to confirm the order.</p><div class="private-contact"><p>Seller contact after order</p><a class="contact-pill" href="${emailUrl}" aria-label="Send order email"><span>Send order email</span></a><a class="contact-pill whatsapp-pill" href="https://wa.me/${shop.whatsappNumber}?text=${message}" target="_blank" rel="noreferrer" aria-label="WhatsApp Avi"><span>WhatsApp</span></a><a class="contact-pill call-pill" href="tel:${shop.ownerPhone}" aria-label="Call Avi"><span>Call</span></a><strong>${shop.ownerPhone}</strong></div>`;
  orderConfirmation.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTracking(activeStage = stages[0]) {
  trackingSteps.innerHTML = "";
  stages.forEach((stage) => {
    const step = document.createElement("div");
    step.className = stage === activeStage ? "tracking-step active" : "tracking-step";
    step.textContent = stage;
    trackingSteps.append(step);
  });
}

function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem("kreativeAddaReviews") || "[]");
  reviewList.innerHTML = reviews.length ? "" : "<p class='empty-cart'>No reviews yet.</p>";
  reviews.forEach((review) => {
    const item = document.createElement("article");
    item.className = "review-card";
    item.innerHTML = `<strong>${escapeHtml(review.name)}</strong><span>${"★".repeat(Number(review.rating))}${"☆".repeat(5 - Number(review.rating))}</span><p>${escapeHtml(review.text)}</p>`;
    reviewList.append(item);
  });
}

function saveReview(event) {
  event.preventDefault();
  const data = new FormData(reviewForm);
  const reviews = JSON.parse(localStorage.getItem("kreativeAddaReviews") || "[]");
  reviews.unshift({ name: data.get("reviewName"), rating: data.get("rating"), text: data.get("review") });
  localStorage.setItem("kreativeAddaReviews", JSON.stringify(reviews));
  reviewForm.reset();
  renderReviews();
}

function isValidUpiReference(value) {
  const clean = String(value || "").trim();
  return /^\d{12}$/.test(clean) || /^[A-Za-z0-9][A-Za-z0-9/-]{8,24}$/.test(clean);
}
function yes(value) { return String(value || "").trim().toLowerCase() === "yes"; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }

shopGrid.addEventListener("click", (event) => {
  const addId = event.target.dataset.add;
  const buyId = event.target.dataset.buy;
  if (addId) addToCart(addId);
  if (buyId) { addToCart(buyId); document.querySelector(".cart-panel").scrollIntoView({ behavior: "smooth" }); }
});
cartItems.addEventListener("click", (event) => {
  if (event.target.dataset.remove) { cart.splice(Number(event.target.dataset.remove), 1); renderCart(); }
});
document.querySelector("#clearCart").addEventListener("click", () => { cart.splice(0, cart.length); renderCart(); });
paymentMode.addEventListener("change", updatePaymentUi);
checkoutForm.addEventListener("submit", placeOrder);
reviewForm.addEventListener("submit", saveReview);

setupMusic();
renderProducts();
renderCart();
renderTracking();
renderReviews();

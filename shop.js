const content = window.KreativeAddaContent;
const { applyShopStatus } = window.KreativeAdda;
const shop = content.shop || {};
const products = shop.products || [];
const productsEl = document.getElementById("shopProducts");
const cartPanel = document.getElementById("cartPanel");
const cart = [];
const reviewsKey = "kreativeAddaReviews";

applyShopStatus(content, document);

function rupee(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function savedReviews() {
  try {
    return JSON.parse(localStorage.getItem(reviewsKey) || "{}");
  } catch (error) {
    return {};
  }
}

function saveReview(productId, review) {
  const reviews = savedReviews();
  reviews[productId] = reviews[productId] || [];
  reviews[productId].push(review);
  localStorage.setItem(reviewsKey, JSON.stringify(reviews));
}

function orderId() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const random = Math.floor(100 + Math.random() * 900);
  return `KA-${stamp}-${random}`;
}

function validUpiReference(value) {
  const cleaned = String(value || "").trim();
  return /^[A-Za-z0-9]{10,24}$/.test(cleaned);
}

function productImages(product) {
  return [product.image, product.image2, product.image3, product.image4].filter(Boolean).slice(0, 4);
}

function ensureShopViewerStyles() {
  if (document.getElementById("shopViewerStyles")) return;
  const style = document.createElement("style");
  style.id = "shopViewerStyles";
  style.textContent = `
    .product-watermark-wrap { position: relative; overflow: hidden; }
    .product-watermark,
    .shop-viewer-watermark {
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      color: rgba(255,255,255,.42);
      text-shadow: 0 1px 8px rgba(0,0,0,.45);
      pointer-events: none;
      font-weight: 800;
      letter-spacing: 0;
      white-space: nowrap;
      z-index: 3;
    }
    .product-watermark { font-size: clamp(.68rem, 1.6vw, .82rem); }
    .shop-viewer-watermark { font-size: clamp(.95rem, 2vw, 1.35rem); bottom: 14px; }
    .shop-image-viewer {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(5, 8, 12, .88);
    }
    .shop-image-inner { position: relative; max-width: min(94vw, 1100px); max-height: 88vh; }
    .shop-image-inner img {
      display: block;
      max-width: 100%;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 24px 70px rgba(0,0,0,.42);
    }
    .shop-image-close {
      position: absolute;
      top: -14px;
      right: -14px;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 50%;
      background: #ffffff;
      color: #111111;
      font-size: 1.35rem;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(0,0,0,.24);
    }
  `;
  document.head.appendChild(style);
}

function openShopImage(src, alt) {
  ensureShopViewerStyles();
  const viewer = document.createElement("div");
  viewer.className = "shop-image-viewer";
  viewer.innerHTML = `
    <div class="shop-image-inner">
      <button class="shop-image-close" type="button" aria-label="Close full image">×</button>
      <img src="${src}" alt="${alt || "Product image"}" />
      <span class="shop-viewer-watermark">Kreativ.Adda</span>
    </div>
  `;
  const close = () => viewer.remove();
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) close();
  });
  viewer.querySelector(".shop-image-close").addEventListener("click", close);
  document.body.appendChild(viewer);
}

function renderProducts() {
  if (!products.length) {
    productsEl.innerHTML = `<div class="empty-state">No product is available.</div>`;
    renderCart();
    return;
  }

  ensureShopViewerStyles();
  const reviews = savedReviews();
  productsEl.innerHTML = products.map((product) => {
    const images = productImages(product);
    const stock = Math.max(0, Math.min(Number(product.stock || 0), 5));
    const reviewList = reviews[product.id] || [];
    const gallery = images.length
      ? `<div class="product-gallery" data-product="${product.id}">
          <button type="button" class="gallery-arrow prev" aria-label="Previous image">‹</button>
          <div class="product-watermark-wrap">
            <img src="${images[0]}" alt="${product.name}" data-gallery-image />
            <span class="product-watermark">Kreativ.Adda</span>
          </div>
          <button type="button" class="gallery-arrow next" aria-label="Next image">›</button>
          <div class="gallery-count">1 / ${images.length}</div>
        </div>`
      : `<div class="product-image placeholder">No Image</div>`;

    return `
      <article class="product-card" data-product-id="${product.id}">
        ${gallery}
        <div class="product-copy">
          <p class="section-kicker">${stock ? `${stock} in stock` : "Out of stock"}</p>
          <h2>${product.name}</h2>
          <p>${product.about}</p>
          <div class="product-meta">
            <span>${rupee(product.price)}</span>
            <span>Customize: ${product.customize ? "Yes" : "No"}</span>
            <span>COD: ${product.cod ? "Yes" : "No"}</span>
            <span>ETA: ${product.eta || "To be confirmed"}</span>
          </div>
          <label>Quantity
            <select data-qty ${stock ? "" : "disabled"}>
              ${Array.from({ length: stock }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("")}
            </select>
          </label>
          ${product.customize ? `<label>Customization
            <textarea data-custom placeholder="Write customization here"></textarea>
          </label>` : ""}
          <div class="product-actions">
            <button type="button" data-add ${stock ? "" : "disabled"}>Add to Cart</button>
            <button type="button" data-buy ${stock ? "" : "disabled"}>Buy Now</button>
          </div>
          <form class="review-form" data-review-form>
            <label>Rate this product
              <select data-rating>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </label>
            <label>Review
              <textarea data-review-text placeholder="Write a review"></textarea>
            </label>
            <button type="submit">Add Review</button>
          </form>
          <div class="review-list">
            ${reviewList.length ? reviewList.map((review) => `<p><strong>${review.rating}★</strong> ${review.text}</p>`).join("") : "<p>No reviews yet.</p>"}
          </div>
        </div>
      </article>
    `;
  }).join("");

  productsEl.querySelectorAll(".product-card").forEach((card) => {
    const product = products.find((item) => item.id === card.dataset.productId);
    const images = productImages(product);
    let activeImage = 0;

    const image = card.querySelector("[data-gallery-image]");
    const count = card.querySelector(".gallery-count");
    const updateImage = () => {
      if (!image || !images.length) return;
      image.src = images[activeImage];
      count.textContent = `${activeImage + 1} / ${images.length}`;
    };

    card.querySelector(".prev")?.addEventListener("click", () => {
      activeImage = (activeImage - 1 + images.length) % images.length;
      updateImage();
    });
    card.querySelector(".next")?.addEventListener("click", () => {
      activeImage = (activeImage + 1) % images.length;
      updateImage();
    });
    image?.addEventListener("click", () => openShopImage(images[activeImage], product.name));

    card.querySelector("[data-add]")?.addEventListener("click", () => addToCart(card, product));
    card.querySelector("[data-buy]")?.addEventListener("click", () => {
      cart.length = 0;
      addToCart(card, product);
      document.getElementById("customerName")?.focus();
    });
    card.querySelector("[data-review-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const rating = card.querySelector("[data-rating]").value;
      const text = card.querySelector("[data-review-text]").value.trim();
      if (!text) return;
      saveReview(product.id, { rating, text, date: new Date().toISOString() });
      renderProducts();
    });
  });
}

function addToCart(card, product) {
  const qty = Number(card.querySelector("[data-qty]")?.value || 1);
  const custom = card.querySelector("[data-custom]")?.value.trim() || "";
  const existing = cart.find((item) => item.id === product.id && item.custom === custom);
  if (existing) {
    existing.qty = Math.min(Number(product.stock || 1), existing.qty + qty, 5);
  } else {
    cart.push({ ...product, qty, custom });
  }
  renderCart();
}

function cartTotal() {
  return cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.qty || 1), 0);
}

function orderEmailUrl(order) {
  const email = content.profile?.email || "kreativeadda.avi@gmail.com";
  const items = order.items.map((item) => `${item.name} x ${item.qty} = ${rupee(item.price * item.qty)}${item.custom ? ` | Custom: ${item.custom}` : ""}`).join("%0D%0A");
  const subject = encodeURIComponent(`Kreativ.Adda Order ${order.id}`);
  const body = encodeURIComponent(`New Kreativ.Adda order\n\nOrder ID: ${order.id}\nName: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email}\nAddress: ${order.address}\nPayment: ${order.payment}\nUPI Reference: ${order.upi || "N/A"}\nTotal: ${rupee(order.total)}\nETA: ${order.eta}\n\nItems:\n${items}\n\nStatus: Order Placed`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function renderCart() {
  const hasProducts = products.length > 0;
  const total = cartTotal();
  const codAllowed = cart.length > 0 && cart.every((item) => item.cod);
  const eta = cart.length ? cart.map((item) => item.eta).filter(Boolean).join(", ") || "To be confirmed" : "To be confirmed";

  cartPanel.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length ? cart.map((item, index) => `
      <div class="cart-line">
        <span>${item.name} x ${item.qty}</span>
        <strong>${rupee(item.price * item.qty)}</strong>
        <button type="button" data-remove="${index}">Remove</button>
      </div>
    `).join("") : `<p>${hasProducts ? "Your cart is empty." : "No products available, so payment mode is hidden."}</p>`}
    ${cart.length ? `
      <div class="cart-total">Total <strong>${rupee(total)}</strong></div>
      <form id="orderForm" class="order-form">
        <label>Name <input id="customerName" required /></label>
        <label>Phone Number <input id="customerPhone" required /></label>
        <label>Email <input id="customerEmail" type="email" required /></label>
        <label>Delivery Address <textarea id="customerAddress" required></textarea></label>
        <label>Payment Mode
          <select id="paymentMode">
            ${codAllowed ? `<option value="COD">COD</option>` : ""}
            <option value="UPI Prepaid">UPI Prepaid</option>
          </select>
        </label>
        <div id="upiBox" class="upi-box">
          <img src="${shop.upiQr || "assets/upi-qr.png"}" alt="UPI QR code" />
          <p>Total to pay: <strong>${rupee(total)}</strong></p>
          <label>UPI Transaction Reference
            <input id="upiReference" placeholder="Example: 123456789012" />
          </label>
          <p class="fine-print">After paying through your UPI app, enter the transaction reference here. The website checks the format only; final payment confirmation must be verified by admin.</p>
        </div>
        <button type="submit">Place Order</button>
      </form>
      <div id="orderMessage" class="order-message"></div>
    ` : ""}
  `;

  cartPanel.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    });
  });

  const paymentMode = document.getElementById("paymentMode");
  const upiBox = document.getElementById("upiBox");
  const updatePayment = () => {
    if (!paymentMode || !upiBox) return;
    upiBox.style.display = paymentMode.value === "UPI Prepaid" ? "block" : "none";
  };
  paymentMode?.addEventListener("change", updatePayment);
  updatePayment();

  document.getElementById("orderForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const payment = paymentMode.value;
    const upi = document.getElementById("upiReference")?.value.trim() || "";
    if (payment === "UPI Prepaid" && !validUpiReference(upi)) {
      document.getElementById("orderMessage").textContent = "Please enter a valid UPI transaction reference after payment.";
      return;
    }

    const order = {
      id: orderId(),
      items: [...cart],
      total,
      eta,
      payment,
      upi,
      name: document.getElementById("customerName").value.trim(),
      phone: document.getElementById("customerPhone").value.trim(),
      email: document.getElementById("customerEmail").value.trim(),
      address: document.getElementById("customerAddress").value.trim(),
      status: "Order Placed"
    };
    localStorage.setItem("kreativeAddaLastOrder", JSON.stringify(order));
    showConfirmation(order);
    window.location.href = orderEmailUrl(order);
  });
}

function showConfirmation(order) {
  const message = document.getElementById("orderMessage");
  if (!message) return;
  message.innerHTML = `
    <strong>Order Placed</strong><br />
    Order ID: ${order.id}<br />
    Delivery ETA: ${order.eta}<br />
    Status: Order Placed<br />
    Contact after order: <a href="tel:+919457171931">Call</a> <a href="https://wa.me/919457171931">WhatsApp</a><br />
    Your email app will open with the complete order draft for Kreativ.Adda.
  `;
}

renderProducts();
renderCart();

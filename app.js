const state = () => window.KreativeAdda.loadState();
let activeCategory = "all";

const filters = document.querySelector("#categoryFilters");
const gallery = document.querySelector("#galleryGrid");
const emptyState = document.querySelector("#emptyState");

function renderFilters() {
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.textContent = "All";
  allButton.dataset.category = "all";
  filters.append(allButton);

  window.KreativeAdda.categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category.label;
    button.dataset.category = category.id;
    button.style.setProperty("--accent", category.accent);
    filters.append(button);
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderGallery();
  });
}

function mediaMarkup(item) {
  if (item.type === "image") {
    return `<img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />`;
  }

  if (item.type === "video") {
    return `<video src="${item.src}" controls preload="metadata"></video>`;
  }

  return `<div class="placeholder-art"><span>${escapeHtml(item.title.slice(0, 1))}</span></div>`;
}

function renderGallery() {
  const current = state();
  const items = activeCategory === "all" ? current.items : current.items.filter((item) => item.category === activeCategory);
  gallery.innerHTML = "";
  emptyState.classList.toggle("visible", items.length === 0);

  document.querySelectorAll(".filter-bar button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === activeCategory);
  });

  items.forEach((item) => {
    const category = window.KreativeAdda.categoryById(item.category);
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.setProperty("--accent", category.accent);
    card.innerHTML = `
      <div class="media-frame">${mediaMarkup(item)}</div>
      <div class="card-copy">
        <p>${escapeHtml(category.label)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <span>${escapeHtml(item.caption || "A Kreative.Adda memory.")}</span>
      </div>
    `;
    gallery.append(card);
  });
}

function renderProfile() {
  const current = state();
  document.querySelector("#aboutTitle").textContent = current.profile.owner || "Avi Narang";
  document.querySelector("#aboutText").textContent = current.profile.about || "";
  setSocialLink("#youtubeLink", current.profile.youtube, "YouTube Channel");
  setSocialLink("#instagramLink", current.profile.instagram, "Instagram");
}

function setSocialLink(selector, href, label) {
  const link = document.querySelector(selector);
  link.href = href && href !== "#" ? href : "#";
  link.textContent = href && href !== "#" ? label : `${label} - add link in admin`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

renderFilters();
renderProfile();
renderGallery();
window.addEventListener("storage", () => {
  renderProfile();
  renderGallery();
});
window.addEventListener("kreative:adda-updated", () => {
  renderProfile();
  renderGallery();
});

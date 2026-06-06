const { content, categoryById } = window.KreativeAdda;
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("type") || "dishes";
const category = categoryById(categoryId);
const title = document.querySelector("#categoryTitle");
const eyebrow = document.querySelector("#categoryEyebrow");
const grid = document.querySelector("#categoryGalleryGrid");
const emptyState = document.querySelector("#categoryEmptyState");

ensureWatermarkStyles();
title.textContent = category.label;
eyebrow.textContent = "Now viewing";
document.title = `${category.label} | Kreative.Adda`;
renderCategory();
setupKreativeMusic(content);

function renderCategory() {
  const items = content.items.filter((item) => item.category === category.id);
  grid.innerHTML = "";
  emptyState.classList.toggle("visible", items.length === 0);
  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.setProperty("--accent", category.accent);
    const titleMarkup = item.type === "image" && item.src
      ? `<button class="title-view-button" type="button" data-view-index="${index}">${escapeHtml(item.title)}</button>`
      : `<h3>${escapeHtml(item.title)}</h3>`;
    card.innerHTML = `<div class="media-frame">${mediaMarkup(item)}</div><div class="card-copy"><p>${escapeHtml(category.label)}</p>${titleMarkup}<span>${escapeHtml(item.caption || "A Kreative.Adda memory.")}</span></div>`;
    grid.append(card);
  });
}

function mediaMarkup(item) {
  if (item.type === "image" && item.src) return `<img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" /><span class="card-watermark">Kreative.Adda</span>`;
  if (item.type === "youtube" && item.youtube) {
    const embed = youtubeEmbedUrl(item.youtube);
    return embed ? `<iframe src="${embed}" title="${escapeHtml(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : placeholderMarkup(item);
  }
  return placeholderMarkup(item);
}

function openImageViewer(item) {
  if (!item?.src) return;
  const viewer = document.createElement("div");
  viewer.className = "image-viewer";
  viewer.innerHTML = `<button class="image-viewer-close" type="button" aria-label="Close full photo">Close</button><figure><div class="viewer-image-wrap"><img src="${item.src}" alt="${escapeHtml(item.title)}" /><span class="viewer-watermark">Kreative.Adda</span></div><figcaption><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.caption || "")}</span></figcaption></figure>`;
  document.body.append(viewer);
  document.body.classList.add("viewer-open");
  const close = () => { viewer.remove(); document.body.classList.remove("viewer-open"); };
  viewer.querySelector(".image-viewer-close").addEventListener("click", close);
  viewer.addEventListener("click", (event) => { if (event.target === viewer) close(); });
  window.addEventListener("keydown", function escapeClose(event) { if (event.key === "Escape") { close(); window.removeEventListener("keydown", escapeClose); } });
}

function ensureWatermarkStyles() {
  if (document.querySelector("#kreativeWatermarkStyles")) return;
  const style = document.createElement("style");
  style.id = "kreativeWatermarkStyles";
  style.textContent = `.media-frame,.shop-media{position:relative;overflow:hidden}.card-watermark{position:absolute;left:50%;bottom:.55rem;z-index:2;max-width:88%;transform:translateX(-50%);padding:.18rem .45rem;border-radius:999px;color:rgba(255,255,255,.42);background:rgba(0,0,0,.16);font-size:.68rem;font-weight:900;letter-spacing:0;line-height:1;pointer-events:none;text-shadow:0 1px 5px rgba(0,0,0,.6);white-space:nowrap}.viewer-image-wrap{position:relative;display:flex;justify-content:center;max-height:78vh;max-width:100%;margin:auto}.viewer-watermark{position:absolute;left:50%;bottom:1rem;z-index:3;transform:translateX(-50%);padding:.35rem .7rem;border:1px solid rgba(255,255,255,.28);border-radius:999px;color:rgba(255,255,255,.48);background:rgba(0,0,0,.18);font-weight:900;letter-spacing:0;pointer-events:none;text-shadow:0 1px 8px rgba(0,0,0,.7);white-space:nowrap}@media(max-width:560px){.viewer-watermark{bottom:.7rem;font-size:.82rem}.card-watermark{font-size:.6rem;bottom:.45rem}}`;
  document.head.append(style);
}

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    let id = "";
    if (parsed.hostname.includes("youtu.be")) id = parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) id = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : "";
  } catch {
    return "";
  }
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-index]");
  if (!button) return;
  const items = content.items.filter((item) => item.category === category.id);
  openImageViewer(items[Number(button.dataset.viewIndex)]);
});

function placeholderMarkup(item) { return `<div class="placeholder-art"><span>${escapeHtml(item.title.slice(0, 1))}</span></div>`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }

const { content, categoryById } = window.KreativeAdda;
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("type") || "dishes";
const category = categoryById(categoryId);
const title = document.querySelector("#categoryTitle");
const eyebrow = document.querySelector("#categoryEyebrow");
const grid = document.querySelector("#categoryGalleryGrid");
const emptyState = document.querySelector("#categoryEmptyState");

title.textContent = category.label;
eyebrow.textContent = "Now viewing";
document.title = `${category.label} | Kreative.Adda`;
renderCategory();
setupKreativeMusic(content);

function renderCategory() {
  const items = content.items.filter((item) => item.category === category.id);
  grid.innerHTML = "";
  emptyState.classList.toggle("visible", items.length === 0);
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.setProperty("--accent", category.accent);
    card.innerHTML = `<div class="media-frame">${mediaMarkup(item)}</div><div class="card-copy"><p>${escapeHtml(category.label)}</p><h3>${escapeHtml(item.title)}</h3><span>${escapeHtml(item.caption || "A Kreative.Adda memory.")}</span></div>`;
    grid.append(card);
  });
}

function mediaMarkup(item) {
  if (item.type === "image" && item.src) return `<img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />`;
  if (item.type === "youtube" && item.youtube) {
    const embed = youtubeEmbedUrl(item.youtube);
    return embed ? `<iframe src="${embed}" title="${escapeHtml(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : placeholderMarkup(item);
  }
  return placeholderMarkup(item);
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

function placeholderMarkup(item) { return `<div class="placeholder-art"><span>${escapeHtml(item.title.slice(0, 1))}</span></div>`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }

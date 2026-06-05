const { categories, content, categoryById } = window.KreativeAdda;
const categoryGrid = document.querySelector("#categoryGrid");
const galleryPanel = document.querySelector("#galleryPanel");
const galleryGrid = document.querySelector("#galleryGrid");
const emptyState = document.querySelector("#emptyState");
const activeCategoryTitle = document.querySelector("#activeCategoryTitle");
const activeCategoryLabel = document.querySelector("#activeCategoryLabel");

function renderHome() {
  document.querySelector("#dailyWord").textContent = content.daily.word;
  document.querySelector("#dailyMeaning").textContent = content.daily.meaning;
  document.querySelector("#dailyThought").textContent = content.daily.thought;
  document.querySelector("#aboutTitle").textContent = content.profile.owner || "Avi Narang";
  document.querySelector("#aboutText").textContent = content.profile.about || "";

  const ownerPhoto = document.querySelector("#ownerPhoto");
  ownerPhoto.src = content.profile.ownerPhoto || "assets/logo.webp";
  ownerPhoto.onerror = () => { ownerPhoto.src = "assets/logo.webp"; };

  setLink("#youtubeLink", content.profile.youtube);
  setLink("#instagramLink", content.profile.instagram);
  const emailLink = document.querySelector("#contactEmail");
  if (content.profile.email) {
    emailLink.href = `mailto:${content.profile.email}`;
    emailLink.textContent = content.profile.email;
  }
}

function renderCategories() {
  categoryGrid.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tile";
    button.style.setProperty("--accent", category.accent);
    button.innerHTML = `<span>${escapeHtml(category.label)}</span>`;
    button.addEventListener("click", () => {
      if (category.isContact) {
        document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
        return;
      }
      openCategory(category.id);
    });
    categoryGrid.append(button);
  });
}

function openCategory(categoryId) {
  const category = categoryById(categoryId);
  const items = content.items.filter((item) => item.category === categoryId);
  galleryPanel.hidden = false;
  activeCategoryLabel.textContent = "Now viewing";
  activeCategoryTitle.textContent = category.label;
  galleryGrid.innerHTML = "";
  emptyState.classList.toggle("visible", items.length === 0);

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.setProperty("--accent", category.accent);
    card.innerHTML = `
      <div class="media-frame">${mediaMarkup(item)}</div>
      <div class="card-copy">
        <p>${escapeHtml(category.label)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <span>${escapeHtml(item.caption || "A Kreative.Adda memory.")}</span>
      </div>`;
    galleryGrid.append(card);
  });
  galleryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
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
  } catch { return ""; }
}

function placeholderMarkup(item) {
  return `<div class="placeholder-art"><span>${escapeHtml(item.title.slice(0, 1))}</span></div>`;
}

function setLink(selector, href) {
  const link = document.querySelector(selector);
  link.href = href && href !== "#" ? href : "#";
  link.classList.toggle("disabled", !href || href === "#");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

document.querySelector("#closeGallery").addEventListener("click", () => { galleryPanel.hidden = true; });
renderHome();
renderCategories();

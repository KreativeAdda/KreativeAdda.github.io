const { categories, content } = window.KreativeAdda;
const categoryGrid = document.querySelector("#categoryGrid");

function renderHome() {
  document.querySelector("#dailyWord").textContent = content.daily.word;
  document.querySelector("#dailyMeaning").textContent = content.daily.meaning;
  document.querySelector("#dailyThought").textContent = content.daily.thought;
  document.querySelector("#aboutTitle").textContent = content.profile.owner || "Avi Narang";
  document.querySelector("#aboutText").textContent = content.profile.about || "";
  const aboutPhotoSrc = content.profile.ownerPhoto || "assets/logo.webp";
  const heroPhotoSrc = "assets/owner-photo.png";
  const ownerPhoto = document.querySelector("#ownerPhoto");
  const heroOwnerPhoto = document.querySelector("#heroOwnerPhoto");
  const ownerPhotoLink = document.querySelector("#ownerPhotoLink");
  ownerPhoto.src = aboutPhotoSrc;
  ownerPhoto.onerror = () => { ownerPhoto.src = "assets/logo.webp"; };
  heroOwnerPhoto.src = heroPhotoSrc;
  heroOwnerPhoto.onerror = () => { heroOwnerPhoto.style.display = "none"; };
  ownerPhotoLink.href = aboutPhotoSrc;
  setLink("#youtubeLink", content.profile.youtube);
  setLink("#instagramLink", content.profile.instagram);
  const emailLink = document.querySelector("#contactEmail");
  if (content.profile.email) { emailLink.href = `mailto:${content.profile.email}`; emailLink.textContent = content.profile.email; }
  setShopStatus();
}

function setShopStatus() {
  const shopLink = document.querySelector("#shopNavLink");
  if (!shopLink) return;
  const products = content.shop?.products || [];
  const hasStock = products.some((product) => Number(product.stock || 0) > 0);
  shopLink.classList.toggle("shop-open", hasStock);
  shopLink.classList.toggle("shop-closed", !hasStock);
}

function renderCategories() {
  categoryGrid.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tile";
    button.style.setProperty("--accent", category.accent);
    button.innerHTML = `<span>${escapeHtml(category.label)}</span>`;
    button.addEventListener("click", () => { window.location.href = `category.html?type=${encodeURIComponent(category.id)}`; });
    categoryGrid.append(button);
  });
}

function setLink(selector, href) { const link = document.querySelector(selector); link.href = href && href !== "#" ? href : "#"; link.classList.toggle("disabled", !href || href === "#"); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }

renderHome();
renderCategories();
setupKreativeMusic(content);

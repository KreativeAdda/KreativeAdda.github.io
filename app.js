const { categories, content, applyShopStatus } = window.KreativeAdda;
const categoryGrid = document.querySelector("#categoryGrid");

function renderHome() {
  setText("#dailyWord", content.daily?.word || "Kreativ");
  setText("#dailyMeaning", content.daily?.meaning || "A spark of originality shaped with heart.");
  setText("#dailyThought", content.daily?.thought || "Create something small today; it may become a memory tomorrow.");
  setText("#aboutName", content.profile?.owner || "Avi Narang");
  setText("#aboutBio", content.profile?.about || "");

  const aboutPhoto = document.querySelector(".about-photo");
  if (aboutPhoto) {
    aboutPhoto.src = `${content.profile?.ownerPhoto || "assets/owner-photo.jpg"}?v=20260610b`;
    aboutPhoto.onerror = () => { aboutPhoto.src = "assets/logo.webp"; };
  }

  renderSocialLinks();
  applyShopStatus(content, document);
}

function renderCategories() {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = "";
  const uploadedCategories = new Set((content.items || []).map((item) => item.category));

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = uploadedCategories.has(category.id) ? "category-tile category-has-content" : "category-tile";
    button.style.setProperty("--accent", category.accent);
    button.innerHTML = `<span>${escapeHtml(category.label)}</span>`;
    button.addEventListener("click", () => {
      window.location.href = `category.html?type=${encodeURIComponent(category.id)}`;
    });
    categoryGrid.append(button);
  });
}

function renderSocialLinks() {
  const socialLinks = document.querySelector("#socialLinks");
  if (!socialLinks) return;

  socialLinks.innerHTML = `
    <a class="social-button" href="${escapeAttribute(content.profile?.youtube || "#")}" aria-label="YouTube" target="_blank" rel="noopener">
      <span class="youtube-icon" aria-hidden="true"></span>
    </a>
    <a class="social-button" href="${escapeAttribute(content.profile?.instagram || "#")}" aria-label="Instagram" target="_blank" rel="noopener">
      <span class="instagram-icon" aria-hidden="true"></span>
    </a>
  `;

  socialLinks.querySelectorAll("a").forEach((link) => {
    if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
      link.classList.add("disabled");
      link.removeAttribute("target");
    }
  });

  const emailLink = document.querySelector("#contactEmail");
  if (emailLink && content.profile?.email) {
    emailLink.href = `mailto:${content.profile.email}`;
    emailLink.textContent = content.profile.email;
  }
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

renderHome();
renderCategories();
if (typeof setupKreativeMusic === "function") setupKreativeMusic(content);

const adminPassword = "&onal15Neha28KA";
const loginPanel = document.querySelector("#loginPanel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#loginForm");
const uploadForm = document.querySelector("#uploadForm");
const profileForm = document.querySelector("#profileForm");
const itemCategory = document.querySelector("#itemCategory");
const adminItems = document.querySelector("#adminItems");

function getState() {
  return window.KreativeAdda.loadState();
}

function setState(nextState) {
  window.KreativeAdda.saveState(nextState);
  renderAdminItems();
}

window.KreativeAdda.categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category.id;
  option.textContent = category.label;
  itemCategory.append(option);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = document.querySelector("#passwordInput").value;
  if (password !== adminPassword) {
    loginForm.classList.add("shake");
    setTimeout(() => loginForm.classList.remove("shake"), 450);
    return;
  }

  loginPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadProfileForm();
  renderAdminItems();
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const current = getState();
  current.profile = {
    owner: document.querySelector("#ownerName").value.trim() || "Avi Narang",
    about: document.querySelector("#aboutTextInput").value.trim(),
    youtube: document.querySelector("#youtubeInput").value.trim() || "#",
    instagram: document.querySelector("#instagramInput").value.trim() || "#"
  };
  setState(current);
});

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = document.querySelector("#itemFile").files[0];
  if (!file) return;

  const current = getState();
  const item = {
    id: crypto.randomUUID(),
    title: document.querySelector("#itemTitle").value.trim(),
    category: itemCategory.value,
    caption: document.querySelector("#itemCaption").value.trim(),
    type: file.type.startsWith("video/") ? "video" : "image",
    src: await fileToDataUrl(file),
    createdAt: new Date().toISOString()
  };

  current.items = [item, ...current.items.filter((entry) => !entry.id.startsWith("sample-"))];
  setState(current);
  uploadForm.reset();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  window.KreativeAdda.saveState(structuredClone(window.KreativeAdda.defaultState));
  loadProfileForm();
  renderAdminItems();
});

function loadProfileForm() {
  const current = getState();
  document.querySelector("#ownerName").value = current.profile.owner || "";
  document.querySelector("#aboutTextInput").value = current.profile.about || "";
  document.querySelector("#youtubeInput").value = current.profile.youtube === "#" ? "" : current.profile.youtube || "";
  document.querySelector("#instagramInput").value = current.profile.instagram === "#" ? "" : current.profile.instagram || "";
}

function renderAdminItems() {
  const current = getState();
  adminItems.innerHTML = "";

  current.items.forEach((item) => {
    const category = window.KreativeAdda.categoryById(item.category);
    const row = document.createElement("article");
    row.className = "admin-item";
    row.style.setProperty("--accent", category.accent);
    row.innerHTML = `
      <div class="mini-preview">${previewMarkup(item)}</div>
      <div>
        <p>${category.label}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <span>${escapeHtml(item.caption || "")}</span>
      </div>
      <button type="button" data-delete="${item.id}">Delete</button>
    `;
    adminItems.append(row);
  });

  adminItems.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = getState();
      next.items = next.items.filter((item) => item.id !== button.dataset.delete);
      setState(next);
    });
  });
}

function previewMarkup(item) {
  if (item.type === "image") return `<img src="${item.src}" alt="" />`;
  if (item.type === "video") return `<video src="${item.src}" muted></video>`;
  return `<span>${escapeHtml(item.title.slice(0, 1))}</span>`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

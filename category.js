const content = window.KreativeAddaContent;
const { categories, getCategoryItems, youtubeEmbedUrl, applyShopStatus } = window.KreativeAdda;

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("type") || categories[0].id;
const category = categories.find((item) => item.id === categoryId) || categories[0];
const items = getCategoryItems(category.id);

const title = document.getElementById("categoryTitle");
const description = document.getElementById("categoryDescription");
const eyebrow = document.getElementById("categoryEyebrow");
const container = document.getElementById("categoryItems");

function ensureWatermarkStyles() {
  if (document.getElementById("kreativeWatermarkStyles")) return;

  const style = document.createElement("style");
  style.id = "kreativeWatermarkStyles";
  style.textContent = `
    .media-watermark-wrap { position: relative; overflow: hidden; border-radius: 8px; }
    .card-watermark,
    .viewer-watermark {
      position: absolute;
      left: 50%;
      bottom: 14px;
      transform: translateX(-50%);
      color: rgba(255,255,255,.42);
      text-shadow: 0 1px 8px rgba(0,0,0,.45);
      pointer-events: none;
      font-weight: 800;
      letter-spacing: 0;
      white-space: nowrap;
      z-index: 3;
    }
    .card-watermark { font-size: clamp(.68rem, 1.6vw, .82rem); bottom: 10px; }
    .viewer-watermark { font-size: clamp(.95rem, 2vw, 1.35rem); }
    .full-image-viewer {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(5, 8, 12, .88);
    }
    .full-image-inner {
      position: relative;
      max-width: min(94vw, 1100px);
      max-height: 88vh;
    }
    .full-image-inner img {
      display: block;
      max-width: 100%;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 24px 70px rgba(0,0,0,.42);
    }
    .full-image-close {
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

function openImageViewer(src, alt) {
  ensureWatermarkStyles();

  const viewer = document.createElement("div");
  viewer.className = "full-image-viewer";
  viewer.innerHTML = `
    <div class="full-image-inner">
      <button class="full-image-close" type="button" aria-label="Close full image">×</button>
      <img src="${src}" alt="${alt || "Full image"}" />
      <span class="viewer-watermark">Kreativ.Adda</span>
    </div>
  `;

  const close = () => viewer.remove();
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) close();
  });
  viewer.querySelector(".full-image-close").addEventListener("click", close);
  document.body.appendChild(viewer);
}

title.textContent = category.label;
description.textContent = category.description;
eyebrow.textContent = category.badge;
document.title = `${category.label} | Kreativ.Adda`;
applyShopStatus(content, document);

if (!items.length) {
  container.innerHTML = `<div class="empty-state">No public uploads yet for this category.</div>`;
} else {
  ensureWatermarkStyles();
  container.innerHTML = items.map((item) => {
    const media = item.type === "youtube"
      ? `<iframe src="${youtubeEmbedUrl(item.url)}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      : `<div class="media-watermark-wrap"><img src="${item.src}" alt="${item.title}" /><span class="card-watermark">Kreativ.Adda</span></div>`;

    return `
      <article class="upload-card ${item.type === "youtube" ? "video-card" : ""}">
        <div class="upload-media">${media}</div>
        <div class="upload-copy">
          <p>${category.label}</p>
          <h2>${item.title}</h2>
          <span>${item.caption || "A Kreativ.Adda memory."}</span>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll(".upload-card").forEach((card, index) => {
    const item = items[index];
    if (item.type !== "image") return;

    const heading = card.querySelector("h2");
    heading.classList.add("image-title-link");
    heading.tabIndex = 0;
    heading.setAttribute("role", "button");
    heading.setAttribute("aria-label", `View full image for ${item.title}`);

    const open = () => openImageViewer(item.src, item.title);
    heading.addEventListener("click", open);
    heading.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

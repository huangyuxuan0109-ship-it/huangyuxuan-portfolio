const otherCategories = {
  exhibition: {
    index: "01", title: "EXHIBITION", zh: "展会布展", note: "整体空间、陈列秩序与展位细节",
    series: [{ title: "展会空间与陈列", en: "EXHIBITION SPACE / DISPLAY SYSTEM", items: [
      { src: "project-15-assets/exhibition-01.jpg", title: "展会整体空间", en: "SPACE OVERVIEW", layout: "wide" },
      { src: "project-15-assets/exhibition-02.jpg", title: "产品陈列", en: "DISPLAY DETAIL", layout: "standard" },
      { src: "project-15-assets/exhibition-03.jpg", title: "文创展示", en: "EXHIBITION DETAIL", layout: "standard" },
      { src: "project-15-assets/exhibition-04.jpg", title: "展位陈列", en: "BOOTH DISPLAY", layout: "wide" }
    ]}]
  },
  activity: {
    index: "02", title: "DOCUMENTARY", zh: "活动拍摄", note: "人物互动、活动过程与空间氛围记录",
    series: [
      { title: "人物与互动", en: "PEOPLE / MOMENTS", items: [
        { src: "project-15-assets/activity-01.jpg", title: "活动影像集锦", en: "EVENT COLLAGE", layout: "tall" },
        { src: "project-15-assets/activity-02.jpg", title: "互动纪实 01", en: "EVENT DOCUMENTARY", layout: "standard" },
        { src: "project-15-assets/activity-03.jpg", title: "人物肖像 01", en: "PORTRAIT", layout: "tall" },
        { src: "project-15-assets/activity-04.jpg", title: "活动过程", en: "WORKSHOP STORY", layout: "standard" },
        { src: "project-15-assets/activity-05.jpg", title: "人物肖像 02", en: "PORTRAIT", layout: "tall" },
        { src: "project-15-assets/activity-06.jpg", title: "互动纪实 02", en: "EVENT DOCUMENTARY", layout: "standard" }
      ]},
      { title: "氛围与细节", en: "ATMOSPHERE / DETAILS", items: [
        { src: "project-15-assets/activity-07.jpg", title: "光影装置", en: "LIGHT DETAIL", layout: "standard" },
        { src: "project-15-assets/activity-08.jpg", title: "空间灯光", en: "SPACE DETAIL", layout: "standard" },
        { src: "project-15-assets/activity-09.jpg", title: "活动空间", en: "EVENT SPACE", layout: "wide" }
      ]}
    ]
  }
};

const gallery = document.querySelector("#other-gallery");
const tabs = [...document.querySelectorAll(".other-tab")];
const lightbox = document.querySelector("#other-lightbox");
const lightboxImage = document.querySelector("#other-lightbox-image");
const lightboxTitle = document.querySelector("#other-lightbox-title");
const lightboxMeta = document.querySelector("#other-lightbox-meta");
const lightboxProgress = document.querySelector("#other-lightbox-progress");
const categoryHead = document.querySelector("#other-category-head");
let currentCategory = "exhibition";
let currentItems = [];
let currentIndex = 0;
let revealObserver;
let touchStartX = 0;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

function renderCategory(key, shouldScroll = false) {
  const resolvedKey = key in otherCategories ? key : "exhibition";
  const category = otherCategories[resolvedKey];
  currentCategory = resolvedKey;
  document.body.dataset.otherCategory = resolvedKey;
  currentItems = category.series.flatMap((series) => series.items.map((item) => ({ ...item, series: series.title })));
  document.querySelector("#other-category-index").textContent = category.index;
  document.querySelector("#other-category-title").innerHTML = `${escapeHtml(category.title)} <small>${escapeHtml(category.zh)}</small>`;
  document.querySelector("#other-category-note").textContent = category.note;

  let globalIndex = 0;
  gallery.innerHTML = category.series.map((series, seriesIndex) => {
    const cards = series.items.map((item, itemIndex) => {
      const lightboxIndex = globalIndex++;
      const layoutClass = item.layout === "wide" ? "is-wide" : item.layout === "tall" ? "is-tall" : "";
      return `<button type="button" class="other-card ${layoutClass}" data-lightbox-index="${lightboxIndex}" aria-label="查看大图：${escapeHtml(item.title)}"><span class="other-media"><img src="./${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy" /></span><span class="other-caption"><span class="num">${String(itemIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.en)}</small></span></button>`;
    }).join("");
    return `<section class="other-series" aria-labelledby="other-series-${seriesIndex}"><header class="other-series-head"><h3 id="other-series-${seriesIndex}"><span>${String(seriesIndex + 1).padStart(2, "0")}</span>${escapeHtml(series.title)}</h3><p>${escapeHtml(series.en)}</p></header><div class="other-grid">${cards}</div></section>`;
  }).join("");

  tabs.forEach((tab) => {
    const active = tab.dataset.category === currentCategory;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  prepareReveals();
  if (shouldScroll) categoryHead.scrollIntoView({ behavior: "smooth", block: "start" });
}

function prepareReveals() {
  revealObserver?.disconnect();
  const cards = [...document.querySelectorAll(".other-card")];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5%" });
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
    revealObserver.observe(card);
  });
}

function updateLightbox() {
  const item = currentItems[currentIndex];
  if (!item) return;
  lightboxImage.src = `./${item.src}`;
  lightboxImage.alt = item.title;
  lightboxTitle.textContent = item.title;
  lightboxMeta.textContent = `${item.series} · ${item.en}`;
  lightboxProgress.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(currentItems.length).padStart(2, "0")}`;
}

function openLightbox(index) { currentIndex = index; updateLightbox(); lightbox.showModal(); }
function moveLightbox(direction) { currentIndex = (currentIndex + direction + currentItems.length) % currentItems.length; updateLightbox(); }

tabs.forEach((tab) => tab.addEventListener("click", () => {
  const key = tab.dataset.category;
  history.replaceState(null, "", `#${key}`);
  renderCategory(key, true);
}));
gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".other-card");
  if (card) openLightbox(Number(card.dataset.lightboxIndex));
});
lightbox.querySelector(".other-lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelectorAll("[data-direction]").forEach((button) => button.addEventListener("click", () => moveLightbox(button.dataset.direction === "next" ? 1 : -1)));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") moveLightbox(1);
  if (event.key === "ArrowLeft") moveLightbox(-1);
});
lightbox.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 55) moveLightbox(distance < 0 ? 1 : -1);
}, { passive: true });

const initialHash = location.hash.slice(1);
renderCategory(initialHash in otherCategories ? initialHash : "exhibition");

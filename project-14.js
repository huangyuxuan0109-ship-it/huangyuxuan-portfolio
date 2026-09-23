const materialCategories = {
  estate: {
    index: "01", title: "REAL ESTATE", zh: "地产现场", note: "建发现场导视、销售物料与三盛活动推广",
    series: [
      { title: "建发 · 户外现场", en: "JIANFA / OUTDOOR APPLICATION", items: [
        { src: "project-14-assets/jianfa-truss.jpg", title: "户外桁架", en: "OUTDOOR TRUSS", layout: "wide" },
        { src: "project-14-assets/jianfa-hoarding.jpg", title: "户外围挡", en: "SITE HOARDING", layout: "wide" },
        { src: "project-14-assets/jianfa-passage-01.jpg", title: "看房通道围挡 01", en: "VIEWING PASSAGE", layout: "standard" },
        { src: "project-14-assets/jianfa-passage-02.jpg", title: "看房通道围挡 02", en: "VIEWING PASSAGE", layout: "standard" }
      ]},
      { title: "建发 · 鹿溪映月", en: "LUXI YINGYUE / MATERIAL SYSTEM", items: [
        { src: "project-14-assets/jianfa-luxi-01.jpg", title: "项目物料设计 01", en: "MATERIAL APPLICATION", layout: "wide", fit: "complete" },
        { src: "project-14-assets/jianfa-luxi-02.jpg", title: "项目物料设计 02", en: "MATERIAL APPLICATION", layout: "wide" },
        { src: "project-14-assets/jianfa-luxi-03.jpg", title: "项目物料设计 03", en: "MATERIAL APPLICATION", layout: "standard" },
        { src: "project-14-assets/jianfa-luxi-04.jpg", title: "项目物料设计 04", en: "MATERIAL APPLICATION", layout: "standard" },
        { src: "project-14-assets/jianfa-luxi-05.jpg", title: "项目物料设计 05", en: "MATERIAL APPLICATION", layout: "standard", fit: "complete" }
      ]},
      { title: "三盛新春福利", en: "SANSHENG / NEW YEAR CAMPAIGN", items: [
        { src: "project-14-assets/sansheng-truss.jpg", title: "新春活动桁架", en: "CAMPAIGN TRUSS", layout: "wide" },
        { src: "project-14-assets/sansheng-coupon.jpg", title: "新春福利抵用券", en: "PROMOTIONAL COUPON", layout: "standard" }
      ]},
      { title: "三盛智享家", en: "SANSHENG / SMART COMMUNITY", items: [
        { src: "project-14-assets/sansheng-smart-banner.jpg", title: "智享家展架", en: "ROLL-UP BANNER", layout: "tall", fit: "complete" },
        { src: "project-14-assets/sansheng-smart-fold.jpg", title: "智享家折页", en: "FOLDING LEAFLET", layout: "standard" }
      ]}
    ]
  },
  education: {
    index: "02", title: "EDUCATION", zh: "教育空间", note: "阔野科学校园空间与赛事物料",
    series: [{ title: "阔野科学", en: "KOYA SCIENCE / SPACE GRAPHICS", items: [
      { src: "project-14-assets/koya-gate.jpg", title: "大门落地物料", en: "ENTRANCE INSTALLATION", layout: "wide" },
      { src: "project-14-assets/koya-backdrop.jpg", title: "合照背景板", en: "PHOTO BACKDROP", layout: "standard" },
      { src: "project-14-assets/koya-kt.jpg", title: "室内KT板", en: "EVENT DISPLAY SYSTEM", layout: "standard" },
      { src: "project-14-assets/koya-sign.jpg", title: "空间门牌", en: "ROOM SIGNAGE", layout: "standard" },
      { src: "project-14-assets/koya-id.jpg", title: "工作证", en: "WORK CARD", layout: "standard" }
    ]}]
  },
  commercial: {
    index: "03", title: "COMMERCIAL", zh: "商业宣传", note: "供应链、物流与品牌宣传物料",
    series: [
      { title: "大鲸供应链", en: "WHALE SUPPLY CHAIN", items: [
        { src: "project-14-assets/whale-board-01.jpg", title: "供应链展板 01", en: "DISPLAY BOARD", layout: "standard" },
        { src: "project-14-assets/whale-board-02.jpg", title: "供应链展板 02", en: "DISPLAY BOARD", layout: "standard" },
        { src: "project-14-assets/whale-fold-01.jpg", title: "A3对折页封面", en: "A3 FOLDING LEAFLET", layout: "standard" },
        { src: "project-14-assets/whale-fold-02.jpg", title: "A3对折页内页", en: "A3 FOLDING LEAFLET", layout: "standard" },
        { src: "project-14-assets/whale-fold-03.jpg", title: "A3对折页成品", en: "LEAFLET MOCKUP", layout: "standard" }
      ]},
      { title: "邑倍通", en: "YIBEITONG / LOGISTICS LEAFLET", items: [
        { src: "project-14-assets/ybt-fold-01.jpg", title: "A3对折页封面", en: "A3 FOLDING LEAFLET", layout: "standard" },
        { src: "project-14-assets/ybt-fold-02.jpg", title: "A3对折页内页", en: "A3 FOLDING LEAFLET", layout: "standard" },
        { src: "project-14-assets/ybt-fold-03.jpg", title: "A3对折页成品", en: "LEAFLET MOCKUP", layout: "standard" }
      ]}
    ]
  }
};

const gallery = document.querySelector("#material-gallery");
const tabs = [...document.querySelectorAll(".material-tab")];
const lightbox = document.querySelector("#material-lightbox");
const lightboxImage = document.querySelector("#material-lightbox-image");
const lightboxTitle = document.querySelector("#material-lightbox-title");
const lightboxMeta = document.querySelector("#material-lightbox-meta");
const lightboxProgress = document.querySelector("#material-lightbox-progress");
const categoryHead = document.querySelector("#material-category-head");
let currentCategory = "estate";
let currentItems = [];
let currentIndex = 0;
let revealObserver;
let touchStartX = 0;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

function renderCategory(key, shouldScroll = false) {
  const resolvedKey = key in materialCategories ? key : "estate";
  const category = materialCategories[resolvedKey];
  currentCategory = resolvedKey;
  document.body.dataset.materialCategory = resolvedKey;
  currentItems = category.series.flatMap((series) => series.items.map((item) => ({ ...item, series: series.title })));
  document.querySelector("#material-category-index").textContent = category.index;
  document.querySelector("#material-category-title").innerHTML = `${escapeHtml(category.title)} <small>${escapeHtml(category.zh)}</small>`;
  document.querySelector("#material-category-note").textContent = category.note;

  let globalIndex = 0;
  gallery.innerHTML = category.series.map((series, seriesIndex) => {
    const cards = series.items.map((item, itemIndex) => {
      const lightboxIndex = globalIndex++;
      const layoutClass = item.layout === "wide" ? "is-wide" : item.layout === "tall" ? "is-tall" : "";
      const fitClass = item.fit === "complete" ? "is-complete-fit" : "";
      return `<button type="button" class="material-card ${layoutClass} ${fitClass}" data-lightbox-index="${lightboxIndex}" aria-label="查看大图：${escapeHtml(item.title)}"><span class="material-media"><img src="./${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy" /></span><span class="material-caption"><span class="num">${String(itemIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.en)}</small></span></button>`;
    }).join("");
    return `<section class="material-series" aria-labelledby="material-series-${seriesIndex}"><header class="material-series-head"><h3 id="material-series-${seriesIndex}"><span>${String(seriesIndex + 1).padStart(2, "0")}</span>${escapeHtml(series.title)}</h3><p>${escapeHtml(series.en)}</p></header><div class="material-grid">${cards}</div></section>`;
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
  const cards = [...document.querySelectorAll(".material-card")];
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
  const card = event.target.closest(".material-card");
  if (card) openLightbox(Number(card.dataset.lightboxIndex));
});
lightbox.querySelector(".material-lightbox-close").addEventListener("click", () => lightbox.close());
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
renderCategory(initialHash in materialCategories ? initialHash : "estate");

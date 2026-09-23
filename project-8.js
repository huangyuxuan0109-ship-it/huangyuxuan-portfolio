(() => {
  const number = (value) => String(value).padStart(2, '0');
  const deckData = {
    education: {
      index: 'PROJECT 01 / EDUCATION',
      title: '课后服务数字化监管与提质方案',
      meta: '教育解决方案 · 21 PAGES',
      description: '围绕课后服务监管、平台建设与运营提质展开的完整解决方案。',
      pages: Array.from({ length: 21 }, (_, index) => `./project-5-assets/after-school-report/slides/slide-${index + 1}.png`)
    },
    sansheng: {
      index: 'PROJECT 02 / REAL ESTATE',
      title: '三盛国际海岸',
      meta: '地产项目提案 · 13 PAGES',
      description: '超宽版式保留原始画面比例，页面内容完整显示，不进行强制裁切。',
      pages: Array.from({ length: 13 }, (_, index) => `./project-8-assets/sansheng/page-${number(index + 1)}.jpg`)
    },
    lumini: {
      index: 'PROJECT 03 / TECHNOLOGY',
      title: '镭明士公司简介',
      meta: '科技企业介绍 · 30 PAGES',
      description: '以企业蓝为主视觉，完整呈现公司概况、产品、案例与发展历程。',
      pages: Array.from({ length: 30 }, (_, index) => `./project-8-assets/lumini/slide-${number(index + 1)}.jpg`)
    }
  };

  const viewerSection = document.querySelector('#ppt-viewer');
  const screen = document.querySelector('#ppt-zoom');
  const slideImage = document.querySelector('#ppt-slide-image');
  const imageError = document.querySelector('#ppt-image-error');
  const detailIndex = document.querySelector('#ppt-detail-index');
  const detailTitle = document.querySelector('#ppt-detail-title');
  const detailMeta = document.querySelector('#ppt-detail-meta');
  const detailDescription = document.querySelector('#ppt-detail-description');
  const thumbnails = document.querySelector('#ppt-thumbnails');
  const pageStatus = document.querySelector('#ppt-page-status');
  const progressBar = document.querySelector('#ppt-progress-bar');
  const prevButton = document.querySelector('#ppt-prev');
  const nextButton = document.querySelector('#ppt-next');
  const lightbox = document.querySelector('#ppt-lightbox');
  const lightboxTitle = document.querySelector('#ppt-lightbox-title');
  const lightboxStatus = document.querySelector('#ppt-lightbox-status');
  const lightboxImage = document.querySelector('#ppt-lightbox-image');
  const lightboxPrev = document.querySelector('#ppt-lightbox-prev');
  const lightboxNext = document.querySelector('#ppt-lightbox-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedKey = 'education';
  let currentPage = 0;
  let pointerStartX = null;

  const selectedDeck = () => deckData[selectedKey];
  const pageLabel = () => `${number(currentPage + 1)} / ${number(selectedDeck().pages.length)}`;

  function syncSelectionControls() {
    document.querySelectorAll('[data-deck]').forEach((control) => {
      const active = control.dataset.deck === selectedKey;
      control.classList.toggle('is-active', active);
      if (control.classList.contains('ppt-card')) control.setAttribute('aria-pressed', String(active));
      if (control.classList.contains('ppt-tab')) control.setAttribute('aria-selected', String(active));
    });
  }

  function buildThumbnails() {
    const fragment = document.createDocumentFragment();
    selectedDeck().pages.forEach((src, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ppt-thumb';
      button.setAttribute('aria-label', `查看第${index + 1}页`);
      button.innerHTML = `<img src="${src}" alt="" loading="lazy" /><span>VIEW ${number(index + 1)}</span>`;
      button.addEventListener('click', () => setPage(index));
      fragment.append(button);
    });
    thumbnails.replaceChildren(fragment);
  }

  function syncThumbnails() {
    const controls = [...thumbnails.querySelectorAll('.ppt-thumb')];
    controls.forEach((button, index) => button.classList.toggle('is-active', index === currentPage));
    const active = controls[currentPage];
    if (active && window.innerWidth > 760) {
      const top = active.offsetTop - thumbnails.offsetTop - (thumbnails.clientHeight - active.clientHeight) / 2;
      thumbnails.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  function preloadAdjacent() {
    const pages = selectedDeck().pages;
    [currentPage - 1, currentPage + 1].forEach((index) => {
      if (index >= 0 && index < pages.length) {
        const image = new Image();
        image.src = pages[index];
      }
    });
  }

  function updateLightbox() {
    const deck = selectedDeck();
    lightboxTitle.textContent = deck.title;
    lightboxStatus.textContent = pageLabel();
    lightboxImage.src = deck.pages[currentPage];
    lightboxImage.alt = `${deck.title}第${currentPage + 1}页大图`;
    lightboxPrev.disabled = currentPage === 0;
    lightboxNext.disabled = currentPage === deck.pages.length - 1;
  }

  function setPage(index) {
    const deck = selectedDeck();
    currentPage = Math.max(0, Math.min(deck.pages.length - 1, index));
    screen.classList.add('is-loading');
    imageError.hidden = true;
    slideImage.src = deck.pages[currentPage];
    slideImage.alt = `${deck.title}第${currentPage + 1}页`;
    if (slideImage.complete && slideImage.naturalWidth > 0) screen.classList.remove('is-loading');
    pageStatus.textContent = pageLabel();
    progressBar.style.width = `${((currentPage + 1) / deck.pages.length) * 100}%`;
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === deck.pages.length - 1;
    syncThumbnails();
    preloadAdjacent();
    if (lightbox.open) updateLightbox();
  }

  function setDeck(key, shouldScroll) {
    if (!deckData[key]) return;
    selectedKey = key;
    currentPage = 0;
    const deck = selectedDeck();
    detailIndex.textContent = deck.index;
    detailTitle.textContent = deck.title;
    detailMeta.textContent = deck.meta;
    detailDescription.textContent = deck.description;
    syncSelectionControls();
    buildThumbnails();
    setPage(0);
    if (shouldScroll) viewerSection.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  const changePage = (step) => setPage(currentPage + step);
  document.querySelectorAll('.ppt-card').forEach((card) => card.addEventListener('click', () => setDeck(card.dataset.deck, true)));
  document.querySelectorAll('.ppt-tab').forEach((tab) => tab.addEventListener('click', () => setDeck(tab.dataset.deck, false)));
  prevButton.addEventListener('click', () => changePage(-1));
  nextButton.addEventListener('click', () => changePage(1));
  slideImage.addEventListener('load', () => screen.classList.remove('is-loading'));
  slideImage.addEventListener('error', () => { screen.classList.remove('is-loading'); imageError.hidden = false; });

  screen.addEventListener('pointerdown', (event) => { pointerStartX = event.clientX; screen.setPointerCapture?.(event.pointerId); });
  screen.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) > 55) { changePage(distance < 0 ? 1 : -1); return; }
    updateLightbox();
    lightbox.showModal();
  });
  screen.addEventListener('pointercancel', () => { pointerStartX = null; });

  document.addEventListener('keydown', (event) => {
    if (lightbox.open) {
      if (event.key === 'Escape') lightbox.close();
      if (event.key === 'ArrowLeft') { event.preventDefault(); changePage(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); changePage(1); }
      return;
    }
    if (event.key === 'ArrowLeft') { event.preventDefault(); changePage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); changePage(1); }
  });
  document.querySelector('#ppt-lightbox-close').addEventListener('click', () => lightbox.close());
  lightboxPrev.addEventListener('click', () => changePage(-1));
  lightboxNext.addEventListener('click', () => changePage(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

  setDeck('education', false);
})();

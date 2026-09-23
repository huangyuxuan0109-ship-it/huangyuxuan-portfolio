(() => {
  const projectData = {
    course: { index: '01 / EDUCATION', title: '羊博士的奇妙实验室', meta: '课程介绍 · 10 PAGES', pages: Array.from({ length: 10 }, (_, index) => `./project-12-assets/course-${String(index + 1).padStart(2, '0')}.jpg`) },
    service: { index: '02 / EDUCATION', title: '课后服务解决方案', meta: '教育解决方案 · 9 PAGES', pages: Array.from({ length: 9 }, (_, index) => `./project-12-assets/service-${index + 1}.jpg`) },
    collaboration: { index: '03 / TECHNOLOGY', title: '乐享协同服务平台', meta: '平台介绍 · 3 PAGES', pages: Array.from({ length: 3 }, (_, index) => `./project-12-assets/collaboration-${index + 1}.jpg`) },
    xingyuanda: { index: '04 / TECHNOLOGY', title: '兴远达宣传册', meta: '企业宣传 · 16 PAGES', pages: Array.from({ length: 16 }, (_, index) => `./project-12-assets/xingyuanda-${String(index + 1).padStart(2, '0')}.jpg`) },
    water: { index: '05 / WATER', title: '直饮水系统工程方案', meta: '水务工程方案 · 8 PAGES', pages: Array.from({ length: 8 }, (_, index) => `./project-12-assets/water-${index + 1}.jpg`) }
  };
  const viewerSection = document.querySelector('#brochure-viewer');
  const viewer = document.querySelector('.brochure-page-viewer');
  const spread = document.querySelector('#brochure-zoom');
  const pageImage = document.querySelector('#brochure-page-image');
  const imageError = document.querySelector('#brochure-image-error');
  const detailIndex = document.querySelector('#brochure-detail-index');
  const detailTitle = document.querySelector('#brochure-detail-title');
  const detailMeta = document.querySelector('#brochure-detail-meta');
  const pageStatus = document.querySelector('#brochure-page-status');
  const pageIndex = document.querySelector('#brochure-page-index');
  const prevButton = document.querySelector('#brochure-prev');
  const nextButton = document.querySelector('#brochure-next');
  const lightbox = document.querySelector('#brochure-lightbox');
  const lightboxTitle = document.querySelector('#brochure-lightbox-title');
  const lightboxStatus = document.querySelector('#brochure-lightbox-status');
  const lightboxImage = document.querySelector('#brochure-lightbox-image');
  const lightboxPrev = document.querySelector('#brochure-lightbox-prev');
  const lightboxNext = document.querySelector('#brochure-lightbox-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedKey = 'course';
  let currentPage = 0;
  let pointerStartX = null;
  const selectedProject = () => projectData[selectedKey];
  const pageLabel = () => `${String(currentPage + 1).padStart(2, '0')} / ${String(selectedProject().pages.length).padStart(2, '0')}`;

  function updateSelectionControls() {
    document.querySelectorAll('[data-brochure]').forEach((control) => {
      const active = control.dataset.brochure === selectedKey;
      control.classList.toggle('is-active', active);
      if (control.classList.contains('brochure-card')) control.setAttribute('aria-pressed', String(active));
      if (control.classList.contains('brochure-tab')) control.setAttribute('aria-selected', String(active));
    });
  }
  function buildPageIndex() {
    pageIndex.replaceChildren();
    selectedProject().pages.forEach((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(index + 1).padStart(2, '0');
      button.setAttribute('aria-label', `查看第${index + 1}页`);
      button.classList.toggle('is-active', index === currentPage);
      button.addEventListener('click', () => setPage(index));
      pageIndex.append(button);
    });
  }
  function syncPageIndex() {
    pageIndex.querySelectorAll('button').forEach((button, index) => {
      const active = index === currentPage;
      button.classList.toggle('is-active', active);
      if (active) {
        const left = button.offsetLeft - (pageIndex.clientWidth - button.clientWidth) / 2;
        pageIndex.scrollTo({ left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    });
  }
  function preloadAdjacent() {
    const pages = selectedProject().pages;
    [currentPage - 1, currentPage + 1].forEach((index) => {
      if (index >= 0 && index < pages.length) { const image = new Image(); image.src = pages[index]; }
    });
  }
  function updateLightbox() {
    const project = selectedProject();
    lightboxTitle.textContent = project.title;
    lightboxStatus.textContent = pageLabel();
    lightboxImage.src = project.pages[currentPage];
    lightboxImage.alt = `${project.title}第${currentPage + 1}页大图`;
    lightboxPrev.disabled = currentPage === 0;
    lightboxNext.disabled = currentPage === project.pages.length - 1;
  }
  function setPage(index) {
    const project = selectedProject();
    currentPage = Math.max(0, Math.min(project.pages.length - 1, index));
    spread.classList.add('is-loading');
    imageError.hidden = true;
    pageImage.src = project.pages[currentPage];
    pageImage.alt = `${project.title}第${currentPage + 1}页`;
    if (pageImage.complete && pageImage.naturalWidth > 0) spread.classList.remove('is-loading');
    pageStatus.textContent = pageLabel();
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === project.pages.length - 1;
    syncPageIndex();
    preloadAdjacent();
    if (lightbox.open) updateLightbox();
  }
  function setProject(key, shouldScroll) {
    if (!projectData[key]) return;
    selectedKey = key;
    currentPage = 0;
    const project = selectedProject();
    detailIndex.textContent = project.index;
    detailTitle.textContent = project.title;
    detailMeta.textContent = project.meta;
    updateSelectionControls();
    buildPageIndex();
    setPage(0);
    if (shouldScroll) viewerSection.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }
  const changePage = (step) => setPage(currentPage + step);
  document.querySelectorAll('.brochure-card').forEach((card) => card.addEventListener('click', () => setProject(card.dataset.brochure, true)));
  document.querySelectorAll('.brochure-tab').forEach((tab) => tab.addEventListener('click', () => setProject(tab.dataset.brochure, false)));
  prevButton.addEventListener('click', () => changePage(-1));
  nextButton.addEventListener('click', () => changePage(1));
  pageImage.addEventListener('load', () => spread.classList.remove('is-loading'));
  pageImage.addEventListener('error', () => { spread.classList.remove('is-loading'); imageError.hidden = false; });
  spread.addEventListener('pointerdown', (event) => { pointerStartX = event.clientX; spread.setPointerCapture?.(event.pointerId); });
  spread.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) > 55) { changePage(distance < 0 ? 1 : -1); return; }
    updateLightbox();
    lightbox.showModal();
  });
  spread.addEventListener('pointercancel', () => { pointerStartX = null; });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); changePage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); changePage(1); }
  });
  document.querySelector('#brochure-lightbox-close').addEventListener('click', () => lightbox.close());
  lightboxPrev.addEventListener('click', () => changePage(-1));
  lightboxNext.addEventListener('click', () => changePage(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); changePage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); changePage(1); }
  });
  setProject('course', false);
})();

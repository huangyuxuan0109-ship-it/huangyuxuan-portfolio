(() => {
  const base = './project-13-assets/packaging/';
  const groups = [
    {
      id: 'gift', index: '01 / 03', zh: '礼盒包装', en: 'GIFT BOX',
      series: [
        {
          zh: '此去八千里', en: 'TRAVEL GIFT BOX', layout: 'pair',
          items: [
            ['gift-trip-mockup.webp', '成品效果', 'GIFT BOX'],
            ['gift-trip-flat.webp', '包装展开', 'FLAT ARTWORK']
          ]
        },
        {
          zh: '茶叶礼盒', en: 'TEA GIFT', layout: 'solo',
          items: [['gift-tea-box.webp', '茶叶礼盒', 'GIFT BOX']]
        }
      ]
    },
    {
      id: 'education', index: '02 / 03', zh: '教育套装', en: 'EDUCATION KIT',
      series: [
        {
          zh: '课后服务材料包 · 橙', en: 'ORANGE EDITION', layout: 'pair',
          items: [
            ['edu-kit-orange-flat.webp', '橙色包装展开', 'PACKAGE SYSTEM'],
            ['edu-kit-orange-detail.webp', '橙色成品细节', 'COLOR DETAIL']
          ]
        },
        {
          zh: '课后服务材料包 · 蓝', en: 'BLUE EDITION', layout: 'pair',
          items: [
            ['edu-kit-blue-flat.webp', '蓝色包装展开', 'PACKAGE SYSTEM'],
            ['edu-kit-blue-detail.webp', '蓝色成品细节', 'COLOR DETAIL']
          ]
        },
        {
          zh: '课后服务材料包 · 绿', en: 'GREEN EDITION', layout: 'pair',
          items: [
            ['edu-kit-green-flat.webp', '绿色包装展开', 'PACKAGE SYSTEM'],
            ['edu-kit-green-detail.webp', '绿色成品细节', 'COLOR DETAIL']
          ]
        },
        {
          zh: '实验主题不干胶标贴', en: 'LABEL SYSTEM', layout: 'trio',
          items: [
            ['edu-sticker-grade-1.webp', '一年级', 'GRADE 1'],
            ['edu-sticker-grade-2.webp', '二年级', 'GRADE 2'],
            ['edu-sticker-grade-3.webp', '三年级', 'GRADE 3']
          ]
        }
      ]
    },
    {
      id: 'stationery', index: '03 / 03', zh: '文具包装', en: 'STATIONERY',
      series: [
        {
          zh: '学习套装', en: 'SCHOOL SET', layout: 'pair',
          items: [
            ['stationery-school-set-card.webp', '学习套装吊卡', 'HANG TAG'],
            ['stationery-school-timetable.webp', '学习套装课程表', 'TIMETABLE']
          ]
        },
        {
          zh: '圆规包装', en: 'COMPASS SERIES', layout: 'pair',
          items: [
            ['stationery-orbit-compass.webp', 'Orbit 圆规 OPP 吊袋', 'ORBIT'],
            ['stationery-pioneer-compass.webp', 'Pioneer 圆规 OPP 吊袋', 'PIONEER']
          ]
        },
        {
          zh: 'Super Wings 系列', en: 'SUPER WINGS', layout: 'grid',
          items: [
            ['stationery-superwings-pencil.webp', '彩铅中盒', 'COLOR PENCIL'],
            ['stationery-superwings-book-cover.webp', '包书膜 OPP 袋', 'BOOK COVER'],
            ['stationery-superwings-stapler.webp', '订书机吊卡', 'HANG TAG'],
            ['stationery-superwings-correction-label.webp', '修正液标贴', 'LABEL'],
            ['stationery-superwings-correction-box.webp', '修正液彩盒', 'COLOR BOX']
          ]
        },
        {
          zh: 'Twist Me 系列', en: 'TWIST ME', layout: 'trio',
          items: [
            ['stationery-twist-ruler-set.webp', '软尺套尺', 'RULER SET'],
            ['stationery-twist-ruler-options.webp', '软尺图案方案', 'PATTERN SYSTEM'],
            ['stationery-twist-starry-set.webp', '星空套尺', 'STARRY SET']
          ]
        },
        {
          zh: 'Coloremotion', en: 'COLOR PENCIL', layout: 'solo',
          items: [['stationery-coloremotion-pencil.webp', 'Coloremotion 彩铅盒', 'COLOR PENCIL']]
        }
      ]
    }
  ];

  const gallery = document.getElementById('packaging-gallery');
  const filters = Array.from(document.querySelectorAll('.packaging-filter'));
  const dialog = document.getElementById('packaging-lightbox');
  const lightboxImage = document.getElementById('packaging-lightbox-image');
  const lightboxTitle = document.getElementById('packaging-lightbox-title');
  const lightboxMeta = document.getElementById('packaging-lightbox-meta');
  const lightboxProgress = document.getElementById('packaging-lightbox-progress');
  const closeButton = dialog.querySelector('.packaging-lightbox-close');
  const labels = { all: '精选作品', gift: '礼盒包装', education: '教育套装', stationery: '文具包装' };
  let activeFilter = 'all';
  let visibleItems = [];
  let currentIndex = 0;

  const allItems = groups.flatMap((group) => {
    let categoryIndex = 0;
    return group.series.flatMap((series) => series.items.map((item) => {
      categoryIndex += 1;
      return {
        group: group.id,
        groupName: group.zh,
        seriesName: series.zh,
        file: item[0],
        title: item[1],
        type: item[2],
        number: String(categoryIndex).padStart(2, '0')
      };
    }));
  });

  function cardTemplate(item) {
    return `
      <button class="packaging-card" type="button" data-file="${item.file}" aria-label="查看大图：${item.seriesName} · ${item.title}">
        <span class="packaging-card-frame">
          <img src="${base + item.file}" alt="${item.seriesName} · ${item.title}" loading="lazy" decoding="async" />
          <span class="packaging-card-view" aria-hidden="true">↗</span>
        </span>
        <span class="packaging-card-copy">
          <span class="packaging-card-number">${item.number}</span>
          <strong>${item.title}</strong>
          <small>${item.type}</small>
        </span>
      </button>`;
  }

  function seriesTemplate(group, series, seriesIndex) {
    const items = allItems.filter((item) => item.group === group.id && item.seriesName === series.zh);
    return `
      <section class="packaging-series${series.zh === '实验主题不干胶标贴' ? ' is-sticker-series' : ''}" aria-labelledby="packaging-series-${group.id}-${seriesIndex}">
        <header class="packaging-series-head">
          <h4 id="packaging-series-${group.id}-${seriesIndex}">${series.zh}<small>${series.en}</small></h4>
          <span>${String(items.length).padStart(2, '0')} IMAGES</span>
        </header>
        <div class="packaging-series-grid packaging-series-grid--${series.layout}">${items.map(cardTemplate).join('')}</div>
      </section>`;
  }

  function groupTemplate(group) {
    const itemCount = group.series.reduce((sum, series) => sum + series.items.length, 0);
    return `
      <section class="packaging-group" data-group="${group.id}" aria-labelledby="packaging-group-${group.id}">
        <header class="packaging-group-head">
          <span class="packaging-group-index">${group.index}</span>
          <h3 id="packaging-group-${group.id}">${group.zh}<small>${group.en}</small></h3>
          <span class="packaging-group-count">${String(itemCount).padStart(2, '0')} WORKS</span>
        </header>
        ${group.series.map((series, index) => seriesTemplate(group, series, index)).join('')}
      </section>`;
  }

  gallery.innerHTML = groups.map(groupTemplate).join('');
  const sections = Array.from(gallery.querySelectorAll('.packaging-group'));
  const cards = Array.from(gallery.querySelectorAll('.packaging-card'));

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: .06 }) : null;

  cards.forEach((card) => {
    if (observer) observer.observe(card);
    else card.classList.add('is-visible');
  });

  function applyFilter(filter, shouldScroll = false) {
    activeFilter = labels[filter] ? filter : 'all';
    filters.forEach((button) => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    sections.forEach((section) => { section.hidden = activeFilter !== 'all' && section.dataset.group !== activeFilter; });
    visibleItems = activeFilter === 'all' ? allItems : allItems.filter((item) => item.group === activeFilter);
    if (shouldScroll) document.querySelector('.packaging-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter, true)));

  function updateLightbox() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    lightboxImage.src = base + item.file;
    lightboxImage.alt = `${item.seriesName} · ${item.title}`;
    lightboxTitle.textContent = `${item.seriesName} · ${item.title}`;
    lightboxMeta.textContent = `${item.groupName} / ${item.type}`;
    lightboxProgress.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visibleItems.length).padStart(2, '0')}`;
  }

  function openLightbox(file) {
    const match = visibleItems.findIndex((item) => item.file === file);
    currentIndex = match >= 0 ? match : 0;
    updateLightbox();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function closeLightbox() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function moveLightbox(delta) {
    currentIndex = (currentIndex + delta + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }

  cards.forEach((card) => card.addEventListener('click', () => openLightbox(card.dataset.file)));
  closeButton.addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeLightbox(); });
  dialog.querySelector('[data-direction="prev"]').addEventListener('click', () => moveLightbox(-1));
  dialog.querySelector('[data-direction="next"]').addEventListener('click', () => moveLightbox(1));
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });

  applyFilter('all');
})();

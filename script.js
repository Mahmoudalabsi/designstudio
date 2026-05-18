'use strict';

document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 120, duration: 700, easing: 'ease-out-cubic', delay: 100 });
  }
  initStats();
  initCategories();
  initFeatured();
  initFontsPreview();
  initStickers();
  initBackgrounds();
  initToolsPreview();
  initMobileNav();
});

// ── Mobile Nav Toggle ──
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }
}

// ── Stats Counter ──
function initStats() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / 2000, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('ar-SA');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('ar-SA');
  }
  requestAnimationFrame(update);
}

// ── Categories ──
async function initCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
  
  try {
    const categories = await AndalusiAPI.getCategories();
    grid.innerHTML = '';
    const displayCats = categories.filter(c => c.icon && c.colors && c.colors[0] !== '#000000').slice(0, 24);
    
    displayCats.forEach((cat, index) => {
      const card = document.createElement('a');
      card.href = `templates.html?cat=${cat.id}`;
      card.className = 'category-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String(index * 40));
      
      const gradient = `linear-gradient(135deg, ${cat.colors[0]}, ${cat.colors[1] || cat.colors[0]})`;
      const isImg = cat.icon.match(/\.(png|jpg|webp|svg|gif)$/i);
      const iconHtml = isImg
        ? `<img src="${cat.icon}" alt="${cat.name}" class="category-icon-img" onerror="this.parentElement.textContent='${cat.name.charAt(0)}'">`
        : cat.icon;
      
      card.innerHTML = `
        <div class="category-icon" style="background: ${gradient}">${iconHtml}</div>
        <h3>${cat.name}</h3>
      `;
      grid.appendChild(card);
    });
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل التصنيفات</p>';
  }
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Featured Templates ──
async function initFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
  
  try {
    const result = await AndalusiAPI.getTemplates(1, 8);
    grid.innerHTML = '';
    
    result.templates.forEach((t, index) => {
      const card = document.createElement('div');
      card.className = 'api-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String(index * 60));
      
      const thumb = t.image ? AndalusiAPI.getThumb(t.image) : '';
      const dlLink = t.download_link || '#';
      const title = t.title || 'تصميم';
      
      card.innerHTML = `
        ${thumb ? `<img src="${thumb}" alt="${title}" class="api-card-thumb" loading="lazy" onerror="this.style.display='none'">` : `<div class="api-card-thumb" style="display:flex;align-items:center;justify-content:center;color:#c9a84c;font-weight:700;font-size:1.2rem;">${title}</div>`}
        <div class="api-card-body">
          <div class="api-card-title">${title}</div>
          <a href="${dlLink}" class="api-card-link" target="_blank" rel="noopener">تحميل التصميم ←</a>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل القوالب</p>';
  }
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Fonts Preview ──
async function initFontsPreview() {
  const grid = document.getElementById('fontsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
  
  try {
    const fontsData = await AndalusiAPI.getDesignData();
    grid.innerHTML = '';
    
    if (!fontsData || !fontsData.fonts) {
      grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل الخطوط</p>';
      return;
    }
    
    let rendered = 0;
    const groups = fontsData.fonts;
    
    for (const group of groups) {
      if (rendered >= 8) break;
      for (const sg of group.sub_groups || []) {
        if (rendered >= 8) break;
        for (const font of (sg.fonts || []).slice(0, 2)) {
          if (rendered >= 8) break;
          const thumbUrl = AndalusiAPI.getFontThumb(font);
          const fullName = font.full_name || font.save_name || 'خط';
          const downloadUrl = AndalusiAPI.getFontUrl(font);
          
          const card = document.createElement('div');
          card.className = 'font-card';
          card.setAttribute('data-aos', 'fade-up');
          card.setAttribute('data-aos-delay', String(rendered * 80));
          card.innerHTML = `
            ${thumbUrl ? `<img src="${thumbUrl}" alt="${fullName}" style="width:100%;aspect-ratio:2/1;object-fit:contain;border-radius:0.5rem;margin-bottom:0.75rem;background:#f9eed5;" loading="lazy" onerror="this.style.display='none'">` : '<div class="font-preview">خط عربي</div>'}
            <h3>${fullName}</h3>
            ${downloadUrl ? `<a href="${downloadUrl}" class="api-card-link" target="_blank" rel="noopener" style="margin-top:0.4rem;">تحميل الخط ←</a>` : ''}
          `;
          grid.appendChild(card);
          rendered++;
        }
      }
    }
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل الخطوط</p>';
  }
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Stickers ──
async function initStickers() {
  const grid = document.getElementById('stickersGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
  
  try {
    const sections = await AndalusiAPI.getStickers();
    grid.innerHTML = '';
    
    let totalRendered = 0;
    for (const section of sections.slice(0, 4)) {
      const title = section.title;
      if (!title) continue;
      const items = AndalusiAPI.extractSectionItems(section);
      if (items.length === 0) continue;
      
      const titleBar = document.createElement('div');
      titleBar.className = 'section-title-bar';
      titleBar.setAttribute('data-aos', 'fade-up');
      titleBar.style.gridColumn = '1 / -1';
      titleBar.innerHTML = `<h3>${title}</h3><span class="count-badge">${items.length} ستيكر</span>`;
      grid.appendChild(titleBar);
      
      for (const item of items.slice(0, 6)) {
        const card = document.createElement('div');
        card.className = 'sticker-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', String(totalRendered * 40));
        card.innerHTML = `
          ${item.thumb ? `<img src="${item.thumb}" alt="${item.title || 'ستيكر'}" style="width:60px;height:60px;object-fit:contain;margin:0 auto 0.5rem;display:block;" loading="lazy" onerror="this.style.display='none'">` : ''}
          <span class="sticker-name">${item.title || title}</span>
          ${item.url ? `<a href="${item.url}" class="api-card-link" target="_blank" rel="noopener" style="margin-top:0.3rem;font-size:0.7rem;">تحميل ←</a>` : ''}
        `;
        grid.appendChild(card);
        totalRendered++;
      }
    }
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل الستيكرات</p>';
  }
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Backgrounds ──
async function initBackgrounds() {
  const grid = document.getElementById('backgroundsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner">جاري التحميل...</div>';
  
  try {
    const homeSections = await AndalusiAPI.getHome();
    grid.innerHTML = '';
    
    const bgSections = homeSections.filter(s => s.title && s.title.includes('خلف'));
    
    for (const section of bgSections) {
      const items = AndalusiAPI.extractSectionItems(section);
      for (const item of items.slice(0, 6)) {
        const card = document.createElement('div');
        card.className = 'bg-card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
          ${item.thumb ? `<img src="${item.thumb}" alt="${item.title || 'خلفية'}" style="width:100%;height:120px;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">` : '<div class="bg-preview" style="height:120px;background:linear-gradient(135deg,#c9a84c,#a87c20);"></div>'}
          <div class="bg-info">
            <span class="bg-name">${item.title || section.title || 'خلفية'}</span>
            ${item.url ? `<a href="${item.url}" class="api-card-link" target="_blank" rel="noopener">تحميل الخلفية ←</a>` : ''}
          </div>
        `;
        grid.appendChild(card);
      }
    }
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:#999;">تعذر تحميل الخلفيات</p>';
  }
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Tools Preview (static) ──
function initToolsPreview() {
  const grid = document.getElementById('toolsGrid');
  if (!grid || typeof TOOLS === 'undefined') return;
  TOOLS.forEach((tool, index) => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(index * 80));
    card.innerHTML = `
      <div class="tool-icon" style="background: ${tool.color}">${tool.icon}</div>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
    `;
    grid.appendChild(card);
  });
}

// Footer animations
(function() {
  const els = document.querySelectorAll('.footer-grid, .footer-bar');
  if (!els.length) return;
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; });
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

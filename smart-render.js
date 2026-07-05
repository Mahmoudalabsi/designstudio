/**
 * ───────────────────────────────────────────────────────────
 *  smart-render.js - عرض تدريجي ذكي للأداء
 * ───────────────────────────────────────────────────────────
 *  يحل مشكلة التجمّد عند تحميل مئات العناصر دفعة واحدة.
 *
 *  الميزات:
 *  - عرض محدود لكل قسم (INITIAL_PER_SECTION)
 *  - زر "تحميل المزيد" لكل قسم
 *  - Lazy loading للصور (loading="lazy")
 *  - استخدام DocumentFragment لتحسين الأداء
 *  - requestAnimationFrame لتقسيم العمل
 */

const SmartRender = {
  // عدد العناصر المعروضة أولياً لكل قسم
  INITIAL_PER_SECTION: 8,
  // عدد العناصر الإضافية عند "تحميل المزيد"
  LOAD_MORE_INCREMENT: 12,
  // debounce للبحث
  SEARCH_DEBOUNCE_MS: 400,

  /**
   * إنشاء بطاقة عنصر واحدة
   * @param {Object} item - {thumb, title, downloadLink, isPremium, aspect}
   * @param {string} sectionTitle - عنوان القسم (للبديل)
   * @param {boolean} square - ما إذا كانت الصورة مربعة
   */
  createCard(item, sectionTitle, square) {
    const card = document.createElement('div');
    card.className = 'api-card';
    card.style.position = 'relative';

    let premiumBadge = '';
    if (item.isPremium) {
      premiumBadge = '<span style="position:absolute;top:8px;left:8px;background:#b8860b;color:#fff;font-size:0.6rem;padding:2px 6px;border-radius:999px;font-weight:700;z-index:2;">Plus</span>';
    }

    const thumbClass = square ? 'api-card-thumb square' : 'api-card-thumb';
    let imgHtml = '';
    if (item.thumb) {
      imgHtml = `<img src="${item.thumb}" alt="${item.title || sectionTitle}" class="${thumbClass}" loading="lazy" decoding="async" onerror="this.style.display='none'">`;
    } else {
      const bgStyle = square
        ? 'display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f9eed5;'
        : 'background:linear-gradient(135deg,#c9a84c,#a87c20);';
      const icon = square ? '🖼️' : '';
      imgHtml = `<div class="${thumbClass}" style="${bgStyle}">${icon}</div>`;
    }

    const linkHtml = item.downloadLink
      ? `<a href="${item.downloadLink}" class="api-card-link" target="_blank" rel="noopener">تحميل ←</a>`
      : '';

    card.innerHTML = premiumBadge + imgHtml +
      '<div class="api-card-body">' +
      `<div class="api-card-title">${item.title || sectionTitle}</div>` +
      linkHtml +
      '</div>';

    return card;
  },

  /**
   * عرض قسم واحد مع زر "تحميل المزيد"
   * @param {HTMLElement} container - الحاوية
   * @param {Object} section - {title, items, category}
   * @param {string} gridClass - كلاس الـ grid
   * @param {boolean} square - صور مربعة
   * @param {number} initialLimit - عدد العناصر الأولي
   */
  renderSection(container, section, gridClass, square, initialLimit) {
    if (!section.items || section.items.length === 0) return;

    const limit = initialLimit || this.INITIAL_PER_SECTION;
    const title = section.title;

    // عنوان القسم
    const titleBar = document.createElement('div');
    titleBar.className = 'section-title-bar';
    // إضافة data-category للسماح بالتمرير السلس للقسم
    if (section.category) {
      titleBar.setAttribute('data-category', section.category);
    }
    titleBar.setAttribute('data-aos', 'fade-up');
    const totalText = section.items.length + ' عنصر';
    titleBar.innerHTML = `<h3 style="font-size:1rem;">${title}</h3><span class="count-badge">${totalText}</span>`;
    container.appendChild(titleBar);

    // الشبكة
    const sectionGrid = document.createElement('div');
    sectionGrid.className = 'api-grid ' + gridClass;
    sectionGrid.style.marginBottom = '1rem';
    container.appendChild(sectionGrid);

    // دالة عرض مجموعة من العناصر (مع requestAnimationFrame)
    const renderBatch = (startIndex, endIndex) => {
      return new Promise(resolve => {
        const fragment = document.createDocumentFragment();
        const end = Math.min(endIndex, section.items.length);

        for (let i = startIndex; i < end; i++) {
          const card = this.createCard(section.items[i], title, square);
          fragment.appendChild(card);
        }

        sectionGrid.appendChild(fragment);
        resolve(end);
      });
    };

    // عرض الدفعة الأولى
    let currentCount = 0;
    renderBatch(0, limit).then(end => {
      currentCount = end;

      // إضافة زر "تحميل المزيد" إذا كان هناك عناصر إضافية
      if (currentCount < section.items.length) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.innerHTML = `تحميل المزيد <span class="load-more-count">(${section.items.length - currentCount} متبقي)</span>`;
        loadMoreBtn.setAttribute('data-aos', 'fade-up');

        loadMoreBtn.addEventListener('click', function() {
          const nextEnd = currentCount + SmartRender.LOAD_MORE_INCREMENT;
          renderBatch(currentCount, nextEnd).then(end => {
            currentCount = end;

            if (currentCount >= section.items.length) {
              // لا مزيد من العناصر
              loadMoreBtn.remove();
            } else {
              // تحديث العدد المتبقي
              const remaining = section.items.length - currentCount;
              loadMoreBtn.querySelector('.load-more-count').textContent = `(${remaining} متبقي)`;
            }

            if (typeof AOS !== 'undefined') AOS.refresh();
          });
        });

        // إضافة الزر في حاوية منفصلة
        const btnWrapper = document.createElement('div');
        btnWrapper.style.textAlign = 'center';
        btnWrapper.style.marginBottom = '1.5rem';
        btnWrapper.appendChild(loadMoreBtn);
        container.appendChild(btnWrapper);
      }
    });
  },

  /**
   * عرض مجموعة أقسام بشكل تدريجي
   * لتجنب تجميد المتصفح عند وجود أقسام كثيرة
   */
  renderSectionsProgressive(container, sections, gridClass, square, initialLimit) {
    if (!sections || sections.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#999;padding:3rem;">لا توجد عناصر مطابقة</p>';
      return;
    }

    container.innerHTML = '';

    // عدّاد النتائج
    const resultsBar = document.createElement('div');
    resultsBar.className = 'results-bar';
    const totalSections = sections.length;
    const totalItems = sections.reduce((sum, s) => sum + (s.items ? s.items.length : 0), 0);
    resultsBar.innerHTML = `<span>${totalSections} قسم</span> · <span>${totalItems} عنصر</span>`;
    container.appendChild(resultsBar);

    // عرض الأقسام تدريجياً (قسم كل إطار)
    let index = 0;
    const renderNext = () => {
      if (index >= sections.length) {
        if (typeof AOS !== 'undefined') AOS.refresh();
        return;
      }

      const section = sections[index];
      this.renderSection(container, section, gridClass, square, initialLimit);
      index++;

      // عرض القسم التالي في الإطار التالي (لإبقاء المتصفح مستجيباً)
      requestAnimationFrame(renderNext);
    };

    renderNext();
  }
};

// إضافة CSS تلقائياً
if (!document.getElementById('smart-render-styles')) {
  const style = document.createElement('style');
  style.id = 'smart-render-styles';
  style.textContent = `
    .load-more-btn {
      display: inline-block;
      padding: 0.7rem 1.5rem;
      font-size: 0.875rem;
      font-family: inherit;
      background: linear-gradient(135deg, rgba(201, 168, 76, 0.1), rgba(168, 124, 32, 0.05));
      color: #a87c20;
      border: 1.5px dashed rgba(201, 168, 76, 0.5);
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: 600;
    }
    .load-more-btn:hover {
      background: linear-gradient(135deg, #c9a84c, #a87c20);
      color: #fff;
      border-color: #a87c20;
      border-style: solid;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(168, 124, 32, 0.25);
    }
    .load-more-btn:active { transform: translateY(0); }
    .load-more-btn .load-more-count {
      font-weight: 400;
      opacity: 0.85;
      margin-inline-start: 0.3rem;
    }
  `;
  document.head.appendChild(style);
}

window.SmartRender = SmartRender;

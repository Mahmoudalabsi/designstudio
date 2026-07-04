// Andalusi API Module - مصمم الصور
const API_BASE = 'https://and.appchief.dev/api/v2.2/';

const AndalusiAPI = {
  // Fetch templates with pagination and optional category filter
  async getTemplates(page = 1, perPage = 15, categoryId = null) {
    let url = `${API_BASE}templates?page=${page}&per_page=${perPage}`;
    if (categoryId) {
      url += `&categories[]=${categoryId}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        return {
          templates: data.data.data.filter(t => t.type === 'template'),
          total: data.data.total,
          currentPage: data.data.current_page,
          totalPages: data.data.total_pages
        };
      }
    } catch (e) {
      console.error('Error fetching templates:', e);
    }
    return { templates: [], total: 0, currentPage: 1, totalPages: 1 };
  },

  // Fetch all template categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}template-categories`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
    return [];
  },

  // Fetch fonts data from designData endpoint
  async getDesignData() {
    try {
      const res = await fetch(`${API_BASE}designData`);
      const data = await res.json();
      if (data.success && data.data && data.data.fonts) {
        return data.data.fonts;
      }
    } catch (e) {
      console.error('Error fetching design data:', e);
    }
    return null;
  },

  // Fetch stickers data
  async getStickers() {
    try {
      const res = await fetch(`${API_BASE}stickers`);
      const data = await res.json();
      if (data.success && data.data && data.data.content) {
        return data.data.content;
      }
    } catch (e) {
      console.error('Error fetching stickers:', e);
    }
    return [];
  },

  // Fetch a specific preset (e.g., frames = 52)
  async getPreset(presetId) {
    try {
      const res = await fetch(`${API_BASE}presets/${presetId}`);
      const data = await res.json();
      if (data.success && data.data && data.data.content) {
        return data.data.content;
      }
    } catch (e) {
      console.error('Error fetching preset:', e);
    }
    return [];
  },

  // Fetch home data
  async getHome() {
    try {
      const res = await fetch(`${API_BASE}home`);
      const data = await res.json();
      if (data.success && data.data && data.data.content) {
        return data.data.content;
      }
    } catch (e) {
      console.error('Error fetching home:', e);
    }
    return [];
  },

  // Build image URL from dir and srcset entry
  buildImageUrl(dir, srcsetEntry) {
    if (!srcsetEntry) return '';
    const path = srcsetEntry.split(' ')[0];
    return dir + path;
  },

  // Get best thumbnail from image object
  getThumb(image) {
    if (!image || !image.srcset) return '';
    const dir = image.dir;
    // Prefer 2x for thumbnails
    for (const s of image.srcset) {
      if (s.includes('2x')) return this.buildImageUrl(dir, s);
    }
    // Fallback to 1x
    for (const s of image.srcset) {
      if (s.includes('1x')) return this.buildImageUrl(dir, s);
    }
    return this.buildImageUrl(dir, image.srcset[0]);
  },

  // Get full/original image URL from image object
  getOriginal(image) {
    if (!image || !image.srcset) return '';
    const dir = image.dir;
    for (const s of image.srcset) {
      if (s.includes('org')) return this.buildImageUrl(dir, s);
    }
    // Fallback: try .png or .gif (original files)
    for (const s of image.srcset) {
      if (!s.includes('-1x') && !s.includes('-2x') && !s.includes('-3x') && !s.includes('/c/')) {
        return this.buildImageUrl(dir, s);
      }
    }
    return this.getThumb(image);
  },

  // Extract items from a sticker/frame section (asset-grid type)
  extractAssetItems(section) {
    const items = [];
    if (!section || !section.items) return items;

    for (const item of section.items) {
      if (!item || typeof item !== 'object' || !item.items) continue;
      for (const sub of item.items) {
        if (!sub || typeof sub !== 'object') continue;
        
        const img = sub.image;
        const thumb = img ? this.getThumb(img) : '';
        const full = img ? this.getOriginal(img) : '';

        const action = sub.action || {};
        const actionTarget = action.target || '';
        const actionValue = (action && typeof action === 'object' && action.value) ? action.value : {};
        
        // Get download link from file property
        let dlLink = '';
        if (actionValue && actionValue.file) {
          dlLink = this.getOriginal(actionValue.file) || this.getThumb(actionValue.file);
        }
        
        const title = (actionValue && actionValue.title) ? actionValue.title : '';
        const id = (actionValue && actionValue.id) ? actionValue.id : '';
        const isPremium = actionValue.is_premium || false;

        items.push({
          thumb: thumb,
          url: full || dlLink,
          downloadLink: dlLink || full,
          aspect: sub.aspect || 1,
          title: title,
          id: id,
          isPremium: isPremium,
          target: actionTarget
        });
      }
    }
    return items;
  },

  // Extract items from a section (home or stickers) - legacy compatibility
  extractSectionItems(section) {
    return this.extractAssetItems(section);
  },

  // Build font thumbnail URL
  getFontThumb(font) {
    if (!font.thumb) return '';
    // Font thumbs can be relative paths like "media/21219/c/..." or "fonts/..."
    if (font.thumb.startsWith('http')) return font.thumb;
    return 'https://storage.appchief.dev/' + font.thumb;
  },

  // Get font download URL
  getFontUrl(font) {
    return font.url || '';
  },

  // ───────────────────────────────────────────────────────────
  //  دوال مساعدة للفلترة الذكية (بدلاً من الكلمات المفتاحية الهشة)
  // ───────────────────────────────────────────────────────────

  /**
   * تصنيف أقسام stickers تلقائياً بناءً على العنوان والمعرف.
   * يعيد خريطة: { frames: [...], backgrounds: [...], stickers: [...] }
   * كل قسم يحتوي على: { title, items (مستخرجة), section (الأصلي) }
   */
  categorizeStickerSections(sections) {
    const result = {
      frames: [],
      backgrounds: [],
      stickers: [],
      textArt: [],   // مخطوطات وحروف
      shapes: [],    // أشكال وزخارف
    };

    // كلمات تدل على الإطارات
    const frameKeywords = ['إطار', 'اطار', 'إطارات', 'اطارات', 'حدود', 'بوردر', 'تأطير'];
    // كلمات تدل على الخلفيات/التأثيرات
    const bgKeywords = ['تأثير', 'ضوء', 'ضوئية', 'دخان', 'غيوم', 'سفر', 'شتاء', 'ربيع', 'بوهو', 'بوهمي', 'ديكور', 'ورق', 'اوراق', 'فواصل', 'أزهار', 'ازهار', 'ورد', 'أوراق', 'نباتات', 'كواكب', 'تدرج', 'تدريج', 'نيون', 'ظل', 'ثلج', 'مطر', 'سماء', 'صحراء', 'شمس', 'قمر', 'نجوم', 'فرش', 'فرشاة', 'بريق', 'لامع'];
    // كلمات تدل على المخطوطات والحروف
    const textArtKeywords = ['مخطوطات', 'حروف', 'ديواني', 'ثلث', 'فرش', 'خط', 'اقتباس', 'اقتباسات', 'أقتباسات', 'أقواس', 'أشكال'];
    // كلمات تدل على الأشكال والزخارف
    const shapeKeywords = ['زخارف', 'زخرفة', 'زخرفية', 'مزخرف', 'أشكال', 'اشكال', 'أقواس', 'أسهم', 'فواصل', 'أشرطة', 'زوايا', 'محاريب', 'فن', 'إسلامي', 'اسلامي', 'أعلام', 'أيقونات', 'رموز', 'قلوب', 'بالونات', 'طيور', 'كواكب'];

    if (!Array.isArray(sections)) return result;

    sections.forEach(section => {
      if (!section || !section.title) return;
      // التأكد من وجود محتوى فعلي
      const hasAssetGrid = section.items && section.items.some(item =>
        item && item.type === 'asset-grid' && item.items && item.items.length > 0
      );
      if (!hasAssetGrid) return;

      const title = section.title;
      const entry = {
        title: title,
        items: this.extractAssetItems(section),
        section: section,
      };

      // تصنيف حسب الأولوية: الإطارات أولاً، ثم الخلفيات، إلخ
      let matched = false;

      if (frameKeywords.some(kw => title.includes(kw))) {
        result.frames.push(entry);
        matched = true;
      }
      if (bgKeywords.some(kw => title.includes(kw))) {
        result.backgrounds.push(entry);
        matched = true;
      }
      if (textArtKeywords.some(kw => title.includes(kw))) {
        result.textArt.push(entry);
        matched = true;
      }
      if (shapeKeywords.some(kw => title.includes(kw))) {
        result.shapes.push(entry);
        matched = true;
      }
      // إذا لم يطابق أي تصنيف، ضعه في stickers العام
      result.stickers.push(entry);
    });

    return result;
  },

  /**
   * دالة فلترة موحدة: تبحث في عنوان القسم وعناوين العناصر.
   * @param {Array} sections - مصفوفة الأقسام
   * @param {string} query - نص البحث
   * @returns {Array} - الأقسام المطاببة
   */
  filterSectionsByQuery(sections, query) {
    if (!query || !query.trim()) return sections;
    const q = query.trim().toLowerCase();
    return sections.filter(section => {
      if (!section) return false;
      // البحث في عنوان القسم
      if (section.title && section.title.toLowerCase().includes(q)) return true;
      // البحث في عناوين العناصر الفرعية
      if (section.items && Array.isArray(section.items)) {
        for (const item of section.items) {
          if (!item || !item.items) continue;
          for (const sub of item.items) {
            if (!sub) continue;
            const actionValue = sub.action && typeof sub.action === 'object' ? sub.action.value : {};
            const title = (actionValue && actionValue.title) ? actionValue.title : '';
            if (title && title.toLowerCase().includes(q)) return true;
          }
        }
      }
      return false;
    });
  },

  /**
   * استخراج جميع الـ presets المهمة (للإطارات، الأشكال، التأثيرات...).
   * IDs تم اكتشافها من الـ API الفعلي.
   */
  getAllUsefulPresets() {
    return [
      { id: 52, name: 'إطارات كلاسيكية', category: 'frames' },
      { id: 53, name: 'قصاصات ورقية', category: 'shapes' },
      { id: 56, name: 'ظلال', category: 'effects' },
      { id: 49, name: 'أشكال', category: 'shapes' },
      { id: 60, name: 'فواصل خطوط', category: 'shapes' },
      { id: 59, name: 'فن إسلامي', category: 'shapes' },
      { id: 62, name: 'حروف ديواني', category: 'textArt' },
      { id: 66, name: 'ورد', category: 'shapes' },
      { id: 32, name: 'تدرجات', category: 'backgrounds' },
      { id: 18, name: 'أقواس', category: 'shapes' },
      { id: 72, name: 'تأثيرات ذكاء اصطناعي', category: 'effects' },
    ];
  },

  /**
   * جلب لوحات الألوان (palettes endpoint - مكتشف حديثاً).
   */
  async getPalettes() {
    try {
      const res = await fetch(`${API_BASE}palettes`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (e) {
      console.error('Error fetching palettes:', e);
    }
    return [];
  }
};

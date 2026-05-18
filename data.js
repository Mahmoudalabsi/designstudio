// Andalusi Data for مصمم الصور Landing Page
const TEMPLATE_COUNT = 8339;
const FONT_COUNT = 471;
const STICKER_COUNT = 1200;

const CATEGORIES = [
  {
    "id": 18,
    "name": "زفاف",
    "slug": "زواج",
    "icon": "💍",
    "colors": [
      "#da679b",
      "#f773b9"
    ],
    "count": 1200
  },
  {
    "id": 109,
    "name": "دعوات",
    "slug": "دعوات",
    "icon": "💌",
    "colors": [
      "#e548ed",
      "#f2067f"
    ],
    "count": 950
  },
  {
    "id": 7,
    "name": "رمضان",
    "slug": "رمضان",
    "icon": "🌙",
    "colors": [
      "#1a6b4a",
      "#2d9f6f"
    ],
    "count": 800
  },
  {
    "id": 1,
    "name": "أعياد",
    "slug": "أعياد",
    "icon": "🎉",
    "colors": [
      "#e8b630",
      "#f5c842"
    ],
    "count": 700
  },
  {
    "id": 15,
    "name": "تخرج",
    "slug": "تخرج",
    "icon": "🎓",
    "colors": [
      "#3a5ba0",
      "#5a7fc4"
    ],
    "count": 500
  },
  {
    "id": 22,
    "name": "سناب شات",
    "slug": "سناب-شات",
    "icon": "👻",
    "colors": [
      "#fffc00",
      "#ffea00"
    ],
    "count": 600
  },
  {
    "id": 3,
    "name": "يوم وطني",
    "slug": "يوم-وطني",
    "icon": "🇸🇦",
    "colors": [
      "#006c35",
      "#008f45"
    ],
    "count": 450
  },
  {
    "id": 11,
    "name": "أعمال",
    "slug": "أعمال",
    "icon": "💼",
    "colors": [
      "#2c3e50",
      "#34495e"
    ],
    "count": 380
  },
  {
    "id": 25,
    "name": "إنستقرام",
    "slug": "انستقرام",
    "icon": "📸",
    "colors": [
      "#e1306c",
      "#fd1d1d"
    ],
    "count": 550
  },
  {
    "id": 14,
    "name": "تويتير",
    "slug": "تويتر",
    "icon": "🐦",
    "colors": [
      "#1da1f2",
      "#0d8ecf"
    ],
    "count": 400
  },
  {
    "id": 8,
    "name": "مولود",
    "slug": "مولود",
    "icon": "👶",
    "colors": [
      "#f8a5c2",
      "#f78fb3"
    ],
    "count": 350
  },
  {
    "id": 20,
    "name": "خطوبة",
    "slug": "خطوبة",
    "icon": "💎",
    "colors": [
      "#be2edd",
      "#9b59b6"
    ],
    "count": 300
  },
  {
    "id": 5,
    "name": "شكر",
    "slug": "شكر",
    "icon": "🙏",
    "colors": [
      "#6ab04c",
      "#78e08f"
    ],
    "count": 280
  },
  {
    "id": 16,
    "name": "يوتميوب",
    "slug": "يوتيوب",
    "icon": "▶️",
    "colors": [
      "#ff0000",
      "#cc0000"
    ],
    "count": 320
  },
  {
    "id": 10,
    "name": "تعزية",
    "slug": "تعزية",
    "icon": "🕊️",
    "colors": [
      "#555555",
      "#777777"
    ],
    "count": 250
  },
  {
    "id": 30,
    "name": "فتح القرآن",
    "slug": "فتح-القران",
    "icon": "📖",
    "colors": [
      "#c9a84c",
      "#a87c20"
    ],
    "count": 200
  },
  {
    "id": 31,
    "name": "مناسبات",
    "slug": "مناسبات",
    "icon": "🎊",
    "colors": [
      "#e74c3c",
      "#c0392b"
    ],
    "count": 180
  }
];

const FONTS = [
  {
    "id": 1,
    "name": "الخط العربي الأصيل",
    "style": "نسخ",
    "category": "كلاسيكي"
  },
  {
    "id": 2,
    "name": "خط الثلث العربي",
    "style": "ثلث",
    "category": "فني"
  },
  {
    "id": 3,
    "name": "خط الديواني المطور",
    "style": "ديواني",
    "category": "إبداعي"
  },
  {
    "id": 4,
    "name": "خط الرقعة الحديث",
    "style": "رقعة",
    "category": "عملي"
  },
  {
    "id": 5,
    "name": "خط النستعليق",
    "style": "نستعليق",
    "category": "فارسي"
  },
  {
    "id": 6,
    "name": "خط الفارسي الجميل",
    "style": "فارسي",
    "category": "إيراني"
  },
  {
    "id": 7,
    "name": "خط الكوفي الهندسي",
    "style": "كوفي",
    "category": "هندسي"
  },
  {
    "id": 8,
    "name": "خط المغربي الأندلسي",
    "style": "مغربي",
    "category": "أندلسي"
  },
  {
    "id": 9,
    "name": "خط الريحان",
    "style": "ريحان",
    "category": "كلاسيكي"
  },
  {
    "id": 10,
    "name": "خط الطباعة العريض",
    "style": "طباعة",
    "category": "حديث"
  },
  {
    "id": 11,
    "name": "خط السماء الصافي",
    "style": "نسخ",
    "category": "حديث"
  },
  {
    "id": 12,
    "name": "خط القلم الأمين",
    "style": "رقعة",
    "category": "عملي"
  },
  {
    "id": 13,
    "name": "خط الجلالة الفاخر",
    "style": "ثلث",
    "category": "فني"
  },
  {
    "id": 14,
    "name": "خط الضوء المشرق",
    "style": "نسخ",
    "category": "إبداعي"
  },
  {
    "id": 15,
    "name": "خط النور الخالد",
    "style": "ثلث",
    "category": "كلاسيكي"
  },
  {
    "id": 16,
    "name": "خط الشروق",
    "style": "كوفي",
    "category": "حديث"
  },
  {
    "id": 17,
    "name": "خط الأمالي",
    "style": "ديواني",
    "category": "إبداعي"
  },
  {
    "id": 18,
    "name": "خط التاج",
    "style": "ثلث",
    "category": "فاخر"
  },
  {
    "id": 19,
    "name": "خط اليراعة",
    "style": "رقعة",
    "category": "كلاسيكي"
  },
  {
    "id": 20,
    "name": "خط المصحف الشريف",
    "style": "نسخ",
    "category": "إسلامي"
  }
];

const TOOLS = [
  {
    "name": "إزالة الخلفية",
    "icon": "🖼️",
    "desc": "إزالة خلفية الصور بضغطة واحدة باستخدام الذكاء الاصطناعي",
    "color": "#6c5ce7"
  },
  {
    "name": "إضافة النصوص",
    "icon": "✍️",
    "desc": "أكثر من 471 خط عربي لكتابة نصوص بتصاميم متعددة ومتنوعة",
    "color": "#00b894"
  },
  {
    "name": "الفلاتر الإبداعية",
    "icon": "🎨",
    "desc": "مئات الفلاتر والتأثيرات البصرية لتحويل صورك العادية إلى تحف فنية",
    "color": "#fd79a8"
  },
  {
    "name": "ضبط الألوان",
    "icon": "🌈",
    "desc": "تعديل السطوع والتباين والتشبع وألوان الصورة بدقة احترافية",
    "color": "#fdcb6e"
  },
  {
    "name": "قص وتدوير",
    "icon": "✂️",
    "desc": "قص الصور بأبعاد مخصصة وتدويرها بالزاوية التي تريدها",
    "color": "#e17055"
  },
  {
    "name": "الملصقات والإطارات",
    "icon": "🎭",
    "desc": "آلاف الملصقات والإطارات الجاهزة لإضفاء لمسة إبداعية على تصاميمك",
    "color": "#0984e3"
  },
  {
    "name": "الطبقات المتعددة",
    "icon": "📑",
    "desc": "العمل بطبقات متعددة مثل الفوتوشوب لتحكم أكبر بالتصميم",
    "color": "#00cec9"
  },
  {
    "name": "التصدير المتعدد",
    "icon": "📤",
    "desc": "تصدير التصاميم بصيغ PNG وJPG وPDF بجودة عالية",
    "color": "#a29bfe"
  }
];

const STICKERS = [
  { "name": "زخارف إسلامية", "icon": "☪️", "count": 180 },
  { "name": "إطارات زفاف", "icon": "💒", "count": 150 },
  { "name": "ورود وزهور", "icon": "🌹", "count": 120 },
  { "name": "أشكال هندسية", "icon": "💎", "count": 95 },
  { "name": "أيقونات أعمال", "icon": "📊", "count": 80 },
  { "name": "نجوم وقلوب", "icon": "⭐", "count": 110 },
  { "name": "خطوط وزخارف", "icon": "🌀", "count": 90 },
  { "name": "أعلام ومناسبات", "icon": "🇸🇦", "count": 70 },
  { "name": "ستيكرات مضحكة", "icon": "😂", "count": 100 },
  { "name": "رمضان والأعياد", "icon": "🌙", "count": 85 },
  { "name": "فرشات تصميم", "icon": "🖌️", "count": 60 },
  { "name": "إطارات أنيقة", "icon": "🖼️", "count": 75 }
];

const BACKGROUNDS = [
  { "name": "تدرجات لونية", "icon": "🌈", "count": 250, "gradient": "linear-gradient(135deg, #667eea, #764ba2)" },
  { "name": "خلفيات زفاف", "icon": "💒", "count": 120, "gradient": "linear-gradient(135deg, #f8a5c2, #f3a7c5)" },
  { "name": "أنماط إسلامية", "icon": "🕌", "count": 85, "gradient": "linear-gradient(135deg, #1a6b4a, #2d9f6f)" },
  { "name": "طبيعة ومناظر", "icon": "🏔️", "count": 150, "gradient": "linear-gradient(135deg, #2d9f6f, #56ab2f)" },
  { "name": "أجواء رمضانية", "icon": "🌙", "count": 90, "gradient": "linear-gradient(135deg, #0f3443, #34e89e)" },
  { "name": "بكسل وترابط", "icon": "🎨", "count": 180, "gradient": "linear-gradient(135deg, #ee9ca7, #ffdde1)" },
  { "name": "خلفيات أعمال", "icon": "💼", "count": 100, "gradient": "linear-gradient(135deg, #2c3e50, #4ca1af)" },
  { "name": "أشكال هندسية", "icon": "🔷", "count": 130, "gradient": "linear-gradient(135deg, #c9a84c, #a87c20)" },
  { "name": "فضاء ونجوم", "icon": "🌌", "count": 75, "gradient": "linear-gradient(135deg, #0c0c3a, #1a1a6e)" },
  { "name": "ورود وزهور", "icon": "🌸", "count": 110, "gradient": "linear-gradient(135deg, #e8a0bf, #d66d8e)" },
  { "name": "خشب وتراث", "icon": "🪵", "count": 60, "gradient": "linear-gradient(135deg, #8B4513, #D2691E)" },
  { "name": "أعياد واحتفالات", "icon": "🎊", "count": 95, "gradient": "linear-gradient(135deg, #e74c3c, #f39c12)" }
];

const TEMPLATES = [
  {
    "id": 9231,
    "title": "تصميم بوست عيد",
    "category": "أعياد",
    "aspect": 1.0,
    "dir": "https://and.appchief.dev/cdn-cgi/image/format=webp/https://storage.appchief.dev/templates/April2026/7vkWJYKMxDWsXS2hGYjJ/"
  },
  {
    "id": 9131,
    "title": "تصميم يوم العمال",
    "category": "أعمال",
    "aspect": 0.8,
    "dir": "https://and.appchief.dev/cdn-cgi/image/format=webp/https://storage.appchief.dev/templates/April2026/IZ11ZBwBXK1N5LgH3tqM/"
  },
  {
    "id": 7815,
    "title": "دعوة زفاف أنيقة",
    "category": "زفاف",
    "aspect": 0.56,
    "dir": "https://and.appchief.dev/cdn-cgi/image/format=webp/https://storage.appchief.dev/templates/December2025/3GFl6FCR82qdqNHkd8kY/"
  }
];

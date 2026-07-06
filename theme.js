/**
 * ───────────────────────────────────────────────────────────
 *  theme.js - نظام اللغة والوضع المظلم
 * ───────────────────────────────────────────────────────────
 *  - يحفظ التفضيلات في localStorage
 *  - يطبق data-theme="dark|light" على <html>
 *  - يطبق data-lang="ar|en" على <html> ويبدل direction
 *  - يحقن قاموس الترجمة على العناصر التي تحتوي على data-i18n
 *  - يوفّر MuTheme.t(key, params) للنصوص الديناميكية
 */

(function () {
  'use strict';

  const STORAGE_THEME = 'mudesign.theme';
  const STORAGE_LANG = 'mudesign.lang';

  // ─── قاموس الترجمة الكامل ───
  const I18N = {
    ar: {
    "description": "قاموس النصوص المرئية المستخرجة من ملفات HTML للترجمة. تُستخدم المفاتيح بصيغة snake_case إنجليزي.",
    "note": "روابط الـ nav والـ data-i18n='brand_name' مُترجمة بالفعل وتُجاهلت هنا. ركّزنا على النصوص الثابتة فقط وتخطينا المحتوى الديناميكي القادم من API.",
    "shared_keys_note": "النصوص تحت 'shared' تظهر في جميع الصفحات (header/footer/nav-toggle). يمكن إعادة استخدامها بدل التكرار.",
    "files_count": 15,
    "nav_toggle_aria": "القائمة",
    "lang_btn_text": "EN",
    "theme_btn_aria": "Theme",
    "lang_btn_aria": "Language",
    "footer_brand_name": "استوديو التصاميم",
    "footer_tagline": "المنصة العربية الأولى للتصميم الاحترافي بلمسة فاخرة.",
    "footer_col_design": "التصميم",
    "footer_col_support": "الدعم",
    "footer_col_legal": "القوانين",
    "footer_link_templates": "القوالب الفاخرة",
    "footer_link_fonts": "الخطوط العربية",
    "footer_link_tools": "الأدوات المتقدمة",
    "footer_link_stickers": "الستيكرات",
    "footer_link_backgrounds": "الخلفيات",
    "footer_link_frames": "الإطارات",
    "footer_link_help_center": "مركز المساعدة",
    "footer_link_faq": "الأسئلة الشائعة",
    "footer_link_contact": "تواصل معنا",
    "footer_link_community": "المجتمع",
    "footer_link_terms": "الشروط والأحكام",
    "footer_link_privacy": "سياسة الخصوصية",
    "footer_link_cookies": "سياسة ملفات تعريف الارتباط",
    "footer_link_copyright": "حقوق الملكية",
    "footer_copyright": "&copy; 2025 استوديو التصاميم. جميع الحقوق محفوظة.",
    "index_title": "استوديو التصاميم",
    "index_og_title": "استوديو التصاميم - صمم صورك باحترافية",
    "index_og_description": "المنصة العربية الأولى للتصميم الاحترافي بلمسة فاخرة",
    "index_twitter_title": "استوديو التصاميم - صمم صورك باحترافية",
    "index_twitter_description": "المنصة العربية الأولى للتصميم الاحترافي بلمسة فاخرة.",
    "index_hero_h1": "صمّم صورك <span class=\"gold\">باحترافية</span><br /> بلمسة <span class=\"gold\">فاخرة</span> وسهلة",
    "index_hero_h1_highlight_1": "باحترافية",
    "index_hero_h1_highlight_2": "فاخرة",
    "index_hero_desc": "اصنع أجمل التصاميم التي تعبّر عن هويتك. قوالب حصرية، أدوات متقدمة، وتجربة مستخدم صُممت خصيصاً لك.",
    "index_store_google_play_small": "GET IT ON",
    "index_store_google_play_bold": "Google Play",
    "index_store_app_store_small": "Download on the",
    "index_store_app_store_bold": "App Store",
    "index_phone_mockup_alt": "واجهة التطبيق",
    "index_stat_templates": "قالب تصميم",
    "index_stat_fonts": "خط عربي",
    "index_stat_stickers": "ملصق وإطار",
    "index_stat_filters": "فلتر إبداعي",
    "index_categories_h2": "تصاميم <span class=\"gold\">لكل مناسبة</span>",
    "index_categories_h2_highlight": "لكل مناسبة",
    "index_categories_desc": "اختر من بين 17 تصنيفاً مختلفاً يناسب جميع احتياجاتك التصميمية",
    "index_featured_h2": "قوالب <span class=\"gold\">مميزة</span>",
    "index_featured_h2_highlight": "مميزة",
    "index_featured_desc": "أحدث القوالب المضافة إلى التطبيق بتصاميم عصرية وفاخرة",
    "index_featured_cta": "تصفح جميع القوالب",
    "index_fonts_h2": "خطوط عربية <span class=\"gold\">احترافية</span>",
    "index_fonts_h2_highlight": "احترافية",
    "index_fonts_desc": "أكثر من 471 خط عربي متنوع بين الكلاسيكي والحديث والفني",
    "index_fonts_cta": "تصفح جميع الخطوط",
    "index_stickers_h2": "ستيكرات <span class=\"gold\">إبداعية</span>",
    "index_stickers_h2_highlight": "إبداعية",
    "index_stickers_desc": "أكثر من 1,200 ستيكر وإطار جاهز لإضفاء لمسة مميزة على تصاميمك",
    "index_backgrounds_h2": "خلفيات <span class=\"gold\">مميزة</span>",
    "index_backgrounds_h2_highlight": "مميزة",
    "index_backgrounds_desc": "مئات الخلفيات الاحترافية بتصاميم متنوعة تناسب كل الأذواق",
    "index_tools_h2": "أدوات <span class=\"gold\">متقدمة</span>",
    "index_tools_h2_highlight": "متقدمة",
    "index_tools_desc": "مجموعة احترافية من الأدوات لتصميم صور فريدة ومميزة",
    "index_tools_cta": "تعرف على الأدوات",
    "templates_title": "القوالب الفاخرة - استوديو التصاميم",
    "templates_h1": "القوالب <span class=\"gold\">الفاخرة</span>",
    "templates_h1_highlight": "الفاخرة",
    "templates_desc": "أكثر من 8,355 قالب تصميم جاهز. اختر القالب الذي يناسبك وحمّله مباشرة.",
    "templates_search_placeholder": "🔍 ابحث عن تصنيف (مثال: اسلامي، عيد، قصة...)",
    "templates_search_clear_aria": "مسح",
    "templates_filter_all": "الكل",
    "templates_counter_categories_initial": "0 تصنيف",
    "templates_counter_templates_initial": "0 قالب",
    "templates_js_loading": "جاري التحميل...",
    "templates_js_default_title": "تصميم",
    "templates_js_download_link": "تحميل التصميم ←",
    "templates_js_load_more": "تحميل المزيد",
    "templates_js_active_badge_label": "التصنيف الحالي:",
    "templates_js_active_badge_clear_aria": "إلغاء التصنيف",
    "templates_js_active_badge_clear_title": "عرض الكل",
    "templates_js_counter_categories": "{count} تصنيف",
    "templates_js_counter_categories_filtered": "{shown} من {total} تصنيف",
    "templates_js_counter_templates": "{count} قالب",
    "templates_js_load_more_format": "تحميل المزيد ({page}/{total})",
    "templates_js_plus_badge": "Plus",
    "fonts_title": "الخطوط العربية - استوديو التصاميم",
    "fonts_h1": "الخطوط العربية",
    "fonts_desc": "أكثر من 471 خط عربي وعالمي متنوع يجمع بين الأصالة والحداثة. تصفح الخطوط وحمّل ما يناسبك.",
    "fonts_filter_all": "الكل",
    "fonts_js_loading": "جاري التحميل...",
    "fonts_js_load_error": "تعذر تحميل الخطوط",
    "fonts_js_no_fonts": "لا توجد خطوط",
    "fonts_js_default_name": "خط",
    "fonts_js_count_badge": "{count} خط",
    "fonts_js_download_link": "تحميل الخط ←",
    "fonts_js_badge_premium": "مميز",
    "fonts_js_badge_new": "جديد",
    "stickers_title": "الستيكرات - استوديو التصاميم",
    "stickers_h1": "الستيكرات <span class=\"gold\">والعناصر</span>",
    "stickers_h1_highlight": "والعناصر",
    "stickers_desc": "آلاف الستيكرات والعناصر الجاهزة للاستخدام. اختر أي ستيكر وحمّله مباشرة.",
    "stickers_search_placeholder": "ابحث عن ستيكر (مثال: قلوب، بالونات، أعلام...)",
    "stickers_search_clear_aria": "مسح",
    "stickers_filter_all": "الكل",
    "stickers_filter_elements": "عناصر",
    "stickers_filter_manuscripts": "مخطوطات",
    "stickers_filter_shapes": "أشكال",
    "stickers_filter_effects": "تأثيرات",
    "stickers_filter_frames": "إطارات",
    "stickers_js_loading": "جاري التحميل...",
    "stickers_js_no_stickers": "لا توجد ستيكرات متاحة",
    "backgrounds_title": "الخلفيات - استوديو التصاميم",
    "backgrounds_h1": "الخلفيات <span class=\"gold\">المميزة</span>",
    "backgrounds_h1_highlight": "المميزة",
    "backgrounds_desc": "مئات الخلفيات الاحترافية بتصاميم متنوعة. اختر خلفيتك المفضلة وحمّلها مباشرة.",
    "backgrounds_search_placeholder": "🔍 ابحث عن خلفية (مثال: ورد، تأثير، دخان...)",
    "backgrounds_search_clear_aria": "مسح",
    "backgrounds_filter_all": "الكل",
    "backgrounds_counter_categories_initial": "0 قسم",
    "backgrounds_counter_items_initial": "0 خلفية",
    "backgrounds_js_loading": "جاري التحميل...",
    "backgrounds_js_no_match": "لا توجد عناصر مطابقة",
    "backgrounds_js_default_item_title": "خلفية",
    "backgrounds_js_load_more": "تحميل المزيد",
    "backgrounds_js_load_more_remaining": "({count} متبقي)",
    "backgrounds_js_counter_categories": "{count} قسم",
    "backgrounds_js_counter_items": "{count} خلفية",
    "backgrounds_filter_cat_templates": "قوالب وإنفوجرافيك",
    "backgrounds_filter_cat_nature": "طبيعة وأزهار",
    "backgrounds_filter_cat_sky": "سماء وطقس",
    "backgrounds_filter_cat_neon": "نيون وتدرجات",
    "backgrounds_filter_cat_effects": "تأثيرات ودخان",
    "backgrounds_filter_cat_paper": "ورقية وقديمة",
    "backgrounds_filter_cat_decor": "زخارف إسلامية",
    "backgrounds_filter_cat_other": "أخرى",
    "frames_title": "الإطارات - استوديو التصاميم",
    "frames_h1": "الإطارات <span class=\"gold\">والزخارف</span>",
    "frames_h1_highlight": "والزخارف",
    "frames_desc": "مئات الإطارات والزخارف الاحترافية بتصاميم متنوعة. اختر إطارك المفضل وحمّله مباشرة.",
    "frames_search_placeholder": "🔍 ابحث عن إطار (مثال: كلاسيكية، ورقية، زهور...)",
    "frames_search_clear_aria": "مسح",
    "frames_filter_all": "الكل",
    "frames_counter_categories_initial": "0 قسم",
    "frames_counter_items_initial": "0 إطار",
    "frames_js_loading": "جاري التحميل...",
    "frames_js_counter_categories": "{count} قسم",
    "frames_js_counter_items": "{count} إطار",
    "frames_filter_cat_all": "الكل",
    "frames_filter_cat_classic": "كلاسيكية",
    "frames_filter_cat_decorated": "مزخرفة",
    "frames_filter_cat_flowers": "زهور",
    "frames_filter_cat_paper": "ورقية وقديمة",
    "frames_filter_cat_invitations": "دعوات وشهادات",
    "frames_filter_cat_quotes": "اقتباسات",
    "frames_filter_cat_other": "أخرى",
    "tools_title": "الأدوات المتقدمة - استوديو التصاميم",
    "tools_h1": "الأدوات المتقدمة",
    "tools_desc": "مجموعة احترافية من الأدوات المصممة خصيصاً لصناعة تصاميم استثنائية. من إزالة الخلفية إلى الطبقات المتعددة، كل ما تحتاجه في مكان واحد.",
    "help_title": "مركز المساعدة - استوديو التصاميم",
    "help_h1": "مركز المساعدة",
    "help_desc": "ابحث عن إجابات لأسئلتك أو تواصل مع فريق الدعم.",
    "help_topic_quick_start": "البدء السريع",
    "help_link_use_site": "كيفية استخدام الموقع",
    "help_link_browse_templates": "تصفح القوالب",
    "help_link_contact_support": "تواصل مع الدعم",
    "help_topic_design": "القوالب والتصميم",
    "help_link_choose_template": "اختيار القالب المناسب",
    "help_link_customize_fonts": "تخصيص الخطوط",
    "help_link_change_backgrounds": "تغيير الخلفيات",
    "help_link_add_frames": "إضافة الإطارات",
    "help_topic_advanced": "الأدوات المتقدمة",
    "help_link_tools_list": "قائمة الأدوات",
    "help_link_faq": "الأسئلة الشائعة",
    "help_topic_account": "الحساب والدعم",
    "help_link_contact_us": "تواصل معنا",
    "help_link_community": "المجتمع",
    "help_link_terms": "الشروط والأحكام",
    "help_link_privacy": "سياسة الخصوصية",
    "faq_title": "الأسئلة الشائعة - استوديو التصاميم",
    "faq_h1": "الأسئلة الشائعة",
    "faq_desc": "إجابات على أكثر الأسئلة شيوعاً.",
    "faq_q1": "ما هو تطبيق استوديو التصاميم؟",
    "faq_a1": "استوديو التصاميم هو تطبيق تصميم عربي يتيح لك إنشاء تصاميم احترافية بسهولة باستخدام قوالب وفيرة وأدوات متقدمة.",
    "faq_q2": "هل التطبيق مجاني؟",
    "faq_a2": "نعم، التطبيق مجاني للتحميل والاستخدام مع قوالب مجانية. يمكن الاشتراك في الخطة premium للحصول على قوالب وحقوق إضافية.",
    "faq_q3": "كيف أحفظ تصميمي؟",
    "faq_a3": "بعد الانتهاء من التصميم، اضغط على زر \"حفظ\" واختر الصيغة المطلوبة (PNG أو JPG).",
    "faq_q4": "هل يمكنني استخدام التصاميم تجارياً؟",
    "faq_a4": "نعم، بمجرد الاشتراك في التطبيق، تصبح التصاميم ملكاً لك ويمكن استخدامها تجارياً.",
    "faq_q5": "كيف أتواصل مع الدعم؟",
    "faq_a5": "يمكنكم التواصل معنا عبر نموذج التواصل في صفحة تواصل معنا أو عبر وسائل التواصل الاجتماعي.",
    "contact_title": "تواصل معنا - استوديو التصاميم",
    "contact_h1": "تواصل معنا",
    "contact_desc": "لأي استفسار أو اقتراح، يمكنكم التواصل معنا.",
    "contact_label_name": "الاسم",
    "contact_placeholder_name": "أدخل اسمك",
    "contact_label_email": "البريد الإلكتروني",
    "contact_placeholder_email": "أدخل بريدك الإلكتروني",
    "contact_label_message": "الرسالة",
    "contact_placeholder_message": "أدخل رسالتك",
    "contact_submit": "إرسال",
    "community_title": "المجتمع - استوديو التصاميم",
    "community_h1": "المجتمع",
    "community_desc": "انضم إلى مجتمع مصممي الصور وشارك إبداعاتك.",
    "community_feature_gallery": "المعرض",
    "community_feature_gallery_desc": "استعرض أعمال المصمين العرب ومشارك إبداعاتك.",
    "community_feature_courses": "الدورات",
    "community_feature_courses_desc": "تعلم أساسيات التصميم من خلال دورات مجانية.",
    "community_feature_challenges": "التحديات",
    "community_feature_challenges_desc": "شارك في تحديات التصميم الأسبوعية.",
    "community_feature_chat": "الحوار",
    "community_feature_chat_desc": "تحدث مع مصمين آخرين وشارك الخبرات.",
    "terms_title": "الشروط والأحكام - استوديو التصاميم",
    "terms_h1": "الشروط والأحكام",
    "terms_last_update": "آخر تحديث: يناير 2025",
    "terms_section_1_title": "1. القبول",
    "terms_section_1_body": "باستخدام تطبيق استوديو التصاميم، فأنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق مع أي من هذه الشروط، فلا يجوز لك استخدام التطبيق.",
    "terms_section_2_title": "2. استخدام الخدمة",
    "terms_section_2_body": "يمنحك تطبيق استوديو التصاميم ترخيصاً محدوداً وغير حصري لاستخدام التطبيق للأغراض الشخصية وغير التجارية.",
    "terms_section_3_title": "3. الحسابات",
    "terms_section_3_body": "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة مرورك. أنت توافق على إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.",
    "terms_section_4_title": "4. المحتوى",
    "terms_section_4_body": "أنت تحتفظ بملكية أي محتوى تنشئه باستخدام التطبيق. بتحميل المحتوى، فأنت تمنحنا ترخيصاً لاستخدامه لتشغيل الخدمة.",
    "terms_section_5_title": "5. الإلغاء",
    "terms_section_5_body": "نحتفظ بالحق في إنهاء وصولك إلى الخدمة في أي وقت، دون إشعار مسبق، لأي سبب.",
    "terms_section_6_title": "6. التعديلات",
    "terms_section_6_body": "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية.",
    "terms_section_7_title": "7. الاتصال",
    "terms_section_7_body": "إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا.",
    "privacy_title": "سياسة الخصوصية - استوديو التصاميم",
    "privacy_h1": "سياسة الخصوصية",
    "privacy_last_update": "آخر تحديث: يناير 2025",
    "privacy_section_1_title": "1. مقدمة",
    "privacy_section_1_body": "نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.",
    "privacy_section_2_title": "2. المعلومات التي نجمعها",
    "privacy_section_2_body": "- المعلومات التي تقدمها: الاسم، البريد الإلكتروني، والصور التي ترفعها.\n- معلومات الاستخدام: كيفية تفاعلك مع التطبيق.\n- معلومات الجهاز: نوع الجهاز، نظام التشغيل.",
    "privacy_section_3_title": "3. كيفية استخدام المعلومات",
    "privacy_section_3_body": "نستخدم المعلومات لتحسين الخدمة، تخصيص تجربتك، التواصل معك، وتوفير الدعم.",
    "privacy_section_4_title": "4. مشاركة المعلومات",
    "privacy_section_4_body": "لا نبيع معلوماتك الشخصية. يمكننا مشاركة المعلومات مع مزودي الخدمة الذين يساعدوننا في تشغيل التطبيق.",
    "privacy_section_5_title": "5. أمان البيانات",
    "privacy_section_5_body": "نستخدم إجراءات أمان متقدمة لحماية معلوماتك. ومع ذلك، لا يمكن ضمان أمان 100%.",
    "privacy_section_6_title": "6. حقوقك",
    "privacy_section_6_body": "لديك الحق في الوصول إلى بياناتك، تصحيحها، وحذفها. تواصل معنا لممارسة هذه الحقوق.",
    "privacy_section_7_title": "7. التغييرات",
    "privacy_section_7_body": "قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية.",
    "privacy_section_8_title": "8. الاتصال",
    "privacy_section_8_body": "إذا كان لديك أسئلة حول هذه السياسة، تواصل معنا.",
    "cookies_title": "سياسة ملفات تعريف الارتباط - استوديو التصاميم",
    "cookies_h1": "سياسة ملفات تعريف الارتباط",
    "cookies_last_update": "آخر تحديث: يناير 2025",
    "cookies_section_1_title": "1. مقدمة",
    "cookies_section_1_body": "نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك. تعرف على كيفية استخدامنا لهذه الملفات.",
    "cookies_section_2_title": "2. ما هي ملفات تعريف الارتباط؟",
    "cookies_section_2_body": "ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة المواقع.",
    "cookies_section_3_title": "3. أنواع الملفات التي نستخدمها",
    "cookies_section_3_body": "الضرورية: ضرورية لتشغيل التطبيق.\nالتحليلية: تساعدنا في فهم كيفية استخدام التطبيق.\nالوظيفية: تتيح ميزات متقدمة.\nالتسويقية: تُستخدم لعرض إعلانات ذات صلة.",
    "cookies_strong_essential": "الضرورية:",
    "cookies_strong_analytics": "التحليلية:",
    "cookies_strong_functional": "الوظيفية:",
    "cookies_strong_marketing": "التسويقية:",
    "cookies_section_4_title": "4. التحكم في الملفات",
    "cookies_section_4_body": "يمكنك التحكم في ملفات تعريف الارتباط أو حذفها من متصفحك. لكن ذلك قد يؤثر على بعض الميزات.",
    "cookies_section_5_title": "5. ملفات تعريف الارتباط الخاصة بالطرف الثالث",
    "cookies_section_5_body": "قد نستخدم ملفات من أطراف ثالثة مثل Google Analytics لتحليل الاستخدام.",
    "cookies_section_6_title": "6. التحديثات",
    "cookies_section_6_body": "قد نحدث هذه السياسة بشكل دوري. سنخطرك بأي تغييرات.",
    "cookies_section_7_title": "7. الاتصال",
    "cookies_section_7_body": "لأي أسئلة حول هذه السياسة، تواصل معنا.",
    "copyright_title": "حقوق الملكية - استوديو التصاميم",
    "copyright_h1": "حقوق الملكية",
    "copyright_last_update": "آخر تحديث: يناير 2025",
    "copyright_section_1_title": "1. مقدمة",
    "copyright_section_1_body": "توضح هذه الصفحة حقوق الملكية الفكرية المتعلقة بتطبيق استوديو التصاميم.",
    "copyright_section_2_title": "2. حقوق التطبيق",
    "copyright_section_2_body": "جميع حقوق التصميم والتطوير والتشغيل الخاص بتطبيق استوديو التصاميم محفوظة لنا. لا يُسمح بنسخ أو تعديل أو توزيع التطبيق دون إذن.",
    "copyright_section_3_title": "3. القوالب",
    "copyright_section_3_body": "القوالب المجانية: يمكنك استخدامها للأغراض الشخصية.\nالقوالب المدفوعة: بمجرد الشراء، يمكنك استخدامها للأغراض التجارية.",
    "copyright_strong_free": "القوالب المجانية:",
    "copyright_strong_paid": "القوالب المدفوعة:",
    "copyright_section_4_title": "4. شعارات العلامات التجارية",
    "copyright_section_4_body": "شعارات Google Play وApple وSamsung وغيرها من العلامات التجارية هي ملك لأصحابها. لا نطالب بملكيتها.",
    "copyright_section_5_title": "5. المحتوى الذي ينشئه المستخدمون",
    "copyright_section_5_body": "تصاميمك تظل ملكك. بتحميلها، تمنحنا ترخيصاً محدوداً لعرضها على التطبيق.",
    "copyright_section_6_title": "6. الإبلاغ عن انتهاكات حقوق الطبع والنشر",
    "copyright_section_6_body": "إذا كنت تعتقد أن عملك قد تم استخدامه دون إذن، تواصل معنا.",
    "copyright_section_7_title": "7. التغييرات",
    "copyright_section_7_body": "قد نحدث هذه السياسة من وقت لآخر. تحقق بانتظام للتحديثات.",
    "copyright_section_8_title": "8. الاتصال",
    "copyright_section_8_body": "لأي أسئلة حول حقوق الملكية، تواصل معنا.",
    "brand_name": "استوديو التصاميم",
    "nav_templates": "القوالب",
    "nav_fonts": "الخطوط",
    "nav_stickers": "الستيكرات",
    "nav_backgrounds": "الخلفيات",
    "nav_frames": "الإطارات",
    "nav_help": "الدعم",
    "nav_studio": "استوديو التحويل",
    "studio_cta_title_ar": "استوديو",
    "studio_cta_title": "استوديو <span class=\"gold\">تحويل التصاميم</span>",
    "studio_cta_subtitle": "أداة احترافية لتحويل ورندر تصاميم Antigravity — ارفع ملف ZIP وحوّله إلى صيغة Export Pro بنقرة واحدة",
    "studio_btn_small": "أداة جديدة",
    "studio_btn_main": "افتح استوديو التحويل"
},
    en: {
    "description": "قاموس النصوص المرئية المستخرجة من ملفات HTML للترجمة. تُستخدم المفاتيح بصيغة snake_case إنجليزي.",
    "note": "روابط الـ nav والـ data-i18n='brand_name' مُترجمة بالفعل وتُجاهلت هنا. ركّزنا على النصوص الثابتة فقط وتخطينا المحتوى الديناميكي القادم من API.",
    "shared_keys_note": "النصوص تحت 'shared' تظهر في جميع الصفحات (header/footer/nav-toggle). يمكن إعادة استخدامها بدل التكرار.",
    "files_count": 15,
    "nav_toggle_aria": "Menu",
    "lang_btn_text": "EN",
    "theme_btn_aria": "Theme",
    "lang_btn_aria": "Language",
    "footer_brand_name": "Design Studio",
    "footer_tagline": "The first Arabic platform for professional design with a luxurious touch.",
    "footer_col_design": "Design",
    "footer_col_support": "Support",
    "footer_col_legal": "Legal",
    "footer_link_templates": "Premium Templates",
    "footer_link_fonts": "Arabic Fonts",
    "footer_link_tools": "Advanced Tools",
    "footer_link_stickers": "Stickers",
    "footer_link_backgrounds": "Backgrounds",
    "footer_link_frames": "Frames",
    "footer_link_help_center": "Help Center",
    "footer_link_faq": "FAQ",
    "footer_link_contact": "Contact Us",
    "footer_link_community": "Community",
    "footer_link_terms": "Terms & Conditions",
    "footer_link_privacy": "Privacy Policy",
    "footer_link_cookies": "Cookie Policy",
    "footer_link_copyright": "Copyright",
    "footer_copyright": "© 2025 Design Studio. All rights reserved.",
    "index_title": "Design Studio",
    "index_og_title": "Design Studio - Design Professionally",
    "index_og_description": "The first Arabic platform for professional design with a luxurious touch",
    "index_twitter_title": "Design Studio - Design Professionally",
    "index_twitter_description": "The first Arabic platform for professional design with a luxurious touch.",
    "index_hero_h1": "Design your images <span class=\"gold\">professionally</span><br /> with a <span class=\"gold\">luxurious</span> and easy touch",
    "index_hero_h1_highlight_1": "professionally",
    "index_hero_h1_highlight_2": "luxurious",
    "index_hero_desc": "Create the most beautiful designs that express your identity. Exclusive templates, advanced tools, and a user experience crafted specifically for you.",
    "index_store_google_play_small": "GET IT ON",
    "index_store_google_play_bold": "Google Play",
    "index_store_app_store_small": "Download on the",
    "index_store_app_store_bold": "App Store",
    "index_phone_mockup_alt": "App Interface",
    "index_stat_templates": "Design Templates",
    "index_stat_fonts": "Arabic Fonts",
    "index_stat_stickers": "Stickers & Frames",
    "index_stat_filters": "Creative Filters",
    "index_categories_h2": "Designs <span class=\"gold\">for every occasion</span>",
    "index_categories_h2_highlight": "every occasion",
    "index_categories_desc": "Choose from 17 different categories that suit all your design needs",
    "index_featured_h2": "Featured <span class=\"gold\">templates</span>",
    "index_featured_h2_highlight": "Featured",
    "index_featured_desc": "The latest templates added to the app with modern and luxurious designs",
    "index_featured_cta": "Browse all templates",
    "index_fonts_h2": "Professional <span class=\"gold\">Arabic fonts</span>",
    "index_fonts_h2_highlight": "Professional",
    "index_fonts_desc": "More than 471 diverse Arabic fonts combining classic, modern, and artistic styles",
    "index_fonts_cta": "Browse all fonts",
    "index_stickers_h2": "Creative <span class=\"gold\">stickers</span>",
    "index_stickers_h2_highlight": "Creative",
    "index_stickers_desc": "More than 1,200 stickers and frames ready to add a distinctive touch to your designs",
    "index_backgrounds_h2": "Featured <span class=\"gold\">backgrounds</span>",
    "index_backgrounds_h2_highlight": "Featured",
    "index_backgrounds_desc": "Hundreds of professional backgrounds with diverse designs that suit all tastes",
    "index_tools_h2": "Advanced <span class=\"gold\">tools</span>",
    "index_tools_h2_highlight": "Advanced",
    "index_tools_desc": "A professional set of tools for designing unique and distinctive images",
    "index_tools_cta": "Explore tools",
    "templates_title": "Premium Templates - Design Studio",
    "templates_h1": "Premium <span class=\"gold\">Templates</span>",
    "templates_h1_highlight": "Templates",
    "templates_desc": "More than 8,355 ready-made design templates. Choose the template that suits you and download it directly.",
    "templates_search_placeholder": "🔍 Search for a category (e.g.: Islamic, Eid, Story...)",
    "templates_search_clear_aria": "Clear",
    "templates_filter_all": "All",
    "templates_counter_categories_initial": "0 categories",
    "templates_counter_templates_initial": "0 templates",
    "templates_js_loading": "Loading...",
    "templates_js_default_title": "Design",
    "templates_js_download_link": "Download Design ←",
    "templates_js_load_more": "Load More",
    "templates_js_active_badge_label": "Current Category:",
    "templates_js_active_badge_clear_aria": "Clear Category",
    "templates_js_active_badge_clear_title": "Show All",
    "templates_js_counter_categories": "{count} categories",
    "templates_js_counter_categories_filtered": "{shown} of {total} categories",
    "templates_js_counter_templates": "{count} templates",
    "templates_js_load_more_format": "Load More ({page}/{total})",
    "templates_js_plus_badge": "Plus",
    "fonts_title": "Arabic Fonts - Design Studio",
    "fonts_h1": "Arabic Fonts",
    "fonts_desc": "More than 471 diverse Arabic and international fonts combining authenticity and modernity. Browse fonts and download what suits you.",
    "fonts_filter_all": "All",
    "fonts_js_loading": "Loading...",
    "fonts_js_load_error": "Failed to load fonts",
    "fonts_js_no_fonts": "No fonts available",
    "fonts_js_default_name": "Font",
    "fonts_js_count_badge": "{count} fonts",
    "fonts_js_download_link": "Download Font ←",
    "fonts_js_badge_premium": "Premium",
    "fonts_js_badge_new": "New",
    "stickers_title": "Stickers - Design Studio",
    "stickers_h1": "Stickers <span class=\"gold\">& Elements</span>",
    "stickers_h1_highlight": "& Elements",
    "stickers_desc": "Thousands of ready-to-use stickers and elements. Choose any sticker and download it directly.",
    "stickers_search_placeholder": "Search for a sticker (e.g.: hearts, balloons, flags...)",
    "stickers_search_clear_aria": "Clear",
    "stickers_filter_all": "All",
    "stickers_filter_elements": "Elements",
    "stickers_filter_manuscripts": "Manuscripts",
    "stickers_filter_shapes": "Shapes",
    "stickers_filter_effects": "Effects",
    "stickers_filter_frames": "Frames",
    "stickers_js_loading": "Loading...",
    "stickers_js_no_stickers": "No stickers available",
    "backgrounds_title": "Backgrounds - Design Studio",
    "backgrounds_h1": "Featured <span class=\"gold\">Backgrounds</span>",
    "backgrounds_h1_highlight": "Backgrounds",
    "backgrounds_desc": "Hundreds of professional backgrounds with diverse designs. Choose your favorite background and download it directly.",
    "backgrounds_search_placeholder": "🔍 Search for a background (e.g.: roses, effect, smoke...)",
    "backgrounds_search_clear_aria": "Clear",
    "backgrounds_filter_all": "All",
    "backgrounds_counter_categories_initial": "0 sections",
    "backgrounds_counter_items_initial": "0 backgrounds",
    "backgrounds_js_loading": "Loading...",
    "backgrounds_js_no_match": "No matching items",
    "backgrounds_js_default_item_title": "Background",
    "backgrounds_js_load_more": "Load More",
    "backgrounds_js_load_more_remaining": "({count} remaining)",
    "backgrounds_js_counter_categories": "{count} sections",
    "backgrounds_js_counter_items": "{count} backgrounds",
    "backgrounds_filter_cat_templates": "Templates & Infographics",
    "backgrounds_filter_cat_nature": "Nature & Flowers",
    "backgrounds_filter_cat_sky": "Sky & Weather",
    "backgrounds_filter_cat_neon": "Neon & Gradients",
    "backgrounds_filter_cat_effects": "Effects & Smoke",
    "backgrounds_filter_cat_paper": "Paper & Vintage",
    "backgrounds_filter_cat_decor": "Islamic Decorations",
    "backgrounds_filter_cat_other": "Other",
    "frames_title": "Frames - Design Studio",
    "frames_h1": "Frames <span class=\"gold\">& Decorations</span>",
    "frames_h1_highlight": "& Decorations",
    "frames_desc": "Hundreds of professional frames and decorations with diverse designs. Choose your favorite frame and download it directly.",
    "frames_search_placeholder": "🔍 Search for a frame (e.g.: classic, paper, flowers...)",
    "frames_search_clear_aria": "Clear",
    "frames_filter_all": "All",
    "frames_counter_categories_initial": "0 sections",
    "frames_counter_items_initial": "0 frames",
    "frames_js_loading": "Loading...",
    "frames_js_counter_categories": "{count} sections",
    "frames_js_counter_items": "{count} frames",
    "frames_filter_cat_all": "All",
    "frames_filter_cat_classic": "Classic",
    "frames_filter_cat_decorated": "Decorated",
    "frames_filter_cat_flowers": "Flowers",
    "frames_filter_cat_paper": "Paper & Vintage",
    "frames_filter_cat_invitations": "Invitations & Certificates",
    "frames_filter_cat_quotes": "Quotes",
    "frames_filter_cat_other": "Other",
    "tools_title": "Advanced Tools - Design Studio",
    "tools_h1": "Advanced Tools",
    "tools_desc": "A professional set of tools designed specifically for creating exceptional designs. From background removal to multi-layers, everything you need in one place.",
    "help_title": "Help Center - Design Studio",
    "help_h1": "Help Center",
    "help_desc": "Find answers to your questions or contact our support team.",
    "help_topic_quick_start": "Quick Start",
    "help_link_use_site": "How to use the site",
    "help_link_browse_templates": "Browse Templates",
    "help_link_contact_support": "Contact Support",
    "help_topic_design": "Templates & Design",
    "help_link_choose_template": "Choosing the right template",
    "help_link_customize_fonts": "Customize fonts",
    "help_link_change_backgrounds": "Change backgrounds",
    "help_link_add_frames": "Add frames",
    "help_topic_advanced": "Advanced Tools",
    "help_link_tools_list": "Tools list",
    "help_link_faq": "FAQ",
    "help_topic_account": "Account & Support",
    "help_link_contact_us": "Contact us",
    "help_link_community": "Community",
    "help_link_terms": "Terms & Conditions",
    "help_link_privacy": "Privacy Policy",
    "faq_title": "FAQ - Design Studio",
    "faq_h1": "Frequently Asked Questions",
    "faq_desc": "Answers to the most common questions.",
    "faq_q1": "What is Design Studio app?",
    "faq_a1": "Design Studio is an Arabic design app that allows you to create professional designs easily using rich templates and advanced tools.",
    "faq_q2": "Is the app free?",
    "faq_a2": "Yes, the app is free to download and use with free templates. You can subscribe to the premium plan for additional templates and features.",
    "faq_q3": "How do I save my design?",
    "faq_a3": "After finishing your design, press the \"Save\" button and choose the desired format (PNG or JPG).",
    "faq_q4": "Can I use the designs commercially?",
    "faq_a4": "Yes, once you subscribe to the app, the designs become yours and can be used commercially.",
    "faq_q5": "How do I contact support?",
    "faq_a5": "You can contact us via the contact form on the Contact Us page or through social media.",
    "contact_title": "Contact Us - Design Studio",
    "contact_h1": "Contact Us",
    "contact_desc": "For any inquiry or suggestion, you can contact us.",
    "contact_label_name": "Name",
    "contact_placeholder_name": "Enter your name",
    "contact_label_email": "Email",
    "contact_placeholder_email": "Enter your email",
    "contact_label_message": "Message",
    "contact_placeholder_message": "Enter your message",
    "contact_submit": "Send",
    "community_title": "Community - Design Studio",
    "community_h1": "Community",
    "community_desc": "Join the community of image designers and share your creations.",
    "community_feature_gallery": "Gallery",
    "community_feature_gallery_desc": "Browse the works of Arab designers and share your creations.",
    "community_feature_courses": "Courses",
    "community_feature_courses_desc": "Learn design basics through free courses.",
    "community_feature_challenges": "Challenges",
    "community_feature_challenges_desc": "Participate in weekly design challenges.",
    "community_feature_chat": "Chat",
    "community_feature_chat_desc": "Talk to other designers and share experiences.",
    "terms_title": "Terms & Conditions - Design Studio",
    "terms_h1": "Terms & Conditions",
    "terms_last_update": "Last updated: January 2025",
    "terms_section_1_title": "1. Acceptance",
    "terms_section_1_body": "By using the Design Studio app, you agree to abide by these terms and conditions. If you do not agree with any of these terms, you may not use the app.",
    "terms_section_2_title": "2. Use of Service",
    "terms_section_2_body": "Design Studio grants you a limited, non-exclusive license to use the app for personal, non-commercial purposes.",
    "terms_section_3_title": "3. Accounts",
    "terms_section_3_body": "You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.",
    "terms_section_4_title": "4. Content",
    "terms_section_4_body": "You retain ownership of any content you create using the app. By uploading content, you grant us a license to use it to operate the service.",
    "terms_section_5_title": "5. Termination",
    "terms_section_5_body": "We reserve the right to terminate your access to the service at any time, without prior notice, for any reason.",
    "terms_section_6_title": "6. Modifications",
    "terms_section_6_body": "We reserve the right to modify these terms at any time. You will be notified of any material changes.",
    "terms_section_7_title": "7. Contact",
    "terms_section_7_body": "If you have any questions about these terms, please contact us.",
    "privacy_title": "Privacy Policy - Design Studio",
    "privacy_h1": "Privacy Policy",
    "privacy_last_update": "Last updated: January 2025",
    "privacy_section_1_title": "1. Introduction",
    "privacy_section_1_body": "We value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.",
    "privacy_section_2_title": "2. Information We Collect",
    "privacy_section_2_body": "- Information you provide: Name, email, and images you upload.\n- Usage information: How you interact with the app.\n- Device information: Device type, operating system.",
    "privacy_section_3_title": "3. How We Use Information",
    "privacy_section_3_body": "We use the information to improve the service, personalize your experience, communicate with you, and provide support.",
    "privacy_section_4_title": "4. Sharing Information",
    "privacy_section_4_body": "We do not sell your personal information. We may share information with service providers who help us operate the app.",
    "privacy_section_5_title": "5. Data Security",
    "privacy_section_5_body": "We use advanced security measures to protect your information. However, 100% security cannot be guaranteed.",
    "privacy_section_6_title": "6. Your Rights",
    "privacy_section_6_body": "You have the right to access, correct, and delete your data. Contact us to exercise these rights.",
    "privacy_section_7_title": "7. Changes",
    "privacy_section_7_body": "We may update this policy from time to time. We will notify you of any material changes.",
    "privacy_section_8_title": "8. Contact",
    "privacy_section_8_body": "If you have questions about this policy, contact us.",
    "cookies_title": "Cookie Policy - Design Studio",
    "cookies_h1": "Cookie Policy",
    "cookies_last_update": "Last updated: January 2025",
    "cookies_section_1_title": "1. Introduction",
    "cookies_section_1_body": "We use cookies to improve your experience. Learn how we use these files.",
    "cookies_section_2_title": "2. What are cookies?",
    "cookies_section_2_body": "Cookies are small text files stored on your device when you visit websites.",
    "cookies_section_3_title": "3. Types of Files We Use",
    "cookies_section_3_body": "Essential: necessary to run the app.\nAnalytics: help us understand how the app is used.\nFunctional: enable advanced features.\nMarketing: used to display relevant ads.",
    "cookies_strong_essential": "Essential:",
    "cookies_strong_analytics": "Analytics:",
    "cookies_strong_functional": "Functional:",
    "cookies_strong_marketing": "Marketing:",
    "cookies_section_4_title": "4. Managing Files",
    "cookies_section_4_body": "You can control or delete cookies from your browser. However, this may affect some features.",
    "cookies_section_5_title": "5. Third-Party Cookies",
    "cookies_section_5_body": "We may use files from third parties such as Google Analytics to analyze usage.",
    "cookies_section_6_title": "6. Updates",
    "cookies_section_6_body": "We may update this policy periodically. We will notify you of any changes.",
    "cookies_section_7_title": "7. Contact",
    "cookies_section_7_body": "For any questions about this policy, contact us.",
    "copyright_title": "Copyright - Design Studio",
    "copyright_h1": "Copyright",
    "copyright_last_update": "Last updated: January 2025",
    "copyright_section_1_title": "1. Introduction",
    "copyright_section_1_body": "This page explains the intellectual property rights related to the Design Studio app.",
    "copyright_section_2_title": "2. App Rights",
    "copyright_section_2_body": "All rights to the design, development, and operation of the Design Studio app are reserved to us. Copying, modifying, or distributing the app without permission is not allowed.",
    "copyright_section_3_title": "3. Templates",
    "copyright_section_3_body": "Free templates: can be used for personal purposes.\nPaid templates: once purchased, can be used for commercial purposes.",
    "copyright_strong_free": "Free templates:",
    "copyright_strong_paid": "Paid templates:",
    "copyright_section_4_title": "4. Trademark Logos",
    "copyright_section_4_body": "Logos of Google Play, Apple, Samsung, and other trademarks belong to their owners. We do not claim ownership of them.",
    "copyright_section_5_title": "5. User-Generated Content",
    "copyright_section_5_body": "Your designs remain yours. By uploading them, you grant us a limited license to display them on the app.",
    "copyright_section_6_title": "6. Reporting Copyright Infringements",
    "copyright_section_6_body": "If you believe your work has been used without permission, contact us.",
    "copyright_section_7_title": "7. Changes",
    "copyright_section_7_body": "We may update this policy from time to time. Check regularly for updates.",
    "copyright_section_8_title": "8. Contact",
    "copyright_section_8_body": "For any questions about copyright, contact us.",
    "brand_name": "Design Studio",
    "nav_templates": "Templates",
    "nav_fonts": "Fonts",
    "nav_stickers": "Stickers",
    "nav_backgrounds": "Backgrounds",
    "nav_frames": "Frames",
    "nav_help": "Help",
    "nav_studio": "Design Studio",
    "studio_cta_title": "Design <span class=\"gold\">Converter Studio</span>",
    "studio_cta_subtitle": "A professional tool to convert and render Antigravity designs — upload a ZIP and convert it to Export Pro format with one click",
    "studio_btn_small": "NEW TOOL",
    "studio_btn_main": "Open Design Studio"
}
  };

  // ─── دالة الترجمة الديناميكية ───
  function t(key, params) {
    const lang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'ar';
    const dict = I18N[lang] || I18N.ar;
    let s = dict[key];
    if (s === undefined) {
      // fallback للعربي
      s = I18N.ar[key];
      if (s === undefined) return key;
    }
    if (params) {
      Object.keys(params).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(params[k]));
      });
    }
    return s;
  }

  // ─── تطبيق الوضع المظلم ───
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', t('theme_btn_aria'));
      btn.setAttribute('title', theme === 'dark' ? t('theme_toggle_light') : t('theme_toggle_dark'));
    }
  }

  // ─── تطبيق اللغة ───
  function applyLang(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('data-lang', lang);

    const dict = I18N[lang] || I18N.ar;

    // ترجمة title الصفحة
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      document.title = dict[titleEl.getAttribute('data-i18n')] || document.title;
    }

    // ترجمة العناصر data-i18n (نص بسيط)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        const val = dict[key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', val);
        } else if (el.tagName === 'TITLE') {
          document.title = val;
        } else {
          // إذا كان النص يحتوي على HTML entities (مثل &copy;) نستخدم innerHTML
          if (val.indexOf('&') !== -1 || val.indexOf('<') !== -1) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        }
      }
    });

    // ترجمة العناصر data-i18n-html (تسمح بـ HTML داخل النص)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // ترجمة data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // ترجمة aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // ترجمة titles
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    const btn = document.getElementById('langToggleBtn');
    if (btn) {
      btn.textContent = lang === 'ar' ? 'EN' : 'ع';
      btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
      btn.setAttribute('title', lang === 'ar' ? 'English' : 'العربية');
    }

    // إطلاق حدث مخصص للنصوص الديناميكية
    document.dispatchEvent(new CustomEvent('mulangchange', { detail: { lang: lang } }));
  }

  // ─── التهيئة المبكرة (لتجنب وميض الوضع الفاتح) ───
  function initEarly() {
    const savedTheme = localStorage.getItem(STORAGE_THEME) || 'light';
    const savedLang = localStorage.getItem(STORAGE_LANG) || 'ar';
    applyTheme(savedTheme);
    applyLang(savedLang);
  }

  // ─── ربط الأزرار بعد DOM جاهز ───
  function initLate() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const langBtn = document.getElementById('langToggleBtn');

    if (themeBtn && !themeBtn.dataset.bound) {
      themeBtn.dataset.bound = '1';
      themeBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_THEME, next);
        applyTheme(next);
      });
    }

    if (langBtn && !langBtn.dataset.bound) {
      langBtn.dataset.bound = '1';
      langBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'ar';
        const next = current === 'ar' ? 'en' : 'ar';
        localStorage.setItem(STORAGE_LANG, next);
        applyLang(next);
      });
    }
  }

  // تطبيق فوري
  initEarly();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLate);
  } else {
    initLate();
  }

  // ─── واجهة عامة ───
  window.MuTheme = {
    applyTheme: applyTheme,
    applyLang: applyLang,
    t: t,
    getLang: function () { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'ar'; },
    getTheme: function () { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; },
    onLangChange: function (cb) { document.addEventListener('mulangchange', cb); }
  };
})();

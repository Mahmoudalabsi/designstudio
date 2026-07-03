/**
 * ───────────────────────────────────────────────────────────
 *  إعدادات المصادقة - مصمم الصور
 * ───────────────────────────────────────────────────────────
 *  كلمة المرور الآن مُخزّنة بشكل آمن في متغيرات البيئة (Environment Variables)
 *  على Netlify، وليست في هذا الملف.
 *
 *  متغيرات البيئة المطلوبة على Netlify:
 *  - PASSWORD_HASH : تجزئة SHA-256 لـ (PASSWORD_SALT + كلمة المرور)
 *  - PASSWORD_SALT : الملح العشوائي
 *  - AUTH_SECRET   : سر توقيع توكن الجلسة (32+ حرف عشوائي)
 *
 *  لتغيير كلمة المرور:
 *  1. شغّل سكربت update_password.py محلياً
 *  2. انسخ القيم الناتجة (HASH و SALT)
 *  3. حدّث متغيرات البيئة في لوحة تحكم Netlify:
 *     Site settings → Environment variables
 *  4. أعد نشر الموقع لتفعيل التغييرات
 * ───────────────────────────────────────────────────────────
 */
window.AUTH_CONFIG = {
  // رابط API للتحقق من كلمة المرور (Netlify Function)
  loginEndpoint: '/.netlify/functions/login',

  // رابط API للتحقق من التوكن (Netlify Function)
  verifyEndpoint: '/.netlify/functions/verify',

  // مدة الجلسة بالمللي ثانية (24 ساعة) - مطابقة لإعداد الخادم
  sessionDuration: 24 * 60 * 60 * 1000,

  // صفحة تسجيل الدخول
  loginPage: 'login.html',

  // الصفحات العامة (لا تحتاج مصادقة)
  publicPages: ['login.html'],

  // مفتاح تخزين الجلسة في localStorage
  storageKey: 'musammer_auth_session'
};

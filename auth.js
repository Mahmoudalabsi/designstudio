/**
 * ───────────────────────────────────────────────────────────
 *  نظام المصادقة - مصمم الصور
 * ───────────────────────────────────────────────────────────
 *  يتحقق من حالة تسجيل الدخول عند فتح أي صفحة،
 *  ويعيد التوجيه إلى login.html إذا لم يكن المستخدم مسجلاً.
 * ───────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // لا تعمل إذا لم يتم تحميل إعدادات المصادقة
  if (typeof window.AUTH_CONFIG === 'undefined') {
    console.error('AUTH_CONFIG not loaded. Make sure auth-config.js is included before auth.js');
    return;
  }

  var CFG = window.AUTH_CONFIG;

  // الحصول على اسم الصفحة الحالية (مثل "index.html")
  function currentPage() {
    var path = window.location.pathname.split('/').pop();
    return path || 'index.html';
  }

  // التحقق مما إذا كانت الصفحة الحالية عامة (لا تحتاج مصادقة)
  function isPublicPage() {
    var page = currentPage();
    return CFG.publicPages.indexOf(page) !== -1;
  }

  // تجزئة SHA-256 لنص معين باستخدام Web Crypto API
  async function sha256(text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  // التحقق من صحة كلمة المرور
  window.verifyPassword = async function (password) {
    var combined = CFG.salt + password;
    var hash = await sha256(combined);
    return hash === CFG.passwordHash;
  };

  // تسجيل الدخول (إنشاء جلسة)
  window.loginUser = async function (password) {
    var isValid = await window.verifyPassword(password);
    if (!isValid) return false;

    var session = {
      token: CFG.passwordHash, // استخدام التجزئة كتوكن الجلسة
      createdAt: Date.now(),
      expiresAt: Date.now() + CFG.sessionDuration
    };
    localStorage.setItem(CFG.storageKey, JSON.stringify(session));
    return true;
  };

  // تسجيل الخروج
  window.logoutUser = function () {
    localStorage.removeItem(CFG.storageKey);
    window.location.href = CFG.loginPage;
  };

  // التحقق من وجود جلسة صالحة
  window.isAuthenticated = function () {
    try {
      var raw = localStorage.getItem(CFG.storageKey);
      if (!raw) return false;
      var session = JSON.parse(raw);
      // التحقق من انتهاء الصلاحية
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(CFG.storageKey);
        return false;
      }
      // التحقق من صحة التوكن (يجب أن يطابق التجزئة الحالية)
      if (session.token !== CFG.passwordHash) {
        localStorage.removeItem(CFG.storageKey);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  // إضافة زر تسجيل الخروج إلى الرأس (header) تلقائياً
  function injectLogoutButton() {
    if (!window.isAuthenticated()) return;
    var header = document.querySelector('header .header-inner');
    if (!header) return;
    // التحقق من عدم وجود زر مسبقاً
    if (document.querySelector('.auth-logout-btn')) return;

    var nav = header.querySelector('nav');
    var btn = document.createElement('button');
    btn.className = 'auth-logout-btn';
    btn.type = 'button';
    btn.innerHTML = 'تسجيل الخروج';
    btn.setAttribute('aria-label', 'تسجيل الخروج');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.logoutUser();
      }
    });

    if (nav) {
      nav.appendChild(btn);
    } else {
      header.appendChild(btn);
    }
  }

  // حماية الصفحة: إعادة التوجيه لصفحة الدخول إذا لم يكن مسجلاً
  function protectPage() {
    if (isPublicPage()) return;
    if (!window.isAuthenticated()) {
      var currentUrl = window.location.href;
      window.location.href = CFG.loginPage + '?redirect=' + encodeURIComponent(currentUrl);
    }
  }

  // تشغيل الحماية فوراً
  protectPage();

  // إضافة زر الخروج بعد تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLogoutButton);
  } else {
    injectLogoutButton();
  }
})();

/**
 * ───────────────────────────────────────────────────────────
 *  Netlify Function: login
 * ───────────────────────────────────────────────────────────
 *  نقطة نهاية API للتحقق من كلمة المرور وإصدار توكن جلسة.
 *
 *  POST /api/login
 *  Body: { "password": "كلمة-المرور" }
 *  Response: { "success": true, "token": "...", "expiresAt": 1234567890 }
 *           أو { "success": false, "error": "..." }
 *
 *  كلمة المرور مُخزّنة كتجزئة SHA-256 (وليست كنص واضح).
 *  لتفعيل متغيرات البيئة على Netlify (أكثر أماناً):
 *    1. اذهب إلى: Site settings → Environment variables
 *    2. أضف: PASSWORD_HASH, PASSWORD_SALT, AUTH_SECRET
 *    3. أعد النشر
 *  إذا لم تكن متغيرات البيئة مُعرفة، سيتم استخدام القيم الافتراضية أدناه.
 * ───────────────────────────────────────────────────────────
 */
const crypto = require('crypto');

// مدة الجلسة: 24 ساعة بالمللي ثانية
const SESSION_DURATION = 24 * 60 * 60 * 1000;

/**
 * القيم الافتراضية (تُستخدم فقط إذا لم تكن متغيرات البيئة مُعرفة).
 * لتغيير كلمة المرور، شغّل سكربت update_password.py محلياً وحدّث هذه القيم.
 *
 * كلمة المرور الافتراضية الحالية: admin123
 * ⚠️ يجب تغييرها فوراً عبر تعيين متغيرات البيئة على Netlify.
 */
const DEFAULT_PASSWORD_HASH = '91f68bce21042815559293a2c400c7ac0bdc830eedc7be11c89e6d1811f91829';
const DEFAULT_PASSWORD_SALT = '6d99576de8cb3a0a14194991589386d7';
const DEFAULT_AUTH_SECRET = 'gh_B1vwbS8OeljC0ifI-lZjjlPvbWmYE3sejG4AvbVKFB5hu';

/**
 * تجزئة SHA-256 لنص
 */
function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf-8').digest('hex');
}

/**
 * توقيع حمولة باستخدام HMAC-SHA256 (مثل JWT)
 */
function sign(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

/**
 * معالج طلب تسجيل الدخول
 */
exports.handler = async (event, context) => {
  // السماح فقط بطلبات POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ success: false, error: 'الطريقة غير مدعومة. استخدم POST.' })
    };
  }

  // معالجة طلبات CORS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  // قراءة القيم من متغيرات البيئة أو استخدام الافتراضية
  const PASSWORD_HASH = process.env.PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
  const PASSWORD_SALT = process.env.PASSWORD_SALT || DEFAULT_PASSWORD_SALT;
  const AUTH_SECRET = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;

  // تحليل جسم الطلب
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: false, error: 'صيغة الطلب غير صحيحة.' })
    };
  }

  const password = body.password;
  if (!password || typeof password !== 'string') {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: false, error: 'كلمة المرور مطلوبة.' })
    };
  }

  // التحقق من كلمة المرور (مقاومة لتوقيت التخمين)
  const inputHash = sha256(PASSWORD_SALT + password);
  const inputBuf = Buffer.from(inputHash, 'hex');
  const expectedBuf = Buffer.from(PASSWORD_HASH, 'hex');

  let isValid = false;
  if (inputBuf.length === expectedBuf.length) {
    isValid = crypto.timingSafeEqual(inputBuf, expectedBuf);
  }

  if (!isValid) {
    // تأخير بسيط لمقاومة هجمات التوقيت
    await new Promise(r => setTimeout(r, 500));
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'كلمة المرور غير صحيحة.'
      })
    };
  }

  // إنشاء توكن الجلسة
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION;
  const payload = {
    iat: Math.floor(now / 1000),
    exp: Math.floor(expiresAt / 1000),
    sub: 'authenticated_user'
  };
  const token = sign(payload, AUTH_SECRET);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      token: token,
      expiresAt: expiresAt
    })
  };
};

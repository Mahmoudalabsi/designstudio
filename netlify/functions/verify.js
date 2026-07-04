/**
 * ───────────────────────────────────────────────────────────
 *  Netlify Function: verify
 * ───────────────────────────────────────────────────────────
 *  نقطة نهاية API للتحقق من صحة توكن الجلسة.
 *
 *  GET /api/verify
 *  Header: Authorization: Bearer <token>
 *  Response: { "valid": true, "expiresAt": 1234567890 }
 *           أو { "valid": false, "error": "..." }
 *
 *  متغير البيئة: AUTH_SECRET (نفس المستخدم في login.js)
 * ───────────────────────────────────────────────────────────
 */
const crypto = require('crypto');

// نفس القيمة الافتراضية في login.js (يجب أن تتطابق)
const DEFAULT_AUTH_SECRET = 'aXEnXBlo6hdvj238SexZggJOq6qY9KLzCRp4abkMXtq61C_a';

/**
 * التحقق من توقيع JWT
 */
function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, bodyB64, sigB64] = parts;

  // إعادة حساب التوقيع
  const expectedSig = crypto.createHmac('sha256', secret)
    .update(`${headerB64}.${bodyB64}`)
    .digest('base64url');

  // مقارنة آمنة
  const sigBuf = Buffer.from(sigB64);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf-8'));
    // التحقق من انتهاء الصلاحية
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'OPTIONS') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      },
      body: JSON.stringify({ valid: false, error: 'الطريقة غير مدعومة.' })
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      },
      body: ''
    };
  }

  const AUTH_SECRET = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;

  // استخراج التوكن من header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ valid: false, error: 'التوكن غير موجود.' })
    };
  }

  const token = authHeader.substring(7);
  const payload = verify(token, AUTH_SECRET);

  if (!payload) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ valid: false, error: 'التوكن غير صالح أو منتهي الصلاحية.' })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      valid: true,
      expiresAt: payload.exp * 1000
    })
  };
};

/**
 * Cloudflare Pages Worker - Reverse Proxy for Design Studio
 *
 * Routes:
 *   /studio/*  → https://design-converter-app.onrender.com/*
 *   /*         → static site assets (default Pages behavior)
 *
 * Note: We use HTMLRewriter to rewrite absolute paths (/api/..., /index.html, etc.)
 * inside HTML responses so they include the /studio prefix.
 */

const STUDIO_PREFIX = '/studio';
const UPSTREAM = 'https://design-converter-app.onrender.com';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only proxy requests under /studio
    if (!url.pathname.startsWith(STUDIO_PREFIX + '/') && url.pathname !== STUDIO_PREFIX) {
      // Fall through to Pages static asset serving
      return env.ASSETS.fetch(request);
    }

    // Compute the upstream path: strip "/studio" prefix
    let upstreamPath = url.pathname.slice(STUDIO_PREFIX.length);
    if (upstreamPath === '' || upstreamPath === '/') {
      upstreamPath = '/';
    }
    const upstreamUrl = new URL(upstreamPath + url.search, UPSTREAM);

    // Build the upstream request — forward method, headers, body
    const upstreamReq = new Request(upstreamUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    });
    // Fix Host header
    upstreamReq.headers.set('Host', UPSTREAM.replace('https://', ''));
    upstreamReq.headers.set('X-Forwarded-Host', url.hostname);
    upstreamReq.headers.set('X-Forwarded-Proto', 'https');

    // Fetch from Render
    let upstreamRes;
    try {
      upstreamRes = await fetch(upstreamReq);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Studio upstream unreachable', detail: err.message }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Recompose the response so we can modify headers/body
    const resHeaders = new Headers(upstreamRes.headers);
    // Strip compression/transfer encodings so we can safely rewrite text bodies
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    resHeaders.delete('transfer-encoding');

    // Security: pass through cookies but rewrite path if needed
    // (Render sets no cookies for this app, but we leave as-is)

    const contentType = resHeaders.get('content-type') || '';

    // Rewrite absolute URLs in HTML/JS/CSS so the app believes it lives at /studio
    if (contentType.includes('text/html')) {
      const html = await upstreamRes.text();
      const rewritten = rewriteHtmlPaths(html);
      resHeaders.set('content-type', 'text/html; charset=utf-8');
      // Prevent browser disk cache from serving stale studio.html (which
      // contains the old /studio/api/ paths that 404 on Render).
      // no-cache = always revalidate, no-store = never keep on disk.
      resHeaders.set('cache-control', 'no-cache, no-store, must-revalidate');
      resHeaders.set('pragma', 'no-cache');
      resHeaders.set('expires', '0');
      return new Response(rewritten, {
        status: upstreamRes.status,
        statusText: upstreamRes.statusText,
        headers: resHeaders,
      });
    }

    if (contentType.includes('javascript') || contentType.includes('text/css')) {
      const text = await upstreamRes.text();
      const rewritten = rewriteAssetPaths(text, STUDIO_PREFIX);
      return new Response(rewritten, {
        status: upstreamRes.status,
        statusText: upstreamRes.statusText,
        headers: resHeaders,
      });
    }

    // For binary/other content (images, ZIP, fonts) pass through directly
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  },
};

/**
 * Rewrite absolute paths in HTML to be prefixed with /studio.
 *
 * IMPORTANT: We do NOT rewrite /api/ paths here. The studio's index.html
 * has its own resolveApiBase() logic that switches to RENDER_ORIGIN (absolute
 * Render URL) when running on a proxy host. If we rewrote /api/ -> /studio/api/,
 * the final request would become RENDER_ORIGIN + /studio/api/convert which
 * returns 404 on Render (it doesn't know /studio prefix).
 */
function rewriteHtmlPaths(html) {
  // Only rewrite absolute asset URLs in HTML attributes (href, src, action).
  // Leave inline JS fetch('/api/...') alone — the app's resolveApiBase()
  // already handles proxy routing via RENDER_ORIGIN.
  let out = html.replace(/(href|src|action)=["']\/(?!\/)/g, '$1="/studio/');

  // Don't break data: URLs or http(s):// URLs (the negative lookahead handles that)

  return out;
}

/**
 * Rewrite absolute paths in JS/CSS files.
 *
 * IMPORTANT: Same as rewriteHtmlPaths — do NOT rewrite /api/ in JS.
 * The app's resolveApiBase() handles proxy routing via RENDER_ORIGIN.
 * Rewriting /api/ -> /studio/api/ would break fetch calls.
 *
 * Only CSS url('/...') is rewritten to url('/studio/...') for static assets.
 */
function rewriteAssetPaths(text, prefix) {
  // CSS url('/...') -> url('/studio/...')
  let out = text.replace(/url\((['"]?)\/(?!\/)/g, 'url($1' + prefix + '/');

  return out;
}

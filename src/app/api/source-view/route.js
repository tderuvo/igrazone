import { NextResponse } from "next/server";

// ─── Allowlist ────────────────────────────────────────────────────────────────
// ONLY these keys are accepted.  Any other value returns 404.
// Adding a new source requires an explicit entry here.

const SOURCES = {
  meduza: {
    name:        "Meduza",
    proxyUrl:    "https://meduza.io/en",      // URL fetched server-side
    baseHref:    "https://meduza.io/",        // injected <base href> for relative URLs
    externalUrl: "https://meduza.io/en",      // used in the fallback link
  },
  hochuzhit: {
    name:        "Hochu Zhit",
    proxyUrl:    "https://hochuzhit.com/ru/",
    baseHref:    "https://hochuzhit.com/",
    externalUrl: "https://hochuzhit.com/ru/",
  },
};

// Fetch timeout in milliseconds.  If the upstream site doesn't respond within
// this window the fallback page is served instead.
const PROXY_TIMEOUT_MS = 6000;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const site   = (searchParams.get("site") ?? "").toLowerCase().trim();
  const config = SOURCES[site];

  if (!config) {
    return new NextResponse(renderNotFound(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Attempt a live proxy fetch.  On any failure (network error, non-200,
  // timeout, non-HTML content-type) we fall through to the fallback page.
  const liveHtml = await tryLiveProxy(config);

  return new NextResponse(liveHtml ?? renderFallback(config), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // SAMEORIGIN allows our own domain to embed this in an iframe while
      // blocking third-party embedding.
      "X-Frame-Options": "SAMEORIGIN",
      // Don't cache live content; cache the fallback briefly.
      "Cache-Control": liveHtml ? "no-store" : "public, max-age=120",
    },
  });
}

// ─── Live proxy ───────────────────────────────────────────────────────────────

/**
 * Fetches the external page and rewrites it for same-origin iframe delivery:
 *
 *   1. Uses a browser-like User-Agent to reduce bot-detection blocks.
 *   2. Injects `<base href="…" target="_blank">` so that:
 *        • relative URLs (CSS, images, JS) resolve against the origin site.
 *        • ALL link clicks open in a new tab, keeping the iframe URL stable.
 *   3. Strips any X-Frame-Options / CSP headers from the upstream response
 *      (they are not forwarded — we set our own headers on the response).
 *
 * Returns the rewritten HTML string, or null on any error.
 */
async function tryLiveProxy(config) {
  try {
    const response = await fetch(config.proxyUrl, {
      // AbortSignal.timeout is available in Node 17.3+ (project runs Node 23)
      signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/124.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
      },
    });

    if (!response.ok) return null;

    const ct = response.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return null;

    let html = await response.text();

    // Inject <base> immediately after the opening <head> tag (or prepend if
    // no <head> is found).  target="_blank" on the base element means every
    // link in the proxied page opens in a new browser tab, so the iframe URL
    // never navigates away from our same-origin proxy page.
    const baseTag = `<base href="${config.baseHref}" target="_blank">`;
    const headMatch = html.match(/<head[^>]*>/i);
    if (headMatch) {
      const insertAt = headMatch.index + headMatch[0].length;
      html = html.slice(0, insertAt) + baseTag + html.slice(insertAt);
    } else {
      html = baseTag + html;
    }

    return html;
  } catch {
    // Covers: AbortError (timeout), network failures, DNS errors, etc.
    return null;
  }
}

// ─── Fallback page ────────────────────────────────────────────────────────────
// Shown when the live proxy fetch fails for any reason.

function renderFallback(config) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      background: #ffffff;
      color: #111827;
      padding: 40px 24px;
      max-width: 520px;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
    }
    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #9ca3af;
      margin-bottom: 10px;
    }
    .name {
      font-size: 24px;
      font-weight: 900;
      color: #111827;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    hr {
      border: none;
      border-top: 2px solid #111827;
      margin-bottom: 20px;
    }
    .message {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.65;
      margin-bottom: 28px;
    }
    .open-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #111827;
      color: #fff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 8px;
      transition: background 0.15s;
      margin-bottom: 16px;
    }
    .open-btn:hover { background: #1f2937; }
    .note {
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.6;
      border-top: 1px solid #f3f4f6;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <p class="eyebrow">International Source</p>
  <h1 class="name">${config.name}</h1>
  <hr>
  <p class="message">Source preview temporarily unavailable.</p>
  <a href="${config.externalUrl}" target="_blank" rel="noopener noreferrer" class="open-btn">
    Open ${config.name} ↗
  </a>
  <p class="note">
    Opens in a new window. Now You Know does not control or represent content
    published by this source.
  </p>
</body>
</html>`;
}

// ─── Not-found page ───────────────────────────────────────────────────────────

function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Source not found</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 32px 20px; color: #374151;
           max-width: 480px; margin: 0 auto; }
    h1 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    p  { font-size: 13px; color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Source not available</h1>
  <p>This source is not in the current allowlist. Return to Now You Know and
     select a listed source.</p>
</body>
</html>`;
}

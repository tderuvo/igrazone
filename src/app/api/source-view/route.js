import { NextResponse } from "next/server";

// ─── Allowlist ────────────────────────────────────────────────────────────────
// ONLY these four keys are accepted.  Any other value returns 404.
// Extending this list is the only way to add new sources.

const SOURCES = {
  bbc: {
    name:        "BBC News",
    tagline:     "Trusted international public-service broadcasting since 1922.",
    description: "The BBC is a British public service broadcaster providing independent international news coverage across politics, world affairs, science, business, and culture. Its international news service is available in over forty languages.",
    url:         "https://www.bbc.com/news",
    urlLabel:    "bbc.com/news",
    topics:      ["World", "Europe", "Middle East", "Asia-Pacific", "Americas", "Business", "Technology", "Science", "Health"],
    accentHex:   "#b91c1c",   // red-700
  },
  reuters: {
    name:        "Reuters",
    tagline:     "Fact-based reporting trusted by professionals worldwide.",
    description: "Reuters is a global news organisation founded in 1851 and owned by Thomson Reuters. It supplies news content and data services to thousands of media outlets, financial institutions, and governments.",
    url:         "https://www.reuters.com",
    urlLabel:    "reuters.com",
    topics:      ["World News", "Business", "Markets & Finance", "Politics", "Legal", "Technology", "Science", "Investigations"],
    accentHex:   "#b45309",   // amber-700
  },
  cnn: {
    name:        "CNN International",
    tagline:     "Breaking news and in-depth analysis from around the globe.",
    description: "CNN International is the international arm of CNN, providing continuous news coverage from correspondents stationed in major cities worldwide. It reaches over 400 million homes and hotel rooms globally.",
    url:         "https://edition.cnn.com",
    urlLabel:    "edition.cnn.com",
    topics:      ["World", "Politics", "Business", "Health", "Entertainment", "Technology", "Climate", "Opinion"],
    accentHex:   "#1d4ed8",   // blue-700
  },
  meduza: {
    name:        "Meduza",
    tagline:     "Independent Russian-language journalism, published from Riga.",
    description: "Meduza is an independent Russian-language online media outlet based in Riga, Latvia. Founded in 2014 by former editors of the Russian news outlet Lenta.ru, it provides independent news coverage of Russia and the wider post-Soviet region in both Russian and English.",
    url:         "https://meduza.io/en",
    urlLabel:    "meduza.io/en",
    topics:      ["Russia", "Ukraine", "Eastern Europe", "Business & Economy", "Society", "Feature Stories", "Podcasts"],
    accentHex:   "#6d28d9",   // violet-700
  },
};

// ─── Route handler ────────────────────────────────────────────────────────────

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const site = (searchParams.get("site") ?? "").toLowerCase().trim();
  const source = SOURCES[site];

  if (!source) {
    return new NextResponse(renderNotFound(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new NextResponse(renderSourcePage(source), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Allow this page to be embedded in an iframe from our own origin only.
      "X-Frame-Options":       "SAMEORIGIN",
      "Cache-Control":         "public, max-age=3600",
    },
  });
}

// ─── HTML generator ───────────────────────────────────────────────────────────

function renderSourcePage(s) {
  const topicPills = s.topics
    .map((t) => `<span class="pill">${t}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
                   "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      padding: 28px 20px 40px;
      max-width: 640px;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
    }

    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #9ca3af;
      margin-bottom: 8px;
    }

    .source-name {
      font-size: 26px;
      font-weight: 900;
      color: #111827;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .tagline {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 18px;
      font-style: italic;
    }

    .divider {
      border: none;
      border-top: 2px solid #111827;
      margin-bottom: 18px;
    }

    .description {
      font-size: 13px;
      line-height: 1.7;
      color: #374151;
      margin-bottom: 22px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #9ca3af;
      margin-bottom: 10px;
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 28px;
    }

    .pill {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 100px;
      padding: 4px 11px;
      font-size: 11px;
      color: #374151;
      font-weight: 500;
    }

    .open-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #111827;
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 8px;
      transition: background 0.15s;
      margin-bottom: 20px;
    }

    .open-btn:hover { background: #1f2937; }

    .open-btn .arrow {
      font-size: 15px;
      line-height: 1;
    }

    .url-hint {
      font-size: 11px;
      color: #9ca3af;
      margin-bottom: 24px;
    }

    .disclaimer {
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
  <h1 class="source-name">${s.name}</h1>
  <p class="tagline">${s.tagline}</p>
  <hr class="divider">
  <p class="description">${s.description}</p>

  <p class="section-label">Coverage Areas</p>
  <div class="pills">${topicPills}</div>

  <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="open-btn">
    Open ${s.name} <span class="arrow">↗</span>
  </a>
  <p class="url-hint">${s.urlLabel}</p>

  <p class="disclaimer">
    Opens in a new window. Now You Know does not control, endorse, or represent
    any content published by this source. Visit the source directly for live news.
  </p>
</body>
</html>`;
}

function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Source not found</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 32px 20px; color: #374151; max-width: 480px; margin: 0 auto; }
    h1 { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    p  { font-size: 13px; color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Source not available</h1>
  <p>This source is not in the current allowlist. Return to Now You Know and select a listed source.</p>
</body>
</html>`;
}

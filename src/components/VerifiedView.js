"use client";

import { useRef, useState } from "react";
import { T } from "@/lib/translations";

// ─── Constants ────────────────────────────────────────────────────────────────

// Sources referenced internally — no external hrefs at this level.
// Clicking a source sets selectedSource state; the SourceView loads the
// same-origin proxy page /api/source-view?site=<id>.
const SOURCES = [
  { id: "meduza",    label: "Meduza" },
  { id: "hochuzhit", label: "Hochu Zhit" },
];

const CATEGORY_COLOURS = {
  Europe:       "text-blue-700",
  Economy:      "text-amber-700",
  Media:        "text-emerald-700",
  Humanitarian: "text-rose-700",
  Technology:   "text-sky-700",
  Politics:     "text-violet-700",
};

const SWIPE_MIN_PX = 70;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function catColour(cat) {
  return CATEGORY_COLOURS[cat] ?? "text-gray-600";
}

function firstParagraph(body) {
  if (!body) return "";
  return body.split(/\n\n+/)[0].trim();
}

// ─── YouTube embed ────────────────────────────────────────────────────────────

function YouTubeEmbed({ videoId }) {
  if (!videoId) return null;
  return (
    <div className="relative w-full mt-5 rounded overflow-hidden" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`}
        title="Video briefing"
        style={{ border: 0 }}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

// ─── Article image ────────────────────────────────────────────────────────────

/* eslint-disable @next/next/no-img-element */
function ArticleImage({ src, alt, className = "" }) {
  return src ? (
    <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
  ) : (
    <div className="w-full h-full bg-gray-100" />
  );
}

// ─── Lead Story Hero ──────────────────────────────────────────────────────────

function LeadStoryHero({ story }) {
  const [expanded, setExpanded] = useState(false);
  if (!story) return null;
  const excerpt = firstParagraph(story.body);

  return (
    <section className="border-b-2 border-gray-200 pb-8 mb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
        Lead Briefing
      </p>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
        <div className="w-full sm:w-2/5 shrink-0">
          <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden">
            <ArticleImage src={story.image} alt={story.title} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${catColour(story.category)}`}>
              {story.category}
            </span>
            <span className="text-gray-300 text-[10px]" aria-hidden="true">·</span>
            <time dateTime={story.date} className="text-[11px] text-gray-400">
              {formatDate(story.date)}
            </time>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight tracking-tight mb-2 wrap-break-word">
            {story.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 wrap-break-word">
            {story.subtitle}
          </p>
          {story.author && (
            <p className="text-[11px] text-gray-400 mb-4">By {story.author}</p>
          )}
          {!expanded && excerpt && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 wrap-break-word">
              {excerpt}
            </p>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-bold text-gray-800 hover:text-black underline underline-offset-2 decoration-1 transition-colors duration-150"
          >
            {expanded ? "Close briefing ↑" : "Read briefing →"}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 min-w-0 space-y-3">
          {story.body.split(/\n\n+/).map((para, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed wrap-break-word">{para.trim()}</p>
          ))}
          <YouTubeEmbed videoId={story.youtubeId} />
        </div>
      )}
    </section>
  );
}

// ─── Infographic card ─────────────────────────────────────────────────────────

function InfographicCard({ ig }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <div className="w-full bg-white">
        <ArticleImage src={ig.image} alt={ig.title} className="w-full h-auto" />
      </div>
      <div className="px-3 py-2.5">
        <h3 className="text-xs font-bold text-gray-800 mb-0.5 wrap-break-word">{ig.title}</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed wrap-break-word">{ig.caption}</p>
      </div>
    </div>
  );
}

// ─── Article row ──────────────────────────────────────────────────────────────

function ArticleRow({ article, isLast, isExpanded, onToggle }) {
  const excerpt = firstParagraph(article.body);
  return (
    <article className={`py-5 sm:py-6 min-w-0 ${isLast ? "" : "border-b border-gray-200"}`}>
      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
        <div className="w-full aspect-video sm:w-36 sm:aspect-auto sm:h-24 bg-gray-100 rounded overflow-hidden sm:shrink-0">
          <ArticleImage src={article.image} alt={article.title} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${catColour(article.category)}`}>
              {article.category}
            </span>
            <span className="text-gray-300 text-[10px]" aria-hidden="true">·</span>
            <time dateTime={article.date} className="text-[11px] text-gray-400">
              {formatDate(article.date)}
            </time>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1.5 tracking-tight wrap-break-word">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-2 wrap-break-word">
            {article.subtitle}
          </p>
          {!isExpanded && excerpt && (
            <p className="text-xs text-gray-400 leading-relaxed mb-3 wrap-break-word line-clamp-2">
              {excerpt}
            </p>
          )}
          {isExpanded && article.body && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 mb-3 min-w-0">
              {article.body.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed wrap-break-word">{para.trim()}</p>
              ))}
              <YouTubeEmbed videoId={article.youtubeId} />
            </div>
          )}
          <button
            onClick={onToggle}
            className="text-xs font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-2 decoration-1 transition-colors duration-150"
          >
            {isExpanded ? "Show less ↑" : "Read more →"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Return button (shared) ───────────────────────────────────────────────────

function ReturnButton({ onExit, label = "Return" }) {
  return (
    <button
      onClick={onExit}
      aria-label="Return to game"
      className="flex items-center gap-2 group shrink-0"
    >
      <span className="hidden sm:inline text-sm font-medium text-gray-500 group-hover:text-gray-800 transition-colors duration-150">
        {label}
      </span>
      <div className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-red-600 group-hover:bg-red-500 active:bg-red-700 transition-colors duration-150 flex items-center justify-center shadow-sm ring-1 ring-red-500/30 shrink-0">
        <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Full-screen white news-publication overlay.
 *
 * Internal navigation is React state only — the browser URL never changes.
 * selectedSource = null        → Now You Know home view (scrollable)
 * selectedSource = "meduza"|… → SourceView: same-origin iframe filling the screen
 *
 * onExit always triggers the QuickExit / session-burn path regardless of
 * which internal view is currently shown.
 */
export default function VerifiedView({
  onExit,
  leadStory    = null,
  articles     = [],
  infographics = [],
  lang         = "en",
}) {
  const t     = T[lang] ?? T.en;
  const today = getTodayFormatted();
  const [expandedSlug,   setExpandedSlug]   = useState(null);

  // null = home view   "meduza"|"hochuzhit" = source view
  const [selectedSource, setSelectedSource] = useState(null);

  function toggleArticle(slug) {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }

  function openSource(id) {
    setSelectedSource(id);
    setExpandedSlug(null);   // collapse any open article when switching views
  }

  function closeSource() {
    setSelectedSource(null);
  }

  // ── Swipe-right (home view only) ──────────────────────────────────────────
  // Disabled in source view so the gesture doesn't conflict with the iframe.
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dx >= SWIPE_MIN_PX && dx > dy) onExit();
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const inSourceView = selectedSource !== null;
  const activeSource = SOURCES.find((s) => s.id === selectedSource);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Root layout switches between scrollable (home) and flex-col (source view)
    // so the iframe can fill the remaining viewport height precisely.
    <div
      className={`fixed inset-0 z-50 bg-white overflow-x-hidden w-full max-w-full ${
        inSourceView ? "overflow-hidden flex flex-col" : "overflow-y-auto"
      }`}
      onTouchStart={!inSourceView ? handleTouchStart : undefined}
      onTouchEnd={!inSourceView ? handleTouchEnd : undefined}
    >

      {/* ── Sticky utility bar — always visible ──────────────────────────────
          Left side adapts: back button in source view, swipe hint on mobile
          in home view.  Return button (QuickExit) is always on the right. */}
      <div
        className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200"
        style={{
          paddingTop:   "env(safe-area-inset-top,   0px)",
          paddingLeft:  "env(safe-area-inset-left,  0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 min-w-0">

          {inSourceView ? (
            /* Source view — back navigation */
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={closeSource}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 flex items-center gap-1.5 shrink-0"
                aria-label="Back to Now You Know"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Back to</span>
                <span>Now You Know</span>
              </button>
              {activeSource && (
                <>
                  <span className="text-gray-300 hidden sm:inline" aria-hidden="true">·</span>
                  <span className="text-sm font-bold text-gray-900 hidden sm:inline truncate">
                    {activeSource.label}
                  </span>
                </>
              )}
            </div>
          ) : (
            /* Home view — swipe hint on mobile, spacer on desktop */
            <>
              <p className="flex-1 min-w-0 text-[10px] text-gray-400 select-none sm:hidden leading-tight">
                Swipe right or tap Return to go back.
              </p>
              <div className="hidden sm:block flex-1" aria-hidden="true" />
            </>
          )}

          {/* Return / QuickExit — always right-aligned, 44 px tap target mobile */}
          <ReturnButton onExit={onExit} label={t.return} />
        </div>
      </div>

      {/* ── Source view ──────────────────────────────────────────────────────
          Shows when selectedSource is set.  The iframe fills all remaining
          height via flex-1.  The proxy route /api/source-view serves our own
          HTML so X-Frame-Options: SAMEORIGIN applies with no restriction. */}
      {inSourceView && (
        <div className="flex-1 overflow-hidden min-h-0">
          <iframe
            key={selectedSource}                     /* remount on source change */
            src={`/api/source-view?site=${selectedSource}`}
            title={activeSource ? `${activeSource.label} — source briefing` : "Source briefing"}
            className="w-full h-full block"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* ── Home view — only rendered when no source is selected ─────────── */}
      {!inSourceView && (
        <>
          {/* Masthead */}
          <header className="w-full max-w-3xl mx-auto min-w-0 px-4 sm:px-6 pt-6 sm:pt-10 pb-5 sm:pb-6">
            <div className="border-t-4 border-gray-900 mb-4 sm:mb-5" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none text-center mb-2 sm:mb-3 wrap-break-word">
              Now You Know
            </h1>
            <p className="text-center text-xs sm:text-sm text-gray-500 mb-3 wrap-break-word leading-relaxed">
              Independent context for a fast-changing world.
            </p>
            <div className="flex items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-500 flex-wrap mb-4">
              <time dateTime={new Date().toISOString().split("T")[0]}>{today}</time>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <div className="flex items-center gap-1.5 shrink-0" aria-label="Language">
                <button className="text-xs font-bold text-gray-900 underline underline-offset-2 decoration-1 cursor-default" aria-current="true" tabIndex={-1}>EN</button>
                <span className="text-gray-400 select-none" aria-hidden="true">|</span>
                <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-150 cursor-not-allowed" tabIndex={-1} title="Russian edition coming soon">RU</button>
              </div>
            </div>
            <div className="border-b-2 border-gray-900" />
          </header>

          {/* International source links — buttons that open SourceView */}
          <div className="w-full max-w-3xl mx-auto min-w-0 px-4 sm:px-6 py-3 border-b border-gray-200 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-600 shrink-0">International Sources:</span>
            {SOURCES.map((s, i) => (
              <span key={s.id} className="flex items-center gap-x-1.5 shrink-0">
                <button
                  onClick={() => openSource(s.id)}
                  className="text-gray-500 hover:text-gray-900 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  {s.label}
                </button>
                {i < SOURCES.length - 1 && (
                  <span className="text-gray-300" aria-hidden="true">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Page body */}
          <main
            className="w-full max-w-3xl mx-auto min-w-0 px-4 sm:px-6 pt-7 sm:pt-9"
            style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 0px))" }}
          >
            <LeadStoryHero story={leadStory} />

            {infographics.length > 0 && (
              <section className="py-7 border-b border-gray-200">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">
                  Context
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {infographics.map((ig, i) => (
                    <InfographicCard key={i} ig={ig} />
                  ))}
                </div>
              </section>
            )}

            <section className="pt-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 pb-1 border-b border-gray-200 mb-1">
                International Briefing
              </h2>
              {articles.length === 0 ? (
                <p className="py-8 text-sm text-gray-400 text-center">No articles available.</p>
              ) : (
                <div className="min-w-0">
                  {articles.map((article, i) => (
                    <ArticleRow
                      key={article.slug}
                      article={article}
                      isLast={i === articles.length - 1}
                      isExpanded={expandedSlug === article.slug}
                      onToggle={() => toggleArticle(article.slug)}
                    />
                  ))}
                </div>
              )}
            </section>

            <p className="mt-8 sm:mt-10 text-[11px] text-gray-400 border-t border-gray-100 pt-5 leading-relaxed">
              This view is session-based and may refresh periodically.
            </p>
          </main>
        </>
      )}

    </div>
  );
}

"use client";

import { useRef } from "react";

// ─── News data ────────────────────────────────────────────────────────────────

const NEWS_ITEMS = [
  {
    id: 1,
    category: "Europe",
    categoryColour: "text-blue-700",
    timestamp: "Updated moments ago",
    headline: "European leaders discuss regional security",
    description:
      "Diplomatic conversations continue across Europe as governments assess long-term regional stability concerns.",
  },
  {
    id: 2,
    category: "Economy",
    categoryColour: "text-amber-700",
    timestamp: "18 min read",
    headline: "Markets watch energy and supply chain signals",
    description:
      "Analysts continue monitoring energy pricing and shipping activity for broader economic implications.",
  },
  {
    id: 3,
    category: "Media",
    categoryColour: "text-emerald-700",
    timestamp: "32 min read",
    headline: "Independent outlets expand digital distribution",
    description:
      "Publishers continue exploring alternative digital delivery methods to broaden audience reach.",
  },
  {
    id: 4,
    category: "Humanitarian",
    categoryColour: "text-rose-700",
    timestamp: "45 min read",
    headline: "Humanitarian organizations call for broader civilian support",
    description:
      "Aid groups continue emphasizing support for displaced civilians and disrupted infrastructure.",
  },
];

const SOURCES = [
  { id: 1, name: "BBC" },
  { id: 2, name: "Reuters" },
  { id: 3, name: "CNN" },
  { id: 4, name: "Meduza" },
];

// Minimum right-swipe distance (px) before the gesture fires
const SWIPE_MIN_PX = 70;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Image placeholder ────────────────────────────────────────────────────────

function ImagePlaceholder() {
  return (
    <div className="w-full h-28 sm:w-36 sm:h-24 sm:shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
      <svg
        viewBox="0 0 48 36"
        fill="none"
        className="w-10 h-8 text-gray-300"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="46" height="34" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M1 27 L13 17 L22 24 L30 18 L47 29"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── News row ─────────────────────────────────────────────────────────────────

function NewsRow({ item, isLast }) {
  return (
    <article className={`py-5 sm:py-6 min-w-0 ${isLast ? "" : "border-b border-gray-200"}`}>
      {/* Mobile: image above text  |  sm+: image left, text right */}
      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
        <ImagePlaceholder />

        {/* Text block — min-w-0 prevents flex child from expanding past parent */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${item.categoryColour}`}>
              {item.category}
            </span>
            <span className="text-gray-300 text-[10px]" aria-hidden="true">·</span>
            <span className="text-[11px] text-gray-400">{item.timestamp}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1.5 tracking-tight wrap-break-word">
            {item.headline}
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed mb-3 wrap-break-word">
            {item.description}
          </p>

          <span
            className="text-xs font-semibold text-gray-400 cursor-not-allowed select-none"
            title="Full article viewer coming soon"
          >
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Source link ──────────────────────────────────────────────────────────────

function SourceLink({ s }) {
  return (
    // flex (not inline-flex) so the link stretches to fill its grid cell on mobile
    <div
      title="Preview coming soon"
      className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2.5 cursor-not-allowed select-none min-w-0"
    >
      <span className="text-sm font-semibold text-gray-600">{s.name}</span>
      <span className="text-[10px] text-gray-400 leading-none">Preview</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Full-screen white news-style overlay.
 * `position: fixed; inset: 0` covers the entire viewport including header/footer.
 * `onExit` — called by the red Return button AND by a right-swipe gesture.
 *   Both paths call the same handler, so QuickExit / session burn behaviour is
 *   identical regardless of how the user leaves.
 */
export default function VerifiedView({ onExit }) {
  const today = getTodayFormatted();

  // ── Swipe-right gesture ─────────────────────────────────────────────────────
  // Stores the touch start coordinates so we can compute deltas on touchend.
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

    // Fire only when the swipe is:
    //   • at least SWIPE_MIN_PX to the right
    //   • more horizontal than vertical (avoids misfiring during normal scroll)
    if (dx >= SWIPE_MIN_PX && dx > dy) {
      onExit();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    // Root: overflow-x-hidden is the primary guard against horizontal scroll.
    // w-full + max-w-full ensure no child can push it wider than the viewport.
    <div
      className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden w-full max-w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── Sticky utility bar ─────────────────────────────────────────────────
          paddingTop / paddingLeft / paddingRight via inline style so that on
          iPhones with a notch or Dynamic Island the bar content sits below the
          status-bar area (env(safe-area-inset-*) is 0 on non-notched devices). */}
      <div
        className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200"
        style={{
          paddingTop:   "env(safe-area-inset-top,    0px)",
          paddingLeft:  "env(safe-area-inset-left,   0px)",
          paddingRight: "env(safe-area-inset-right,  0px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 min-w-0">

          {/* Swipe hint — mobile only, left-aligned, takes remaining space */}
          <p className="flex-1 min-w-0 text-[10px] text-gray-400 select-none sm:hidden leading-tight">
            Swipe right or tap Return to go back.
          </p>

          {/* Spacer on desktop so the button stays right-aligned */}
          <div className="hidden sm:block flex-1" aria-hidden="true" />

          {/* Return / QuickExit button
              44 × 44 px tap target on mobile (w-11 h-11), slightly smaller on desktop.
              "Return" label is hidden on mobile to keep the bar uncluttered. */}
          <button
            onClick={onExit}
            aria-label="Return to game"
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="hidden sm:inline text-sm font-medium text-gray-500 group-hover:text-gray-800 transition-colors duration-150">
              Return
            </span>
            <div className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-red-600 group-hover:bg-red-500 active:bg-red-700 transition-colors duration-150 flex items-center justify-center shadow-sm ring-1 ring-red-500/30 shrink-0">
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </div>
          </button>

        </div>
      </div>

      {/* ── Masthead ───────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-3xl mx-auto min-w-0 px-4 sm:px-6 pt-6 sm:pt-10 pb-5 sm:pb-7 border-b-2 border-gray-900">
        <div className="border-t-4 border-gray-900 mb-5 sm:mb-6" />

        {/* Publication title — wrap-break-word guards against any viewport where
            the single long word could theoretically overflow */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none text-center mb-3 wrap-break-word">
          Now You Know
        </h1>

        <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 wrap-break-word leading-relaxed">
          Independent context for a fast-changing world.
        </p>

        {/* Date + language selector — flex-wrap so they stack on very narrow screens */}
        <div className="flex items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-500 flex-wrap">
          <time dateTime={new Date().toISOString().split("T")[0]}>{today}</time>
          <span aria-hidden="true" className="text-gray-300">·</span>

          {/* Language selector — non-functional / visual only */}
          <div className="flex items-center gap-1.5 shrink-0" aria-label="Language">
            <button
              className="text-xs font-bold text-gray-900 underline underline-offset-2 decoration-1 cursor-default"
              aria-current="true"
              tabIndex={-1}
            >
              EN
            </button>
            <span className="text-gray-400 select-none" aria-hidden="true">|</span>
            <button
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-150 cursor-not-allowed"
              tabIndex={-1}
              title="Russian edition coming soon"
            >
              RU
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────────── */}
      {/* paddingBottom via style so env() gives extra clearance above the iOS home
          indicator on devices that have one. Falls back to 3 rem on other browsers. */}
      <main
        className="w-full max-w-3xl mx-auto min-w-0 px-4 sm:px-6"
        style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom, 0px))" }}
      >

        {/* Section label */}
        <div className="pt-5 sm:pt-6 pb-1 border-b border-gray-200 mb-1">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            International Briefing
          </h2>
        </div>

        {/* News rows */}
        <div className="min-w-0">
          {NEWS_ITEMS.map((item, i) => (
            <NewsRow
              key={item.id}
              item={item}
              isLast={i === NEWS_ITEMS.length - 1}
            />
          ))}
        </div>

        {/* ── Sources ──────────────────────────────────────────────────────────── */}
        <section className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 mb-1">
            International Sources
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Additional reporting sources for broader context.
          </p>
          {/* 1 column on mobile, 2 on sm+ — each card stretches full-width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOURCES.map((s) => (
              <SourceLink key={s.id} s={s} />
            ))}
          </div>
        </section>

        {/* ── Footer note ──────────────────────────────────────────────────────── */}
        <p className="mt-8 sm:mt-10 text-[11px] text-gray-400 border-t border-gray-100 pt-5 leading-relaxed">
          This view is session-based and may refresh periodically.
        </p>

      </main>
    </div>
  );
}

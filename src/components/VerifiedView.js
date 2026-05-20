"use client";

// ─── Briefing data ────────────────────────────────────────────────────────────

const BRIEFINGS = [
  {
    id: 1,
    region: "Europe",
    regionColour: "text-sky-400",
    headline: "European leaders discuss regional security",
    summary:
      "Senior officials from multiple member states convened this week to review shared security frameworks amid evolving geopolitical pressures across the continent.",
  },
  {
    id: 2,
    region: "Economy",
    regionColour: "text-amber-400",
    headline: "Markets watch energy and supply chain signals",
    summary:
      "Global equity markets remain attentive to fluctuating energy prices and ongoing logistics disruptions, with analysts urging caution ahead of central bank policy updates.",
  },
  {
    id: 3,
    region: "Press",
    regionColour: "text-emerald-400",
    headline: "Independent outlets expand digital distribution",
    summary:
      "A coalition of independent news organisations has announced coordinated efforts to widen digital reach, citing increased demand for source-verified international reporting.",
  },
  {
    id: 4,
    region: "Humanitarian",
    regionColour: "text-rose-400",
    headline: "Humanitarian organisations call for broader civilian support",
    summary:
      "International relief bodies have renewed appeals for increased civilian protection commitments from member states, pointing to emerging gaps in existing frameworks.",
  },
];

const SOURCES = [
  { id: 1, name: "BBC" },
  { id: 2, name: "Reuters" },
  { id: 3, name: "CNN" },
  { id: 4, name: "Meduza" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BriefingCard({ b }) {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors duration-150">
      <span className={`text-[10px] uppercase tracking-[0.12em] font-semibold block mb-2 ${b.regionColour}`}>
        {b.region}
      </span>
      <h3 className="text-white font-semibold text-sm leading-snug mb-2">
        {b.headline}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed">
        {b.summary}
      </p>
    </div>
  );
}

function SourceButton({ s }) {
  return (
    <div
      title="Preview coming soon"
      className="flex items-center gap-2.5 border border-slate-700/60 bg-slate-900/60 rounded-lg px-4 py-2.5 opacity-60 cursor-not-allowed select-none"
    >
      <span className="text-sm font-semibold text-slate-300">{s.name}</span>
      <span className="text-[10px] text-slate-600 border-l border-slate-700/80 pl-2.5 leading-none">
        Preview coming soon
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Full-screen overlay rendered when the SeedKey is verified.
 * Uses `position: fixed; inset: 0` so it covers everything — header, footer, game board.
 * `onExit` is called when the QuickExit button is clicked; the parent marks the session burned.
 */
export default function VerifiedView({ onExit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
        {/* Brand */}
        <span className="text-[11px] text-slate-500 tracking-[0.18em] uppercase font-medium select-none">
          Global Brief
        </span>

        {/* QuickExit — red circular button */}
        <button
          onClick={onExit}
          aria-label="Quick Exit — return to game"
          className="flex items-center gap-2.5 group"
        >
          <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors duration-150">
            Exit
          </span>
          <div className="w-9 h-9 rounded-full bg-red-700 group-hover:bg-red-600 active:bg-red-800 transition-colors duration-150 flex items-center justify-center shadow-lg shadow-red-950/60 ring-1 ring-red-600/40">
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

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-10 sm:py-14">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            Verified View
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Selected international briefings and source surfaces.
          </p>
        </div>

        <div className="border-t border-slate-800/70 mb-9" />

        {/* Current briefings */}
        <section className="mb-10">
          <h2 className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-4">
            Current Briefings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BRIEFINGS.map((b) => (
              <BriefingCard key={b.id} b={b} />
            ))}
          </div>
        </section>

        {/* Source surfaces */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-4">
            Source Surfaces
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {SOURCES.map((s) => (
              <SourceButton key={s.id} s={s} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

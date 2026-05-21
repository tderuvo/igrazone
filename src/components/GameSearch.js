"use client";

import { useState } from "react";
import { T } from "@/lib/translations";

// ─── Help Content ─────────────────────────────────────────────────────────────

const HELP_ARTICLES = [
  {
    id: 1,
    title: "How to move cards in the tableau",
    category: "Rules",
    text: "Click a face-up card to select it (it highlights in yellow), then click a valid destination column. Cards must be placed in descending order with alternating colours — red on black, black on red.",
    tags: ["move", "card", "tableau", "select", "click", "alternating", "colour", "color", "drag"],
  },
  {
    id: 2,
    title: "How the draw pile works",
    category: "Rules",
    text: "Click the draw pile (↺) to reveal one card at a time into the waste pile. When the draw pile is empty, click it again to recycle the entire waste pile back into the draw pile.",
    tags: ["draw", "stock", "waste", "pile", "recycle", "reveal", "flip", "↺"],
  },
  {
    id: 3,
    title: "Building the foundation piles",
    category: "Rules",
    text: "Each of the four foundation piles must be built in suit order from Ace up to King. Complete all four foundations to win the game.",
    tags: ["foundation", "ace", "king", "suit", "win", "complete", "build", "hearts", "spades", "clubs", "diamonds"],
  },
  {
    id: 4,
    title: "Why only Kings can move to empty columns",
    category: "Rules",
    text: "Klondike Solitaire reserves empty tableau columns exclusively for Kings. Use this strategically — clearing a column is most valuable when you have a King (and ideally a useful sequence below it) ready to place.",
    tags: ["king", "empty", "column", "rule", "klondike", "only"],
  },
  {
    id: 5,
    title: "Tips for uncovering hidden cards",
    category: "Tips",
    text: "Prioritise columns with the most face-down cards. Every flip reveals new options. Avoid moving cards onto a column if it buries a face-down stack you still need to clear.",
    tags: ["hidden", "face-down", "flip", "uncover", "reveal", "facedown", "covered"],
  },
  {
    id: 6,
    title: "How scoring works",
    category: "Rules",
    text: "Points are awarded for flipping face-down cards, moving cards to the foundations, and completing the game. A time bonus rewards faster completions, so plan your moves and avoid unnecessary draws.",
    tags: ["score", "points", "bonus", "time", "foundation", "win", "reward"],
  },
  {
    id: 7,
    title: "Restarting or starting a new game",
    category: "Help",
    text: "Use the New Game button for a freshly shuffled deal. Restart resets the current deal back to its original state — useful if you want to try a different approach on the same layout.",
    tags: ["restart", "new game", "reset", "shuffle", "start", "again", "button"],
  },
  {
    id: 8,
    title: "How to improve your completion time",
    category: "Tips",
    text: "Scan all seven tableau columns before drawing from the stock. Move sequences of cards rather than one at a time whenever possible. Plan two or three moves ahead to avoid backing yourself into a corner.",
    tags: ["time", "fast", "improve", "completion", "speed", "efficient", "quick", "faster"],
  },
  {
    id: 9,
    title: "When to draw from the stock pile",
    category: "Strategy",
    text: "Only draw when you have no useful tableau moves left. Drawing too early can bury cards you need. Check all columns first — even a move you think is unhelpful might free a face-down card.",
    tags: ["draw", "stock", "when", "strategy", "tableau", "columns", "no moves"],
  },
  {
    id: 10,
    title: "Common Solitaire mistakes to avoid",
    category: "Tips",
    text: "Avoid sending Kings to empty columns too early unless you have a productive sequence to follow. Don't chase long tableau chains if they lock face-down cards. Keep your foundation piles growing steadily across all four suits.",
    tags: ["mistake", "avoid", "common", "king", "foundation", "balance", "error", "wrong"],
  },
];

const CATEGORY_BADGE = {
  Rules:    "bg-sky-900/70 text-sky-300",
  Tips:     "bg-emerald-900/70 text-emerald-300",
  Strategy: "bg-amber-900/70 text-amber-300",
  Help:     "bg-slate-700 text-slate-300",
};

// ─── SeedKey ──────────────────────────────────────────────────────────────────
// The canonical form (lowercase, no trailing period, single spaces).
// Comparison is done against the normalised input — never the raw string.

const SEED_KEY = "light tomorrow with today";

/**
 * Normalise a search query for SeedKey comparison:
 *   1. Trim surrounding whitespace
 *   2. Lowercase
 *   3. Strip an optional trailing period (with any following spaces)
 *   4. Collapse internal runs of whitespace to a single space
 */
function normaliseSeedKey(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\.\s*$/, "")
    .replace(/\s+/g, " ");
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Props:
 *   onSeedKey  — called (no args) when the SeedKey is entered and the session is live
 *   burned     — true after a QuickExit; SeedKey then shows the session-expired message
 *   lang       — "en" | "ru"
 */
export default function GameSearch({ onSeedKey, burned = false, lang = "en" }) {
  const t = T[lang] ?? T.en;

  const [query,          setQuery]          = useState("");
  const [results,        setResults]        = useState([]);
  const [searched,       setSearched]       = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  function handleSearch() {
    const raw = query;
    const q   = raw.trim().toLowerCase();
    if (!q) return;

    // ── SeedKey check (runs before normal search) ─────────────────────────────
    if (normaliseSeedKey(raw) === SEED_KEY) {
      if (burned) {
        // Session already burned: show expiry notice in the results panel
        setResults([]);
        setSessionExpired(true);
        setSearched(true);
      } else {
        // Live session: hand off to parent and leave no trail in the search bar
        setQuery("");
        setResults([]);
        setSearched(false);
        setSessionExpired(false);
        onSeedKey?.();
      }
      return; // <── do NOT fall through to normal search
    }

    // ── Normal help search ────────────────────────────────────────────────────
    setSessionExpired(false);
    const matches = HELP_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.text.toLowerCase().includes(q) ||
      a.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    setResults(matches);
    setSearched(true);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setSearched(false);
    setSessionExpired(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="mt-5">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{t.gameHelp}</p>

      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className="flex-1 bg-slate-700 border border-slate-600 text-slate-200 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-500 transition-colors duration-150"
        />
        <button
          onClick={handleSearch}
          className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shrink-0"
        >
          {t.search}
        </button>
        {searched && (
          <button
            onClick={handleClear}
            className="border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shrink-0"
          >
            {t.clear}
          </button>
        )}
      </div>

      {/* Results panel */}
      {searched && (
        <div className="mt-3">
          {sessionExpired ? (
            // ── Session-expired message ───────────────────────────────────────
            <div className="text-sm text-slate-500 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
              This session has expired. A fresh access phrase is required.
            </div>
          ) : results.length === 0 ? (
            // ── Empty help-search state ───────────────────────────────────────
            <div className="text-sm text-slate-500 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
              {t.noHelpFound}
            </div>
          ) : (
            // ── Normal help results ───────────────────────────────────────────
            <div className="space-y-1.5">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg px-4 py-3 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <span className="text-sm text-slate-200 font-medium leading-snug">
                      {r.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                        CATEGORY_BADGE[r.category] ?? CATEGORY_BADGE.Help
                      }`}
                    >
                      {r.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

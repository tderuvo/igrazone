"use client";

import { useState, useEffect } from "react";
import GameSearch from "@/components/GameSearch";
import VerifiedView from "@/components/VerifiedView";
import { dealGame, canMoveToTableau, executeTableauMove } from "@/lib/deckUtils";
import { T } from "@/lib/translations";

// ─── Card Rendering ───────────────────────────────────────────────────────────

function FaceDownStack({ count }) {
  if (count === 0) return null;
  const containerHeight = 12 + (count - 1) * 14;
  return (
    <div className="relative mb-1" style={{ height: `${containerHeight}px` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full bg-sky-900 rounded-sm border border-sky-800"
          style={{ top: `${i * 14}px`, height: "26px" }}
        />
      ))}
    </div>
  );
}

/**
 * A single face-up card.
 * `isSelected` adds a yellow ring so the player can see what they have picked up.
 */
function FaceUpCard({ rank, suit, red, isSelected = false }) {
  return (
    <div
      className={`w-full bg-white rounded border p-1 flex flex-col justify-between aspect-7/10 transition-all ${
        isSelected
          ? "border-yellow-300 ring-2 ring-yellow-300 shadow-lg shadow-yellow-400/25"
          : "border-slate-200"
      }`}
    >
      <div
        className={`text-[9px] sm:text-[11px] font-bold leading-none ${
          red ? "text-red-600" : "text-slate-800"
        }`}
      >
        {rank}
      </div>
      <div
        className={`text-base sm:text-xl text-center leading-none ${
          red ? "text-red-500" : "text-slate-800"
        }`}
      >
        {suit}
      </div>
    </div>
  );
}

function EmptySlot({ suit, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full aspect-7/10 rounded border-2 border-dashed flex items-center justify-center border-emerald-900/40 ${
        onClick ? "cursor-pointer hover:border-emerald-700/60" : ""
      }`}
    >
      {suit && (
        <span
          className={`text-base sm:text-lg opacity-30 ${
            suit === "♥" || suit === "♦" ? "text-red-400" : "text-slate-400"
          }`}
        >
          {suit}
        </span>
      )}
    </div>
  );
}

// ─── Draw Pile ────────────────────────────────────────────────────────────────

function DrawPile({ count, onClick }) {
  const isEmpty = count === 0;
  return (
    <div
      onClick={onClick}
      title={isEmpty ? "Click to recycle waste pile" : `${count} cards remaining`}
      className={`relative w-full aspect-7/10 rounded border flex flex-col items-center justify-center cursor-pointer transition-opacity select-none ${
        isEmpty
          ? "border-dashed border-emerald-700/40 hover:border-emerald-600/70"
          : "bg-sky-900 border-sky-800 hover:opacity-80"
      }`}
    >
      <span
        className={`text-xl leading-none ${
          isEmpty ? "text-emerald-700/50" : "text-sky-400"
        }`}
      >
        ↺
      </span>
      {!isEmpty && (
        <span className="mt-1 text-[10px] font-semibold tabular-nums text-sky-600">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Tableau Column ───────────────────────────────────────────────────────────
//
// Renders one tableau column:
//   • face-down stack (not interactive)
//   • face-up cards, stacked with a CSS negative-margin peek
//   • empty-slot placeholder (clickable for King moves) when the column is clear
//
// Each face-up card wrapper uses `marginTop: '-100%'` starting from the second
// card.  Because `margin` percentages in CSS are relative to the *containing
// block's width*, and the card has `aspect-7/10` (height ≈ 1.43 × width), the
// peek of each intermediate card is ≈ 43 % of the column width — enough to
// read the rank at any viewport size while keeping columns compact.
//
// z-index is set explicitly so later cards always paint in front of earlier ones
// regardless of browser stacking-context quirks.

function TableauColumn({ col, colIdx, selected, onCardClick, onColumnClick }) {
  const isColSelected = selected?.colIdx === colIdx;

  return (
    <div className="flex flex-col">
      {/* Face-down stack — display only, no click handler */}
      <FaceDownStack count={col.faceDown.length} />

      {col.faceUp.length === 0 ? (
        // Truly empty column (no face-down cards either): King landing zone
        <EmptySlot onClick={() => onColumnClick(colIdx)} />
      ) : (
        <div className="flex flex-col">
          {col.faceUp.map((card, cardIdx) => {
            const isSelected = isColSelected && selected.cardIdx <= cardIdx;
            return (
              <div
                key={card.id}
                style={{
                  marginTop: cardIdx > 0 ? "-100%" : undefined,
                  position: "relative",
                  zIndex: cardIdx + 1,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(colIdx, cardIdx);
                }}
              >
                <FaceUpCard
                  rank={card.rank}
                  suit={card.suit}
                  red={card.red}
                  isSelected={isSelected}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

function SolitaireBoard({
  drawPile,
  wastePile,
  tableau,
  selected,
  onDrawClick,
  onCardClick,
  onColumnClick,
}) {
  const topWaste = wastePile.length > 0 ? wastePile[wastePile.length - 1] : null;

  return (
    <div className="bg-[#1b3326] rounded-xl p-3 sm:p-5 select-none w-full">
      {/* Top row: Draw | Waste | spacer | 4 Foundations */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        <DrawPile count={drawPile.length} onClick={onDrawClick} />

        {topWaste ? (
          <FaceUpCard rank={topWaste.rank} suit={topWaste.suit} red={topWaste.red} />
        ) : (
          <EmptySlot />
        )}

        <div />

        {["♠", "♥", "♦", "♣"].map((suit) => (
          <EmptySlot key={suit} suit={suit} />
        ))}
      </div>

      {/* Tableau — 7 interactive columns */}
      <div className="grid grid-cols-7 gap-1.5">
        {tableau.map((col, i) => (
          <TableauColumn
            key={i}
            col={col}
            colIdx={i}
            selected={selected}
            onCardClick={onCardClick}
            onColumnClick={onColumnClick}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ t }) {
  return (
    <aside className="flex flex-col gap-4 lg:w-64 shrink-0">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4" id="rules">
        <h3 className="text-white font-semibold mb-3 text-sm">{t.howToPlay}</h3>
        <ul className="space-y-2 text-slate-400 text-xs leading-relaxed">
          <li>• Move cards to the four foundation piles in suit order, Ace to King.</li>
          <li>• Build tableau columns in descending order, alternating colours.</li>
          <li>• Draw from the stock pile when no moves are available.</li>
          <li>• Complete all foundations to win.</li>
        </ul>
      </div>

      <div className="bg-linear-to-br from-sky-900/50 to-slate-800 border border-sky-800/40 rounded-xl p-4">
        <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold block mb-1">
          {t.dailyLabel}
        </span>
        <h3 className="text-white font-semibold mb-2 text-sm">{t.dailyChallenge}</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-3">
          {t.dailyDesc}
        </p>
        <button className="w-full text-sm bg-sky-600 hover:bg-sky-500 text-white rounded-lg py-2 transition-colors duration-150 font-medium">
          {t.startChallenge}
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3 text-sm">{t.topScores}</h3>
        <div className="space-y-2">
          {[
            { rank: 1, name: "Player_44",    score: "7,240" },
            { rank: 2, name: "KlondikeKing", score: "6,980" },
            { rank: 3, name: "CardShark91",  score: "6,510" },
          ].map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-4">{entry.rank}.</span>
                <span className="text-slate-300">{entry.name}</span>
              </div>
              <span className="text-sky-400 font-medium">{entry.score}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-xs text-slate-500 hover:text-slate-300 transition-colors duration-150">
          {t.viewAllScores}
        </button>
      </div>
    </aside>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BoardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="h-7 w-24 bg-slate-700 rounded" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
          <div className="h-8 w-24 bg-sky-900 rounded-lg" />
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="bg-[#1b3326] rounded-xl p-3 sm:p-5 w-full">
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="aspect-7/10 rounded bg-sky-950/50" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="aspect-7/10 rounded bg-sky-950/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────

export default function SolitaireGame({
  articles     = [],
  leadStory    = null,
  infographics = [],
  lang         = "en",
  onLangChange,
}) {
  const t = T[lang] ?? T.en;

  const [gameState, setGameState] = useState(null);

  // { colIdx: number, cardIdx: number } — which face-up card is selected,
  // null when nothing is selected.  Moving a card also moves all face-up cards
  // below it in the same column (the selected "sub-stack").
  const [selected, setSelected] = useState(null);

  // ── Verified View state ───────────────────────────────────────────────────
  // verified: true  → show VerifiedView overlay instead of the game
  // burned:   true  → SeedKey was used and QuickExit was clicked this session;
  //                   entering the SeedKey again shows the expiry message
  const [verified, setVerified] = useState(false);
  const [burned,   setBurned]   = useState(false);

  useEffect(() => {
    setGameState(dealGame());
  }, []);

  // ── New Game / Restart ────────────────────────────────────────────────────

  function handleNewGame() {
    setGameState(dealGame());
    setSelected(null);
  }

  // ── Verified View handlers ────────────────────────────────────────────────

  function handleSeedKey() {
    setVerified(true);
  }

  function handleQuickExit() {
    setVerified(false); // return to game
    setBurned(true);    // lock this session — same SeedKey will show expiry message
  }

  // ── Draw pile ─────────────────────────────────────────────────────────────

  function handleDrawClick() {
    setGameState((prev) => {
      if (!prev) return prev;
      if (prev.drawPile.length === 0) {
        if (prev.wastePile.length === 0) return prev;
        return {
          ...prev,
          drawPile: [...prev.wastePile].reverse(),
          wastePile: [],
        };
      }
      const newDraw = [...prev.drawPile];
      const card = newDraw.pop();
      return { ...prev, drawPile: newDraw, wastePile: [...prev.wastePile, card] };
    });
  }

  // ── Tableau card click ────────────────────────────────────────────────────
  //
  // Rules:
  //   • Nothing selected  → select this card (+ all cards below it = sub-stack)
  //   • Same card clicked → deselect
  //   • Different card in same column → change selection within the column
  //   • Card in a different column:
  //       valid move  → execute, clear selection
  //       invalid     → keep selection (per spec; user must deselect manually)

  function handleCardClick(colIdx, cardIdx) {
    if (!gameState) return;

    // ── Case 1: nothing selected → select
    if (selected === null) {
      setSelected({ colIdx, cardIdx });
      return;
    }

    // ── Case 2: same card → deselect
    if (selected.colIdx === colIdx && selected.cardIdx === cardIdx) {
      setSelected(null);
      return;
    }

    // ── Case 3: different card in same column → change selection
    if (selected.colIdx === colIdx) {
      setSelected({ colIdx, cardIdx });
      return;
    }

    // ── Case 4: different column → attempt move onto that column's top
    const { tableau } = gameState;
    const movingCards = tableau[selected.colIdx].faceUp.slice(selected.cardIdx);
    const targetCol   = tableau[colIdx];
    const targetTop   = targetCol.faceUp.length > 0
      ? targetCol.faceUp[targetCol.faceUp.length - 1]
      : null;

    if (canMoveToTableau(movingCards[0], targetTop)) {
      setGameState((prev) => ({
        ...prev,
        tableau: executeTableauMove(prev.tableau, selected.colIdx, selected.cardIdx, colIdx),
      }));
      setSelected(null);
    }
    // else: invalid move — keep selection (no state change)
  }

  // ── Empty-column click ────────────────────────────────────────────────────
  // Only Kings can land on an empty column.

  function handleEmptyColumnClick(colIdx) {
    if (!gameState || selected === null) return;

    const movingCards = gameState.tableau[selected.colIdx].faceUp.slice(selected.cardIdx);

    if (canMoveToTableau(movingCards[0], null)) {
      setGameState((prev) => ({
        ...prev,
        tableau: executeTableauMove(prev.tableau, selected.colIdx, selected.cardIdx, colIdx),
      }));
      setSelected(null);
    }
    // else: keep selection
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!gameState) return <BoardSkeleton />;

  // SeedKey was entered — show full-screen Verified View instead of the game.
  // The overlay uses position:fixed so it covers header, footer, and everything.
  if (verified) return (
    <VerifiedView
      onExit={handleQuickExit}
      articles={articles}
      leadStory={leadStory}
      infographics={infographics}
      lang={lang}
      onLangChange={onLangChange}
    />
  );

  const { drawPile, wastePile, tableau } = gameState;

  return (
    <>
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-xl font-bold text-white">{t.klondikeTitle}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
            <span className="text-slate-500 text-xs">{t.score}</span>
            <span className="text-white font-semibold">0</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
            <span className="text-slate-500 text-xs">{t.timer}</span>
            <span className="text-white font-semibold tabular-nums">00:00</span>
          </div>
          <button
            onClick={handleNewGame}
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white font-medium px-4 py-1.5 rounded-lg transition-colors duration-150"
          >
            {t.newGame}
          </button>
          <button
            onClick={handleNewGame}
            className="text-sm border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-4 py-1.5 rounded-lg transition-colors duration-150"
          >
            {t.restart}
          </button>
        </div>
      </div>

      {/* Main layout: board + sidebar */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0" id="help">
          <SolitaireBoard
            drawPile={drawPile}
            wastePile={wastePile}
            tableau={tableau}
            selected={selected}
            onDrawClick={handleDrawClick}
            onCardClick={handleCardClick}
            onColumnClick={handleEmptyColumnClick}
          />
          <GameSearch onSeedKey={handleSeedKey} burned={burned} lang={lang} />
        </div>
        <Sidebar t={t} />
      </div>
    </>
  );
}

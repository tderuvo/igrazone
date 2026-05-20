// ─── Deck Utilities ─────────────────────────────────────────────────────────
// Pure helpers: no state, no React. Used by SolitaireGame.

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];
const RED_SUITS = new Set(["♥", "♦"]);

/** Returns true for red suits (hearts / diamonds). */
export function isRed(suit) {
  return RED_SUITS.has(suit);
}

/** Builds a fresh 52-card deck in suit/rank order. */
export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, red: isRed(suit), id: `${rank}-${suit}` });
    }
  }
  return deck;
}

/** Fisher-Yates in-place shuffle (returns a new array). */
export function shuffleDeck(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/**
 * Deals a standard Klondike game.
 *
 * Returns:
 *   tableau  — 7 columns, each { faceDown: Card[], faceUp: Card[] }
 *   drawPile — 24 remaining cards (top of pile = last element)
 *   wastePile — [] (empty at start)
 */
export function dealGame() {
  const deck = shuffleDeck(createDeck());
  let idx = 0;

  const tableau = [];
  for (let col = 0; col < 7; col++) {
    const faceDown = [];
    for (let row = 0; row < col; row++) {
      faceDown.push(deck[idx++]);
    }
    const faceUp = [deck[idx++]];
    tableau.push({ faceDown, faceUp });
  }

  // Remaining 24 cards go to the draw pile (last element = top)
  const drawPile = deck.slice(idx);

  return { tableau, drawPile, wastePile: [] };
}

// ─── Move Validation ─────────────────────────────────────────────────────────

const RANK_VALUES = {
  A: 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
  "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13,
};

/** Numeric rank value — A=1, 2=2, … K=13. */
export function rankValue(rank) {
  return RANK_VALUES[rank];
}

/**
 * Returns true if `card` can legally be placed onto `targetTopCard` in the tableau.
 * Pass `targetTopCard = null` for an empty column (Kings only).
 */
export function canMoveToTableau(card, targetTopCard) {
  if (targetTopCard === null) return card.rank === "K";
  return (
    rankValue(card) === rankValue(targetTopCard) - 1 &&
    card.red !== targetTopCard.red
  );
}

/**
 * Executes a validated tableau-to-tableau move (pure — returns a new tableau array).
 *
 * Removes faceUp[fromCardIdx..] from the source column, appends it to the target.
 * If the source column now has no face-up cards, the top face-down card is flipped.
 */
export function executeTableauMove(tableau, fromColIdx, fromCardIdx, toColIdx) {
  const next = tableau.map((col) => ({
    faceDown: [...col.faceDown],
    faceUp:   [...col.faceUp],
  }));

  // Lift sub-stack out of source
  const moving = next[fromColIdx].faceUp.splice(fromCardIdx);

  // Flip top face-down card in source if nothing face-up remains
  if (next[fromColIdx].faceUp.length === 0 && next[fromColIdx].faceDown.length > 0) {
    next[fromColIdx].faceUp.push(next[fromColIdx].faceDown.pop());
  }

  // Drop sub-stack onto target
  next[toColIdx].faceUp.push(...moving);

  return next;
}

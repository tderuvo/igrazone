import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Browse Games — IgraZone",
  description: "Classic browser games designed for fast, distraction-free play.",
};

const allGames = [
  {
    name: "Solitaire",
    description: "The all-time classic card game. Draw, stack, and win.",
    category: "Cards",
    href: "/games/solitaire",
    available: true,
  },
  {
    name: "Spider Solitaire",
    description: "Two decks, eight columns, one satisfying win.",
    category: "Cards",
    available: false,
  },
  {
    name: "FreeCell",
    description: "Almost every deal is winnable with the right strategy.",
    category: "Cards",
    available: false,
  },
  {
    name: "Chess",
    description: "Challenge yourself with the world's greatest strategy game.",
    category: "Strategy",
    available: false,
  },
  {
    name: "Sudoku",
    description: "Fill the grid with numbers. Easy, medium, or expert difficulty.",
    category: "Puzzle",
    available: false,
  },
  {
    name: "Checkers",
    description: "Jump your way to victory on the classic 8×8 board.",
    category: "Board",
    available: false,
  },
  {
    name: "Mahjong",
    description: "Match tiles and clear the board in this ancient classic.",
    category: "Tiles",
    available: false,
  },
  {
    name: "Crossword",
    description: "Daily crossword puzzles ranging from easy to challenging.",
    category: "Word",
    available: false,
  },
];

function GameCard({ game }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-3 hover:border-slate-600 transition-colors duration-150 group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-base group-hover:text-sky-400 transition-colors duration-150">
          {game.name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {!game.available && (
            <span className="text-xs bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">
              Soon
            </span>
          )}
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
            {game.category}
          </span>
        </div>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{game.description}</p>
      {game.available ? (
        <Link
          href={game.href}
          className="w-full text-sm text-center text-sky-400 border border-sky-700 hover:bg-sky-700 hover:text-white rounded-lg py-2 transition-colors duration-150 font-medium block"
        >
          Play
        </Link>
      ) : (
        <button
          disabled
          className="w-full text-sm text-slate-600 border border-slate-700 rounded-lg py-2 font-medium cursor-not-allowed"
        >
          Coming Soon
        </button>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Games</h1>
          <p className="text-slate-400 mb-10">
            Classic browser games designed for fast, distraction-free play.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allGames.map((game) => (
              <GameCard key={game.name} game={game} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

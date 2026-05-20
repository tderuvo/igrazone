import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const games = [
  {
    name: "Solitaire",
    description: "The all-time classic card game. Draw, stack, and win.",
    category: "Cards",
  },
  {
    name: "Chess",
    description: "Challenge yourself with the world's greatest strategy game.",
    category: "Strategy",
  },
  {
    name: "Sudoku",
    description: "Fill the grid with numbers. Easy, medium, or hard.",
    category: "Puzzle",
  },
  {
    name: "Checkers",
    description: "Jump your way to victory on the classic 8×8 board.",
    category: "Board",
  },
  {
    name: "FreeCell",
    description: "A solitaire variant where almost every deal is winnable.",
    category: "Cards",
  },
  {
    name: "Spider Solitaire",
    description: "Two decks, eight columns, one satisfying win.",
    category: "Cards",
  },
];

const features = [
  {
    icon: "⚡",
    title: "Fast Loading",
    desc: "Games start instantly — no downloads, no installs, no waiting.",
  },
  {
    icon: "✦",
    title: "No Clutter",
    desc: "Clean interface with zero ads blocking your game view.",
  },
  {
    icon: "🃏",
    title: "Classic Games",
    desc: "Timeless titles you already know and love, playable anywhere.",
  },
];


function CardIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto h-48 mt-4 select-none" aria-hidden="true">
      <div className="absolute left-1/2 top-6 -translate-x-1/2 w-28 h-40 bg-slate-700 rounded-xl rotate-[-8deg] opacity-50" />
      <div className="absolute left-1/2 top-4 -translate-x-1/2 w-28 h-40 bg-slate-600 rounded-xl rotate-[-4deg] opacity-70" />
      <div className="absolute left-1/2 top-2 -translate-x-1/2 w-28 h-40 bg-gradient-to-br from-sky-700 to-slate-700 rounded-xl border border-sky-500/40 shadow-xl flex items-center justify-center">
        <span className="text-4xl text-white/80">♠</span>
      </div>
      <div className="absolute left-[28%] top-8 w-20 h-28 bg-slate-700 rounded-xl border border-slate-600 flex items-center justify-center opacity-80">
        <span className="text-2xl text-red-400">♥</span>
      </div>
      <div className="absolute left-[58%] top-8 w-20 h-28 bg-slate-700 rounded-xl border border-slate-600 flex items-center justify-center opacity-80">
        <span className="text-2xl text-slate-300">♦</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 pt-20 pb-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Classic Games.<br />
            <span className="text-sky-400">Simple Fun.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0 mb-8">
            Play timeless browser games with a clean, fast, distraction-free experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/games/solitaire"
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150 text-center"
            >
              Play Solitaire
            </Link>
            <Link
              href="/games"
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150 text-center"
            >
              Browse Games
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full">
          <CardIllustration />
        </div>
      </div>
    </section>
  );
}

function GameCard({ game }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-3 hover:border-sky-600 transition-colors duration-150 group">
      <div className="flex items-start justify-between">
        <h3 className="text-white font-semibold text-base group-hover:text-sky-400 transition-colors duration-150">
          {game.name}
        </h3>
        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full shrink-0 ml-2">
          {game.category}
        </span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{game.description}</p>
      <button className="w-full text-sm text-sky-400 border border-sky-700 hover:bg-sky-700 hover:text-white rounded-lg py-2 transition-colors duration-150 font-medium">
        Play
      </button>
    </div>
  );
}

function FeaturedGames() {
  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Featured Games</h2>
        <p className="text-slate-400 mb-10">Jump straight into your favourite classic.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <GameCard key={game.name} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyChallenge() {
  return (
    <section className="bg-gradient-to-r from-sky-900/40 to-slate-800 border-y border-slate-700 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-2 block">
            Daily
          </span>
          <h2 className="text-2xl font-bold text-white mb-3">Today&apos;s Challenge</h2>
          <p className="text-slate-400 max-w-md">
            A new classic game challenge drops every day. Complete it, climb the leaderboard, and come back tomorrow.
          </p>
        </div>
        <button className="shrink-0 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150">
          Start Challenge
        </button>
      </div>
    </section>
  );
}

function WhyIgraZone() {
  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Why IgraZone?</h2>
        <p className="text-slate-400 text-center mb-12">
          Built for people who just want to play.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturedGames />
        <DailyChallenge />
        <WhyIgraZone />
      </main>
      <SiteFooter />
    </>
  );
}

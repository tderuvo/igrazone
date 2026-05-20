import Link from "next/link";

const navLinks = [
  { label: "Games", href: "/games" },
  { label: "Daily", href: "#" },
  { label: "Solitaire", href: "/games/solitaire" },
  { label: "Puzzles", href: "#" },
  { label: "Scores", href: "#" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            Igra<span className="text-sky-400">Zone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          href="/games"
          className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
        >
          Play Now
        </Link>
      </div>
    </header>
  );
}

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SolitaireGame from "@/components/SolitaireGame";
import { getArticles } from "@/lib/getArticles";

export const metadata = {
  title: "Solitaire — IgraZone",
  description: "Play classic Klondike Solitaire in your browser. Fast, clean, no clutter.",
};

export default function SolitairePage() {
  // Load articles server-side so they are available to the Verified View
  // without any client-side fetch.  getArticles() reads the filesystem, so
  // it can only live here (server component) — never in a "use client" file.
  const articles = getArticles();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-900 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5">
            <Link href="/" className="hover:text-slate-300 transition-colors duration-150">
              Home
            </Link>
            <span>/</span>
            <Link href="/games" className="hover:text-slate-300 transition-colors duration-150">
              Games
            </Link>
            <span>/</span>
            <span className="text-slate-300">Solitaire</span>
          </nav>

          {/* Interactive game — client component.
              articles is a plain serialisable array, safe to pass as a prop. */}
          <SolitaireGame articles={articles} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

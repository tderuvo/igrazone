"use client";

import Link from "next/link";
import { T } from "@/lib/translations";

/**
 * Simplified header — Klondike-only site.
 * Receives lang + onLangChange from SolitairePageWrapper.
 */
export default function SiteHeader({ lang = "en", onLangChange }) {
  const t = T[lang];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            Igra<span className="text-sky-400">Zone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400" aria-label="Main">
            <Link href="/" className="hover:text-white transition-colors duration-150">
              {t.klondike}
            </Link>
            <Link href="#rules" className="hover:text-white transition-colors duration-150">
              {t.rules}
            </Link>
            <Link href="#help" className="hover:text-white transition-colors duration-150">
              {t.help}
            </Link>
          </nav>
        </div>

        {/* EN | RU language toggle */}
        <div className="flex items-center gap-2" aria-label="Language">
          <button
            onClick={() => onLangChange?.("en")}
            aria-current={lang === "en" ? "true" : undefined}
            className={`text-sm font-semibold transition-colors duration-150 px-1 ${
              lang === "en"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            EN
          </button>
          <span className="text-slate-700 select-none" aria-hidden="true">|</span>
          <button
            onClick={() => onLangChange?.("ru")}
            aria-current={lang === "ru" ? "true" : undefined}
            className={`text-sm font-semibold transition-colors duration-150 px-1 ${
              lang === "ru"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            RU
          </button>
        </div>

      </div>
    </header>
  );
}

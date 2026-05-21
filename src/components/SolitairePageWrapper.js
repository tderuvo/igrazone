"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SolitaireGame from "@/components/SolitaireGame";

/**
 * Client wrapper that:
 *  - owns language state (persisted to localStorage)
 *  - selects the correct language's articles / lead story
 *  - threads onLangChange down through the header and game
 *
 * Server pages fetch both EN and RU at build time and pass them as props.
 * Switching language is instant — no refetch required.
 */
export default function SolitairePageWrapper({
  articlesEn   = [],
  articlesRu   = [],
  leadStoryEn  = null,
  leadStoryRu  = null,
  infographics = [],
}) {
  // Initialise to "en"; hydrate from localStorage after mount to avoid
  // SSR / hydration mismatch.
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("ig_lang");
    if (saved === "en" || saved === "ru") setLang(saved);
  }, []);

  function handleLangChange(l) {
    setLang(l);
    localStorage.setItem("ig_lang", l);
  }

  // Select the right content based on active language
  const articles  = lang === "ru" ? articlesRu  : articlesEn;
  const leadStory = lang === "ru" ? leadStoryRu : leadStoryEn;

  return (
    <>
      <SiteHeader lang={lang} onLangChange={handleLangChange} />
      <main className="flex-1 bg-slate-900 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <SolitaireGame
            articles={articles}
            leadStory={leadStory}
            infographics={infographics}
            lang={lang}
            onLangChange={handleLangChange}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

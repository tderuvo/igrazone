"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SolitaireGame from "@/components/SolitaireGame";

/**
 * Client wrapper that owns language state.
 * Server pages fetch data and pass it here as plain props.
 */
export default function SolitairePageWrapper({
  articles    = [],
  leadStory   = null,
  infographics = [],
}) {
  // Initialise to "en"; hydrate from localStorage after mount.
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("ig_lang");
    if (saved === "en" || saved === "ru") setLang(saved);
  }, []);

  function handleLangChange(l) {
    setLang(l);
    localStorage.setItem("ig_lang", l);
  }

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
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

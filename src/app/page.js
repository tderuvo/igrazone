import { getArticles }   from "@/lib/getArticles";
import { getLeadStory }  from "@/lib/getLeadStory";
import { infographics }  from "@/content/infographics";
import SolitairePageWrapper from "@/components/SolitairePageWrapper";

export const metadata = {
  title: "IgraZone — Klondike Solitaire",
  description: "Play classic Klondike Solitaire in your browser. Fast, clean, no clutter.",
};

export default function Home() {
  // Both language variants are fetched once at server/build time.
  // The client wrapper selects the right set based on the active lang state.
  return (
    <SolitairePageWrapper
      articlesEn={getArticles("en")}
      articlesRu={getArticles("ru")}
      leadStoryEn={getLeadStory("en")}
      leadStoryRu={getLeadStory("ru")}
      infographics={infographics}
    />
  );
}

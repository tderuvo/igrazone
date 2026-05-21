import { getArticles }   from "@/lib/getArticles";
import { getLeadStory }  from "@/lib/getLeadStory";
import { infographics }  from "@/content/infographics";
import SolitairePageWrapper from "@/components/SolitairePageWrapper";

export const metadata = {
  title: "Solitaire — IgraZone",
  description: "Play classic Klondike Solitaire in your browser. Fast, clean, no clutter.",
};

export default function SolitairePage() {
  // Both language variants are fetched once at server/build time.
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

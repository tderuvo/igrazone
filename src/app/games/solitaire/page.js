import { getArticles }   from "@/lib/getArticles";
import { getLeadStory }  from "@/lib/getLeadStory";
import { infographics }  from "@/content/infographics";
import SolitairePageWrapper from "@/components/SolitairePageWrapper";

export const metadata = {
  title: "Solitaire — IgraZone",
  description: "Play classic Klondike Solitaire in your browser. Fast, clean, no clutter.",
};

export default function SolitairePage() {
  const articles  = getArticles();
  const leadStory = getLeadStory();

  return (
    <SolitairePageWrapper
      articles={articles}
      leadStory={leadStory}
      infographics={infographics}
    />
  );
}

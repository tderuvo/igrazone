import { getArticles }   from "@/lib/getArticles";
import { getLeadStory }  from "@/lib/getLeadStory";
import { infographics }  from "@/content/infographics";
import SolitairePageWrapper from "@/components/SolitairePageWrapper";

export const metadata = {
  title: "IgraZone — Klondike Solitaire",
  description: "Play classic Klondike Solitaire in your browser. Fast, clean, no clutter.",
};

export default function Home() {
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

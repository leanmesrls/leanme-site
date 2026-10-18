import { ArticleInterestReport } from "@/components/lean-human/ArticleInterestReport";
import { LeanHumanInbox } from "@/components/lean-human/LeanHumanInbox";
import { PromptBuilderInbox } from "@/components/lean-human/PromptBuilderInbox";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Lean.Human",
  description: "Teresa pubblica, interesse sugli articoli e Prompt Builder.",
  path: "/lean-human",
  noIndex: true,
});

export default function LeanHumanPage() {
  return (
    <div className="divide-y divide-white/10">
      <LeanHumanInbox />
      <ArticleInterestReport />
      <PromptBuilderInbox />
    </div>
  );
}

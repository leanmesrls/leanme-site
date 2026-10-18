import { ArticleInterestReport } from "@/components/lean-human/ArticleInterestReport";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Interesse articoli",
  description: "Report delle stelline sugli articoli LeanLab.",
  path: "/lean-human/interesse",
  noIndex: true,
});

export default function ArticleInterestPage() {
  return <ArticleInterestReport />;
}

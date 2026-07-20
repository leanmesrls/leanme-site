import { LeanHumanInbox } from "@/components/lean-human/LeanHumanInbox";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Lean.Human · Teresa pubblica",
  description: "Supervisione conversazioni Teresa sul sito pubblico LeanMe.",
  path: "/lean-human",
  noIndex: true,
});

export default function LeanHumanPage() {
  return <LeanHumanInbox />;
}

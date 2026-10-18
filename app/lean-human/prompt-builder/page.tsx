import { PromptBuilderInbox } from "@/components/lean-human/PromptBuilderInbox";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Prompt Builder",
  description: "Schede del Lean Prompt Builder.",
  path: "/lean-human/prompt-builder",
  noIndex: true,
});

export default function PromptBuilderAdminPage() {
  return <PromptBuilderInbox />;
}

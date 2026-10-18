import { PromptLab } from "@/components/prompt-builder/PromptLab";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Lean Prompt Builder v1.0",
  description:
    "Un laboratorio di un minuto per trasformare un'idea in un prompt. Beta gratuita fino al 19 novembre 2026.",
  path: "/prompt-builder",
});

export default function PromptBuilderPage() {
  return <PromptLab />;
}

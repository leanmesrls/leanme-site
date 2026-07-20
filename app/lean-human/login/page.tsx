import { Suspense } from "react";
import { LeanHumanLoginForm } from "@/components/lean-human/LeanHumanLoginForm";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Lean.Human · Accesso",
  description: "Accesso riservato operatori LeanMe — supervisione Teresa pubblica.",
  path: "/lean-human/login",
  noIndex: true,
});

export default function LeanHumanLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center px-5 py-16">
      <Suspense fallback={<p className="mx-auto text-white/50">Caricamento…</p>}>
        <LeanHumanLoginForm />
      </Suspense>
    </div>
  );
}

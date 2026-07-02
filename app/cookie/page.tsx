import Link from "next/link";
import { PageSection } from "@/components/layout/PageSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Cookie Policy",
  description: "Informativa sui cookie di LeanMe Srls.",
  path: "/cookie",
});

export default function CookiePage() {
  return (
    <PageSection>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
        <p className="mt-6 text-white/65">
          Pagina placeholder. Sostituire con la cookie policy completa di
          LeanMe Srls.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
        >
          ← Torna alla Home
        </Link>
      </div>
    </PageSection>
  );
}

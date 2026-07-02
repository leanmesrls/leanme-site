import Link from "next/link";
import { PageSection } from "@/components/layout/PageSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Informativa sulla privacy di LeanMe Srls.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageSection>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-6 text-white/65">
          Pagina placeholder. Sostituire con l&apos;informativa privacy
          completa di LeanMe Srls.
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

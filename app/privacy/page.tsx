import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Informativa sulla privacy di LeanMe Srls.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="section-padding">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-6 text-leanme-gray-600">
          Pagina placeholder. Sostituire con l&apos;informativa privacy
          completa di LeanMe Srls.
        </p>
      </Container>
    </section>
  );
}

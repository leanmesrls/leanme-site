import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Cookie Policy",
  description: "Informativa sui cookie di LeanMe Srls.",
  path: "/cookie",
});

export default function CookiePage() {
  return (
    <section className="section-padding">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-semibold">Cookie Policy</h1>
        <p className="mt-6 text-leanme-gray-600">
          Pagina placeholder. Sostituire con la cookie policy completa di
          LeanMe Srls.
        </p>
      </Container>
    </section>
  );
}

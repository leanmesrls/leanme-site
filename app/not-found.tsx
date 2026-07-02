import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Pagina non trovata",
  description: "La pagina richiesta non esiste.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="section-padding">
      <Container className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-leanme-purple">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Pagina non trovata</h1>
        <p className="mt-4 text-leanme-gray-600">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="mt-8">
          <Button href="/" label="Torna alla Home" variant="primary" />
        </div>
      </Container>
    </section>
  );
}

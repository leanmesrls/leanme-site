import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  getAllLeanAgentSlugs,
  getLeanAgentBySlug,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLeanAgentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const agent = getLeanAgentBySlug(slug);

  if (!agent) {
    return createPageMetadata({
      title: "Lean.Agent non trovato",
      description: "L'agente richiesto non esiste.",
      path: `/staff-ibrido/lean-agent/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: agent.name,
    description: agent.description,
    path: `/staff-ibrido/lean-agent/${slug}`,
    image: agent.cardImage.src,
  });
}

export default async function LeanAgentPage({ params }: PageProps) {
  const { slug } = await params;
  const agent = getLeanAgentBySlug(slug);

  if (!agent) {
    notFound();
  }

  const path = `/staff-ibrido/lean-agent/${slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lo Staff Ibrido", path: "/staff-ibrido" },
          { name: agent.name, path },
        ])}
      />
      <section className="section-padding">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <PlaceholderImage
                image={agent.cardImage}
                aspectRatio="portrait"
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-leanme-purple">
                {agent.role}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight">
                {agent.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-leanme-gray-700">
                {agent.specialty}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-leanme-gray-600">
                {agent.description}
              </p>
              <div className="mt-10 flex gap-4">
                <Button href="/staff-ibrido" label="Staff Ibrido" variant="secondary" />
                <Button href="/contatti" label="Contattaci" variant="primary" />
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}

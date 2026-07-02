import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/homepage/Icons";
import { PageSection } from "@/components/layout/PageSection";
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
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-xl border border-white/10">
              <Image
                src={agent.cardImage.src}
                alt={agent.cardImage.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-leanme-purple">
              Lean.Agent
            </p>
            <h1 className="text-4xl font-bold tracking-[0.06em] text-white">
              {agent.name}
            </h1>
            <p className="mt-2 text-lg text-white/80">{agent.role}</p>
            {agent.action && (
              <p
                className="mt-2 text-sm font-semibold uppercase tracking-[0.12em]"
                style={{ color: agent.actionColor ?? "#8016D2" }}
              >
                {agent.action}
              </p>
            )}
            <p className="mt-6 text-lg leading-relaxed text-white/65">
              {agent.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/staff-ibrido"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:border-white"
              >
                Staff Ibrido
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full bg-leanme-purple px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-purple/90"
              >
                Contattaci
                <ArrowIcon />
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageSection>
    </>
  );
}

import Image from "next/image";
import { PageIntro, PageSection } from "@/components/layout/PageSection";
import {
  AgentCard,
  AgentCardCompact,
} from "@/components/lean-agent/AgentCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getStaffData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Lo Staff Ibrido",
  description:
    "Persone, Lean.Agent e network di specialisti. Lo Staff Ibrido LeanMe mette le persone al centro dell'innovazione.",
  path: "/staff-ibrido",
});

export default function StaffIbridoPage() {
  const staff = getStaffData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lo Staff Ibrido", path: "/staff-ibrido" },
        ])}
      />
      <PageSection>
        <PageIntro
          title={staff.intro.title}
          subtitle={staff.intro.subtitle}
          description={staff.intro.description}
        />

        <div className="mt-16">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
            Persone
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {staff.people.map((person, index) => (
              <RevealOnScroll key={person.slug} delay={index * 0.06}>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={person.image.src}
                      alt={person.image.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">{person.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-leanme-purple">
                      {person.role}
                    </p>
                    <p className="mt-3 text-sm text-white/65">{person.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
            LEAN.AGENT.AI
          </h2>
          <p className="mt-4 max-w-3xl text-white/65">
            Ogni Lean.Agent possiede una pagina dedicata. Non sostituiscono il
            lavoro umano: lo completano, lo accelerano, lo rendono più efficace.
          </p>
          <div className="mt-10 hidden gap-3 lg:grid lg:grid-cols-7">
            {staff.leanAgents.map((agent, index) => (
              <RevealOnScroll key={agent.slug} delay={index * 0.05}>
                <AgentCard agent={agent} />
              </RevealOnScroll>
            ))}
          </div>
          <div className="mt-8 space-y-3 lg:hidden">
            {staff.leanAgents.map((agent) => (
              <AgentCardCompact key={agent.slug} agent={agent} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
            {staff.network.title}
          </h2>
          <p className="mt-4 max-w-3xl text-white/65">{staff.network.description}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {staff.network.specialists.map((specialist, index) => (
              <RevealOnScroll key={specialist.name} delay={index * 0.05}>
                <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-leanme-purple">
                    {specialist.area}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {specialist.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">{specialist.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}

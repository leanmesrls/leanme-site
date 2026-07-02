import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AgentCard } from "@/components/lean-agent/AgentCard";
import { FadeIn } from "@/components/motion/FadeIn";
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
      <section className="section-padding">
        <Container>
          <FadeIn>
            <SectionHeading
              title={staff.intro.title}
              subtitle={staff.intro.subtitle}
              description={staff.intro.description}
            />
          </FadeIn>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold">Persone</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {staff.people.map((person, index) => (
                <RevealOnScroll key={person.slug} delay={index * 0.08}>
                  <div className="overflow-hidden rounded-2xl border border-leanme-black/5 bg-white shadow-sm">
                    <PlaceholderImage
                      image={person.image}
                      aspectRatio="square"
                      className="rounded-none border-none"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold">{person.name}</h3>
                      <p className="mt-1 text-sm font-medium text-leanme-purple">
                        {person.role}
                      </p>
                      <p className="mt-3 text-sm text-leanme-gray-600">
                        {person.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold">Lean.Agent</h2>
            <p className="mt-4 max-w-3xl text-leanme-gray-600">
              Ogni Lean.Agent possiede una pagina dedicata. Non sostituiscono il
              lavoro umano: lo completano, lo accelerano, lo rendono più efficace.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {staff.leanAgents.map((agent, index) => (
                <RevealOnScroll key={agent.slug} delay={index * 0.08}>
                  <AgentCard agent={agent} />
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold">{staff.network.title}</h2>
            <p className="mt-4 max-w-3xl text-leanme-gray-600">
              {staff.network.description}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {staff.network.specialists.map((specialist, index) => (
                <RevealOnScroll key={specialist.name} delay={index * 0.06}>
                  <div className="rounded-2xl border border-leanme-black/5 p-8">
                    <p className="text-sm font-medium text-leanme-purple">
                      {specialist.area}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">
                      {specialist.name}
                    </h3>
                    <p className="mt-2 text-sm text-leanme-gray-600">
                      {specialist.description}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

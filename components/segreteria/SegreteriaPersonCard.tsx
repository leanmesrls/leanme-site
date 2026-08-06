import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { SegreteriaActionList } from "@/components/segreteria/SegreteriaActionList";
import { SegreteriaSocialLinks } from "@/components/segreteria/SegreteriaSocialLinks";
import type { ContactData } from "@/types/content";
import type { SegreteriaAction, SegreteriaData, SegreteriaResolvedPerson } from "@/types/segreteria";

interface SegreteriaPersonCardProps {
  person: SegreteriaResolvedPerson;
  leonardo: SegreteriaData["leonardo"];
  leonardoName: string;
  leonardoRole: string;
  actions: SegreteriaAction[];
  companyContacts: ContactData;
}

export function SegreteriaPersonCard({
  person,
  leonardo,
  leonardoName,
  leonardoRole,
  actions,
  companyContacts,
}: SegreteriaPersonCardProps) {
  const openingHours = companyContacts?.openingHours;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-10">
      <div className="grid gap-6 sm:grid-cols-[140px_1fr] sm:items-start">
        <FadeIn>
          <div className="relative mx-auto aspect-[3/4] w-36 overflow-hidden rounded-xl border border-white/10 bg-leanme-card sm:mx-0 sm:w-full">
            <Image
              src={person.image}
              alt={person.imageAlt}
              fill
              priority
              className="object-cover object-top"
              sizes="140px"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.04}>
          <h1 className="text-2xl font-bold tracking-[0.03em] text-white md:text-3xl">
            {person.name}
          </h1>
          <p className="mt-2 text-sm font-medium text-leanme-fuchsia">{person.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{person.tagline}</p>
          <div className="mt-3 space-y-2">
            {person.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-relaxed text-white/60"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.08} className="mt-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
              <Image
                src={leonardo.image.src}
                alt={leonardo.image.alt}
                fill
                className="object-cover object-top"
                sizes="48px"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                {leonardoName}
                <span className="mx-2 text-white/25">·</span>
                {leonardoRole}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/75">
                {leonardo.personAssistCopy}
              </p>
            </div>
          </div>
          <SegreteriaActionList
            actions={actions}
            feedbackMessage={leonardo.vcardFeedback}
            className="gap-2.5"
          />

          <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
            {openingHours && openingHours.lines.length > 0 && (
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {openingHours.label}
                </h3>
                <ul className="mt-1.5 space-y-0.5 text-sm text-white/70">
                  {openingHours.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            <SegreteriaSocialLinks social={companyContacts?.social ?? []} />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

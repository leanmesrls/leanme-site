import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import type { SegreteriaData, SegreteriaResolvedPerson } from "@/types/segreteria";

interface SegreteriaTeamGridProps {
  section: SegreteriaData["team"];
  people: SegreteriaResolvedPerson[];
  staffTeaser: SegreteriaData["agents"];
  addContactLabel: string;
}

export function SegreteriaTeamGrid({
  section,
  people,
  staffTeaser,
  addContactLabel,
}: SegreteriaTeamGridProps) {
  return (
    <section
      id={section.id}
      aria-labelledby="segreteria-team-heading"
      className="bg-black px-5 py-8 md:px-10 md:py-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2
            id="segreteria-team-heading"
            className="text-xl font-bold tracking-[0.04em] text-white md:text-2xl"
          >
            {section.title}
          </h2>
          <p className="mt-1 text-sm text-white/60">{section.subtitle}</p>
          <div className="mt-3 h-[2px] w-12 bg-leanme-fuchsia" aria-hidden="true" />
        </FadeIn>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person, index) => {
            const memberMeta = section.members.find(
              (member) => member.personSlug === person.slug
            );
            const cta = memberMeta?.ctaLabel ?? addContactLabel;

            return (
              <FadeIn key={person.slug} delay={0.04 * (index + 1)}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[5/4] overflow-hidden bg-leanme-card">
                    <Image
                      src={person.image}
                      alt={person.imageAlt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 md:p-4">
                    <h3 className="text-base font-bold tracking-[0.03em] text-white">
                      {person.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs font-medium text-leanme-fuchsia">
                      {person.role}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-white/60">
                      {person.shortBio}
                    </p>
                    <Link
                      href={person.segreteriaPath}
                      className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leanme-fuchsia/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leanme-fuchsia focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {cta}
                    </Link>
                  </div>
                </article>
              </FadeIn>
            );
          })}

          <FadeIn delay={0.12}>
            <article
              id={staffTeaser.id}
              className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-leanme-fuchsia/30 bg-gradient-to-br from-leanme-fuchsia/[0.12] to-black p-3.5 md:p-4"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-leanme-fuchsia">
                  LeanMe
                </p>
                <h3 className="mt-2 text-base font-bold tracking-[0.03em] text-white">
                  {staffTeaser.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65">
                  {staffTeaser.description}
                </p>
              </div>
              <Link
                href={staffTeaser.href}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-leanme-fuchsia/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leanme-fuchsia focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {staffTeaser.ctaLabel}
              </Link>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

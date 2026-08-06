import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { SegreteriaActionList } from "@/components/segreteria/SegreteriaActionList";
import { hasPersonContact, isUsablePhone } from "@/lib/segreteria/vcard";
import type { SegreteriaAction, SegreteriaResolvedPerson } from "@/types/segreteria";

interface SegreteriaPersonBlockProps {
  person: SegreteriaResolvedPerson;
  actions: SegreteriaAction[];
  feedbackMessage: string;
}

export function SegreteriaPersonBlock({
  person,
  actions,
  feedbackMessage,
}: SegreteriaPersonBlockProps) {
  const { contacts } = person;
  const showPhone =
    hasPersonContact(contacts, "phone") && isUsablePhone(contacts.phone);
  const showEmail = hasPersonContact(contacts, "email");

  return (
    <section
      id={person.slug}
      aria-labelledby={`vcards-${person.slug}-heading`}
      className="bg-black px-5 py-6 md:px-10 md:py-8 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-leanme-card sm:h-28 sm:w-24">
                  <Image
                    src={person.image}
                    alt={person.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    id={`vcards-${person.slug}-heading`}
                    className="text-lg font-bold tracking-[0.03em] text-white md:text-xl"
                  >
                    {person.name}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-leanme-fuchsia sm:text-sm">
                    {person.role}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                    {person.shortBio}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                {showPhone && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      Telefono
                    </h3>
                    <a
                      href={`tel:${contacts.phone!.replace(/[^\d+]/g, "")}`}
                      className="mt-0.5 block text-base font-medium text-white transition hover:text-leanme-fuchsia"
                    >
                      {contacts.phone}
                    </a>
                  </div>
                )}
                {showEmail && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      Email
                    </h3>
                    <a
                      href={`mailto:${contacts.email}`}
                      className="mt-0.5 block text-base font-medium text-white transition hover:text-leanme-fuchsia"
                    >
                      {contacts.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <SegreteriaActionList
              actions={actions}
              feedbackMessage={feedbackMessage}
              className="gap-2.5"
              sectionId={person.slug}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

import { FadeIn } from "@/components/motion/FadeIn";
import { SegreteriaActionList } from "@/components/segreteria/SegreteriaActionList";
import { SegreteriaSocialLinks } from "@/components/segreteria/SegreteriaSocialLinks";
import { isUsablePhone } from "@/lib/segreteria/vcard";
import type { ContactData } from "@/types/content";
import type { SegreteriaAction, SegreteriaData } from "@/types/segreteria";

interface SegreteriaCompanyBlockProps {
  section: SegreteriaData["company"];
  contacts: ContactData;
  actions: SegreteriaAction[];
  feedbackMessage: string;
}

export function SegreteriaCompanyBlock({
  section,
  contacts,
  actions,
  feedbackMessage,
}: SegreteriaCompanyBlockProps) {
  const showPhone = isUsablePhone(contacts.phone.value);
  const openingHours = contacts.openingHours?.lines?.length
    ? contacts.openingHours
    : section.openingHours.length > 0
      ? { label: "Orari", lines: section.openingHours }
      : null;

  return (
    <section
      id={section.id}
      aria-labelledby="segreteria-company-heading"
      className="bg-black px-5 py-8 md:px-10 md:py-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2
            id="segreteria-company-heading"
            className="text-xl font-bold tracking-[0.04em] text-white md:text-2xl"
          >
            {section.title}
          </h2>
          <p className="mt-1 text-sm text-white/60">{section.subtitle}</p>
          <div className="mt-3 h-[2px] w-12 bg-leanme-fuchsia" aria-hidden="true" />
        </FadeIn>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn delay={0.04}>
            <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                    {contacts.operationalAddress.label}
                  </h3>
                  <address className="mt-1.5 text-sm not-italic leading-snug text-white/70">
                    {contacts.operationalAddress.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                    {contacts.legalAddress.label}
                  </h3>
                  <address className="mt-1.5 text-sm not-italic leading-snug text-white/70">
                    {contacts.legalAddress.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                {showPhone && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      {contacts.phone.label}
                    </h3>
                    <a
                      href={contacts.phone.href}
                      className="mt-0.5 block text-base font-medium text-white transition hover:text-leanme-fuchsia"
                    >
                      {contacts.phone.value}
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    {contacts.email.label}
                  </h3>
                  <a
                    href={contacts.email.href}
                    className="mt-0.5 block text-base font-medium text-white transition hover:text-leanme-fuchsia"
                  >
                    {contacts.email.value}
                  </a>
                </div>
                {contacts.piva && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      {contacts.piva.label}
                    </h3>
                    <p className="mt-0.5 text-base font-medium text-white">
                      {contacts.piva.value}
                    </p>
                  </div>
                )}
                {contacts.pec && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      {contacts.pec.label}
                    </h3>
                    <a
                      href={contacts.pec.href}
                      className="mt-0.5 block text-base font-medium text-white transition hover:text-leanme-fuchsia"
                    >
                      {contacts.pec.value}
                    </a>
                  </div>
                )}
              </div>

              {openingHours && (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                    {openingHours.label}
                  </h3>
                  <ul className="mt-1.5 space-y-0.5 text-sm text-white/70">
                    {openingHours.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <SegreteriaSocialLinks social={contacts.social} />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <SegreteriaActionList
              actions={actions}
              feedbackMessage={feedbackMessage}
              className="gap-2.5"
              sectionId={section.id}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

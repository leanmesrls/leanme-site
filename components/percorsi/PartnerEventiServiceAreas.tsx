import { ArrowIcon } from "@/components/homepage/Icons";
import { FadeIn } from "@/components/motion/FadeIn";
import type { PercorsoServiceArea } from "@/types/content";

function ServiceAreaIdentity({
  area,
  headingId,
  wide = false,
}: {
  area: PercorsoServiceArea;
  headingId: string;
  wide?: boolean;
}) {
  return (
    <header className={wide ? "max-w-none" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leanme-fuchsia">
        {area.label}
      </p>
      <h2
        id={headingId}
        className="mt-4 text-2xl font-bold uppercase tracking-[0.04em] text-white md:text-3xl lg:text-4xl"
      >
        {area.title}
      </h2>
      <p className="mt-3 text-lg font-medium text-white md:text-xl">
        {area.subtitle}
      </p>
      <div className="mt-5 h-[2px] w-12 bg-leanme-fuchsia" aria-hidden="true" />
    </header>
  );
}

export function PartnerEventiManagementSection({
  area,
}: {
  area: PercorsoServiceArea;
}) {
  const contact = area.contact;

  return (
    <section
      id="event-management"
      aria-labelledby="event-management-heading"
      className="mt-12 border-y border-white/10 bg-[#141414] px-5 py-14 md:mt-16 md:px-10 md:py-16 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <ServiceAreaIdentity
            area={area}
            headingId="event-management-heading"
            wide
          />
          {area.paragraphs?.length ? (
            <div className="mt-6 space-y-4">
              {area.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-white/75 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          {contact ? (
            <div className="mt-10 max-w-xl rounded-xl border border-leanme-fuchsia/30 bg-black p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white">{contact.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/70">
                {contact.text}
              </p>
              <p className="mt-4 text-sm text-white/80">
                Email:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="font-semibold text-leanme-fuchsia underline decoration-leanme-fuchsia/40 underline-offset-4 transition hover:text-white"
                >
                  {contact.email}
                </a>
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
              >
                {contact.buttonLabel}
                <ArrowIcon />
              </a>
            </div>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}

export function PartnerEventiTechnologyHeading({
  area,
}: {
  area: PercorsoServiceArea;
}) {
  return (
    <section
      id="event-technology"
      aria-labelledby="event-technology-heading"
      className="border-b border-white/10 bg-black px-5 pb-2 pt-14 md:px-10 md:pt-16 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <ServiceAreaIdentity
            area={area}
            headingId="event-technology-heading"
            wide
          />
          {area.paragraphs?.length ? (
            <div className="mt-6 space-y-4">
              {area.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-white/75 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}

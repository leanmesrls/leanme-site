import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro, PageSection } from "@/components/layout/PageSection";
import { FadeIn } from "@/components/motion/FadeIn";
import { getContattiData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Contatti",
  description:
    "Contatta LeanMe Srls. Sede legale, sede operativa, telefono, email, modulo contatti e mappa.",
  path: "/contatti",
});

export default function ContattiPage() {
  const data = getContattiData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contatti", path: "/contatti" },
        ])}
      />
      <PageSection>
        <PageIntro
          title={data.intro.title}
          subtitle={data.intro.subtitle}
          description={data.intro.description}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-white">
                  {data.legalAddress.label}
                </h2>
                <address className="mt-3 not-italic text-white/65">
                  {data.legalAddress.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-white">
                  {data.operationalAddress.label}
                </h2>
                <address className="mt-3 not-italic text-white/65">
                  {data.operationalAddress.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                    {data.phone.label}
                  </h3>
                  <a
                    href={data.phone.href}
                    className="mt-1 block text-lg font-medium text-white transition hover:text-leanme-purple"
                  >
                    {data.phone.value}
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                    {data.email.label}
                  </h3>
                  <a
                    href={data.email.href}
                    className="mt-1 block text-lg font-medium text-white transition hover:text-leanme-purple"
                  >
                    {data.email.value}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Social
                </h3>
                <ul className="mt-3 space-y-2">
                  {data.social.map((social) => (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/75 transition hover:text-leanme-purple"
                      >
                        <Icon name={social.platform} className="h-4 w-4" />
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-leanme-purple/30 bg-leanme-purple/10 p-6">
                <h3 className="font-bold text-white">{data.foundation.title}</h3>
                <p className="mt-2 text-sm text-white/65">{data.foundation.description}</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <ContactForm
              title={data.form.title}
              description={data.form.description}
              submitLabel={data.form.submitLabel}
            />
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="mt-16">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.1em] text-white">
            {data.map.label}
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              title={data.map.label}
              src={data.map.embedUrl}
              className="h-[400px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </PageSection>
    </>
  );
}

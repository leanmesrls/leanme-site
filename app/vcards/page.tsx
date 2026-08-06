import { Suspense } from "react";
import { LeonardoGuideListener } from "@/components/segreteria/LeonardoGuideListener";
import { SegreteriaCompanyBlock } from "@/components/segreteria/SegreteriaCompanyBlock";
import { SegreteriaHero } from "@/components/segreteria/SegreteriaHero";
import { SegreteriaPersonBlock } from "@/components/segreteria/SegreteriaPersonBlock";
import { SegreteriaScrollToPersona } from "@/components/segreteria/SegreteriaScrollToPersona";
import { SegreteriaStaffBlock } from "@/components/segreteria/SegreteriaStaffBlock";
import { FadeIn } from "@/components/motion/FadeIn";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompanyActions, getPersonHubActions } from "@/lib/segreteria/actions";
import {
  getSegreteriaCompanyContext,
  getSegreteriaTeamPeople,
} from "@/lib/segreteria/resolve";
import { createPageMetadata } from "@/lib/metadata";
import {
  breadcrumbSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/lib/structured-data";

export function generateMetadata() {
  const { data } = getSegreteriaCompanyContext();
  return createPageMetadata({
    title: data.meta.title,
    description: data.meta.description,
    path: data.meta.path,
  });
}

export default function VcardsPage() {
  const { data, contacts } = getSegreteriaCompanyContext();
  const people = getSegreteriaTeamPeople();
  const companyActions = getCompanyActions(data, contacts);
  const peopleWithActions = people.map((person) => ({
    slug: person.slug,
    name: person.name,
    actions: getPersonHubActions(data, person),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Segreteria Digitale", path: "/vcards" },
          ]),
          organizationSchema(),
          localBusinessSchema({
            name: "LeanMe S.r.l.s. — LeanMe Open Innovation Hub",
            description: data.meta.description,
            telephone: contacts.phone.value,
            email: contacts.email.value,
            legalAddress: contacts.legalAddress,
            operationalAddress: contacts.operationalAddress,
            social: contacts.social,
            mapUrl: `https://maps.google.com/maps?q=${encodeURIComponent(
              contacts.operationalAddress.lines.slice(1).join(", ")
            )}`,
          }),
        ]}
      />

      <LeonardoGuideListener />
      <Suspense fallback={null}>
        <SegreteriaScrollToPersona />
      </Suspense>
      <SegreteriaHero
        data={data}
        companyActions={companyActions}
        people={peopleWithActions}
      />
      <SegreteriaCompanyBlock
        section={data.company}
        contacts={contacts}
        actions={companyActions}
        feedbackMessage={data.leonardo.vcardFeedback}
      />

      <section
        id={data.team.id}
        aria-labelledby="vcards-team-heading"
        className="bg-black px-5 pt-4 md:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h2
              id="vcards-team-heading"
              className="text-xl font-bold tracking-[0.04em] text-white md:text-2xl"
            >
              {data.team.title}
            </h2>
            <p className="mt-1 text-sm text-white/60">{data.team.subtitle}</p>
            <div className="mt-3 h-[2px] w-12 bg-leanme-fuchsia" aria-hidden="true" />
          </FadeIn>
        </div>
      </section>

      {people.map((person) => (
        <SegreteriaPersonBlock
          key={person.slug}
          person={person}
          actions={getPersonHubActions(data, person)}
          feedbackMessage={data.leonardo.vcardFeedback}
        />
      ))}

      <SegreteriaStaffBlock section={data.agents} />
    </>
  );
}

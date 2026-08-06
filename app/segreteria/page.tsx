import { SegreteriaCompanyBlock } from "@/components/segreteria/SegreteriaCompanyBlock";
import { SegreteriaHero } from "@/components/segreteria/SegreteriaHero";
import { SegreteriaTeamGrid } from "@/components/segreteria/SegreteriaTeamGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCompanyActions } from "@/lib/segreteria/actions";
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

export default function SegreteriaPage() {
  const { data, contacts } = getSegreteriaCompanyContext();
  const people = getSegreteriaTeamPeople();
  const actions = getCompanyActions(data, contacts);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Segreteria Digitale", path: "/segreteria" },
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

      <SegreteriaHero data={data} />
      <SegreteriaCompanyBlock
        section={data.company}
        contacts={contacts}
        actions={actions}
        feedbackMessage={data.leonardo.vcardFeedback}
      />
      <SegreteriaTeamGrid
        section={data.team}
        people={people}
        staffTeaser={data.agents}
        addContactLabel={data.labels.openProfile}
      />
    </>
  );
}

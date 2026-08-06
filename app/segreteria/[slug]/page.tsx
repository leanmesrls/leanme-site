import { notFound } from "next/navigation";
import { SegreteriaPersonCard } from "@/components/segreteria/SegreteriaPersonCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPersonActions } from "@/lib/segreteria/actions";
import {
  getSegreteriaPersonSlugs,
  resolveSegreteriaPerson,
} from "@/lib/segreteria/resolve";
import { getContattiData, getSegreteriaData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, personSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function honorificPrefix(name: string): string | undefined {
  if (name.startsWith("Dr. ")) return "Dr.";
  if (name.startsWith("Ing. ")) return "Ing.";
  return undefined;
}

export async function generateStaticParams() {
  return getSegreteriaPersonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const person = resolveSegreteriaPerson(slug);

  if (!person) {
    return createPageMetadata({
      title: "Contatto non trovato",
      description: "Il contatto richiesto non è disponibile.",
      path: `/segreteria/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${person.name} — Segreteria Digitale LeanMe`,
    description: `${person.name}, ${person.role}. ${person.shortBio}`,
    path: person.segreteriaPath,
    image: person.image,
  });
}

export default async function SegreteriaPersonPage({ params }: PageProps) {
  const { slug } = await params;
  const person = resolveSegreteriaPerson(slug);
  const data = getSegreteriaData();

  if (!person) {
    notFound();
  }

  const actions = getPersonActions(data, person);
  const companyContacts = getContattiData();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Segreteria Digitale", path: "/segreteria" },
            { name: person.name, path: person.segreteriaPath },
          ]),
          personSchema({
            name: person.name,
            jobTitle: person.role,
            description: person.tagline,
            path: person.segreteriaPath,
            image: person.image,
            honorificPrefix: honorificPrefix(person.name),
          }),
        ]}
      />

      <div className="bg-black">
        <SegreteriaPersonCard
          person={person}
          leonardo={data.leonardo}
          leonardoName={data.welcome.leonardoName}
          leonardoRole={data.welcome.leonardoRole}
          actions={actions}
          companyContacts={companyContacts}
        />
      </div>
    </>
  );
}

import { notFound, redirect } from "next/navigation";
import {
  getSegreteriaPersonSlugs,
  resolveSegreteriaPerson,
} from "@/lib/segreteria/resolve";
import { createPageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
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
      path: `/vcards/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${person.name} — Segreteria Digitale LeanMe`,
    description: `${person.name}, ${person.role}. ${person.shortBio}`,
    path: `/vcards/${person.slug}`,
    image: person.image,
  });
}

/** Deep links land on the hub; client can scroll to the person row. */
export default async function VcardsPersonRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const person = resolveSegreteriaPerson(slug);

  if (!person) {
    notFound();
  }

  redirect(`/vcards?persona=${person.slug}`);
}

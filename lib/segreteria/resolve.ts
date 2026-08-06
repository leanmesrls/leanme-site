import {
  getChiSiamoPersonBySlug,
  getContattiData,
  getSegreteriaData,
  getSiteConfig,
} from "@/lib/content";
import type { SegreteriaResolvedPerson } from "@/types/segreteria";

const HUB_PATH = "/vcards";

export function getSegreteriaPersonSlugs(): string[] {
  return getSegreteriaData().team.members.map((member) => member.personSlug);
}

export function resolveSegreteriaPerson(
  slug: string
): SegreteriaResolvedPerson | undefined {
  const person = getChiSiamoPersonBySlug(slug);
  if (!person) return undefined;

  const data = getSegreteriaData();
  const contacts = data.peopleContacts[slug] ?? {};
  const shortBio = person.bio[0] ?? person.tagline;

  return {
    slug: person.slug,
    name: person.name,
    role: person.role,
    tagline: person.tagline,
    bio: person.bio,
    shortBio,
    image: person.image,
    imageAlt: `${person.name} — ${person.role}`,
    contacts,
    profilePath: `/chi-siamo/${person.slug}`,
    segreteriaPath: `${HUB_PATH}/${person.slug}`,
    vcardPath: `${HUB_PATH}/vcard/${person.slug}`,
  };
}

export function getSegreteriaTeamPeople(): SegreteriaResolvedPerson[] {
  return getSegreteriaPersonSlugs()
    .map((slug) => resolveSegreteriaPerson(slug))
    .filter((person): person is SegreteriaResolvedPerson => Boolean(person));
}

export function getSegreteriaCompanyContext() {
  return {
    data: getSegreteriaData(),
    contacts: getContattiData(),
    site: getSiteConfig(),
  };
}

export function getVcardsHubPath(): string {
  return HUB_PATH;
}

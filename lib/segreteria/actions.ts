import type { ContactData } from "@/types/content";
import type {
  SegreteriaAction,
  SegreteriaData,
  SegreteriaResolvedPerson,
} from "@/types/segreteria";
import {
  hasPersonContact,
  isUsablePhone,
  mapsHrefFromOperationalAddress,
  toMailtoHref,
  toTelHref,
} from "@/lib/segreteria/vcard";
import { SITE_URL } from "@/lib/metadata";

export function getCompanyActions(
  data: SegreteriaData,
  contacts: ContactData
): SegreteriaAction[] {
  const { labels, companyVcard } = data;
  const actions: SegreteriaAction[] = [
    {
      id: "save",
      label: labels.saveToContacts,
      href: `/vcards/vcard/${companyVcard.slug}`,
      variant: "primary",
      download: true,
    },
    {
      id: "email",
      label: labels.email,
      href: contacts.email.href || toMailtoHref(contacts.email.value),
      variant: "secondary",
    },
  ];

  if (isUsablePhone(contacts.phone.value)) {
    actions.push({
      id: "call",
      label: labels.callOffice,
      href: contacts.phone.href || toTelHref(contacts.phone.value),
      variant: "secondary",
    });
  }

  actions.push(
    {
      id: "maps",
      label: labels.maps,
      href: mapsHrefFromOperationalAddress(contacts.operationalAddress.lines),
      variant: "secondary",
      external: true,
    },
    {
      id: "visitSite",
      label: labels.visitSite,
      href: SITE_URL,
      variant: "secondary",
      external: true,
    }
  );

  return actions;
}

/** Actions for hub rows (Luana / Alessandro). */
export function getPersonHubActions(
  data: SegreteriaData,
  person: SegreteriaResolvedPerson
): SegreteriaAction[] {
  const { labels, links } = data;
  const { contacts } = person;
  const actions: SegreteriaAction[] = [
    {
      id: "save",
      label: labels.saveToContacts,
      href: person.vcardPath,
      variant: "primary",
      download: true,
    },
    {
      id: "download",
      label: labels.downloadDigitalCard,
      href: person.vcardPath,
      variant: "primary",
      download: true,
    },
  ];

  if (hasPersonContact(contacts, "email")) {
    actions.push({
      id: "email",
      label: labels.email,
      href: toMailtoHref(contacts.email!),
      variant: "secondary",
    });
  }

  if (hasPersonContact(contacts, "phone") && isUsablePhone(contacts.phone)) {
    actions.push({
      id: "call",
      label: labels.call,
      href: toTelHref(contacts.phone!),
      variant: "secondary",
    });
  }

  actions.push({
    id: "bookConsultation",
    label: labels.bookConsultation,
    href: links.prenotaConsulenza,
    variant: "secondary",
  });

  return actions;
}

export function getPersonActions(
  data: SegreteriaData,
  person: SegreteriaResolvedPerson
): SegreteriaAction[] {
  return getPersonHubActions(data, person);
}

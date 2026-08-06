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
  toWhatsAppHref,
} from "@/lib/segreteria/vcard";
import { SITE_URL } from "@/lib/metadata";

export function getCompanyActions(
  data: SegreteriaData,
  contacts: ContactData
): SegreteriaAction[] {
  const { labels, links, companyVcard } = data;
  const actions: SegreteriaAction[] = [];

  if (isUsablePhone(contacts.phone.value)) {
    actions.push({
      id: "call",
      label: labels.call,
      href: contacts.phone.href || toTelHref(contacts.phone.value),
      variant: "secondary",
    });
  }

  actions.push({
    id: "email",
    label: labels.email,
    href: contacts.email.href || toMailtoHref(contacts.email.value),
    variant: "secondary",
  });

  actions.push({
    id: "maps",
    label: labels.maps,
    href: mapsHrefFromOperationalAddress(contacts.operationalAddress.lines),
    variant: "secondary",
    external: true,
  });

  actions.push({
    id: "visitSite",
    label: labels.visitSite,
    href: SITE_URL,
    variant: "secondary",
    external: true,
  });

  actions.push({
    id: "save",
    label: labels.saveToContacts,
    href: `/segreteria/vcard/${companyVcard.slug}`,
    variant: "primary",
    download: true,
  });

  actions.push({
    id: "contactOffice",
    label: labels.contactOffice,
    href: links.contatti,
    variant: "secondary",
  });

  return actions;
}

export function getPersonActions(
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
      variant: "secondary",
      download: true,
    },
  ];

  if (hasPersonContact(contacts, "phone") && isUsablePhone(contacts.phone)) {
    actions.push({
      id: "call",
      label: labels.call,
      href: toTelHref(contacts.phone!),
      variant: "secondary",
    });
  }

  if (hasPersonContact(contacts, "email")) {
    actions.push({
      id: "email",
      label: labels.email,
      href: toMailtoHref(contacts.email!),
      variant: "secondary",
    });
  }

  if (hasPersonContact(contacts, "whatsapp")) {
    actions.push({
      id: "whatsapp",
      label: labels.whatsapp,
      href: toWhatsAppHref(contacts.whatsapp!),
      variant: "secondary",
      external: true,
    });
  }

  if (hasPersonContact(contacts, "linkedin")) {
    actions.push({
      id: "linkedin",
      label: labels.linkedin,
      href: contacts.linkedin!,
      variant: "secondary",
      external: true,
    });
  }

  actions.push(
    {
      id: "bookConsultation",
      label: labels.bookConsultation,
      href: links.prenotaConsulenza,
      variant: "secondary",
    },
    {
      id: "visitSite",
      label: labels.visitSite,
      href: links.home,
      variant: "ghost",
    },
    {
      id: "contactForm",
      label: labels.contactForm,
      href: links.contatti,
      variant: "ghost",
    },
    {
      id: "contactSegreteria",
      label: labels.contactSegreteria,
      href: links.segreteria,
      variant: "ghost",
    },
    {
      id: "backToSegreteria",
      label: labels.backToSegreteria,
      href: links.segreteria,
      variant: "ghost",
    }
  );

  return actions;
}

import { NextResponse } from "next/server";
import {
  getContattiData,
  getSegreteriaData,
  getSiteConfig,
} from "@/lib/content";
import {
  buildCompanyVCard,
  buildPersonVCard,
} from "@/lib/segreteria/vcard";
import { resolveSegreteriaPerson } from "@/lib/segreteria/resolve";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const segreteria = getSegreteriaData();
  const contacts = getContattiData();
  const site = getSiteConfig();

  let body: string;
  let filename: string;

  if (slug === segreteria.companyVcard.slug) {
    body = buildCompanyVCard({
      displayName: segreteria.companyVcard.displayName,
      organization: segreteria.companyVcard.organization,
      contacts,
      url: site.url,
    });
    filename = "leanme.vcf";
  } else {
    const person = resolveSegreteriaPerson(slug);
    if (!person) {
      return new NextResponse("Contatto non trovato", { status: 404 });
    }

    body = buildPersonVCard({
      person,
      organization: segreteria.companyVcard.organization,
      siteUrl: site.url,
    });
    filename = `${person.slug}.vcf`;
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

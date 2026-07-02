import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import {
  getContattiData,
  getHomepageData,
  getPercorsiData,
  getSiteConfig,
} from "@/lib/content";
import { ASSETS } from "@/lib/assets";

export function SiteFooter() {
  const site = getSiteConfig();
  const homepage = getHomepageData();
  const percorsi = getPercorsiData();
  const contatti = getContattiData();

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" aria-label="LeanMe Home">
              <Image
                src={ASSETS.logo.pinkWhite}
                alt="LeanMe"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {homepage.footer.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.footer.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-leanme-purple hover:text-leanme-purple"
                >
                  <Icon name={social.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              Navigazione
            </p>
            <ul className="space-y-2">
              {homepage.headerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contatti"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  CONTATTI
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              {homepage.footer.servicesTitle}
            </p>
            <ul className="space-y-2">
              {percorsi.percorsi.map((percorso) => (
                <li key={percorso.slug}>
                  <Link
                    href={`/come-possiamo-aiutarti/${percorso.slug}`}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {percorso.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
              {homepage.footer.contactsTitle}
            </p>
            <address className="space-y-2 not-italic text-sm text-white/75">
              {contatti.operationalAddress.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a
                href={contatti.email.href}
                className="block transition hover:text-white"
              >
                {contatti.email.value}
              </a>
              <a
                href={contatti.phone.href}
                className="block transition hover:text-white"
              >
                {contatti.phone.value}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>{site.footer.copyright}</p>
          <div className="flex flex-wrap gap-4">
            {site.footer.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/75">
                {link.label}
              </Link>
            ))}
            <span>{homepage.footer.credits}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

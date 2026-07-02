import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navigation } from "@/components/layout/Navigation";
import { getHomepageData } from "@/lib/content";
import { ASSETS } from "@/lib/assets";

export function Header() {
  const homepage = getHomepageData();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10 lg:px-16">
        <Link href="/" className="shrink-0" aria-label="LeanMe — Home">
          <Image
            src={ASSETS.logo.pinkWhite}
            alt="LeanMe Open Innovation Hub"
            width={180}
            height={52}
            className="h-10 w-auto md:h-11"
            priority
          />
        </Link>

        <div className="hidden flex-1 justify-center xl:flex">
          <Navigation
            items={homepage.headerNavigation}
            variant="dark"
          />
        </div>

        <div className="hidden shrink-0 xl:block">
          <Link
            href={homepage.headerCta.href}
            className="inline-flex items-center justify-center rounded-full bg-leanme-purple px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-purple/90"
          >
            {homepage.headerCta.label}
          </Link>
        </div>

        <MobileMenu
          items={[...homepage.headerNavigation, { label: "CONTATTI", href: "/contatti" }]}
          cta={homepage.headerCta}
          variant="dark"
        />
      </div>
    </header>
  );
}

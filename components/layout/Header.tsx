import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { getSiteConfig } from "@/lib/content";

export function Header() {
  const site = getSiteConfig();

  return (
    <header className="sticky top-0 z-40 border-b border-leanme-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-leanme-black transition-colors hover:text-leanme-purple"
          aria-label={`${site.name} — Home`}
        >
          {site.name}
        </Link>

        <div className="hidden lg:block">
          <Navigation items={site.navigation} />
        </div>

        <div className="hidden lg:block">
          <Button href="/contatti" label="Contattaci" variant="primary" />
        </div>

        <MobileMenu items={site.navigation} />
      </div>
    </header>
  );
}

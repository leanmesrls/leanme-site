import Image from "next/image";
import Link from "next/link";
import { ConnectCtaButton } from "@/components/layout/ConnectCtaButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollHeader } from "@/components/layout/ScrollHeader";
import { getContattiData, getHomepageData, getPercorsiData } from "@/lib/content";
import { buildHeaderNavigation } from "@/lib/navigation";
import { ASSETS } from "@/lib/assets";

export function Header() {
  const homepage = getHomepageData();
  const { percorsi } = getPercorsiData();
  const navigation = buildHeaderNavigation(homepage.headerNavigation, percorsi);
  const openingHours = getContattiData().openingHours?.lines?.[0];

  return (
    <ScrollHeader>
      <div className="mx-auto grid h-14 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-2 px-5 md:h-[60px] md:px-10 lg:px-12 xl:h-16 xl:px-16">
        <Link
          href="/"
          className="flex shrink-0 items-center self-center"
          aria-label="LeanMe — Home"
        >
          <Image
            src={ASSETS.logo.pinkWhite}
            alt="LeanMe Open Innovation Hub"
            width={931}
            height={250}
            className="h-[34px] w-auto object-contain object-left md:h-9 xl:h-[38px]"
            priority
          />
        </Link>

        <div className="hidden min-w-0 justify-center xl:flex">
          <Navigation items={navigation} variant="dark" />
        </div>

        <div className="hidden items-center justify-end xl:flex">
          <ConnectCtaButton
            href={homepage.headerCta.href}
            label={homepage.headerCta.label}
            openingHours={openingHours}
            className="min-h-[40px] px-5 py-1.5"
          />
        </div>

        <div className="col-start-3 flex justify-end xl:hidden">
          <MobileMenu
            items={navigation}
            cta={{
              label: "CONNETTITI",
              href: homepage.headerCta.href,
              subtitle: openingHours,
            }}
            variant="dark"
          />
        </div>
      </div>
    </ScrollHeader>
  );
}

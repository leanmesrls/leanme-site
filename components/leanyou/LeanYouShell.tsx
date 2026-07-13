"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import configData from "@/data/leanyou/config.json";
import {
  getSessionLeonardoCapabilities,
  LEONARDO_UPGRADE_HINT,
  leonardoUpgradeMailto,
} from "@/lib/leanyou/capabilities";
import { LeanYouUpgradeHint } from "@/components/leanyou/LeanYouUpgradeHint";
import {
  leanyouLeonardoPath,
  leanyouLoginPath,
  leanyouTenantBase,
} from "@/lib/leanyou/paths";
import type { LeanYouConfig, LeanYouNavItem, LeanYouSession } from "@/types/leanyou";
import { cn } from "@/lib/utils";

const config = configData as LeanYouConfig;

interface LeanYouShellProps {
  session: LeanYouSession;
  children: React.ReactNode;
}

type NavEntry = LeanYouNavItem & { href: string; enabled: boolean };

function NavIcon({ icon }: { icon: LeanYouNavItem["icon"] }) {
  const paths: Record<LeanYouNavItem["icon"], string> = {
    dashboard:
      "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z",
    leonardo:
      "M12 3l2.2 6.8H21l-5.6 4.1 2.1 6.8L12 16.8 6.4 20.7l2.1-6.8L3 9.8h6.8L12 3Z",
    events:
      "M8 3v3H5a2 2 0 0 0-2 2v11h18V8a2 2 0 0 0-2-2h-3V3H8Zm2 2h4V6h-4V5ZM4 10h16v9H4v-9Z",
    contacts:
      "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0H5Z",
    finance:
      "M4 20V4h3v16H4Zm6 0V9h3v11h-3Zm6 0V13h3v7h-3Z",
    support:
      "M12 3a9 9 0 0 0-9 9v4l2 3h14l2-3v-4a9 9 0 0 0-9-9Zm0 12.5A1.5 1.5 0 1 1 13.5 14 1.5 1.5 0 0 1 12 15.5Z",
    government:
      "M4 21V9l8-4 8 4v12H4Zm4-2h8v-2H8v2Zm0-4h8v-2H8v2Zm0-4h8V9H8v2Z",
    settings:
      "M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm8.2 3.5-1.4-.2a6.9 6.9 0 0 0-.8-1.9l.9-1.1-1.9-1.9-1.1.9a6.9 6.9 0 0 0-1.9-.8l-.2-1.4h-2.7l-.2 1.4a6.9 6.9 0 0 0-1.9.8l-1.1-.9-1.9 1.9.9 1.1a6.9 6.9 0 0 0-.8 1.9l-1.4.2v2.7l1.4.2a6.9 6.9 0 0 0 .8 1.9l-.9 1.1 1.9 1.9 1.1-.9a6.9 6.9 0 0 0 1.9.8l.2 1.4h2.7l.2-1.4a6.9 6.9 0 0 0 1.9-.8l1.1.9 1.9-1.9-.9-1.1a6.9 6.9 0 0 0 .8-1.9l1.4-.2v-2.7Z",
    locked:
      "M7 11V8a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v7H4v-7a2 2 0 0 1 2-2h1Zm2-3a3 3 0 0 1 6 0v3H9V8Z",
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d={paths[icon]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function logout() {
  await fetch("/api/leanyou/auth/logout", { method: "POST" });
  window.location.href = leanyouLoginPath();
}

function isNavEnabled(session: LeanYouSession, item: LeanYouNavItem): boolean {
  const capabilities = getSessionLeonardoCapabilities(session);

  if (item.capability) {
    return capabilities[item.capability];
  }

  if (item.module && !session.modules.includes(item.module)) {
    return false;
  }

  return true;
}

function LeonardoNav({
  navigation,
  pathname,
  leonardoBase,
  onNavigate,
}: {
  navigation: NavEntry[];
  pathname: string;
  leonardoBase: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Leonardo" className="space-y-1">
      {navigation.map((item) => {
        const active =
          item.href === leonardoBase
            ? pathname === leonardoBase
            : pathname.startsWith(item.href);

        if (!item.enabled) {
          return (
            <a
              key={item.id}
              href={leonardoUpgradeMailto(`LeanYou - Upgrade ${item.label}`)}
              onClick={onNavigate}
              className="flex min-h-11 items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-white/35 transition hover:bg-white/[0.03] hover:text-white/50"
              title={LEONARDO_UPGRADE_HINT}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-white/50">{item.label}</span>
                <LeanYouUpgradeHint className="mt-1.5" iconSize={16} />
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
              active
                ? "bg-leanme-fuchsia/15 text-white"
                : "text-white/65 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <NavIcon icon={item.icon === "locked" ? "dashboard" : item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function LeanYouShell({ session, children }: LeanYouShellProps) {
  const pathname = usePathname();
  const tenantBase = leanyouTenantBase(session.tenantSlug);
  const leonardoBase = leanyouLeonardoPath(session.tenantSlug);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = config.navigation.map((item) => ({
    ...item,
    href: item.segment ? `${tenantBase}/${item.segment}` : leonardoBase,
    enabled: isNavEnabled(session, item),
  }));

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0a0a0a] px-5 py-8 lg:block">
          <div className="border-b border-white/10 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leanme-fuchsia">
              LeanYou
            </p>
            <p className="mt-2 text-lg font-bold tracking-[0.06em]">
              {session.tenantName}
            </p>
            <p className="mt-1 text-xs text-white/55">{session.userName}</p>
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Leonardo
          </p>

          <div className="mt-2">
            <LeonardoNav
              navigation={navigation}
              pathname={pathname}
              leonardoBase={leonardoBase}
            />
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="mt-8 w-full rounded-lg border border-white/15 px-3 py-2.5 text-left text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Esci
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur md:px-8 md:py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
                    aria-label="Apri menu Leonardo"
                    aria-expanded={mobileOpen}
                    aria-controls="leanyou-mobile-nav"
                    onClick={() => setMobileOpen(true)}
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia sm:text-xs">
                      Area riservata clienti
                    </p>
                    <h1 className="mt-0.5 truncate text-lg font-bold tracking-[0.04em] sm:text-xl md:text-2xl">
                      {config.leonardo.title}
                    </h1>
                    <p className="mt-0.5 hidden text-xs text-white/55 sm:block">
                      {config.leonardo.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mt-1 truncate text-xs text-white/50 lg:hidden">
                  {session.tenantName} · {session.userName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Image
                  src={config.leonardo.logo}
                  alt="Lean.Agent Leonardo"
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-full border border-white/10 sm:h-12 sm:w-12"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="leanyou-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Leonardo"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label="Chiudi menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-[#0a0a0a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leanme-fuchsia">
                  LeanYou
                </p>
                <p className="mt-1 text-sm font-bold">{session.tenantName}</p>
              </div>
              <button
                type="button"
                aria-label="Chiudi menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/15"
                onClick={() => setMobileOpen(false)}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Leonardo
              </p>
              <div className="mt-2">
                <LeonardoNav
                  navigation={navigation}
                  pathname={pathname}
                  leonardoBase={leonardoBase}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
            </div>
            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => logout()}
                className="w-full rounded-lg border border-white/15 px-3 py-3 text-left text-sm text-white/70"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

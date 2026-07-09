"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import configData from "@/data/leanyou/config.json";
import {
  leanyouLoginPath,
  leanyouTenantBase,
} from "@/lib/leanyou/paths";
import type { LeanYouConfig, LeanYouSession } from "@/types/leanyou";
import { cn } from "@/lib/utils";

const config = configData as LeanYouConfig;

interface LeanYouShellProps {
  session: LeanYouSession;
  children: React.ReactNode;
}

function NavIcon({ icon }: { icon: "dashboard" | "leonardo" | "settings" }) {
  const paths = {
    dashboard: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z",
    leonardo:
      "M12 3l2.2 6.8H21l-5.6 4.1 2.1 6.8L12 16.8 6.4 20.7l2.1-6.8L3 9.8h6.8L12 3Z",
    settings:
      "M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm8.2 3.5-1.4-.2a6.9 6.9 0 0 0-.8-1.9l.9-1.1-1.9-1.9-1.1.9a6.9 6.9 0 0 0-1.9-.8l-.2-1.4h-2.7l-.2 1.4a6.9 6.9 0 0 0-1.9.8l-1.1-.9-1.9 1.9.9 1.1a6.9 6.9 0 0 0-.8 1.9l-1.4.2v2.7l1.4.2a6.9 6.9 0 0 0 .8 1.9l-.9 1.1 1.9 1.9 1.1-.9a6.9 6.9 0 0 0 1.9.8l.2 1.4h2.7l.2-1.4a6.9 6.9 0 0 0 1.9-.8l1.1.9 1.9-1.9-.9-1.1a6.9 6.9 0 0 0 .8-1.9l1.4-.2v-2.7Z",
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

async function logout(tenantSlug: string) {
  await fetch("/api/leanyou/auth/logout", { method: "POST" });
  window.location.href = leanyouLoginPath(tenantSlug);
}

export function LeanYouShell({ session, children }: LeanYouShellProps) {
  const pathname = usePathname();
  const tenantBase = leanyouTenantBase(session.tenantSlug);
  const navigation = config.navigation
    .filter((item) => !item.module || session.modules.includes(item.module))
    .map((item) => ({
      ...item,
      href: item.segment
        ? `${tenantBase}/${item.segment}`
        : tenantBase,
    }));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
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

          <nav aria-label="LeanYou" className="mt-6 space-y-1">
            {navigation.map((item) => {
              const active =
                item.href === tenantBase
                  ? pathname === tenantBase
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-leanme-fuchsia/15 text-white"
                      : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <NavIcon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => logout(session.tenantSlug)}
            className="mt-8 w-full rounded-lg border border-white/15 px-3 py-2.5 text-left text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Esci
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 bg-[#0a0a0a] px-5 py-4 md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
                  Area riservata clienti
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-[0.04em] md:text-2xl">
                  {config.productName}
                </h1>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <Image
                  src={config.leonardo.logo}
                  alt="Lean.Agent Leonardo"
                  width={48}
                  height={48}
                  className="rounded-full border border-white/10"
                />
                <div className="text-right">
                  <p className="text-sm font-bold">Leonardo</p>
                  <p className="text-[11px] text-white/55">
                    Secretary Assistant · Lean.Agent.AI
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

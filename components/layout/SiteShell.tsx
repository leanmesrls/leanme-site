"use client";

import { usePathname } from "next/navigation";

function isKioskPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/vcards" ||
    pathname.startsWith("/vcards/") ||
    pathname === "/segreteria" ||
    pathname.startsWith("/segreteria/")
  );
}

interface SiteShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  chat: React.ReactNode;
}

export function SiteShell({ children, header, footer, chat }: SiteShellProps) {
  const pathname = usePathname();
  const kiosk = isKioskPath(pathname);

  if (kiosk) {
    return <main className="min-h-screen bg-black">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
      {chat}
    </div>
  );
}

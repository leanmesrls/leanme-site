"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { isExternalHref } from "@/lib/nav-href";
import type { NavItem } from "@/types/content";

function FooterNavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className: string;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FooterNav({ items }: { items: NavItem[] }) {
  const [openHref, setOpenHref] = useState<string | null>(null);

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const open = openHref === item.href;
        const submenuId = `footer-sub-${item.href.replace(/[^a-z0-9]+/gi, "-")}`;

        return (
          <li key={item.href}>
            <div className="flex items-center gap-1">
              <FooterNavLink
                href={item.href}
                className="text-sm font-semibold text-leanme-fuchsia transition hover:text-white"
              >
                {item.label}
              </FooterNavLink>
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={submenuId}
                  aria-label={
                    open ? `Chiudi ${item.label}` : `Apri ${item.label}`
                  }
                  onClick={() => setOpenHref(open ? null : item.href)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Chevron open={open} />
                </button>
              ) : null}
            </div>
            {hasChildren && open ? (
              <ul
                id={submenuId}
                className="mt-1 space-y-1 border-l border-white/10 pl-3"
              >
                {item.children?.map((child) => (
                  <li key={child.href}>
                    <FooterNavLink
                      href={child.href}
                      className="text-sm text-white/55 transition hover:text-white"
                    >
                      {child.label}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

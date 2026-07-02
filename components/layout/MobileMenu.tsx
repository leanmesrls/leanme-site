"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/content";

interface MobileMenuProps {
  items: NavItem[];
  cta?: { label: string; href: string };
  variant?: "light" | "dark";
}

export function MobileMenu({ items, cta, variant = "light" }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const isDark = variant === "dark";

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        onClick={() => setOpen(!open)}
        className={cn(
          "rounded-full p-2 transition-colors",
          isDark ? "text-white hover:bg-white/10" : "text-leanme-black hover:bg-leanme-gray-100"
        )}
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-md",
            isDark ? "bg-black/95" : "bg-white/95"
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <span className={cn("text-lg font-semibold", isDark ? "text-white" : "text-leanme-black")}>
              Menu
            </span>
            <button
              type="button"
              aria-label="Chiudi menu"
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-full p-2",
                isDark ? "text-white hover:bg-white/10" : "hover:bg-leanme-gray-100"
              )}
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <div className="px-5 py-6">
            <Navigation items={items} onNavigate={() => setOpen(false)} variant={variant} />
            {cta && (
              <div className="mt-8">
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-leanme-purple px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

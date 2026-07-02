"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { NavItem } from "@/types/content";

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 text-leanme-black transition-colors hover:bg-leanme-gray-100"
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
              onClick={() => setOpen(false)}
            >
              LeanMe
            </Link>
            <button
              type="button"
              aria-label="Chiudi menu"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-leanme-gray-100"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-8">
            <Navigation items={items} onNavigate={() => setOpen(false)} />
            <div className="mt-8">
              <Button
                href="/contatti"
                label="Contattaci"
                variant="primary"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

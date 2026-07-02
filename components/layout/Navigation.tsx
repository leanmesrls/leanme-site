"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/content";

interface NavigationProps {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
  variant?: "light" | "dark";
}

export function Navigation({
  items,
  className,
  onNavigate,
  variant = "light",
}: NavigationProps) {
  const pathname = usePathname();
  const isDark = variant === "dark";

  return (
    <nav aria-label="Navigazione principale" className={className}>
      <ul className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-5">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "block px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
                  isDark
                    ? isActive
                      ? "text-leanme-purple"
                      : "text-white/85 hover:text-leanme-purple"
                    : isActive
                      ? "bg-leanme-purple/10 font-medium text-leanme-purple"
                      : "text-leanme-gray-700 hover:text-leanme-purple"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

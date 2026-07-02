"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/content";

interface NavigationProps {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
}

export function Navigation({ items, className, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione principale" className={className}>
      <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1">
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
                  "block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                  isActive
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

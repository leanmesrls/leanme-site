import Link from "next/link";
import { cn } from "@/lib/utils";

interface ConnectCtaButtonProps {
  href: string;
  label: string;
  openingHours?: string;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function ConnectCtaButton({
  href,
  label,
  openingHours,
  className,
  fullWidth,
  onClick,
}: ConnectCtaButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-full bg-leanme-fuchsia px-5 py-2 text-center text-white transition hover:bg-leanme-fuchsia-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia",
        fullWidth && "w-full",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
        {label}
      </span>
      {openingHours ? (
        <span className="mt-0.5 text-[8px] font-medium leading-none tracking-[0.04em] text-white/80">
          {openingHours}
        </span>
      ) : null}
    </Link>
  );
}

import { cn } from "@/lib/utils";

const icons: Record<string, React.ReactNode> = {
  workflow: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h6M4 12h10M4 18h14M16 6l4 4-4 4"
    />
  ),
  communication: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8M8 14h5M6 4h12a2 2 0 012 2v10l-4-3H6a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
  ),
  ai: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6 6.3 17.7"
    />
  ),
  hybrid: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4M7.5 4.5A7 7 0 1012 5"
    />
  ),
  menu: (
    <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
  ),
  close: (
    <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
  ),
  arrow: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  ),
  linkedin: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 9v10M6 6v.01M10 19v-6a2 2 0 014 0v6M10 9v10"
    />
  ),
  instagram: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 8h8v8H8zM16 4h.01M12 12a2 2 0 100-4 2 2 0 000 4z"
    />
  ),
  facebook: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h3v3h-3v9h-4v-9H8v-3h2V7a3 3 0 013-3h3v4" />
  ),
};

interface IconProps {
  name: keyof typeof icons | string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const path = icons[name] ?? icons.workflow;

  return (
    <svg
      data-icon-placeholder={name}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn("h-5 w-5", className)}
    >
      {path}
    </svg>
  );
}

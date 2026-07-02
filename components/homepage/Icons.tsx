import { cn } from "@/lib/utils";

const icons: Record<string, React.ReactNode> = {
  rocket: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6m0 0-3-3m3 3 3-3M9 9l-2 5 5-2" />
  ),
  medical: (
    <path strokeLinecap="round" d="M12 6v12M6 12h12" />
  ),
  science: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M6 14h12" />
      <path strokeLinecap="round" d="M12 6v4" />
    </>
  ),
  events: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8v6a4 4 0 01-8 0V8zM12 16v2" />
  ),
  communication: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-6-3.6-6-8a4 4 0 118 0c0 4.4-6 8-6 8z" />
  ),
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={cn("h-8 w-8 text-leanme-purple", className)}
    >
      {icons[name] ?? icons.rocket}
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={cn("text-leanme-purple", className)}
    >
      <path d="M20 64 100 24l80 40-80 40-80-40z" />
      <path d="M40 76v34c0 8 26 18 60 18s60-10 60-18V76" />
      <path d="M160 78v38" />
      <path d="M160 116c0 8-18 14-40 14" />
    </svg>
  );
}

export function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
      className={cn("text-leanme-purple", className)}
    >
      <path d="M8 28c0-8 4-14 12-16v6c-4 1-6 4-6 8h6v10H8V28zm22 0c0-8 4-14 12-16v6c-4 1-6 4-6 8h6v10H30V28z" />
    </svg>
  );
}

export function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M6 4h12a2 2 0 012 2v10l-4-3H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  );
}

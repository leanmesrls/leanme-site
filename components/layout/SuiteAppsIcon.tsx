import { cn } from "@/lib/utils";

interface SuiteAppsIconProps {
  className?: string;
}

/** Griglia 3×3 di cerchi — richiamo Microsoft 365 waffle + pittogramma LeanMe. */
export function SuiteAppsIcon({ className }: SuiteAppsIconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5 shrink-0", className)}
    >
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={3 + col * 6}
            cy={3 + row * 6}
            r="1.65"
          />
        ))
      )}
    </svg>
  );
}

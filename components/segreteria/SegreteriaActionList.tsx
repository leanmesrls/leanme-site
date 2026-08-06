import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SegreteriaAction } from "@/types/segreteria";
import { SegreteriaSaveContactButton } from "@/components/segreteria/SegreteriaSaveContactButton";

interface SegreteriaActionListProps {
  actions: SegreteriaAction[];
  feedbackMessage?: string;
  className?: string;
  sectionId?: string;
}

const variantClasses = {
  primary:
    "bg-leanme-fuchsia text-white hover:bg-leanme-fuchsia/90 shadow-lg shadow-leanme-fuchsia/20",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:border-leanme-fuchsia/50 hover:bg-white/10",
  ghost: "text-white/75 hover:text-leanme-fuchsia",
};

export function SegreteriaActionList({
  actions,
  feedbackMessage,
  className,
  sectionId,
}: SegreteriaActionListProps) {
  return (
    <div
      className={cn("grid gap-3", className)}
      {...(sectionId ? { "data-leonardo-section": sectionId } : {})}
    >
      {actions.map((action) => {
        if (action.download && feedbackMessage) {
          return (
            <SegreteriaSaveContactButton
              key={`${action.id}-${action.href}`}
              href={action.href}
              label={action.label}
              feedbackMessage={feedbackMessage}
              variant={action.variant ?? "primary"}
              actionId={action.id}
            />
          );
        }

        const classes = cn(
          "leonardo-action inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leanme-fuchsia focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          variantClasses[action.variant ?? "secondary"]
        );

        if (
          action.external ||
          action.href.startsWith("http") ||
          action.href.startsWith("tel:") ||
          action.href.startsWith("mailto:")
        ) {
          return (
            <a
              key={`${action.id}-${action.href}`}
              href={action.href}
              className={classes}
              data-leonardo-action={action.id}
              {...(action.external || action.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {action.label}
            </a>
          );
        }

        return (
          <Link
            key={`${action.id}-${action.href}`}
            href={action.href}
            className={classes}
            data-leonardo-action={action.id}
            {...(action.download ? { download: true } : {})}
          >
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

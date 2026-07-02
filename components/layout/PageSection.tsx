import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface PageIntroProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
}

export function PageIntro({
  title,
  subtitle,
  description,
  align = "left",
}: PageIntroProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {subtitle && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-leanme-purple">
          {subtitle}
        </p>
      )}
      <h1 className="text-3xl font-bold tracking-[0.06em] text-white md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
          {description}
        </p>
      )}
      <div className={cn("mt-4 h-[2px] w-12 bg-leanme-purple", align === "center" && "mx-auto")} />
    </div>
  );
}

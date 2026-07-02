import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  underline?: boolean;
}

export function SectionTitle({
  children,
  className,
  align = "center",
  underline = true,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-xl font-bold tracking-[0.12em] text-white md:text-2xl">
        {children}
      </h2>
      {underline && (
        <div className="mx-auto mt-3 h-[2px] w-12 bg-leanme-purple" />
      )}
    </div>
  );
}

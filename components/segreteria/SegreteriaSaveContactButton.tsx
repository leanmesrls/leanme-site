"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SegreteriaSaveContactButtonProps {
  href: string;
  label: string;
  feedbackMessage: string;
  variant?: "primary" | "secondary" | "ghost";
  actionId?: string;
}

const variantClasses = {
  primary:
    "bg-leanme-fuchsia text-white hover:bg-leanme-fuchsia/90 shadow-lg shadow-leanme-fuchsia/20",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:border-leanme-fuchsia/50 hover:bg-white/10",
  ghost: "text-white/75 hover:text-leanme-fuchsia",
};

export function SegreteriaSaveContactButton({
  href,
  label,
  feedbackMessage,
  variant = "primary",
  actionId,
}: SegreteriaSaveContactButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="space-y-2">
      <a
        href={href}
        download
        data-leonardo-action={actionId}
        onClick={() => setShowFeedback(true)}
        className={cn(
          "leonardo-action inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leanme-fuchsia focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          variantClasses[variant]
        )}
      >
        {label}
      </a>
      {showFeedback && (
        <p
          role="status"
          className="rounded-xl border border-leanme-fuchsia/30 bg-leanme-fuchsia/10 px-4 py-3 text-sm leading-relaxed text-white/85"
        >
          {feedbackMessage}
        </p>
      )}
    </div>
  );
}

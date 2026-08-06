"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function SegreteriaScrollToPersona() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const persona = searchParams.get("persona");
    if (!persona) return;

    const target = document.getElementById(persona);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams]);

  return null;
}

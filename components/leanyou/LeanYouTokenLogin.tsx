"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { leanyouLeonardoPath } from "@/lib/leanyou/paths";

interface LeanYouTokenLoginProps {
  tenantSlug: string;
}

export function LeanYouTokenLogin({ tenantSlug }: LeanYouTokenLoginProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifica token in corso...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }

    async function loginWithToken() {
      const response = await fetch("/api/leanyou/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tenantSlug }),
      });

      if (!response.ok) {
        setMessage("Token non valido o scaduto.");
        return;
      }

      router.replace(
        searchParams.get("next") ?? leanyouLeonardoPath(tenantSlug)
      );
      router.refresh();
    }

    void loginWithToken();
  }, [router, searchParams, tenantSlug]);

  if (!searchParams.get("token")) {
    return null;
  }

  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
      {message}
    </p>
  );
}

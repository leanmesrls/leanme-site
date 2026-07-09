"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { leanyouLeonardoPath } from "@/lib/leanyou/paths";

interface LeanYouLoginFormProps {
  tenantSlug: string;
}

export function LeanYouLoginForm({ tenantSlug }: LeanYouLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/leanyou/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, tenantSlug }),
    });

    const payload = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Accesso non riuscito.");
      return;
    }

    router.replace(
      searchParams.get("next") ?? leanyouLeonardoPath(tenantSlug)
    );
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-leanme-fuchsia"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-leanme-fuchsia"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-leanme-fuchsia-dark disabled:opacity-60"
      >
        {loading ? "Accesso in corso..." : "Accedi a LeanYou"}
      </button>

      <p className="text-center text-[11px] text-white/45">
        Accesso riservato a {tenantSlug.toUpperCase()}
      </p>
    </form>
  );
}

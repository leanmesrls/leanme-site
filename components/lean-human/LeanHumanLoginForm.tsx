"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LeanHumanLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/lean-human";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/teresa/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Accesso non riuscito.");
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#111111] p-6"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
          Lean.Human
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Supervisione Teresa
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Area riservata operatori LeanMe — chat sito pubblico.
        </p>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="text-white/60">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 outline-none focus:border-leanme-fuchsia"
          required
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-leanme-fuchsia px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:opacity-60"
      >
        {loading ? "Accesso…" : "Entra"}
      </button>
      <p className="text-center text-xs text-white/40">
        <Link href="/" className="hover:text-white/70">
          Torna al sito
        </Link>
      </p>
    </form>
  );
}

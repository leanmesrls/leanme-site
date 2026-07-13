"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LeonardoEventTaxonomyFields,
  type EventTaxonomyFormState,
} from "@/components/leanyou/LeonardoEventTaxonomyFields";
import { leanyouLeonardoEventPath } from "@/lib/leanyou/paths";

interface LeonardoEventFormProps {
  tenantSlug: string;
}

export function LeonardoEventForm({ tenantSlug }: LeonardoEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    cdc: "",
    title: "",
    venue: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [taxonomy, setTaxonomy] = useState<EventTaxonomyFormState>({
    categoryId: "evento_aziendale",
    healthAreaId: null,
    ecmEnabled: false,
    ecmModality: null,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/leanyou/events", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ...taxonomy }),
    });

    const payload = (await response.json()) as {
      error?: string;
      event?: { id: string };
    };

    setLoading(false);

    if (!response.ok || !payload.event) {
      setError(payload.error ?? "Creazione evento non riuscita.");
      return;
    }

    router.push(leanyouLeonardoEventPath(tenantSlug, payload.event.id));
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-bold">Nuovo evento</h2>
        <p className="mt-1 text-sm text-white/60">
          CDC libero, date singolo giorno o range (dal / al).
        </p>
      </div>

      <LeonardoEventTaxonomyFields value={taxonomy} onChange={setTaxonomy} />

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
          Titolo *
        </span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
          CDC (centro di costo)
        </span>
        <input
          value={form.cdc}
          onChange={(e) => setForm({ ...form, cdc: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
          Sede
        </span>
        <input
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            Data inizio (gg/mm/aaaa)
          </span>
          <input
            placeholder="gg/mm/aaaa"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            Data fine (gg/mm/aaaa)
          </span>
          <input
            placeholder="gg/mm/aaaa"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
          Note
        </span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:opacity-60"
      >
        {loading ? "Salvataggio..." : "Crea evento"}
      </button>
    </form>
  );
}

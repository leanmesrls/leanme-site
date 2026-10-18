"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Row = {
  slug: string;
  title: string;
  count: number;
  average: number;
  histogram: number[];
  updatedAt: string | null;
};

function when(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ArticleInterestReport() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/leanlab/interest/report")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/lean-human/login?next=/lean-human/interesse");
          return null;
        }
        return (await response.json()) as { articles?: Row[]; total?: number; error?: string };
      })
      .then((payload) => {
        if (!payload) return;
        if (payload.error) setError(payload.error);
        setRows(payload.articles ?? []);
        setTotal(payload.total ?? 0);
      })
      .catch(() => setError("Errore caricamento."));
  }, [router]);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
        Lean.Human
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-white">Interesse sugli articoli</h1>
      <p className="mt-2 text-sm text-white/60">
        Stelline da 1 a 5 su «Ti interessa questo argomento?». {total} voti in totale.
      </p>
      <Link
        href="/lean-human"
        className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 hover:text-white"
      >
        Teresa pubblica
      </Link>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm text-white">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.08em] text-white/45">
            <tr>
              <th className="px-4 py-3 font-semibold">Articolo</th>
              <th className="px-3 py-3 font-semibold">Voti</th>
              <th className="px-3 py-3 font-semibold">Media</th>
              {[1, 2, 3, 4, 5].map((star) => (
                <th key={star} className="px-3 py-3 font-semibold">
                  {star}★
                </th>
              ))}
              <th className="px-3 py-3 font-semibold">Ultimo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link
                    href={`/leanlab/articolo/${row.slug}`}
                    className="font-medium hover:text-leanme-fuchsia"
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-3 py-3">{row.count}</td>
                <td className="px-3 py-3">
                  {row.count ? row.average.toFixed(1) : "—"}
                </td>
                {row.histogram.map((count, index) => (
                  <td key={index} className="px-3 py-3 text-white/80">
                    {count}
                  </td>
                ))}
                <td className="px-3 py-3 text-white/50">{when(row.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

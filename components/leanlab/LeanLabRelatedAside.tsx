import Image from "next/image";
import Link from "next/link";

export function LeanLabRelatedAside() {
  return (
    <aside
      aria-label="Contenuti attinenti"
      className="rounded-2xl border border-white/10 bg-black p-4 lg:sticky lg:top-24"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
        Contenuti attinenti
      </p>
      <Link
        href="/lean-academy/ricerca-e-innovazione-episodio-01"
        className="mt-3 block overflow-hidden rounded-xl border border-white/10 transition hover:border-[#7c4dff]"
      >
        <Image
          src="/assets/leanlab/ricerca-episodio-01-cover.jpg"
          alt="Te lo spiego io, episodio 01: SEO, AEO e GEO con Lean.Agent Olivetti."
          width={1024}
          height={433}
          className="h-auto w-full"
        />
        <span className="block px-3 py-3">
          <span className="block text-sm font-semibold leading-snug text-white">
            Hai seguito la lezione di Olivetti su SEO, AEO e GEO?
          </span>
          <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#c4b5fd]">
            Guarda il video in Lean Academy
          </span>
        </span>
      </Link>
      <Link
        href="/lean-academy"
        className="mt-3 inline-block text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
      >
        Altri video in Lean Academy
      </Link>
    </aside>
  );
}

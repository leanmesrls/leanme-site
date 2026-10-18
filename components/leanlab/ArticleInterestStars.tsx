"use client";

import { useEffect, useState } from "react";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path
        d="M12 3.2 14.7 9l6.3.6-4.8 4.1 1.5 6.1L12 16.8 6.3 19.8 7.8 13.7 3 9.6 9.3 9 12 3.2Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArticleInterestStars({ slug }: { slug: string }) {
  const [stars, setStars] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/leanlab/interest?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json())
      .then((payload: { stars?: number | null }) => {
        if (typeof payload.stars === "number") setStars(payload.stars);
      })
      .catch(() => undefined);
  }, [slug]);

  async function rate(value: number) {
    setStars(value);
    setError(null);
    try {
      const response = await fetch("/api/leanlab/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, stars: value }),
      });
      if (!response.ok) {
        setError("Non riesco a registrare il voto. Riprova.");
        return;
      }
      setSaved(true);
      window.dispatchEvent(
        new CustomEvent("leanlab-interest", { detail: { slug, stars: value } })
      );
    } catch {
      setError("Connessione interrotta. Riprova.");
    }
  }

  useEffect(() => {
    function onVote(event: Event) {
      const detail = (event as CustomEvent<{ slug?: string; stars?: number }>).detail;
      if (detail?.slug === slug && typeof detail.stars === "number") {
        setStars(detail.stars);
        setSaved(true);
      }
    }
    window.addEventListener("leanlab-interest", onVote);
    return () => window.removeEventListener("leanlab-interest", onVote);
  }, [slug]);

  const shown = hover ?? stars ?? 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-semibold leading-snug text-white">
        Ti interessa questo argomento?
      </p>
      <div
        className="mt-3 flex gap-1"
        role="radiogroup"
        aria-label="Quanto ti interessa, da 1 a 5 stelle"
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={stars === value}
            aria-label={`${value} su 5`}
            onMouseEnter={() => setHover(value)}
            onClick={() => void rate(value)}
            className={`text-leanme-fuchsia transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia ${
              value <= shown ? "opacity-100" : "text-white/35"
            }`}
          >
            <Star filled={value <= shown} />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/55">
        {saved && stars
          ? `Registrato: ${stars} su 5.`
          : "Da 1 a 5. Un clic basta."}
      </p>
      {error ? <p className="mt-1 text-xs text-[#ff8abe]">{error}</p> : null}
    </div>
  );
}

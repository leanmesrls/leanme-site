"use client";

import Link from "next/link";

import { LeonardoSearchableVenueSelect } from "@/components/leanyou/LeonardoSearchableVenueSelect";
import {
  buildVenueSnapshot,
} from "@/lib/leanyou/venue-display";
import { leanyouLeonardoSediPath } from "@/lib/leanyou/paths";
import type { LeonardoVenue } from "@/types/leanyou";

interface LeonardoVenuePickerProps {
  tenantSlug: string;
  venues: LeonardoVenue[];
  venueId: string | null;
  venueText: string;
  onChange: (value: { venueId: string | null; venue: string }) => void;
}

export function LeonardoVenuePicker({
  tenantSlug,
  venues,
  venueId,
  venueText,
  onChange,
}: LeonardoVenuePickerProps) {
  const customMode = !venueId;
  const selected = venues.find((venue) => venue.id === venueId) ?? null;

  function handleSelectVenue(nextId: string) {
    if (!nextId) {
      onChange({ venueId: null, venue: venueText });
      return;
    }
    const venue = venues.find((item) => item.id === nextId);
    if (!venue) {
      return;
    }
    onChange({
      venueId: venue.id,
      venue: buildVenueSnapshot(venue),
    });
  }

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
          Sede evento
        </span>
        <Link
          href={leanyouLeonardoSediPath(tenantSlug)}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-leanme-fuchsia hover:underline"
        >
          Rubrica sedi
        </Link>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="radio"
          checked={!customMode}
          onChange={() => {
            if (selected) {
              handleSelectVenue(selected.id);
            } else {
              onChange({ venueId: null, venue: venueText });
            }
          }}
          className="accent-leanme-fuchsia"
        />
        Dalla rubrica sedi (ricerca)
      </label>

      {!customMode ? (
        <LeonardoSearchableVenueSelect
          venues={venues}
          value={venueId ?? ""}
          onChange={handleSelectVenue}
          emptyLabel="Cerca hotel o sede per nome, città, provincia…"
        />
      ) : null}

      {!customMode && selected ? (
        <div className="space-y-2">
          <p className="text-xs text-white/50">
            {selected.address} · {selected.city} ({selected.province})
            {selected.postalCode ? ` · ${selected.postalCode}` : ""}
          </p>
          {selected.externalUrl ? (
            <a
              href={selected.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-leanme-fuchsia hover:underline"
            >
              Scheda esterna →
            </a>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="radio"
          checked={customMode}
          onChange={() => onChange({ venueId: null, venue: venueText })}
          className="accent-leanme-fuchsia"
        />
        Testo libero
      </label>

      {customMode ? (
        <input
          value={venueText}
          onChange={(event) =>
            onChange({ venueId: null, venue: event.target.value })
          }
          placeholder="Nome sede, indirizzo, città…"
          className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm outline-none focus:border-leanme-fuchsia"
        />
      ) : null}
    </div>
  );
}

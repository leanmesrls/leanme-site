"use client";

import Link from "next/link";
import { useState } from "react";

import eventsConfig from "@/data/leanyou/events-config.json";
import { LeanAgentAiPoweredBy } from "@/components/leanyou/LeanAgentAiPoweredBy";
import { LeonardoEventGuestsPanel } from "@/components/leanyou/LeonardoEventGuestsPanel";
import {
  LeonardoEventTaxonomyFields,
  type EventTaxonomyFormState,
} from "@/components/leanyou/LeonardoEventTaxonomyFields";
import { formatEuropeanDate } from "@/lib/leanyou/dates";
import { formatEventTaxonomySummary } from "@/lib/leanyou/event-taxonomy";
import {
  leanyouLeonardoEventiPath,
  leanyouLeonardoNewPath,
  leanyouLeonardoWorkspacePath,
} from "@/lib/leanyou/paths";
import type { EventAssignmentWithContact } from "@/lib/leanyou/event-assignments";
import type { LeanYouContact, LeonardoEvent, LeonardoWorkspace } from "@/types/leanyou";

const tabs = [
  { id: "anagrafica", label: "Anagrafica" },
  { id: "ospiti", label: "Ospiti" },
  { id: "verbali", label: "Verbali" },
  { id: "stampati", label: "Stampati & grafiche" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface LeonardoEventDetailProps {
  tenantSlug: string;
  initialEvent: LeonardoEvent;
  linkedWorkspaces: LeonardoWorkspace[];
  initialAssignments: EventAssignmentWithContact[];
  contacts: LeanYouContact[];
  ospitiEnabled: boolean;
}

export function LeonardoEventDetail({
  tenantSlug,
  initialEvent,
  linkedWorkspaces,
  initialAssignments,
  contacts,
  ospitiEnabled,
}: LeonardoEventDetailProps) {
  const [event, setEvent] = useState(initialEvent);
  const [activeTab, setActiveTab] = useState<TabId>("anagrafica");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveAnagrafica() {
    setSaving(true);
    setMessage(null);
    const response = await fetch(`/api/leanyou/events/${event.id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        cdc: event.cdc,
        title: event.title,
        venue: event.venue,
        startDate: event.startDate,
        endDate: event.endDate,
        categoryId: event.categoryId,
        healthAreaId: event.healthAreaId,
        ecmEnabled: event.ecmEnabled,
        ecmModality: event.ecmModality,
        status: event.status,
        notes: event.notes,
      }),
    });
    const payload = (await response.json()) as {
      error?: string;
      event?: LeonardoEvent;
    };
    setSaving(false);
    if (!response.ok || !payload.event) {
      setMessage(payload.error ?? "Salvataggio non riuscito.");
      return;
    }
    setEvent(payload.event);
    setMessage("Evento aggiornato.");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={leanyouLeonardoEventiPath(tenantSlug)}
          className="text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia"
        >
          ← Torna agli eventi
        </Link>
        <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
        <p className="mt-2 text-sm text-white/60">
          CDC {event.cdc || "—"} · {formatEuropeanDate(event.startDate)}
          {event.endDate !== event.startDate
            ? ` → ${formatEuropeanDate(event.endDate)}`
            : ""}
        </p>
        <p className="mt-1 text-xs text-white/45">
          {formatEventTaxonomySummary(event)}
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition sm:text-xs ${
              activeTab === tab.id
                ? "bg-leanme-fuchsia text-white"
                : "border border-white/15 text-white/70 hover:border-white/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "anagrafica" ? (
        <section className="space-y-4 rounded-xl border border-white/10 bg-[#111111] p-6">
          <LeonardoEventTaxonomyFields
            value={{
              categoryId: event.categoryId,
              healthAreaId: event.healthAreaId,
              ecmEnabled: event.ecmEnabled,
              ecmModality: event.ecmModality,
            }}
            onChange={(taxonomy: EventTaxonomyFormState) =>
              setEvent({
                ...event,
                ...taxonomy,
              })
            }
          />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              Titolo
            </span>
            <input
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              CDC
            </span>
            <input
              value={event.cdc}
              onChange={(e) => setEvent({ ...event, cdc: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              Sede
            </span>
            <input
              value={event.venue}
              onChange={(e) => setEvent({ ...event, venue: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
                Data inizio
              </span>
              <input
                value={event.startDate}
                onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
                Data fine
              </span>
              <input
                value={event.endDate}
                onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              Stato
            </span>
            <select
              value={event.status}
              onChange={(e) =>
                setEvent({
                  ...event,
                  status: e.target.value as LeonardoEvent["status"],
                })
              }
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            >
              {eventsConfig.eventStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              Note
            </span>
            <textarea
              rows={4}
              value={event.notes}
              onChange={(e) => setEvent({ ...event, notes: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            />
          </label>
          {message ? (
            <p className="text-sm text-leanme-fuchsia">{message}</p>
          ) : null}
          <button
            type="button"
            onClick={saveAnagrafica}
            disabled={saving}
            className="rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:opacity-60"
          >
            {saving ? "Salvataggio..." : "Salva anagrafica"}
          </button>
        </section>
      ) : null}

      {activeTab === "ospiti" && ospitiEnabled ? (
        <LeonardoEventGuestsPanel
          eventId={event.id}
          initialAssignments={initialAssignments}
          contacts={contacts}
        />
      ) : null}

      {activeTab === "verbali" ? (
        <section className="rounded-xl border border-white/10 bg-[#111111] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60">
              Verbali collegati a questo evento (`linkedEventId`).
            </p>
            <Link
              href={`${leanyouLeonardoNewPath(tenantSlug)}?eventId=${event.id}`}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:border-leanme-fuchsia"
            >
              Nuovo verbale collegato
            </Link>
          </div>
          {linkedWorkspaces.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">
              Nessun verbale collegato. Crea un workspace verbali e associa
              l&apos;evento dalla scheda workspace.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {linkedWorkspaces.map((workspace) => (
                <li key={workspace.id}>
                  <Link
                    href={leanyouLeonardoWorkspacePath(tenantSlug, workspace.id)}
                    className="block rounded-lg border border-white/10 px-4 py-3 transition hover:border-leanme-fuchsia/40"
                  >
                    <span className="font-medium">{workspace.title}</span>
                    <span className="ml-2 text-xs text-white/50">
                      {workspace.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {activeTab === "stampati" ? (
        <section className="rounded-xl border border-white/10 bg-[#111111] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-leanme-fuchsia">
            Stampati &amp; grafiche
          </h3>
          <p className="mt-3 text-sm text-white/60">
            Upload stampati per categoria ({eventsConfig.graphicCategories.length}{" "}
            categorie predefinite). Con pack AI, generazione automatica da prompt.
          </p>
          <LeanAgentAiPoweredBy capability="stampati" className="mt-3" />
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eventsConfig.graphicCategories.map((category) => (
              <li
                key={category.id}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70"
              >
                {category.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

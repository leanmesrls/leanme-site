"use client";

import { useMemo, useState } from "react";

import eventsConfig from "@/data/leanyou/events-config.json";
import { formatContactName } from "@/lib/leanyou/contact-display";
import type { EventAssignmentWithContact } from "@/lib/leanyou/event-assignments";
import type { LeanYouContact, LeonardoEventRoleCategory } from "@/types/leanyou";

type AssignmentRow = EventAssignmentWithContact;

const roleCategories = eventsConfig.roleCategories as Array<{
  id: LeonardoEventRoleCategory;
  label: string;
}>;

interface LeonardoEventGuestsPanelProps {
  eventId: string;
  initialAssignments: AssignmentRow[];
  contacts: LeanYouContact[];
}

export function LeonardoEventGuestsPanel({
  eventId,
  initialAssignments,
  contacts,
}: LeonardoEventGuestsPanelProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [contactId, setContactId] = useState("");
  const [roleCategory, setRoleCategory] =
    useState<LeonardoEventRoleCategory>("ospite");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState("");

  const sortedContacts = useMemo(
    () =>
      [...contacts].sort((a, b) =>
        formatContactName(a).localeCompare(formatContactName(b), "it")
      ),
    [contacts]
  );

  const filteredAssignments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return assignments;
    }
    return assignments.filter((assignment) => {
      const haystack = [
        assignment.contactName,
        assignment.roleLabel,
        assignment.contact.email,
        assignment.contact.organization,
        assignment.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [assignments, query]);

  async function handleAssign(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!contactId) {
      setError("Seleziona un contatto dalla rubrica.");
      return;
    }

    setPending(true);
    const response = await fetch(`/api/leanyou/events/${eventId}/assignments`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, roleCategory, notes }),
    });
    const payload = (await response.json()) as {
      error?: string;
      assignment?: AssignmentRow;
    };
    setPending(false);

    if (!response.ok || !payload.assignment) {
      setError(payload.error ?? "Assegnazione non riuscita.");
      return;
    }

    setAssignments((current) => [payload.assignment!, ...current]);
    setContactId("");
    setNotes("");
    setRoleCategory("ospite");
  }

  async function handleRemove(assignmentId: string) {
    setError(null);
    const response = await fetch(
      `/api/leanyou/events/${eventId}/assignments/${assignmentId}`,
      {
        method: "DELETE",
        credentials: "same-origin",
      }
    );
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Rimozione non riuscita.");
      return;
    }
    setAssignments((current) =>
      current.filter((assignment) => assignment.id !== assignmentId)
    );
  }

  return (
    <section className="space-y-6 rounded-xl border border-white/10 bg-[#111111] p-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-leanme-fuchsia">
          Ospiti &amp; ruoli
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Assegna contatti dalla rubrica globale. Lo stesso contatto può
          partecipare a più eventi con ruoli diversi — base per area riservata
          partecipante e schede personali.
        </p>
      </div>

      <form
        onSubmit={handleAssign}
        className="grid gap-3 rounded-xl border border-white/10 bg-black/40 p-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            Contatto rubrica *
          </span>
          <select
            required
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
          >
            <option value="">Seleziona dalla rubrica</option>
            {sortedContacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {formatContactName(contact)}
                {contact.organization ? ` · ${contact.organization}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            Ruolo su questo evento *
          </span>
          <select
            required
            value={roleCategory}
            onChange={(e) =>
              setRoleCategory(e.target.value as LeonardoEventRoleCategory)
            }
            className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
          >
            {roleCategories.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
            Note evento
          </span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Opzionale"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
          />
        </label>
        <div className="md:col-span-2 xl:col-span-4">
          <button
            type="submit"
            disabled={pending || contacts.length === 0}
            className="rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:opacity-60"
          >
            {pending ? "Assegnazione..." : "Assegna all'evento"}
          </button>
        </div>
      </form>

      {contacts.length === 0 ? (
        <p className="text-sm text-white/45">
          Nessun contatto in rubrica. Aggiungi anagrafiche da Rubrica contatti.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
          Cerca assegnazioni
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome, ruolo, email..."
          className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
      </label>

      {filteredAssignments.length === 0 ? (
        <p className="text-sm text-white/50">
          Nessun ospite assegnato a questo evento.
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredAssignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-white/10 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-white">{assignment.contactName}</p>
                <p className="mt-1 text-xs text-leanme-fuchsia">
                  {assignment.roleLabel}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {assignment.contact.email || "—"}
                  {assignment.contact.organization
                    ? ` · ${assignment.contact.organization}`
                    : ""}
                </p>
                {assignment.notes ? (
                  <p className="mt-1 text-xs text-white/45">{assignment.notes}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(assignment.id)}
                className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-white/45 transition hover:text-red-300"
              >
                Rimuovi
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

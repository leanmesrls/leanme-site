"use client";

import { useState } from "react";

import { formatContactName } from "@/lib/leanyou/contact-display";
import type { LeanYouContact } from "@/types/leanyou";

interface LeonardoContactListProps {
  initialContacts: LeanYouContact[];
}

export function LeonardoContactList({
  initialContacts,
}: LeonardoContactListProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
  });

  const filtered = contacts.filter((contact) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return true;
    }
    const haystack = [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.organization,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/leanyou/contacts", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const payload = (await response.json()) as {
      error?: string;
      duplicate?: boolean;
      contact?: LeanYouContact;
    };

    if (response.status === 409 && payload.contact) {
      setError(
        `Email già presente: ${formatContactName(payload.contact)}. Il merge campo per campo arriverà nel prossimo step.`
      );
      return;
    }

    if (!response.ok || !payload.contact) {
      setError(payload.error ?? "Creazione contatto non riuscita.");
      return;
    }

    setContacts((current) =>
      [...current, payload.contact!].sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, "it")
      )
    );
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-[0.04em]">Rubrica contatti</h2>
        <p className="mt-1 text-sm text-white/60">
          Anagrafica globale tenant. Import Excel e copia-incolla in arrivo.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-xl border border-white/10 bg-[#111111] p-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <input
          required
          placeholder="Nome *"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
        <input
          required
          placeholder="Cognome *"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
        <input
          placeholder="Telefono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
        />
        <input
          placeholder="Organizzazione"
          value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          className="rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia md:col-span-2 xl:col-span-1"
        />
        <button
          type="submit"
          className="rounded-full bg-leanme-fuchsia px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark"
        >
          Aggiungi contatto
        </button>
      </form>

      {error ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </p>
      ) : null}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca contatti..."
        className="w-full rounded-lg border border-white/15 bg-[#111111] px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
      />

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-[#141414] text-left text-xs uppercase tracking-[0.1em] text-white/45">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefono</th>
              <th className="px-4 py-3">Organizzazione</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => (
              <tr key={contact.id} className="border-t border-white/10 bg-[#111111]">
                <td className="px-4 py-3 font-medium">
                  {formatContactName(contact)}
                </td>
                <td className="px-4 py-3 text-white/70">{contact.email || "—"}</td>
                <td className="px-4 py-3 text-white/70">
                  {contact.phones[0]?.number ?? "—"}
                </td>
                <td className="px-4 py-3 text-white/70">
                  {contact.organization || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

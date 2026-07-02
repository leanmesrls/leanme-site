"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  title: string;
  description: string;
  submitLabel: string;
}

export function ContactForm({ title, description, submitLabel }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-leanme-purple/20 bg-leanme-purple/5 p-8 text-center">
        <p className="text-lg font-medium text-leanme-purple">
          Messaggio inviato con successo.
        </p>
        <p className="mt-2 text-sm text-leanme-gray-600">
          Ti risponderemo al più presto.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-leanme-black/5 bg-white p-8 shadow-sm"
      aria-labelledby="contact-form-title"
    >
      <h3 id="contact-form-title" className="text-xl font-semibold">
        {title}
      </h3>
      <p className="mt-2 text-sm text-leanme-gray-600">{description}</p>

      <div className="mt-8 grid gap-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nome e cognome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-leanme-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-leanme-purple"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-leanme-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-leanme-purple"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium">
            Messaggio
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full rounded-xl border border-leanme-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-leanme-purple"
          />
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" label={submitLabel} variant="primary" />
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { sendContact, type ContactFormState } from "../../app/contact/actions";

const initial: ContactFormState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initial);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <Field
        label="Nama"
        name="name"
        type="text"
        autoComplete="name"
        required
        error={state.fieldErrors?.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <Field
        label="Subjek"
        name="subject"
        type="text"
        required
        error={state.fieldErrors?.subject}
      />
      <div>
        <label className="mb-2 block text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
          Pesan
        </label>
        <textarea
          name="message"
          rows={6}
          required
          className="w-full border border-[var(--color-surface-2)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-gold)]"
        />
        {state.fieldErrors?.message && (
          <p className="mt-2 text-xs text-[var(--color-accent)]">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.error && !state.ok && (
        <p
          className="border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-accent)]"
          role="alert"
        >
          {state.error}
        </p>
      )}
      {state.ok && (
        <p
          className="border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-4 py-3 text-sm text-[var(--color-gold)]"
          role="status"
        >
          Pesan terkirim. Terima kasih telah menghubungi.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-block border border-[var(--color-gold)]/50 px-8 py-4 text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] transition-all duration-500 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 disabled:opacity-50"
      >
        {pending ? "Mengirim…" : "Kirim Pesan"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-[var(--color-surface-2)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-gold)]"
      />
      {error && (
        <p className="mt-2 text-xs text-[var(--color-accent)]">{error}</p>
      )}
    </div>
  );
}

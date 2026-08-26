"use client";

import { useState, type FormEvent } from "react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "submitted" | "error";

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) errors.message = "Message is required.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("submitted");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "submitted") {
    return (
      <p role="status" className="rounded-2xl bg-background-raised p-6 font-display text-lg text-foreground shadow-card">
        Thanks — I&apos;ll get back to you soon.
      </p>
    );
  }

  const fieldClasses =
    "mt-1.5 w-full rounded-xl border border-ink/15 bg-background-raised px-4 py-2.5 text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-serenity-deep aria-[invalid=true]:border-rose-deep";
  const labelClasses = "font-mono text-xs uppercase tracking-wide text-foreground/70";
  const errorClasses = "mt-1 text-sm text-rose-deep";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <div>
        <label htmlFor="contact-name" className={labelClasses}>
          Name
        </label>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClasses}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className={errorClasses}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClasses}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={fieldClasses}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className={errorClasses}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          rows={5}
          className={`${fieldClasses} resize-y`}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className={errorClasses}>
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-rose-deep/30 bg-rose/20 px-4 py-3 text-sm text-rose-deep"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-deep px-6 py-3 font-medium text-paper shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "submitting" && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
          />
        )}
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
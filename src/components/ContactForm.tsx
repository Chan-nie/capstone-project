"use client";

import { useState, type FormEvent } from "react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return <p role="status">Thanks — I&apos;ll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && <p id="contact-name-error" role="alert">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && <p id="contact-email-error" role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && <p id="contact-message-error" role="alert">{errors.message}</p>}
      </div>

      <button type="submit">Send message</button>
    </form>
  );
}
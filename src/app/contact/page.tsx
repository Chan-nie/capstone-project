import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-serenity-deep">
        Get in touch
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
        Contact
      </h1>
      <p className="mt-4 text-ink/70">
        Have a project idea or question? Send a message below.
      </p>
      <ContactForm />
    </main>
  );
}
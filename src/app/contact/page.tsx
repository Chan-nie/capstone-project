import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 text-neutral-600">Have a project idea or question? Send a message below.</p>
      <ContactForm />
    </main>
  );
}
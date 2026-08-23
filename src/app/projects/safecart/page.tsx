import Image from "next/image";

export default function SpaceMissionPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Space Mission Analysis Tool</h1>
      <p className="mt-2 text-sm text-neutral-500">Team of 3 · Python + pandas · Hand-coded, no AI</p>

      <Image
        src="/images/safecart-form.jpg"
        alt="SafeCart Form"
        width={800}
        height={500}
        className="mt-6 rounded border"
      />

      <h2 className="mt-8 text-lg font-semibold">Problem</h2>
      <p className="mt-2 text-neutral-600">
        People with health conditions or food allergies often have to spend time checking ingredient lists and nutrition labels before buying a product. The information is there, but it is not always easy to understand quickly, especially while shopping.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What I did</h2>
      <p className="mt-2 text-neutral-600">
        Team of 3, built as a web application using React, Firebase, and AI-powered analysis. We worked together on the overall product, with each person contributing to different parts of the app. I was involved in the design, frontend development, Firebase integration, and implementing features that provide personalized recommendations based on a user's health conditions and allergies. Users can select conditions like Diabetes, High Cholesterol, and Hypertension, along with allergies such as Dairy, Gluten, and Nuts, and receive tailored product insights.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Outcome</h2>
      <p className="mt-2 text-neutral-600">
        A working prototype that turns product information into clear, personalized guidance. Instead of manually checking every ingredient and nutrition label, users receive simple recommendations and warnings based on their profile. The project gave me experience working in a team while combining frontend development, databases, AI integration, and user-centered design to solve a real-world problem.
      </p>

      <a href="https://github.com/Chan-nie/space-mission-analysis" className="mt-8 inline-block rounded bg-brand px-4 py-2 text-white">
        View on GitHub
      </a>
    </main>
  );
}
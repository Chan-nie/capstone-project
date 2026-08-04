import Link from "next/link";

const projects = [
  {
    slug: "space-mission-analysis-tool",
    name: "Space Mission Analysis Tool",
    blurb: "Python + pandas CLI tool that turns messy mission data into clean, queryable output. Team of 3, equal split — I built the login flow and 10 of the 30 analysis functions.",
  },
  {
    slug: "connectify",
    name: "Connectify",
    blurb: "A matching app built to push against social-bubble matching — tracks how varied your connections are instead of optimizing for sameness. Built through Lovable AI via prompting, not hand-coded.",
  },
  {
    slug: "safecart",
    name: "SafeCart",
    blurb: "A food-safety scanner that personalizes product analysis to your health conditions and allergies using the Anthropic Vision API. Still in progress.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="mt-2 text-neutral-600">Three cases — what the problem was, what I actually did, and what shipped.</p>
      <div className="mt-8 space-y-6">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="block rounded border p-5 hover:bg-neutral-50">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">{p.blurb}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
import Image from "next/image";

export default function SpaceMissionPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Space Mission Analysis Tool</h1>
      <p className="mt-2 text-sm text-neutral-500">Team of 3 · Python + pandas · Hand-coded, no AI</p>

      <Image
        src="/images/space-mission-cli.jpg"
        alt="Space Mission Analysis Tool CLI menu"
        width={800}
        height={500}
        className="mt-6 rounded border"
      />

      <h2 className="mt-8 text-lg font-semibold">Problem</h2>
      <p className="mt-2 text-neutral-600">
        Raw mission data is messy. We wanted a way to organize and filter it into
        clean, usable output without manually digging through it each time.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What I did</h2>
      <p className="mt-2 text-neutral-600">
        Team of 3, built in Jupyter Notebook using Python. We split the work evenly where
each person owned 10 numbered analysis tools, so a user could type in a number
and get the corresponding clean output. I wrote analysis tools 1–10, plus the user
login code, all hand-coded myself.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Outcome</h2>
      <p className="mt-2 text-neutral-600">
        A working tool where messy data goes in and structured output comes out on
command. It's real evidence of my Python and data-handling skills and of working
as part of an equal three-way split on a team although it's not frontend or web-app
work, but it sits in my portfolio as a different kind of evidence, not proof of the
"build and ship web apps" claim.
      </p>

      <a href="https://github.com/Chan-nie/space-mission-analysis" className="mt-8 inline-block rounded bg-brand px-4 py-2 text-white">
        View on GitHub
      </a>
    </main>
  );
}
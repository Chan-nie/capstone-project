import Image from "next/image";

export default function ConnectifyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Connectify</h1>
      <p className="mt-2 text-sm text-neutral-500">Semester team project (3 people) · Built via Lovable AI</p>

      <Image
        src="/images/connectify-match.jpg"
        alt="Connectify 'It's a Connection!' match screen"
        width={480}
        height={640}
        className="mt-6 rounded border"
      />

      <h2 className="mt-8 text-lg font-semibold">Problem</h2>
      <p className="mt-2 text-neutral-600">
        Most matching apps connect people who already share the same interests and
        background — that keeps people in the same social bubble with no real
        exposure to difference. My team of three wanted to build something that
        pushed against that: matching people across different interests and
        backgrounds, not just similar ones.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What I did</h2>
      <p className="mt-2 text-neutral-600">
        This was a last-minute team project. My role was frontend, but built through
        Lovable AI rather than hand-coded — I directed the build through prompting
        and iteration and prompted it to fix bugs. I didn't write or edit the
        underlying code directly, and I'm naming that plainly rather than implying
        otherwise.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Outcome</h2>
      <p className="mt-2 text-neutral-600">
        Connectify is a working app that helps users track how varied their
        connections are, instead of optimizing for sameness — the match screen
        above is that flow working end-to-end. It sits in my portfolio as secondary
        work, framed honestly as product-and-prompting work rather than
        hand-coded frontend, since that's what happened.
      </p>

      <a href="https://id-preview--86bdeb03-eaed-47b6-8518-358c59796fa9.lovable.app/" className="mt-8 inline-block rounded bg-brand px-4 py-2 text-white">
        Open Connectify
      </a>
    </main>
  );
}
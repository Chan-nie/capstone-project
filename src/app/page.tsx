import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="relative flex justify-center py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 select-none overflow-hidden whitespace-nowrap text-center font-cursive text-[20vw] leading-none text-rose-deep/10 sm:text-[9rem]"
        >
          Sinchan Suvarna
        </div>
        <Image
          src="/images/headshot.jpg"
          alt="Sinchan Suvarna"
          width={180}
          height={180}
          className="relative z-10 rounded-full object-cover shadow-soft"
          priority
        />
      </div>

      <p className="mt-8 font-mono text-xs uppercase tracking-widest text-serenity-deep">
        B.Tech CSE · 3rd year · Frontend AI Intern at FlyRank AI
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
        I can build and ship working web apps end-to-end.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-ink/70">
        proof lives on the live portfolio site.
      </p>
      <Link
        href="/projects"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-deep px-5 py-2.5 font-medium text-paper shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        View my projects
      </Link>
    </main>
  );
}
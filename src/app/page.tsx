import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="relative mx-auto flex flex-col items-center justify-center gap-4 py-10 sm:block sm:h-[180px]">
        <Image
          src="/images/headshot.jpg"
          alt="Sinchan Suvarna"
          width={180}
          height={180}
          className="relative mx-auto rounded-full object-cover shadow-soft sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
          priority
        />
        <div
          aria-hidden="true"
          className="pointer-events-none static order-2 flex select-none flex-col items-center justify-center gap-0 whitespace-nowrap font-cursive leading-none text-rose-deep/10 sm:absolute sm:left-1/2 sm:top-1/2 sm:w-screen sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex-row sm:justify-center sm:gap-8 md:gap-20 lg:gap-36"
          style={{ fontSize: "clamp(2rem, 10vw, 8rem)" }}
        >
          <span>Sinchan</span>
          <span>Suvarna</span>
        </div>
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
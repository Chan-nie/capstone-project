import Image from "next/image";
import Link from "next/link";
import ParticleField from "@/components/ParticleField";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <main className="relative mx-auto max-w-3xl px-4 py-24 text-center">
      <ParticleField className="opacity-90" />

      <div className="relative z-10">
        <div className="relative mx-auto flex flex-col items-center justify-center gap-4 py-10 sm:block sm:h-[180px]">
          <FadeIn distance={10} duration={1.1}>
            <Image
              src="/images/headshot.jpg"
              alt="Sinchan Suvarna"
              width={180}
              height={180}
              className="relative mx-auto rounded-full object-cover shadow-soft sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
              priority
            />
          </FadeIn>

          <div
            aria-hidden="true"
            className="pointer-events-none static order-2 flex select-none flex-col items-center justify-center gap-0 whitespace-nowrap font-cursive leading-none text-rose-deep/50 dark:text-paper/30 sm:absolute sm:left-1/2 sm:top-1/2 sm:w-screen sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex-row sm:justify-center sm:gap-8 md:gap-20 lg:gap-36"
            style={{ fontSize: "clamp(2rem, 10vw, 8rem)" }}
          >
            <span>Sinchan</span>
            <span>Suvarna</span>
          </div>
        </div>

        <FadeIn delay={0.15}>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-serenity-deep">
            B.Tech CSE · 3rd year · Frontend AI Intern at FlyRank AI
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            I can build and ship working web apps end-to-end.
          </h1>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            proof lives on the live portfolio site.
          </p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Link
            href="/projects"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-deep px-5 py-2.5 font-medium text-paper shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            View my projects
          </Link>
        </FadeIn>
      </div>
    </main>
  );
}
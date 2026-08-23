"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogClose,
} from "@/components/morphing-dialog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Project = {
  slug: string;
  name: string;
  meta: string;
  blurb: string;
  image: { src: string; alt: string; width: number; height: number };
  problem: string;
  whatIDid: string;
  outcome: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const projects: Project[] = [
  {
    slug: "space-mission-analysis-tool",
    name: "Space Mission Analysis Tool",
    meta: "Team of 3 · Python + pandas · Hand-coded, no AI",
    blurb:
      "Python + pandas CLI tool that turns messy mission data into clean, queryable output. Team of 3, equal split — I built the login flow and 10 of the 30 analysis functions.",
    image: {
      src: "/images/space-mission-cli.jpg",
      alt: "Space Mission Analysis Tool CLI menu",
      width: 800,
      height: 500,
    },
    problem:
      "Raw mission data is messy. We wanted a way to organize and filter it into clean, usable output without manually digging through it each time.",
    whatIDid:
      "Team of 3, built in Jupyter Notebook using Python. We split the work evenly where each person owned 10 numbered analysis tools, so a user could type in a number and get the corresponding clean output. I wrote analysis tools 1–10, plus the user login code, all hand-coded myself.",
    outcome:
      "A working tool where messy data goes in and structured output comes out on command. It's real evidence of my Python and data-handling skills and of working as part of an equal three-way split on a team — although it's not frontend or web-app work, it sits in my portfolio as a different kind of evidence, not proof of the \"build and ship web apps\" claim.",
    primaryHref: "https://github.com/Chan-nie/space-mission-analysis",
    primaryLabel: "View on GitHub",
    // no live deploy for this one — it's a CLI tool, not a web app
  },
  {
    slug: "connectify",
    name: "Connectify",
    meta: "Semester team project (3 people) · Built via Lovable AI",
    blurb:
      "A matching app built to push against social-bubble matching — tracks how varied your connections are instead of optimizing for sameness. Built through Lovable AI via prompting, not hand-coded.",
    image: {
      src: "/images/connectify-match.jpg",
      alt: "Connectify 'It's a Connection!' match screen",
      width: 480,
      height: 640,
    },
    problem:
      "Most matching apps connect people who are already sharing the same interests and with same background. That keeps people in the same social bubble with no real exposure to difference. As a part of my semester project, my team (2 others) and I wanted to build something that pushed against matching people across different interests and backgrounds, not just similar ones.",
    whatIDid:
      "This was a last-minute team project. My role was frontend but built through Lovable AI rather than hand coded. I built through prompting and iteration and prompted it to fix bugs. I didn't write or edit the underlying code directly.",
    outcome:
      "Connectify is a web app that helps users track how varied their connections are, instead of optimizing for sameness. It sits in my portfolio as secondary work, framed honestly as product-and-prompting work rather than hand-coded frontend, since that's what happened.",
    // live first — Lovable-generated code, the demo is the honest artifact here
    primaryHref: "https://connectify-friends-fun.vercel.app/login",
    primaryLabel: "Open Connectify",
    secondaryHref: "https://github.com/Chan-nie/connectify-friends-fun",
    secondaryLabel: "View Code",
  },
  {
    slug: "safecart",
    name: "SafeCart",
    meta: "Team of 3 · React, Firebase, Anthropic Vision API",
    blurb:
      "A food-safety scanner that personalizes product analysis to your health conditions and allergies using the Anthropic Vision API. Still in progress.",
    image: {
      src: "/images/safecart.jpg",
      alt: "SafeCart Homepage",
      width: 800,
      height: 500,
    },
    problem:
      "People with health conditions or food allergies often have to spend time checking ingredient lists and nutrition labels before buying a product. The information is there, but it is not always easy to understand quickly, especially while shopping.",
    whatIDid:
      "Team of 3, built as a web application using React, Firebase, and AI-powered analysis. We worked together on the overall product, with each person contributing to different parts of the app. I was involved in the design, frontend development, Firebase integration, and implementing features that provide personalized recommendations based on a user's health conditions and allergies. Users can select conditions like Diabetes, High Cholesterol, and Hypertension, along with allergies such as Dairy, Gluten, and Nuts, and receive tailored product insights.",
    outcome:
      "A working prototype that turns product information into clear, personalized guidance. Instead of manually checking every ingredient and nutrition label, users receive simple recommendations and warnings based on their profile. The project gave me experience working in a team while combining frontend development, databases, AI integration, and user-centered design to solve a real-world problem.",
    primaryHref: "https://safecart-kbchuq4v9-channie2.vercel.app",
    primaryLabel: "Open SafeCart",
    secondaryHref: "https://github.com/Chan-nie/safecart",
    secondaryLabel: "View Code",
  },
  {
    slug: "portfolio-site",
    name: "Portfolio Website",
    meta: "Personal site · HTML/CSS/JS · Built via AI from my own template",
    blurb:
      "My personal portfolio site, built by giving AI my own template and structure to implement, rather than hand-coding it myself.",
    image: {
      src: "/images/portfolio-preview.jpg",
      alt: "Portfolio site preview screenshot",
      width: 800,
      height: 500,
    },
    problem:
      "I needed a personal portfolio site live quickly. I already had a clear idea of the layout, sections, and content I wanted, I just needed it built out.",
    whatIDid:
      "I could have hand-coded this one myself, but instead I gave AI my own template and structure and had it implement the site from that. So unlike Connectify, where I prompted and iterated without a fixed structure in mind, here I directed the build against a plan I already had. I can walk through every section of the site and explain why it's built the way it is.",
    outcome:
      "The site is live on GitHub Pages, covers About, Skills, Projects, and Contact, and does its job. It's a different kind of AI collaboration than Connectify: template-first and directed, not open-ended prompting.",
    primaryHref: "https://chan-nie.github.io/portfolio/",
    primaryLabel: "Open Portfolio Site",
    secondaryHref: "https://github.com/Chan-nie/portfolio",
    secondaryLabel: "View Code",
  },
];

export default function ProjectsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        const depth = i % 2 === 0 ? 32 : -32;

        gsap.fromTo(
          card,
          { y: -depth },
          {
            y: depth,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-serenity-deep">
        Projects
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
        Projects
      </h1>
      <p className="mt-4 text-ink/70">
        Four cases — what the problem was, what I actually did, and what shipped.
      </p>

      <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            className={i % 2 === 1 ? "sm:mt-10" : ""}
          >
            <MorphingDialog
              transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
            >
              <MorphingDialogTrigger className="group relative block w-full overflow-hidden rounded-2xl border border-ink/10 bg-paper-raised p-5 text-left shadow-card transition-shadow hover:shadow-soft">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-deep to-serenity-deep"
                />
                <MorphingDialogTitle className="font-display text-xl font-medium text-ink">
                  {p.name}
                </MorphingDialogTitle>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-serenity-deep">
                  {p.meta}
                </p>
                <MorphingDialogDescription className="mt-2 text-sm text-ink/70">
                  {p.blurb}
                </MorphingDialogDescription>
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-ink/10 bg-gradient-to-b from-paper-raised to-serenity-deep/5">
                  <div className="p-6 sm:p-8">
                    <MorphingDialogTitle className="font-display text-3xl font-medium text-ink">
                      {p.name}
                    </MorphingDialogTitle>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wide text-serenity-deep">
                      {p.meta}
                    </p>

                    <div className="relative mt-6 flex h-56 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-deep/10 to-serenity-deep/15 sm:h-72">
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        fill
                        sizes="(min-width: 640px) 640px, 90vw"
                        className="object-contain p-4"
                      />
                    </div>

                    <h3 className="mt-8 flex items-center gap-2 text-lg font-semibold text-ink">
                      <span className="h-2 w-2 rounded-full bg-rose-deep" />
                      Problem
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-ink/70">
                      {p.problem}
                    </p>

                    <h3 className="mt-8 flex items-center gap-2 text-lg font-semibold text-ink">
                      <span className="h-2 w-2 rounded-full bg-serenity-deep" />
                      What I did
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-ink/70">
                      {p.whatIDid}
                    </p>

                    <h3 className="mt-8 flex items-center gap-2 text-lg font-semibold text-ink">
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-deep to-serenity-deep" />
                      Outcome
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-ink/70">
                      {p.outcome}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={p.primaryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-5 py-2.5 font-medium text-paper shadow-soft transition-transform hover:-translate-y-0.5"
                      >
                        {p.primaryLabel}
                      </a>
                      {p.secondaryHref && (
                        <a
                          href={p.secondaryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-serenity-deep/40 px-5 py-2.5 font-medium text-serenity-deep transition-colors hover:bg-serenity-deep/10"
                        >
                          {p.secondaryLabel}
                        </a>
                      )}
                    </div>
                  </div>

                  <MorphingDialogClose className="absolute right-4 top-4 rounded-full bg-ink/70 p-2 text-paper" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          </div>
        ))}
      </div>
    </main>
  );
}
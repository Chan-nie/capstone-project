"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StoryPanel = {
  chapter: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

const panels: StoryPanel[] = [
  {
    chapter: "Chapter 01",
    title: "6th Grade · Where It Started",
    text: "My first taste of coding was through Tynker in 6th grade. I honestly had no idea where it would lead, but making little things and watching them actually work was pretty cool. That was probably the moment I realized I really liked creating things with technology.",
    image: "/images/tynker.jpg",
    alt: "Tynker coding platform",
  },
  {
    chapter: "Chapter 02",
    title: "School Years · Getting Curious",
    text: "From Tynker, I slowly found my way to Khan Academy and other little coding experiments. I wasn't exactly following some master plan to become a CSE student 😭, I was just curious and kept wanting to learn what I could make next.",
    image: "/images/KA.jpg",
    alt: "Khan Academy coding platform",
  },
  {
    chapter: "Chapter 03",
    title: "2024 · Making It Official",
    text: "Then came B.Tech CSE at MAHE Dubai. This was when coding went from something I did because I enjoyed it to something I actually started taking seriously. Somewhere between assignments, projects and way too much debugging, I started figuring out what I actually enjoy building.",
    image: "/images/mahe-dxb.jpg",
    alt: "MAHE Dubai campus",
  },
  {
    chapter: "Chapter 04",
    title: "2025 · More Than Just Coding",
    text: "Joining GDG MAHE Dubai introduced me to a whole new side of tech. From writing content to helping with events and co-leading a Git & GitHub workshop, I got to learn, create and work with some really cool people along the way.",
    image: "/images/workshop-gdg.jpeg",
    alt: "GDG MAHE Dubai Git and GitHub workshop",
  },
  {
    chapter: "Chapter 05",
    title: "2026 · Taking Things Further",
    text: "I recently got to step into my first real AI + frontend internship at FlyRank. It was a chance to take everything I'd been learning and put it to work, while figuring out what kind of developer I actually want to become. Still exploring, still learning, still building and that's probably my favourite part.",
    image: "/images/dashboard.jpg",
    alt: "FlyRank dashboard",
  },
];

export default function HorizontalStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const dotRefs = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              panels.length - 1,
              Math.floor(self.progress * panels.length)
            );
            dotRefs.current.forEach((dot, i) => {
              const fill = dot.firstElementChild as HTMLElement;
              const value =
                i < idx ? 1 : i === idx ? self.progress * panels.length - idx : 0;
              gsap.to(fill, { scaleX: value, duration: 0.1, overwrite: true });
            });
          },
        },
      });

      panelRefs.current.forEach((panel) => {
        const copy = panel.querySelector(".panel-copy");
        if (!copy) return;
        gsap.fromTo(
          copy,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 70%",
              end: "left 30%",
              scrub: true,
            },
          }
        );
      });

      const imgs = Array.from(track.querySelectorAll("img"));
      let loaded = 0;
      imgs.forEach((img) => {
        if (img.complete) loaded++;
        else
          img.addEventListener(
            "load",
            () => {
              loaded++;
              if (loaded === imgs.length) ScrollTrigger.refresh();
            },
            { once: true }
          );
      });
      if (loaded === imgs.length) ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-ink"
    >
      <div ref={trackRef} className="flex h-full w-max">
        {panels.map((panel, i) => (
          <div
            key={panel.chapter}
            ref={(el) => {
              if (el) panelRefs.current[i] = el;
            }}
            className="grid h-screen w-screen flex-shrink-0 grid-cols-1 items-center gap-10 px-8 md:grid-cols-2 md:gap-[6vw] md:px-[8vw]"
          >
            <div className="relative flex h-[55vh] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-quartz/15 to-serenity/15 shadow-2xl md:h-[65vh]">
              <Image
                src={panel.image}
                alt={panel.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain p-4"
                priority={i === 0}
              />
            </div>

            <div className="panel-copy">
              <span className="mb-3 block font-mono text-xs uppercase tracking-[0.15em] text-rose-quartz">
                {panel.chapter}
              </span>
              <h2 className="mb-4 font-fraunces text-3xl font-semibold leading-tight text-paper md:text-4xl">
                {panel.title}
              </h2>
              <p className="max-w-[42ch] text-base leading-relaxed text-paper/70">
                {panel.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {panels.map((panel, i) => (
          <span
            key={panel.chapter}
            ref={(el) => {
              if (el) dotRefs.current[i] = el;
            }}
            className="relative h-[3px] w-7 overflow-hidden rounded-full bg-paper/20"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-rose-quartz" />
          </span>
        ))}
      </div>
    </section>
  );
}
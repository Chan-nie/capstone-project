"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextEffect } from "@/components/text-effect";

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

  // tracks which chapter is currently "active" so TextEffect only plays for that one
  const [activeIndex, setActiveIndex] = useState(0);
  // true only while this section is the pinned/active one — scopes the wheel hijack
  const isActiveRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      // measure the sticky navbar so the section can start exactly where it
      // naturally sits (just below the nav) instead of requiring a "dead" scroll first
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;

      // size the section to exactly fill the remaining viewport below the nav,
      // instead of a flat 100vh that overflows past the bottom by headerHeight
      section.style.height = `calc(100dvh - ${headerHeight}px)`;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      // n panels only need (n - 1) "steps" to move through — panel 1 is already
      // fully shown at progress 0, so the last panel is fully shown at progress 1,
      // not at (n-1)/n. This denominator is what the old Math.floor(progress * n) got wrong.
      const steps = panels.length - 1;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: () => `top ${headerHeight}`,
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / steps,
            duration: { min: 0.2, max: 0.5 },
            ease: "power1.inOut",
          },
          onEnter: () => (isActiveRef.current = true),
          onEnterBack: () => (isActiveRef.current = true),
          onLeave: () => (isActiveRef.current = false),
          onLeaveBack: () => (isActiveRef.current = false),
          onUpdate: (self) => {
            const idx = Math.round(self.progress * steps);

            dotRefs.current.forEach((dot, i) => {
              const fill = dot.firstElementChild as HTMLElement;
              const value =
                i < idx ? 1 : i === idx ? self.progress * steps - idx + 1 : 0;
              gsap.to(fill, {
                scaleX: Math.min(1, Math.max(0, value)),
                duration: 0.1,
                overwrite: true,
              });
            });

            // only update state when the active chapter actually changes —
            // onUpdate fires on every scrub frame, so this guard stops needless re-renders
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      // lets two-finger trackpad horizontal swipes drive the story too, not just
      // vertical scroll — only while this section is the pinned one
      const onWheel = (e: WheelEvent) => {
        if (!isActiveRef.current) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          window.scrollBy({ top: e.deltaX });
        }
      };
      window.addEventListener("wheel", onWheel, { passive: false });

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

      return () => {
        window.removeEventListener("wheel", onWheel);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

    return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink">
      <div ref={trackRef} className="flex h-full w-max">
        {panels.map((panel, i) => (
          <div
            key={panel.chapter}
            ref={(el) => {
              if (el) panelRefs.current[i] = el;
            }}
            className="flex h-full w-screen flex-shrink-0 flex-col items-center justify-center gap-3 overflow-hidden px-5 pb-16 pt-4 sm:gap-4 sm:px-8 sm:pb-14 md:grid md:grid-cols-2 md:items-center md:gap-[6vw] md:px-[8vw] md:pb-0 md:pt-0"
          >
            <div className="relative flex h-[28vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-quartz/15 to-serenity/15 shadow-xl sm:h-[38vh] md:h-[65vh] md:shadow-2xl">
              <Image
                src={panel.image}
                alt={panel.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain p-4"
                priority={i === 0}
              />
            </div>

            <div className="panel-copy w-full max-w-[40ch] text-center md:max-w-none md:text-left">
              <TextEffect
                per="char"
                preset="fade"
                trigger={activeIndex === i}
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-rose-quartz sm:mb-2 sm:text-xs md:mb-3"
              >
                {panel.chapter}
              </TextEffect>

              <TextEffect
                per="word"
                preset="slide"
                delay={0.15}
                trigger={activeIndex === i}
                className="mb-2 font-fraunces text-xl font-semibold leading-tight text-paper sm:text-2xl md:mb-4 md:text-4xl"
              >
                {panel.title}
              </TextEffect>

              <TextEffect
                per="line"
                preset="blur"
                delay={0.3}
                trigger={activeIndex === i}
                className="mx-auto max-w-[36ch] text-sm leading-relaxed text-paper/70 sm:text-base md:mx-0 md:max-w-[42ch]"
              >
                {panel.text}
              </TextEffect>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2 md:bottom-8">
        {panels.map((panel, i) => (
          <span
            key={panel.chapter}
            ref={(el) => {
              if (el) dotRefs.current[i] = el;
            }}
            className="relative h-[3px] w-5 overflow-hidden rounded-full bg-paper/20 sm:w-6 md:w-7"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-rose-quartz" />
          </span>
        ))}
      </div>
    </section>
  );
}
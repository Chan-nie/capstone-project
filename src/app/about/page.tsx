export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-serenity-deep">
        About
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
        About Me
      </h1>
      <p className="mt-4 text-ink/70">
        I'm Sinchan Suvarna, a third-year B.Tech CSE student at MAHE Dubai. I'm
        currently a Frontend AI Intern at FlyRank AI, learning to build real websites and
        exploring AI and cloud along the way. I recently completed a year as a Content
        Writing Core Team Member at Google Developer Groups, MAHE Dubai. I'm looking
        ahead to my next internship for July–August, remote-friendly but also open to
        onsite in UAE or Bangalore.
      </p>
      <p className="mt-6 text-ink/70">
        Want to talk internships?{" "}
        <a href="mailto:sinchan17suvarna@gmail.com" className="text-rose-deep underline">
          Email me
        </a>{" "}
        or grab{" "}
        <a
          href="https://drive.google.com/file/d/1cLBNHensod3jsrl2vo1ktH6CQka5SOjD/view?usp=sharing"
          className="text-rose-deep underline"
        >
          my resume
        </a>
        .
      </p>
    </main>
  );
}
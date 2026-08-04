import Image from "next/image";

export default function PortfolioSitePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Portfolio Website</h1>
      <p className="mt-2 text-sm text-neutral-500">Personal site · HTML/CSS/JS · Built via AI from my own template</p>

      <Image
        src="/images/portfolio-preview.jpg"
        alt="Portfolio site preview screenshot"
        width={800}
        height={500}
        className="mt-6 rounded border"
      />

      <h2 className="mt-8 text-lg font-semibold">Problem</h2>
      <p className="mt-2 text-neutral-600">
        I needed a personal portfolio site live quickly. I already had a clear
        idea of the layout, sections, and content I wanted, I just needed it
        built out.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What I did</h2>
      <p className="mt-2 text-neutral-600">
        I could have hand-coded this one myself, but instead I gave AI my own
        template and structure and had it implement the site from that. So
        unlike Connectify, where I prompted and iterated without a fixed
        structure in mind, here I directed the build against a plan I already
        had. I can walk through every section of the site and explain why
        it's built the way it is.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Outcome</h2>
      <p className="mt-2 text-neutral-600">
        The site is live on GitHub Pages, covers About, Skills, Projects, and
        Contact, and does its job. It's a different kind of AI collaboration
        than Connectify: template-first and directed, not open-ended
        prompting.
      </p>

      <a href="https://chan-nie.github.io/portfolio/" className="mt-8 inline-block rounded bg-brand px-4 py-2 text-white">
        Open Portfolio Site
      </a>
    </main>
  );
}
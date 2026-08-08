import "./globals.css";
import Link from "next/link";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata = { title: "Sinchan Suvarna - Portfolio" };

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/ai-analysis", label: "AI Chat" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh font-body text-ink">
        <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <span className="font-display text-lg font-semibold tracking-tight">
              Sinchan Suvarna
            </span>
            <ul className="flex items-center gap-6 font-mono text-xs uppercase tracking-wide text-ink/70">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-rose-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
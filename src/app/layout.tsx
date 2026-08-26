import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, Inter, JetBrains_Mono, Parisienne, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const parisienne = Parisienne({
  subsets: ["latin"],
  variable: "--font-parisienne",
  weight: "400",
});

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
    <html lang="en" className={cn(fraunces.variable, inter.variable, jetbrainsMono.variable, parisienne.variable, "font-sans", geist.variable, "dark")}>
      <body className="min-h-dvh font-body transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md transition-colors duration-300">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-3 px-4 py-3 sm:py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/S-favicon.jpg"
                alt="Sinchan Suvarna"
                width={32}
                height={32}
                className="rounded-lg transition-opacity hover:opacity-80"
              />
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
              <ul className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px] sm:text-xs uppercase tracking-wide text-foreground/70">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-rose-deep dark:hover:text-rose"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-l border-foreground/10 pl-3 sm:pl-4">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
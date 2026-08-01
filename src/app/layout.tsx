import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Sinchan Suvarna - Portfolio" };

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/ai-analysis", label: "AI Chat" }, // Add this line right here!
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <span className="font-semibold">Sinchan Suvarna</span>
            <ul className="flex gap-6 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">{l.label}</Link>
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
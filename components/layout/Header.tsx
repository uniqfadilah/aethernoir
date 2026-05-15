import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/art", label: "Art" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ siteTitle }: { siteTitle: string }) {
  return (
    <header className="relative z-20 border-b border-[var(--color-surface-2)]/60 bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl tracking-[0.4em] uppercase text-[var(--color-ink)] hover:text-[var(--color-gold)]"
        >
          {siteTitle}
        </Link>
        <nav>
          <ul className="flex items-center gap-8 text-sm tracking-[0.25em] uppercase text-[var(--color-muted)]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors duration-300 hover:text-[var(--color-gold)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

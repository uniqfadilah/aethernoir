"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/art", label: "Art" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ siteTitle }: { siteTitle: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header className="relative z-30 border-b border-[var(--color-surface-2)]/60 bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Link
          href="/"
          className="font-[var(--font-display)] text-base tracking-[0.3em] uppercase text-[var(--color-ink)] hover:text-[var(--color-gold)] sm:text-lg sm:tracking-[0.35em] md:text-xl md:tracking-[0.4em]"
        >
          {siteTitle}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm tracking-[0.25em] uppercase text-[var(--color-muted)] lg:gap-8">
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

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative z-40 flex h-10 w-10 flex-col items-center justify-center gap-[5px] border border-[var(--color-surface-2)] text-[var(--color-muted)] transition hover:text-[var(--color-gold)] md:hidden"
        >
          <span
            className={`h-[1px] w-5 bg-current transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1px] w-5 bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[1px] w-5 bg-current transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[57px] z-20 origin-top bg-[var(--color-bg)]/95 backdrop-blur transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="border-t border-[var(--color-surface-2)]/60">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 text-sm tracking-[0.3em] uppercase text-[var(--color-muted)]">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-4 transition-colors duration-300 hover:text-[var(--color-gold)] ${
                      active ? "text-[var(--color-gold)]" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

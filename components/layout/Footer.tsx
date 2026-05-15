import type { SiteSettings } from "../../lib/sanity/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-[var(--color-surface-2)]/60 py-8 sm:mt-32 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:px-6">
        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-muted)] sm:text-xs sm:tracking-[0.3em]">
          © {year} {settings?.siteTitle ?? "Aethernoir"}
        </p>
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-4 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-muted)] sm:gap-6 sm:text-xs sm:tracking-[0.3em]">
            {settings.socialLinks.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--color-gold)]"
                >
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}

import type { SiteSettings } from "../../lib/sanity/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-[var(--color-surface-2)]/60 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
          © {year} {settings?.siteTitle ?? "Aethernoir"}
        </p>
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <ul className="flex items-center gap-6 text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
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

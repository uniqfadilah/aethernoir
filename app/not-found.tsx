import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-32">
      <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
        404
      </p>
      <h1 className="mb-4 text-3xl tracking-[0.15em] sm:mb-6 sm:text-4xl sm:tracking-[0.2em]">
        Lost in the dark
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)] sm:mb-8 sm:text-base">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="border border-[var(--color-gold)]/40 px-5 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10 sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.3em]"
      >
        Kembali
      </Link>
    </div>
  );
}

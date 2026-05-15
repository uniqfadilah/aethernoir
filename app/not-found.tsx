import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
      <p className="mb-3 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
        404
      </p>
      <h1 className="mb-6 text-4xl tracking-[0.2em]">Lost in the dark</h1>
      <p className="mb-8 text-[var(--color-muted)]">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="border border-[var(--color-gold)]/40 px-6 py-3 text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10"
      >
        Kembali
      </Link>
    </div>
  );
}

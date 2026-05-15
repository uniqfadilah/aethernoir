"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "../../lib/sanity/client";
import type { ArtworkCard } from "../../lib/sanity/types";

type Props = {
  artworks: ArtworkCard[];
};

export function Carousel({ artworks }: Props) {
  const [index, setIndex] = useState(0);
  const total = artworks.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6500);
    return () => clearInterval(id);
  }, [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (total === 0) return null;

  return (
    <section
      className="vignette relative h-[78dvh] min-h-[520px] w-full overflow-hidden bg-[var(--color-surface)]"
      aria-roledescription="carousel"
      aria-label="Featured artworks"
    >
      {artworks.map((art, i) => {
        const src = urlForImage(art.image).width(1920).height(1200).fit("crop").url();
        const active = i === index;
        return (
          <div
            key={art._id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={src}
              alt={art.image.alt ?? art.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
              <p className="mb-3 text-xs tracking-[0.4em] uppercase text-[var(--color-gold)]">
                Featured Work
              </p>
              <h2 className="mb-4 text-3xl tracking-[0.18em] md:text-5xl">
                {art.title}
              </h2>
              {art.year || art.medium ? (
                <p className="mb-6 text-sm italic text-[var(--color-muted)]">
                  {[art.year, art.medium].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <Link
                href={`/art/${art.slug.current}`}
                className="inline-block border border-[var(--color-gold)]/50 px-6 py-3 text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] transition-all duration-500 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
              >
                View work
              </Link>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 border border-[var(--color-surface-2)] bg-[var(--color-bg)]/40 p-3 text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 border border-[var(--color-surface-2)] bg-[var(--color-bg)]/40 p-3 text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
            aria-label="Next slide"
          >
            →
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {artworks.map((a, i) => (
              <button
                key={a._id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[2px] w-10 transition-all ${
                  i === index
                    ? "bg-[var(--color-gold)]"
                    : "bg-[var(--color-muted)]/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

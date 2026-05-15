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
      className="vignette relative h-[60dvh] min-h-[380px] w-full overflow-hidden bg-[var(--color-surface)] sm:h-[70dvh] sm:min-h-[480px] md:h-[78dvh] md:min-h-[520px]"
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
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-12 sm:p-10 sm:pb-12 md:p-16">
              <p className="mb-2 text-[0.65rem] tracking-[0.35em] uppercase text-[var(--color-gold)] sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
                Featured Work
              </p>
              <h2 className="mb-3 text-2xl tracking-[0.14em] sm:mb-4 sm:text-3xl sm:tracking-[0.18em] md:text-5xl">
                {art.title}
              </h2>
              {art.year || art.medium ? (
                <p className="mb-4 text-xs italic text-[var(--color-muted)] sm:mb-6 sm:text-sm">
                  {[art.year, art.medium].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <Link
                href={`/art/${art.slug.current}`}
                className="inline-block border border-[var(--color-gold)]/50 px-5 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-gold)] transition-all duration-500 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.3em]"
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
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 border border-[var(--color-surface-2)] bg-[var(--color-bg)]/40 p-3 text-[var(--color-muted)] transition hover:text-[var(--color-gold)] sm:block md:left-4"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 border border-[var(--color-surface-2)] bg-[var(--color-bg)]/40 p-3 text-[var(--color-muted)] transition hover:text-[var(--color-gold)] sm:block md:right-4"
            aria-label="Next slide"
          >
            →
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
            {artworks.map((a, i) => (
              <button
                key={a._id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[2px] w-6 transition-all sm:w-10 ${
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

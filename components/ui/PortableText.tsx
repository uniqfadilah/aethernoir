import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 max-w-prose text-[var(--color-ink)]/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-3xl tracking-[0.12em]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-2xl tracking-[0.1em]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[var(--color-gold)] pl-6 italic text-[var(--color-muted)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const blank = (value as { blank?: boolean })?.blank ?? true;
      return (
        <a
          href={href}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className="underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-gold)]"
        >
          {children}
        </a>
      );
    },
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
    ),
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}

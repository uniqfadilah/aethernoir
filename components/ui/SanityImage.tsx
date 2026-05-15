import Image from "next/image";
import { urlForImage } from "../../lib/sanity/client";
import type { SanityImage as SanityImageT } from "../../lib/sanity/types";

type Props = {
  image: SanityImageT;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
};

export function SanityImage({
  image,
  alt,
  width = 1200,
  height,
  sizes,
  priority,
  className,
  fill,
}: Props) {
  if (!image?.asset) return null;
  let builder = urlForImage(image);
  if (width && !fill) builder = builder.width(width);
  if (height && !fill) builder = builder.height(height);
  const src = builder.url();
  const finalAlt = alt ?? image.alt ?? "";

  if (fill) {
    return (
      <Image
        src={src}
        alt={finalAlt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className={className}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={finalAlt}
      width={width}
      height={height ?? Math.round(width * 0.66)}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

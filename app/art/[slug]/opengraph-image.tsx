import { ImageResponse } from "next/og";
import { getArtworkBySlug } from "../../../lib/sanity/queries";
import { urlForImage } from "../../../lib/sanity/client";

export const runtime = "nodejs";
export const alt = "Aethernoir artwork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function OpengraphImage({ params }: { params: Params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug).catch(() => null);

  if (!artwork) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0807",
            color: "#ece6d8",
            fontSize: 64,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Aethernoir
        </div>
      ),
      size,
    );
  }

  const imageUrl = urlForImage(artwork.image)
    .width(1200)
    .height(630)
    .fit("crop")
    .url();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0807",
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,8,7,0.95) 0%, rgba(10,8,7,0.2) 60%, transparent 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 60,
            display: "flex",
            flexDirection: "column",
            color: "#ece6d8",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#b08d57",
              marginBottom: 14,
            }}
          >
            Aethernoir
          </div>
          <div
            style={{
              fontSize: 72,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {artwork.title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

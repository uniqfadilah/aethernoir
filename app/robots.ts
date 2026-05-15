import type { MetadataRoute } from "next";
import { env } from "../lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = env.SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

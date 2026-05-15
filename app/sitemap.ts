import type { MetadataRoute } from "next";
import { env } from "../lib/env";
import { getArtworkSlugs } from "../lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.SITE_URL.replace(/\/$/, "");
  const now = new Date();
  const slugs = await getArtworkSlugs().catch(() => []);

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/art`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...slugs.map((s) => ({
      url: `${base}/art/${s.slug}`,
      lastModified: new Date(s._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

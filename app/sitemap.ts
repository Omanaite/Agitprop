import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getGalleries } from "@/lib/data/galleries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const galleries = await getGalleries();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/agitprop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/akemi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const galleryRoutes: MetadataRoute.Sitemap = galleries.map((gallery) => ({
    url: `${siteUrl}/galleries/${gallery.slug}`,
    lastModified: gallery.created_at ? new Date(gallery.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...galleryRoutes];
}

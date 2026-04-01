import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getGalleries } from "@/lib/data/galleries";
import { getActiveArtistSlugs, getArtistTenantBySlug } from "@/lib/data/artist-tenants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [galleries, artistSlugs] = await Promise.all([
    getGalleries(),
    getActiveArtistSlugs(),
  ]);

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

  const artistRoutes: MetadataRoute.Sitemap = artistSlugs.map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Fetch each tenant's galleries in parallel; skip tenants that fail.
  const tenantGalleryResults = await Promise.all(
    artistSlugs.map(async (tenantSlug) => {
      try {
        const tenant = await getArtistTenantBySlug(tenantSlug);
        if (!tenant?.owner_user_id) return [];
        const tenantGalleries = await getGalleries(tenant.owner_user_id);
        return tenantGalleries.map((gallery) => ({
          url: `${siteUrl}/${tenantSlug}/gallery/${gallery.slug}`,
          lastModified: gallery.created_at ? new Date(gallery.created_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      } catch {
        return [];
      }
    })
  );

  const tenantGalleryRoutes: MetadataRoute.Sitemap = tenantGalleryResults.flat();

  return [...staticRoutes, ...artistRoutes, ...galleryRoutes, ...tenantGalleryRoutes];
}

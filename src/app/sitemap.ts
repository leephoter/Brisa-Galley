import { MetadataRoute } from 'next';
import { getArchives } from '@/lib/api/archives';
import { getPages } from '@/lib/api/pages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brisa.asia';
  const currentDate = new Date();

  // Fetch dynamic data
  const [archives, pages] = await Promise.all([
    getArchives().catch(() => []),
    getPages().catch(() => []),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic archive pages
  const archivePages: MetadataRoute.Sitemap = archives.map((archive) => ({
    url: `${baseUrl}/archive/${archive.slug}`,
    lastModified: archive.updated_at ? new Date(archive.updated_at) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic pages (place, news, call)
  const dynamicPages: MetadataRoute.Sitemap = pages
    .filter((page) => page.is_published)
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticPages, ...archivePages, ...dynamicPages];
}

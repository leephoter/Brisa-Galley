import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://brisa-galley.vercel.app/sitemap.xml',
    host: 'https://brisa-galley.vercel.app',
  };
}

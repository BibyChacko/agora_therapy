import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { siteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const staticPages = [
    '',
    '/about',
    '/services',
    '/psychologists',
    '/online-counselling-dubai',
    '/anxiety-therapy-dubai',
    '/couples-therapy-dubai',
    '/blog',
    '/faq',
    '/contact',
    '/sexual-health-support',
    '/privacy',
    '/terms',
    '/yoga-for-mental-health',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  let therapistRoutes: MetadataRoute.Sitemap = [];
  try {
    const therapists = await getPublicTherapists();
    therapistRoutes = therapists.map((therapist) => ({
      url: `${baseUrl}/psychologists/${therapist.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating therapist routes for sitemap:', error);
  }

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes, 
    ...therapistRoutes, 
    ...blogRoutes
  ];
}

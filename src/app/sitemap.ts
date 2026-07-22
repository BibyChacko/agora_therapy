import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { LANGUAGES } from '@/lib/constants/languages';
import { siteUrl } from '@/lib/seo';
import { AVAILABLE_SERVICES } from '@/types/models/service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const staticPages = [
    '',
    '/about',
    '/clinical-standards',
    '/how-we-verify-therapists',
    '/editorial-policy',
    '/medical-review-policy',
    '/sources-referencing-policy',
    '/crisis-emergency-help',
    '/services',
    '/psychologists',
    '/languages',
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
  let filteredDirectoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const therapists = await getPublicTherapists();
    therapistRoutes = therapists.map((therapist) => ({
      url: `${baseUrl}/psychologists/${therapist.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    const availableLanguageCodes = new Set<string>();
    const availableServiceIds = new Set<string>();

    therapists.forEach((therapist) => {
      therapist.languages.forEach((languageCode) => {
        availableLanguageCodes.add(languageCode);
      });

      therapist.specializations.forEach((serviceId) => {
        availableServiceIds.add(serviceId);
      });
    });

    const languageRoutes = LANGUAGES
      .filter((language) => availableLanguageCodes.has(language.code))
      .map((language) => ({
        url: `${baseUrl}/psychologists?language=${encodeURIComponent(language.code)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    const specializationRoutes = AVAILABLE_SERVICES
      .filter((service) => service.isActive && availableServiceIds.has(service.id))
      .map((service) => ({
        url: `${baseUrl}/psychologists?specialization=${encodeURIComponent(service.id)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    filteredDirectoryRoutes = [...languageRoutes, ...specializationRoutes];
  } catch (error) {
    console.error('Error generating therapist routes for sitemap:', error);
  }

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.lastReviewedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes, 
    ...filteredDirectoryRoutes,
    ...therapistRoutes, 
    ...blogRoutes
  ];
}

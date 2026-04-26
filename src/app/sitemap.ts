import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mindgood.life';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/psychologists',
    '/blog',
    '/faq',
    '/contact',
    '/sexual-health-support',
  ];

  // Language codes for multilingual support
  const languages = [
    'en', 'hi', 'ta', 'te', 'ml', 'kn', 'mr', 'gu', 'bn', 'pa',
    'ur', 'si', 'de', 'es', 'fr', 'it'
  ];

  // 1. Generate Static Routes with language alternates
  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        languages.map(lang => [lang, `${baseUrl}${lang === 'en' ? '' : `/${lang}`}${route}`])
      ),
    },
  }));

  // 2. Fetch and Generate Dynamic Psychologist Routes
  let therapistRoutes: MetadataRoute.Sitemap = [];
  try {
    const therapists = await getPublicTherapists();
    therapistRoutes = therapists.map((therapist) => ({
      url: `${baseUrl}/psychologist/${therapist.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
      // Note: If you add multilingual support for therapist profiles later, add alternates here
    }));
  } catch (error) {
    console.error('Error generating therapist routes for sitemap:', error);
  }

  // 3. Generate Dynamic Blog Routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 4. Generate Additional Language-Specific Static Routes (if needed)
  // These are handled by 'alternates' in staticRoutes, but Google often likes explicit entries
  const languageRoutes = languages
    .filter(lang => lang !== 'en')
    .flatMap(lang => 
      staticPages.map(route => ({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 0.9 : 0.7,
      }))
    );

  return [
    ...staticRoutes, 
    ...therapistRoutes, 
    ...blogRoutes, 
    ...languageRoutes
  ];
}

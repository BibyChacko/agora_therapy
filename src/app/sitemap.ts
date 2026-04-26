import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/data/blogPosts';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mindgood.life';
  
  // Define all core static routes
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

  // Supported language codes
  const languages = [
    'en', 'hi', 'ta', 'te', 'ml', 'kn', 'mr', 'gu', 'bn', 'pa',
    'ur', 'si', 'de', 'es', 'fr', 'it'
  ];

  /**
   * Helper to generate x-default and language alternate mappings for a route.
   * This is critical for resolving "No referring sitemaps" and localized indexing issues.
   */
  const getAlternates = (route: string) => {
    const langs = Object.fromEntries(
      languages.map(lang => [
        lang, 
        `${baseUrl}${lang === 'en' ? '' : `/${lang}`}${route}`
      ])
    );
    
    // Add x-default pointing to the English version
    return {
      languages: {
        ...langs,
        'x-default': `${baseUrl}${route}`,
      },
    };
  };

  // 1. Generate Localized Static Routes
  // We generate an entry for every language-route combination.
  // Each entry includes full alternate links to all other localized versions.
  const staticRoutes = languages.flatMap((lang) => 
    staticPages.map((route) => {
      const isEn = lang === 'en';
      const path = isEn ? route : `/${lang}${route}`;
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? (isEn ? 1.0 : 0.9) : (isEn ? 0.8 : 0.7),
        alternates: getAlternates(route),
      };
    })
  );

  // 2. Fetch and Generate Dynamic Psychologist Routes
  let therapistRoutes: MetadataRoute.Sitemap = [];
  try {
    const therapists = await getPublicTherapists();
    therapistRoutes = therapists.map((therapist) => ({
      url: `${baseUrl}/psychologist/${therapist.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
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

  return [
    ...staticRoutes, 
    ...therapistRoutes, 
    ...blogRoutes
  ];
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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
    '/yoga-for-mental-health',
    '/sexual-health-support',
  ];

  // Language codes for multilingual support
  const languages = [
    'en', 'hi', 'ta', 'te', 'ml', 'kn', 'mr', 'gu', 'bn', 'pa',
    'ur', 'si', 'de', 'es', 'fr', 'it'
  ];

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

  // Add language-specific routes
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

  return [...staticRoutes, ...languageRoutes];
}

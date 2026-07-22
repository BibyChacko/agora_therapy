import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mindgood.life';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/client/',
          '/therapist/',
          '/api/',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

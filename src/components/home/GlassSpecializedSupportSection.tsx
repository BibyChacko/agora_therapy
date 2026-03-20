"use client";

import Link from "next/link";

type SupportCategory = 'crisis' | 'relationships' | 'intimacy' | 'mindfulness';

interface CategoryData {
  id: SupportCategory;
  label: string;
  icon: string;
  gradient: string;
  title: string;
  subtitle: string;
  description: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  image: string;
  cta: { text: string; href: string };
  stats?: { value: string; label: string }[];
}

export function GlassSpecializedSupportSection() {
  const categories: CategoryData[] = [
    {
      id: 'crisis',
      label: 'Crisis Support',
      icon: '🆘',
      gradient: 'from-indigo-600 to-cyan-600',
      title: 'A Helping Hand',
      subtitle: 'When You Need It Most',
      description: 'Life can feel overwhelming. Whether you\'re dealing with stress, anxiety, depression, or just need someone to talk to, we\'re here to support you every step of the way.',
      features: [
        { icon: '🌙', title: 'Crisis Support', desc: 'Immediate help when you need it most' },
        { icon: '🧘', title: 'Stress Management', desc: 'Learn coping strategies that work' },
        { icon: '💭', title: 'Anxiety Relief', desc: 'Overcome worry and find peace' },
        { icon: '🌻', title: 'Depression Care', desc: 'Professional support for healing' }
      ],
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop',
      cta: { text: 'Get Support Now', href: '/psychologists' }
    },
    {
      id: 'relationships',
      label: 'Relationships',
      icon: '💑',
      gradient: 'from-pink-600 to-purple-600',
      title: 'Strengthen Your',
      subtitle: 'Relationships',
      description: 'Whether you\'re navigating challenges in your romantic relationship, family dynamics, or friendships, our experienced therapists provide compassionate support.',
      features: [
        { icon: '💑', title: 'Couples Counseling', desc: 'Rebuild trust and communication' },
        { icon: '👨‍👩‍👧‍👦', title: 'Family Therapy', desc: 'Heal family relationships' },
        { icon: '🤝', title: 'Communication Skills', desc: 'Learn healthy dialogue patterns' },
        { icon: '💔', title: 'Breakup Support', desc: 'Navigate separation with care' }
      ],
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop',
      cta: { text: 'Start Relationship Therapy', href: '/services' },
      stats: [{ value: '5000+', label: 'Couples Helped' }]
    },
    {
      id: 'intimacy',
      label: 'Sexual Health',
      icon: '🌹',
      gradient: 'from-rose-600 to-pink-600',
      title: 'Sexual Health &',
      subtitle: 'Intimacy Support',
      description: 'A safe, confidential space to discuss sexual health, intimacy concerns, and relationship dynamics with specialized therapists who understand.',
      features: [
        { icon: '✓', title: 'Sexual dysfunction and concerns', desc: '' },
        { icon: '✓', title: 'Intimacy and relationship issues', desc: '' },
        { icon: '✓', title: 'LGBTQ+ affirming therapy', desc: '' },
        { icon: '✓', title: 'Trauma-informed sexual health care', desc: '' },
        { icon: '✓', title: 'Communication about intimacy', desc: '' },
        { icon: '✓', title: 'Body image and self-esteem', desc: '' }
      ],
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
      cta: { text: 'Learn More', href: '/sexual-health-support' },
      stats: [
        { value: '100%', label: 'Confidential' },
        { value: 'Safe', label: 'Judgment-Free' }
      ]
    },
    {
      id: 'mindfulness',
      label: 'Mindfulness',
      icon: '🧘‍♀️',
      gradient: 'from-purple-600 to-teal-600',
      title: 'Where Sustainability',
      subtitle: 'Meets Meditation',
      description: 'Discover the perfect balance between mental wellness and personal growth. Our holistic approach combines traditional therapy with mindfulness practices.',
      features: [
        { icon: '🧘', title: 'Guided Meditation', desc: 'Expert-led sessions for all levels' },
        { icon: '🌿', title: 'Mindfulness Training', desc: 'Build present-moment awareness' },
        { icon: '💆', title: 'Stress Relief', desc: 'Evidence-based relaxation techniques' },
        { icon: '✨', title: 'Personal Growth', desc: 'Transform your mental wellness' }
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=800&fit=crop',
      cta: { text: 'Start Doing Today', href: '/services' },
      stats: [{ value: '5k+', label: 'Active Members' }]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Specialized Support for Every Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Discover how we can help you thrive with our specialized mental health services
            </p>
            <Link
              href="/specialized-support"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all duration-300"
            >
              View All Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Row - Crisis Support (Large) */}
            <Link
              href={categories[0].cta.href}
              className="group relative overflow-hidden rounded-3xl h-80 md:h-96"
            >
              <img
                src={categories[0].image}
                alt={categories[0].label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white font-bold text-3xl md:text-4xl mb-2">
                  {categories[0].label}
                </h3>
                <p className="text-white/90 text-base md:text-lg max-w-md">
                  {categories[0].description}
                </p>
              </div>
            </Link>

            {/* Top Row - Relationships (Medium) */}
            <Link
              href={categories[1].cta.href}
              className="group relative overflow-hidden rounded-3xl h-80 md:h-96 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60"
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-gray-900 dark:text-white font-bold text-3xl md:text-4xl mb-2">
                  {categories[1].label}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-md">
                  {categories[1].description}
                </p>
              </div>
            </Link>

            {/* Bottom Row - Sexual Health (Medium with beige bg) */}
            <Link
              href={categories[2].cta.href}
              className="group relative overflow-hidden rounded-3xl h-64 md:h-80 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-gray-900 dark:text-white font-bold text-3xl md:text-4xl mb-2">
                  {categories[2].label}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-md">
                  {categories[2].description}
                </p>
              </div>
            </Link>

            {/* Bottom Row - Mindfulness (Large with image) */}
            <Link
              href={categories[3].cta.href}
              className="group relative overflow-hidden rounded-3xl h-64 md:h-80"
            >
              <img
                src={categories[3].image}
                alt={categories[3].label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-white font-bold text-3xl md:text-4xl mb-2">
                  {categories[3].label}
                </h3>
                <p className="text-white/90 text-base md:text-lg max-w-md">
                  {categories[3].description}
                </p>
              </div>
            </Link>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Licensed Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

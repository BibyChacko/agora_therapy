import { Metadata } from 'next';
import { GlassSpecializedSupportSection } from '@/components/home/GlassSpecializedSupportSection';

export const metadata: Metadata = {
  title: 'Specialized Mental Health Support | Crisis, Relationships, Intimacy & Mindfulness',
  description: 'Get specialized mental health support tailored to your needs. Expert help for crisis situations, relationship counseling, sexual health & intimacy, and mindfulness practices. Available 24/7 in 50+ languages.',
  keywords: [
    'crisis support',
    'mental health crisis',
    'relationship counseling',
    'couples therapy',
    'family therapy',
    'sexual health therapy',
    'intimacy counseling',
    'LGBTQ+ therapy',
    'mindfulness therapy',
    'meditation therapy',
    'stress management',
    'anxiety relief',
    'depression support',
    'trauma therapy',
    'online therapy',
    'virtual counseling'
  ],
  openGraph: {
    title: 'Specialized Mental Health Support - MindGood',
    description: 'Expert mental health support for crisis situations, relationships, intimacy, and mindfulness. Licensed therapists available 24/7.',
    type: 'website',
    url: 'https://mindgood.life/specialized-support',
    images: [
      {
        url: 'https://mindgood.life/og-specialized-support.jpg',
        width: 1200,
        height: 630,
        alt: 'Specialized Mental Health Support Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Specialized Mental Health Support - MindGood',
    description: 'Expert help for crisis, relationships, intimacy & mindfulness. Available 24/7.',
    images: ['https://mindgood.life/og-specialized-support.jpg']
  },
  alternates: {
    canonical: 'https://mindgood.life/specialized-support'
  }
};

export default function SpecializedSupportPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: 'Specialized Mental Health Support Services',
            description: 'Comprehensive mental health support including crisis intervention, relationship counseling, sexual health therapy, and mindfulness practices.',
            url: 'https://mindgood.life/specialized-support',
            mainEntity: {
              '@type': 'MedicalBusiness',
              name: 'MindGood',
              description: 'Online mental health platform providing specialized therapy services',
              telephone: '+971505134930',
              availableService: [
                {
                  '@type': 'MedicalTherapy',
                  name: 'Crisis Support',
                  description: 'Immediate mental health crisis intervention and support'
                },
                {
                  '@type': 'MedicalTherapy',
                  name: 'Relationship Counseling',
                  description: 'Couples therapy, family therapy, and relationship support'
                },
                {
                  '@type': 'MedicalTherapy',
                  name: 'Sexual Health & Intimacy Therapy',
                  description: 'Confidential sexual health counseling and intimacy support'
                },
                {
                  '@type': 'MedicalTherapy',
                  name: 'Mindfulness & Meditation Therapy',
                  description: 'Mindfulness-based stress reduction and meditation practices'
                }
              ],
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday'
                ],
                opens: '00:00',
                closes: '23:59'
              }
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://mindgood.life'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Specialized Support',
                  item: 'https://mindgood.life/specialized-support'
                }
              ]
            }
          })
        }}
      />

      {/* Hero Poster Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl mx-4 md:mx-8 mt-8">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=800&fit=crop"
          alt="Counseling and Therapy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
          <p className="text-teal-200 text-sm md:text-base font-medium mb-4">Alief</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Counseling and<br />Therapy services
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-md">
            Committed to providing a safe and nurturing space for you.
          </p>
          <div>
            <a
              href="/psychologists"
              className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Your Path to Wellness Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Your Path<br />to Wellness
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Explore your inner world and gain insights
                </p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  We believe in the transformative power of therapy. Our compassionate team of experienced therapists 
                  is here to guide you on your journey toward healing, growth, and self-discovery.
                </p>
                <a
                  href="/psychologists"
                  className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
                >
                  Book Appointment
                </a>
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Couples Therapy */}
              <div className="group bg-teal-50 dark:bg-teal-900/20 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">15-60 • Family</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Couples Therapy</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Strengthen your relationship and communication
                  </p>
                </div>
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop"
                    alt="Couples Therapy"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Anger Management */}
              <div className="group bg-orange-50 dark:bg-orange-900/20 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">All • Group</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Anger Management</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Improve communication and develop your connection
                  </p>
                </div>
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop"
                    alt="Anger Management"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Teenage Sessions */}
              <div className="group bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">12-21 • Teens</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Teenage Sessions</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Support and guide your toward a brighter tomorrow
                  </p>
                </div>
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
                    alt="Teenage Sessions"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Addiction Therapy */}
              <div className="group bg-amber-50 dark:bg-amber-900/20 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">18-60 • Private</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Addiction Therapy</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Confidential space for self-reflection and growth
                  </p>
                </div>
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop"
                    alt="Addiction Therapy"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

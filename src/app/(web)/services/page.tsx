import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { AVAILABLE_SERVICES } from '@/types/models/service';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { getLanguageName } from '@/lib/constants/languages';

// Comprehensive Metadata for SEO
export const metadata = {
  title: 'Psychology & Therapy Services in UAE | Multilingual Support | MindGood',
  description: 'MindGood offers specialized online therapy in UAE. Our licensed psychologists provide support for anxiety, depression, digital burnout, imposter syndrome, relationship issues, and more in 60+ languages.',
  keywords: 'online therapy uae, psychologists in dubai, digital well-being uae, imposter syndrome counseling, eco-anxiety support, hustle culture burnout, malayalam speaking psychologists, hindi therapy uae, anxiety treatment dubai',
  alternates: {
    canonical: 'https://mindgood.life/services',
  },
  openGraph: {
    title: 'Professional Therapy Services | MindGood',
    description: 'Specialized mental health support in your language. Connect with licensed psychologists online across the UAE.',
    url: 'https://mindgood.life/services',
    siteName: 'MindGood',
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mental Health Services in UAE | MindGood',
    description: 'Multilingual therapy support with licensed psychologists.',
  },
};

export default async function ServicesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || '';

  const services = AVAILABLE_SERVICES.filter(s => s.isActive);
  
  const filteredServices = query 
    ? services.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        s.detailedDescription?.toLowerCase().includes(query) ||
        s.helpPoints?.some(p => p.toLowerCase().includes(query))
      )
    : services;

  // Pre-fetch therapists for each service to avoid waterfall (top 6 for each)
  const therapistsByService = await Promise.all(
    filteredServices.map(async (service) => {
      const therapists = await getPublicTherapists({ specialization: service.id });
      return { serviceId: service.id, therapists: therapists.slice(0, 6) };
    })
  ).then(results => 
    results.reduce((acc, curr) => ({ ...acc, [curr.serviceId]: curr.therapists }), {} as Record<string, any[]>)
  );

  // JSON-LD for Medical Services
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "MindGood Therapy Services",
    "description": "Specialized mental health services provided by licensed psychologists in the UAE.",
    "medicalSpecialty": filteredServices.map(s => s.name),
    "provider": {
      "@type": "MedicalOrganization",
      "name": "MindGood",
      "url": "https://mindgood.life"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredServices.map((service, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": service.name,
          "description": service.description,
          "provider": {
            "@type": "MedicalOrganization",
            "name": "MindGood"
          },
          "serviceType": "Psychological Counseling",
          "areaServed": "United Arab Emirates",
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": `https://mindgood.life/services#${service.id}`,
            "name": "Online Video Session"
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      {/* Structured Data for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* AEO Optimized Hidden Section - Answers direct queries from AI agents */}
      <section className="sr-only" aria-hidden="true">
        <h2>Expert Answers about our Mental Health Services</h2>
        {filteredServices.map(service => (
          <article key={`aeo-${service.id}`}>
            <h3>What is {service.name} therapy at MindGood?</h3>
            <p>{service.detailedDescription || service.description}</p>
            <h3>What are the benefits of MindGood's {service.name} support?</h3>
            <ul>
              {service.helpPoints?.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
            <p>
              We provide {service.name} specialists who speak multiple languages including 
              English, Arabic, Hindi, and Malayalam to serve the diverse UAE community.
            </p>
          </article>
        ))}
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <header>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">
              Our Specialized Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Professional mental health support tailored to your unique needs, 
              delivered by culturally-aware specialists who speak your language.
            </p>
          </header>
          
          <form action="/services" method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search services (e.g., anxiety, couples therapy...)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>
            {query && (
              <p className="mt-4 text-sm text-gray-500 font-medium">
                Showing {filteredServices.length} results for "{query}"
              </p>
            )}
          </form>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                No services found matching your search.
              </p>
              <Link
                href="/services"
                className="px-8 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-32">
            {filteredServices.map((service, index) => {
              const relatedTherapists = therapistsByService[service.id] || [];
              
              return (
                <section 
                  key={service.id} 
                  id={service.id}
                  className="scroll-mt-32"
                >
                  <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={`space-y-8 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                      <div className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest">
                        {service.category.replace('-', ' ')}
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {service.name}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        {service.detailedDescription || service.description}
                      </p>
                      
                      {service.helpPoints && service.helpPoints.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">How We Help:</h3>
                          <ul className="grid gap-3">
                            {service.helpPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 rounded-full bg-teal-600" />
                                </div>
                                <span className="font-medium">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="pt-6">
                        <Link 
                          href={`/psychologists?specialization=${service.id}`}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-black hover:scale-105 transition-all shadow-xl"
                        >
                          Find {service.name} Specialists
                          <FiArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className={`relative ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                      {/* Related Therapists Collage */}
                      {relatedTherapists.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {relatedTherapists.map((therapist) => (
                            <Link 
                              key={therapist.id}
                              href={`/psychologists/${therapist.id}`}
                              className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg"
                            >
                              <Image 
                                src={therapist.image} 
                                alt={therapist.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white font-bold text-sm leading-tight">
                                  {therapist.name}
                                </p>
                                <p className="text-white/70 text-[10px] font-medium mt-1">
                                  {therapist.languages.map(getLanguageName).slice(0, 2).join(', ')}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                          <p className="text-gray-400 font-medium italic text-center px-8">
                            Our team of specialists is ready to support you.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
        
        {/* CTA Section */}
        <div className="mt-32 mb-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300/20 rounded-full -ml-32 -mb-32 blur-2xl" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Ready to find your peace?
            </h2>
            <p className="text-xl mb-12 text-teal-50 opacity-90 leading-relaxed">
              Connect with a therapist who truly understands you. 
              No waiting lists, just professional care in your own language.
            </p>
            <Link 
              href="/psychologists"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-teal-600 rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl"
            >
              Start Your Journey
              <FiArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

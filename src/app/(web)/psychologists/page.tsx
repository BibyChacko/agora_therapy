import { Suspense } from 'react';
import { Metadata } from 'next';
import PsychologistFilters from '@/components/psychologists/PsychologistFilters';
import { TherapistCard } from '@/components/psychologists/TherapistCard';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { getLanguageName, LANGUAGES } from '@/lib/constants/languages';
import { getServiceById, AVAILABLE_SERVICES } from '@/types/models/service';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  const specializationCode = params.specialization;
  const languageCode = params.language;
  const location = params.location || 'Dubai'; // Default to Dubai for UAE focus
  
  const specializationName = specializationCode ? getServiceById(specializationCode)?.name : '';
  const languageName = languageCode ? getLanguageName(languageCode) : '';
  
  const therapists = await getPublicTherapists({
    specialization: specializationCode,
    language: languageCode,
    minExperience: params.minExperience,
  });

  const therapistNames = therapists.slice(0, 5).map(t => t.name).join(", ");
  
  // Dynamic Title Logic
  let title = "Licensed Online Psychologists & Therapists in UAE | MindGood";
  if (languageName && specializationName) {
    title = `${languageName} ${specializationName} Specialists in ${location} | MindGood`;
  } else if (languageName) {
    title = `${languageName} Speaking Psychologists in ${location}, UAE | MindGood`;
  } else if (specializationName) {
    title = `Expert ${specializationName} Therapy in ${location} | MindGood`;
  }

  // Dynamic Description Logic
  let description = `Connect with ${therapists.length || 20}+ verified psychologists and therapists in ${location}. We offer specialized mental health support in ${languageName || 'English, Malayalam, Hindi, Arabic, and 50+ languages'}. Affordable sessions for GenZ and expats.`;
  
  if (therapists.length > 0) {
    description = `Book an appointment with top-rated ${languageName || ''} therapists in ${location} like ${therapistNames}. Specialized support for ${specializationName || 'anxiety, stress, and relationships'}. Safe and confidential.`;
  }

  return {
    title,
    description,
    keywords: [
      `${languageName || ''} psychologists ${location}`,
      `${specializationName || ''} therapy ${location}`,
      "online therapy UAE", 
      "expat mental health Dubai", 
      "Malayalam therapy Dubai",
      "Tamil counseling UAE",
      "affordable psychologist Dubai",
      ...therapists.slice(0, 3).map(t => t.name)
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `https://mindgood.life/psychologists${languageCode ? `?language=${languageCode}` : ''}${specializationCode ? `&specialization=${specializationCode}` : ''}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://mindgood.life/psychologists`,
      locale: 'en_AE',
    }
  };
}

async function TherapistsList({ searchParams }: { searchParams: any }) {
  const therapists = await getPublicTherapists({
    specialization: searchParams.specialization,
    language: searchParams.language,
    minExperience: searchParams.minExperience,
  });

  if (therapists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No therapists found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {therapists.map((therapist) => (
        <TherapistCard key={therapist.id} therapist={therapist} />
      ))}
    </div>
  );
}

export default async function PsychologistsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const therapists = await getPublicTherapists({
    specialization: params.specialization,
    language: params.language,
    minExperience: params.minExperience,
  });

  // JSON-LD structured data for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": "https://mindgood.life/psychologists#webpage",
        "name": "Licensed Psychologists & Online Therapy in UAE",
        "description": "Directory of verified psychologists and therapists providing online counseling in 60+ languages across the UAE and globally.",
        "medicalSpecialty": AVAILABLE_SERVICES.map(s => s.name),
        "areaServed": [
          { "@type": "City", "name": "Dubai" },
          { "@type": "City", "name": "Abu Dhabi" },
          { "@type": "City", "name": "Sharjah" },
          { "@type": "Country", "name": "United Arab Emirates" },
          { "@type": "Country", "name": "India" },
          { "@type": "City", "name": "Singapore" },
          { "@type": "City", "name": "London" }
        ],
        "knowsLanguage": LANGUAGES.map(l => l.name)
      },
      {
        "@type": "ItemList",
        "name": "Verified Therapists in UAE",
        "numberOfItems": therapists.length,
        "itemListElement": therapists.slice(0, 15).map((t, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Physician",
            "name": t.name,
            "description": t.bio,
            "image": t.image,
            "medicalSpecialty": t.specializations.map(spec => getServiceById(spec)?.name || spec),
            "knowsLanguage": t.languages.map(getLanguageName),
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "UAE"
            }
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Find Your Therapist in UAE
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Affordable, verified, and culturally-aware mental health support for expats. 
            Connect with specialists who speak your language.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PsychologistFilters 
              initialFilters={{
                specialization: params.specialization || '',
                language: params.language || '',
                minExperience: params.minExperience || '',
                location: params.location || '',
              }} 
            />
          </div>

          {/* Therapists Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Loading therapists...</p>
                </div>
              </div>
            }>
              <TherapistsList searchParams={params} />
            </Suspense>
          </div>
        </div>

        {/* SEO Enrichment Section (Hidden visually but accessible to crawlers) */}
        <section className="mt-20 sr-only" aria-hidden="true">
          <h2>Specialized Therapy Services in UAE</h2>
          <ul>
            {AVAILABLE_SERVICES.map(s => (
              <li key={s.id}>{s.name}: {s.description}</li>
            ))}
          </ul>
          <h2>Therapists speaking multiple languages</h2>
          <ul>
            {LANGUAGES.map(l => (
              <li key={l.code}>{l.name} {l.nativeName ? `(${l.nativeName})` : ''}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

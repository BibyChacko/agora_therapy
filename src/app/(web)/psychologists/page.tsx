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
  
  const specializationName = specializationCode ? getServiceById(specializationCode)?.name : '';
  const languageName = languageCode ? getLanguageName(languageCode) : '';
  
  const therapists = await getPublicTherapists({
    specialization: specializationCode,
    language: languageCode,
    minExperience: params.minExperience,
  });

  const therapistNames = therapists.slice(0, 5).map(t => t.name).join(", ");
  
  let title = "Affordable Multilingual Therapists in UAE | MindGood";
  let description = "Find verified psychologists and therapists in the UAE. We offer affordable mental health consultations in English, Arabic, Malayalam, Hindi, and more. Specifically designed for expats.";

  if (therapists.length > 0) {
    const filterContext = specializationName || languageName 
      ? ` for ${specializationName || ''} ${languageName ? `in ${languageName}` : ''}`
      : '';
    description = `Connect with ${therapists.length}+ verified therapists${filterContext} like ${therapistNames} in the UAE. Affordable sessions for expats.`;
  }

  if (specializationName || languageName) {
    title = `${specializationName || ''} ${languageName || ''} Therapists in UAE | MindGood`.trim();
  }

  return {
    title,
    description,
    keywords: [
      "therapists in UAE", 
      "affordable therapy Dubai", 
      "expat mental health UAE", 
      "multilingual psychologists UAE", 
      "online therapy UAE", 
      specializationName, 
      languageName, 
      ...therapists.slice(0, 3).map(t => t.name)
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: 'website',
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
        "@id": "https://mindgood.com/psychologists",
        "name": "Find a Therapist in UAE",
        "description": "Directory of verified psychologists and therapists in the UAE speaking multiple languages.",
        "medicalSpecialty": AVAILABLE_SERVICES.map(s => s.name),
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

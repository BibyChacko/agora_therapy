import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import PsychologistFilters from '@/components/psychologists/PsychologistFilters';
import { TherapistCard } from '@/components/psychologists/TherapistCard';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { getLanguageName, LANGUAGES } from '@/lib/constants/languages';
import { getServiceById, AVAILABLE_SERVICES } from '@/types/models/service';
import { gccAreas, siteUrl } from '@/lib/seo';

function buildDirectoryQuery(params: { language?: string; specialization?: string }) {
  const queryParams = new URLSearchParams();
  if (params.language) queryParams.set('language', params.language);
  if (params.specialization) queryParams.set('specialization', params.specialization);
  const queryString = queryParams.toString();
  return queryString ? `/psychologists?${queryString}` : '/psychologists';
}

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
  let title = "Licensed Online Psychologists & Therapists in Dubai, UAE | MindGood";
  if (languageName && specializationName) {
    title = `${languageName} ${specializationName} Specialists in ${location}, UAE | MindGood`;
  } else if (languageName) {
    title = `${languageName} Speaking Psychologists in ${location}, UAE | MindGood`;
  } else if (specializationName) {
    title = `Expert ${specializationName} Therapy in ${location}, UAE | MindGood`;
  }

  // Dynamic Description Logic
  let description = `Connect with ${therapists.length || 20}+ verified psychologists and therapists in ${location}. We offer multilingual online mental health support for Dubai, the UAE, and GCC clients in ${languageName || 'English, Arabic, Malayalam, Hindi, and more'}.`;
  
  if (therapists.length > 0) {
    description = `Book an appointment with top-rated ${languageName || ''} therapists in ${location} like ${therapistNames}. Specialized support for ${specializationName || 'anxiety, stress, and relationships'}. Safe and confidential.`;
  }

  const queryParams = new URLSearchParams();
  if (languageCode) queryParams.set('language', languageCode);
  if (specializationCode) queryParams.set('specialization', specializationCode);
  const queryString = queryParams.toString();
  const canonicalUrl = `${siteUrl}/psychologists${queryString ? `?${queryString}` : ''}`;

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
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
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
  const [allTherapists, therapists] = await Promise.all([
    getPublicTherapists(),
    getPublicTherapists({
      specialization: params.specialization,
      language: params.language,
      minExperience: params.minExperience,
    }),
  ]);

  const specializationCode = params.specialization || '';
  const languageCode = params.language || '';
  const specializationName = specializationCode ? getServiceById(specializationCode)?.name || specializationCode : '';
  const languageName = languageCode ? getLanguageName(languageCode) : '';
  const currentResultsLabel = [
    languageName ? `${languageName}-speaking` : '',
    specializationName ? specializationName : '',
    'psychologists',
  ]
    .filter(Boolean)
    .join(' ');

  const availableLanguageCounts = allTherapists.reduce<Record<string, number>>((acc, therapist) => {
    therapist.languages.forEach((language) => {
      acc[language] = (acc[language] || 0) + 1;
    });
    return acc;
  }, {});

  const availableSpecializationCounts = allTherapists.reduce<Record<string, number>>((acc, therapist) => {
    therapist.specializations.forEach((specialization) => {
      acc[specialization] = (acc[specialization] || 0) + 1;
    });
    return acc;
  }, {});

  const languageLinks = LANGUAGES
    .filter((language) => availableLanguageCounts[language.code] > 0)
    .sort((a, b) => (availableLanguageCounts[b.code] || 0) - (availableLanguageCounts[a.code] || 0))
    .slice(0, 10);

  const specializationLinks = AVAILABLE_SERVICES
    .filter((service) => service.isActive && availableSpecializationCounts[service.id] > 0)
    .sort((a, b) => (availableSpecializationCounts[b.id] || 0) - (availableSpecializationCounts[a.id] || 0))
    .slice(0, 12);

  const canonicalPath = buildDirectoryQuery({
    language: languageCode || undefined,
    specialization: specializationCode || undefined,
  });
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const listTitle = currentResultsLabel
    ? `${therapists.length} ${currentResultsLabel} in Dubai, UAE`
    : `${therapists.length} verified psychologists in Dubai, UAE`;
  const listDescription = languageName || specializationName
    ? `Browse named therapist profiles, compare languages and concerns, and book secure online therapy with ${languageName || 'multilingual'} specialists for ${specializationName || 'anxiety, stress, relationships, and more'}.`
    : 'Browse named therapist profiles, compare languages and concerns, and book secure online therapy for Dubai, the UAE, and the wider GCC.';

  // JSON-LD structured data for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": listTitle,
        "description": listDescription,
        "isPartOf": {
          "@id": `${siteUrl}/#website`,
        },
        "about": {
          "@id": `${siteUrl}/#medical-business`,
        },
        "mainEntity": {
          "@id": `${canonicalUrl}#results`,
        },
        "breadcrumb": {
          "@id": `${canonicalUrl}#breadcrumb`,
        },
        "medicalSpecialty": specializationName ? [specializationName] : AVAILABLE_SERVICES.map(s => s.name),
        "areaServed": gccAreas,
        "knowsLanguage": languageName ? [languageName] : LANGUAGES.map(l => l.name)
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Psychologists",
            "item": `${siteUrl}/psychologists`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": listTitle,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#results`,
        "name": listTitle,
        "url": canonicalUrl,
        "numberOfItems": therapists.length,
        "itemListElement": therapists.slice(0, 15).map((t, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Person",
            "@id": `${siteUrl}/psychologists/${t.slug}#person`,
            "url": `${siteUrl}/psychologists/${t.slug}`,
            "name": t.name,
            "description": t.bio,
            "image": t.image,
            "worksFor": {
              "@id": `${siteUrl}/#organization`,
            },
            "hasOccupation": {
              "@type": "Occupation",
              "name": "Psychologist",
            },
            "medicalSpecialty": t.specializations.map(spec => getServiceById(spec)?.name || spec),
            "knowsLanguage": t.languages.map(getLanguageName),
            "availableLanguage": t.languages.map(getLanguageName),
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "AE"
            },
            "areaServed": gccAreas
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
            {languageName && specializationName
              ? `${languageName} ${specializationName} Specialists in Dubai, UAE`
              : languageName
              ? `${languageName} Speaking Psychologists in Dubai, UAE`
              : specializationName
              ? `${specializationName} Therapy in Dubai, UAE`
              : 'Find Your Therapist in Dubai, UAE'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {listDescription}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            {listTitle}
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

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Browse Therapists by Concern
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Explore high-intent therapy searches like anxiety, depression, couples therapy, trauma healing, and stress management.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {specializationLinks.map((service) => (
                <Link
                  key={service.id}
                  href={buildDirectoryQuery({ specialization: service.id })}
                  className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
                >
                  {service.name} ({availableSpecializationCounts[service.id]})
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Browse Therapists by Language
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Find named therapist profiles for Malayalam, Tamil, Arabic, Hindi, English, and other supported languages across the UAE and GCC.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {languageLinks.map((language) => (
                <Link
                  key={language.code}
                  href={buildDirectoryQuery({ language: language.code })}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                >
                  {language.name} ({availableLanguageCounts[language.code]})
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Named Therapist Profiles
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              These public therapist pages include biographies, languages, concerns, and booking links for direct discovery in search and AI assistants.
            </p>
            <ul className="mt-5 space-y-3">
              {therapists.slice(0, 8).map((therapist) => (
                <li key={therapist.id}>
                  <Link
                    href={`/psychologists/${therapist.slug}`}
                    className="block rounded-2xl border border-gray-200 px-4 py-3 transition-colors hover:border-teal-300 hover:bg-teal-50 dark:border-gray-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                  >
                    <span className="block font-semibold text-gray-900 dark:text-white">
                      {therapist.name}
                    </span>
                    <span className="mt-1 block text-sm text-gray-600 dark:text-gray-400">
                      {therapist.languages.map(getLanguageName).join(', ')} | {therapist.specializations
                        .map((specialization) => getServiceById(specialization)?.name || specialization)
                        .join(', ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

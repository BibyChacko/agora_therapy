import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { FiArrowLeft, FiStar, FiClock, FiBookOpen } from 'react-icons/fi';
import { getLanguageName } from '@/lib/constants/languages';
import { getServiceById } from '@/types/models/service';
import {
  getPublicTherapistById,
  getPublicTherapistBySlug,
} from '@/lib/services/public-therapist-service';
import { BookConsultationButton } from '@/components/psychologists/BookConsultationButton';
import { gccAreas, siteName, siteUrl } from '@/lib/seo';

interface Props {
  params: Promise<{ id: string }>;
}

function toAbsoluteUrl(url: string) {
  return url.startsWith('http') ? url : `${siteUrl}${url}`;
}

function formatVerificationDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const therapist =
    (await getPublicTherapistBySlug(id)) || (await getPublicTherapistById(id));
  const canonicalSlug = therapist?.slug || id;
  const canonicalUrl = `${siteUrl}/psychologists/${canonicalSlug}`;

  if (!therapist) {
    return {
      title: 'Therapist Not Found',
      description: 'The psychologist profile you are looking for is not available on MindGood.',
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  const specializationsList = therapist.specializations
    .map(spec => getServiceById(spec)?.name || spec)
    .filter(Boolean);
  const specializations = specializationsList.join(', ');
  const primarySpecialization = specializationsList[0] || 'Therapy';

  const languagesStr = therapist.languages.map(getLanguageName).join(', ');
  const primaryLanguage = therapist.languages[0] ? getLanguageName(therapist.languages[0]) : '';
  const therapistLocation = therapist.location || 'Dubai, UAE';
  const ogImage = toAbsoluteUrl(therapist.image);
  const title = primaryLanguage
    ? `${therapist.name} | ${primaryLanguage}-Speaking ${primarySpecialization} Psychologist in ${therapistLocation}`
    : `${therapist.name} | ${primarySpecialization} Psychologist in ${therapistLocation}`;
  const description = [
    primaryLanguage
      ? `${therapist.name} is a verified ${primaryLanguage}-speaking psychologist on MindGood.`
      : `Book online therapy with ${therapist.name}, a verified psychologist on MindGood.`,
    specializations ? `Specializes in ${specializations}.` : null,
    therapist.experience ? `${therapist.experience}+ years of experience.` : null,
    languagesStr ? `Sessions available in ${languagesStr}.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const keywords = [
    therapist.name,
    'psychologist',
    'therapist',
    'online psychologist Dubai',
    'online therapy UAE',
    `${primarySpecialization} therapist Dubai`,
    `${therapist.name} psychologist`,
    `${therapist.name} therapist`,
    therapistLocation,
    'counseling',
    ...specializationsList,
    ...therapist.languages.map(getLanguageName).filter(Boolean),
    'online therapy',
    'mental health',
    'MindGood',
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    category: 'healthcare',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: `Photo of ${therapist.name}`,
        }
      ],
      locale: 'en_AE',
      type: 'profile',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PsychologistDetail({ params }: Props) {
  const { id } = await params;
  const psychologist =
    (await getPublicTherapistBySlug(id)) || (await getPublicTherapistById(id));

  if (!psychologist) {
    notFound();
  }

  if (id !== psychologist.slug) {
    permanentRedirect(`/psychologists/${psychologist.slug}`);
  }

  const specializations = psychologist.specializations
    .map(spec => getServiceById(spec)?.name || spec)
    .filter(Boolean);
  const languages = psychologist.languages.map(getLanguageName).filter(Boolean);
  const canonicalUrl = `${siteUrl}/psychologists/${psychologist.slug}`;
  const imageUrl = toAbsoluteUrl(psychologist.image);
  const therapistLocation = psychologist.location || 'Dubai, UAE';
  const verifiedDate = formatVerificationDate(psychologist.verifiedAt);
  const description = [
    `${psychologist.name} is a verified psychologist on MindGood.`,
    specializations.length ? `Specializations include ${specializations.join(', ')}.` : null,
    psychologist.experience ? `${psychologist.experience}+ years of experience.` : null,
    languages.length ? `Available in ${languages.join(', ')}.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${psychologist.name} | MindGood`,
        "description": description,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          "url": siteUrl,
          "name": siteName
        },
        "mainEntity": {
          "@id": `${canonicalUrl}#person`
        },
        "about": {
          "@id": `${canonicalUrl}#person`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": imageUrl
        },
        "breadcrumb": {
          "@id": `${canonicalUrl}#breadcrumb`
        }
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
            "name": psychologist.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "Person",
        "@id": `${canonicalUrl}#person`,
        "name": psychologist.name,
        "url": canonicalUrl,
        "image": imageUrl,
        "description": psychologist.bio || description,
        "jobTitle": psychologist.title,
        "worksFor": {
          "@type": "Organization",
          "name": siteName
        },
        "memberOf": {
          "@type": "Organization",
          "name": siteName
        },
        "knowsLanguage": languages,
        "availableLanguage": languages,
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Psychologist"
        },
        "hasCredential": psychologist.licenseNumber || psychologist.licenseAuthority
          ? {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Professional License",
              "identifier": psychologist.licenseNumber || undefined,
              "recognizedBy": psychologist.licenseAuthority
                ? {
                    "@type": "Organization",
                    "name": psychologist.licenseAuthority
                  }
                : undefined
            }
          : undefined,
        "areaServed": gccAreas,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": therapistLocation,
          "addressCountry": "AE"
        },
        "makesOffer": {
          "@type": "Offer",
          "price": (psychologist.hourlyRate / 100).toFixed(2),
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        },
        "medicalSpecialty": specializations,
        "aggregateRating": psychologist.rating && psychologist.reviewCount
          ? {
              "@type": "AggregateRating",
              "ratingValue": psychologist.rating,
              "reviewCount": psychologist.reviewCount
            }
          : undefined
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Back Button */}
      <Link 
        href="/psychologists"
        className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mb-8"
      >
        <FiArrowLeft className="mr-2" /> Back to All Psychologists
      </Link>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-2">
          <article className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-64 h-64">
                <Image 
                  src={psychologist.image} 
                  alt={psychologist.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{psychologist.name}</h1>
                <p className="text-teal-600 dark:text-teal-400 text-lg mb-3">{psychologist.title}</p>
                
                {/* Rating */}
                {psychologist.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`${i < Math.floor(psychologist.rating!) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {psychologist.rating.toFixed(1)} {psychologist.reviewCount ? `(${psychologist.reviewCount} reviews)` : ''}
                    </span>
                  </div>
                )}
                
                {/* Languages */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {psychologist.languages.map((lang, idx) => (
                      <span 
                        key={idx}
                        className="text-sm px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full"
                      >
                        {getLanguageName(lang)}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Experience */}
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock className="mr-2" />
                  <span>{psychologist.experience} years of experience</span>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                    Verified by MindGood
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    This therapist&apos;s professional profile, experience, and licensing details have been reviewed by the MindGood team.
                    {verifiedDate ? ` Verified on ${verifiedDate}.` : ''}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
                    {psychologist.licenseAuthority ? (
                      <p>
                        <span className="font-semibold text-gray-900 dark:text-white">Issuing Authority:</span>{' '}
                        {psychologist.licenseAuthority}
                      </p>
                    ) : null}
                    {psychologist.licenseNumber ? (
                      <p>
                        <span className="font-semibold text-gray-900 dark:text-white">License Number:</span>{' '}
                        {psychologist.licenseNumber}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/how-we-verify-therapists"
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-gray-900 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                    >
                      How we verify therapists
                    </Link>
                    <Link
                      href="/clinical-standards"
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-gray-900 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                    >
                      Clinical standards
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs Content */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <FiBookOpen className="mr-2" /> About
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-6">{psychologist.bio}</p>
              </div>
              
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {psychologist.specializations.map((spec, idx) => {
                  const service = getServiceById(spec);
                  return (
                    <span 
                      key={idx}
                      className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                    >
                      {service?.name || spec}
                    </span>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
        
        {/* Right Column - Booking */}
        <aside>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Book a Consultation</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Select a convenient time slot for your consultation with {psychologist.name}.
            </p>
            
            {/* Booking Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hourly Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ${(psychologist.hourlyRate / 100).toFixed(2)}/hr
              </p>
              <BookConsultationButton psychologistId={psychologist.id} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                50-minute session
              </p>
              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <Link
                  href="/medical-review-policy"
                  className="block text-center text-xs font-semibold text-teal-700 hover:text-teal-600 dark:text-teal-300"
                >
                  Read our medical review policy
                </Link>
                <Link
                  href="/crisis-emergency-help"
                  className="block text-center text-xs font-semibold text-rose-700 hover:text-rose-600 dark:text-rose-300"
                >
                  Need urgent help instead?
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

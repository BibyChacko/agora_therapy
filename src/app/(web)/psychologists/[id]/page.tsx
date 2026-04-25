import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiStar, FiClock, FiBookOpen } from 'react-icons/fi';
import { getLanguageName } from '@/lib/constants/languages';
import { getServiceById } from '@/types/models/service';
import { getPublicTherapistById } from '@/lib/services/public-therapist-service';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const therapist = await getPublicTherapistById(id);

  if (!therapist) {
    return {
      title: 'Therapist Not Found | MindGood',
    };
  }

  const specializations = therapist.specializations
    .map(spec => getServiceById(spec)?.name || spec)
    .join(', ');

  const title = `${therapist.name} - ${therapist.title} | MindGood`;
  const description = `${therapist.name} is a verified psychologist specializing in ${specializations}. With ${therapist.experience} years of experience, they provide affordable therapy in ${therapist.languages.map(getLanguageName).join(', ')}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [therapist.image],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [therapist.image],
    },
  };
}

export default async function PsychologistDetail({ params }: Props) {
  const { id } = await params;
  const psychologist = await getPublicTherapistById(id);

  if (!psychologist) {
    notFound();
  }

  // JSON-LD structured data for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": psychologist.name,
    "image": psychologist.image,
    "description": psychologist.bio,
    "medicalSpecialty": psychologist.specializations.map(spec => getServiceById(spec)?.name || spec),
    "occupationalExperience": {
      "@type": "OccupationalExperience",
      "experienceInYears": psychologist.experience
    },
    "knowsLanguage": psychologist.languages.map(getLanguageName),
    "priceRange": `$$`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UAE"
    },
    "aggregateRating": psychologist.rating ? {
      "@type": "AggregateRating",
      "ratingValue": psychologist.rating,
      "reviewCount": psychologist.reviewCount || 1
    } : undefined
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
              <Link
                href={`/booking/${psychologist.id}`}
                className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity font-bold"
              >
                Book Consultation
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                50-minute session
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { TherapistPublicView } from '@/types/models/therapist';

interface FeaturedTherapistsSectionProps {
  therapists: TherapistPublicView[];
}

export function FeaturedTherapistsSection({ therapists }: FeaturedTherapistsSectionProps) {
  if (therapists.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Featured Therapists</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Meet our top-rated, verified therapists ready to help you in your language of choice.
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No featured therapists available at the moment.</p>
            <Link 
              href="/psychologists"
              className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              View All Therapists
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Featured Therapists</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Meet our top-rated, verified therapists ready to help you in your language of choice.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image 
                  src={therapist.image} 
                  alt={therapist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{therapist.name}</h3>
                  {therapist.isVerified && (
                    <span className="text-blue-600 dark:text-blue-400" title="Verified Therapist">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-teal-600 dark:text-teal-400 mb-3">{therapist.title}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {therapist.languages.slice(0, 3).map((lang, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                  {therapist.languages.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      +{therapist.languages.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {therapist.experience} years experience
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${(therapist.hourlyRate / 100).toFixed(0)}/hr
                  </span>
                </div>
                <Link 
                  href={`/psychologists/${therapist.id}`}
                  className="block w-full py-2 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/psychologists"
            className="inline-flex items-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            View All Therapists <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

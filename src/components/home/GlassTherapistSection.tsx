"use client";

import Link from "next/link";
import { useState } from "react";

interface Therapist {
  id: string;
  name: string;
  specialization?: string;
  languages: string[];
  rating?: number;
  image?: string;
  bio?: string;
}

interface GlassTherapistSectionProps {
  therapists: Therapist[];
}

export function GlassTherapistSection({ therapists }: GlassTherapistSectionProps) {
  const initialVisibleCount = 6;
  const loadMoreCount = 3;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const displayTherapists = therapists.slice(0, visibleCount);
  const hasMoreTherapists = therapists.length > visibleCount;

  return (
    <section id="therapists" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Expert 
            <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent ml-3">
              Psychologists
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with licensed professionals who understand your journey and speak your language
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 md:gap-8">
          {displayTherapists.map((therapist, index) => (
            <div
              key={therapist.id}
              className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700/60 dark:bg-gray-800/50"
            >
              {/* Therapist Image */}
              <div className="relative aspect-[5/6] overflow-hidden md:aspect-[3/4]">
                <img
                  src={therapist.image || `https://images.unsplash.com/photo-${
                    index === 0 ? '1507003211169-0a1dd7228f2d' : 
                    index === 1 ? '1573496359142-b8d87734a5a2' : 
                    '1580489944761-15a19d654956'
                  }?w=600&h=800&fit=crop`}
                  alt={therapist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Floating badge */}
                <div className="absolute right-2 top-2 rounded-full border border-white/60 bg-white/30 px-2 py-1 backdrop-blur-xl sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 md:right-4 md:top-4 md:px-4 md:py-2">
                  <div className="flex items-center gap-1">
                    <svg className="h-3 w-3 text-yellow-400 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-white sm:text-xs md:text-sm">{therapist.rating}</span>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                  <h3 className="mb-1 line-clamp-2 text-base font-bold text-white sm:mb-1.5 sm:text-xl md:mb-2 md:text-2xl">{therapist.name}</h3>
                  <p className="mb-2 line-clamp-2 text-[11px] text-white/90 sm:mb-2.5 sm:text-xs md:mb-3 md:text-sm">
                    {therapist.specialization || "Licensed Mental Health Professional"}
                  </p>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {therapist.languages.slice(0, 3).map((lang, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/40 bg-white/20 px-2 py-0.5 text-[10px] text-white backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px] md:px-3 md:text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-6">
                <Link
                  href={`/psychologists/${therapist.id}`}
                  className="block w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 py-2 text-center text-xs font-semibold text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700 sm:py-2.5 sm:text-sm md:py-3 md:text-base"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {hasMoreTherapists && (
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + loadMoreCount)}
              className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/70 px-8 py-4 font-semibold text-gray-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 dark:border-gray-700/80 dark:bg-gray-800/70 dark:text-white dark:hover:bg-gray-800/90"
            >
              Load More Therapists
            </button>
          )}

          <Link
            href="/psychologists"
            className="inline-flex items-center gap-2 px-8 py-4 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/80 dark:border-gray-700/80 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            View All Therapists
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle, MapPin, Clock, DollarSign } from 'lucide-react';
import { TherapistPublicView } from '@/types/models/therapist';
import { getLanguageName } from '@/lib/constants/languages';

interface TherapistCardProps {
  therapist: TherapistPublicView;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  return (
    <Link 
      href={`/psychologists/${therapist.id}`}
      className="group block bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {/* Large Photo Section - More compact */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20">
        <Image 
          src={therapist.image} 
          alt={therapist.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Rating Badge - Overlay on photo */}
        {therapist.rating && (
          <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white text-xs">
              {therapist.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section - More compact */}
      <div className="p-4">
        {/* Name and Title */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {therapist.name}
            </h2>
            {therapist.isVerified && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <p className="text-teal-600 dark:text-teal-400 text-xs font-medium">
            {therapist.title}
          </p>
        </div>

        {/* Experience and Rate - Key Info */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs">{therapist.experience} yrs</span>
          </div>
          <div className="flex items-center gap-0.5">
            <DollarSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-base font-bold text-gray-900 dark:text-white">
              {(therapist.hourlyRate / 100).toFixed(0)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">/hr</span>
          </div>
        </div>

        {/* Languages - Comma Separated */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Languages
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {therapist.languages.map(code => getLanguageName(code)).join(', ')}
          </p>
        </div>
        
        {/* Specializations - Compact */}
        {therapist.specializations && therapist.specializations.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Specializations
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {therapist.specializations.join(', ')}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div>
          <div className="w-full py-2 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold group-hover:from-teal-600 group-hover:to-blue-700 transition-all shadow-md group-hover:shadow-lg text-xs">
            View Full Profile
          </div>
        </div>
      </div>
    </Link>
  );
}

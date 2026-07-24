"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle, MapPin, DollarSign, Globe } from 'lucide-react';
import { TherapistPublicView } from '@/types/models/therapist';
import { getLanguageName } from '@/lib/constants/languages';
import { formatAmountFromMinorUnits } from '@/lib/utils/currency';

interface TherapistCardProps {
  therapist: TherapistPublicView;
}

function formatVerificationDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-AE', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  // Limit specializations to show only the first 2 for extreme compactness
  const displaySpecializations = therapist.specializations?.slice(0, 2) || [];
  const remainingCount = (therapist.specializations?.length || 0) - 2;
  const profilePath = therapist.slug || therapist.id;
  const verifiedDate = formatVerificationDate(therapist.verifiedAt);
  const displayPrice =
    therapist.pricing?.displayHourlyTotal ||
    therapist.pricing?.displayHourlyRate ||
    therapist.hourlyRate;
  const displayCurrency =
    therapist.pricing?.displayCurrency || therapist.currency || 'USD';
  const formattedDisplayPrice = formatAmountFromMinorUnits(
    displayPrice,
    displayCurrency
  );

  return (
    <Link 
      href={`/psychologists/${profilePath}`}
      className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {/* Visual Header Section */}
      <div className="relative aspect-square overflow-hidden">
        <Image 
          src={therapist.image} 
          alt={therapist.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Price Pill */}
          <div className="bg-black/60 backdrop-blur-md text-white rounded-full px-3 py-1.5 shadow-xl border border-white/10 flex flex-col items-center leading-none">
            <span className="text-sm font-black">{formattedDisplayPrice}</span>
            <span className="text-[7px] uppercase font-bold opacity-80">hr</span>
          </div>

          {/* Rating Pill */}
          {therapist.rating && (
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-2.5 py-1.5 shadow-xl flex items-center gap-1 border border-black/5">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="font-black text-gray-900 dark:text-white text-xs">
                {therapist.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 z-10">
          <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">
            {therapist.name}
          </h2>
          <p className="text-teal-300 text-xs font-bold uppercase tracking-wider drop-shadow-sm">
            {therapist.title}
          </p>
        </div>
      </div>

      {/* Compact Data Section */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <Globe className="w-3.5 h-3.5 text-teal-500" />
            <span className="truncate">{therapist.timezone || 'UTC'}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {therapist.languages.slice(0, 2).map((lang) => (
              <span key={lang} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                {getLanguageName(lang)}
              </span>
            ))}
          </div>
        </div>

        {therapist.isVerified && (
          <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 px-3 py-2.5 shadow-[0_10px_24px_rgba(14,116,244,0.08)] dark:border-sky-900/40 dark:from-sky-950/50 dark:via-gray-900 dark:to-sky-950/40">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center">
                <div
                  className="h-9 w-9 bg-sky-500 shadow-[0_10px_20px_rgba(14,116,244,0.25)]"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 63% 7%, 77% 4%, 84% 16%, 97% 21%, 94% 35%, 100% 50%, 94% 65%, 97% 79%, 84% 84%, 77% 96%, 63% 93%, 50% 100%, 37% 93%, 23% 96%, 16% 84%, 3% 79%, 6% 65%, 0% 50%, 6% 35%, 3% 21%, 16% 16%, 23% 4%, 37% 7%)',
                  }}
                />
                <CheckCircle className="absolute h-5 w-5 fill-white text-white" strokeWidth={2.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">
                  MindGood
                </p>
                <p className="truncate text-sm font-black leading-none text-gray-900 dark:text-white">
                  Verified
                </p>
              </div>
            </div>
            {verifiedDate ? (
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                {verifiedDate}
              </span>
            ) : null}
          </div>
        )}

        {/* Minimal Specializations */}
        <div className="flex flex-wrap gap-1.5">
          {displaySpecializations.map((spec) => (
            <span 
              key={spec}
              className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg border border-teal-100/50 dark:border-teal-800/50"
            >
              {spec.toLocaleUpperCase().replaceAll("-"," ").replaceAll("_"," ")}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-[10px] font-bold text-gray-400 py-1">
              +{remainingCount}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full py-2.5 text-center bg-gray-900 dark:bg-teal-500 text-white dark:text-white rounded-xl font-black group-hover:bg-teal-600 dark:group-hover:bg-teal-400 transition-all duration-300 shadow-md text-xs uppercase tracking-widest">
          View Profile
        </div>
      </div>
    </Link>
  );
}

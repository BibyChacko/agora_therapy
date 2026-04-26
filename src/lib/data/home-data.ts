import { Language, LANGUAGES, POPULAR_INDIAN_LANGUAGES, POPULAR_INTERNATIONAL_LANGUAGES } from '@/lib/constants/languages';
import { Service, AVAILABLE_SERVICES } from '@/types/models/service';
import { TherapistPublicView } from '@/types/models/therapist';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';

export async function getPopularLanguages(): Promise<Language[]> {
  // Use local constants for consistency with filters as requested
  const popularIndian = LANGUAGES.filter((lang) => 
    POPULAR_INDIAN_LANGUAGES.includes(lang.code)
  ).slice(0, 6);

  const popularInternational = LANGUAGES.filter((lang) => 
    POPULAR_INTERNATIONAL_LANGUAGES.includes(lang.code)
  ).slice(0, 4);

  // Return a balanced mix
  return [...popularIndian, ...popularInternational];
}

export async function getServices(): Promise<Service[]> {
  // Use local constants for consistency with filters
  return AVAILABLE_SERVICES.filter(s => s.isActive).slice(0, 12);
}

export async function getFeaturedTherapists(): Promise<TherapistPublicView[]> {
  try {
    // Attempt to get explicitly featured therapists first
    let therapists = await getPublicTherapists({ featured: true });
    
    // Fallback: If no featured therapists, get any active therapists 
    // This addresses the "We dont have any featured therapists for now" request
    if (!therapists || therapists.length === 0) {
      // Prioritize therapists with trauma-healing to match current focus, or just general
      therapists = await getPublicTherapists({});
    }
    
    // Return top 8 (the UI currently shows 3, but this gives room for growth)
    return therapists.slice(0, 8);
  } catch (error) {
    console.error('Error fetching therapists for home:', error);
    return [];
  }
}

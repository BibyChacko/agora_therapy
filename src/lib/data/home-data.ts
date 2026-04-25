import { Language, LANGUAGES, POPULAR_INDIAN_LANGUAGES, POPULAR_INTERNATIONAL_LANGUAGES } from '@/lib/constants/languages';
import { Service, AVAILABLE_SERVICES } from '@/types/models/service';
import { TherapistPublicView } from '@/types/models/therapist';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    const response = await fetch(`${BASE_URL}/api/public/therapists?featured=true`, {
      next: { revalidate: 1800 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.therapists.slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching featured therapists:', error);
  }
  
  return [];
}

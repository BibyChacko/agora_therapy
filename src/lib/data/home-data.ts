import { Language } from '@/lib/constants/languages';
import { Service } from '@/types/models/service';
import { TherapistPublicView } from '@/types/models/therapist';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function getPopularLanguages(): Promise<Language[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/public/languages`, {
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const data = await response.json();
      const popular = data.languages.filter((lang: Language) => 
        data.popularIndianLanguages.includes(lang.code)
      );
      return popular.slice(0, 6);
    }
  } catch (error) {
    console.error('Error fetching languages:', error);
  }
  
  return [
    { code: 'ml', name: 'Malayalam', region: 'India' },
    { code: 'ta', name: 'Tamil', region: 'India' },
    { code: 'hi', name: 'Hindi', region: 'India' },
    { code: 'te', name: 'Telugu', region: 'India' },
    { code: 'kn', name: 'Kannada', region: 'India' },
    { code: 'en', name: 'English', region: 'India' },
  ];
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/public/services`, {
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.services.slice(0, 6);
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
  
  return [];
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

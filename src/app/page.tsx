import { Metadata } from 'next';
import { GlassHeroSection } from '@/components/home/GlassHeroSection';
import { GlassLanguageSection } from '@/components/home/GlassLanguageSection';
import { GlassServicesSection } from '@/components/home/GlassServicesSection';
import { GlassEmotionalJourneySection } from '@/components/home/GlassEmotionalJourneySection';
import { GlassSpecializedSupportSection } from '@/components/home/GlassSpecializedSupportSection';
import { GlassTherapistSection } from '@/components/home/GlassTherapistSection';
import { GlassLateNightSupportSection } from '@/components/home/GlassLateNightSupportSection';
import { GlassDaytimeSupportSection } from '@/components/home/GlassDaytimeSupportSection';
import { GlassHowItWorksSection } from '@/components/home/GlassHowItWorksSection';
import { GlassFAQSection } from '@/components/home/GlassFAQSection';
import { GlassYogaSection } from '@/components/home/GlassYogaSection';
import { GlassRehabSection } from '@/components/home/GlassRehabSection';
import { GlassCTASection } from '@/components/home/GlassCTASection';
import { InstagramEmbedSection } from '@/components/home/InstagramEmbedSection';
import { getPopularLanguages, getServices, getFeaturedTherapists } from '@/lib/data/home-data';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Online Therapy in Dubai, UAE & GCC | Multilingual Psychologists',
  description: 'Book confidential online therapy in Dubai, the UAE, and across the GCC. MindGood connects you with licensed psychologists for anxiety, stress, relationships, couples therapy, and culturally aware support in multiple languages.',
  keywords: [
    'psychologist Dubai',
    'therapist Dubai',
    'online therapy Dubai',
    'counselling Dubai',
    'online therapist UAE',
    'online counselling GCC',
    'expat psychologist Dubai',
    'couples therapy Dubai',
    'anxiety therapist Dubai',
    'depression counselling UAE',
    'Malayalam psychologist Dubai',
    'Arabic therapist Dubai',
    'Hindi therapist Dubai',
    'Tamil counselling UAE',
    'stress management therapy Dubai',
  ],
  authors: [{ name: 'MindGood' }],
  creator: 'MindGood',
  publisher: 'MindGood',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Online Therapy in Dubai, UAE & GCC | Multilingual Psychologists',
    description: 'Confidential therapy for Dubai, the UAE, and the GCC with licensed psychologists who understand expat, family, and multicultural mental health needs.',
    url: siteUrl,
    siteName: 'MindGood',
    images: [
      {
        url: '/images/hero-image.webp',
        width: 1200,
        height: 630,
        alt: 'Online Therapy and Mental Health Support - MindGood',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Therapy in Dubai, UAE & GCC | Multilingual Psychologists',
    description: 'Book confidential therapy with multilingual psychologists supporting Dubai, the UAE, and the GCC.',
    images: ['/images/hero-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function Home() {
  const [languages, services, therapists] = await Promise.all([
    getPopularLanguages(),
    getServices(),
    getFeaturedTherapists()
  ]);

  return (
    <>
      <GlassHeroSection />
      <GlassLanguageSection languages={languages} />
      <GlassServicesSection services={services} />
      <GlassEmotionalJourneySection />
      <GlassSpecializedSupportSection />
      <GlassTherapistSection therapists={therapists} />
      {/* <InstagramEmbedSection /> */}
      {/* <GlassYogaSection /> */}
      {/* <GlassRehabSection /> */}
      {/* <GlassLateNightSupportSection /> */}
      {/* <GlassDaytimeSupportSection /> */}
      <GlassHowItWorksSection />
      <GlassFAQSection />
      <GlassCTASection />
    </>
  );
}

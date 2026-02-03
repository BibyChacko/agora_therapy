import { Metadata } from 'next';
import { GlassHeroSection } from '@/components/home/GlassHeroSection';
import { GlassLanguageSection } from '@/components/home/GlassLanguageSection';
import { GlassServicesSection } from '@/components/home/GlassServicesSection';
import { GlassEmotionalJourneySection } from '@/components/home/GlassEmotionalJourneySection';
import { GlassSupportHandSection } from '@/components/home/GlassSupportHandSection';
import { GlassRelationshipSupportSection } from '@/components/home/GlassRelationshipSupportSection';
import { GlassSexualHealthSection } from '@/components/home/GlassSexualHealthSection';
import { GlassMeditationSection } from '@/components/home/GlassMeditationSection';
import { GlassTherapistSection } from '@/components/home/GlassTherapistSection';
import { GlassLateNightSupportSection } from '@/components/home/GlassLateNightSupportSection';
import { GlassDaytimeSupportSection } from '@/components/home/GlassDaytimeSupportSection';
import { GlassHowItWorksSection } from '@/components/home/GlassHowItWorksSection';
import { GlassFAQSection } from '@/components/home/GlassFAQSection';
import { YogaSection } from '@/components/home/YogaSection';
import { RehabSection } from '@/components/home/RehabSection';
import { CTASection } from '@/components/home/CTASection';
import { StructuredData } from '@/components/StructuredData';
import { getPopularLanguages, getServices, getFeaturedTherapists } from '@/lib/data/home-data';

export const metadata: Metadata = {
  title: 'Online Therapy & Counseling in Your Language | 24/7 Mental Health Support',
  description: 'Connect with licensed psychologists and therapists online from anywhere in the world. Get professional counseling in Malayalam, Tamil, Hindi, Telugu, Kannada, and 50+ languages. 24/7 support available.',
  keywords: [
    'online therapy',
    'online counseling',
    'mental health support',
    'psychological counseling',
    'therapy in native language',
    'Malayalam therapy',
    'Tamil counseling',
    'Hindi psychologist',
    'Telugu therapy',
    'Kannada counseling',
    '24/7 mental health support',
    'online psychologist',
    'virtual therapy',
    'teletherapy',
    'remote counseling',
    'anxiety treatment',
    'depression counseling',
    'stress management',
    'trauma therapy',
    'relationship counseling',
    'career counseling',
    'family therapy',
    'licensed therapist online',
    'certified psychologist',
    'mental health professional',
    'therapy from home',
    'video counseling',
    'chat therapy',
    'multilingual therapy',
    'Indian language therapy',
    'global mental health',
    'online psychiatric help'
  ],
  authors: [{ name: 'MindGood' }],
  creator: 'MindGood',
  publisher: 'MindGood',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mindgood.life'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'hi': '/hi',
      'ta': '/ta',
      'te': '/te',
      'ml': '/ml',
      'kn': '/kn',
      'mr': '/mr',
      'gu': '/gu',
      'bn': '/bn',
      'pa': '/pa',
      'ur': '/ur',
      'si': '/si',
      'de': '/de',
      'es': '/es',
      'fr': '/fr',
      'it': '/it',
    },
  },
  openGraph: {
    title: 'Online Therapy & Counseling in Your Language | 24/7 Mental Health Support',
    description: 'Connect with licensed psychologists and therapists online from anywhere in the world. Professional counseling in 50+ languages including Malayalam, Tamil, Hindi, Telugu, and Kannada.',
    url: 'https://mindgood.life',
    siteName: 'MindGood',
    images: [
      {
        url: '/images/hero-image.webp',
        width: 1200,
        height: 630,
        alt: 'Online Therapy and Mental Health Support - MindGood',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Therapy & Counseling in Your Language | 24/7 Mental Health Support',
    description: 'Connect with licensed psychologists online. Professional counseling in 50+ languages. 24/7 support available.',
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
      <StructuredData />
      <GlassHeroSection />
      <GlassLanguageSection languages={languages} />
      <GlassServicesSection services={services} />
      <GlassEmotionalJourneySection />
      <GlassSupportHandSection />
      <GlassRelationshipSupportSection />
      <GlassSexualHealthSection />
      <GlassMeditationSection />
      <GlassTherapistSection therapists={therapists} />
      <YogaSection />
      <RehabSection />
      <GlassLateNightSupportSection />
      <GlassDaytimeSupportSection />
      <GlassHowItWorksSection />
      <GlassFAQSection />
      <CTASection />
    </>
  );
}

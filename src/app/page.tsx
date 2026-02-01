import { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { LanguageSection } from '@/components/home/LanguageSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { EmotionalJourneySection } from '@/components/home/EmotionalJourneySection';
import { SupportHandSection } from '@/components/home/SupportHandSection';
import { RelationshipSupportSection } from '@/components/home/RelationshipSupportSection';
import { SexualHealthSection } from '@/components/home/SexualHealthSection';
import { RehabSection } from '@/components/home/RehabSection';
import { YogaSection } from '@/components/home/YogaSection';
import { LateNightSupportSection } from '@/components/home/LateNightSupportSection';
import { DaytimeSupportSection } from '@/components/home/DaytimeSupportSection';
import { FeaturedTherapistsSection } from '@/components/home/FeaturedTherapistsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CTASection } from '@/components/home/CTASection';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://mindgood.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Online Therapy & Counseling in Your Language | 24/7 Mental Health Support',
    description: 'Connect with licensed psychologists and therapists online from anywhere in the world. Professional counseling in 50+ languages including Malayalam, Tamil, Hindi, Telugu, and Kannada.',
    url: '/',
    siteName: 'MindGood',
    images: [
      {
        url: '/images/hero-image.webp',
        width: 1200,
        height: 630,
        alt: 'Online Therapy and Mental Health Support',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
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
      <HeroSection />
      <LanguageSection languages={languages} />
      <ServicesSection services={services} />
      <EmotionalJourneySection />
      <SupportHandSection />
      <RelationshipSupportSection />
      <SexualHealthSection />
      <RehabSection />
      <YogaSection />
      <FeaturedTherapistsSection therapists={therapists} />
      <LateNightSupportSection />
      <DaytimeSupportSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}

import { HeroSection } from '@/components/home/HeroSection';
import { LanguageSection } from '@/components/home/LanguageSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FeaturedTherapistsSection } from '@/components/home/FeaturedTherapistsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CTASection } from '@/components/home/CTASection';
import { getPopularLanguages, getServices, getFeaturedTherapists } from '@/lib/data/home-data';

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
      <FeaturedTherapistsSection therapists={therapists} />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}

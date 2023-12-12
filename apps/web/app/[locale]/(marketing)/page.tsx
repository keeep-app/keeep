import { LocalePageProps } from '@/lib/types/global';
import { unstable_setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeatureSection } from '@/components/marketing/feature-section';

export default function Home({ params: { locale } }: LocalePageProps) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <FeatureSection />
    </>
  );
}

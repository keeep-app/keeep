import { LocalePageProps } from '@/lib/types/global';
import { unstable_setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeatureSection } from '@/components/marketing/feature-section';

export default function Home({ params: { locale } }: LocalePageProps) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-12 py-12 md:py-24">
      <HeroSection />
      <FeatureSection />
    </div>
  );
}

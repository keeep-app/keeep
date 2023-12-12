import { LocalePageProps } from '@/lib/types/global';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Navigation } from '@/components/marketing/navigation';
import { HeroSection } from '@/components/marketing/hero-section';
import { Footer } from '@/components/marketing/footer';
import { FeatureSection } from '@/components/marketing/feature-section';

export default function Home({ params: { locale } }: LocalePageProps) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </>
  );
}

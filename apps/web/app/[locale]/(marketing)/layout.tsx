import { Footer } from '@/components/marketing/footer';
import { Navigation } from '@/components/marketing/navigation';
import { Toaster } from '@/components/ui/toaster';
import { LocaleLayoutProps } from '@/lib/types/global';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function MarketingLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}

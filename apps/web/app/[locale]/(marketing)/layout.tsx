import { Footer } from '@/components/marketing/footer';
import { Navigation } from '@/components/marketing/navigation';
import { Toaster } from '@/components/ui/toaster';

type MarketingLayoutProps = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}

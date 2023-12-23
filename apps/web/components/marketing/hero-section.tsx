import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { WaitlistForm } from './waitlist-form';
import DashboardSnapshot from '@/public/dashboard.png';

export const HeroSection: React.FC = () => {
  const t = useTranslations('HeroSection');

  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <Image
            alt="Hero"
            className="order-last object-cover object-center shadow-lg sm:w-full"
            height="310"
            src={DashboardSnapshot}
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="mb-8 space-y-8">
              <h1 className="font-accent text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/tight">
                {t('title')}
              </h1>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                {t('description')}
              </p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <WaitlistForm
                translations={{
                  inputLabel: t('waitlist.inputLabel'),
                  submit: t('waitlist.submit'),
                }}
              />
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {t.rich('waitlist.hint', {
                  terms: text => (
                    <Link
                      href="/terms"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {text}
                    </Link>
                  ),
                  privacy: text => (
                    <Link
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {text}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

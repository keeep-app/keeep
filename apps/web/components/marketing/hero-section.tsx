import Link from 'next/link';
import Image from 'next/image';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import { WaitlistForm } from './waitlist-form';
import KeeepSnapshot from '@/public/keeep-mockup.png';
import { pick } from 'lodash';
import { IntlMessages } from '@/lib/types/global';
import { Suspense } from 'react';

export const HeroSection: React.FC = () => {
  const t = useTranslations('HeroSection');
  const messages = useMessages() as IntlMessages;
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[600px_1fr] lg:gap-24">
          <Image
            alt="Hero"
            className="order-last mt-8 rounded-md rounded-tl-xl object-cover object-center ring-2 ring-neutral-200 ring-offset-2 sm:w-full lg:mt-0"
            src={KeeepSnapshot}
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="mb-8 space-y-8">
              <h1 className="mx-auto max-w-[80vw] text-center font-accent text-3xl font-bold tracking-[-0.0125em] sm:text-5xl lg:text-left xl:text-6xl/tight">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-[600px] text-center text-gray-500 dark:text-gray-400 md:text-lg lg:mx-0 lg:text-left">
                {t('description')}
              </p>
            </div>
            <div className="mx-auto w-full max-w-md space-y-4 lg:mx-0">
              <NextIntlClientProvider messages={pick(messages, 'Waitlist')}>
                <Suspense>
                  <WaitlistForm
                    translations={{
                      inputLabel: t('waitlist.inputLabel'),
                      submit: t('waitlist.submit'),
                    }}
                  />
                </Suspense>
              </NextIntlClientProvider>
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

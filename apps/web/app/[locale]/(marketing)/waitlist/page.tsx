import Image from 'next/image';
import ThankYouGif from '@/public/thank-you.gif';
import { useTranslations } from 'next-intl';
import { ReferralButton } from '@/components/marketing/referral-button';
import { getBaseUrl } from '@/lib/utils';

export default function Waitlist() {
  const t = useTranslations('Waitlist');
  const baseUrl = getBaseUrl();
  return (
    <>
      <div className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                {t('description')}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <Image
                alt="Humorous GIF"
                className="rounded-lg shadow-lg"
                height="500"
                src={ThankYouGif}
                style={{
                  aspectRatio: '500/500',
                  objectFit: 'cover',
                }}
                width="500"
              />
              <ReferralButton
                label={t('share')}
                baseUrl={baseUrl}
                translation={{
                  toastTitle: t('toasts.title.copied'),
                  toastDescription: t('toasts.description.copied'),
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('shareDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import { LocalePageProps } from '@/lib/types/global';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage({ params: { locale } }: LocalePageProps) {
  unstable_setRequestLocale(locale);

  const t = useTranslations('NotFoundPage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p className="max-w-[460px]">{t('description')}</p>
    </div>
  );
}

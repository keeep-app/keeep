import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Inter, Encode_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/constants';
import clsx from 'clsx';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-encode-sans',
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<LocaleLayoutProps, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });

  return {
    title: t('title'),
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!locales.includes(locale)) notFound();

  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full">
      <Script
        defer
        data-domain="keeep.app"
        src="https://plausible.io/js/script.js"
      />

      <body
        className={clsx(
          encodeSans.variable,
          inter.variable,
          'font-sans',
          'h-full'
        )}
      >
        {children}
      </body>
    </html>
  );
}

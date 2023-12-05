import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'de'];

const inter = Inter({ subsets: ['latin'] });

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
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

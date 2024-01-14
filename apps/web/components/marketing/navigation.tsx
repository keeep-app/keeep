import Link from 'next/link';
import { KeeepIcon, KeeepLogo } from './brand';
// import { useTranslations } from 'next-intl';

export const Navigation: React.FC = () => {
  // const t = useTranslations('Navigation');
  return (
    <header className="flex items-center justify-center px-4 py-4 lg:px-6">
      <div className="flex items-center space-x-10">
        <Link
          className="flex cursor-pointer items-center justify-center gap-2"
          href="/"
        >
          <KeeepIcon className="h-9 w-9" />
          <KeeepLogo className="h-8" />
          <span className="sr-only">Keeep</span>
        </Link>
        {/* <nav className="flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            {t('features')}
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            {t('pricing')}
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            {t('about')}
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            {t('contact')}
          </Link>
        </nav> */}
      </div>
      {/* <Button asChild className="ml-auto" size="sm">
        <Link href="/dashboard">{t('dashboard')}</Link>
      </Button> */}
    </header>
  );
};

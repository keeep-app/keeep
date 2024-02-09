import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/user-auth-form';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import { pick } from 'lodash';
import { IntlMessages, LocalePageProps } from '@/lib/types/global';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function RegisterPage({ params: { locale } }: LocalePageProps) {
  unstable_setRequestLocale(locale);

  const t = useTranslations('RegisterPage');
  const messages = useMessages() as IntlMessages;

  return (
    <>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        {t('loginButton')}
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
          <NextIntlClientProvider messages={pick(messages, 'RegisterForm')}>
            <UserAuthForm type="register" className="mt-8" />
          </NextIntlClientProvider>
          <p className="text-center text-sm text-muted-foreground">
            {t.rich('hint', {
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
    </>
  );
}

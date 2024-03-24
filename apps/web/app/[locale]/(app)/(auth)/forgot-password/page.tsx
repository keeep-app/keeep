import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import { IntlMessages, LocalePageProps } from '@/lib/types/global';
import pick from 'lodash/pick';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ResetPasswordForm } from './ResetPasswordForm';

export default function ForgotPasswordPage({
  params: { locale },
  searchParams,
}: LocalePageProps) {
  unstable_setRequestLocale(locale);

  const t = useTranslations('ForgotPasswordPage');
  const messages = useMessages() as IntlMessages;
  const email = searchParams.email;

  if (typeof email !== 'string' && typeof email !== 'undefined') {
    throw new Error('Invalid nonce');
  }

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
          <NextIntlClientProvider
            messages={pick(messages, 'ForgotPasswordForm')}
          >
            <ResetPasswordForm confirmMail={email} />
          </NextIntlClientProvider>
        </div>
      </div>
    </>
  );
}

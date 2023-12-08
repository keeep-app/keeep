import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/user-auth-form';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import { IntlMessages } from '@/lib/types/global';
import pick from 'lodash/pick';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const messages = useMessages() as IntlMessages;

  return (
    <>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        {t('registerButton')}
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
          <NextIntlClientProvider messages={pick(messages, 'LoginForm')}>
            <UserAuthForm type="login" className="mt-8" />
          </NextIntlClientProvider>
        </div>
      </div>
    </>
  );
}

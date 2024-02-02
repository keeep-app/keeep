import { OnboardingDialog } from '@/components/onboarding/onboarding-dialog';
import { prisma } from '@/lib/server/prisma';
import { getSupabaseServerComponentClient } from '@/lib/server/supabase';
import { IntlMessages, LocalePageProps } from '@/lib/types/global';
import { pick } from 'lodash';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage({
  params: { locale },
}: LocalePageProps) {
  unstable_setRequestLocale(locale);

  const { user } = await getSupabaseServerComponentClient();
  if (!user) return redirect('/login');

  const result = await prisma.organization.findFirst({
    where: { members: { some: { id: user.id } } },
  });

  if (result) return redirect(`/dashboard/${result.slug}`);

  const messages = (await getMessages()) as IntlMessages;

  return (
    <NextIntlClientProvider messages={pick(messages, 'OnboardingDialog')}>
      <OnboardingDialog />
    </NextIntlClientProvider>
  );
}

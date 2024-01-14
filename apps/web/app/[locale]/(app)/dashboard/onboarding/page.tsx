import { OnboardingDialog } from '@/components/onboarding/onboarding-dialog';
import { pick } from 'lodash';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export default function OnboardingPage() {
  const messages = useMessages() as IntlMessages;
  return (
    <NextIntlClientProvider messages={pick(messages, 'OnboardingDialog')}>
      <OnboardingDialog />
    </NextIntlClientProvider>
  );
}

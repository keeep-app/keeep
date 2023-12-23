'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

type ReferralButtonProps = {
  label: string;
  baseUrl: string;
  translation: {
    toastTitle: string;
    toastDescription: string;
  };
};

export const ReferralButton: React.FC<ReferralButtonProps> = props => {
  const searchparams = useSearchParams();
  const referralCode = searchparams.get('referralCode');

  return (
    <Button
      onClick={() => {
        // eslint-disable-next-line no-undef
        navigator.clipboard.writeText(
          `${props.baseUrl}?referralCode=${referralCode}`
        );
        toast({
          title: props.translation.toastTitle,
          description: props.translation.toastDescription,
        });
      }}
    >
      {props.label}
    </Button>
  );
};

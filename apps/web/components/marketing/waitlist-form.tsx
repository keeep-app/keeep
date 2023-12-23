'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitWaitlistForm } from '@/app/actions';
import { toast } from '../ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { useState } from 'react';
import Spinner from '../spinner';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type WaitlistFormProps = {
  translations: {
    inputLabel: string;
    submit: string;
  };
};

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ translations }) => {
  const t = useTranslations('Waitlist');
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const submitWaitlist = async (values: FormValues) => {
    try {
      setLoading(true);

      const waitlistResult = await submitWaitlistForm(values.email);

      if (waitlistResult.error) {
        toast({
          title: t('toasts.title.error'),
          description: waitlistResult.error.message,
        });
        setLoading(false);
        return;
      }

      form.reset({
        email: '',
      });
      toast({
        title: t('toasts.title.success'),
        description: t('toasts.description.success'),
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: t('toasts.title.error'),
        description: t('toasts.description.error'),
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-row gap-2"
        onSubmit={form.handleSubmit(submitWaitlist)}
      >
        <div className="flex-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder={translations.inputLabel} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading} className="relative">
          <span
            className={cn({
              'opacity-0': loading,
              'opacity-100': !loading,
            })}
          >
            {translations.submit}
          </span>
          {loading && <Spinner className="absolute inset-0" />}
        </Button>
      </form>
    </Form>
  );
};

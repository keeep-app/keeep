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

type WaitlistFormProps = {
  translations: {
    inputLabel: string;
    submit: string;
  };
};

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ translations }) => {
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
      console.log('values', values);
      const waitlistResult = await submitWaitlistForm(values.email);
      console.log('waitlistResult', waitlistResult);
      if (waitlistResult.error) {
        toast({
          title: 'Waitlist submission failed',
          description: waitlistResult.error.message,
        });
        setLoading(false);
        return;
      }

      form.reset({
        email: '',
      });
      toast({
        title: 'Waitlist submission successful',
        description: 'Please check your email for confirmation.',
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Waitlist submission failed',
        description: 'Something went wrong. Please try again.',
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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn, getBaseUrl } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/spinner';
import { useSupabase } from '@/lib/provider/supabase';

interface ResetPasswordFormProps {
  confirmMail?: string;
  className?: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  confirmMail,
  className,
}) => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .optional()
      .refine(value => {
        return confirmMail ? !!value : true;
      }),
  });
  type FormValues = z.infer<typeof formSchema>;

  const { toast } = useToast();
  const t = useTranslations('ResetPasswordForm');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    console.log('formState:', form.formState);
  }, [form.formState]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (confirmMail) {
      form.setValue('email', confirmMail);
    }
  }, [confirmMail]);

  async function onSubmit(values: FormValues) {
    console.log(values);
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: `${getBaseUrl()}/password-reset?email=${values.email}`,
      }
    );
    console.log('res:', data, error);
    if (error) {
      toast({
        title: 'Password reset failed',
        description: error.message,
      });
    }
    setLoading(false);
  }

  async function resetPassword(values: FormValues) {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      email: values.email,
      password: values.password,
    });
    console.log('res:', data, error);
    if (error) {
      toast({
        title: 'Password reset failed',
        description: error.message,
      });
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(confirmMail ? resetPassword : onSubmit)}
        className={cn(className, '')}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            disabled={!!confirmMail}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {confirmMail && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Button
          disabled={loading || !form.formState.isValid}
          type="submit"
          className="relative mt-6 w-full"
        >
          <span
            className={cn({
              'opacity-0': loading,
              'opacity-100': !loading,
            })}
          >
            {confirmMail ? 'Reset Password' : 'Request Reset Link'}
          </span>
          {loading && <Spinner className="absolute inset-0" />}
        </Button>
      </form>
    </Form>
  );
};

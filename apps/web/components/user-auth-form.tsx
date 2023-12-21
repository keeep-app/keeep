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
import { useSupabase } from '@/lib/provider/supabase';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { createUser, loginUser } from '../app/actions';
import Spinner from './spinner';

interface UserAuthFormProps {
  type: 'login' | 'register';
  className?: string;
}

export const UserAuthForm: React.FC<UserAuthFormProps> = ({
  type,
  className,
}) => {
  const { supabase } = useSupabase();
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { toast } = useToast();
  const t = useTranslations(type === 'login' ? 'LoginForm' : 'RegisterForm');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!supabase) throw new Error('Supabase client not found');
    setLoading(true);
    if (type === 'login') {
      const { data, error } = await loginUser(values.email, values.password);
      console.log('user', data);
      if (error) {
        setLoading(false);
        toast({
          title: 'Login failed',
          description: error.message,
        });
      } else {
        setLoading(false);
        toast({
          title: 'Login successful',
          description: 'Redirecting to dashboard.',
        });
        router.push('/dashboard');
      }
    } else {
      const { error } = await createUser(values.email, values.password);

      if (error) {
        if (error.message === 'User already registered') {
          setLoading(false);
          toast({
            title: 'Registration failed',
            description:
              'This email is already registered. Please go to the login page.',
          });
        } else {
          setLoading(false);
          toast({
            title: 'Registration failed',
            description: error.message,
          });
        }
      } else {
        setLoading(false);
        form.reset({
          email: '',
          password: '',
        });
        toast({
          title: 'Registration successful',
          description: 'Please check your inbox for the confirmation link.',
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, '')}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email.label')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password.label')}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
                {type === 'login' && (
                  <FormDescription>
                    <Link href="/forgot-password">{t('password.forgot')}</Link>
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="relative mt-6 w-full"
        >
          <span
            className={cn({
              'opacity-0': loading,
              'opacity-100': !loading,
            })}
          >
            {type === 'login' ? 'Login' : 'Register'}
          </span>
          {loading && <Spinner className="absolute inset-0" />}
        </Button>
      </form>
    </Form>
  );
};

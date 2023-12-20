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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!supabase) throw new Error('Supabase client not found');
    if (type === 'login') {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log('user', data);
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
        });
      } else {
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase!.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          emailRedirectTo: process.env.VERCEL_URL
            ? // eslint-disable-next-line turbo/no-undeclared-env-vars
              `https://${process.env.VERCEL_URL}/login`
            : 'http://localhost:3000/login',
        },
      });

      if (error) {
        if (error.message === 'User already registered') {
          toast({
            title: 'Registration failed',
            description:
              'This email is already registered. Please go to the login page.',
          });
        } else {
          toast({
            title: 'Registration failed',
            description: error.message,
          });
        }
      } else {
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
        <Button type="submit" className="mt-6 w-full">
          {type === 'login' ? 'Login' : 'Register'}
        </Button>
      </form>
    </Form>
  );
};

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { useSupabase } from '@/lib/provider/supabase';
import { UserAuthForm } from '@/components/user-auth-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  if (!supabase) {
    return null;
  }
  return (
    <>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Register
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to login
            </p>
            <UserAuthForm type="login" />
          </div>
        </div>
      </div>
    </>
  );
}

'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/supabase/getServerClient';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(email: string, password: string) {
  const validatedFields = createUserSchema.safeParse({
    email,
    password,
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      error: {
        message: 'Invalid form data',
      },
      data: null,
    };
  }

  const supabaseClient = getSupabaseServerClient();

  const { error, data } = await supabaseClient.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      emailRedirectTo: process.env.VERCEL_URL
        ? // eslint-disable-next-line turbo/no-undeclared-env-vars
          `https://${process.env.VERCEL_URL}/login`
        : 'http://localhost:3000/login',
    },
  });

  return { error, data };
}

export async function loginUser(email: string, password: string) {
  const validatedFields = createUserSchema.safeParse({
    email,
    password,
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      error: {
        message: 'Invalid form data',
      },
      data: null,
    };
  }

  const supabaseClient = getSupabaseServerClient();

  const { error, data } = await supabaseClient.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  return { error, data };
}

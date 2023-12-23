'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/server/supabase';
import { prisma } from '../lib/server/prisma';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';

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

export async function submitWaitlistForm(email: string) {
  const existingWaitlistEntry = await prisma.waitlist.findUnique({
    where: {
      email,
    },
  });
  if (existingWaitlistEntry) {
    return {
      error: {
        message: 'Email already exists in waitlist',
      },
      data: null,
    };
  }
  const confirmationCode = nanoid();
  const newWaitlistEntry = await prisma.waitlist.create({
    data: {
      email,
      confirmationCode,
    },
  });
  if (!newWaitlistEntry) {
    return {
      error: {
        message: 'Error creating waitlist entry',
      },
      data: null,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const res = await resend.emails.send({
    from: 'Keeep Waitlist <waitlist@resend.dev>',
    to: email,
    subject: 'Please confirm your Keeep Waitlist entry',
    html: `<p>Click <a href="${
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    }/api/waitlist/confirm?code=${confirmationCode}">here</a> to confirm your email address.</p>`,
  });

  if (res.error) {
    return {
      error: {
        message: 'Error sending confirmation email',
      },
      data: null,
    };
  } else {
    return {
      error: null,
      data: newWaitlistEntry,
    };
  }
}

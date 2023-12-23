'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/server/supabase';
import { prisma } from '@/lib/server/prisma';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getLocale, getTranslations } from 'next-intl/server';

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
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Waitlist' });
  const existingWaitlistEntry = await prisma.waitlist.findUnique({
    where: {
      email,
    },
  });
  if (existingWaitlistEntry) {
    return {
      error: {
        message: t('toasts.description.alreadyRegistered'),
      },
      data: null,
    };
  }
  const confirmationCode = nanoid();
  const referralCode = nanoid();
  const newWaitlistEntry = await prisma.waitlist.create({
    data: {
      email,
      confirmationCode,
      referralCode,
    },
  });
  if (!newWaitlistEntry) {
    return {
      error: {
        message: t('toasts.description.error'),
      },
      data: null,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const res = await resend.emails.send({
    from: 'Keeep Waitlist <waitlist@resend.dev>',
    to: email,
    subject: t('mail.subject'),
    html: `<p>${t.rich('mail.body', {
      link: text =>
        `<a href="${
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000'
        }/api/waitlist/confirm?code=${confirmationCode}">${text}</a>`,
    })}</p>`,
  });

  if (res.error) {
    return {
      error: {
        message: t('toasts.description.confirmationFailed'),
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

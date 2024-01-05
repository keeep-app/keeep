'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/server/supabase';
import { prisma } from '@/lib/server/prisma';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getLocale, getTranslations } from 'next-intl/server';
import { getBaseUrl } from '@/lib/utils';

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

  const baseUrl = getBaseUrl();

  const { error, data } = await supabaseClient.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      emailRedirectTo: `${baseUrl}/login`,
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

export async function submitWaitlistForm(
  email: string,
  referrerCode: string | null
) {
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

  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = getBaseUrl();

  const res = await resend.emails.send({
    from: 'Keeep Waitlist <waitlist@resend.dev>',
    to: email,
    subject: t('mail.subject'),
    html: `<p>${t.rich('mail.body', {
      link: text =>
        `<a href="${baseUrl}/api/waitlist/confirm?code=${confirmationCode}">${text}</a>`,
    })}</p>`,
  });

  if (res.error) {
    return {
      error: {
        message: t('toasts.description.confirmationFailed'),
      },
      data: null,
    };
  }

  const referrer = referrerCode
    ? await prisma.waitlist.findUnique({
        where: {
          referralCode: referrerCode,
        },
      })
    : null;
  const newWaitlistEntry = await prisma.waitlist.create({
    data: {
      email,
      confirmationCode,
      referralCode,
      referrerId: referrer?.id,
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

  return {
    error: null,
    data: newWaitlistEntry,
  };
}

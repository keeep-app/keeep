'use server';

import { z } from 'zod';
import { getSupabaseServerActionClient } from '@/lib/server/supabase';
import { prisma } from '@/lib/server/prisma';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getLocale, getTranslations } from 'next-intl/server';
import { getBaseUrl } from '@/lib/utils';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LinkedInImportContact } from '@/lib/types/import-contacts';
import { getRandomEmoji } from '@/lib/utils/getRandomEmoji';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(email: string, password: string) {
  return await Sentry.withServerActionInstrumentation(
    'createUserAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      const validatedFields = createUserSchema.safeParse({
        email,
        password,
      });

      // Return early if the form data is invalid
      if (!validatedFields.success) {
        Sentry.captureException(new Error('Invalid form data'));
        return {
          error: {
            message: 'Invalid form data',
          },
          data: null,
        };
      }

      const supabase = getSupabaseServerActionClient();

      const baseUrl = getBaseUrl();

      const { error, data } = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        options: {
          emailRedirectTo: `${baseUrl}/login`,
        },
      });

      return { error, data };
    }
  );
}

export async function loginUser(email: string, password: string) {
  return await Sentry.withServerActionInstrumentation(
    'loginUserAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
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

      const supabase = getSupabaseServerActionClient();

      const { error, data } = await supabase.auth.signInWithPassword({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      });

      return { error, data };
    }
  );
}

export async function submitWaitlistForm(
  email: string,
  referrerCode: string | null
) {
  return await Sentry.withServerActionInstrumentation(
    'submitWaitlistFormAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
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
        from: 'Keeep Waitlist <waitlist@keeep.app>',
        to: email,
        subject: t('mail.subject'),
        html: `<p>${t.rich('mail.body', {
          link: text =>
            `<a href="${baseUrl}/api/waitlist/confirm?code=${confirmationCode}">${text}</a>`,
        })}</p>`,
      });

      if (res.error) {
        Sentry.captureException(res.error);
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
        Sentry.captureException(new Error('Failed to create waitlist entry'));
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
  );
}

export async function deleteContacts(
  contactIds: string[],
  orgSlug: string,
  listSlug: string
) {
  return await Sentry.withServerActionInstrumentation(
    'deleteContactsAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      const supabase = getSupabaseServerActionClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          error: {
            message: 'Not authenticated',
          },
          data: null,
        };
      }

      const deletedContacts = await prisma.contact.deleteMany({
        where: {
          externalId: {
            in: contactIds,
          },
          organization: {
            members: { some: { id: user.id } },
          },
        },
      });

      if (!deletedContacts) {
        return {
          error: {
            message: 'Unable to delete contacts',
          },
          data: null,
        };
      }

      revalidatePath(`/dashboard/${orgSlug}/${listSlug}`);

      return {
        error: null,
        data: deletedContacts,
      };
    }
  );
}

export async function importContacts(
  contacts: LinkedInImportContact[],
  orgSlug: string,
  listSlug: string
) {
  return await Sentry.withServerActionInstrumentation(
    'importContactsAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      const supabase = getSupabaseServerActionClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          error: {
            message: 'Not authenticated',
          },
          data: null,
        };
      }

      const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug, members: { some: { id: user.id } } },
        include: { attributes: true, lists: true },
      });

      if (!organization) {
        return { error: { message: 'Organization not found' }, data: null };
      }

      const list = organization.lists.find(list => list.slug === listSlug);

      if (!list) {
        return { error: { message: 'List not found' }, data: null };
      }

      const attributes = organization.attributes;

      const firstNameAttribute = attributes.find(
        attribute => attribute.internalSlug === 'first-name'
      );
      const lastNameAttribute = attributes.find(
        attribute => attribute.internalSlug === 'last-name'
      );
      const emailAttribute = attributes.find(
        attribute => attribute.internalSlug === 'email'
      );

      if (!firstNameAttribute || !lastNameAttribute || !emailAttribute) {
        return {
          error: {
            message: 'Missing required attributes',
          },
          data: null,
        };
      }

      const contactsAttributesToCreate = contacts.map(contact => {
        return {
          [emailAttribute.id]: contact['Email Address'],
          [firstNameAttribute.id]: contact['First Name'],
          [lastNameAttribute.id]: contact['Last Name'],
        };
      });

      const updatedList = await prisma.list.update({
        where: {
          id: list.id,
        },
        data: {
          contacts: {
            create: contactsAttributesToCreate.map(attributes => {
              return {
                attributes,
                organizationId: organization.id,
              };
            }),
          },
        },
      });

      if (!updatedList) {
        return {
          error: {
            message: 'Unable to import contacts',
          },
          data: null,
        };
      }

      revalidatePath(`/dashboard/${orgSlug}/${listSlug}`);

      return {
        error: null,
        data: updatedList,
      };
    }
  );
}

export async function createList() {
  return await Sentry.withServerActionInstrumentation(
    'createListAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      const supabase = getSupabaseServerActionClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          error: {
            message: 'Not authenticated',
          },
          data: null,
        };
      }

      const organization = await prisma.organization.findFirst({
        where: { members: { some: { id: user.id } } },
        include: { lists: true },
      });

      if (!organization) {
        return { error: { message: 'Organization not found' }, data: null };
      }

      const list = await prisma.list.create({
        data: {
          name: 'New List',
          organizationId: organization.id,
          slug: nanoid(),
          icon: getRandomEmoji(),
        },
      });

      if (!list) {
        return {
          error: {
            message: 'Unable to create list',
          },
          data: null,
        };
      }

      revalidatePath(`/dashboard/${organization.slug}/${list.slug}`);

      return {
        error: null,
        data: list,
      };
    }
  );
}

export async function updateList(slug: string, name: string) {
  return await Sentry.withServerActionInstrumentation(
    'updateListAction',
    {
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      const supabase = getSupabaseServerActionClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          error: {
            message: 'Not authenticated',
          },
          data: null,
        };
      }

      const organization = await prisma.organization.findFirst({
        where: { members: { some: { id: user.id } } },
        include: { lists: true },
      });

      if (!organization) {
        return { error: { message: 'Organization not found' }, data: null };
      }

      const list = organization.lists.find(list => list.slug === slug);

      if (!list) {
        return { error: { message: 'List not found' }, data: null };
      }

      const updatedList = await prisma.list.update({
        where: {
          id: list.id,
        },
        data: {
          name,
        },
      });

      if (!updatedList) {
        return {
          error: {
            message: 'Unable to update list',
          },
          data: null,
        };
      }

      revalidatePath(`/dashboard/${organization.slug}/${list.slug}`);

      return {
        error: null,
        data: updatedList,
      };
    }
  );
}

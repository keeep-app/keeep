import { getSupabaseServerComponentClient } from '@/lib/server/supabase';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/server/prisma';

export default async function DashboardRootRedirect() {
  const { user } = await getSupabaseServerComponentClient();
  if (!user) return redirect('/login');

  const result = await prisma.organization.findFirst({
    where: { members: { some: { id: user.id } } },
  });

  if (result) return redirect(`/dashboard/${result.slug}`);

  // TODO: Redirect to onboarding
  return undefined;
}

import { prisma } from '@/lib/server/prisma';
import { NextRequest, NextResponse as Response } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('organization-slug');

  if (!slug) {
    return Response.json(
      { error: 'No organization slug specified' },
      { status: 422 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { slug },
    include: { lists: true },
  });

  if (!organization) {
    return Response.json({ error: 'No organization found' }, { status: 404 });
  }

  return Response.json({ data: organization }, { status: 200 });
}

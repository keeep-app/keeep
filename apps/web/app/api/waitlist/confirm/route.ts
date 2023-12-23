import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/not-found', request.nextUrl).href);
  }

  const user = await prisma.waitlist.update({
    where: {
      confirmationCode: code,
    },
    data: {
      confirmedAt: new Date(),
      doubleOptIn: true,
    },
  });

  if (!user) {
    return NextResponse.redirect(new URL('/not-found', request.nextUrl).href);
  } else {
    return NextResponse.redirect(new URL('/waitlist', request.nextUrl).href);
  }
}

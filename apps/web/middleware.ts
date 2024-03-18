import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './lib/constants';

const intlMiddleware = createMiddleware({
  locales: locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en',
});

const publicPages = [
  '/',
  '/login',
  '/register',
  '/waitlist',
  '/forgot-password',
];
const authPages = ['/login', '/register', '/forgot-password'];
// eslint-disable-next-line no-unused-vars
export async function middleware(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // We need to use `getUser` here because `getSession` does not guarantee to revalidate the auth token,
  // and anyone could spoof the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);
  const isAuthPage = authPages.includes(request.nextUrl.pathname);

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl).href);
  } else if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.nextUrl).href);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

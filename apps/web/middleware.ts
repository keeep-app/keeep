import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isOnAuthPage = ['/login', '/register'].includes(
    request.nextUrl.pathname
  );

  console.log('session', session);
  console.log('isOnAuthPage', isOnAuthPage);

  if (
    !session &&
    !isOnAuthPage &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    response = NextResponse.redirect(new URL('/login', request.nextUrl).href);
  } else if (session && isOnAuthPage) {
    response = NextResponse.redirect(
      new URL('/dashboard', request.nextUrl).href
    );
  }

  return response;
}

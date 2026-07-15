import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const ADMIN_TOKEN_COOKIE = 'admin_token';
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

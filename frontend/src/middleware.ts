import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile');

  // Если пользователь не авторизован и пытается зайти на страницу профиля
  if (!token && isProfilePage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
}; 
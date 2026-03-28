import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/?login=1', req.url));

  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/?login=1', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*']
};

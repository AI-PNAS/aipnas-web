import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionCookieName } from '@/lib/session';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: getSessionCookieName(),
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true, message: 'Signed out successfully.' });
}

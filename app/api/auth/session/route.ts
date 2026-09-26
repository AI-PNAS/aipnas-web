import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionCookieName, verifySessionPayload } from '@/lib/session';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: true, user: null }, { status: 200 });
  }

  const user = verifySessionPayload(sessionToken);

  return NextResponse.json({
    success: true,
    user,
  });
}

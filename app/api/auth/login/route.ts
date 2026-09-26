import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { getSessionCookieName, normalizeRole, signSessionPayload } from '@/lib/session';

const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json());
    const normalizedEmail = payload.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !verifyPassword(payload.password, user.passwordHash)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const sessionToken = signSessionPayload({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: normalizeRole(user.role),
    });

    cookieStore.set({
      name: getSessionCookieName(),
      value: sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: normalizeRole(user.role),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to login',
      },
      { status: 500 }
    );
  }
}

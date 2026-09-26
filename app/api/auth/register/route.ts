import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { getSessionCookieName, normalizeRole, signSessionPayload } from '@/lib/session';

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(120),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['family', 'health_professional']).default('family'),
});

export async function POST(request: NextRequest) {
  try {
    const payload = registerSchema.parse(await request.json());
    const normalizedEmail = payload.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists.',
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: normalizedEmail,
        passwordHash: hashPassword(payload.password),
        role: payload.role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

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
      message: 'Account created successfully.',
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

    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create account',
      },
      { status: 500 }
    );
  }
}

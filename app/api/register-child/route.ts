// API route: Register a new child

import { NextRequest, NextResponse } from 'next/server';
import { registerChild, analyzeAndSaveNutrition, isDatabaseConfigured } from '@/lib/db';
import { registerChildSchema } from '@/lib/validation';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { getSessionUser } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { success: false, message: 'DATABASE_URL is not configured in Vercel Production.', code: 'DATABASE_NOT_CONFIGURED' },
        { status: 503 },
      );
    }
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Sign in is required to register a child.' }, { status: 401 });
    }
    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = registerChildSchema.parse(data);
    if (!validatedData.patientId) {
      validatedData.patientId = `AI-PNAS-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
    }

    // Register child
    const child = await registerChild(validatedData, user.id);

    // Run initial analysis
    const analysis = await analyzeAndSaveNutrition(child.id);

    return NextResponse.json({
      success: true,
      message: 'Child registered successfully',
      child,
      analysis,
      data: { childId: child.id, patientId: child.patientId },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'A child with this patient ID already exists.', code: 'DUPLICATE_PATIENT_ID' },
        { status: 409 },
      );
    }
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

    console.error('Error registering child:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to register child',
        code: 'CHILD_REGISTRATION_FAILED',
      },
      { status: 500 }
    );
  }
}

// API route: Register a new child

import { NextRequest, NextResponse } from 'next/server';
import { registerChild, analyzeAndSaveNutrition } from '@/lib/db';
import { registerChildSchema } from '@/lib/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate input
    const validatedData = registerChildSchema.parse(data);

    // Register child
    const child = await registerChild(validatedData);

    // Run initial analysis
    const analysis = await analyzeAndSaveNutrition(child.id);

    return NextResponse.json({
      success: true,
      message: 'Child registered successfully',
      child,
      analysis,
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

    console.error('Error registering child:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to register child',
      },
      { status: 500 }
    );
  }
}

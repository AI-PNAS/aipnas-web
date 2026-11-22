// API route: Analyze nutrition status

import { NextRequest, NextResponse } from 'next/server';
import { analyzeAndSaveNutrition, getChildById } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Sign in is required.' }, { status: 401 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { childId } = body as { childId?: unknown };

    if (!childId || typeof childId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Child ID is required',
        },
        { status: 400 }
      );
    }

    // Verify child exists
    const child = await getChildById(childId, user);
    if (!child) {
      return NextResponse.json(
        {
          success: false,
          message: 'Child not found',
        },
        { status: 404 }
      );
    }

    const analysis = await analyzeAndSaveNutrition(childId);

    return NextResponse.json({
      success: true,
      message: 'Nutrition analysis completed',
      analysis,
    });
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to analyze nutrition',
      },
      { status: 500 }
    );
  }
}

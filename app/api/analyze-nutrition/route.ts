// API route: Analyze nutrition status

import { NextRequest, NextResponse } from 'next/server';
import { analyzeAndSaveNutrition, getChildById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { childId } = await request.json();

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
    const child = await getChildById(childId);
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

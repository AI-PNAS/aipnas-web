// API route: Get single child by ID

import { NextRequest, NextResponse } from 'next/server';
import { getChildById, getAnalysisHistory } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Child ID is required',
        },
        { status: 400 }
      );
    }

    const child = await getChildById(id);

    if (!child) {
      return NextResponse.json(
        {
          success: false,
          message: 'Child not found',
        },
        { status: 404 }
      );
    }

    const history = await getAnalysisHistory(id);

    return NextResponse.json({
      success: true,
      child,
      history,
    });
  } catch (error) {
    console.error('Error fetching child:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch child',
      },
      { status: 500 }
    );
  }
}

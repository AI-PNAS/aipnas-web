// API route: Get all children

import { NextRequest, NextResponse } from 'next/server';
import { getAllChildren, getChildrenByRiskLevel } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel');

    let children;
    if (riskLevel && ['Low', 'Medium', 'High'].includes(riskLevel)) {
      children = await getChildrenByRiskLevel(riskLevel);
    } else {
      children = await getAllChildren();
    }

    return NextResponse.json({
      success: true,
      count: children.length,
      children,
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch children',
      },
      { status: 500 }
    );
  }
}

// API route: Get all children

import { NextRequest, NextResponse } from 'next/server';
import { getAllChildren, getChildrenByRiskLevel } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Sign in is required.' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel');

    let children;
    if (riskLevel && ['Low', 'Medium', 'High'].includes(riskLevel)) {
      children = await getChildrenByRiskLevel(riskLevel, user);
    } else {
      children = await getAllChildren(user);
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

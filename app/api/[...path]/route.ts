import { NextRequest, NextResponse } from 'next/server';

function json404(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'API endpoint not found.',
      code: 'API_NOT_FOUND',
      path: new URL(request.url).pathname,
    },
    { status: 404 },
  );
}

export async function GET(request: NextRequest) {
  return json404(request);
}

export async function POST(request: NextRequest) {
  return json404(request);
}

export async function PUT(request: NextRequest) {
  return json404(request);
}

export async function PATCH(request: NextRequest) {
  return json404(request);
}

export async function DELETE(request: NextRequest) {
  return json404(request);
}

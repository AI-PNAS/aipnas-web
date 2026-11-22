import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

const captureSchema = z.object({
  childId: z.string().trim().min(1),
  mimeType: z.string().startsWith('image/').max(50),
  data: z.string().startsWith('data:image/'),
  consent: z.literal(true),
});

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Sign in is required.' }, { status: 401 });
  }

  try {
    const payload = captureSchema.parse(await request.json());
    const child = await prisma.child.findFirst({
      where: {
        OR: [
          { id: payload.childId },
          { patientId: payload.childId },
        ],
      },
    });
    if (!child || (user.role !== 'health_professional' && child.createdById !== user.id)) {
      return NextResponse.json({ success: false, message: 'Child not found or access denied.' }, { status: 403 });
    }

    const capture = await prisma.childImage.create({
      data: {
        childId: child.id,
        uploadedById: user.id,
        mimeType: payload.mimeType,
        data: payload.data,
        consent: payload.consent,
      },
    });

    return NextResponse.json({
      success: true,
      capture: { id: capture.id, childId: capture.childId, createdAt: capture.createdAt },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Valid consent and image data are required.', errors: error.errors }, { status: 400 });
    }
    console.error('Camera capture save failed:', error);
    return NextResponse.json({ success: false, message: 'The image could not be saved.' }, { status: 500 });
  }
}

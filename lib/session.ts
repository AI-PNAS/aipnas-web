import { createHmac, timingSafeEqual } from 'crypto';

export type SessionRole = 'family' | 'health_professional';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: SessionRole;
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'aipnas-dev-session-secret-change-me';
const SESSION_NAME = 'aipnas_session';

export function getSessionCookieName(): string {
  return SESSION_NAME;
}

export function signSessionPayload(payload: SessionUser): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  return `${encoded}.${signature}`;
}

export function verifySessionPayload(token: string): SessionUser | null {
  try {
    const [encoded, signature] = token.split('.');

    if (!encoded || !signature) {
      return null;
    }

    const expected = createHmac('sha256', SESSION_SECRET)
      .update(encoded)
      .digest('base64url');

    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== actualBuffer.length) {
      return null;
    }

    if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionUser;

    if (!payload.id || !payload.email || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function normalizeRole(role: string | undefined): SessionRole {
  return role === 'health_professional' ? 'health_professional' : 'family';
}

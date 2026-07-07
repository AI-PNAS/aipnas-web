import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, KEY_LENGTH);
  const providedHash = Buffer.from(hash, 'hex');

  if (computedHash.length !== providedHash.length) {
    return false;
  }

  return timingSafeEqual(computedHash, providedHash);
}

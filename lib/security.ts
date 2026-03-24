import { NextRequest } from 'next/server';

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export function sanitize(value: string) {
  return value.replace(/[<>$]/g, '').trim();
}

export function checkRateLimit(request: NextRequest, limit = 120, windowMs = 60_000) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const now = Date.now();
  const key = ip;
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  memoryStore.set(key, entry);
  return true;
}

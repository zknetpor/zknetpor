import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export type AuthPayload = { id: string; role: 'admin' | 'customer'; email: string };

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function getTokenFromRequest(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7);
  const cookieToken = request.cookies.get('token')?.value;
  return cookieToken || '';
}

export function requireRole(role: 'admin' | 'customer', payload: AuthPayload) {
  if (payload.role !== role) throw new Error('Akses ditolak');
}

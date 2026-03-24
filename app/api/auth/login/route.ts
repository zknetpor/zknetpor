import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { checkRateLimit, sanitize } from '@/lib/security';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, 20)) return NextResponse.json({ message: 'Terlalu banyak request' }, { status: 429 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: 'Payload tidak valid' }, { status: 400 });

  await connectDB();
  const email = sanitize(parsed.data.email.toLowerCase());
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: 'Email / password salah' }, { status: 401 });

  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) return NextResponse.json({ message: 'Email / password salah' }, { status: 401 });

  const token = signToken({ id: String(user._id), email: user.email, role: user.role });
  const response = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  response.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' });
  return response;
}

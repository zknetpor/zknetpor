import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { checkRateLimit, sanitize } from '@/lib/security';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, 15)) return NextResponse.json({ message: 'Terlalu banyak request' }, { status: 429 });
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: 'Payload tidak valid' }, { status: 400 });

  await connectDB();
  const email = sanitize(parsed.data.email.toLowerCase());
  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 });

  const hash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({ name: sanitize(parsed.data.name), email, password: hash, role: 'customer' });
  return NextResponse.json({ id: user._id, email: user.email });
}

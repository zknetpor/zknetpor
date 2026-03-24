import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getTokenFromRequest, verifyToken, requireRole } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request);
  const payload = verifyToken(token);
  requireRole('admin', payload);

  await connectDB();
  const updated = await Product.findByIdAndUpdate(params.id, await request.json(), { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request);
  const payload = verifyToken(token);
  requireRole('admin', payload);

  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}

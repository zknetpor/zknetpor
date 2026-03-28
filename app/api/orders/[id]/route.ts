import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getTokenFromRequest, verifyToken, requireRole } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = verifyToken(getTokenFromRequest(request));
  requireRole('admin', payload);
  await connectDB();

  const updated = await Order.findByIdAndUpdate(params.id, await request.json(), { new: true });
  return NextResponse.json(updated);
}

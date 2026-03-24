import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = verifyToken(getTokenFromRequest(request));
  await connectDB();
  const cart = await Cart.findOne({ userId: payload.id });
  return NextResponse.json(cart || { items: [] });
}

export async function POST(request: NextRequest) {
  const payload = verifyToken(getTokenFromRequest(request));
  const body = await request.json();
  await connectDB();

  const cart = await Cart.findOneAndUpdate(
    { userId: payload.id },
    { $set: { items: body.items || [] } },
    { new: true, upsert: true }
  );

  return NextResponse.json(cart);
}

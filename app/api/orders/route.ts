import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const payload = verifyToken(getTokenFromRequest(request));
  await connectDB();
  const body = await request.json();

  const order = await Order.create({
    ...body,
    userId: payload.id,
    status: 'pending',
    paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'pending'
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET(request: NextRequest) {
  const payload = verifyToken(getTokenFromRequest(request));
  await connectDB();
  const query = payload.role === 'admin' ? {} : { userId: payload.id };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

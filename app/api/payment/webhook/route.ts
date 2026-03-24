import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyMidtransSignature } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
  const valid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
  if (!valid) return NextResponse.json({ message: 'invalid signature' }, { status: 401 });

  const paid = ['settlement', 'capture'].includes(transaction_status);
  await Order.findByIdAndUpdate(order_id, {
    paymentStatus: paid ? 'paid' : 'failed',
    status: paid ? 'paid' : 'pending'
  });

  return NextResponse.json({ ok: true });
}

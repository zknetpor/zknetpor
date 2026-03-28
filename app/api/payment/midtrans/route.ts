import { NextRequest, NextResponse } from 'next/server';
import { createMidtransTransaction } from '@/lib/midtrans';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  verifyToken(getTokenFromRequest(request));
  await connectDB();

  const { orderId } = await request.json();
  const order = await Order.findById(orderId);
  if (!order) return NextResponse.json({ message: 'Order tidak ditemukan' }, { status: 404 });

  const tx = await createMidtransTransaction({
    transaction_details: {
      order_id: String(order._id),
      gross_amount: order.total
    },
    customer_details: {
      first_name: order.address?.receiver || 'Customer',
      phone: order.address?.phone || ''
    }
  });

  order.paymentRef = tx.token;
  await order.save();

  return NextResponse.json(tx);
}

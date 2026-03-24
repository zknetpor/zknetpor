import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  await connectDB();
  const products = await Product.find({ name: { $regex: q, $options: 'i' } }).limit(8);
  return NextResponse.json(products);
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getTokenFromRequest, verifyToken, requireRole } from '@/lib/auth';
import { sanitize } from '@/lib/security';

export async function GET(request: NextRequest) {
  await connectDB();
  const q = request.nextUrl.searchParams;
  const filter: Record<string, unknown> = {};
  if (q.get('category')) filter.category = q.get('category');
  if (q.get('size')) filter.size = { $in: [q.get('size')] };
  if (q.get('minPrice') || q.get('maxPrice')) {
    filter.price = {
      ...(q.get('minPrice') ? { $gte: Number(q.get('minPrice')) } : {}),
      ...(q.get('maxPrice') ? { $lte: Number(q.get('maxPrice')) } : {})
    };
  }

  const sortKey = q.get('sort') === 'price_asc' ? { price: 1 } : q.get('sort') === 'price_desc' ? { price: -1 } : { createdAt: -1 };
  const products = await Product.find(filter).sort(sortKey).limit(100);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = verifyToken(token);
  requireRole('admin', payload);

  const body = await request.json();
  await connectDB();
  const product = await Product.create({
    ...body,
    name: sanitize(body.name),
    description: sanitize(body.description),
    slug: sanitize(body.name.toLowerCase().replace(/\s+/g, '-'))
  });
  return NextResponse.json(product, { status: 201 });
}

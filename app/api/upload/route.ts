import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getTokenFromRequest, verifyToken, requireRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const payload = verifyToken(getTokenFromRequest(request));
  requireRole('admin', payload);

  const data = await request.formData();
  const file = data.get('file') as File;
  if (!file) return NextResponse.json({ message: 'file required' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(base64, { folder: 'zknetpor/products' });
  return NextResponse.json({ url: result.secure_url });
}

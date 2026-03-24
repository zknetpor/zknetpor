import crypto from 'crypto';

const BASE = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export async function createMidtransTransaction(payload: unknown) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const auth = Buffer.from(`${serverKey}:`).toString('base64');

  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Gagal membuat transaksi Midtrans');
  return res.json();
}

export function verifyMidtransSignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const hash = crypto.createHash('sha512').update(`${orderId}${statusCode}${grossAmount}${serverKey}`).digest('hex');
  return hash === signatureKey;
}

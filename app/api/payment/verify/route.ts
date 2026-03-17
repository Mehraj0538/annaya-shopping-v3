import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
      return NextResponse.json({ message: 'Missing verification fields' }, { status: 400 });

    const body     = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expected !== razorpaySignature)
      return NextResponse.json({ message: 'Invalid signature', verified: false }, { status: 400 });

    return NextResponse.json({ verified: true });
  } catch (err: any) {
    console.error('[POST /api/payment/verify]', err);
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}

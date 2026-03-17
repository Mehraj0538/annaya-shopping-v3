import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { amount } = await req.json();
    if (!amount || isNaN(Number(amount)))
      return NextResponse.json({ message: 'Valid amount is required' }, { status: 400 });

    const order = await razorpay.orders.create({
      amount:   Math.round(Number(amount) * 100), // paise
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[POST /api/payment/create-order]', err);
    return NextResponse.json({ message: err.message || 'Payment gateway error' }, { status: 500 });
  }
}

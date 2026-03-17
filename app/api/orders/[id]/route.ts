import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const p = await params;
    const order = await Order.findOne({ orderId: p.id, userId: session.user.sub });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error('[GET /api/orders/:id]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const p = await params;
    const order = await Order.findOne({ orderId: p.id, userId: session.user.sub });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    if (!['pending', 'confirmed'].includes(order.status))
      return NextResponse.json({ message: 'Cannot cancel at this stage' }, { status: 400 });

    order.status = 'cancelled';
    await order.save();
    return NextResponse.json({ order });
  } catch (err) {
    console.error('[PATCH /api/orders/:id]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

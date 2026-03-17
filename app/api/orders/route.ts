import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find({ userId: session.user.sub }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      items, shippingAddress, paymentMethod,
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      subtotal, shipping, total,
    } = body;

    if (!items?.length || !shippingAddress || !paymentMethod)
      return NextResponse.json({ message: 'items, shippingAddress, and paymentMethod are required' }, { status: 400 });

    await connectDB();

    const paymentStatus =
      paymentMethod === 'Cash on Delivery' ? 'pending' : razorpayPaymentId ? 'paid' : 'pending';

    const order = await Order.create({
      userId: session.user.sub,
      items: items.map((item: any) => ({
        productId:     item.id || item._id,
        name:          item.name,
        price:         item.price,
        images:        item.images || [],
        selectedSize:  item.selectedSize,
        selectedColor: item.selectedColor || '',
        quantity:      item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus,
      subtotal,
      shipping,
      total,
    });

    // Clear the user's cart after placing order
    await Cart.findOneAndUpdate({ userId: session.user.sub }, { items: [] });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function PUT(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId, selectedSize, quantity } = await req.json();
    await connectDB();

    const cart = await Cart.findOne({ userId: session.user.sub });
    if (!cart) return NextResponse.json({ message: 'Cart not found' }, { status: 404 });

    const idx = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.selectedSize === selectedSize
    );
    if (idx === -1) return NextResponse.json({ message: 'Item not in cart' }, { status: 404 });

    cart.items[idx].quantity = Math.max(1, quantity);
    await cart.save();
    return NextResponse.json({ cart });
  } catch (err) {
    console.error('[PUT /api/cart/update]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

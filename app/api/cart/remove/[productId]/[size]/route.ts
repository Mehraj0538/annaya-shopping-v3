import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string; size: string }> }
) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.sub });
    if (!cart) return NextResponse.json({ message: 'Cart not found' }, { status: 404 });

    const p = await params;
    const size = decodeURIComponent(p.size);
    cart.items = cart.items.filter(
      (i) => !(i.productId.toString() === p.productId && i.selectedSize === size)
    );
    await cart.save();
    return NextResponse.json({ cart });
  } catch (err) {
    console.error('[DELETE /api/cart/remove]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

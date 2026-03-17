import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    let cart = await Cart.findOne({ userId: session.user.sub });
    if (!cart) cart = await Cart.create({ userId: session.user.sub, items: [] });
    return NextResponse.json({ cart });
  } catch (err) {
    console.error('[GET /api/cart]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

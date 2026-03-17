import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function DELETE(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    await Cart.findOneAndUpdate({ userId: session.user.sub }, { items: [] });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/cart/clear]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import UserProfile from '@/models/UserProfile';

async function checkAdmin(req: NextRequest, res: NextResponse) {
  const session = await getSession(req, res);
  if (!session?.user?.email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  return adminEmails.includes(session.user.email.toLowerCase());
}

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    if (!(await checkAdmin(req, res))) return NextResponse.json({}, { status: 403 });

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    
    // Fetch user details for these orders
    const userIds = [...new Set(orders.map(o => o.userId))];
    const users = await UserProfile.find({ userId: { $in: userIds } }).lean();
    const userMap = users.reduce((acc, u) => {
      acc[u.userId] = u;
      return acc;
    }, {} as Record<string, any>);

    const enrichedOrders = orders.map((o: any) => ({
      ...o,
      customerEmail: userMap[o.userId]?.email || 'Guest',
      customerName: userMap[o.userId]?.name || o.shippingAddress?.fullName || 'Guest',
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (err) {
    console.error('[GET /api/admin/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const res = new NextResponse();
    if (!(await checkAdmin(req, res))) return NextResponse.json({}, { status: 403 });

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ message: 'ID and status required' }, { status: 400 });

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('[PATCH /api/admin/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

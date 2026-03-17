import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    // Auth Check
    if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    if (!adminEmails.includes(session.user.email.toLowerCase())) return NextResponse.json({}, { status: 403 });

    await connectDB();

    // Promises
    const [ordersCount, productsCount, customersCount, orders, totalSalesAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      UserProfile.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(), // recent 5
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    return NextResponse.json({
      metrics: {
        totalSales,
        ordersCount,
        productsCount,
        customersCount,
      },
      recentOrders: orders,
    });
  } catch (err) {
    console.error('[GET /api/admin/dashboard]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

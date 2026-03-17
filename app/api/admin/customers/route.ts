import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    // Auth Check
    if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    if (!adminEmails.includes(session.user.email.toLowerCase())) return NextResponse.json({}, { status: 403 });

    await connectDB();
    const customers = await UserProfile.find().lean();
    
    // Aggregate total spent & orders per user
    const stats = await Order.aggregate([
      { $group: { _id: '$userId', totalSpent: { $sum: '$total' }, totalOrders: { $sum: 1 } } }
    ]);
    
    const statsMap = stats.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {} as Record<string, any>);

    const enrichedCustomers = customers.map(c => ({
      ...c,
      totalOrders: statsMap[c.userId]?.totalOrders || 0,
      totalSpent: statsMap[c.userId]?.totalSpent || 0
    }));

    return NextResponse.json({ customers: enrichedCustomers });
  } catch (err) {
    console.error('[GET /api/admin/customers]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

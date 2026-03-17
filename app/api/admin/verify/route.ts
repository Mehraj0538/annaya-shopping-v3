import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const userEmail = session.user.email.toLowerCase();

    if (!adminEmails.includes(userEmail)) {
      return NextResponse.json({ message: 'Forbidden: Not an Administrator' }, { status: 403 });
    }

    return NextResponse.json({ success: true, email: userEmail, role: 'admin' });
  } catch (err) {
    console.error('[GET /api/admin/verify]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

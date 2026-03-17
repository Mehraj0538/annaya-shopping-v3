import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import mongoose from 'mongoose';

async function getOrCreateProfile(sub: string, payload: any) {
  let profile = await UserProfile.findOne({ userId: sub });
  if (!profile) {
    profile = await UserProfile.create({
      userId:  sub,
      email:   payload?.email   || '',
      name:    payload?.name    || payload?.nickname || 'Royal Member',
      picture: payload?.picture || '',
      wishlist: [],
    });
  }
  return profile;
}

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const profile = await getOrCreateProfile(session.user.sub, session.user);
    const wishlist = profile.wishlist.map((id: mongoose.Types.ObjectId) => id.toString());
    return NextResponse.json({ wishlist });
  } catch (err) {
    console.error('[GET /api/wishlist]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ message: 'productId required' }, { status: 400 });

    await connectDB();
    const profile = await getOrCreateProfile(session.user.sub, session.user);
    const oid = new mongoose.Types.ObjectId(productId);
    const idx = profile.wishlist.findIndex((id: mongoose.Types.ObjectId) => id.equals(oid));

    if (idx >= 0) profile.wishlist.splice(idx, 1);
    else          profile.wishlist.push(oid as any);

    await profile.save();
    const wishlist = profile.wishlist.map((id: mongoose.Types.ObjectId) => id.toString());
    return NextResponse.json({ wishlist });
  } catch (err) {
    console.error('[POST /api/wishlist]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

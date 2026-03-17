import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectDB();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    const product = await Product.findOne({
      $or: [
        ...(isObjectId ? [{ _id: params.id }] : []),
        { slug: params.id }
      ]
    });
    
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    const productObj = product.toObject();
    productObj.id = productObj._id.toString();
    
    return NextResponse.json({ product: productObj });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

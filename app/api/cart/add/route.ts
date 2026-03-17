import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId, selectedSize, selectedColor = '', quantity = 1 } = await req.json();
    if (!productId || !selectedSize)
      return NextResponse.json({ message: 'productId and selectedSize required' }, { status: 400 });

    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    let cart = await Cart.findOne({ userId: session.user.sub });
    if (!cart) cart = await Cart.create({ userId: session.user.sub, items: [] });

    const idx = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.selectedSize === selectedSize
    );
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({
        productId:       product._id,
        name:            product.name,
        price:           product.price,
        originalPrice:   product.originalPrice,
        discountPercent: product.discountPercent,
        images:          product.images,
        category:        product.category,
        sizes:           product.sizes,
        description:     product.description,
        colors:          product.colors,
        selectedSize,
        selectedColor,
        quantity,
      });
    }

    await cart.save();
    return NextResponse.json({ cart });
  } catch (err) {
    console.error('[POST /api/cart/add]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

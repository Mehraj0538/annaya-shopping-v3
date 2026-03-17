/**
 * Seed MongoDB with sample products.
 * Run: npx tsx scripts/seed.ts
 * Safe to run multiple times — upserts by slug.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1); }

/* ── Inline schema (avoids Next.js module resolution during seeding) ──────── */
const ColorSchema  = new mongoose.Schema({ name: String, hex: String });
const ProductSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    slug:            { type: String, required: true, unique: true },
    description:     { type: String, required: true },
    category:        { type: String, required: true },
    images:          [String],
    price:           { type: Number, required: true },
    originalPrice:   { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    sizes:           [String],
    colors:          [ColorSchema],
    stock:           { type: Number, default: 0 },
    rating:          { type: Number, default: 0 },
    reviewCount:     { type: Number, default: 0 },
    isFeatured:      { type: Boolean, default: false },
    isNewArrival:    { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

/* ── Seed data ────────────────────────────────────────────────────────────── */
const products = [
  {
    name: 'Banarasi Silk Saree', slug: 'banarasi-silk-saree', category: 'Sarees',
    description: 'A luxurious Banarasi silk saree with intricate gold zari work. Hand-woven by master artisans of Varanasi.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'],
    price: 12500, originalPrice: 15000, discountPercent: 17,
    sizes: ['Free Size'], colors: [{ name:'Gold', hex:'#D4AF37' },{ name:'Red', hex:'#CC0000' }],
    stock: 15, rating: 4.8, reviewCount: 120, isFeatured: true, isNewArrival: true,
  },
  {
    name: 'Royal Bridal Lehenga', slug: 'royal-bridal-lehenga', category: 'Lehengas',
    description: 'An exquisite bridal lehenga crafted with heavy embroidery and mirror work.',
    images: ['https://images.unsplash.com/photo-1617627143233-5e61f94ed29c?q=80&w=600'],
    price: 45000, originalPrice: 50000, discountPercent: 10,
    sizes: ['XS','S','M','L','XL'], colors: [{ name:'Crimson', hex:'#DC143C' }],
    stock: 8, rating: 4.9, reviewCount: 87, isFeatured: true, isNewArrival: true,
  },
  {
    name: 'Anarkali Festive Set', slug: 'anarkali-festive-set', category: 'Festive Sets',
    description: 'Flowing Anarkali with delicate thread work and a matching dupatta.',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=600'],
    price: 8750, originalPrice: 8750, discountPercent: 0,
    sizes: ['S','M','L','XL'], colors: [{ name:'Rose', hex:'#FF007F' }],
    stock: 22, rating: 4.6, reviewCount: 54, isFeatured: false, isNewArrival: false,
  },
  {
    name: 'Chanderi Silk Kurti', slug: 'chanderi-silk-kurti', category: 'Kurtis',
    description: 'Lightweight Chanderi silk kurti with hand-block printing.',
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600'],
    price: 3200, originalPrice: 3200, discountPercent: 0,
    sizes: ['XS','S','M','L','XL'], colors: [{ name:'Ivory', hex:'#FFFFF0' }],
    stock: 30, rating: 4.4, reviewCount: 39, isFeatured: false, isNewArrival: true,
  },
  {
    name: 'Phulkari Embroidered Dupatta', slug: 'phulkari-embroidered-dupatta', category: 'Dupattas',
    description: 'Stunning dupatta with intricate Phulkari embroidery from Punjab.',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b1ad4?q=80&w=600'],
    price: 2100, originalPrice: 2500, discountPercent: 16,
    sizes: ['Free Size'], colors: [{ name:'Multicolor', hex:'#FF69B4' }],
    stock: 40, rating: 4.7, reviewCount: 63, isFeatured: false, isNewArrival: false,
  },
  {
    name: 'Kundan Jewellery Set', slug: 'kundan-jewellery-set', category: 'Accessories',
    description: 'Handcrafted Kundan necklace with matching earrings.',
    images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=600'],
    price: 6800, originalPrice: 6800, discountPercent: 0,
    sizes: ['Free Size'], colors: [{ name:'Gold', hex:'#D4AF37' }],
    stock: 12, rating: 4.5, reviewCount: 31, isFeatured: true, isNewArrival: true,
  },
  {
    name: 'Velvet Lehenga Set', slug: 'velvet-lehenga-set', category: 'Lehengas',
    description: 'Rich velvet lehenga with gold embossing, a winter festive statement.',
    images: ['https://images.unsplash.com/photo-1580914901432-0c3d5a41bfef?q=80&w=600'],
    price: 28000, originalPrice: 29500, discountPercent: 5,
    sizes: ['XS','S','M','L'], colors: [{ name:'Royal Blue', hex:'#4169E1' }],
    stock: 6, rating: 4.9, reviewCount: 22, isFeatured: true, isNewArrival: true,
  },
  {
    name: 'Rosette Floral Midi Frock', slug: 'rosette-floral-midi-frock-1', category: 'Frock',
    description: 'Elegant yellow floral midi dress with puff sleeves and flowy tiered silhouette.',
    images: ['https://res.cloudinary.com/douvhybil/image/upload/v1772311857/AWP%20Shopping-products/izyxmmy0wuzmwgpc5vfb.jpg'],
    price: 750, originalPrice: 1000, discountPercent: 25,
    sizes: ['S','M','L','XL','XXL','3XL','4XL','5XL','6XL'],
    colors: [{ name:'Yellow', hex:'#F5C518' }],
    stock: 35, rating: 4.5, reviewCount: 70, isFeatured: false, isNewArrival: false,
  },
  {
    name: 'Zardozi Embroidered Kurti', slug: 'zardozi-embroidered-kurti', category: 'Kurtis',
    description: 'Elegant Zardozi embroidered kurti in pure cotton for formal festive wear.',
    images: ['https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?q=80&w=600'],
    price: 4500, originalPrice: 5600, discountPercent: 20,
    sizes: ['XS','S','M','L','XL'], colors: [{ name:'Emerald', hex:'#50C878' }],
    stock: 14, rating: 4.6, reviewCount: 41, isFeatured: false, isNewArrival: false,
  },
  {
    name: 'Embellished Potli Bag', slug: 'embellished-potli-bag', category: 'Accessories',
    description: 'Handcrafted potli bag with mirror work and golden tassels.',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600'],
    price: 1800, originalPrice: 1800, discountPercent: 0,
    sizes: ['Free Size'], colors: [{ name:'Gold', hex:'#D4AF37' }],
    stock: 25, rating: 4.4, reviewCount: 33, isFeatured: false, isNewArrival: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  let inserted = 0, updated = 0;
  for (const p of products) {
    const result = await (Product as any).findOneAndUpdate(
      { slug: p.slug }, { $set: p },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result?.createdAt?.getTime() === result?.updatedAt?.getTime()) inserted++;
    else updated++;
  }

  console.log(`✅  Seeded: ${inserted} inserted, ${updated} updated`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌  Seed failed:', err); process.exit(1); });

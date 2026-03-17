import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IColor { name: string; hex: string; }

export interface IProduct extends Document {
  name:            string;
  slug:            string;
  description:     string;
  category:        string;
  images:          string[];
  price:           number;
  originalPrice:   number;
  discountPercent: number;
  sizes:           string[];
  colors:          IColor[];
  stock:           number;
  rating:          number;
  reviewCount:     number;
  isFeatured:      boolean;
  isNewArrival:    boolean;
  createdAt:       Date;
  updatedAt:       Date;
}

const ColorSchema = new Schema<IColor>({ name: String, hex: String }, { _id: true });

const ProductSchema = new Schema<IProduct>(
  {
    name:            { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true },
    description:     { type: String, required: true },
    category:        { type: String, required: true },
    images:          [{ type: String }],
    price:           { type: Number, required: true, min: 0 },
    originalPrice:   { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    sizes:           [{ type: String }],
    colors:          [ColorSchema],
    stock:           { type: Number, default: 0, min: 0 },
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:     { type: Number, default: 0, min: 0 },
    isFeatured:      { type: Boolean, default: false },
    isNewArrival:    { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Prevent OverwriteModelError during Next.js hot-reload
const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

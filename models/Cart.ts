import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId:       mongoose.Types.ObjectId;
  name:            string;
  price:           number;
  originalPrice:   number;
  discountPercent: number;
  images:          string[];
  category:        string;
  sizes:           string[];
  description:     string;
  colors:          { name: string; hex: string }[];
  selectedSize:    string;
  selectedColor:   string;
  quantity:        number;
}

export interface ICart extends Document {
  userId: string;
  items:  ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId:       { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name:            { type: String, required: true },
    price:           { type: Number, required: true },
    originalPrice:   { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    images:          [{ type: String }],
    category:        { type: String, required: true },
    sizes:           [{ type: String }],
    description:     { type: String },
    colors:          [{ name: String, hex: String }],
    selectedSize:    { type: String, required: true },
    selectedColor:   { type: String, default: '' },
    quantity:        { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items:  [CartItemSchema],
  },
  { timestamps: true }
);

const Cart: Model<ICart> =
  (mongoose.models.Cart as Model<ICart>) ||
  mongoose.model<ICart>('Cart', CartSchema);

export default Cart;

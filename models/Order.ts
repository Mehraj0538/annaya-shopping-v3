import mongoose, { Schema, Document, Model } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    productId:     { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name:          { type: String, required: true },
    price:         { type: Number, required: true },
    images:        [{ type: String }],
    selectedSize:  { type: String, required: true },
    selectedColor: { type: String, default: '' },
    quantity:      { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName:     { type: String, required: true },
    phone:        { type: String, required: true },
    email:        { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    pincode:      { type: String, required: true },
  },
  { _id: false }
);

export interface IOrder extends Document {
  orderId:            string;
  userId:             string;
  items:              any[];
  shippingAddress:    any;
  paymentMethod:      string;
  razorpayOrderId?:   string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus:      'pending' | 'paid' | 'failed';
  subtotal:           number;
  shipping:           number;
  total:              number;
  status:             'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt:          Date;
  updatedAt:          Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `ANN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    userId:              { type: String, required: true, index: true },
    items:               [OrderItemSchema],
    shippingAddress:     { type: ShippingAddressSchema, required: true },
    paymentMethod:       { type: String, required: true },
    razorpayOrderId:     { type: String },
    razorpayPaymentId:   { type: String },
    razorpaySignature:   { type: String },
    paymentStatus:       { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    subtotal:            { type: Number, required: true },
    shipping:            { type: Number, required: true },
    total:               { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

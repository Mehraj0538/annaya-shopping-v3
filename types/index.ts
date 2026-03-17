export interface ProductColor {
  name: string;
  hex:  string;
  _id?: string;
}

/** Matches the existing MongoDB product document schema */
export interface Product {
  id:              string;
  _id?:            string;
  name:            string;
  slug:            string;
  description:     string;
  category:        string;
  images:          string[];
  price:           number;
  originalPrice:   number;
  discountPercent: number;
  sizes:           string[];
  colors:          ProductColor[];
  stock:           number;
  rating:          number;
  reviewCount:     number;
  isFeatured:      boolean;
  isNewArrival:    boolean;
  createdAt?:      string;
}

export interface CartItem extends Product {
  quantity:       number;
  selectedSize:   string;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName:     string;
  phone:        string;
  email:        string;
  addressLine1: string;
  addressLine2?: string;
  city:         string;
  state:        string;
  pincode:      string;
}

export interface OrderItem {
  productId:     string;
  name:          string;
  price:         number;
  images:        string[];
  selectedSize:  string;
  selectedColor: string;
  quantity:      number;
}

export interface Order {
  _id:               string;
  orderId:           string;
  userId:            string;
  items:             OrderItem[];
  shippingAddress:   ShippingAddress;
  paymentMethod:     string;
  razorpayOrderId?:  string;
  razorpayPaymentId?: string;
  paymentStatus:     'pending' | 'paid' | 'failed';
  subtotal:          number;
  shipping:          number;
  total:             number;
  status:            'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt:         string;
}

/** Helper: first image or empty string */
export const getImage = (p: Product | CartItem): string =>
  p.images?.[0] ?? '';

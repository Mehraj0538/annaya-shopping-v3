'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'motion/react';
import {
  User, Package, MapPin, Settings, LogOut,
  ChevronRight, CreditCard, Loader2,
} from 'lucide-react';

interface OrderItem {
  name: string; price: number; images: string[];
  selectedSize: string; quantity: number;
}
interface Order {
  _id: string; orderId: string; items: OrderItem[];
  paymentMethod: string; total: number;
  status: string; createdAt: string;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending:   'bg-amber-50  text-amber-700  border-amber-100',
  shipped:   'bg-blue-50   text-blue-700   border-blue-100',
  delivered: 'bg-purple-50 text-purple-700 border-purple-100',
  cancelled: 'bg-red-50    text-red-600    border-red-100',
};

export default function AccountPage() {
  const { user, isLoading } = useUser();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loadingOrders, setLoadOrd] = useState(true);
  const [view, setView]             = useState<'menu'|'orders'>('menu');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoadOrd(false));
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 size={36} className="animate-spin text-royal-purple" />
    </div>
  );

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center">
      <div className="w-20 h-20 bg-lavender-bg rounded-full flex items-center justify-center">
        <User size={36} className="text-royal-purple/40" />
      </div>
      <h2 className="text-2xl font-serif font-bold">Sign in to your account</h2>
      <p className="text-muted-text text-sm max-w-sm">Access your orders, wishlist and saved addresses by signing in.</p>
      <a href="/api/auth/login"
        className="bg-royal-purple text-white px-12 py-4 rounded-full font-bold shadow-lg shadow-royal-purple/20 hover:opacity-90 transition-opacity">
        Sign In
      </a>
    </div>
  );

  const menuItems = [
    { icon: Package,    label: 'My Orders',       sub: 'Track, return or buy again',  action: () => setView('orders') },
    { icon: MapPin,     label: 'Saved Addresses',  sub: 'Home, Office, etc.',          action: () => {} },
    { icon: CreditCard, label: 'Payment Methods',  sub: 'UPI, Cards, Wallets',         action: () => {} },
    { icon: Settings,   label: 'Account Settings', sub: 'Profile, Security, Privacy', action: () => {} },
  ];

  return (
    <div className="pb-32 bg-lavender-bg min-h-screen">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Account</h1>

        {view === 'orders' ? (
          /* ── Order History ─────────────────────────────────────────── */
          <div>
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-royal-purple font-bold text-sm mb-8 hover:underline">
              ← Back to Account
            </button>
            <h2 className="text-2xl font-serif font-bold mb-6">My Orders</h2>

            {loadingOrders ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-royal-purple" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="text-royal-purple/20 mx-auto mb-4" />
                <p className="text-muted-text mb-6">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-royal-purple font-bold underline underline-offset-4">Start Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map(order => (
                  <motion.div key={order._id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                    className="bg-white rounded-3xl p-6 border border-luxury-border shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-text uppercase tracking-widest font-bold">Order ID</p>
                        <p className="font-serif font-bold text-royal-purple">{order.orderId}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-widest ${statusColors[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.images[0]} alt={item.name} className="w-12 h-14 object-cover rounded-xl flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-xs text-muted-text">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-royal-purple flex-shrink-0">₹{(item.price*item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-luxury-border flex items-center justify-between">
                      <p className="text-xs text-muted-text">
                        {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        {' · '}{order.paymentMethod}
                      </p>
                      <p className="font-bold text-primary-text">₹{order.total.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Main menu ─────────────────────────────────────────────── */
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Profile card */}
            <div className="lg:w-1/3">
              <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
                className="bg-white rounded-[32px] p-8 mb-8 shadow-sm border border-luxury-border flex flex-col items-center text-center">
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={user.name??''} className="w-24 h-24 rounded-full object-cover border-4 border-lavender-bg mb-4" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-royal-purple/10 flex items-center justify-center text-royal-purple mb-4">
                    <User size={48} />
                  </div>
                )}
                <h2 className="text-2xl font-serif font-bold">{user.name || 'Royal Member'}</h2>
                <p className="text-sm text-muted-text mb-2">{user.email}</p>
                {!loadingOrders && (
                  <p className="text-xs text-muted-text mb-6">{orders.length} {orders.length===1?'order':'orders'} placed</p>
                )}
                <button className="w-full bg-lavender-bg text-royal-purple py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-royal-purple hover:text-white transition-all">
                  <Settings size={18} /> Edit Profile
                </button>
              </motion.div>
              <a href="/api/auth/logout"
                className="hidden lg:flex w-full items-center justify-center gap-2 text-red-500 font-bold text-sm p-4 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={18} /> Logout From Account
              </a>
            </div>

            {/* Menu grid */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item, i) => (
                  <motion.button key={item.label} onClick={item.action}
                    initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.08 }}
                    className="bg-white rounded-[24px] p-6 flex items-center gap-5 text-left border border-luxury-border hover:border-royal-purple hover:shadow-md transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-lavender-bg flex items-center justify-center text-royal-purple group-hover:bg-royal-purple group-hover:text-white transition-colors">
                      <item.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold">{item.label}</h3>
                      <p className="text-xs text-muted-text mt-1">{item.sub}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-text group-hover:text-royal-purple transition-colors" />
                  </motion.button>
                ))}
              </div>
              <a href="/api/auth/logout"
                className="lg:hidden mt-12 flex items-center justify-center gap-2 text-red-500 font-bold text-sm">
                <LogOut size={18} /> Logout From Account
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

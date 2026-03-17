'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  IndianRupee, ShoppingBag, Users, Package, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex flex-col gap-4 animate-pulse pt-8">
        <div className="h-10 bg-white/50 w-64 rounded-xl mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/60 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const { metrics, recentOrders } = data;

  const cards = [
    { title: 'Total Revenue',  value: `₹${metrics.totalSales.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Total Orders',   value: metrics.ordersCount,                       icon: ShoppingBag, color: 'text-blue-500',    bg: 'bg-blue-50' },
    { title: 'Active Clients', value: metrics.customersCount,                    icon: Users,       color: 'text-purple-500',  bg: 'bg-purple-50' },
    { title: 'Products',       value: metrics.productsCount,                     icon: Package,     color: 'text-orange-500',  bg: 'bg-orange-50' },
  ];

  return (
    <div className="pt-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-royal-purple mb-2">Dashboard Overview</h1>
        <p className="text-muted-text">Welcome back to your Annaya Admin Portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(c => (
          <div key={c.title} className="bg-white p-6 rounded-3xl border border-luxury-border shadow-sm flex items-center justify-between group hover:border-royal-purple/30 transition-all">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-text mb-2">{c.title}</p>
              <p className="text-3xl font-bold">{c.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <c.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-luxury-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-luxury-border flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-royal-purple hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender-bg/50 text-[10px] uppercase tracking-widest text-muted-text">
                <th className="p-4 font-bold border-b border-luxury-border pl-6">Order ID</th>
                <th className="p-4 font-bold border-b border-luxury-border">Date</th>
                <th className="p-4 font-bold border-b border-luxury-border">Items</th>
                <th className="p-4 font-bold border-b border-luxury-border">Amount</th>
                <th className="p-4 font-bold border-b border-luxury-border">Payment</th>
                <th className="p-4 font-bold border-b border-luxury-border">Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-text">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-lavender-bg/30 transition-colors border-b border-luxury-border last:border-0">
                    <td className="p-4 pl-6 text-sm font-bold font-mono text-royal-purple">{order.orderId || order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-sm text-muted-text">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">{order.items?.length || 0}</td>
                    <td className="p-4 text-sm font-bold">₹{order.total?.toLocaleString()}</td>
                    <td className="p-4">
                      {order.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle2 size={14}/> Paid</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"><Clock size={14}/> Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${order.status === 'delivered' ? 'text-emerald-600 bg-emerald-50' : order.status === 'cancelled' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

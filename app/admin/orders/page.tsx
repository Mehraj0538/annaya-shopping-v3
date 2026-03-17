'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      }
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-royal-purple">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-royal-purple mb-2">Orders Management</h1>
        <p className="text-muted-text">Process and track all customer orders.</p>
      </div>

      <div className="bg-white rounded-3xl border border-luxury-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-lavender-bg/50 text-[10px] uppercase tracking-widest text-muted-text border-b border-luxury-border">
                <th className="p-4 pl-6 font-bold">Order ID</th>
                <th className="p-4 font-bold">Date & Customer</th>
                <th className="p-4 font-bold">Payment</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Action / Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-text">No orders have been placed yet.</td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-lavender-bg/30 transition-colors border-b border-luxury-border last:border-0">
                    
                    <td className="p-4 pl-6">
                      <p className="font-mono font-bold text-sm text-royal-purple">{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-text mt-1">{order.items.length} items</p>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-sm font-bold">{order.customerName}</p>
                      <p className="text-xs text-muted-text">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-xs text-muted-text mt-1">{order.customerEmail}</p>
                    </td>

                    <td className="p-4">
                      {order.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                          <CheckCircle2 size={14}/> Paid via Razorpay
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100">
                          <Clock size={14}/> COD / Pending
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold">₹{order.total?.toLocaleString()}</p>
                    </td>

                    <td className="p-4">
                      <select 
                        disabled={updating === order._id}
                        value={order.status || 'Processing'}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`text-sm font-bold px-4 py-2 rounded-xl outline-none cursor-pointer border shadow-sm transition-colors ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          order.status === 'Shipped'   ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-white text-royal-purple border-luxury-border hover:border-royal-purple'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {updating === order._id && <Loader2 size={14} className="inline ml-2 animate-spin text-royal-purple" />}
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

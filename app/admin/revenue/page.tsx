'use client';

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

export default function AdminRevenue() {
  const [orders, setOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders').then(res => res.json()),
      fetch('/api/admin/dashboard').then(res => res.json())
    ]).then(([ordersData, dashboardData]) => {
      // Filter only paid orders for revenue calculations
      const paidOrders = (ordersData.orders || []).filter((o: any) => o.paymentStatus === 'paid');
      setOrders(paidOrders);
      setMetrics(dashboardData.metrics);
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-royal-purple">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  // Basic calculations based on available data
  const averageOrderValue = orders.length > 0 ? Math.round(metrics.totalSales / orders.length) : 0;
  
  // Group by date for a simple table breakdown
  const dailyRevenue = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = { date, total: 0, orders: 0 };
    acc[date].total += order.total;
    acc[date].orders += 1;
    return acc;
  }, {} as Record<string, { date: string; total: number; orders: number }>);

  const revenueByDate = Object.values(dailyRevenue).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pt-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-royal-purple mb-2">Revenue Analytics</h1>
        <p className="text-muted-text">Financial overview and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-royal-purple text-white p-8 rounded-3xl shadow-lg shadow-royal-purple/20 relative overflow-hidden">
          <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Total Gross Volume</p>
          <h2 className="text-4xl font-serif font-bold mb-4">₹{metrics.totalSales.toLocaleString()}</h2>
          <div className="flex items-center gap-2 text-sm bg-white/20 inline-flex px-3 py-1 rounded-full backdrop-blur-sm">
             <ArrowUpRight size={16} /> 100% Captured
          </div>
        </div>

        <div className="bg-white border border-luxury-border p-8 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
            <CreditCard size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-text mb-1">Average Order Value</p>
          <h2 className="text-3xl font-serif font-bold text-royal-purple mb-2">₹{averageOrderValue.toLocaleString()}</h2>
          <p className="text-sm text-emerald-600 font-bold flex items-center gap-1"><TrendingUp size={16} /> Healthy API routing</p>
        </div>

        <div className="bg-white border border-luxury-border p-8 rounded-3xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
            <IndianRupee size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-text mb-1">Total Paid Orders</p>
          <h2 className="text-3xl font-serif font-bold text-royal-purple mb-2">{orders.length}</h2>
          <p className="text-sm text-emerald-600 font-bold flex items-center gap-1"><ArrowUpRight size={16} /> Settled via Razorpay</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-luxury-border shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-luxury-border">
          <h2 className="text-xl font-serif font-bold">Daily Revenue Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender-bg/50 text-[10px] uppercase tracking-widest text-muted-text border-b border-luxury-border">
                <th className="p-4 pl-6 font-bold">Date</th>
                <th className="p-4 font-bold text-center">Paid Transactions</th>
                <th className="p-4 font-bold text-right pr-6">Gross Volume</th>
              </tr>
            </thead>
            <tbody>
              {revenueByDate.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-text">No recorded transactions.</td>
                </tr>
              ) : (
                revenueByDate.map((day: any) => (
                  <tr key={day.date} className="hover:bg-lavender-bg/30 transition-colors border-b border-luxury-border last:border-0">
                    <td className="p-4 pl-6 font-bold text-royal-purple">{day.date}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">
                        {day.orders}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 text-lg font-bold text-emerald-600">
                      ₹{day.total.toLocaleString()}
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

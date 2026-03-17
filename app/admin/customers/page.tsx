'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, MapPin } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setLoading(false);
      });
  }, []);

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
        <h1 className="text-3xl font-serif font-bold text-royal-purple mb-2">Customer Base</h1>
        <p className="text-muted-text">View and manage your registered boutique clients.</p>
      </div>

      <div className="bg-white rounded-3xl border border-luxury-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-lavender-bg/50 text-[10px] uppercase tracking-widest text-muted-text border-b border-luxury-border">
                <th className="p-4 pl-6 font-bold w-12">Avatar</th>
                <th className="p-4 font-bold">Client Name</th>
                <th className="p-4 font-bold">Contact Info</th>
                <th className="p-4 font-bold text-center">Total Orders</th>
                <th className="p-4 font-bold text-right pr-6">Lifetime Value</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-text">No registered customers found.</td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c._id} className="hover:bg-lavender-bg/30 transition-colors border-b border-luxury-border last:border-0">
                    
                    <td className="p-4 pl-6">
                      <img src={c.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} alt={c.name} 
                           className="w-12 h-12 rounded-full object-cover border border-luxury-border shadow-sm bg-white" />
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold text-royal-purple">{c.name}</p>
                      <p className="text-[10px] text-muted-text uppercase tracking-widest mt-1">Joined {new Date(c.createdAt || Date.now()).toLocaleDateString()}</p>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-text mb-1"><Mail size={14}/> {c.email || 'No email provided'}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-text"><MapPin size={14}/> Address captured at checkout</div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                        {c.totalOrders}
                      </span>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <p className="text-lg font-bold text-emerald-600">₹{c.totalSpent?.toLocaleString()}</p>
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

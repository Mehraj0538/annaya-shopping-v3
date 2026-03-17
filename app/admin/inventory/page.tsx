'use client';

import { useEffect, useState } from 'react';
import { Loader2, PackageSearch, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/inventory')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-royal-purple mb-2">Inventory Ledger</h1>
          <p className="text-muted-text">Monitor your product catalog and stock levels.</p>
        </div>
        <button className="bg-royal-purple text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-royal-purple/20 hover:scale-105 transition-transform flex items-center gap-2">
          <PackageSearch size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-luxury-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-lavender-bg/50 text-[10px] uppercase tracking-widest text-muted-text border-b border-luxury-border">
                <th className="p-4 pl-6 font-bold w-16">Item</th>
                <th className="p-4 font-bold">Details</th>
                <th className="p-4 font-bold text-center">Category</th>
                <th className="p-4 font-bold text-center">Sizing & Stats</th>
                <th className="p-4 font-bold text-center">Stock</th>
                <th className="p-4 font-bold text-right pr-6">Current Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-text">No products in the registry.</td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p._id} className="hover:bg-lavender-bg/30 transition-colors border-b border-luxury-border last:border-0">
                    
                    <td className="p-4 pl-6">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-lavender-bg border border-luxury-border flex items-center justify-center text-royal-purple/30">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold text-royal-purple leading-tight max-w-[200px] truncate" title={p.name}>{p.name}</p>
                      <p className="text-[10px] text-muted-text uppercase tracking-widest mt-1">ID: {p._id.slice(-6)}</p>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-lavender-bg rounded-full text-[10px] font-bold uppercase tracking-widest text-royal-purple">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <p className="text-xs font-bold text-muted-text">{p.sizes?.join(', ')}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {p.colors?.map((c: any) => (
                          <div key={c.name} className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs border
                        ${p.stock <= 5 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
                      `}>
                        {p.stock}
                      </span>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-bold text-emerald-600">₹{p.price.toLocaleString()}</p>
                        {p.discountPercent > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 rounded">-{p.discountPercent}%</span>
                            <span className="text-[10px] text-muted-text line-through">₹{p.originalPrice?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Search as SearchIcon, X, TrendingUp, Clock } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`)
        .then(res => res.json())
        .then(data => {
          setResults(data.products || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const trending = ['Sarees', 'Lehengas', 'Festive Drop', 'Bridal', 'Frock'];
  const recent   = ['Banarasi Silk', 'Purple Lehenga'];

  return (
    <div className="bg-white min-h-screen">
      {/* Search header */}
      <div className="sticky top-0 z-50 bg-white p-4 flex items-center gap-4 border-b border-luxury-border">
        <button onClick={() => router.back()} className="p-2 text-muted-text"><X size={24} /></button>
        <div className="flex-1 relative">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
          <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search royal collection…"
            className="w-full bg-lavender-bg rounded-2xl py-3 pl-12 pr-10 outline-none focus:ring-2 ring-royal-purple/10 text-sm" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {query.length < 2 ? (
            <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4 text-muted-text">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map(t => (
                    <button key={t} onClick={() => setQuery(t)}
                      className="px-4 py-2 bg-lavender-bg rounded-full text-xs font-medium hover:bg-royal-purple hover:text-white transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4 text-muted-text">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Recent Searches</span>
                </div>
                <div className="flex flex-col gap-4">
                  {recent.map(r => (
                    <button key={r} onClick={() => setQuery(r)} className="text-left text-sm font-medium hover:text-royal-purple transition-colors">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <h2 className="text-sm font-bold text-muted-text mb-6 uppercase tracking-widest">
                {results.length} Result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
              </h2>
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {results.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-muted-text">No products found matching your search.</p>
                  <button onClick={() => setQuery('')} className="mt-4 text-royal-purple font-bold text-sm underline underline-offset-4">
                    Clear Search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

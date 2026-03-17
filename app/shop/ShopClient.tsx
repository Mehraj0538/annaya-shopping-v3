'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

const SORT_OPTIONS = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

function ShopClientContent({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams                       = useSearchParams();
  const [filterOpen, setFilterOpen]        = useState(false);
  const [selectedCat, setSelectedCat]      = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy]                = useState('Featured');
  
  const filtered = useMemo(() => {
    let list = initialProducts.filter(p =>
      selectedCat === 'All' || p.category === selectedCat
    );
    if (searchParams.get('filter') === 'new') list = list.filter(p => p.isNewArrival);
    switch (sortBy) {
      case 'Price: Low to High':  return [...list].sort((a,b) => a.price - b.price);
      case 'Price: High to Low':  return [...list].sort((a,b) => b.price - a.price);
      case 'Newest':              return [...list].sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
      default:                    return [...list].sort((a,b) => (b.isFeatured?1:0)-(a.isFeatured?1:0));
    }
  }, [selectedCat, sortBy, searchParams, initialProducts]);

  const dynamicCategories = useMemo(() => {
    return Array.from(new Set(initialProducts.map(p => p.category))).sort();
  }, [initialProducts]);

  return (
    <div className="pb-32 bg-lavender-bg min-h-screen">
      <div className="bg-white px-4 md:px-12 py-10 md:py-16 border-b border-luxury-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Royal Collection</h1>
          <p className="text-muted-text text-sm md:text-base max-w-2xl">
            Explore our curated selection of premium feminine fashion.
          </p>
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="sticky top-16 z-40 glass px-4 py-3 flex items-center justify-between border-b border-luxury-border md:hidden">
        <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 text-sm font-medium">
          <Filter size={18} /> Filter
        </button>
        <span className="text-xs text-muted-text">{filtered.length} Results</span>
        <button className="flex items-center gap-1 text-sm font-medium">
          {sortBy} <ChevronDown size={16} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 flex gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col gap-10 w-64 flex-shrink-0 sticky top-32 h-fit">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-text mb-6">Categories</h3>
            <div className="flex flex-col gap-3">
              {['All', ...dynamicCategories].map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className={`text-sm font-medium text-left transition-colors ${selectedCat === cat ? 'text-royal-purple font-bold' : 'text-primary-text hover:text-royal-purple'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-text mb-6">Sort By</h3>
            <div className="flex flex-col gap-3">
              {SORT_OPTIONS.map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`text-sm font-medium text-left transition-colors ${sortBy === s ? 'text-royal-purple font-bold' : 'text-primary-text hover:text-royal-purple'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="hidden md:flex items-center justify-between mb-8">
            <span className="text-sm text-muted-text">{filtered.length} Royal pieces</span>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={18} className="text-muted-text" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-text">No products in this category.</div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="p-2 bg-lavender-bg rounded-full"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-text mb-4">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...dynamicCategories].map(cat => (
                      <button key={cat} onClick={() => setSelectedCat(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${selectedCat === cat ? 'bg-royal-purple border-royal-purple text-white' : 'border-luxury-border text-muted-text'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setFilterOpen(false)}
                  className="w-full bg-royal-purple text-white py-4 rounded-2xl font-bold shadow-lg shadow-royal-purple/20">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <Suspense fallback={<div className="pb-32 bg-lavender-bg min-h-screen flex items-center justify-center font-serif text-2xl text-royal-purple">Loading Catalog...</div>}>
      <ShopClientContent initialProducts={initialProducts} />
    </Suspense>
  );
}

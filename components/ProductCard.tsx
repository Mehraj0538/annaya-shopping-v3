'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product, getImage } from '@/types';
import { useApp } from '@/context/AppContext';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const wishlisted = isWishlisted(product.id);
  const image      = getImage(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm">
        <Link href={`/product/${product.id}`} prefetch={false}>
          {image ? (
            <Image
              src={image} alt={product.name} fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-lavender-bg" />
          )}
        </Link>

        <button onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 rounded-full glass text-primary-text hover:text-royal-purple transition-colors z-10">
          <Heart size={18} fill={wishlisted ? '#5A2D82' : 'none'}
            className={wishlisted ? 'text-royal-purple' : ''} />
        </button>

        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-royal-purple text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider z-10">
            New
          </span>
        )}
        {product.discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 bg-white/90 text-deep-purple text-[10px] px-2 py-1 rounded-full font-bold z-10">
            -{product.discountPercent}%
          </span>
        )}

        <button onClick={() => addToCart(product, product.sizes[0])}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-royal-purple text-white shadow-lg z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-serif text-sm font-medium text-primary-text truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-royal-purple font-bold text-sm">₹{product.price.toLocaleString()}</p>
          {product.originalPrice > product.price && (
            <p className="text-muted-text text-xs line-through">₹{product.originalPrice.toLocaleString()}</p>
          )}
        </div>
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] text-muted-text font-medium">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CategoryCapsule({
  name, isActive, onClick,
}: { name: string; isActive?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
        isActive
          ? 'bg-royal-purple text-white shadow-md'
          : 'bg-white text-muted-text border border-luxury-border hover:border-royal-purple/30'
      }`}
    >
      {name}
    </button>
  );
}

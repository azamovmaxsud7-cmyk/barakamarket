import React from 'react';
import { Heart, Plus, Minus, Star, ShieldCheck, Eye, Percent, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDiscount } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    updateQuantity,
    getCartItemQuantity,
    toggleWishlist,
    isInWishlist,
    openProductModal
  } = useStore();

  const quantity = getCartItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);
  const isYellow = product.isYellowPrice || (product.oldPrice && product.oldPrice > product.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`group relative flex flex-col justify-between rounded-lg sm:rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-xl ${
        isYellow 
          ? 'bg-gradient-to-b from-amber-500/[0.07] to-stone-950/80 border-amber-500/25 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
          : 'bg-white/[0.03] border-white/10 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10'
      }`}
    >
      {/* Top Image area - Ultra-compact on mobile */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />

        {/* Clean Badges Overlay */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 flex flex-col gap-0.5 z-10 items-start pointer-events-none">
          {/* Yellow Price Badge */}
          {isYellow && (
            <span className="px-1 py-0.5 text-[6.5px] sm:text-[8px] md:text-[9px] font-black bg-amber-400 text-black rounded sm:rounded-md shadow-xs tracking-wider uppercase flex items-center gap-0.5">
              <Percent className="w-1.5 h-1.5 sm:w-2 sm:h-2 stroke-[3]" />
              Sariq
            </span>
          )}

          {/* Discount Percent */}
          {product.discountPercent && !isYellow && (
            <span className="px-1 py-0.5 text-[6.5px] sm:text-[8px] md:text-[9px] font-black bg-rose-500 text-white rounded sm:rounded-md shadow-xs font-mono">
              {formatDiscount(product.discountPercent)}
            </span>
          )}

          {/* 1+1 Aksiya */}
          {product.isBuyOneGetOne && (
            <span className="px-1 py-0.5 text-[6.5px] sm:text-[8px] md:text-[9px] font-black bg-purple-600 text-white rounded sm:rounded-md shadow-xs font-mono flex items-center gap-0.5">
              <Gift className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
              1+1
            </span>
          )}

          {/* Halal badge */}
          {product.isHalal && !isYellow && !product.discountPercent && !product.isBuyOneGetOne && (
            <span className="px-1 py-0.5 text-[6.5px] sm:text-[8px] font-bold bg-teal-500/90 text-black rounded sm:rounded-md shadow-xs backdrop-blur-md flex items-center gap-0.5 font-mono">
              <ShieldCheck className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
              Halol
            </span>
          )}
        </div>

        {/* Quick Actions (Wishlist & View) */}
        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex flex-col gap-1 z-10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Sevimlilarga qo'shish"
            className={`p-1 sm:p-1.5 rounded sm:rounded-lg backdrop-blur-xl border transition-all cursor-pointer ${
              inWishlist
                ? 'bg-rose-500 text-white border-rose-400 shadow-xs'
                : 'bg-black/60 hover:bg-black/90 text-stone-300 hover:text-rose-400 border-white/15'
            }`}
          >
            <Heart className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => {
              e.stopPropagation();
              openProductModal(product);
            }}
            aria-label="Batafsil ko'rish"
            className="p-1 sm:p-1.5 rounded sm:rounded-lg bg-black/60 hover:bg-black/90 text-stone-300 hover:text-orange-400 border border-white/15 backdrop-blur-xl transition-all hidden sm:flex items-center justify-center cursor-pointer"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </motion.button>
        </div>

        {/* Click to open modal */}
        <div
          onClick={() => openProductModal(product)}
          className="absolute inset-0 cursor-pointer"
        />
      </div>

      {/* Product Content Details */}
      <div className="p-1 sm:p-2 sm:p-2.5 md:p-3 flex flex-col justify-between flex-1 gap-1">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[7px] sm:text-[9px] text-stone-400 mb-0.5">
            <span className="truncate max-w-[60px] sm:max-w-[90px] font-semibold text-orange-400/90 uppercase tracking-wider">
              {product.brand || product.origin || 'Baraka'}
            </span>
            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 fill-current" />
              {product.rating}
            </span>
          </div>

          {/* Product Name */}
          <h4
            onClick={() => openProductModal(product)}
            className="text-[9.5px] xs:text-[10px] sm:text-xs md:text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer leading-tight tracking-tight min-h-[22px] sm:min-h-[28px]"
          >
            {product.name}
          </h4>

          {/* Volume / Weight */}
          <p className="text-[7px] sm:text-[9px] text-stone-400 mt-0.5 truncate">
            {product.weightOrVolume}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-1 sm:pt-1.5 border-t border-white/10 flex items-center justify-between gap-1">
          <div className="min-w-0 flex-1">
            <div className={`text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-sm font-black font-mono truncate ${
              isYellow ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {formatCurrency(product.price)}
            </div>
            {product.oldPrice ? (
              <div className="text-[6.5px] sm:text-[8px] text-stone-500 line-through truncate font-mono">
                {formatCurrency(product.oldPrice)}
              </div>
            ) : (
              <div className="text-[6.5px] sm:text-[8px] text-stone-400 truncate">
                Mavjud
              </div>
            )}
          </div>

          {/* Cart Stepper Controls */}
          <div className="shrink-0">
            {quantity === 0 ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => addToCart(product)}
                aria-label="Savatga qo'shish"
                className={`w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded sm:rounded-lg text-black font-black flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                  isYellow
                    ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                    : 'bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 shadow-orange-500/20'
                }`}
              >
                <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </motion.button>
            ) : (
              <div className="flex items-center bg-white/10 border border-white/20 rounded sm:rounded-lg overflow-hidden shadow-xs h-5 sm:h-7 md:h-8">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="px-0.5 sm:px-1.5 h-full text-stone-300 hover:bg-white/15 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Kamaytirish"
                >
                  <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </motion.button>
                <span className="px-0.5 font-mono font-black text-[8px] sm:text-xs text-amber-300 min-w-[13px] text-center">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => addToCart(product, 1)}
                  className="px-0.5 sm:px-1.5 h-full text-stone-300 hover:bg-white/15 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Ko'paytirish"
                >
                  <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

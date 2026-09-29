import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CategoryId, Product } from '../types';

// The 6 distinct categories for daily rotation
const DAILY_DEAL_CATEGORIES: CategoryId[] = [
  'sut',
  'gosht',
  'meva_sabzavot',
  'ichimliklar',
  'non_qandolat',
  'baqqollik'
];

export const DailyDeals: React.FC = () => {
  const { products, mobileGridCols, setMobileGridCols } = useStore();

  // Calculate real countdown until midnight (end of the current day)
  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next 00:00:00
    const diffMs = midnight.getTime() - now.getTime();

    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeUntilMidnight);
  const [dayKey, setDayKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeUntilMidnight();
      setTimeLeft(remaining);

      // Check if day changed
      const d = new Date();
      const currentDayKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (currentDayKey !== dayKey) {
        setDayKey(currentDayKey);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dayKey]);

  // Dynamically select 1 product from each of the 6 distinct categories per day
  const dailyDealsProducts = useMemo(() => {
    const now = new Date();
    // Unique day number (e.g. day of year or timestamp day count)
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const selected: Product[] = [];

    DAILY_DEAL_CATEGORIES.forEach((catId, index) => {
      const catProducts = products.filter(p => p.categoryId === catId);
      if (catProducts.length > 0) {
        // Daily rotation formula: shifts each day so tomorrow gets a different product
        const productIndex = (dayOfYear * 3 + index * 2) % catProducts.length;
        const originalProduct = catProducts[productIndex];

        // Ensure this daily deal has a special daily discount (10% to 25%)
        const discountRates = [15, 20, 12, 18, 25, 14];
        const assignedDiscount = originalProduct.discountPercent || discountRates[index % discountRates.length];

        let promoPrice = originalProduct.price;
        let oldPrice = originalProduct.oldPrice;

        if (!oldPrice || !originalProduct.discountPercent) {
          // If no old price, make the current price discounted from an old price
          oldPrice = Math.round((originalProduct.price * (1 + assignedDiscount / 100)) / 1000) * 1000;
        }

        selected.push({
          ...originalProduct,
          discountPercent: assignedDiscount,
          oldPrice: oldPrice,
          price: promoPrice
        });
      }
    });

    return selected;
  }, [products, dayKey]);

  if (dailyDealsProducts.length === 0) return null;

  return (
    <section className="py-2.5 sm:py-5 w-full max-w-full overflow-hidden box-border" id="daily-deals-section">
      {/* Header with timer and Immersive UI styling */}
      <div className="relative p-2.5 sm:p-4 md:p-5 bg-gradient-to-r from-red-950/70 via-stone-900/90 to-amber-950/70 border border-red-500/30 rounded-xl sm:rounded-2xl text-white shadow-xl backdrop-blur-2xl mb-2 sm:mb-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-2 sm:gap-3.5 relative z-10">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-black shadow-md shadow-red-500/30 shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-black animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <h2 className="text-xs xs:text-sm sm:text-lg md:text-xl font-black tracking-tight uppercase">
                Kun <span className="text-red-400">Takliflari</span> & Chegirmalar
              </h2>
              <span className="px-1.5 py-0.5 text-[7px] sm:text-[9px] font-black uppercase tracking-wider bg-red-500 text-white rounded-full shadow-xs flex items-center gap-0.5">
                <RefreshCw className="w-2 h-2 sm:w-2.5 sm:h-2.5 animate-spin-slow" />
                Har kuni yangilanadi
              </span>
            </div>
            <p className="text-[9px] sm:text-xs text-stone-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>6 ta alohida toifadan sarxil aksiya mahsulotlari</span>
              <span className="text-amber-400 font-semibold hidden sm:inline">• Har 24 soatda almashadi</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap relative z-10 shrink-0">
          {/* Mobile 2 / 3 Column Switcher */}
          <div className="flex items-center bg-black/60 backdrop-blur-xl p-0.5 sm:p-1 rounded-lg border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setMobileGridCols(2)}
              className={`px-1.5 py-0.5 rounded text-[8px] sm:text-xs font-bold transition-all cursor-pointer ${
                mobileGridCols === 2 ? 'bg-orange-500 text-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              2 ustun
            </button>
            <button
              type="button"
              onClick={() => setMobileGridCols(3)}
              className={`px-1.5 py-0.5 rounded text-[8px] sm:text-xs font-bold transition-all cursor-pointer ${
                mobileGridCols === 3 ? 'bg-orange-500 text-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              3 ustun (ixcham)
            </button>
          </div>

          {/* Live Countdown Timer with Neon Display */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-xl px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10 shadow-md shrink-0">
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span className="text-[8px] sm:text-xs text-stone-300 font-medium">Yangilanish:</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 font-mono font-black text-[10px] sm:text-sm text-amber-400">
              <span className="bg-white/10 px-1 py-0.5 rounded border border-white/5 text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/10 px-1 py-0.5 rounded border border-white/5 text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white/10 px-1 py-0.5 rounded border border-white/5 text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Distinct Category Discount Products Grid */}
      <div className={`grid ${
        mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
      } sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-2 md:gap-3`}>
        {dailyDealsProducts.map(product => (
          <ProductCard key={`${dayKey}-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  );
};

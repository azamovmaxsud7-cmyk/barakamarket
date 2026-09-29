import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Zap, 
  Layers, 
  ArrowUpDown, 
  Search,
  ChevronRight,
  X,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, SortOption } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/categories';
import { sounds } from '../utils/audio';

export const SmartShoppingHub: React.FC = () => {
  const { 
    products, 
    filters, 
    setFilters, 
    resetFilters, 
    setIsCatalogOpen,
    setIsCourierPanelOpen,
    setIsCourierAuthenticated,
    mobileGridCols,
    setMobileGridCols
  } = useStore();

  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Secret Press-and-Hold for Courier Panel on "AQLLI XARID & TAVSIYALAR"
  const [courierHoldProgress, setCourierHoldProgress] = useState(0);
  const [isHoldingCourier, setIsHoldingCourier] = useState(false);
  const courierHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const courierProgressAnimRef = useRef<number | null>(null);
  const courierHoldStartTimeRef = useRef<number>(0);
  const didTriggerCourierRef = useRef<boolean>(false);

  const HOLD_DURATION = 1300; // 1.3 seconds hold

  const cancelCourierHold = useCallback(() => {
    if (courierHoldTimerRef.current) {
      clearTimeout(courierHoldTimerRef.current);
      courierHoldTimerRef.current = null;
    }
    if (courierProgressAnimRef.current) {
      cancelAnimationFrame(courierProgressAnimRef.current);
      courierProgressAnimRef.current = null;
    }
    setIsHoldingCourier(false);
    setCourierHoldProgress(0);
  }, []);

  const updateCourierProgress = useCallback(() => {
    if (!courierHoldStartTimeRef.current) return;
    const elapsed = Date.now() - courierHoldStartTimeRef.current;
    const progress = Math.min(100, Math.round((elapsed / HOLD_DURATION) * 100));
    setCourierHoldProgress(progress);

    if (elapsed < HOLD_DURATION) {
      courierProgressAnimRef.current = requestAnimationFrame(updateCourierProgress);
    }
  }, []);

  const handleCourierHoldStart = () => {
    didTriggerCourierRef.current = false;
    setIsHoldingCourier(true);
    courierHoldStartTimeRef.current = Date.now();
    setCourierHoldProgress(0);

    courierProgressAnimRef.current = requestAnimationFrame(updateCourierProgress);

    courierHoldTimerRef.current = setTimeout(() => {
      didTriggerCourierRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 100]);
      }
      sounds.playNotification();
      // Ensure PIN 0254 prompt is shown
      setIsCourierAuthenticated(false);
      setIsCourierPanelOpen(true);
      cancelCourierHold();
    }, HOLD_DURATION);
  };

  const handleCourierHoldEnd = () => {
    cancelCourierHold();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (courierHoldTimerRef.current) clearTimeout(courierHoldTimerRef.current);
      if (courierProgressAnimRef.current) cancelAnimationFrame(courierProgressAnimRef.current);
    };
  }, []);

  // Active Category details if one is selected
  const activeCategoryObj = filters.category !== 'all' 
    ? CATEGORIES.find(c => c.id === filters.category) 
    : null;

  // Filter smart products
  const getFilteredSmartProducts = (): Product[] => {
    let list = [...products];

    // Category filter override from global navbar or catalog if active
    if (filters.category !== 'all') {
      list = list.filter(p => p.categoryId === filters.category);
      if (filters.subcategory && filters.subcategory !== 'all') {
        list = list.filter(p => p.subcategoryId === filters.subcategory);
      }
    }

    if (filters.onlyDiscount) {
      list = list.filter(p => (p.discountPercent && p.discountPercent > 0) || p.oldPrice);
    }

    // Sort products
    return list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'popular':
        default:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });
  };

  const smartProducts = getFilteredSmartProducts();
  const displayedProducts = smartProducts.slice(0, visibleCount);

  return (
    <section className="py-3 sm:py-5 border-t border-white/10 w-full max-w-full overflow-hidden box-border" id="smart-shopping-section">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
        <div>
          {/* Active Category Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase select-none relative inline-block transition-all">
            {activeCategoryObj ? (
              <span>{activeCategoryObj.name}</span>
            ) : filters.searchQuery ? (
              <span>"{filters.searchQuery}" bo‘yicha mahsulotlar</span>
            ) : (
              <span>Mahsulotlar</span>
            )}
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-0.5 max-w-xl">
            {activeCategoryObj ? activeCategoryObj.tagline : "Tanlangan toifadagi sifatli supermarket mahsulotlari"}
          </p>
        </div>

        {/* Sort & View Mode trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          {/* Mobile 2 / 3 Column Switcher */}
          <div className="flex items-center bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMobileGridCols(2)}
              className={`px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                mobileGridCols === 2 ? 'bg-orange-500 text-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              2 ustun
            </button>
            <button
              type="button"
              onClick={() => setMobileGridCols(3)}
              className={`px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                mobileGridCols === 3 ? 'bg-orange-500 text-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              3 ustun
            </button>
          </div>

          <div className="flex items-center bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer text-xs"
            >
              <option value="popular" className="bg-stone-900 text-white">Eng ommabop</option>
              <option value="price_asc" className="bg-stone-900 text-white">Arzonroqdan boshlab</option>
              <option value="price_desc" className="bg-stone-900 text-white">Qimmatroqdan boshlab</option>
              <option value="rating" className="bg-stone-900 text-white">Yuqori reytingli</option>
              <option value="discount" className="bg-stone-900 text-white">Katta chegirma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Category Bar if a category is selected */}
      {activeCategoryObj && (
        <div className="mb-4 p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-orange-500/20 text-orange-400">
              {activeCategoryObj.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {activeCategoryObj.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {smartProducts.length} ta mahsulot
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {activeCategoryObj.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {activeCategoryObj.subcategories.map(sub => {
              const isSubActive = (filters.subcategory || 'all') === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setFilters(prev => ({ ...prev, subcategory: sub.id }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}

            <button
              onClick={() => setFilters(prev => ({ ...prev, category: 'all', subcategory: 'all' }))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-stone-400 transition-colors cursor-pointer ml-1"
              title="Filtrni tozalash"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className={`grid ${
            mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
          } sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-2 md:gap-3`}>
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Show More or View Full Catalog Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-5 sm:mt-6 pt-3 border-t border-white/5">
            {visibleCount < smartProducts.length ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Yana 6 ta ko‘rsatish ({smartProducts.length - visibleCount} ta qoldi)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : null}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCatalogOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-stone-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-stone-950" />
              <span>Supermarket Mega Menyusi</span>
            </motion.button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-xl">
          <Search className="w-8 h-8 text-stone-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">
            Ushbu toifada mahsulot topilmadi
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mb-3">
            Boshqa saralash yoki toifani tanlang.
          </p>
          <button
            onClick={() => {
              resetFilters();
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 text-xs font-black rounded-full cursor-pointer"
          >
            Bosh holatga qaytish
          </button>
        </div>
      )}
    </section>
  );
};

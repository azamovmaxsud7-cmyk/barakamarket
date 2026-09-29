import React from 'react';
import { ChefHat, Clock, Users, Plus, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MEAL_KITS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

export const MealKitsSection: React.FC = () => {
  const { products, addToCart, setIsCartOpen } = useStore();

  const handleAddBundle = (kitId: string) => {
    const kit = MEAL_KITS.find(k => k.id === kitId);
    if (!kit) return;

    kit.productIds.forEach(pid => {
      const prod = products.find(p => p.id === pid);
      if (prod) {
        addToCart(prod, 1);
      }
    });

    setIsCartOpen(true);
  };

  return (
    <section className="py-3 sm:py-5 border-t border-white/10 w-full max-w-full overflow-hidden box-border" id="meal-kits-section">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-0.5">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Retseptlar & Taom To‘plamlari</span>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
            Tayyor Taom <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">To‘plamlari</span>
          </h2>
        </div>
        <p className="text-stone-400 text-[11px] sm:text-xs hidden md:block max-w-sm text-right">
          Barcha masalliqlarni 1 ta tugma orqali savatga chegirma bilan qo‘shing
        </p>
      </div>

      {/* Responsive Container: Horizontal Scroll on Mobile, 3-Col Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none snap-x w-full max-w-full">
        {MEAL_KITS.map(kit => {
          const kitProducts = kit.productIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

          const originalTotal = kitProducts.reduce(
            (sum, p) => sum + (p ? p.price : 0),
            0
          );
          const bundleDiscount = Math.round((originalTotal * kit.discount) / 100);
          const discountedTotal = originalTotal - bundleDiscount;

          return (
            <motion.div
              key={kit.id}
              whileHover={{ y: -3 }}
              className="min-w-[220px] sm:min-w-0 max-w-[240px] sm:max-w-none shrink-0 snap-start bg-white/[0.04] rounded-xl sm:rounded-2xl border border-white/10 shadow-xs hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between group backdrop-blur-xl"
            >
              {/* Compact Banner Image */}
              <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden bg-black/40">
                <img
                  src={kit.image}
                  alt={kit.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent" />

                {/* Bundle Discount Badge */}
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                  <span className="px-2 py-0.5 bg-amber-400 text-black font-black text-[9px] sm:text-[10px] rounded-full shadow-xs flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    -{kit.discount}% Chegirma
                  </span>
                </div>

                {/* Time & Servings Meta */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                  <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-medium">
                    <Clock className="w-2.5 h-2.5 text-emerald-400" />
                    {kit.cookingTime}
                  </span>
                  <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-medium">
                    <Users className="w-2.5 h-2.5 text-amber-400" />
                    {kit.servings}
                  </span>
                </div>
              </div>

              {/* Compact Body */}
              <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight truncate">
                    {kit.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                    {kit.description}
                  </p>

                  {/* Included Ingredients Preview */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
                      {kitProducts.slice(0, 3).map(p => p && (
                        <span
                          key={p.id}
                          className="text-[9px] sm:text-[10px] bg-white/5 border border-white/10 text-stone-300 px-1.5 py-0.2 rounded-md flex items-center gap-0.5"
                        >
                          <Check className="w-2 h-2 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[70px]">{p.name}</span>
                        </span>
                      ))}
                      {kitProducts.length > 3 && (
                        <span className="text-[9px] bg-white/5 border border-white/10 text-stone-400 px-1 py-0.2 rounded-md">
                          +{kitProducts.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Add All Button */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                  <div>
                    <div className="text-[8px] sm:text-[9px] text-stone-500 line-through font-mono">
                      {formatCurrency(originalTotal)}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-400 leading-tight font-mono">
                      {formatCurrency(discountedTotal)}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddBundle(kit.id)}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 rounded-xl text-[10px] sm:text-xs font-black shadow-xs flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3" />
                    <span>To‘plamni olish</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { 
  StoreProvider, 
  useStore 
} from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DailyDeals } from './components/DailyDeals';
import { SmartShoppingHub } from './components/SmartShoppingHub';
import { MealKitsSection } from './components/MealKitsSection';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourierPanelModal } from './components/courier/CourierPanelModal';
import { CatalogMegaMenu } from './components/CatalogMegaMenu';
import { BarakaClubModal } from './components/BarakaClubModal';
import { BranchDeliveryModal } from './components/BranchDeliveryModal';
import { InventoryAuditModal } from './components/inventory/InventoryAuditModal';

const MainContent: React.FC = () => {
  const { 
    setIsCartOpen,
    cartTotalCount,
    cartSubtotal,
    filters
  } = useStore();

  return (
    <main className="w-full max-w-7xl mx-auto px-2 sm:px-5 md:px-6 pb-12 sm:pb-20 space-y-2.5 sm:space-y-6 md:space-y-8 relative z-10 box-border">
      {/* 1. Hero Promo Carousel */}
      <HeroBanner />

      {/* 2. Daily Flash Deals Countdown */}
      <DailyDeals />

      {/* 3. Category Products Showcase (only when user selects a category or searches) */}
      {(filters.category !== 'all' || (filters.searchQuery && filters.searchQuery.trim().length > 0)) && (
        <SmartShoppingHub />
      )}

      {/* 4. Meal Kits / Bundle Builder Section */}
      <MealKitsSection />

      {/* Floating mobile cart bar */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-4 left-3 right-3 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 rounded-2xl font-black text-xs xs:text-sm shadow-2xl shadow-orange-500/40 flex items-center justify-between border border-amber-300/40 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-stone-950 text-amber-400 font-black text-xs flex items-center justify-center">
                {cartTotalCount}
              </div>
              <span className="truncate">Savatchaga o‘tish</span>
            </div>
            <span className="font-mono font-black shrink-0">{cartSubtotal.toLocaleString()} so'm</span>
          </button>
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen w-full max-w-full bg-[#050505] text-[#f0f0f0] font-sans selection:bg-orange-500 selection:text-black flex flex-col justify-between relative overflow-x-hidden">
        {/* Ambient Glow Orbs contained with pointer-events-none */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-orange-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-amber-600/10 blur-[120px] rounded-full" />
          <div className="absolute top-[40%] right-[5%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-500/[0.05] blur-[130px] rounded-full" />
          <div className="absolute top-[70%] left-[5%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-rose-500/[0.04] blur-[130px] rounded-full" />
        </div>

        <Navbar />
        <MainContent />

        {/* Global Modals, Drawers & Supermarket Controls */}
        <CatalogMegaMenu />
        <BarakaClubModal />
        <BranchDeliveryModal />
        <ProductQuickViewModal />
        <CartDrawer />
        <CheckoutModal />
        <WishlistModal />
        <OrderSuccessModal />
        <AdminDashboard />
        <CourierPanelModal />
        <InventoryAuditModal />
      </div>
    </StoreProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Tag, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  badge: string;
  badgeColor: string;
  categoryId?: CategoryId;
  image: string;
  accentGlow: string;
  borderAccent: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Ertalabki Sarxil Sut & Tandir Nonlari',
    subtitle: 'Har kuni ertalab yangi pishgan Samarqand nonlari va qishloq tabiiy sut mahsulotlari eshigingiz oldida.',
    highlight: '20% GACHA TEJOV',
    badge: 'Har kuni ertalab yangi',
    badgeColor: 'bg-amber-400 text-black',
    categoryId: 'sut',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=1200&q=80',
    accentGlow: 'bg-blue-600/20',
    borderAccent: 'group-hover:border-blue-500/50',
    buttonText: 'Sut bo‘limiga o‘tish'
  },
  {
    id: 2,
    title: '100% Halol Saralangan Go‘sht Mahsulotlari',
    subtitle: 'Yosh buzoq va qo‘y go‘shti, sifatli qiyma, tovuq go‘shtlari va tansiq Samarqand qazisi 45 daqiqada yetkaziladi.',
    highlight: 'HALOL SERTIFIKATLI',
    badge: '100% Halol Go‘sht',
    badgeColor: 'bg-red-500 text-white',
    categoryId: 'gosht',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
    accentGlow: 'bg-red-600/20',
    borderAccent: 'group-hover:border-red-500/50',
    buttonText: 'Go‘sht bo‘limini ochish'
  },
  {
    id: 3,
    title: 'Quyoshli Bog‘lardan Shirin Meva-Sabzavotlar',
    subtitle: 'Namangan olmasi, Farg‘ona uzumi, Yusupov pomidorlari va xushbo‘y ko‘katlar — to‘g‘ridan-to‘g‘ri daladan.',
    highlight: 'VITAMINLARGA BOY',
    badge: '100% Tabiiy & Organik',
    badgeColor: 'bg-emerald-500 text-black',
    categoryId: 'meva_sabzavot',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    accentGlow: 'bg-emerald-600/20',
    borderAccent: 'group-hover:border-emerald-500/50',
    buttonText: 'Meva-sabzavotlarni ko‘rish'
  }
];

export const HeroBanner: React.FC = () => {
  const { setFilters } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const handleAction = () => {
    if (slide.categoryId) {
      setFilters(prev => ({
        ...prev,
        category: slide.categoryId as CategoryId,
        subcategory: 'all',
        searchQuery: ''
      }));
      const smartSection = document.getElementById('smart-shopping-section');
      if (smartSection) {
        smartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAksiyalarClick = () => {
    const dealsSection = document.getElementById('daily-deals-section');
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setFilters(prev => ({ ...prev, onlyDiscount: true }));
    }
  };

  return (
    <div className="py-2 sm:py-4 w-full max-w-full overflow-hidden box-border">
      {/* Main Carousel Card with Immersive UI Styling */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 text-white shadow-2xl backdrop-blur-2xl transition-all group w-full max-w-full">
        {/* Ambient Blur Orbs */}
        <div className={`absolute top-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] ${slide.accentGlow} blur-[90px] sm:blur-[120px] rounded-full transition-all duration-700 pointer-events-none`} />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-orange-600/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

        {/* Background Image with Gradient Mask */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover object-center mix-blend-luminosity"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 p-2.5 sm:p-7 md:p-9 max-w-3xl flex flex-col justify-between min-h-[155px] sm:min-h-[320px] md:min-h-[360px]">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2.5">
              <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[7.5px] sm:text-xs font-black uppercase tracking-wider ${slide.badgeColor} shadow-md flex items-center gap-1`}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                {slide.badge}
              </span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[7.5px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-amber-300 border border-white/15">
                {slide.highlight}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-sm xs:text-base sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight text-white">
              {slide.title.split(' ')[0]} <span className="text-orange-500">{slide.title.split(' ').slice(1, 3).join(' ')}</span> {slide.title.split(' ').slice(3).join(' ')}
            </h1>

            {/* Subtitle */}
            <p className="text-[10px] sm:text-sm md:text-base text-stone-300 mt-1 sm:mt-2 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none">
              {slide.subtitle}
            </p>
          </div>

          {/* Action Row & Indicators */}
          <div className="pt-2 sm:pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleAction}
                className="px-3.5 py-1.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-black font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 flex items-center gap-1 sm:gap-2 transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAksiyalarClick}
                className="px-3 py-1.5 sm:px-5 sm:py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-stone-200 hover:text-white font-bold text-xs sm:text-sm border border-white/10 transition-colors cursor-pointer uppercase tracking-wider"
              >
                Aksiyalar
              </motion.button>
            </div>

            {/* Carousel Slide Indicators & Arrows */}
            <div className="flex items-center justify-between sm:justify-end gap-2 pt-0.5 sm:pt-0">
              <div className="flex gap-1 sm:gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-4 sm:w-7 bg-orange-500' : 'w-1 sm:w-1.5 bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="p-1 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Oldingi slayd"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                  className="p-1 sm:p-2 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Keyingi slayd"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quick Supermarket Feature Badges - Sleek 3-col on Mobile */}
      <div className="grid grid-cols-3 gap-1 sm:gap-3 mt-1.5 sm:mt-2.5">
        <div className="bg-white/[0.03] backdrop-blur-xl p-1.5 sm:p-3 rounded-lg sm:rounded-2xl border border-white/10 hover:border-blue-500/40 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left group">
          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-wider truncate">Tezkor Yetkazish</h4>
            <p className="text-[11px] text-stone-400 mt-0.5 hidden sm:block">Samarqand bo‘ylab 30-45 daqiqa ichida</p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl p-1.5 sm:p-3 rounded-lg sm:rounded-2xl border border-white/10 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left group">
          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-wider truncate">100% Sifat & Halol</h4>
            <p className="text-[11px] text-stone-400 mt-0.5 hidden sm:block">Saralangan yangi mahsulotlar</p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl p-1.5 sm:p-3 rounded-lg sm:rounded-2xl border border-white/10 hover:border-rose-500/40 transition-colors flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left group">
          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-wider truncate">Hamyonbop Narx</h4>
            <p className="text-[11px] text-stone-400 mt-0.5 hidden sm:block">Doimiy supermarket chegirmalari</p>
          </div>
        </div>
      </div>
    </div>
  );
};

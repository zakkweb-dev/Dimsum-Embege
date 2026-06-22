import { ArrowRight, Flame, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { HERO_IMAGE } from "../data";

interface HeroProps {
  onExploreMenu: () => void;
  heroBgUrl?: string;
}

export default function Hero({ onExploreMenu, heroBgUrl }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-b from-brand-cream-100 to-white pt-28 pb-16 flex items-center overflow-hidden"
    >
      {/* Decorative Ornaments Background */}
      <div className="absolute top-24 left-[-10%] w-72 h-72 rounded-full bg-brand-red-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-96 h-96 rounded-full bg-brand-cream-400/20 blur-4xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Sisi Kiri: Deskripsi & Judul */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-red-50 text-brand-red-600 border border-brand-red-100 font-semibold text-xs tracking-wide uppercase">
              <Flame size={14} className="fill-brand-red-500 animate-pulse text-brand-red-500" />
              Sajian Dimsum Ter-Hitz Abis!
            </div>

            {/* Judul Utama */}
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[85px] text-gray-900 tracking-tight leading-[0.85] uppercase">
              DIMSUM <br />
              <span className="text-brand-red-600 relative inline-block">
                EMBEGE
              </span>
            </h1>

            {/* Subjudul */}
            <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
              Dimsum lezat, hangat, dan kekinian. Camilan favorit anak muda dengan rasa premium untuk hari spesialmu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-8 py-4 bg-brand-red-600 hover:bg-brand-red-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-brand-red-600/30 hover:shadow-brand-red-600/40 transition-all duration-200 flex items-center justify-center gap-2 group text-base"
                id="hero-order-cta"
              >
                Pesan Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
              
              <a
                href="#menu"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-brand-cream-50 active:scale-95 text-gray-800 border-2 border-brand-cream-200 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-sm"
              >
                Lihat Menu
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-6 border-t border-brand-cream-200/60 max-w-lg">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" alt="avatar" />
                </div>
                <div>
                  <div className="flex items-center text-amber-500 fill-amber-500 text-xs">
                    {"★★★★★"}
                  </div>
                  <p className="text-xs text-gray-500 font-semibold">500+ Reviews</p>
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                <span className="text-brand-red-600 font-bold">100%</span> Halal & Bersih
              </div>
            </div>
          </motion.div>

          {/* Sisi Kanan: Visual Hero Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            {/* Main Visual Image Ring / Frame */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500 bg-brand-cream-200">
              <img
                src={heroBgUrl || HERO_IMAGE}
                alt="Dimsum Embege Steaming Dimsum Street Stall"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Floating Bubble Badge 1: Fresh & Steaming */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 sm:left-4 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-brand-cream-200 shadow-lg flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold text-lg">
                💨
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Penyajian</p>
                <p className="text-xs text-gray-800 font-extrabold leading-none mt-1">Dibuat Fresh & Hangat</p>
              </div>
            </motion.div>

            {/* Floating Bubble Badge 2: Best Seller Dimsum Bakar */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -right-4 sm:right-4 px-4 py-3 rounded-2xl bg-emerald-950 text-white shadow-xl flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles size={16} className="animate-spin-slow" />
              </div>
              <div>
                <p className="text-[9px] text-emerald-300 font-bold uppercase leading-none">Best Seller</p>
                <p className="text-xs text-white font-extrabold leading-none mt-1">Dimsum Bakar Smoky</p>
              </div>
            </motion.div>

            {/* Floating Bubble Badge 3: Custom Text */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-8 sm:-right-4 transform -translate-y-1/2 px-3.5 py-2 rounded-xl bg-brand-red-600 text-white shadow-lg flex items-center gap-1.5"
            >
              <Heart size={14} className="fill-white text-white animate-pulse" />
              <div className="text-[11px] font-extrabold tracking-wide uppercase">Bisa Custom Tulisan!</div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

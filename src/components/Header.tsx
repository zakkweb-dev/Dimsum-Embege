import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", href: "#home" },
    { title: "About Us", href: "#about" },
    { title: "Menu", href: "#menu" },
    { title: "Cara Order", href: "#how-to-order" },
    { title: "Review", href: "#testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-cream-200/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-brand-red-600 flex items-center justify-center text-white shadow-md shadow-brand-red-600/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-brand-red-600 leading-none">
                DIMSUM EMBEGE
              </span>
              <span className="text-[10px] font-semibold text-brand-cream-500 tracking-widest leading-none mt-1">
                STREET FOOD DIMSUM
              </span>
            </div>
          </a>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="font-medium text-gray-700 hover:text-brand-red-600 transition-colors duration-200 text-sm relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-red-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.title}
              </a>
            ))}
          </nav>

          {/* Tombol Aksi Kanan */}
          <div className="flex items-center gap-4">
            {/* Tombol Keranjang Belanja */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-red-600 transition-all duration-200 hover:scale-105 select-none focus:outline-none"
              aria-label="Buka Keranjang"
              id="header-cart-btn"
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5.5 h-5.5 rounded-full bg-brand-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Tombol Mobile Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-brand-cream-100 text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigasi Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-b border-brand-cream-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-brand-red-50 hover:text-brand-red-600 transition-all duration-200"
                >
                  {link.title}
                </a>
              ))}
              <div className="pt-2 px-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCart();
                  }}
                  className="w-full py-3 rounded-xl bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Lihat Keranjang ({cartCount})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

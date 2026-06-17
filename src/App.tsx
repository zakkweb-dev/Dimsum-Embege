import { useState, useEffect } from "react";
import { MessageSquare, Moon, Sun, ArrowUpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import HowToOrder from "./components/HowToOrder";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import { CartItem, Product } from "./types";
import { WHATSAPP_NUMBER } from "./data";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem("embege_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Gagal memuat data keranjang lokal:", e);
      }
    }
  }, []);

  // Sync cart to localStorage on changes
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("embege_cart", JSON.stringify(newCart));
  };

  // Scroll listener for top-up button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark Mode side effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, customMessage?: string) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.customMessage === customMessage
    );

    let updatedCart = [...cartItems];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity, customMessage });
    }

    saveCartToStorage(updatedCart);
    
    // Automatically trigger cart open to guide user
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, customMessage: string | undefined, delta: number) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === productId && item.customMessage === customMessage
    );

    if (existingIndex > -1) {
      let updatedCart = [...cartItems];
      const newQty = updatedCart[existingIndex].quantity + delta;
      
      if (newQty <= 0) {
        updatedCart.splice(existingIndex, 1);
      } else {
        updatedCart[existingIndex].quantity = newQty;
      }
      saveCartToStorage(updatedCart);
    }
  };

  const handleRemoveItem = (productId: string, customMessage: string | undefined) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.product.id === productId && item.customMessage === customMessage)
    );
    saveCartToStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  const handleExploreMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCartTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const generalInquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20Dimsum%20Embege,%20saya%20tertarik%20tanya-tanya%20menunya%20dong!`;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
      
      {/* Dark/Light mode theme switch button (Float top-left) */}
      <div className="fixed top-24 left-4 sm:left-6 z-30">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-900/90 text-gray-700 dark:text-brand-cream-300 border border-brand-cream-200/55 dark:border-gray-800 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          title={isDarkMode ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
          id="theme-toggler"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Header Sticky Navigation */}
      <Header cartCount={getCartTotalItems()} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero onExploreMenu={handleExploreMenu} />

        {/* Brand Core Identity / About US Section */}
        <About />

        {/* Interactive Culinary Menu & Customizable Generator Section */}
        <Menu onAddToCart={handleAddToCart} />

        {/* Step-by-Step Order Pipeline Section */}
        <HowToOrder />

        {/* Customer Social Review Wall Section */}
        <Testimonials />
      </main>

      {/* Footer Section holding Contact maps and Copyright */}
      <Footer />

      {/* Slidable Shopping Cart drawer (Checkout) */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Interactive Helper Floaters */}

      {/* FLOATING ACTION: WhatsApp Direct order popup (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Scroll Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={handleScrollToTop}
              className="p-3 rounded-xl bg-gray-900 hover:bg-black text-white shadow-xl flex items-center justify-center transition-all duration-200"
              aria-label="Kembali ke atas"
              id="btn-scroll-top"
            >
              <ArrowUpCircle size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating "Pesan Sekarang" Launcher */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="relative group"
        >
          {/* Wave expansion effect behind */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
          
          <button
            onClick={() => {
              if (cartItems.length > 0) {
                // Open sliding order bag
                setIsCartOpen(true);
              } else {
                // If cart is empty, open general WhatsApp chat
                window.open(generalInquiryUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className="relative px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 transition-all duration-200"
            title="Chat Order Dimsum Embege"
            id="floating-wa-btn"
          >
            <MessageSquare size={18} className="fill-white stroke-none text-emerald-600" />
            <span>Pesan Sekarang</span>
            {getCartTotalItems() > 0 && (
              <span className="bg-brand-red-600 text-white font-black rounded-full text-[10px] w-5 h-5 flex items-center justify-center animate-bounce">
                {getCartTotalItems()}
              </span>
            )}
          </button>
        </motion.div>
      </div>

    </div>
  );
}

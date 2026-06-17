import { useState } from "react";
import { Plus, Minus, Check, Sparkles, X, MessageCircle, AlertCircle, LayoutGrid, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { MENU_ITEMS } from "../data";

interface MenuProps {
  onAddToCart: (product: Product, quantity: number, customMessage?: string) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [selectedCustomProduct, setSelectedCustomProduct] = useState<Product | null>(null);
  const [customText, setCustomText] = useState("HBD");
  const [quantity, setQuantity] = useState(1);
  const [justAddedProduct, setJustAddedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleOpenCustomizer = (product: Product) => {
    setSelectedCustomProduct(product);
    setCustomText("HBD");
    setQuantity(1);
  };

  const handleCloseCustomizer = () => {
    setSelectedCustomProduct(null);
  };

  const handleAddStandard = (product: Product) => {
    onAddToCart(product, 1);
    setJustAddedProduct(product.id);
    setTimeout(() => setJustAddedProduct(null), 1500);
  };

  const handleAddCustom = () => {
    if (!selectedCustomProduct) return;
    const finalMessage = customText.trim() ? customText.toUpperCase() : "HBD";
    onAddToCart(selectedCustomProduct, quantity, finalMessage);
    
    setJustAddedProduct(selectedCustomProduct.id);
    setTimeout(() => setJustAddedProduct(null), 1500);
    
    // Close modal
    handleCloseCustomizer();
  };

  // Convert the typed text into an array of characters (max 10 for display)
  const letters = customText.toUpperCase().slice(0, 10).split("").filter(char => char !== " ");

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Judul Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <p className="text-xs font-extrabold tracking-widest text-brand-red-600 uppercase">
            Sajian Ter-Fav & Maknyus
          </p>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-gray-900 tracking-tight uppercase">
            Pilih Menu Favoritmu
          </h2>
          <div className="h-1.5 w-24 bg-brand-red-600 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Semua produk dimsum Dimsum Embege dibuat fresh, dikukus hangat, menggunakan daging pilihan dengan higienitas terjamin demi kepuasan lidah kawula muda.
          </p>
        </div>

        {/* Toggle Mode Tampilan (Galeri vs Daftar Harga) */}
        <div className="flex justify-center items-center mb-12">
          <div className="inline-flex p-1 bg-brand-cream-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-950/5">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-250 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-brand-red-600 text-white shadow-md shadow-brand-red-600/15"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              id="btn-toggle-grid"
            >
              <LayoutGrid size={14} />
              Galeri Visual
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-250 cursor-pointer ${
                viewMode === "list"
                  ? "bg-brand-red-600 text-white shadow-md shadow-brand-red-600/15"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              id="btn-toggle-list"
            >
              <ClipboardList size={14} />
              Daftar Harga Resmi
            </button>
          </div>
        </div>

        {/* Tampilan 1: Grid Card Menu */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENU_ITEMS.map((product) => {
              const isSpecial = product.id === "dimsum-custom";
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className={`flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 transition-all duration-300 relative ${
                    isSpecial
                      ? "border-brand-red-500 shadow-md ring-2 ring-brand-red-600/10"
                      : "border-gray-900/10 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-700 hover:shadow-lg shadow-sm"
                  }`}
                >
                  {/* Special Tag badge */}
                  {isSpecial && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-brand-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Sparkles size={10} className="animate-pulse" />
                      Special Request
                    </div>
                  )}

                  {/* Gambar Menu */}
                  <div className="relative aspect-[4/3] bg-brand-cream-100 overflow-hidden shrink-0 group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Detail Menu */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white leading-snug">
                          {product.name}
                        </h3>
                        <span className="text-brand-red-600 font-extrabold text-sm whitespace-nowrap bg-brand-red-50 dark:bg-brand-red-950/50 px-2 py-1 rounded-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-semibold">
                        {product.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div>
                      {isSpecial ? (
                        <button
                          onClick={() => handleOpenCustomizer(product)}
                          className="w-full py-3 rounded-xl bg-brand-red-600 hover:bg-brand-red-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-red-600/20 hover:shadow-brand-red-600/35 transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer"
                          id={`btn-${product.id}`}
                        >
                          <Sparkles size={14} />
                          Kustom & Order
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddStandard(product)}
                          disabled={justAddedProduct === product.id}
                          className={`w-full py-3 rounded-xl active:scale-95 text-white font-bold text-xs shadow-md transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer ${
                            justAddedProduct === product.id
                              ? "bg-emerald-600 shadow-emerald-600/25"
                              : "bg-gray-900 hover:bg-black shadow-gray-900/20"
                          }`}
                          id={`btn-${product.id}`}
                        >
                          {justAddedProduct === product.id ? (
                            <>
                              <Check size={14} className="stroke-[3]" />
                              Masuk Keranjang
                            </>
                          ) : (
                            <>
                              <Plus size={14} className="stroke-[3]" />
                              Tambah Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Tampilan 2: Daftar Harga Lengkap (Café Blackboard Table Concept) */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-brand-cream-50 dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-950/10 dark:border-gray-800 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto overflow-hidden relative"
          >
            {/* Retro header badge inside list table */}
            <div className="flex flex-col sm:flex-row justify-between items-center pb-8 border-b border-dashed border-gray-950/15 dark:border-gray-800 gap-4">
              <div className="text-center sm:text-left">
                <span className="px-3 py-1 bg-brand-red-100 dark:bg-brand-red-950 text-brand-red-600 font-extrabold text-[10px] tracking-wider uppercase rounded-full">
                  MENU BOARD REKOMENDASI
                </span>
                <h3 className="font-display font-black text-2xl text-gray-900 dark:text-white tracking-tight uppercase mt-1">
                  PAPAN HARGA DIMSUM EMBEGE
                </h3>
              </div>
              <div className="text-center sm:text-right font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">
                ⏱️ Selalu Disajikan Hangat 100% Halal
              </div>
            </div>

            {/* Price Table / List Rows wrapper */}
            <div className="mt-8 divide-y divide-gray-950/10 dark:divide-gray-800">
              {MENU_ITEMS.map((product) => {
                const isSpecial = product.id === "dimsum-custom";
                // Portions labeling logic
                const portionLabel = product.id === "dimsum-custom"
                  ? "Sesuai Huruf (Premium Hampers Box)"
                  : "Porsi Standar (Isi 4 pcs)";

                return (
                  <div
                    key={product.id}
                    className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-colors duration-150"
                  >
                    {/* Left details */}
                    <div className="space-y-1 md:max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-red-500" />
                        <h4 className="font-display font-black text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight uppercase group-hover:text-brand-red-600 transition-colors">
                          {product.name}
                        </h4>
                        {isSpecial && (
                          <span className="px-2 py-0.5 rounded bg-brand-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider animate-bounce">
                            New / Request
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        {product.description}
                      </p>
                      <span className="inline-block text-xs font-bold text-brand-red-600/80 dark:text-brand-red-400 uppercase bg-brand-red-50 dark:bg-brand-red-950/45 px-2 py-0.5 rounded-md mt-1">
                        {portionLabel}
                      </span>
                    </div>

                    {/* Right Price & Quick action button */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t border-gray-950/5 dark:border-gray-800 md:border-none">
                      <div className="text-right">
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none">Harga</div>
                        <div className="font-display font-black text-2xl text-gray-900 dark:text-white mt-1 whitespace-nowrap">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {/* Instant Add to order button */}
                      <div>
                        {isSpecial ? (
                          <button
                            onClick={() => handleOpenCustomizer(product)}
                            className="p-3 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-2xl shadow-md active:scale-95 transition-all duration-200 flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                            title="Kustom & Pesan"
                          >
                            <Sparkles size={14} />
                            <span className="hidden sm:inline">Kustom</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddStandard(product)}
                            disabled={justAddedProduct === product.id}
                            className={`p-3 rounded-2xl active:scale-95 text-white font-bold text-xs shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                              justAddedProduct === product.id
                                ? "bg-emerald-600 shadow-emerald-600/25"
                                : "bg-gray-900 hover:bg-black"
                            }`}
                            title="Tambah ke Keranjang"
                          >
                            {justAddedProduct === product.id ? (
                              <>
                                <Check size={14} className="stroke-[3]" />
                                <span className="hidden sm:inline">Dimasukkan</span>
                              </>
                            ) : (
                              <>
                                <Plus size={14} className="stroke-[3]" />
                                <span className="hidden sm:inline">Tambah</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note decoration banner at bottom of blackboard */}
          </motion.div>
        )}

        {/* Highlight Section untuk Custom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-16 p-6 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 text-brand-cream-900 flex flex-col md:flex-row items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-red-100 text-brand-red-600 flex items-center justify-center shrink-0">
            <MessageCircle size={24} />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h4 className="font-display font-extrabold text-sm tracking-tight text-gray-900">
              Ulang Tahun, Anniversary, atau Wisudaan?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Gunakan **Dimsum Custom** untuk request rangkaian huruf secara langsung di atas dimsum-mu. Berikan kejutan hangat nan gurih yang ga bakal mereka lupain!
            </p>
          </div>
        </motion.div>

        {/* Modal Dialog: Dimsum Customizer */}
        <AnimatePresence>
          {selectedCustomProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseCustomizer}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Main Dialog Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-brand-cream-200 z-10 flex flex-col"
              >
                {/* Header Modal */}
                <div className="p-6 bg-brand-red-600 text-white flex items-center justify-between border-b border-brand-cream-200/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="animate-pulse" size={20} />
                    <h3 className="font-display font-extrabold text-lg">Kustom Dimsum Istimewa</h3>
                  </div>
                  <button
                    onClick={handleCloseCustomizer}
                    className="p-1 px-2.5 rounded-full hover:bg-brand-red-700 transition-colors duration-200 text-white focus:outline-none"
                    aria-label="Tutup"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Konten Modal */}
                <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                  
                  {/* Penjelasan Singkat */}
                  <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed">
                    <AlertCircle size={18} className="shrink-0 text-amber-600" />
                    <div>
                      Rangkaian huruf kustom dihiasi olesan saus manis pedas organik berwarna merah di atas permukaan tiap dimsum hangat. Maksimal 10 huruf tanpa spasi.
                    </div>
                  </div>

                  {/* Input Form */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-500">
                      Tulis Request Tulisanmu:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10))}
                        placeholder="Contoh: HBD, SAYANG, COLO, LUV"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-display font-extrabold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red-600/50 uppercase"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        {customText.replace(/\s+/g, "").length}/10 Huruf
                      </span>
                    </div>
                  </div>

                  {/* LIVE VISUAL PREVIEW TRAY (Craftsmanship Highlight) */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-gray-500">
                      Pratinjau Hampers Dimsum-mu:
                    </label>
                    <div className="min-h-[140px] p-6 bg-brand-cream-100 rounded-3xl border border-brand-cream-300 flex flex-wrap items-center justify-center gap-4 shadow-inner relative overflow-hidden">
                      {/* Wooden steamer tray rings in background inside preview */}
                      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 opacity-5" />
                      
                      <AnimatePresence mode="popLayout">
                        {letters.length === 0 ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-bold text-gray-400 italic text-center py-4"
                          >
                            Masukkan huruf untuk melihat visualnya...
                          </motion.p>
                        ) : (
                          letters.map((char, charIdx) => (
                            <motion.div
                              key={`${charIdx}-${char}`}
                              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
                              className="relative w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 shadow-md flex items-center justify-center"
                            >
                              {/* Texture line inside mock dimsum */}
                              <div className="absolute inset-1 rounded-full border border-dashed border-orange-300/60 opacity-60" />
                              <div className="relative font-black font-display text-lg text-brand-red-700 leading-none antialiased select-none transform hover:scale-110 transition-transform duration-100">
                                {char}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center justify-between py-4 border-t border-b border-brand-cream-200/50">
                    <span className="text-sm font-extrabold text-gray-800">Jumlah Pesanan Box:</span>
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-lg text-gray-500 hover:text-brand-red-600 hover:bg-brand-red-50 flex items-center justify-center focus:outline-none transition-colors duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-display font-black text-gray-800 text-sm w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg text-gray-500 hover:text-brand-red-600 hover:bg-brand-red-50 flex items-center justify-center focus:outline-none transition-colors duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Summary Price */}
                  <div className="flex items-center justify-between font-display">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Subtotal:</span>
                    <span className="text-xl font-black text-brand-red-600">
                      {formatPrice(25000 * quantity)}
                    </span>
                  </div>

                </div>

                {/* Footer Modal Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-brand-cream-200/60 flex gap-4">
                  <button
                    onClick={handleCloseCustomizer}
                    className="flex-1 py-3.5 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddCustom}
                    className="flex-[2] py-3.5 bg-brand-red-600 hover:bg-brand-red-700 text-white font-extrabold rounded-2xl shadow-md shadow-brand-red-600/15 hover:shadow-brand-red-600/25 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    Masukkan Keranjang
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

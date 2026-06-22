import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Store, ArrowRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Product } from "../types";
import { WHATSAPP_NUMBER } from "../data";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, customMessage: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, customMessage: string | undefined) => void;
  onClearCart: () => void;
  whatsappNumber?: string;
  dbProducts?: Product[];
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  dbProducts,
}: CartProps) {
  const [userName, setUserName] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProductPrice = (productId: string, fallbackPrice: number) => {
    const freshProd = dbProducts?.find(p => p.id === productId);
    return freshProd ? freshProd.price : fallbackPrice;
  };

  const getProductName = (productId: string, fallbackName: string) => {
    const freshProd = dbProducts?.find(p => p.id === productId);
    return freshProd ? freshProd.name : fallbackName;
  };

  const getProductImage = (productId: string, fallbackImage: string) => {
    const freshProd = dbProducts?.find(p => p.id === productId);
    return freshProd ? freshProd.image : fallbackImage;
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const currentPrice = getProductPrice(item.product.id, item.product.price);
      return acc + currentPrice * item.quantity;
    }, 0);
  };

  // Generate real WhatsApp Click-to-Chat URL
  const generateWhatsAppUrl = () => {
    if (!userName.trim()) {
      alert("Harap masukkan nama Anda sebelum melakukan pemesanan!");
      return "#";
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      alert("Harap masukkan alamat pengantaran Anda!");
      return "#";
    }

    let itemDetails = "";
    cartItems.forEach((item, idx) => {
      const currentPrice = getProductPrice(item.product.id, item.product.price);
      const currentName = getProductName(item.product.id, item.product.name);
      const customMsgText = item.customMessage
        ? ` (Request Tulisan: "${item.customMessage}")`
        : "";
      itemDetails += `${idx + 1}. *${currentName}* x${item.quantity}${customMsgText} - ${formatPrice(currentPrice * item.quantity)}\n`;
    });

    const methodLabel = deliveryMethod === "delivery" ? "🛵 DIANTAR (Delivery)" : "🛍️ AMBIL SENDIRI (Pickup)";
    const addressSection = deliveryMethod === "delivery" ? `📍 *Alamat Kirim*: ${address.trim()}\n` : "";
    const notesSection = notes.trim() ? `💬 *Catatan*: ${notes.trim()}\n` : "";

    const textPayload = 
`Halo Admin *Dimsum Embege*! 👋

Saya mau memesan dimsum premium hangat yang lezat dan kekinian dong:

👤 *Nama Pelanggan*: ${userName.trim()}
📋 *Metode Pesanan*: ${methodLabel}
${addressSection}${notesSection}
📦 *Rincian Orderan*:
${itemDetails}
💵 *Total Pembayaran*: *${formatPrice(calculateTotal())}*

Mohon segera diproses fresh hangat-hangat ya Min! Terima kasih banyak!`;

    const encodedText = encodeURIComponent(textPayload);
    return `https://wa.me/${whatsappNumber || WHATSAPP_NUMBER}?text=${encodedText}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Blur backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header Drawer */}
              <div className="p-6 bg-brand-red-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} />
                  <h2 className="font-display font-extrabold text-lg">Keranjang Belanja Embege</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 px-2 rounded-full hover:bg-brand-red-700 text-white transition-colors focus:outline-none"
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-cream-100 rounded-full flex items-center justify-center text-brand-red-600 mx-auto">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-bold text-gray-800">Keranjang Masih Kosong</p>
                      <p className="text-xs text-gray-500 font-medium">Kamu belum menambahkan dimsum favoritmu.</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold rounded-xl text-xs transition-colors duration-200"
                    >
                      Pilih Menu Sekarang
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sajian Anda</span>
                        <button
                          onClick={onClearCart}
                          className="text-xs font-bold text-brand-red-600 hover:text-brand-red-800 transition-colors"
                        >
                          Kosongkan Keranjang
                        </button>
                      </div>

                      <div className="space-y-3.5">
                        {cartItems.map((item, index) => {
                          const currentPrice = getProductPrice(item.product.id, item.product.price);
                          const currentName = getProductName(item.product.id, item.product.name);
                          const currentImage = getProductImage(item.product.id, item.product.image);
                          return (
                            <motion.div
                              key={`${item.product.id}-${item.customMessage || ""}-${index}`}
                              layout
                              className="flex gap-4 p-3.5 bg-brand-cream-50 rounded-2xl border border-brand-cream-200"
                            >
                              <img
                                src={currentImage}
                                alt={currentName}
                                className="w-16 h-16 rounded-xl object-cover border border-brand-cream-300"
                                referrerPolicy="no-referrer"
                              />
                              
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-display font-extrabold text-sm text-gray-901">
                                    {currentName}
                                  </h3>
                                  {item.customMessage && (
                                    <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] bg-brand-red-50 text-brand-red-700 font-extrabold px-1.5 py-0.5 rounded-md">
                                      Tulisan: "{item.customMessage}"
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs font-black text-brand-red-600 mt-0.5">
                                  {formatPrice(currentPrice)}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between">
                                <button
                                  onClick={() => onRemoveItem(item.product.id, item.customMessage)}
                                  className="text-gray-400 hover:text-brand-red-600 transition-colors p-1"
                                  aria-label="Hapus Item"
                                >
                                  <Trash2 size={15} />
                                </button>

                              <div className="flex items-center gap-2 bg-white border border-brand-cream-250 rounded-lg px-1.5 py-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.customMessage, -1)}
                                  className="text-gray-500 hover:text-brand-red-600 transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-bold text-gray-800 w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.customMessage, 1)}
                                  className="text-gray-500 hover:text-brand-red-600 transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                        })}
                      </div>
                    </div>

                    {/* Customer Info Form */}
                    <div className="space-y-4 border-t border-gray-100 pt-5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pelanggan & Antaran</span>
                      
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-600">Nama Anda:</label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Masukkan nama panggilanmu..."
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-600/30"
                        />
                      </div>

                      {/* Delivery Option Toggle */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-600">Pilih Metode:</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("pickup")}
                            className={`py-3.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-250 ${
                              deliveryMethod === "pickup"
                                ? "bg-brand-red-50 border-brand-red-500 text-brand-red-600 shadow-xs"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <Store size={16} />
                            Ambil Sendiri
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod("delivery")}
                            className={`py-3.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-250 ${
                              deliveryMethod === "delivery"
                                ? "bg-brand-red-50 border-brand-red-500 text-brand-red-600 shadow-xs"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <Truck size={16} />
                            Delivery Antar
                          </button>
                        </div>
                      </div>

                      {/* Conditionally Display Address Input */}
                      {deliveryMethod === "delivery" && (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-600">Alamat Lengkap Pengiriman:</label>
                          <textarea
                            rows={2}
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Tulis alamat rumah, kos, atau kantormu lengkap..."
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-600/30 resize-none"
                          />
                        </div>
                      )}

                      {/* Catatan Tambahan */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-600">Catatan Tambahan (Opsional):</label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Contoh: Saus merah pedas dipisah, dimsum dikukus agak lama, dll."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-600/30 resize-none"
                        />
                      </div>

                    </div>
                  </>
                )}

              </div>

              {/* Checkout Footer Drawer */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-brand-cream-200/50 space-y-4">
                  <div className="flex items-center justify-between font-display">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Tagihan:</span>
                    <span className="text-xl font-black text-brand-red-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>

                  {userName.trim() === "" ? (
                    <div className="text-[11px] leading-relaxed text-amber-600 font-bold bg-amber-50 rounded-xl p-2.5 text-center">
                      ⚠️ Harap isi nama Anda di form di atas terlebih dahulu untuk memunculkan tombol Whatsapp!
                    </div>
                  ) : (deliveryMethod === "delivery" && address.trim() === "") ? (
                    <div className="text-[11px] leading-relaxed text-amber-600 font-bold bg-amber-50 rounded-xl p-2.5 text-center">
                      ⚠️ Harap isi alamat pengantaran lengkap Anda terlebih dahulu untuk memunculkan tombol Checkout!
                    </div>
                  ) : null}

                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!userName.trim() || (deliveryMethod === "delivery" && !address.trim())) {
                        e.preventDefault();
                      } else {
                        // After success trigger, clear cart so state gets reset nicely
                        setTimeout(() => onClearCart(), 2000);
                      }
                    }}
                    className={`w-full py-4 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                      (!userName.trim() || (deliveryMethod === "delivery" && !address.trim()))
                        ? "bg-gray-300 pointer-events-none cursor-not-allowed shadow-none"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.98]"
                    }`}
                  >
                    <MessageSquare size={18} />
                    Kirim Order ke WhatsApp
                    <ArrowRight size={16} />
                  </a>

                  <p className="text-center text-[10px] font-semibold text-gray-400">
                    Bebas biaya admin • Dimsum langsung dimasak hangat
                  </p>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

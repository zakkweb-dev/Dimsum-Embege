import React, { useState, useEffect } from "react";
import { Star, Quote, Edit3, Check, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TESTIMONIALS } from "../data";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const AVATAR_OPTIONS = [
  { id: "a1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", name: "Cewek Gaul" },
  { id: "a2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", name: "Cowok Cool" },
  { id: "a3", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", name: "Kakak Hits" },
  { id: "a4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", name: "Abang Santai" },
  { id: "a5", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", name: "Mbak Kuliner" },
  { id: "a6", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face", name: "Mas Mukbang" }
];

export default function Testimonials() {
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read real-time public reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name || "Anonymous",
          age: Number(data.age) || 20,
          role: data.role || "Anak Tongkrongan",
          rating: Number(data.rating) || 5,
          text: data.text || "",
          avatar: data.avatar || AVATAR_OPTIONS[0].url,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          isPublic: true
        });
      });
      setDbReviews(items);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, "reviews");
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama lengkap kamu wajib diisi!");
      return;
    }
    if (!text.trim()) {
      setError("Ulasan jujur kamu belum diisi, yuk ketik sesuatu!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const finalAge = age === "" ? 20 : Number(age);
      await addDoc(collection(db, "reviews"), {
        name: name.trim(),
        age: finalAge,
        role: role.trim() || "Anak Tongkrongan",
        rating: rating,
        text: text.trim(),
        avatar: selectedAvatar,
        createdAt: serverTimestamp()
      });

      setSubmitSuccess(true);
      // Reset form fields
      setName("");
      setAge("");
      setRole("");
      setRating(5);
      setText("");
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (err: any) {
      setError("Gagal mengirim ulasan. Silakan periksa koneksi internet Anda.");
      handleFirestoreError(err, OperationType.CREATE, "reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Merge Firestore-submitted reviews with our original designed testimonials
  const combinedReviews = [...dbReviews, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <p className="text-xs font-extrabold tracking-widest text-brand-red-600 uppercase">
            Ulasan Anak Tongkrongan
          </p>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-gray-900 tracking-tight uppercase">
            Apa Kata Mereka?
          </h2>
          <div className="h-1.5 w-24 bg-brand-red-600 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">
            Berawal dari coba-coba, denger omongan temen, eh malah ketagihan. Simak pendapat jujur dari sahabat Dimsum Embege di bawah ini!
          </p>
          
          {/* Action to Toggle Submission Form */}
          <div className="pt-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red-600 text-white font-extrabold text-xs uppercase tracking-wide rounded-2xl shadow-md hover:bg-brand-red-700 active:scale-95 transition-all duration-200 cursor-pointer"
              id="btn-toggle-review-form"
            >
              <Edit3 size={15} />
              {isOpen ? "Tutup Form Ulasan" : "Tulis Ulasan Kamu Sendiri"}
            </button>
          </div>
        </div>

        {/* Dynamic Expandable Review Submission Form */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden max-w-2xl mx-auto mb-16"
            >
              <div className="bg-brand-cream-50 dark:bg-gray-900 p-6 sm:p-10 rounded-[2rem] border-2 border-gray-950/10">
                <h3 className="font-display font-black text-xl text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                  Bagikan Pengalaman Kuliner-mu! ✨
                </h3>
                <p className="text-xs text-gray-500 font-semibold mb-6">
                  Ulasanmu akan langsung muncul di halaman ini secara real-time untuk dilihat seluruh pecinta dimsum tanah air!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-brand-red-50 text-brand-red-700 rounded-xl border border-brand-red-200 text-xs font-bold">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
                      <Check size={16} />
                      Ulasan kamu berhasil di-upload secara real-time! Terima kasih banyak!
                    </div>
                  )}

                  {/* Rating Stars Input Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                      Beri Bintang (Rating)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const active = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRating(starVal)}
                            className="transform hover:scale-120 transition-all text-amber-400 active:scale-90 cursor-pointer"
                          >
                            <Star size={26} className={active ? "fill-amber-400 text-amber-500" : "text-gray-300 dark:text-gray-700"} />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-gray-500 ml-2">
                        {rating} dari 5 Bintang
                      </span>
                    </div>
                  </div>

                  {/* Character Avatar Picker Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                      Pilih Karakter Avatar-mu
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {AVATAR_OPTIONS.map((avatar) => {
                        const isSelected = selectedAvatar === avatar.url;
                        return (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar.url)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-white border-brand-red-500 dark:bg-gray-800 scale-105 shadow-sm"
                                : "bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={avatar.url}
                                alt={avatar.name}
                                className="w-11 h-11 rounded-full object-cover border"
                              />
                              {isSelected && (
                                <div className="absolute -bottom-1 -right-1 bg-brand-red-600 text-white rounded-full p-0.5 shadow-sm">
                                  <Check size={8} className="stroke-[4]" />
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-gray-500 leading-tight">
                              {avatar.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="input-name" className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                        Nama Lengkap
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Rian Hidayat"
                        className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-gray-950/10 focus:border-brand-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
                      />
                    </div>

                    {/* Role Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="input-role" className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                        Pekerjaan / Status
                      </label>
                      <input
                        id="input-role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Contoh: Mahasiswa, Karyawan"
                        className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-gray-950/10 focus:border-brand-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
                      />
                    </div>

                    {/* Age Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="input-age" className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                        Umur (Tahun)
                      </label>
                      <input
                        id="input-age"
                        type="number"
                        min="5"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Contoh: 21"
                        className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-gray-950/10 focus:border-brand-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Review Text Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="input-text" className="block text-xs font-extrabold tracking-wider uppercase text-gray-700 dark:text-gray-300">
                      Ulasan Jujur Kamu
                    </label>
                    <textarea
                      id="input-text"
                      rows={3}
                      required
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Bagaimana rasa Dimsum Embege? Apakah harum, padat daging, sausnya nagih? Tuliskan ulasanmu di sini..."
                      className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-gray-950/10 focus:border-brand-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || submitSuccess}
                      className="w-full py-4 rounded-xl bg-brand-red-600 hover:bg-brand-red-700 disabled:bg-gray-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                      id="btn-submit-review"
                    >
                      {isSubmitting ? (
                        "Sedang Mengirim..."
                      ) : submitSuccess ? (
                        "Berhasil Dikirim! ✔️"
                      ) : (
                        <>
                          <Sparkles size={14} />
                          Kirim Ulasan Real-Time
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonial Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {combinedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className="p-8 bg-brand-cream-50 rounded-3xl border-2 border-gray-950/10 hover:border-gray-900 transition-all duration-300 relative flex flex-col justify-between"
            >
              {/* Giant Quote Icon */}
              <Quote className="absolute top-6 right-8 text-brand-cream-300 opacity-25" size={4.5 * 10} />

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-500 fill-amber-500" />
                  ))}
                  {review.isPublic && (
                    <span className="text-[9px] bg-brand-red-500 text-white font-black tracking-widest uppercase px-1.5 py-0.5 rounded ml-2 scale-90">
                      LIVE
                    </span>
                  )}
                </div>

                {/* Testimonial Message */}
                <p className="text-sm text-gray-700 leading-relaxed font-semibold italic">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-cream-250/30 relative z-10">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-brand-red-600/10 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display font-extrabold text-sm text-gray-900 leading-none">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-bold">
                    {review.role}, {review.age} Tahun
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

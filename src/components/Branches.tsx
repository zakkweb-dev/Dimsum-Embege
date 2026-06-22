import React, { useState, useEffect } from "react";
import { MapPin, Phone, ExternalLink, Map, Store } from "lucide-react";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { WHATSAPP_NUMBER, OUTLET_ADDRESS } from "../data";

interface Branch {
  id: string;
  name: string;
  address: string;
  whatsapp: string;
  grabFood: string;
  googleMaps: string;
}

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "branches"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Branch[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Branch);
      });
      setBranches(items);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, "branches");
    });

    return () => unsubscribe();
  }, []);

  // Simple clean whatsapp parser
  const getWaLink = (num: string) => {
    const parsed = num.replace(/[^0-9]/g, "");
    return `https://wa.me/${parsed}?text=Halo%20Admin%20Dimsum%20Embege,%20saya%20mau%20tanya-tanya%20menu%20dimsumnya%20dong!`;
  };

  return (
    <section id="branches" className="py-24 bg-gradient-to-b from-white to-brand-cream-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red-50 dark:bg-brand-red-950/30 text-brand-red-600 dark:text-brand-red-400 border border-brand-red-100 dark:border-brand-red-900/50 font-bold text-xs tracking-wider uppercase">
            <Store size={14} />
            Outlet Resmi Kami
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-gray-900 dark:text-white tracking-tight uppercase">
            Cabang Dimsum Embege
          </h2>
          <div className="h-1.5 w-24 bg-brand-red-600 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
            Kunjungi outlet terdekat untuk menikmati dimsum anget galing kami secara langsung, atau pesan online via partner resmi.
          </p>
        </div>

        {/* List of branches */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red-600"></div>
          </div>
        ) : branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, idx) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-brand-cream-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-lg tracking-tight text-brand-red-600 uppercase">
                      {branch.name}
                    </span>
                    <span className="text-[10px] bg-red-50 dark:bg-brand-red-950/30 text-brand-red-600 dark:text-brand-red-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      Aktif
                    </span>
                  </div>
                  
                  <div className="space-y-4 mb-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="text-brand-red-500 shrink-0 mt-0.5" size={16} />
                      <span className="leading-relaxed">{branch.address}</span>
                    </div>
                    {branch.whatsapp && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="text-emerald-500 shrink-0" size={16} />
                        <span>+{branch.whatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-cream-100/50 dark:border-gray-850">
                  {branch.whatsapp && (
                    <a
                      href={getWaLink(branch.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 rounded-xl transition-all text-[11px] font-bold"
                    >
                      <Phone size={13} />
                      WhatsApp
                    </a>
                  )}
                  {branch.googleMaps ? (
                    <a
                      href={branch.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-950/40 rounded-xl transition-all text-[11px] font-bold"
                    >
                      <Map size={13} />
                      Google Maps
                    </a>
                  ) : (
                    <div className="h-2.5 bg-transparent" />
                  )}
                  {branch.grabFood && (
                    <a
                      href={branch.grabFood}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-red-50 hover:bg-brand-red-100 active:scale-95 text-brand-red-600 dark:bg-brand-red-950/20 dark:text-brand-red-400 dark:hover:bg-brand-red-950/40 rounded-xl transition-all text-[11px] font-bold text-center"
                    >
                      <ExternalLink size={13} />
                      Order via GrabFood
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Fallback branch cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 border border-brand-cream-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-lg tracking-tight text-brand-red-600 uppercase">
                    Outlet Pusat Senopati
                  </span>
                  <span className="text-[10px] bg-red-50 dark:bg-brand-red-950/30 text-brand-red-600 dark:text-brand-red-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Pusat
                  </span>
                </div>
                
                <div className="space-y-4 mb-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="text-brand-red-500 shrink-0 mt-0.5" size={16} />
                    <span className="leading-relaxed">{OUTLET_ADDRESS}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="text-emerald-500 shrink-0" size={16} />
                    <span>+{WHATSAPP_NUMBER}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-cream-100/50 dark:border-gray-850">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20Dimsum%20Embege,%20saya%20mau%20tanya-tanya%20menu%20dimsumnya%20dong!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 rounded-xl transition-all text-[11px] font-bold"
                >
                  <Phone size={13} />
                  WhatsApp
                </a>
                <a
                  href="https://maps.google.com" // default map fallback
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-950/40 rounded-xl transition-all text-[11px] font-bold"
                >
                  <Map size={13} />
                  Google Maps
                </a>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}

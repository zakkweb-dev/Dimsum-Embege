import { Instagram, MessageSquare, MapPin, Clock, Heart, UtensilsCrossed } from "lucide-react";
import { WHATSAPP_NUMBER, INSTAGRAM_HANDLE, OUTLET_ADDRESS } from "../data";

export default function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20Dimsum%20Embege,%20saya%20mau%20tanya-tanya%20menu%20dimsumnya%20dong!`;
  const instagramUrl = `https://www.instagram.com/${INSTAGRAM_HANDLE}?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==`;

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-brand-red-900/10 relative overflow-hidden">
      {/* Aesthetic ambient ornament */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-72 h-72 bg-brand-cream-510/5 rounded-full blur-4xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800/60">
          
          {/* Logo Brand info columns */}
          <div className="space-y-4 md:col-span-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-red-900/20">
                <UtensilsCrossed size={18} />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white">
                DIMSUM EMBEGE
              </span>
            </div>
            
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Membawakan petualangan kuliner baru dengan dimsum premium kualitas restoran dalam nuansa street-food modern yang kekinian, pas untuk kawula muda Indonesia.
            </p>

            {/* Social handles short rows */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-emerald-600 border border-gray-800 hover:border-emerald-500 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-brand-red-600 border border-gray-800 hover:border-brand-red-500 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-white tracking-wider uppercase">
              Peta Situs
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-bold">
              <li>
                <a href="#home" className="hover:text-brand-red-500 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-red-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-brand-red-500 transition-colors">Eksplor Menu</a>
              </li>
              <li>
                <a href="#how-to-order" className="hover:text-brand-red-500 transition-colors">Cara Pemesanan</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-brand-red-500 transition-colors">Ulasan Hangat</a>
              </li>
            </ul>
          </div>

          {/* Operational Hours column */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-white tracking-wider uppercase">
              Jam Operasional
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400 font-semibold">
              <li className="flex items-start gap-2">
                <Clock className="text-brand-red-500 shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-white font-extrabold">Setiap Hari Kerja</p>
                  <p className="text-xs text-gray-400 mt-1">12:00 - 22:00 WIB</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="text-gray-600 shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-gray-500">Tanggal Merah / Libur</p>
                  <p className="text-[11px] text-brand-red-400 mt-1">Konfirmasi via Instagram</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact details columns */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-white tracking-wider uppercase">
              Hubungi Outlet Kece
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400 font-semibold">
              <li className="flex items-start gap-2.5">
                <MapPin className="text-brand-red-500 shrink-0 mt-0.5" size={15} />
                <span className="leading-relaxed">
                  {OUTLET_ADDRESS}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="text-emerald-500 shrink-0 mt-0.5" size={15} />
                <div>
                  <p className="text-white font-extrabold">WhatsApp Chat Admin</p>
                  <p className="text-[11px] text-gray-500 mt-1">+{WHATSAPP_NUMBER}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom copyright terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-bold">
          <p>© {new Date().getFullYear()} Dimsum Embege. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat penuh dengan <Heart size={10} className="fill-brand-red-650 text-brand-red-600" /> untuk pecinta Dimsum Indonesia.
          </p>
        </div>

      </div>
    </footer>
  );
}

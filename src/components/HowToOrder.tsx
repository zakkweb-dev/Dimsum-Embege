import { ShoppingCart, MessageSquare, Flame, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function HowToOrder() {
  const steps = [
    {
      number: "01",
      icon: <ShoppingCart size={24} className="text-brand-red-600" />,
      title: "Pilih Menu",
      desc: "Jelajahi petualangan rasa kami. Tambahkan dimsum klasik kukus, goreng, bakar, ataupun custom tulisan sesukamu ke keranjang belanja."
    },
    {
      number: "02",
      icon: <MessageSquare size={24} className="text-brand-red-600" />,
      title: "Chat WhatsApp",
      desc: "Isi nama & alamat pengantaran, ketuk checkout untuk mengirim ringkasan detail pesanan otomatis ke WhatsApp Admin kami."
    },
    {
      number: "03",
      icon: <Flame size={24} className="text-brand-red-600" />,
      title: "Dibuat Fresh",
      desc: "Koki andalan kami akan langsung melayani, membuat, mengolah, dan mengukus pesananmu hangat-hangat agar cita rasa premiumnya terjaga."
    },
    {
      number: "04",
      icon: <CheckCircle2 size={24} className="text-brand-red-600" />,
      title: "Antar / Pickup",
      desc: "Kurir kilat mengantar langsung ke tanganmu, atau kamu bisa melipir mengambil langsung di gerbong outlet street food modern terdekat kami."
    }
  ];

  return (
    <section id="how-to-order" className="py-20 bg-brand-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seksi */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <p className="text-xs font-extrabold tracking-widest text-brand-red-600 uppercase">
            Sistem Instan & Praktis
          </p>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-gray-901 tracking-tight uppercase">
            Cara Praktis Memesan
          </h2>
          <div className="h-1.5 w-24 bg-brand-red-600 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">
            Hanya butuh 4 langkah mudah saja untuk merasakan kehangatan bumbu nikmat dimsum hits dari Dimsum Embege. Tanpa ribet registrasi akun!
          </p>
        </div>

        {/* Steps Grid / Timeline Connection */}
        <div className="relative">
          {/* Connection Line Desktop Only */}
          <div className="hidden lg:block absolute top-[28%] left-[10%] right-[10%] h-1 bg-gradient-to-r from-brand-red-300 via-brand-cream-300 to-brand-red-300 pointer-events-none z-0 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-3xl p-6 border-2 border-gray-950/10 hover:border-gray-900 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center space-y-4 group relative"
              >
                {/* Floating Step Number */}
                <span className="absolute top-4 right-6 font-display font-black text-5xl tracking-tighter text-brand-cream-200 group-hover:text-brand-red-100 transition-colors duration-300 z-0 select-none">
                  {step.number}
                </span>

                {/* Step Icon circle */}
                <div className="w-14 h-14 rounded-2xl bg-brand-red-50 border border-brand-red-100 flex items-center justify-center relative z-10 group-hover:bg-brand-red-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                  {step.icon}
                </div>

                {/* Step Text details */}
                <div className="space-y-1.5 relative z-10">
                  <h3 className="font-display font-extrabold text-base text-gray-905 group-hover:text-brand-red-600 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

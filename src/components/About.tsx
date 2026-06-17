import { Award, Blend, Flame, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const highlights = [
    {
      icon: <Award className="text-amber-600" size={24} />,
      title: "Rasa Premium Autentik",
      desc: "Isian tebal berdaging padat dengan kandungan tepung minimal. Kami mengutamakan rasa gurih alami ayam segar kualitas terbaik.",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      icon: <Flame className="text-brand-red-600" size={24} />,
      title: "Konsep Street Food Modern",
      desc: "Menyajikan makanan berkualitas resto dalam format street-food casual yang santai, gaul, dan ramah kantong anak muda.",
      bgColor: "bg-brand-red-50",
      borderColor: "border-brand-red-100"
    },
    {
      icon: <Sparkles className="text-emerald-600" size={24} />,
      title: "Customizable & Estetik",
      desc: "Satu-satunya dimsum yang bisa dipesan khusus berhiaskan tulisan kreatif (HBD, I ❤️ U, dll.) untuk memeriahkan momen bahagiamu.",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      icon: <Blend className="text-indigo-600" size={24} />,
      title: "Saus Cocolan Khas Sempurna",
      desc: "Pelengkap istimewa saus merah Dimsum Embege yang memadukan rasa pedas, manis, dan sedikit asam segar yang nagih banget.",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    },
  ];

  return (
    <section id="about" className="py-20 bg-brand-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Konten Atas: Header Seksi */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-extrabold tracking-widest text-brand-red-600 uppercase"
          >
            Kenali Kami Lebih Dekat
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl text-gray-900 tracking-tight uppercase"
          >
            Ngemil Seru & Kenyang Bersama Dimsum Embege
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1.5 w-24 bg-brand-red-600 mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed"
          >
            Dimsum Embege adalah brand dimsum modern yang menghadirkan rasa autentik dengan sentuhan kekinian. Kami merevolusi cara anak muda menikmati dimsum tradisional menjadi camilan gaul yang estetik, super lezat, dan selalu nyaman di kantong!
          </motion.p>
        </div>

        {/* Konten Bawah: Grid highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className={`p-6 sm:p-8 rounded-3xl bg-white border ${item.borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start`}
            >
              <div className={`p-4 rounded-2xl ${item.bgColor} shrink-0`}>
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-gray-800 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner Tambahan: Kata Kata Keren */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 rounded-[2rem] bg-brand-red-600 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-brand-red-700/60 blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-10%] w-56 h-56 rounded-full bg-brand-red-800/60 blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display font-black text-2xl tracking-tight">
                Mau Buat Hari Rayamu Lebih Istimewa?
              </h3>
              <p className="text-sm text-brand-red-100 font-medium leading-relaxed">
                Ulang tahun jadian, sembuh dari sakit, atau sekedar ngasih ucapan maaf? Buat mereka tersenyum manis dengan kiriman Dimsum Custom berhiaskan pesan pribadimu sendiri!
              </p>
            </div>
            <a
              href="#menu"
              className="px-6 py-3.5 bg-white text-brand-red-600 font-extrabold rounded-2xl shadow-md hover:bg-brand-cream-50 transition-colors duration-200 shrink-0 text-sm"
            >
              Coba Custom Tulisan Sekarang
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

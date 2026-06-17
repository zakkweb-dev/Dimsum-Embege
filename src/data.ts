import { Product, Testimonial } from './types';

export const WHATSAPP_NUMBER = "6285738662165"; // Real Indonesian customer format
export const INSTAGRAM_HANDLE = "dimsum_embege";
export const OUTLET_ADDRESS = "Gg. Dimsum Jaya No. 12, Senopati Selatan, Jakarta";

export const HERO_IMAGE = "/src/assets/images/dimsum_hero_1781619259601.jpg";

export const MENU_ITEMS: Product[] = [
  {
    id: "dimsum-ori",
    name: "Dimsum Ori",
    price: 15000,
    description: "Dimsum kukus klasik dari daging ayam premium pilihan, dibalut kulit yang tipis & kenyal dengan taburan parutan wortel segar yang manis. Juicy di setiap gigitan!",
    image: "/src/assets/images/dimsum_ori_1781619275074.jpg",
    isCustomizable: false
  },
  {
    id: "dimsum-goreng",
    name: "Dimsum Goreng",
    price: 17000,
    description: "Dimsum krispi berkulit keemasan yang digoreng garing sempurna di luar, tetapi tetap menyisakan isian yang super empuk dan berair di dalam. Disajikan hangat!",
    image: "/src/assets/images/dimsum_goreng_1781619292231.jpg",
    isCustomizable: false
  },
  {
    id: "dimsum-bakar",
    name: "Dimsum Bakar",
    price: 18000,
    description: "Inovasi street food dimsum yang dipanggang dengan olesan glaze barbecue/saus rahasia racikan Dimsum Embege. Memberikan aroma smoky dan rasa manis-gurih yang adiktif.",
    image: "/src/assets/images/dimsum_bakar_1781619306266.jpg",
    isCustomizable: false
  },
  {
    id: "dimsum-custom",
    name: "Dimsum Custom (Special)",
    price: 25000,
    description: "Edisi spesial! Dimsum eksklusif berukuran padat yang bisa di-request dihiasi rangkaian huruf/tulisan kreatif seperti 'HBD', 'LUv U', 'ANNI', dll. Cocok untuk kejutan manis!",
    image: "/src/assets/images/dimsum_custom_1781619321653.jpg",
    isCustomizable: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Rian Hidayat",
    age: 21,
    role: "Mahasiswa Untar",
    rating: 5,
    text: "Dimsum Bakar-nya gilakk! Baru pertama kali nyoba dimsum dibakar dan saus BBQ-nya berasa smoky abis. Cocok banget buat kantong mahasiswa, murah tapi rasanya kelas restoran bintang lima!",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Salsa Bella",
    age: 19,
    role: "Influencer Kuliner",
    rating: 5,
    text: "Pesen Dimsum Custom buat anniversary pacar, dia seneng banget! Tulisannya rapi dibentuk di atas dimsum dan rasanya juga bener-bener berdaging, ga cuma tepung doang. Estetik & enak!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Kevin Sanjaya",
    age: 23,
    role: "Karyawan Swasta",
    rating: 5,
    text: "Dimsum Ori sama saus merahnya Dimsum Embege juara umum sih. Ditambah lagi pesannya gampang tinggal checkout langsung ke WhatsApp dan langsung dipacking anget-anget. Pasti reorder!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }
];

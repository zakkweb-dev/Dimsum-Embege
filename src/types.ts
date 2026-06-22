export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isCustomizable?: boolean;
  status?: string; // "Tersedia" | "Habis"
  isBestSeller?: boolean; // true || false
}

export interface CartItem {
  product: Product;
  quantity: number;
  customMessage?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  age: number;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

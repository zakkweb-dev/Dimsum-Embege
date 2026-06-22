import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  LogOut,
  Store,
  ShoppingBag,
  MessageSquare,
  Upload,
  X,
  Check,
  CheckCircle,
  Home,
  Lock,
  Shield,
  Eye,
  Star,
  RefreshCw,
  Image as ImageIcon,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, storage, handleFirestoreError, OperationType } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { WHATSAPP_NUMBER } from "../data";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "branches" | "reviews" | "settings">("dashboard");

  // Data Loading States
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    logoUrl: "",
    heroBgUrl: "",
    whatsapp: WHATSAPP_NUMBER,
    grabFood: ""
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Forms / Modals States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    status: "Tersedia",
    isCustomizable: false,
    isBestSeller: false
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    whatsapp: "",
    grabFood: "",
    googleMaps: ""
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    age: 20,
    role: "Anak Tongkrongan",
    rating: 5,
    text: "",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  });

  // Image Upload temporary indicators
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "product" | "branch" | "review" } | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPriceDiscrepancies = () => {
    const list: { name: string; prices: number[]; ids: string[] }[] = [];
    const grouped: { [key: string]: { id: string; price: number }[] } = {};

    products.forEach((p) => {
      if (!p.name) return;
      const stripped = p.name.trim().toLowerCase();
      if (!grouped[stripped]) {
        grouped[stripped] = [];
      }
      grouped[stripped].push({ id: p.id, price: Number(p.price || 0) });
    });

    Object.entries(grouped).forEach(([key, items]) => {
      if (items.length > 1) {
        const prices = items.map((it) => it.price);
        const uniquePrices = Array.from(new Set(prices));
        if (uniquePrices.length > 1) {
          const originalName = products.find((prod) => prod.name && prod.name.trim().toLowerCase() === key)?.name || key;
          list.push({
            name: originalName,
            prices: uniquePrices,
            ids: items.map((it) => it.id),
          });
        }
      }
    });

    return list;
  };

  // Load Session and Real-time data
  useEffect(() => {
    const isLogged = localStorage.getItem("embege_admin_session") === "true";
    if (isLogged) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch real-time collections
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);

    // Products snapshot listener
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setProducts(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "products");
    });

    // Branches snapshot listener
    const qBranches = query(collection(db, "branches"), orderBy("name", "asc"));
    const unsubBranches = onSnapshot(qBranches, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBranches(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "branches");
    });

    // Reviews snapshot listener
    const qReviews = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setReviews(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "reviews");
    });

    // Settings snapshot listener
    const unsubSettings = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "settings/main");
    });

    setLoading(false);

    return () => {
      unsubProducts();
      unsubBranches();
      unsubReviews();
      unsubSettings();
    };
  }, [isAuthenticated]);

  // LOGIN FUNCTION
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Fauzan Yuda Pratama" && password === "Dimsum Embege 24") {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("embege_admin_session", "true");
    } else {
      setLoginError("Karakteristik login salah! Silakan periksa username dan password Anda.");
    }
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("embege_admin_session");
  };

  // FILE UPLOADER TO FIREBASE STORAGE WITH BASE64 FALLBACK
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "product" | "logo" | "heroBg") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress("Mengunggah...");

    // Helper reader for Base64 (always works as bulletproof fallback)
    const readAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      // 1. Try Firebase Storage standard upload
      const storageRef = ref(storage, `${type}s/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (type === "product") {
        setProductForm(prev => ({ ...prev, image: url }));
      } else if (type === "logo") {
        setSettings(prev => ({ ...prev, logoUrl: url }));
      } else if (type === "heroBg") {
        setSettings(prev => ({ ...prev, heroBgUrl: url }));
      }
      setUploadProgress("Berhasil diunggah!");
    } catch (error) {
      console.warn("Storage upload failed, falling back to Base64: ", error);
      // Fallback: Base64 string encoding
      try {
        const base64Url = await readAsBase64(file);
        if (type === "product") {
          setProductForm(prev => ({ ...prev, image: base64Url }));
        } else if (type === "logo") {
          setSettings(prev => ({ ...prev, logoUrl: base64Url }));
        } else if (type === "heroBg") {
          setSettings(prev => ({ ...prev, heroBgUrl: base64Url }));
        }
        setUploadProgress("Berhasil dimuat offline (Base64)!");
      } catch (err) {
        console.error("Base64 reading failed: ", err);
        setUploadProgress("Gagal memuat gambar!");
      }
    } finally {
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  // PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 15000,
      description: "",
      image: "",
      status: "Tersedia",
      isCustomizable: false,
      isBestSeller: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || "",
      price: prod.price || 0,
      description: prod.description || "",
      image: prod.image || "",
      status: prod.status || "Tersedia",
      isCustomizable: prod.isCustomizable || false,
      isBestSeller: prod.isBestSeller || false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;
    setIsSaving(true);

    try {
      if (editingProduct) {
        // Edit existing product
        await updateDoc(doc(db, "products", editingProduct.id), {
          ...productForm,
          price: Number(productForm.price)
        });
      } else {
        // Create new product
        await addDoc(collection(db, "products"), {
          ...productForm,
          price: Number(productForm.price),
          createdAt: new Date().toISOString()
        });
      }
      setIsProductModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, editingProduct ? OperationType.UPDATE : OperationType.CREATE, "products");
    } finally {
      setIsSaving(false);
    }
  };

  // BRANCH ACTIONS
  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setBranchForm({
      name: "",
      address: "",
      whatsapp: "",
      grabFood: "",
      googleMaps: ""
    });
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (branch: any) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name || "",
      address: branch.address || "",
      whatsapp: branch.whatsapp || "",
      grabFood: branch.grabFood || "",
      googleMaps: branch.googleMaps || ""
    });
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.address.trim()) return;
    setIsSaving(true);

    try {
      if (editingBranch) {
        await updateDoc(doc(db, "branches", editingBranch.id), branchForm);
      } else {
        await addDoc(collection(db, "branches"), {
          ...branchForm,
          createdAt: new Date().toISOString()
        });
      }
      setIsBranchModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, editingBranch ? OperationType.UPDATE : OperationType.CREATE, "branches");
    } finally {
      setIsSaving(false);
    }
  };

  // REVIEW ACTIONS
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewForm({
      name: "",
      age: 20,
      role: "Anak Tongkrongan",
      rating: 5,
      text: "",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: any) => {
    setEditingReview(rev);
    setReviewForm({
      name: rev.name || "",
      age: Number(rev.age) || 20,
      role: rev.role || "Anak Tongkrongan",
      rating: Number(rev.rating) || 5,
      text: rev.text || "",
      avatar: rev.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setIsSaving(true);

    try {
      if (editingReview) {
        await updateDoc(doc(db, "reviews", editingReview.id), {
          ...reviewForm,
          age: Number(reviewForm.age),
          rating: Number(reviewForm.rating)
        });
      } else {
        await addDoc(collection(db, "reviews"), {
          ...reviewForm,
          age: Number(reviewForm.age),
          rating: Number(reviewForm.rating),
          createdAt: new Date().toISOString()
        });
      }
      setIsReviewModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, editingReview ? OperationType.UPDATE : OperationType.CREATE, "reviews");
    } finally {
      setIsSaving(false);
    }
  };

  // SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "main"), settings);
      alert("Pengaturan website berhasil diperbarui!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/main");
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE TRIGGER CONFIRMATION
  const handleDeleteTrigger = (id: string, type: "product" | "branch" | "review") => {
    setDeleteTarget({ id, type });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    setIsSaving(true);

    try {
      if (type === "product") {
        await deleteDoc(doc(db, "products", id));
      } else if (type === "branch") {
        await deleteDoc(doc(db, "branches", id));
      } else if (type === "review") {
        await deleteDoc(doc(db, "reviews", id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${type}s/${id}`);
    } finally {
      setIsSaving(false);
      setDeleteTarget(null);
    }
  };

  // RENDER LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-2xl relative"
        >
          {/* Close main click */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-all"
          >
            <X size={20} />
          </button>

          {/* Icon Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-brand-red-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-brand-red-650/40">
              <Shield size={32} className="stroke-[2.5]" />
            </div>
            <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white tracking-tight uppercase">
              ADMIN CONTROL PANEL
            </h2>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              Sistem Otentikasi Terenkripsi Dimsum Embege
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs font-bold leading-relaxed border border-red-100 dark:border-red-900/30">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                Username Resmi
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cth: Fauzan Yuda Pratama"
                className="w-full px-4.5 py-3.5 text-xs font-bold rounded-2xl border-2 border-slate-100 dark:border-gray-800 focus:border-brand-red-500 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                Password Rahasia
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full px-4.5 py-3.5 text-xs font-bold rounded-2xl border-2 border-slate-100 dark:border-gray-800 focus:border-brand-red-500 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand-red-600 hover:bg-brand-red-700 active:scale-[0.98] transition-all rounded-2xl text-white font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-brand-red-650/30 flex items-center justify-center gap-2 mt-2"
            >
              <Lock size={14} />
              Otorisasi Masuk
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // MAIN RENDER WITH SIDEBAR DASHBOARD
  return (
    <div className="fixed inset-0 z-50 bg-gray-950/90 backdrop-blur-md flex items-center justify-center p-0 md:p-6 transition-colors duration-300">
      <div className="bg-slate-50 dark:bg-gray-950 w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-[2rem] border border-gray-150 dark:border-gray-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* SIDEBAR FOR DESKTOP AND MOBILE HEADER */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-slate-150 dark:border-gray-850 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            
            {/* Admin Header Title */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-red-600 flex items-center justify-center text-white shadow-md">
                  <Shield size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xs text-gray-950 dark:text-white uppercase tracking-tight">
                    Fauzan Pratama
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest mt-0.5">
                    Mode Admin
                  </span>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "dashboard"
                    ? "bg-brand-red-50 text-brand-red-700 dark:bg-brand-red-950/20 dark:text-brand-red-400"
                    : "text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850"
                }`}
              >
                <Home size={15} />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "products"
                    ? "bg-brand-red-50 text-brand-red-700 dark:bg-brand-red-950/20 dark:text-brand-red-400"
                    : "text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850"
                }`}
              >
                <ShoppingBag size={15} />
                Produk
              </button>

              <button
                onClick={() => setActiveTab("branches")}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "branches"
                    ? "bg-brand-red-50 text-brand-red-700 dark:bg-brand-red-950/20 dark:text-brand-red-400"
                    : "text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850"
                }`}
              >
                <Store size={15} />
                Cabang
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "reviews"
                    ? "bg-brand-red-50 text-brand-red-700 dark:bg-brand-red-950/20 dark:text-brand-red-400"
                    : "text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850"
                }`}
              >
                <MessageSquare size={15} />
                Review
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === "settings"
                    ? "bg-brand-red-50 text-brand-red-700 dark:bg-brand-red-950/20 dark:text-brand-red-400"
                    : "text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-850"
                }`}
              >
                <Settings size={15} />
                Pengaturan
              </button>
            </nav>
          </div>

          {/* Logout Action */}
          <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white text-xs font-bold rounded-xl transition-all"
            >
              <Eye size={13} />
              Lihat Website
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 text-red-650 dark:text-red-400 text-xs font-bold rounded-xl transition-all"
            >
              <LogOut size={13} />
              Keluar Sesi
            </button>
          </div>
        </aside>

        {/* CONTAINER CONTENT VIEW */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-gray-950 relative overflow-y-auto p-6 scrollbar-thin">
          
          {/* Header row details desktop */}
          <div className="hidden md:flex items-center justify-between pb-5 border-b border-slate-100 dark:border-gray-900 mb-6">
            <h1 className="font-display font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight">
              {activeTab === "dashboard" && "Dashboard Ringkasan"}
              {activeTab === "products" && "Manajemen Produk"}
              {activeTab === "branches" && "Outlet Cabang"}
              {activeTab === "reviews" && "Review Pelanggan"}
              {activeTab === "settings" && "Instalasi Pengaturan"}
            </h1>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-slate-150 dark:border-gray-800 hover:bg-slate-50 font-bold text-xs rounded-xl text-gray-600 dark:text-gray-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <X size={14} />
              Tutup Panel
            </button>
          </div>

          {/* Loading panel */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red-655" />
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Warning Price Mismatch Validation */}
                  {getPriceDiscrepancies().length > 0 && (
                    <div className="p-5 bg-red-50 dark:bg-red-950/20 border-2 border-red-500/30 rounded-3xl space-y-3 animate-pulse">
                      <div className="flex items-center gap-2.5 text-red-650 dark:text-red-400">
                        <AlertTriangle className="shrink-0 text-red-650 dark:text-red-500" size={20} />
                        <h4 className="font-display font-black text-sm uppercase tracking-wide">
                          Peringatan: Duplikasi Harga Terdeteksi!
                        </h4>
                      </div>
                      <p className="text-xs text-red-650/80 dark:text-red-300 font-semibold leading-relaxed">
                        Terdapat produk dengan nama yang sama tetapi didaftarkan dengan harga yang berbeda di database. Hal ini dapat menimbulkan ketidaksinkronan harga pesanan pelanggan. Silakan sunting produk-produk berikut agar memiliki harga yang seragam:
                      </p>
                      <div className="space-y-2 mt-2">
                        {getPriceDiscrepancies().map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/40 rounded-2xl gap-2 shadow-xs">
                            <span className="font-display font-extrabold text-xs text-gray-900 dark:text-white uppercase">
                              {item.name}
                            </span>
                            <span className="text-[11px] font-bold text-red-650 dark:text-red-450 bg-red-50 dark:bg-red-950/50 px-2.5 py-1 rounded-lg">
                              Terdeteksi beberapa harga: {item.prices.map(p => formatPrice(p)).join(" vs ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-md flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-red-50 dark:bg-brand-red-950/20 text-brand-red-600 dark:text-brand-red-400 flex items-center justify-center">
                        <ShoppingBag size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Produk</p>
                        <h4 className="font-display font-black text-2xl text-gray-900 dark:text-white mt-0.5">{products.length}</h4>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-md flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                        <Store size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Cabang</p>
                        <h4 className="font-display font-black text-2xl text-gray-900 dark:text-white mt-0.5">{branches.length}</h4>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-md flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-550 dark:text-amber-400 flex items-center justify-center">
                        <MessageSquare size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Review Klien</p>
                        <h4 className="font-display font-black text-2xl text-gray-900 dark:text-white mt-0.5">{reviews.length}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Informative Welcome banner */}
                  <div className="p-6 bg-gradient-to-r from-brand-red-600 to-red-500 rounded-3xl text-white shadow-lg shadow-brand-red-650/15">
                    <h3 className="font-display font-black text-xl uppercase">Selamat Datang, Fauzan!</h3>
                    <p className="text-xs font-semibold text-white/80 mt-1 max-w-xl leading-relaxed">
                      Sistem Admin Panel Dimsum Embege dirancang khusus untuk memperlancar operasional. Unggah foto-foto baru, sesuaikan harga jual, kelola detail maps cabang, serta update ulasan terbaik dari pelanggan Anda.
                    </p>
                  </div>

                  {/* Quick actions listing */}
                  <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-md">
                    <h4 className="font-display font-black text-sm uppercase text-gray-900 dark:text-white mb-4">Akses Navigasi Langsung</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={handleOpenAddProduct}
                        className="py-3 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-white text-center hover:bg-slate-100 dark:hover:bg-gray-850 transition-all flex flex-col items-center gap-2 justify-center"
                      >
                        <ShoppingBag size={18} className="text-brand-red-600" />
                        Tambah Produk
                      </button>
                      <button
                        onClick={handleOpenAddBranch}
                        className="py-3 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-white text-center hover:bg-slate-100 dark:hover:bg-gray-850 transition-all flex flex-col items-center gap-2 justify-center"
                      >
                        <Store size={18} className="text-indigo-650" />
                        Tambah Cabang
                      </button>
                      <button
                        onClick={handleOpenAddReview}
                        className="py-3 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-white text-center hover:bg-slate-100 dark:hover:bg-gray-850 transition-all flex flex-col items-center gap-2 justify-center"
                      >
                        <MessageSquare size={18} className="text-amber-550" />
                        Tambah Review
                      </button>
                      <button
                        onClick={() => setActiveTab("settings")}
                        className="py-3 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-white text-center hover:bg-slate-100 dark:hover:bg-gray-850 transition-all flex flex-col items-center gap-2 justify-center"
                      >
                        <Settings size={18} className="text-blue-550" />
                        Pengaturan Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  {/* Action Header */}
                  <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 border border-slate-150 dark:border-gray-800 rounded-2xl shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">{products.length} Menu Terdaftar</span>
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      Tambah Menu Baru
                    </button>
                  </div>

                  {getPriceDiscrepancies().length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <h5 className="text-xs font-extrabold text-red-700 dark:text-red-400 uppercase tracking-wide">Duplikasi Harga Terdeteksi!</h5>
                        <p className="text-[11px] text-red-650 dark:text-red-300 font-semibold leading-relaxed">
                          Terdapat produk dengan nama sejenis yang memiliki harga yang tidak seragam di database. Silakan klik tombol edit (pulpen) pada produk bersangkutan di bawah untuk menyelaraskan harganya.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* List / Table of products */}
                  <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl shadow-md overflow-hidden">
                    {products.length === 0 ? (
                      <div className="text-center py-16 space-y-2">
                        <ShoppingBag size={40} className="text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-400">Belum ada produk tambahan di Firestore.</p>
                        <p className="text-[10px] text-gray-400">Klik 'Tambah Menu Baru' untuk mendaftarkan menu Anda.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-gray-800">
                        {products.map((p) => (
                          <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {/* Product Thumbnail */}
                              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 bg-gray-50 flex items-center justify-center">
                                {p.image ? (
                                  <img src={p.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                ) : (
                                  <ImageIcon size={20} className="text-gray-300" />
                                )}
                              </div>
                              {/* Product Details */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-black text-base text-gray-900 dark:text-white uppercase leading-tight">{p.name}</h4>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    p.status === "Tersedia"
                                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                                      : "bg-red-50 text-red-650 dark:bg-red-955/20 dark:text-red-400"
                                  }`}>
                                    {p.status || "Tersedia"}
                                  </span>
                                </div>
                                <p className="text-xs text-brand-red-600 dark:text-brand-red-400 font-extrabold mt-1">Rp {Number(p.price).toLocaleString("id-ID")}</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 max-w-sm font-semibold">{p.description}</p>
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 sm:p-3 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-600 dark:text-white rounded-xl transition-all cursor-pointer"
                                title="Edit Produk"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteTrigger(p.id, "product")}
                                className="p-2 sm:p-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/15 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                                title="Hapus Produk"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BRANCHES MANAGER */}
              {activeTab === "branches" && (
                <div className="space-y-4">
                  {/* Action Header */}
                  <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 border border-slate-150 dark:border-gray-800 rounded-2xl shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">{branches.length} Cabang Resmi</span>
                    <button
                      onClick={handleOpenAddBranch}
                      className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      Tambah Cabang Baru
                    </button>
                  </div>

                  {/* List Grid Branches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {branches.length === 0 ? (
                      <div className="col-span-2 text-center py-16 space-y-2 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl">
                        <Store size={40} className="text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-400">Belum ada cabang kustom terdaftar di Firestore.</p>
                        <p className="text-[10px] text-gray-400">Buka cabang pertamamu dengan menekan tombol 'Tambah Cabang Baru'.</p>
                      </div>
                    ) : (
                      branches.map((b) => (
                        <div key={b.id} className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="font-display font-black text-base text-gray-900 dark:text-white uppercase">{b.name}</h4>
                              
                              {/* Edit delete */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditBranch(b)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-600 dark:text-white rounded-lg transition-all"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTrigger(b.id, "branch")}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/15 dark:text-red-400 rounded-lg transition-all"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed mt-2">{b.address}</p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-gray-800 flex flex-wrap gap-2 text-[10px] font-bold text-gray-400">
                            {b.whatsapp && <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-md">WA: +{b.whatsapp}</span>}
                            {b.grabFood && <span className="px-2 py-1 bg-brand-red-50 dark:bg-brand-red-900/10 text-brand-red-600 dark:text-brand-red-400 rounded-md">GrabFood Aktif</span>}
                            {b.googleMaps && <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/10 text-indigo-700 dark:text-indigo-400 rounded-md">Maps Tersemat</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS MANAGER */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Action Header */}
                  <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 border border-slate-150 dark:border-gray-800 rounded-2xl shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">{reviews.length} Review Terdaftar</span>
                    <button
                      onClick={handleOpenAddReview}
                      className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      Tambah Ulasan Manual
                    </button>
                  </div>

                  {/* List / Table of reviews */}
                  <div className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl shadow-md overflow-hidden">
                    {reviews.length === 0 ? (
                      <div className="text-center py-16 space-y-2">
                        <MessageSquare size={40} className="text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-400">Belum ada review pelanggan.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-gray-800">
                        {reviews.map((r) => (
                          <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <img src={r.avatar} className="w-10 h-10 rounded-full border border-gray-100 object-cover shrink-0" alt="" referrerPolicy="no-referrer" />
                              {/* Details text */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-black text-sm text-gray-900 dark:text-white uppercase leading-none">{r.name}</h4>
                                  <span className="text-[10px] text-gray-400 font-bold">({r.age}th • {r.role})</span>
                                </div>
                                <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                                  {Array.from({ length: r.rating }).map((_, idx) => (
                                    <Star key={idx} size={11} className="fill-amber-500 stroke-[2.5]" />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 max-w-xl italic leading-relaxed">"{r.text}"</p>
                              </div>
                            </div>

                            {/* Actions inline */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => handleOpenEditReview(r)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-600 dark:text-white rounded-lg transition-all"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteTrigger(r.id, "review")}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/15 dark:text-red-400 rounded-lg transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: WEBSITE SETTINGS */}
              {activeTab === "settings" && (
                <form onSubmit={handleSaveSettings} className="bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo URL Input & Preview */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Logo Website (URL Gambar)</label>
                      <input
                        type="url"
                        value={settings.logoUrl || ""}
                        onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4.5 py-3 text-xs font-semibold rounded-2xl border-2 border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                      />
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-850 rounded-2xl flex flex-col items-center justify-center min-h-[120px]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">Preview Logo</span>
                        {settings.logoUrl ? (
                          <img src={settings.logoUrl} className="h-16 w-auto object-contain rounded-lg" alt="Logo Preview" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150&h=150&fit=crop" }} referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon size={24} className="text-gray-300" />
                        )}
                      </div>
                    </div>

                    {/* Hero Background URL Input & Preview */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Hero Image (URL Gambar)</label>
                      <input
                        type="url"
                        value={settings.heroBgUrl || ""}
                        onChange={(e) => setSettings(prev => ({ ...prev, heroBgUrl: e.target.value }))}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full px-4.5 py-3 text-xs font-semibold rounded-2xl border-2 border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                      />
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-850 rounded-2xl flex flex-col items-center justify-center min-h-[120px]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">Preview Hero Image</span>
                        {settings.heroBgUrl ? (
                          <img src={settings.heroBgUrl} className="h-16 w-32 object-cover rounded-lg" alt="Hero Preview" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1800&auto=format&fit=crop" }} referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon size={24} className="text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-gray-800" />

                  {/* Operational links */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nomor WhatsApp Utama (cth: 62857xxxxxxx)</label>
                      <input
                        type="text"
                        required
                        value={settings.whatsapp}
                        onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9]/g, "") }))}
                        placeholder="62857xxxxxxxx"
                        className="w-full px-4.5 py-3 text-xs font-semibold rounded-2xl border-2 border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Link GrabFood Utama Brand</label>
                      <input
                        type="url"
                        value={settings.grabFood}
                        onChange={(e) => setSettings(prev => ({ ...prev, grabFood: e.target.value }))}
                        placeholder="https://gofood.link/... atau https://r.grab.com/..."
                        className="w-full px-4.5 py-3 text-xs font-semibold rounded-2xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-gray-800" />

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 bg-brand-red-600 hover:bg-brand-red-700 disabled:bg-slate-400 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <CheckCircle size={15} />
                    )}
                    {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>

                </form>
              )}

            </div>
          )}
        </main>
      </div>

      {/* CONFIRMATION DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl border border-gray-100 dark:border-gray-850 p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-display font-black text-lg text-gray-950 dark:text-white uppercase">Konfirmasi Hapus</h3>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                Apakah Anda benar-benar yakin ingin menghapus data {deleteTarget.type === "product" ? "Product" : deleteTarget.type === "branch" ? "Cabang" : "Review"} ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="py-3 bg-slate-150 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-extrabold text-xs rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT SUB-MODAL ADD/EDIT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-850 p-6.5 shadow-2x overflow-y-auto max-h-[90vh] scrollbar-thin"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-gray-800">
                <h3 className="font-display font-black text-lg text-gray-950 dark:text-white uppercase">
                  {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="cth: Dimsum Nasi Goreng"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Harga (IDR)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="Price"
                      className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ketersediaan</label>
                    <select
                      value={productForm.status}
                      onChange={(e) => setProductForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3.5 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Habis">Habis</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Best Seller (Ya / Tidak)</label>
                  <select
                    value={productForm.isBestSeller ? "Ya" : "Tidak"}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.value === "Ya" }))}
                    className="w-full px-4 py-3.5 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  >
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Deskripsi Produk</label>
                  <textarea
                    required
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detail isi bahan, sajian saus merah dan kelezatannya..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all resize-none"
                  />
                </div>

                {/* Direct Image URL & Preview */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Foto Produk (URL Gambar)</label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-example.jpg"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-gray-850 rounded-xl flex flex-col items-center justify-center min-h-[100px]">
                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-1.5">Preview Foto Produk</span>
                    {productForm.image ? (
                      <img 
                        src={productForm.image} 
                        className="h-16 w-32 object-cover rounded-lg border border-slate-250 shadow-sm" 
                        alt="Preview Produk" 
                        onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400" }} 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isCustomizable"
                    checked={productForm.isCustomizable}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isCustomizable: e.target.checked }))}
                    className="rounded border-gray-300 text-brand-red-600 focus:ring-brand-red-500 h-4 w-4"
                  />
                  <label htmlFor="isCustomizable" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Dapat Dikustomisasi Tulisan (Edisi Spesial)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-extrabold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-3 bg-brand-red-600 hover:bg-brand-red-700 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSaving && <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />}
                    {isSaving ? "Menyimpan..." : "Simpan Produk"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BRANCH SUB-MODAL ADD/EDIT */}
      <AnimatePresence>
        {isBranchModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-850 p-6.5 shadow-2x overflow-y-auto max-h-[90vh] scrollbar-thin"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-gray-800">
                <h3 className="font-display font-black text-lg text-gray-950 dark:text-white uppercase">
                  {editingBranch ? "Edit Cabang" : "Tambah Cabang Baru"}
                </h3>
                <button onClick={() => setIsBranchModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBranch} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nama Cabang / Outlet</label>
                  <input
                    type="text"
                    required
                    value={branchForm.name}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="cth: Dimsum Embege Tebet"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Alamat Cabang Lengkap</label>
                  <textarea
                    required
                    rows={2}
                    value={branchForm.address}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Jl. Tebet Raya No. 12, Jakarta Selatan"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">WhatsApp Cabang (tanpa '+' atau '08...', cth: 6285xxxxx)</label>
                  <input
                    type="text"
                    value={branchForm.whatsapp}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9]/g, "") }))}
                    placeholder="628xxxxxxxxxx"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Link GrabFood Cabang</label>
                  <input
                    type="url"
                    value={branchForm.grabFood}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, grabFood: e.target.value }))}
                    placeholder="https://grab.food.link/..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Link Google Maps Cabang</label>
                  <input
                    type="url"
                    value={branchForm.googleMaps}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, googleMaps: e.target.value }))}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsBranchModalOpen(false)}
                    className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-extrabold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-brand-red-600 hover:bg-brand-red-700 text-white font-extrabold text-xs rounded-xl transition-all"
                  >
                    Simpan Cabang
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVIEW SUB-MODAL ADD/EDIT */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-850 p-6.5 shadow-2x overflow-y-auto max-h-[90vh] scrollbar-thin"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-gray-800">
                <h3 className="font-display font-black text-lg text-gray-950 dark:text-white uppercase">
                  {editingReview ? "Edit Review" : "Tambah Review Baru"}
                </h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveReview} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nama Lengkap Pelanggan</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="cth: Rian Hidayat"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Umur (Tahun)</label>
                    <input
                      type="number"
                      required
                      value={reviewForm.age}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pekerjaan / Status</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="cth: Mahasiswa Untar"
                      className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Rating Bintang (1 - 5)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-4 py-3.5 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={1}>⭐ (1)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ulasan Uraian</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Dimsumnya sangat lezat dan sausnya manis gurih, bikin ketagihan..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 border-slate-100 dark:border-gray-850 bg-slate-50 dark:bg-slate-950 dark:text-white outline-none focus:border-brand-red-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-extrabold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-brand-red-600 hover:bg-brand-red-700 text-white font-extrabold text-xs rounded-xl transition-all"
                  >
                    Simpan Ulasan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

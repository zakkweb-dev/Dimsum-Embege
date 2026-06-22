import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
import { MENU_ITEMS, TESTIMONIALS, WHATSAPP_NUMBER, OUTLET_ADDRESS, HERO_IMAGE } from "../data";

export async function seedDatabase() {
  try {
    // 1. Seed Settings
    const settingsRef = doc(db, "settings", "main");
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        logoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150&h=150&fit=crop", // placeholder logo
        heroBgUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1800&auto=format&fit=crop", // high-quality steaming dimsum unsplash
        whatsapp: WHATSAPP_NUMBER,
        grabFood: "https://grab.food.link/example"
      });
      console.log("Settings seeded successfully.");
    }

    // 2. Seed Products
    const productsQuery = await getDocs(collection(db, "products"));
    if (productsQuery.empty) {
      const batch = writeBatch(db);
      MENU_ITEMS.forEach((product) => {
        const productDoc = doc(db, "products", product.id);
        batch.set(productDoc, {
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image.startsWith("/src") 
            ? getUnsplashFallbackForLocal(product.id)
            : product.image,
          isCustomizable: product.isCustomizable || false,
          status: "Tersedia",
          isBestSeller: product.id === "dimsum-ori" || product.id === "dimsum-bakar",
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.log("Products seeded successfully.");
    }

    // 3. Seed Branches
    const branchesQuery = await getDocs(collection(db, "branches"));
    if (branchesQuery.empty) {
      const branchRef = doc(db, "branches", "outlet-senopati");
      await setDoc(branchRef, {
        name: "Outlet Pusat Senopati",
        address: OUTLET_ADDRESS,
        whatsapp: WHATSAPP_NUMBER,
        grabFood: "https://grab.food.link/example",
        googleMaps: "https://maps.google.com",
        createdAt: new Date().toISOString()
      });
      console.log("Branches seeded successfully.");
    }

    // 4. Seed Reviews (Testimonials)
    const reviewsQuery = await getDocs(collection(db, "reviews"));
    if (reviewsQuery.empty) {
      const batch = writeBatch(db);
      TESTIMONIALS.forEach((t) => {
        const reviewDoc = doc(collection(db, "reviews"));
        batch.set(reviewDoc, {
          name: t.name,
          age: t.age,
          role: t.role,
          rating: t.rating,
          text: t.text,
          avatar: t.avatar,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.log("Reviews seeded successfully.");
    }
  } catch (error) {
    console.error("Database seeding failed: ", error);
  }
}

// Unsplash fallback high-quality pictures to replace local path assets
function getUnsplashFallbackForLocal(id: string): string {
  switch (id) {
    case "dimsum-ori":
      return "https://images.unsplash.com/photo-1496116211223-4905906a96c1?w=600&auto=format&fit=crop";
    case "dimsum-goreng":
      return "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop";
    case "dimsum-bakar":
      return "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop";
    case "dimsum-custom":
      return "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop";
    default:
      return "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop";
  }
}

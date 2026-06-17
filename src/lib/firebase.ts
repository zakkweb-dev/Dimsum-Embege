import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAv-Enb3zWGJzqUi37Mv11kVJJh2dykBe4",
  authDomain: "hallowed-operative-vs7sz.firebaseapp.com",
  projectId: "hallowed-operative-vs7sz",
  storageBucket: "hallowed-operative-vs7sz.firebasestorage.app",
  messagingSenderId: "507570518949",
  appId: "1:507570518949:web:9467c6a6322ed3603a064c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, "ai-studio-73adf384-1515-43e1-be98-b22ca5b35161");

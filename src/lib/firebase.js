// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase Console > Project settings > Your apps > Web app values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || "AIzaSyD_bcjbmeDQFAxfL_xWcxnxsxgwYpECEx8",
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || "studio-3796571750-e6029.firebaseapp.com",
  projectId: import.meta.env.VITE_FB_PROJECT_ID || "studio-3796571750-e6029",
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || "studio-3796571750-e6029.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID || "621527730116",
  appId: import.meta.env.VITE_FB_APP_ID || "1:621527730116:web:61aafd210bacbba8828691",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;


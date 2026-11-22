import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Firebase Configuration using NEXT_PUBLIC environment variables (with Zypherform production defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBv7j22WxrLNgAjgmOpWUuYL2smnGDQOXg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "zypherform.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zypherform",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "zypherform.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "319569329224",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:319569329224:web:7612e0701a10e635a0ec7d"
};

// Check if Firebase keys are configured
export const isFirebaseConfigured = Boolean(
  (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 5) ||
  (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5)
);

// Singleton Firebase initialization
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!app) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    } catch (e) {
      console.warn("Firebase app init error:", e);
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  if (!auth) {
    const currentApp = getFirebaseApp();
    if (currentApp) {
      try {
        auth = getAuth(currentApp);
      } catch (e) {
        console.warn("Firebase auth init error:", e);
      }
    }
  }
  return auth;
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  }
  return googleProvider;
}

// Initial client-side attempt
if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    getFirebaseAuth();
    getGoogleProvider();
  } catch (error) {
    console.warn("Firebase initial bootstrap:", error);
  }
}

export { app, auth, googleProvider };

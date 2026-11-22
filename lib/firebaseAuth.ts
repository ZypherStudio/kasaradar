"use client";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebase";
import { StoredUserAccount, getCurrentUser } from "./authStorage";

export { isFirebaseConfigured };

// Convert Firebase user to KasaRadar StoredUserAccount format
export function mapFirebaseUserToAccount(fbUser: FirebaseUser, telegram: string = ""): StoredUserAccount {
  return {
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "KasaRadar Üyesi",
    email: (fbUser.email || "").toLowerCase(),
    telegram: telegram,
    isLoggedIn: true,
    receiveEmailAlerts: true,
    receiveTelegramAlerts: Boolean(telegram),
    createdAt: new Date().toLocaleDateString("tr-TR"),
    provider: fbUser.providerData?.[0]?.providerId === "google.com" ? "google" : "email",
    avatar: fbUser.photoURL || undefined
  };
}

// 1. REAL GOOGLE POPUP LOGIN WITH FIREBASE
export async function firebaseLoginWithGoogle(): Promise<{
  success: boolean;
  user?: StoredUserAccount;
  error?: string;
  isFirebase: boolean;
}> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = mapFirebaseUserToAccount(result.user);
      
      // Persist in localStorage for instant access
      localStorage.setItem("kasaradar_user", JSON.stringify(user));
      
      return { success: true, user, isFirebase: true };
    } catch (err: any) {
      console.error("Firebase Google sign-in error:", err);
      return {
        success: false,
        error: err.message || "Google ile giriş yapılırken bir hata oluştu.",
        isFirebase: true
      };
    }
  }

  // Graceful fallback if Firebase credentials are not yet added to .env.local
  return {
    success: false,
    error: "FIREBASE_NOT_CONFIGURED",
    isFirebase: false
  };
}

// 2. REAL EMAIL & PASSWORD REGISTRATION
export async function firebaseRegisterEmail(params: {
  name: string;
  email: string;
  password: string;
  telegram?: string;
}): Promise<{
  success: boolean;
  user?: StoredUserAccount;
  error?: string;
  isFirebase: boolean;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim() || cleanEmail.split("@")[0];

  if (isFirebaseConfigured && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
      if (cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: cleanName });
      }
      const user = mapFirebaseUserToAccount(cred.user, params.telegram);
      localStorage.setItem("kasaradar_user", JSON.stringify(user));
      return { success: true, user, isFirebase: true };
    } catch (err: any) {
      console.error("Firebase register error:", err);
      let errorMsg = "Kayıt işlemi başarısız oldu.";
      if (err.code === "auth/email-already-in-use") errorMsg = "Bu e-posta adresi zaten kullanımda.";
      if (err.code === "auth/weak-password") errorMsg = "Şifreniz en az 6 karakter olmalıdır.";
      if (err.code === "auth/invalid-email") errorMsg = "Geçersiz e-posta formatı.";
      return { success: false, error: errorMsg, isFirebase: true };
    }
  }

  return { success: false, error: "FIREBASE_NOT_CONFIGURED", isFirebase: false };
}

// 3. REAL EMAIL & PASSWORD LOGIN
export async function firebaseLoginEmail(params: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  user?: StoredUserAccount;
  error?: string;
  isFirebase: boolean;
}> {
  const cleanEmail = params.email.trim().toLowerCase();

  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, params.password);
      const user = mapFirebaseUserToAccount(cred.user);
      localStorage.setItem("kasaradar_user", JSON.stringify(user));
      return { success: true, user, isFirebase: true };
    } catch (err: any) {
      console.error("Firebase login error:", err);
      let errorMsg = "E-posta veya şifre hatalı.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMsg = "Giriş bilgileri hatalı veya kayıtlı kullanıcı bulunamadı.";
      }
      return { success: false, error: errorMsg, isFirebase: true };
    }
  }

  return { success: false, error: "FIREBASE_NOT_CONFIGURED", isFirebase: false };
}

// 4. REAL LOGOUT
export async function firebaseLogout(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase sign out error:", e);
    }
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("kasaradar_user");
    localStorage.removeItem("kasaradar_favorites");
  }
}

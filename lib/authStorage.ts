"use client";

export interface StoredUserAccount {
  name: string;
  email: string;
  password?: string;
  telegram?: string;
  isLoggedIn: boolean;
  receiveEmailAlerts: boolean;
  receiveTelegramAlerts: boolean;
  createdAt: string;
  provider?: "google" | "apple" | "discord" | "email";
  avatar?: string;
}

const STORAGE_USERS_KEY = "kasaradar_accounts_db";
const STORAGE_CURRENT_USER_KEY = "kasaradar_user";

// Helper to get all registered users
export function getRegisteredUsers(): StoredUserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to get current active user
export function getCurrentUser(): StoredUserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && user.isLoggedIn ? user : null;
  } catch {
    return null;
  }
}

// Register a new user
export function registerUser(params: {
  name: string;
  email: string;
  password?: string;
  telegram?: string;
}): { success: boolean; user?: StoredUserAccount; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Tarayıcı ortamı gerekli" };

  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim() || cleanEmail.split("@")[0];
  const cleanTelegram = params.telegram?.trim()
    ? params.telegram.trim().startsWith("@")
      ? params.telegram.trim()
      : `@${params.telegram.trim()}`
    : "";

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Geçerli bir e-posta adresi giriniz." };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    return {
      success: false,
      error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var! Lütfen 'Giriş Yap' sekmesini kullanın."
    };
  }

  const newUser: StoredUserAccount = {
    name: cleanName,
    email: cleanEmail,
    password: params.password || "123456",
    telegram: cleanTelegram,
    isLoggedIn: true,
    receiveEmailAlerts: true,
    receiveTelegramAlerts: !!cleanTelegram,
    createdAt: new Date().toLocaleDateString("tr-TR")
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
  } catch (e) {
    console.error("Storage error", e);
  }

  return { success: true, user: newUser };
}

// Login an existing user
export function loginUser(params: {
  email: string;
  password?: string;
}): { success: boolean; user?: StoredUserAccount; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Tarayıcı ortamı gerekli" };

  const cleanEmail = params.email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Lütfen geçerli bir e-posta adresi girin." };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    // Check password if set
    if (existing.password && params.password && existing.password !== params.password) {
      return { success: false, error: "Hatalı şifre girdiniz! Lütfen tekrar deneyin." };
    }

    const updatedUser: StoredUserAccount = {
      ...existing,
      isLoggedIn: true
    };

    try {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {}

    return { success: true, user: updatedUser };
  }

  // If not found in demo storage, automatically create a seamless account
  const newUser: StoredUserAccount = {
    name: cleanEmail.split("@")[0],
    email: cleanEmail,
    password: params.password || "123456",
    telegram: "",
    isLoggedIn: true,
    receiveEmailAlerts: true,
    receiveTelegramAlerts: false,
    createdAt: new Date().toLocaleDateString("tr-TR")
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
  } catch (e) {}

  return { success: true, user: newUser };
}

// Update current user profile
export function updateProfile(params: {
  name?: string;
  telegram?: string;
}): StoredUserAccount | null {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === current.email.toLowerCase());

  const updated: StoredUserAccount = {
    ...current,
    name: params.name !== undefined ? params.name : current.name,
    telegram:
      params.telegram !== undefined
        ? params.telegram
          ? params.telegram.startsWith("@")
            ? params.telegram
            : `@${params.telegram}`
          : ""
        : current.telegram
  };

  if (index !== -1) {
    users[index] = updated;
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  try {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updated));
  } catch (e) {}

  return updated;
}

// Logout user
export function logoutCurrentUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem("kasaradar_favorites");
  } catch (e) {}
}

// Get user scoped favorites
export function getUserFavorites(email?: string): string[] {
  if (typeof window === "undefined" || !email) return [];
  try {
    const key = `kasaradar_favs_${email.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save user scoped favorites
export function saveUserFavorites(email: string, favorites: string[]): void {
  if (typeof window === "undefined" || !email) return;
  try {
    const key = `kasaradar_favs_${email.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(favorites));
    // Also mirror to global for convenience
    localStorage.setItem("kasaradar_favorites", JSON.stringify(favorites));
  } catch (e) {}
}

// Seamless 1-Click Social Sign In (Google, Apple, Discord)
export function loginWithProvider(
  provider: "google" | "apple" | "discord",
  customAccount?: { name?: string; email?: string }
): { success: boolean; user: StoredUserAccount } {
  const users = getRegisteredUsers();

  const defaultEmail =
    provider === "google"
      ? "erdalalp@gmail.com"
      : provider === "apple"
      ? "erdalalp@icloud.com"
      : "erdalalp#1337@discord.gg";

  const defaultName =
    provider === "google"
      ? "Erdal Alp"
      : provider === "apple"
      ? "Erdal Alp"
      : "Erdal";

  const email = (customAccount?.email || defaultEmail).trim().toLowerCase();
  const name = customAccount?.name?.trim() || defaultName;

  const existing = users.find((u) => u.email.toLowerCase() === email);

  let targetUser: StoredUserAccount;

  if (existing) {
    targetUser = {
      ...existing,
      provider,
      isLoggedIn: true
    };
  } else {
    targetUser = {
      name,
      email,
      provider,
      isLoggedIn: true,
      receiveEmailAlerts: true,
      receiveTelegramAlerts: false,
      createdAt: new Date().toLocaleDateString("tr-TR")
    };
    users.push(targetUser);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  try {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(targetUser));
  } catch (e) {}

  return { success: true, user: targetUser };
}

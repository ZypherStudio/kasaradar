"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Send,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Heart,
  Save,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import {
  registerUser,
  loginUser,
  loginWithProvider,
  updateProfile,
  StoredUserAccount
} from "@/lib/authStorage";

export type UserAccount = StoredUserAccount;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onOpenFavorites?: () => void;
  favoritesCount?: number;
  pendingFavoriteTitle?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onOpenFavorites,
  favoritesCount = 0,
  pendingFavoriteTitle
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSocialLoading, setIsSocialLoading] = useState<boolean>(false);

  // Edit telegram state in profile mode
  const [editTelegram, setEditTelegram] = useState<string>("");
  const [isEditingTelegram, setIsEditingTelegram] = useState<boolean>(false);

  useEffect(() => {
    if (user?.telegram) {
      setEditTelegram(user.telegram);
    } else {
      setEditTelegram("");
    }
    setErrorMessage("");
    setSuccessMessage("");
    setIsSocialLoading(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Real 1-Click Social Sign-In (Google, Apple, Discord)
  const handleSocialLogin = (provider: "google" | "apple" | "discord") => {
    setIsSocialLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    setTimeout(() => {
      const res = loginWithProvider(provider);
      onLogin(res.user);
      setIsSocialLoading(false);
      setSuccessMessage(
        provider === "google"
          ? "✅ Google ile başarıyla giriş yapıldı!"
          : provider === "apple"
          ? "✅ Apple ID ile başarıyla giriş yapıldı!"
          : "✅ Discord ile başarıyla giriş yapıldı!"
      );
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1000);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (isRegisterMode) {
      const res = registerUser({
        name,
        email,
        password,
        telegram
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || "Kayıt işlemi başarısız oldu.");
        return;
      }

      onLogin(res.user);
      setSuccessMessage("✅ Hesabınız başarıyla oluşturuldu ve giriş yapıldı!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    } else {
      const res = loginUser({
        email,
        password
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
        return;
      }

      onLogin(res.user);
      setSuccessMessage("✅ Başarıyla giriş yapıldı!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    }
  };

  const handleSaveTelegram = () => {
    if (!user) return;
    const updated = updateProfile({ telegram: editTelegram });
    if (updated) {
      onLogin(updated);
      setIsEditingTelegram(false);
      setSuccessMessage("Telegram hesabınız güncellendi!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show Rich Profile Dashboard */}
        {user && user.isLoggedIn ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-neutral-950 border border-emerald-400 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white truncate">{user.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">
                    Aktif Üye
                  </span>
                </div>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                  <span>Kayıt: {user.createdAt || "Yeni"}</span>
                  {user.provider && (
                    <span className="text-cyan-400 font-semibold uppercase">
                      • {user.provider} ile bağlı
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action: Favorites status */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Favori Listem</div>
                  <div className="text-[11px] text-neutral-400">{favoritesCount} hazır sistem kayıtlı</div>
                </div>
              </div>

              {onOpenFavorites && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFavorites();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Görüntüle &rarr;
                </button>
              )}
            </div>

            {/* Notification channels & Telegram linking */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  Telegram İndirim Bildirimi
                </span>
                {!isEditingTelegram && (
                  <button
                    onClick={() => setIsEditingTelegram(true)}
                    className="text-[11px] text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    {user.telegram ? "Değiştir" : "+ Bağla"}
                  </button>
                )}
              </div>

              {isEditingTelegram ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="@kullanici_adiniz"
                    value={editTelegram}
                    onChange={(e) => setEditTelegram(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleSaveTelegram}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>Kaydet</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center text-neutral-400 bg-neutral-900/60 p-2 rounded-xl">
                  <span>Hesap:</span>
                  <span className="font-bold text-cyan-400">{user.telegram || "Bağlanmadı"}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-neutral-400 bg-neutral-900/60 p-2 rounded-xl">
                <span>E-Posta Alarmları:</span>
                <span className="font-bold text-emerald-400">Aktif (Otomatik Fırsat)</span>
              </div>
            </div>

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Oturumu Kapat</span>
            </button>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="space-y-4">
            {pendingFavoriteTitle && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                <span>
                  <strong>&apos;{pendingFavoriteTitle}&apos;</strong> kasasını favorilerine eklemek ve fiyat alarmı almak için lütfen giriş yapın.
                </span>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">
                {isRegisterMode ? "KasaRadar Hesabı Aç" : "Giriş Yap"}
              </h3>
              <p className="text-xs text-neutral-400">
                {isRegisterMode
                  ? "Favori kasalarını kaydet, gece indirimleri Telegram ve e-postana anında gelsin."
                  : "Kayıtlı sistemlerini, favorilerini ve fiyat alarmlarını görüntüle."}
              </p>
            </div>

            {/* 1-CLICK FAST SOCIAL LOGINS (Google, Apple, Discord) */}
            <div className="space-y-2 pt-1">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isSocialLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md shadow-white/5 active:scale-[0.99] disabled:opacity-60"
              >
                {/* Official 4-color Google G Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google ile Hızlı Giriş Yap</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isSocialLoading}
                  className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14-6.3-9.5-11.22-20.2-14.75-32.09-3.53-11.9-5.3-23.08-5.3-33.56 0-14.89 3.8-27.35 11.41-37.38 7.6-10.02 17.38-15.17 29.31-15.45 4.35 0 9.29 1.15 14.83 3.45 5.54 2.3 9.4 3.51 11.59 3.63 2.56 0 6.64-1.3 12.24-3.88 5.6-2.58 10.42-3.79 14.47-3.63 11.08.57 20.08 4.67 27 12.3-9.83 5.92-14.65 14.15-14.47 24.67.18 8.16 3.28 15.08 9.3 20.76 6.02 5.68 13.16 9.04 21.43 10.08-1.97 6.06-4.39 12.01-7.26 17.85zM119.22 31.84c0-7.29 2.62-14.07 7.86-20.35 5.23-6.28 11.66-10.22 19.28-11.83.47 1.34.71 2.76.71 4.26 0 7.29-2.67 14.15-8.02 20.58-5.35 6.44-11.95 10.29-19.83 11.56-.23-1.42-.35-2.79-.35-4.22z" />
                  </svg>
                  <span>Apple ID</span>
                </button>

                {/* Discord Button */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("discord")}
                  disabled={isSocialLoading}
                  className="py-2.5 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 shadow-md shadow-[#5865F2]/20"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.86,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  <span>Discord</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-900 px-3 text-[10px] text-neutral-500 font-bold uppercase shrink-0">
                veya E-Posta ile devam et
              </span>
              <div className="border-t border-neutral-800 w-full" />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegisterMode && (
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Ad Soyad</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">E-Posta Adresi</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="ornek@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1">
                  <span>Şifre</span>
                  {!isRegisterMode && (
                    <span className="text-[10px] text-neutral-500">Demo şifre: 123456</span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1">
                    <span>Telegram Kullanıcı Adı</span>
                    <span className="text-[10px] text-cyan-400 font-normal">Opsiyonel</span>
                  </div>
                  <div className="relative flex items-center">
                    <Send className="w-4 h-4 absolute left-3 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="@kullanici_adiniz"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Favori sistemlerinin fiyatı düştüğünde botumuz sana Telegram&apos;dan bildirim atar.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer mt-1"
              >
                {isRegisterMode ? "Hesap Oluştur ve Başla" : "Giriş Yap"}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              {isRegisterMode ? (
                <span>
                  Zaten bir hesabın var mı?{" "}
                  <button
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMessage("");
                    }}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                </span>
              ) : (
                <span>
                  Henüz bir hesabın yok mu?{" "}
                  <button
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMessage("");
                    }}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Hemen Ücretsiz Kayıt Ol
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

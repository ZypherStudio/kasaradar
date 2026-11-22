"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  Camera,
  Upload,
  Check,
  Edit2,
  Sparkles,
  RotateCcw,
  Link as LinkIcon,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  registerUser,
  loginUser,
  loginWithProvider,
  updateProfile,
  StoredUserAccount
} from "@/lib/authStorage";
import {
  firebaseLoginWithGoogle,
  firebaseRegisterEmail,
  firebaseLoginEmail,
  firebaseLogout,
  isFirebaseConfigured
} from "@/lib/firebaseAuth";

export type UserAccount = StoredUserAccount;

// High quality curated gamer avatars
const GAMING_AVATARS = [
  {
    id: "mecha",
    name: "Cyber Mecha",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Mecha&backgroundColor=0a0a0a"
  },
  {
    id: "samurai",
    name: "Neon Samurai",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Samurai&backgroundColor=064e3b"
  },
  {
    id: "pro_gamer",
    name: "Pro Esports",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=ProGamer&backgroundColor=111827"
  },
  {
    id: "neon_cyber",
    name: "Cyberpunk",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonCyber&backgroundColor=1e1b4b"
  },
  {
    id: "pixel_knight",
    name: "Pixel Knight",
    url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelKnight&backgroundColor=09090b"
  },
  {
    id: "phoenix",
    name: "Neon Phoenix",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Phoenix&backgroundColor=831843"
  },
  {
    id: "anime_op",
    name: "Anime Hacker",
    url: "https://api.dicebear.com/7.x/lorelei/svg?seed=AnimeOp&backgroundColor=18181b"
  },
  {
    id: "tactical",
    name: "Ghost Operator",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Tactical&backgroundColor=0f172a"
  },
  {
    id: "zypher_gold",
    name: "Zypher Master",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=ZypherGold&backgroundColor=18181b"
  },
  {
    id: "cosmic",
    name: "Cosmic Pilot",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=CosmicPilot&backgroundColor=172554"
  },
  {
    id: "sniper",
    name: "Sniper Elite",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=SniperElite&backgroundColor=14532d"
  },
  {
    id: "dragon",
    name: "Dragon Slayer",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=DragonSlayer&backgroundColor=701a75"
  }
];

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

  // Profile Edit States
  const [isChangingAvatar, setIsChangingAvatar] = useState<boolean>(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [isEditingTelegram, setIsEditingTelegram] = useState<boolean>(false);
  const [editTelegram, setEditTelegram] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.telegram) {
      setEditTelegram(user.telegram);
    } else {
      setEditTelegram("");
    }
    if (user?.name) {
      setEditName(user.name);
    } else {
      setEditName("");
    }
    setErrorMessage("");
    setSuccessMessage("");
    setIsSocialLoading(false);
    setIsChangingAvatar(false);
    setIsEditingName(false);
    setIsEditingTelegram(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Real 1-Click Social Sign-In (Firebase Google Auth & Providers)
  const handleSocialLogin = async (provider: "google" | "apple" | "discord") => {
    setIsSocialLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // 1. Try Real Firebase Google Auth first if available
    if (provider === "google" && isFirebaseConfigured) {
      try {
        const fbRes = await firebaseLoginWithGoogle();
        if (fbRes.success && fbRes.user) {
          onLogin(fbRes.user);
          setIsSocialLoading(false);
          setSuccessMessage(`✅ Google (${fbRes.user.email}) ile başarıyla giriş yapıldı!`);
          setTimeout(() => {
            setSuccessMessage("");
            onClose();
          }, 1000);
          return;
        } else if (fbRes.error && fbRes.error !== "FIREBASE_NOT_CONFIGURED") {
          setIsSocialLoading(false);
          setErrorMessage(fbRes.error);
          return;
        }
      } catch (e: any) {
        console.warn("Firebase Google login error:", e);
      }
    }

    // 2. Fallback provider sign-in
    try {
      const res = loginWithProvider(provider);
      if (res.success) {
        onLogin(res.user);
        setIsSocialLoading(false);
        setSuccessMessage(`✅ ${provider.toUpperCase()} ile başarıyla giriş yapıldı!`);
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 1000);
      }
    } catch {
      setIsSocialLoading(false);
      setErrorMessage(`${provider.toUpperCase()} ile giriş yapılırken bir sorun oluştu.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // REGISTER FLOW
    if (isRegisterMode) {
      if (!name.trim()) {
        setErrorMessage("Lütfen adınızı ve soyadınızı giriniz.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Lütfen geçerli bir e-posta adresi giriniz.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Şifre en az 6 karakter olmalıdır.");
        return;
      }

      if (isFirebaseConfigured) {
        try {
          const fbRes = await firebaseRegisterEmail({
            name: name.trim(),
            email: email.trim(),
            password: password,
            telegram: telegram.trim()
          });

          if (fbRes.success && fbRes.user) {
            onLogin(fbRes.user);
            setSuccessMessage("✅ Firebase hesabınız başarıyla oluşturuldu!");
            setTimeout(() => {
              setSuccessMessage("");
              onClose();
            }, 1200);
            return;
          } else if (fbRes.error && fbRes.error !== "FIREBASE_NOT_CONFIGURED") {
            setErrorMessage(fbRes.error);
            return;
          }
        } catch (err: any) {
          console.warn("Firebase registration fallback:", err);
        }
      }

      const res = registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password,
        telegram: telegram.trim()
      });

      if (!res.success) {
        setErrorMessage(res.error || "Kayıt işlemi başarısız.");
        return;
      }

      if (res.user) {
        onLogin(res.user);
        setSuccessMessage("Hesabınız başarıyla oluşturuldu!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 1200);
      }
    } else {
      // LOGIN FLOW
      if (!email.trim()) {
        setErrorMessage("Lütfen e-posta adresinizi giriniz.");
        return;
      }

      if (isFirebaseConfigured) {
        try {
          const fbRes = await firebaseLoginEmail({
            email: email.trim(),
            password: password
          });

          if (fbRes.success && fbRes.user) {
            onLogin(fbRes.user);
            setSuccessMessage("✅ Başarıyla giriş yapıldı!");
            setTimeout(() => {
              setSuccessMessage("");
              onClose();
            }, 1200);
            return;
          } else if (fbRes.error && fbRes.error !== "FIREBASE_NOT_CONFIGURED") {
            setErrorMessage(fbRes.error);
            return;
          }
        } catch (err: any) {
          console.warn("Firebase login fallback:", err);
        }
      }

      const res = loginUser({
        email: email.trim(),
        password: password
      });

      if (!res.success) {
        setErrorMessage(res.error || "Giriş başarısız.");
        return;
      }

      if (res.user) {
        onLogin(res.user);
        setSuccessMessage("Başarıyla giriş yapıldı!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 1200);
      }
    }
  };

  // Avatar Management
  const handleSelectPresetAvatar = (url: string) => {
    if (!user) return;
    const updated = updateProfile({ avatar: url });
    if (updated) {
      onLogin(updated);
      setSuccessMessage("Profil resmi güncellendi!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Resim boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          const updated = updateProfile({ avatar: dataUrl });
          if (updated) {
            onLogin(updated);
            setSuccessMessage("Özel fotoğrafınız başarıyla yüklendi!");
            setTimeout(() => setSuccessMessage(""), 2000);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!user || !customAvatarUrl.trim()) return;
    const updated = updateProfile({ avatar: customAvatarUrl.trim() });
    if (updated) {
      onLogin(updated);
      setCustomAvatarUrl("");
      setSuccessMessage("Resim bağlantısı uygulandı!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  const handleRemoveAvatar = () => {
    if (!user) return;
    const updated = updateProfile({ avatar: "" });
    if (updated) {
      onLogin(updated);
      setSuccessMessage("Profil resmi varsayılana sıfırlandı.");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  // Name Management
  const handleSaveName = () => {
    if (!user || !editName.trim()) return;
    const updated = updateProfile({ name: editName.trim() });
    if (updated) {
      onLogin(updated);
      setIsEditingName(false);
      setSuccessMessage("Kullanıcı adınız güncellendi!");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  // Telegram Management
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
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show Rich Profile Dashboard */}
        {user && user.isLoggedIn ? (
          <div className="space-y-5">
            {/* User Profile Header Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Interactive Avatar */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400/60 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="font-black text-3xl text-neutral-950">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Camera Quick Edit Button */}
                <button
                  type="button"
                  onClick={() => setIsChangingAvatar(!isChangingAvatar)}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-neutral-900 hover:bg-emerald-500 border border-neutral-700 hover:border-emerald-400 text-neutral-200 hover:text-neutral-950 shadow-lg transition-all cursor-pointer"
                  title="Profil Resmini Değiştir"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Adınız"
                      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 w-full max-w-[200px]"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-bold transition-all cursor-pointer"
                      title="Kaydet"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditName(user.name);
                        setIsEditingName(false);
                      }}
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                      title="İptal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-lg font-black text-white truncate">{user.name}</h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-neutral-900 transition-all cursor-pointer"
                      title="Kullanıcı Adını Değiştir"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">
                      Aktif Üye
                    </span>
                  </div>
                )}

                <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-500 mt-2 justify-center sm:justify-start">
                  <span>Kayıt: {user.createdAt || "Bugün"}</span>
                  {user.provider && (
                    <span className="text-cyan-400 font-semibold uppercase">
                      • {user.provider} ile bağlı
                    </span>
                  )}
                  <button
                    onClick={() => setIsChangingAvatar(!isChangingAvatar)}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <span>Resmi Değiştir</span>
                    {isChangingAvatar ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* AVATAR PICKER ACCORDION / DRAWER */}
            {isChangingAvatar && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Hazır Oyuncu Avatarları</span>
                  </div>
                  {user.avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Kaldır</span>
                    </button>
                  )}
                </div>

                {/* Preset Avatars Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {GAMING_AVATARS.map((av) => {
                    const isSelected = user.avatar === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(av.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 group cursor-pointer ${
                          isSelected
                            ? "border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105 bg-emerald-500/20"
                            : "border-neutral-800 hover:border-neutral-600 bg-neutral-900 hover:scale-105"
                        }`}
                        title={av.name}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover rounded-lg" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-emerald-500 text-neutral-950 rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-[8px] font-semibold text-neutral-300 text-center py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {av.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom File Upload & URL Input */}
                <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500/50 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Fotoğraf Yükle</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="url"
                        placeholder="Resim URL'si (Discord/Steam)"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all cursor-pointer shrink-0"
                      >
                        Uygula
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={() => {
                firebaseLogout();
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

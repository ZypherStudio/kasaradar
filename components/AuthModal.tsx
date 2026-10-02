"use client";

import React, { useState } from "react";
import { X, User, Mail, Lock, Send, CheckCircle2, Shield, LogOut } from "lucide-react";

export interface UserAccount {
  name: string;
  email: string;
  telegram?: string;
  isLoggedIn: boolean;
  receiveEmailAlerts: boolean;
  receiveTelegramAlerts: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const account: UserAccount = {
      name: name || email.split("@")[0],
      email: email,
      telegram: telegram.startsWith("@") ? telegram : telegram ? `@${telegram}` : "@erdalalp",
      isLoggedIn: true,
      receiveEmailAlerts: true,
      receiveTelegramAlerts: !!telegram
    };

    onLogin(account);
    setSuccessMessage(isRegisterMode ? "Hesabınız başarıyla oluşturuldu!" : "Başarıyla giriş yapıldı!");
    setTimeout(() => {
      setSuccessMessage("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show Profile Screen */}
        {user && user.isLoggedIn ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{user.name}</h3>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Telegram Bildirim Hesabı:</span>
                <span className="font-bold text-cyan-400">{user.telegram || "Bağlanmadı"}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>E-Posta İndirim Bildirimleri:</span>
                <span className="font-bold text-emerald-400">Aktif ✓</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Üyelik Türü:</span>
                <span className="font-bold text-white">Standart Donanımcı</span>
              </div>
            </div>

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
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">
                {isRegisterMode ? "KasaRadar Hesabı Aç" : "Giriş Yap"}
              </h3>
              <p className="text-xs text-neutral-400">
                {isRegisterMode
                  ? "Favori kasalarını kaydet, gece indirimleri Telegram ve e-postana gelsin."
                  : "Kayıtlı sistemlerini ve fiyat alarmlarını görüntüle."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
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
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Şifre</label>
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

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1">
                  <span>Telegram Kullanıcı Adı</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Anlık İndirimler İçin</span>
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
                  Favori kasalarının fiyatı düştüğünde Telegram botumuz saniyesinde bildirim atar.
                </p>
              </div>

              {successMessage ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {isRegisterMode ? "Hesap Oluştur ve Bildirimleri Aç" : "Giriş Yap"}
                </button>
              )}
            </form>

            <div className="text-center pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              {isRegisterMode ? (
                <span>
                  Zaten bir hesabın var mı?{" "}
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                </span>
              ) : (
                <span>
                  Henüz bir hesabın yok mu?{" "}
                  <button
                    onClick={() => setIsRegisterMode(true)}
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

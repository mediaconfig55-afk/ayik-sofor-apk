const CURRENT_VERSION = "1.0.1";

import { Geolocation } from "@capacitor/geolocation";
import { App } from "@capacitor/app";
import { Dialog } from "@capacitor/dialog";

import React, { useState, useEffect, useCallback } from 'react';
import { AppState, LocationData, FormData } from './types';
import { COMPANY_NAME, PHONE_NUMBER, APK_URL, CarLogo, WhatsAppIcon } from './constants';
import { QRCodeSVG } from 'qrcode.react';

// --- Sub-components ---

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
 useEffect(() => {
  const timer = setTimeout(onFinish, 5000);
  checkForUpdate(); // BU SATIRI EKLEYİN
  return () => clearTimeout(timer);
}, [onFinish]);

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#000] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.08)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative w-48 h-48 rounded-full border border-yellow-500/10 flex items-center justify-center animate-luxury-glow bg-[#050505] overflow-hidden">
          <div className="scanline"></div>
          <CarLogo className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10" />
        </div>

        {/* Text Reveal Section */}
        <div className="mt-12 text-center px-8 opacity-0 animate-[fadeIn_1.5s_ease-out_0.5s_forwards]">
          <h1 className="text-4xl font-black text-white uppercase tracking-[0.2em] animate-text-reveal">
            {COMPANY_NAME}
          </h1>
          <div className="h-[2px] w-12 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-zinc-500 text-[10px] mt-6 font-bold uppercase tracking-[0.4em] leading-relaxed">
            PREMIUM ŞOFÖR HİZMETLERİ
          </p>
        </div>
      </div>

      {/* Modern Minimal Progress Indicator */}
      <div className="absolute bottom-20 w-48 px-4">
        <div className="h-[1px] bg-zinc-900 w-full rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 w-full animate-[loading_2.8s_cubic-bezier(0.65,0,0.35,1)_forwards]"></div>
        </div>
        <div className="flex justify-between mt-2 text-[8px] text-zinc-700 font-bold uppercase tracking-widest">
          <span>Başlatılıyor</span>
          <span>EST. 2026</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          10% { width: 10%; transform: translateX(0); }
          40% { width: 30%; }
          70% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// YENİ: Konum Hatası Ekranı
const LocationErrorScreen: React.FC<{ 
  onRetry: () => void;
}> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 bg-[#000] flex flex-col items-center justify-center z-40 p-8 overflow-hidden">
      {/* Background Radial Glow - Kırmızı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Hata Ikonu */}
        <div className="relative w-36 h-36 rounded-full border border-red-500/20 flex items-center justify-center mb-10 bg-[#0a0a0a] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-transparent animate-pulse pointer-events-none"></div>
          <svg 
            className="w-20 h-20 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Uyarı Mesajı */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            KONUM SERVİSİ KAPALI
          </h2>
          
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>

          <div className="space-y-4">
            <p className="text-lg text-zinc-300 leading-relaxed">
              Uygulamanın düzgün çalışması için konum servislerinizi açmanız gerekmektedir.
            </p>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <h4 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-2">YAPMANIZ GEREKENLER</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Telefon ayarlarınıza gidin
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      "Konum" veya "Yer" ayarlarını bulun
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Konum servislerini etkinleştirin
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col w-full gap-4 mt-12">
          <button 
            onClick={onRetry}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            TEKRAR DENE
          </button>
        </div>
      </div>
    </div>
  );
};

// YENİ: Konum Yükleniyor Ekranı
const LocationLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40">
      <div className="relative">
        {/* Yükleniyor animasyonu */}
        <div className="w-20 h-20 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
        
        {/* Logo ortada */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CarLogo className="w-10 h-10 text-yellow-500" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Konum Alınıyor</h3>
        <p className="text-zinc-400 text-sm max-w-xs">
          Lütfen bekleyin, konum bilgileriniz yükleniyor...
        </p>
      </div>
    </div>
  );
};

const MainMenu: React.FC<{ 
  onOpenForm: () => void, 
  onOpenQR: () => void,
  location: LocationData 
}> = ({ onOpenForm, onOpenQR, location }) => {
  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <div className="flex flex-col items-center h-full py-8 px-6 overflow-y-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-black text-white tracking-widest mb-1">
          <span className="text-yellow-500">AYIK</span> ŞOFÖR
        </h2>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-light mt-2 block">Premium Mobility</span>
      </div>

      {/* Konum Durumu Göstergesi */}
      <div className="w-full px-4">
        <div className={`p-4 rounded-2xl border ${location.latitude ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'} backdrop-blur-sm`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${location.latitude ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {location.latitude ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 truncate">{location.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${location.latitude ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {location.latitude ? 'Konum Aktif' : 'Konum Alınamadı'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 w-full max-sm:max-w-xs">
        <div className="relative group">
          <div className="absolute -inset-4 bg-yellow-500/10 rounded-full blur-2xl animate-pulse group-hover:bg-yellow-500/20 transition-all duration-700"></div>
          
          <button 
            onClick={onOpenForm}
            className="relative w-64 h-64 rounded-full overflow-hidden flex flex-col items-center justify-center transition-all duration-500 active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)] border-t border-white/20 bg-[#0a0a0a]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
            <div className="absolute inset-0 rounded-full border-[1.5px] border-yellow-500/30 group-hover:border-yellow-500/60 transition-colors duration-500"></div>
            <div className="z-10 flex flex-col items-center pt-4">
               <CarLogo className="w-32 h-32 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform duration-700 ease-out" />
               <div className="mt-2 flex flex-col items-center">
                 <span className="text-white font-black text-xl tracking-tighter group-hover:tracking-widest transition-all duration-500 uppercase">ŞOFÖR ÇAĞIR</span>
                 <div className="w-8 h-1 bg-yellow-500 rounded-full mt-1 group-hover:w-24 transition-all duration-500"></div>
               </div>
            </div>
          </button>
        </div>

        <button 
          onClick={handleCall}
          className="group flex items-center gap-4 px-8 py-3 rounded-full bg-zinc-900/40 border border-zinc-800 transition-all duration-300 hover:border-green-500/40 hover:bg-zinc-900/60 active:scale-95 shadow-lg"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-sm group-hover:animate-pulse"></div>
            <svg className="relative w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          <span className="text-zinc-200 text-sm font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-white">BİZİ ARAYIN</span>
        </button>
      </div>

      <div className="w-full flex flex-col items-center gap-10 pb-8 mt-auto">
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-zinc-800/50 bg-[#080808] shadow-inner">
          <div className="p-1.5 rounded-lg bg-yellow-500/10">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <span className="text-[11px] font-bold text-zinc-300 tracking-wider uppercase">Kredi Kartı Geçerlidir</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onOpenQR}
            className="p-5 rounded-2xl glass border border-zinc-800 transition-all hover:border-yellow-500/50 active:scale-90 group"
          >
            <svg className="w-8 h-8 text-zinc-500 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.3em] font-bold">Uygulamayı Paylaş</p>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50% { transform: translateX(150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

const RequestForm: React.FC<{ 
  onBack: () => void, 
  location: LocationData 
}> = ({ onBack, location }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    plate: '',
    passengerCount: '1'
  });
  const [shareSecurity, setShareSecurity] = useState(false);

  const sendWhatsApp = () => {
    if (!formData.fullName || !formData.plate) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const message = `🚨 *YENİ ŞOFÖR TALEBİ* 🚨\n\n` +
      `🏢 *Şirket:* ${COMPANY_NAME}\n` +
      `👤 *Müşteri:* ${formData.fullName}\n` +
      `🚗 *Plaka:* ${formData.plate}\n` +
      `👥 *Yolcu Sayısı:* ${formData.passengerCount}\n` +
      `📍 *Adres:* ${location.address}\n` +
      `🗺️ *Harita:* https://www.google.com/maps?q=${location.latitude},${location.longitude}\n` +
      `🛡️ *Güvenlik:* ${shareSecurity ? 'Canlı takip paylaşımı istiyor' : 'Standart'}\n` +
      `💳 *Ödeme:* Kredi Kartı Geçerlidir\n\n` +
      `*Lütfen en kısa sürede dönüş yapınız.*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col px-6 py-8 overflow-y-auto bg-black animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 glass rounded-lg text-zinc-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-xl font-bold uppercase tracking-tight">Talep Formu</h2>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 group-focus-within:text-yellow-500 transition-colors">Müşteri Adı-Soyadı</label>
          <input 
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-xl p-4 text-white focus:border-yellow-500/50 focus:bg-[#111] outline-none transition-all shadow-inner"
            placeholder="Ad Soyad giriniz"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Araç Plakası</label>
          <input 
            type="text"
            value={formData.plate}
            onChange={(e) => setFormData({...formData, plate: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all uppercase tracking-widest"
            placeholder="34 ABC 123"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Yolcu Sayısı</label>
            <select 
              value={formData.passengerCount}
              onChange={(e) => setFormData({...formData, passengerCount: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Yolcu</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Güvenlik Modu</label>
            <button 
              onClick={() => setShareSecurity(!shareSecurity)}
              className={`flex-1 rounded-xl border transition-all flex items-center justify-center gap-2 ${shareSecurity ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-zinc-800 bg-[#0d0d0d] text-zinc-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span className="text-[10px] font-bold uppercase">Koruma</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-[#080808] shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          </div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Mevcut Konum Bilgisi</label>
          <div className="flex items-start gap-3 pr-8">
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              {location.address}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={sendWhatsApp}
          className="w-full py-5 rounded-2xl bg-[#25D366] hover:bg-[#22c35e] text-white font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_15px_40px_rgba(37,211,102,0.25)] uppercase tracking-wider text-sm"
        >
          <WhatsAppIcon />
          WHATSAPP İLE GÖNDER
        </button>
      </div>
    </div>
  );
};

const QRCodeModal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300">
      <button onClick={onBack} className="absolute top-8 right-8 p-3 glass rounded-full text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div className="bg-white p-8 rounded-[2rem] shadow-[0_0_80px_rgba(255,255,255,0.15)] mb-8 border-[12px] border-zinc-100">
        <QRCodeSVG value={APK_URL} size={220} level="H" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black mb-3 tracking-tighter">UYGULAMAYI YÜKLE</h3>
        <p className="text-zinc-500 text-sm max-w-[240px] mx-auto leading-relaxed">
          Kodu okutarak en güncel sürümü cihazınıza hemen indirin.
        </p>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: 'Konum alınıyor...'
  });
  const [locationError, setLocationError] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [watchId, setWatchId] = useState<string | null>(null);

  // Basitleştirilmiş reverse geocoding
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      // Önce hızlı bir API deneyelim
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`,
        { signal: AbortSignal.timeout(3000) } // 3 saniye timeout
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.locality || data.city) {
          return `${data.locality || ''}, ${data.city || data.principalSubdivision || ''}`.trim();
        }
      }
      
      // Fallback: sadece koordinatlar
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  // Konum izinlerini kontrol et ve konum al
  const initializeLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(false);
      
      console.log('Konum izinleri kontrol ediliyor...');
      
      // 1. İzin durumunu kontrol et
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('İzin durumu:', permissionStatus);
      
      // 2. İzin yoksa iste
      if (permissionStatus.location !== 'granted') {
        console.log('İzin isteniyor...');
        const requestStatus = await Geolocation.requestPermissions();
        console.log('İzin isteği sonucu:', requestStatus);
        
        if (requestStatus.location !== 'granted') {
          console.log('İzin verilmedi');
          setLocationError(true);
          setLocationLoading(false);
          return;
        }
      }
      
      console.log('İzin verildi, konum alınıyor...');
      
      // 3. Mevcut konumu al (timeout ile)
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000, // 10 saniye timeout
          maximumAge: 0
        });
        
        console.log('Konum alındı:', position.coords);
        
        if (position?.coords) {
          // Konum başarıyla alındı
          const { latitude, longitude } = position.coords;
          
          setLocation(prev => ({ 
            ...prev, 
            latitude, 
            longitude,
            address: 'Konum işleniyor...'
          }));
          
          // Adres bilgisini al (asenkron)
          reverseGeocode(latitude, longitude)
            .then(address => {
              setLocation(prev => ({ ...prev, address }));
            })
            .catch(() => {
              setLocation(prev => ({ 
                ...prev, 
                address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
              }));
            });
          
          // Sürekli konum takibini başlat
          const id = await Geolocation.watchPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          }, (newPosition) => {
            if (newPosition?.coords) {
              const newLat = newPosition.coords.latitude;
              const newLon = newPosition.coords.longitude;
              
              // Sadece konum değiştiyse güncelle
              if (newLat !== location.latitude || newLon !== location.longitude) {
                setLocation(prev => ({
                  ...prev,
                  latitude: newLat,
                  longitude: newLon
                }));
              }
            }
          });
          
          setWatchId(id);
          setLocationError(false);
        } else {
          setLocationError(true);
        }
        
      } catch (getPositionError: any) {
        console.error('Konum alma hatası:', getPositionError);
        setLocationError(true);
      }
      
      setLocationLoading(false);
      
    } catch (error) {
      console.error('Konum başlatma hatası:', error);
      setLocationError(true);
      setLocationLoading(false);
    }
  };

  // Splash screen bittiğinde konum takibini başlat
  useEffect(() => {
    if (appState === AppState.MAIN) {
      initializeLocation();
    }
  }, [appState]);

  // Component unmount olduğunda watch'ı temizle
  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  const handleRetryLocation = async () => {
    if (watchId) {
      Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
    await initializeLocation();
  };

  return (
    <div className="fixed inset-0 flex flex-col max-w-md mx-auto h-screen bg-black select-none overflow-hidden ring-1 ring-white/5 shadow-2xl">
      {appState === AppState.SPLASH && (
        <SplashScreen onFinish={() => setAppState(AppState.MAIN)} />
      )}
      
      {/* Konum yükleniyor ekranı */}
      {appState === AppState.MAIN && locationLoading && !locationError && (
        <LocationLoadingScreen />
      )}
      
      {/* Konum hatası ekranı */}
      {appState === AppState.MAIN && locationError && (
        <LocationErrorScreen 
          onRetry={handleRetryLocation}
        />
      )}
      
      {/* Ana uygulama ekranı */}
      {appState === AppState.MAIN && !locationLoading && !locationError && (
        <MainMenu 
          onOpenForm={() => setAppState(AppState.FORM)}
          onOpenQR={() => setAppState(AppState.QR)}
          location={location}
        />
      )}

      {appState === AppState.FORM && !locationError && (
        <RequestForm onBack={() => setAppState(AppState.MAIN)} location={location} />
      )}
      
      {appState === AppState.QR && !locationError && (
        <QRCodeModal onBack={() => setAppState(AppState.MAIN)} />
      )}
    </div>
  );
};

const checkForUpdate = async () => {
  try {
    console.log("📱 Guncelleme kontrolu basladi...");
    console.log("📊 Mevcut versiyon:", CURRENT_VERSION);
    
    const versionUrl = "https://mediaconfig55-afk.github.io/ayik-sofor-apk/version.json";
    console.log("🔗 Kontrol edilen URL:", versionUrl);
    
    const res = await fetch(versionUrl, { 
      cache: "no-store"
    });

    const data = await res.json();
    console.log("📦 GitHub'dan gelen versiyon:", data.version);
    
    if (data.version !== CURRENT_VERSION) {
      console.log("🔄 Guncelleme gerekiyor!");
      const confirmUpdate = window.confirm(
        `${data.message}\n\nMevcut sürüm: ${CURRENT_VERSION}\nYeni sürüm: ${data.version}\n\nGüncellemek ister misiniz?`
      );

      if (confirmUpdate) {
        console.log("📥 Guncelleme baslatiliyor:", data.apkUrl);
        window.open(data.apkUrl, "_system");
      }
    } else {
      console.log("✅ Guncelleme gerekmiyor, en guncel versiyon.");
    }
  } catch (err) {
    console.log("❌ Güncelleme kontrolü başarısız:", err);
  }
};

export default App;
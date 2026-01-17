
import React from 'react';

export const COMPANY_NAME = "AYIK ŞOFÖR";
export const PHONE_NUMBER = "905442946570";
export const APK_URL = "https://github.com/mediaconfig55-afk/ayik-sofor/raw/refs/heads/main/ayik-sofor.apk";

export const CarLogo = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stylized Luxury Car Front View */}
    <path d="M15 65C15 65 18 58 25 55C32 52 68 52 75 55C82 58 85 65 85 65L88 78H12L15 65Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M22 55L30 35H70L78 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="35" y="62" width="30" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M38 65H62" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M38 68H62" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    
    {/* Headlights */}
    <path d="M18 60C18 60 22 58 28 60C28 60 26 68 20 68C14 68 18 60 18 60Z" fill="currentColor" className="animate-pulse" />
    <path d="M82 60C82 60 78 58 72 60C72 60 74 68 80 68C86 68 82 60 82 60Z" fill="currentColor" className="animate-pulse" />
    
    {/* Side Mirrors */}
    <path d="M22 45H15V48L20 50" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M78 45H85V48L80 50" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Bottom Chassis */}
    <path d="M10 78H90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.77 0 1.268.412 2.454 1.163 3.407l-.76 2.801 2.857-.75a5.74 5.74 0 002.507.575h.002c3.182 0 5.767-2.586 5.767-5.77 0-3.183-2.585-5.77-5.769-5.77zM15.52 14.52c-.18.51-.885.93-1.22 1-.336.075-.765.135-2.22-.465-1.875-.765-3.075-2.67-3.165-2.79-.09-.12-.735-.975-.735-1.875s.465-1.335.63-1.53c.165-.195.36-.24.48-.24s.24 0 .345.015c.105.015.255-.045.39.285.15.36.495 1.215.54 1.305.045.09.075.195.015.315-.06.12-.09.195-.18.3-.09.105-.195.24-.27.315-.09.09-.18.195-.075.375.105.18.465.765.99 1.23.675.6 1.245.78 1.425.87.18.09.285.075.39-.045.105-.12.45-.525.57-.705.12-.18.24-.15.405-.09s1.05.51 1.23.6c.18.09.3.135.345.21.045.075.045.42-.135.93z" />
  </svg>
);

import React, { useState, useEffect } from 'react';
import { X, Tag } from '@phosphor-icons/react';

interface WelcomePopupProps {
  settings: any;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if active and hasn't been closed in this session
    if (!settings?.isActive) return;
    const hasSeen = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeen) {
      // Delay pop-up by 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors z-10"
        >
          <X size={20} weight="bold" />
        </button>

        {/* Offer Banner Image */}
        <div className="w-full h-40 bg-slate-100 relative">
          <img 
            src="/offer-banner.png" 
            alt="Special Offer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center text-center p-6 -mt-8 relative z-10">
          <div className="h-16 w-16 bg-white shadow-lg text-primary rounded-full flex items-center justify-center mb-4">
            <Tag size={32} weight="fill" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
            {settings.title}
          </h3>
          <p className="text-slate-500 mb-6 font-medium leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
            {settings.description}
          </p>

          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 relative overflow-hidden">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Promo Code</div>
            <div className="text-xl font-black text-primary tracking-wider" style={{ fontFamily: "monospace" }}>
              {settings.promoCode}
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-full mt-6 bg-grad-primary-cta text-foreground font-extrabold text-[15px] py-4 rounded-xl shadow-[0_8px_20px_rgba(255,184,0,0.3)] hover:brightness-105 active:scale-95 transition-all"
          >
            Claim My Discount
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ArrowRight } from '@phosphor-icons/react';

interface MarketingBannerPopupProps {
  settings?: {
    isActive?: boolean;
    title?: string;
    offerText?: string;
    promoCode?: string;
    imageUrl?: string;
    link?: string;
    btnText?: string;
  };
  onNavigate: (path: string) => void;
}

export const MarketingBannerPopup: React.FC<MarketingBannerPopupProps> = ({ settings, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isActive = settings?.isActive !== false;
  const promoCode = settings?.promoCode || 'WB50';
  const imageUrl = settings?.imageUrl || '/marketing-banner.png';
  const link = settings?.link || '/booking';
  const btnText = settings?.btnText || 'Book Now';

  useEffect(() => {
    if (isActive) {
      const hasSeenBanner = sessionStorage.getItem('maidslife_marketing_banner_seen');
      if (!hasSeenBanner) {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isActive]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('maidslife_marketing_banner_seen', 'true');
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (promoCode) {
      navigator.clipboard.writeText(promoCode).catch(() => {});
      sessionStorage.setItem('maidslife_active_promo', promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleAction = () => {
    if (promoCode) {
      sessionStorage.setItem('maidslife_active_promo', promoCode);
    }
    handleClose();
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        onNavigate(link);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_0_30px_rgba(14,165,233,0.25)] overflow-hidden border border-white/50 ring-1 ring-black/10 animate-in zoom-in-95 duration-250 cursor-pointer group"
        onClick={handleAction}
      >
        {/* Sleek Floating Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close promotion"
          className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-white/80 cursor-pointer"
        >
          <X size={15} weight="bold" />
        </button>

        {/* ── BACKGROUND BANNER IMAGE ── */}
        <img
          src={imageUrl}
          alt="Maidslife Exclusive Offer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/marketing-banner.png';
          }}
          className="w-full h-auto block select-none pointer-events-none object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />

        {/* ── CONTENT OVERLAY IN NATURAL WHITE SPACE ── */}
        <div
          className="absolute top-[28%] bottom-[8%] left-[7.5%] w-[42%] flex flex-col justify-center items-start z-20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtitle / Exclusive Offer */}
          <p
            className="text-[#203F61] font-extrabold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] leading-tight select-none"
            style={{ fontFamily: "'Poppins', 'Manrope', sans-serif" }}
          >
            {settings?.title || 'EXCLUSIVE OFFER'}
          </p>

          {/* Heading / 50% OFF */}
          <h2
            className="font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#008AFF] via-[#0070F0] to-[#004BD6] text-[28px] sm:text-[34px] my-0.5 select-none"
            style={{
              fontFamily: "'Poppins', 'Manrope', sans-serif",
              filter: 'drop-shadow(0 2px 4px rgba(0, 112, 240, 0.2))',
            }}
          >
            {settings?.offerText || '50% OFF'}
          </h2>

          {/* Promo Code & Book Now Actions */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
            {/* Promo Code Badge */}
            {promoCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy promo code"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-white/95 hover:bg-white text-slate-800 border-sky-200 hover:border-sky-300'
                }`}
              >
                <span className="text-[9px] font-black text-[#0074F0] uppercase tracking-wider">
                  CODE:
                </span>
                <span className="font-mono font-black text-[10px] text-slate-900 tracking-wider">
                  {promoCode}
                </span>
                {copied ? (
                  <Check size={11} weight="bold" className="text-emerald-600" />
                ) : (
                  <Copy size={11} weight="bold" className="text-slate-400 hover:text-[#0074F0]" />
                )}
              </button>
            )}

            {/* Book Now Button */}
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-grad-primary-cta hover:brightness-105 active:scale-95 text-[#0C3352] font-black text-[10.5px] shadow-[0_3px_12px_rgba(255,184,0,0.4)] hover:shadow-[0_4px_16px_rgba(255,184,0,0.55)] hover:scale-[1.03] transition-all cursor-pointer"
            >
              <span>{btnText}</span>
              <ArrowRight size={11} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

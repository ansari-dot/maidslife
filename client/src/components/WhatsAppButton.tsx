import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

// Official WhatsApp Vector SVG Icon
const OfficialWhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappNumber = '971509876543'; // Dubai WhatsApp number
  const defaultMessage = encodeURIComponent(
    'Hello Maidslife! I would like to inquire about booking a cleaning service.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">

      {/* Floating Tooltip Callout */}
      {showTooltip && (
        <div className="relative flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-slate-200 animate-bounce transition-all">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
          </span>

          <span
            className="text-[#0C3352] text-[11px] font-extrabold whitespace-nowrap"
            style={{ fontFamily: M }}
          >
            Need Help? Chat on WhatsApp!
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-0.5 p-0.5 rounded-full"
            title="Close"
          >
            <X size={10} weight="bold" />
          </button>

          {/* Little arrow down */}
          <div className="absolute -bottom-1 right-6 h-2.5 w-2.5 rotate-45 bg-white border-r border-b border-slate-200" />
        </div>
      )}

      {/* Main Circular Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:bg-[#20BA5A] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
        aria-label="Chat on WhatsApp"
      >
        <OfficialWhatsAppIcon size={30} className="text-white" />
      </a>

    </div>
  );
};

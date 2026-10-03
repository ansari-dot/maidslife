import React, { useState, useEffect } from 'react';
import {
  House,
  Buildings,
  Sparkle,
  Truck,
  HardHat,
  Drop,
  ArrowRight,
  Check,
  CalendarBlank,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';
import { ServiceItem } from '../data/servicesData';

const M = "'Manrope', sans-serif";

const getIconComponent = (iconName?: string): React.ElementType => {
  switch (iconName?.toLowerCase()) {
    case 'buildings':
      return Buildings;
    case 'sparkle':
      return Sparkle;
    case 'truck':
      return Truck;
    case 'hardhat':
      return HardHat;
    case 'drop':
      return Drop;
    default:
      return House;
  }
};

interface ServiceItem {
  id: number;
  icon: React.ElementType;
  titleLine1: string;
  titleLine2: string;
  description: string;
  features: string[];
  image: string;
  linkText: string;
}



// Sparkles Cluster Graphic
const SparklesCluster: React.FC = () => (
  <div className="relative w-7 h-8 pointer-events-none select-none shrink-0">
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute top-0 right-1 w-3.5 h-3.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute top-2.5 left-0 w-4.5 h-4.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute bottom-0 right-2 w-2.5 h-2.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  </div>
);

interface ServicesPageProps {
  onServiceSelect?: (serviceTitle: string) => void;
  onBookClick?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onServiceSelect, onBookClick }) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    clientApi.getServices().then((data) => {
      if (isMounted) {
        setServicesList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full bg-white min-h-screen pt-[130px]">

      {/* ── TOP PAGE HEADER BANNER (NO HERO SECTION) ── */}
      <div className="w-full bg-white pt-10 pb-14 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-[780px]">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase mb-4"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            OUR SERVICES
            <span className="opacity-70">—</span>
          </div>

          <h1
            className="text-[#0C3352]"
            style={{ fontFamily: M, fontWeight: 800, }}
          >
            Professional Cleaning Services<br />
            <span className="text-[#0084FF]">for a Healthier, Happier Space</span>
          </h1>

          <p
            className="mt-4 text-[#5A6E7F]"
            style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
          >
            From homes to offices, we offer a complete range of professional cleaning solutions in Dubai designed to give you a fresh, spotless and comfortable environment.
          </p>
        </div>
      </div>

      {/* ── FULL WIDTH ZIG-ZAG SECTIONS WITH FULL HEIGHT ABSOLUTE IMAGES ── */}
      <div>
        {servicesList.map((service, index) => {
          const Icon = getIconComponent(service.iconName);
          const fullTitle = service.name;
          const isImageLeft = index % 2 === 0;
          const isBgWhite = index % 2 === 0;
          const bgClass = isBgWhite ? 'bg-white' : 'bg-[#F8FAFC]';

          return (
            <section
              key={service.id}
              className={`relative w-full py-16 sm:py-24 border-b border-slate-100 overflow-hidden ${bgClass}`}
            >
              {/* ── FULL HEIGHT ABSOLUTE BACKGROUND IMAGE (SAME AS HOMEPAGE CARD IMAGE) ── */}
              <div
                className={`absolute top-0 bottom-0 w-full lg:w-[55%] overflow-hidden pointer-events-none select-none ${isImageLeft ? 'left-0' : 'right-0'
                  }`}
              >
                <img
                  src={service.image}
                  alt={fullTitle}
                  className="h-full w-full object-cover object-center"
                />
                {/* Smooth Fade Gradient Mask blending image directly into section background */}
                <div
                  className={`absolute inset-0 hidden lg:block ${isImageLeft
                      ? isBgWhite
                        ? 'bg-gradient-to-r from-transparent via-white/80 to-white'
                        : 'bg-gradient-to-r from-transparent via-[#F8FAFC]/80 to-[#F8FAFC]'
                      : isBgWhite
                        ? 'bg-gradient-to-l from-transparent via-white/80 to-white'
                        : 'bg-gradient-to-l from-transparent via-[#F8FAFC]/80 to-[#F8FAFC]'
                    }`}
                />
                {/* Mobile gradient overlay */}
                <div
                  className={`absolute inset-0 lg:hidden ${isBgWhite
                      ? 'bg-gradient-to-b from-transparent via-white/90 to-white'
                      : 'bg-gradient-to-b from-transparent via-[#F8FAFC]/90 to-[#F8FAFC]'
                    }`}
                />
              </div>

              {/* ── CONTENT CONTAINER (MAX-W 1280PX) ── */}
              <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                  {/* CONTENT COLUMN (6 COLS) */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center ${isImageLeft ? 'lg:col-start-7' : 'lg:col-start-1'
                      }`}
                  >
                    {/* Icon Circle & Sparkles */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-b from-[#EBF5FF] to-[#D5E9FF] border border-[#CCE3FF] text-[#0066CC] shadow-xs">
                        <Icon size={26} weight="regular" />
                      </div>
                      <SparklesCluster />
                    </div>

                    {/* Title */}
                    <h2
                      className="mt-5 text-[#0C3352]"
                      style={{ fontFamily: M, fontWeight: 800, }}
                    >
                      {service.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="mt-4 text-[#5A6E7F] max-w-[540px]"
                      style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
                    >
                      {service.description}
                    </p>

                    {/* Feature Checkpoints */}
                    <div className="mt-6 space-y-3">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0084FF] text-white">
                            <Check size={12} weight="bold" />
                          </div>
                          <span style={{ fontFamily: M, fontSize: '14px', fontWeight: 600, color: '#0C3352' }}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => onServiceSelect?.(service.slug || service.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0C3352] text-white hover:bg-[#0084FF] px-7 py-3.5 text-sm font-bold transition-all duration-300 focus:outline-none shadow-md hover:shadow-lg"
                        style={{ fontFamily: M }}
                      >
                        Learn More
                        <ArrowRight size={16} weight="bold" />
                      </button>

                      <button
                        onClick={onBookClick}
                        className="inline-flex items-center gap-2 rounded-full bg-grad-primary-cta px-6 py-3.5 text-foreground font-extrabold text-sm shadow-md hover:brightness-105 transition-all focus:outline-none"
                        style={{ fontFamily: M }}
                      >
                        <CalendarBlank size={16} weight="bold" />
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </section>
          );
        })}
      </div>

    </div>
  );
};

export default ServicesPage;

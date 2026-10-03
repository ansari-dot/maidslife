import React, { useState, useEffect } from 'react';
import {
  House,
  Buildings,
  Sparkle,
  Truck,
  HardHat,
  Drop,
  ArrowRight,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';
import { ServiceItem } from '../data/servicesData';

const M = "'Manrope', sans-serif";

interface ServiceCard {
  id: number;
  icon: React.ElementType;
  titleLine1: string;
  titleLine2: string;
  description: string;
  image: string;
  linkText: string;
}

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

// Sparkles Cluster (3 blue 4-point stars: top medium, left large, bottom small)
const SparklesCluster: React.FC = () => (
  <div className="relative w-7 h-8 pointer-events-none select-none">
    {/* Top medium star */}
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute top-0 right-1 w-3.5 h-3.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
    {/* Left large star */}
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute top-2.5 left-0 w-4.5 h-4.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
    {/* Bottom small star */}
    <svg viewBox="0 0 24 24" fill="#0084FF" className="absolute bottom-0 right-2 w-2.5 h-2.5">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  </div>
);

interface OurServicesSectionProps {
  onServiceClick?: (title: string) => void;
  onViewAllClick?: () => void;
}

export const OurServicesSection: React.FC<OurServicesSectionProps> = ({ onServiceClick, onViewAllClick }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    clientApi.getServices().then((data) => {
      if (isMounted) {
        setServices(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredServices = services.slice(0, 3);

  return (
    <section className="w-full bg-[#F8FAFC] py-20 px-4 sm:px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            OUR SERVICES
            <span className="opacity-70">—</span>
          </div>
        </div>

        {/* ── MAIN HEADING ── */}
        <h2
          className="mt-4 text-center text-[#0C3352]"
          style={{ fontFamily: M, fontWeight: 800, }}
        >
          Professional Cleaning Services<br />
          for a Healthier, Happier Space.
        </h2>

        {/* ── SUBTITLE ── */}
        <p
          className="mt-4 text-center text-[#5A6E7F] mx-auto max-w-[620px]"
          style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
        >
          From homes to businesses, we offer a complete range of cleaning solutions
          designed to give you a fresh, clean and comfortable environment.
        </p>

        {/* ── FEATURED CARDS GRID (Desktop) / SLIDER (Mobile) ── */}
        <div 
          className="mt-12 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 sm:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={(e) => {
            const el = e.currentTarget;
            const scrollLeft = el.scrollLeft;
            const clientWidth = el.clientWidth;
            setActiveIndex(Math.round(scrollLeft / clientWidth));
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}} />
          
          {featuredServices.map((card) => {
            const Icon = getIconComponent(card.iconName);
            const fullTitle = card.name;
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#DCEBF8] bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,132,255,0.08)] hover:border-[#B5D8F8] transition-all duration-300 w-[calc(100vw-32px)] sm:w-auto snap-start shrink-0 min-h-[260px] sm:min-h-[230px]"
              >
                {/* ── RIGHT BACKGROUND IMAGE WITH GRADIENT BLEND ── */}
                <div className="absolute top-0 right-0 bottom-0 w-[55%] overflow-hidden pointer-events-none select-none">
                  <img
                    src={card.image}
                    alt={fullTitle}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Smooth White Linear Gradient Mask */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" style={{ width: '60%' }} />
                </div>

                {/* ── SPARKLES CLUSTER ── */}
                <div className="absolute top-1/2 -translate-y-1/2 left-[48%] z-10 hidden sm:block">
                  <SparklesCluster />
                </div>

                {/* ── LEFT CONTENT AREA ── */}
                <div className="relative z-10 flex flex-col justify-between h-full max-w-[70%] sm:max-w-[52%] pr-4 sm:pr-0">
                  <div>
                    {/* Circle Icon Badge */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#EBF5FF] to-[#D5E9FF] border border-[#CCE3FF] text-[#0066CC]">
                      <Icon size={24} weight="regular" />
                    </div>

                    {/* Card Title */}
                    <h3
                      className="mt-4 text-[#0C3352]"
                      style={{ fontFamily: M, fontWeight: 800, }}
                    >
                      {card.name}
                    </h3>

                    {/* Card Description */}
                    <p
                      className="mt-2 text-[#5C7285] line-clamp-4 sm:line-clamp-3 text-ellipsis break-words"
                      style={{ fontFamily: M, fontSize: '12px', fontWeight: 400, lineHeight: '18px' }}
                    >
                      {card.tagline || card.description}
                    </p>
                  </div>

                  {/* Learn More Link */}
                  <button
                    onClick={() => onServiceClick?.(card.slug || card.name)}
                    className="mt-5 inline-flex items-center gap-1.5 text-[#0C3352] hover:text-[#0084FF] font-bold transition-colors focus:outline-none cursor-pointer w-fit"
                    style={{ fontFamily: M, fontSize: '14px', fontWeight: 700, lineHeight: '20px' }}
                  >
                    Learn More
                    <ArrowRight size={15} weight="bold" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── MOBILE PAGINATION DOTS ── */}
        <div className="flex sm:hidden justify-center items-center gap-2 mt-2">
          {featuredServices.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-[#0084FF]' : 'w-2 bg-[#DCEBF8]'
              }`}
            />
          ))}
        </div>

        {/* ── SEE ALL SERVICES BUTTON ── */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#0C3352] text-white hover:bg-[#0084FF] px-8 py-4 text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none cursor-pointer"
            style={{ fontFamily: M }}
          >
            See All Services
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import {
  House,
  CalendarBlank,
  Play,
  Leaf,
  ShieldCheck,
  Clock,
  Heart,
} from '@phosphor-icons/react';
import { BookingCard } from './BookingCard';

const M = "'Manrope', sans-serif";

interface HeroSectionProps {
  onBookClick?: () => void;
  onExploreClick?: () => void;
  navbarHeight?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookClick,
  onExploreClick,
  navbarHeight = 88,
}) => {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#E8F3FF' }}>

      {/* hero.png — object-cover on mobile, anchored top-right */}
      <img
        src="https://res.cloudinary.com/jbgpjagy/image/upload/f_auto,q_auto/v1791042320/hero.png"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="pointer-events-none absolute left-0 top-0 w-full h-full object-cover object-[70%_top] lg:object-[right_top] select-none opacity-30 lg:opacity-100"
        draggable={false}
      />

      <div
        className="relative z-10 flex lg:min-h-screen flex-col"
        style={{ paddingTop: navbarHeight }}
      >
        <div className="mx-auto w-full max-w-[1280px] flex-1 pl-6 sm:pl-20 pr-4 sm:pr-8 pt-8 sm:pt-16 pb-8 sm:pb-20">
          <div className="max-w-[500px]">

            {/* BADGE — Manrope 14px / 700 / 20px */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-[6px] text-primary uppercase tracking-widest backdrop-blur-sm"
              style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '20px' }}
            >
              <House size={14} weight="fill" />
              DUBAI HOME SERVICES
            </div>

            {/* HERO HEADING */}
            <h1
              className="mt-5 tracking-tight text-foreground"
              style={{ fontFamily: M }}
            >
              A cleaner home.<br />
              <span className="text-primary">A calmer life.</span>
            </h1>

            {/* DESCRIPTION */}
            <p
              className="mt-4 max-w-[420px] text-foreground/70"
              style={{ fontFamily: M }}
            >
              Professional home cleaning services in Dubai, designed
              to give you more time for what truly matters.
            </p>

            {/* CTA BUTTONS — Manrope 16px / 700 / 24px */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">

              {/* Primary */}
              <button
                onClick={onBookClick}
                className="flex items-center gap-2.5 rounded-full bg-grad-primary-cta px-7 py-3.5 text-foreground shadow-[0_7px_20px_rgba(255,184,0,0.32)] hover:brightness-105 active:scale-[0.97] transition-all btn"
                style={{ fontFamily: M }}
              >
                <CalendarBlank size={18} weight="bold" />
                Book a Cleaning →
              </button>

              {/* Secondary */}
              <button
                onClick={onExploreClick}
                className="hidden sm:flex items-center gap-3 rounded-full border border-foreground/20 bg-white/80 px-6 py-3.5 text-foreground backdrop-blur-sm hover:bg-white transition-colors"
                style={{ fontFamily: M, fontSize: '16px', fontWeight: 700, lineHeight: '24px' }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                  <Play size={12} weight="fill" className="text-white translate-x-[1px]" />
                </span>
                Explore Services
              </button>
            </div>

            <div className="mt-10 hidden sm:flex sm:flex-nowrap sm:items-start sm:gap-0">

              <div className="sm:pr-5">
                <Leaf size={20} className="text-primary" />
                <p
                  className="mt-1.5 text-foreground"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                >
                  Eco-Friendly<br />Products
                </p>
              </div>

              <div className="sm:border-l sm:border-primary/35 sm:px-5">
                <ShieldCheck size={20} className="text-primary" />
                <p
                  className="mt-1.5 text-foreground"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                >
                  Trained &amp;<br />Trusted Cleaners
                </p>
              </div>

              <div className="sm:border-l sm:border-primary/35 sm:px-5">
                <Clock size={20} className="text-primary" />
                <p
                  className="mt-1.5 text-foreground"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                >
                  Flexible<br />Time Slots
                </p>
              </div>

              <div className="sm:border-l sm:border-primary/35 sm:pl-5">
                <Heart size={20} className="text-primary" />
                <p
                  className="mt-1.5 text-foreground"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                >
                  100% Satisfaction<br />Guarantee
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Booking card */}
        <div className="hidden sm:block relative z-20 mt-4 sm:mt-8 w-full px-4 sm:px-0 lg:absolute lg:bottom-10 lg:right-[5.2%] lg:mt-0 lg:w-auto pb-8 sm:pb-10 lg:pb-0">
          <BookingCard onBookNow={onBookClick} />
        </div>
      </div>

    </section>
  );
};

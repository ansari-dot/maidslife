import React, { useState } from 'react';
import {
  ShieldCheck,
  Leaf,
  Medal,
  CheckCircle,
  Clock,
  Heart,
  Headset,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

const boxes = [
  {
    id: 1,
    tag: 'TRUST & SAFETY',
    icon: ShieldCheck,
    title: '100% Vetted & Certified Cleaners',
    description:
      'Every professional on our team is strictly background-checked, insured, and thoroughly trained to treat your space with utmost respect and care.',
    points: [
      'Comprehensive background checks',
      'Rigorous in-house training program',
      'Fully insured for complete peace of mind',
    ],
  },
  {
    id: 2,
    tag: 'HEALTH & HYGIENE',
    icon: Leaf,
    title: 'Eco-Friendly & Non-Toxic Care',
    description:
      'We protect your family and pets by using safe, eco-friendly, non-toxic products that deliver a deep, spotless shine without harsh chemical odors.',
    points: [
      'Child & pet safe green solutions',
      'Hospital-grade sanitization',
      'Eco-conscious equipment & microfiber',
    ],
  },
  {
    id: 3,
    tag: 'GUARANTEE & FLEXIBILITY',
    icon: Medal,
    title: 'Flexible Times & Re-Clean Promise',
    description:
      'Schedule effortlessly around your routine. If you are not 100% satisfied with any area, our team will re-clean it within 24 hours — free of charge.',
    points: [
      'Instant online scheduling & instant quotes',
      '24/7 dedicated customer support team',
      'Free 24-hour re-clean satisfaction guarantee',
    ],
  },
];

const stats = [
  { id: 1, value: '10,000+', label: 'Homes Cleaned in Dubai' },
  { id: 2, value: '4.9 ★', label: 'Average Client Rating' },
  { id: 3, value: '100%', label: 'Satisfaction Guaranteed' },
  { id: 4, value: '24/7', label: 'Customer Assistance' },
];

export const WhySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px]">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2.5 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            WHY CHOOSE MAIDSLIFE
            <span className="opacity-70">—</span>
          </div>
        </div>

        {/* ── HEADING ── */}
        <h2
          className="mt-4 text-center text-[#0C3352]"
          style={{ fontFamily: M, fontWeight: 800, }}
        >
          Why Thousands of Clients Trust Us
        </h2>

        {/* ── SUBTITLE ── */}
        <p
          className="mt-3 text-center text-[#5A6E7F] mx-auto max-w-[580px]"
          style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
        >
          We go beyond routine cleaning — delivering unmatched quality, complete reliability,
          and genuine peace of mind for your home and office.
        </p>

        {/* ── 3 AESTHETIC CARDS / BOXES GRID (Desktop) / SLIDER (Mobile) ── */}
        <div 
          className="mt-14 flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 sm:pb-0"
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
          
          {boxes.map((box) => {
            const Icon = box.icon;
            return (
              <div
                key={box.id}
                className="group relative flex flex-col justify-between rounded-[24px] border border-[#E2EEF8] bg-[#FAFCFF] p-8 shadow-sm hover:shadow-xl hover:border-[#B5D8F8] hover:-translate-y-1 transition-all duration-300 w-[calc(100vw-32px)] sm:w-auto snap-start shrink-0"
              >
                {/* Accent Top Bar Glow */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r from-transparent via-[#0084FF]/40 to-transparent group-hover:via-[#0084FF] transition-all duration-300" />

                <div>
                  {/* Category Tag & Icon Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[#0C3352] uppercase tracking-wider font-bold"
                      style={{ fontFamily: M, fontSize: '10px', lineHeight: '14px' }}
                    >
                      {box.tag}
                    </span>

                    {/* Icon Circle */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#D0E4F7] text-[#0084FF] shadow-sm group-hover:bg-[#0084FF] group-hover:text-white transition-colors duration-300">
                      <Icon size={24} weight="regular" />
                    </div>
                  </div>

                  {/* Box Title */}
                  <h3
                    className="mt-6 text-[#0C3352]"
                    style={{ fontFamily: M, fontWeight: 800, }}
                  >
                    {box.title}
                  </h3>

                  {/* Box Description */}
                  <p
                    className="mt-3 text-[#5A6E7F]"
                    style={{ fontFamily: M, fontSize: '13px', fontWeight: 400, lineHeight: '20px' }}
                  >
                    {box.description}
                  </p>

                  {/* Blue Divider Line */}
                  <div className="my-6 h-[1.5px] w-full bg-[#E8F1F9]" />

                  {/* Bullet Points Checklist */}
                  <ul className="space-y-3">
                    {box.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle size={18} className="text-[#0084FF] shrink-0 mt-0.5" weight="fill" />
                        <span
                          className="text-[#0C3352]"
                          style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                        >
                          {pt}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── MOBILE PAGINATION DOTS ── */}
        <div className="flex sm:hidden justify-center items-center gap-2 mt-2">
          {boxes.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-[#0084FF]' : 'w-2 bg-[#DCEBF8]'
              }`}
            />
          ))}
        </div>

        {/* ── BOTTOM STATS RIBBON (No Images, Pure Aesthetic Counters) ── */}
        <div className="mt-16 rounded-[20px] bg-[#F4F9FF] border border-[#E0EEFA] p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={st.id} className="flex flex-col items-center">
                <span
                  className="text-[#0C3352]"
                  style={{ fontFamily: M, fontSize: '28px', fontWeight: 800, lineHeight: '34px' }}
                >
                  {st.value}
                </span>
                <span
                  className="mt-1 text-[#5A6E7F]"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 600, lineHeight: '18px' }}
                >
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import {
  House,
  Leaf,
  Sparkle,
  ShieldCheck,
  Buildings,
  Users,
  Star,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

const features = [
  {
    id: 1,
    icon: House,
    title: 'Trained In-House Cleaners',
    description: 'Continuous training in surface care, fabric safety, and hygiene.',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Kid & Pet Friendly Products',
    description: 'Eco-friendly solutions that leave zero toxic residue or harsh fumes.',
  },
  {
    id: 3,
    icon: Sparkle,
    title: 'Same Specialist Every Time',
    description: 'Request your preferred cleaner for maximum comfort and consistency.',
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: '24h Re-Clean Guarantee',
    description: "If anything isn't perfect, we return to re-clean for free.",
  },
];

const stats = [
  {
    id: 1,
    icon: Buildings,
    value: '2019',
    label: 'Founded in Dubai',
  },
  {
    id: 2,
    icon: Users,
    value: '100%',
    label: 'In-House Employed Staff',
  },
  {
    id: 3,
    icon: House,
    value: '10,000+',
    label: 'Dubai Homes Served',
  },
  {
    id: 4,
    icon: Star,
    value: '4.9 ★',
    label: 'Customer Happiness Score',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* ── MAIN 2-COLUMN SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: IMAGE CONTAINER WITH BLUE DECORATIVE ARC & FLOATING BADGE (5 COLS) ── */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">

            {/* Top-Left Decorative Blue Arc */}
            <div className="absolute -top-5 -left-5 w-36 h-36 border-t-[14px] border-l-[14px] border-[#CDE5FF] rounded-tl-[100px] pointer-events-none z-0" />

            {/* Photo Container with Custom Curved Arch Top Left */}
            <div
              className="relative z-10 overflow-hidden w-full max-w-[440px] aspect-[4/5] bg-slate-100 shadow-lg border border-slate-100"
              style={{
                borderRadius: '120px 24px 24px 24px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                alt="Maidslife professional window cleaning specialist"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Floating Badge (Bottom Right of Photo) */}
            <div className="absolute -bottom-4 right-2 sm:right-4 z-20 flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100/80 max-w-[280px]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0084FF] text-white">
                <ShieldCheck size={22} weight="fill" />
              </div>
              <div>
                <p style={{ fontFamily: M, fontSize: '13px', fontWeight: 800, color: '#0C3352', lineHeight: '18px' }}>
                  100% In-House Team
                </p>
                <p style={{ fontFamily: M, fontSize: '11px', fontWeight: 400, color: '#7890A4', lineHeight: '15px' }}>
                  Never outsourced or freelance
                </p>
              </div>
            </div>

          </div>

          {/* ── RIGHT: CONTENT & FEATURES LIST (7 COLS) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Top Badge */}
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#0084FF]" />
              <span
                className="text-[#0084FF] tracking-wider uppercase font-bold"
                style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
              >
                OUR STORY & MISSION
              </span>
            </div>

            {/* Main Heading */}
            <h2
              className="mt-3 text-[#0C3352]"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              Built in Dubai to Give Families<br />
              <span className="text-[#0084FF]">Their Time Back</span>
            </h2>

            {/* Subtitle Paragraph */}
            <p
              className="mt-4 text-[#5A6E7F] max-w-[620px]"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 400, lineHeight: '23px' }}
            >
              At Maidslife, we treat your home with the same care and dignity we treat our own. Every member of our cleaning staff is employed directly by us, fully background-checked, and trained in modern hygiene protocols.
            </p>

            {/* 4 Feature Items */}
            <div className="mt-8 flex flex-col gap-6">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-4">
                    {/* Circle Icon Badge */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] mt-0.5">
                      <Icon size={22} weight="regular" />
                    </div>

                    {/* Title & Subtext */}
                    <div>
                      <h3
                        className="text-[#0C3352]"
                        style={{ fontFamily: M, fontWeight: 700, }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mt-1 text-[#6B7280]"
                        style={{ fontFamily: M, fontSize: '12px', fontWeight: 400, lineHeight: '18px' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* ── BOTTOM STATS RIBBON WITH VERTICAL DIVIDERS ── */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {stats.map((st, index) => {
              const Icon = st.icon;
              return (
                <React.Fragment key={st.id}>
                  <div className="flex items-center justify-center gap-4 text-left px-2 relative">
                    
                    {/* Icon Circle */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF]">
                      <Icon size={24} weight="regular" />
                    </div>

                    {/* Value & Label */}
                    <div>
                      <p
                        className="text-[#0C3352]"
                        style={{ fontFamily: M, fontSize: '26px', fontWeight: 800, lineHeight: '32px' }}
                      >
                        {st.value}
                      </p>
                      <p
                        className="mt-0.5 text-[#6B7280]"
                        style={{ fontFamily: M, fontSize: '11px', fontWeight: 500, lineHeight: '16px' }}
                      >
                        {st.label}
                      </p>
                    </div>

                    {/* Vertical Divider Line (hidden on last item and on small screens) */}
                    {index < stats.length - 1 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-slate-200" />
                    )}

                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import {
  House,
  Leaf,
  Sparkle,
  ShieldCheck,
  Buildings,
  Users,
  Star,
  Clock,
  Heart,
  CalendarBlank,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

const features = [
  {
    id: 1,
    icon: House,
    title: 'Trained In-House Cleaners',
    description: 'Continuous rigorous training in surface care, fabric safety, and modern hygiene.',
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
    description: "If anything isn't 100% perfect, we return to re-clean for free.",
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

const coreValues = [
  {
    icon: ShieldCheck,
    title: 'Trust & Integrity',
    desc: 'Fully vetted, background checked & insured professional cleaners.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Care',
    desc: 'Non-toxic, safe cleaning solutions for your family and pets.',
  },
  {
    icon: Sparkle,
    title: 'Spotless Quality',
    desc: 'Meticulous attention to detail in every corner of your home.',
  },
  {
    icon: Clock,
    title: 'Reliable & Timely',
    desc: 'Punctual service scheduled at your exact convenience.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    desc: 'Your happiness is our priority with 24h re-clean guarantee.',
  },
];

interface AboutPageProps {
  onBookClick?: () => void;
  onExploreServices?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBookClick, onExploreServices }) => {
  return (
    <div className="w-full bg-white min-h-screen pt-[130px]">

      {/* ── 1. TOP HEADER BANNER (NO HERO SECTION) ── */}
      <div className="w-full bg-white pt-10 pb-14 px-6 sm:px-12 text-center border-b border-slate-100">
        <div className="mx-auto max-w-[800px]">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase mb-4"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            ABOUT MAIDSLIFE
            <span className="opacity-70">—</span>
          </div>

          <h1
            className="text-[#0C3352]"
            style={{ fontFamily: M, fontWeight: 800, }}
          >
            Your Trusted Partner for Premier<br />
            <span className="text-[#0084FF]">Cleaning Services in Dubai</span>
          </h1>

          <p
            className="mt-4 text-[#5A6E7F]"
            style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
          >
            We are on a mission to bring comfort, health, and peace of mind to homes and workspaces across Dubai with trained, 100% in-house cleaning professionals.
          </p>
        </div>
      </div>

      {/* ── 2. OUR STORY & MISSION SECTION ── */}
      <section className="w-full bg-white py-20 px-6 sm:px-12">
        <div className="mx-auto max-w-[1280px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT: ARCH PHOTO & FLOATING TRUST BADGE (5 COLS) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-start">

              {/* Decorative Blue Arc */}
              <div className="absolute -top-5 -left-5 w-36 h-36 border-t-[14px] border-l-[14px] border-[#CDE5FF] rounded-tl-[100px] pointer-events-none z-0" />

              {/* Photo Container with Curved Arch */}
              <div
                className="relative z-10 overflow-hidden w-full max-w-[440px] aspect-[4/5] bg-slate-100 shadow-lg border border-slate-100"
                style={{
                  borderRadius: '120px 24px 24px 24px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                  alt="Maidslife professional cleaning specialist"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Floating Badge */}
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

            {/* RIGHT: STORY & FEATURES (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col justify-center">

              <div className="flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#0084FF]" />
                <span
                  className="text-[#0084FF] tracking-wider uppercase font-bold"
                  style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
                >
                  OUR STORY &amp; MISSION
                </span>
              </div>

              <h2
                className="mt-3 text-[#0C3352]"
                style={{ fontFamily: M, fontWeight: 800, }}
              >
                Built in Dubai to Give Families<br />
                <span className="text-[#0084FF]">Their Time Back</span>
              </h2>

              <p
                className="mt-4 text-[#5A6E7F] max-w-[620px]"
                style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
              >
                At Maidslife, we treat your home with the same care and dignity we treat our own. Every member of our cleaning staff is employed directly by us, fully background-checked, and trained in modern hygiene protocols.
              </p>

              {/* 4 Feature Cards */}
              <div className="mt-8 flex flex-col gap-5">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] mt-0.5">
                        <Icon size={22} weight="regular" />
                      </div>

                      <div>
                        <h3
                          className="text-[#0C3352]"
                          style={{ fontFamily: M, fontWeight: 700, }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="mt-1 text-[#6B7280]"
                          style={{ fontFamily: M, fontSize: '13px', fontWeight: 400, lineHeight: '19px' }}
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

          {/* ── STATS RIBBON ── */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.id} className="flex items-center justify-center gap-4 text-left px-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF]">
                      <Icon size={24} weight="regular" />
                    </div>

                    <div>
                      <p
                        className="text-[#0C3352]"
                        style={{ fontFamily: M, fontSize: '26px', fontWeight: 800, lineHeight: '32px' }}
                      >
                        {st.value}
                      </p>
                      <p
                        className="text-[#64748B]"
                        style={{ fontFamily: M, fontSize: '11px', fontWeight: 500, lineHeight: '15px' }}
                      >
                        {st.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. OUR CORE VALUES ── */}
      <section className="w-full bg-[#F8FAFC] py-20 px-6 sm:px-12 border-t border-b border-slate-100">
        <div className="mx-auto max-w-[1280px]">

          <div className="text-center max-w-[640px] mx-auto">
            <span
              className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
              style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
            >
              OUR CORE VALUES
            </span>
            <h2
              className="mt-3 text-[#0C3352]"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              The Principles That Drive Everything We Do
            </h2>
          </div>

          {/* 5 Column Value Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-6">
            {coreValues.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF]">
                    <Icon size={26} weight="regular" />
                  </div>
                  <h4
                    className="mt-4 text-[#0C3352]"
                    style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, lineHeight: '18px' }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="mt-1.5 text-[#64748B]"
                    style={{ fontFamily: M, fontSize: '12px', fontWeight: 400, lineHeight: '17px' }}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. DARK CTA BANNER ── */}
      <section className="w-full bg-white py-16 px-6 sm:px-12">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0C3352] via-[#0A2E4B] to-[#1A6FA8] p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left text-white max-w-[600px]">
            <span
              className="text-[#92C7ED] uppercase tracking-wider font-extrabold"
              style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
            >
              READY TO EXPERIENCE THE MAIDSLIFE DIFFERENCE?
            </span>
            <h3
              className="mt-2 text-white"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              Book Your Cleaning Service Today
            </h3>
            <p
              className="mt-1 text-[#CBD5E1]"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 400 }}
            >
              Enjoy a spotless, fresh home handled by trusted professionals in Dubai.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 rounded-full bg-grad-primary-cta px-7 py-3.5 text-foreground font-extrabold text-sm shadow-md hover:brightness-105 transition-all focus:outline-none"
              style={{ fontFamily: M }}
            >
              <CalendarBlank size={18} weight="bold" />
              Book Now →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

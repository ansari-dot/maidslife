import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Leaf,
  Star,
  CalendarBlank,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  Heart,
  User,
  Sparkle,
  Smiley,
  Check,
  House,
  Tag,
  Clock,
  Package,
  ArrowsLeftRight,
} from '@phosphor-icons/react';
import { ServiceItem, ServiceCategory } from '../data/servicesData';
import { clientApi } from '../services/api';

const M = "'Manrope', sans-serif";

interface ServiceDetailPageProps {
  serviceId?: string;
  serviceName?: string;
  onBackToHome?: () => void;
  onBookClick?: (serviceId?: string, variantId?: string, addonIds?: string[]) => void;
}

// BEFORE & AFTER GALLERY SCENES
interface GalleryScene {
  id: number;
  label: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
}

const GALLERY_SCENES: GalleryScene[] = [
  {
    id: 1,
    label: 'Kitchen',
    title: 'Kitchen Stove & Marble Countertops',
    description: 'Grease stains and stovetop residue completely eliminated.',
    beforeImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    label: 'Sofa & Upholstery',
    title: 'Fabric Sofa & Upholstery Steam Wash',
    description: 'Deep dust and stain extraction leaving a fresh, vibrant fabric.',
    beforeImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    label: 'Bathroom',
    title: 'Luxury Bathroom Glass & Tiles',
    description: 'Limescale removed and glass shower enclosures polished.',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    label: 'Marble Floors',
    title: 'Living Room & Marble Floor Polish',
    description: 'Scuff marks buffed out with a high-shine mirror finish.',
    beforeImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
];

// ELEGANT 50/50 BEFORE & AFTER DRAG SLIDER
const ElegantBeforeAfterSlider: React.FC<{
  beforeImg: string;
  afterImg: string;
  title: string;
}> = ({ beforeImg, afterImg, title }) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-lg border border-slate-200 select-none group bg-slate-900">
      
      {/* AFTER IMAGE */}
      <img
        src={afterImg}
        alt={`${title} - After`}
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />
      <div className="absolute top-4 right-4 bg-slate-900/80 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wider z-10 border border-white/20">
        AFTER
      </div>

      {/* BEFORE IMAGE */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImg}
          alt={`${title} - Before`}
          className="h-full w-full object-cover object-center max-w-none brightness-75 contrast-125 sepia-[0.3]"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute top-4 left-4 bg-slate-900/80 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wider z-10 border border-white/20">
          BEFORE
        </div>
      </div>

      {/* DIVIDER LINE & HANDLE */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-md z-20 pointer-events-none"
        style={{ left: `calc(${sliderPos}% - 1px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0C3352] shadow-md border border-slate-200 group-hover:scale-105 transition-transform">
          <ArrowsLeftRight size={18} weight="bold" />
        </div>
      </div>

      {/* SLIDER INPUT OVERLAY */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  );
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId = 'home-cleaning',
  serviceName,
  onBackToHome,
  onBookClick,
}) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const targetId = serviceId || serviceName || 'home-cleaning';

    Promise.all([
      clientApi.getServiceById(targetId),
      clientApi.getCategories()
    ]).then(([data, cats]) => {
      if (isMounted) {
        if (data) {
          setService(data);
          
        }
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
        setIsLoading(false);
      }
    }).catch(err => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [serviceId, serviceName]);

  const category = categories.find((c) => c.id === service?.categoryId);
  const activeScene = GALLERY_SCENES[activeSceneIdx];



  const handleMainBookNow = () => {
    if (service) onBookClick?.(service.slug || service.id.toString(), undefined, []);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084FF]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-[#0C3352]">Service Not Found</h2>
        <p className="text-slate-500 mt-2">The requested service could not be found.</p>
        <button onClick={onBackToHome} className="mt-6 px-6 py-2 bg-[#0084FF] text-white rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">

      {/* ── 1. HERO BANNER SECTION ── */}
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#E8F3FF' }}>

        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[54%] select-none pointer-events-none overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#E8F3FF] via-[#E8F3FF]/90 via-40% to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] pt-[150px] pb-20 px-6 sm:px-12">

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0C3352] font-extrabold text-xs mb-6 transition-colors cursor-pointer"
            style={{ fontFamily: M }}
          >
            <ArrowLeft size={16} weight="bold" />
            Back to All Services
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 flex flex-col justify-center">

              <div
                className="inline-flex items-center gap-2 rounded-full border border-[#0084FF]/30 bg-white/90 px-4 py-1.5 text-[#0066CC] uppercase tracking-wider backdrop-blur-sm w-fit"
                style={{ fontFamily: M, fontSize: '11px', fontWeight: 700 }}
              >
                <Tag size={14} weight="fill" />
                {category?.name || 'PROFESSIONAL CLEANING'}
              </div>

              <h1
                className="mt-4 tracking-tight text-[#0C3352]"
                style={{ fontFamily: M, fontWeight: 800, }}
              >
                {service.name}
              </h1>

              <p
                className="mt-4 max-w-[580px] text-[#5A6E7F]"
                style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
              >
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/80 shadow-xs">
                  <ShieldCheck size={20} className="text-[#0084FF] shrink-0" />
                  <span className="text-[#0C3352] font-semibold" style={{ fontFamily: M, fontSize: '12px', lineHeight: '18px' }}>
                    Vetted &amp; Background Checked<br />
                    <span className="font-normal text-[#5A6E7F]">Certified Staff</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/80 shadow-xs">
                  <Leaf size={20} className="text-[#0084FF] shrink-0" />
                  <span className="text-[#0C3352] font-semibold" style={{ fontFamily: M, fontSize: '12px', lineHeight: '18px' }}>
                    Eco-Friendly &amp; Non-Toxic<br />
                    <span className="font-normal text-[#5A6E7F]">Cleaning Supplies</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/80 shadow-xs">
                  <Star size={20} className="text-[#0084FF] shrink-0" />
                  <span className="text-[#0C3352] font-semibold" style={{ fontFamily: M, fontSize: '12px', lineHeight: '18px' }}>
                    100% Satisfaction<br />
                    <span className="font-normal text-[#5A6E7F]">Money Back Guarantee</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleMainBookNow}
                  className="inline-flex items-center gap-2.5 rounded-full bg-grad-primary-cta px-7 py-3.5 text-[#0C3352] font-extrabold text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                  style={{ fontFamily: M }}
                >
                  <CalendarBlank size={18} weight="bold" />
                  Book This Service Now →
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>





      {/* ── 3. WHAT IS INCLUDED & FEATURES ── */}
      <section className="w-full bg-white py-20 px-6 sm:px-12 border-t border-slate-100">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6">
            <span
              className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
              style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
            >
              SERVICE SPECIFICATIONS
            </span>

            <h2
              className="mt-3 text-[#0C3352]"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              What is included in {service.name}?
            </h2>

            <p
              className="mt-4 text-[#5A6E7F]"
              style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
            >
              Our cleaning specialists follow a rigorous quality checklist to guarantee exceptional cleanliness every single visit.
            </p>

            <div className="mt-6 space-y-3.5">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0084FF] text-white">
                    <Check size={12} weight="bold" />
                  </div>
                  <span style={{ fontFamily: M, fontSize: '14px', fontWeight: 600, color: '#0C3352' }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-md">
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>


      {/* ── 4. WHY CHOOSE US SECTION ── */}
      <section className="w-full bg-[#F4F8FC] py-20 px-6 sm:px-12 border-t border-slate-100">
        <div className="mx-auto max-w-[1280px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <span
                className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
                style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
              >
                WHY CHOOSE US
              </span>
              <h2
                className="mt-3 text-[#0C3352]"
                style={{ fontFamily: M, fontWeight: 800, }}
              >
                Why Choose Our<br />
                {service.name}?
              </h2>
              <p
                className="mt-3 text-[#5A6E7F] max-w-[340px]"
                style={{ fontFamily: M, fontSize: '14px', fontWeight: 400, lineHeight: '22px' }}
              >
                We go beyond cleaning — we create healthier, fresher and more comfortable spaces for you and your family.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-6">
              {[
                { icon: Users, title: 'Experienced Team', desc: 'Skilled and background checked professionals.' },
                { icon: Leaf, title: 'Eco-Friendly Products', desc: 'Safe for your family, pets and the environment.' },
                { icon: CalendarBlank, title: 'Flexible Scheduling', desc: 'Book at your convenience, anytime.' },
                { icon: Star, title: 'Affordable Pricing', desc: 'Quality service at the best rates.' },
                { icon: Heart, title: 'Customer Satisfaction', desc: 'Your happiness is our priority.' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF]">
                      <Icon size={26} weight="regular" />
                    </div>
                    <h4
                      className="mt-4 text-[#0C3352]"
                      style={{ fontFamily: M, fontSize: '13px', fontWeight: 800, lineHeight: '18px' }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="mt-1.5 text-[#64748B]"
                      style={{ fontFamily: M, fontSize: '11px', fontWeight: 400, lineHeight: '16px' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* ── 5. HOW IT WORKS (OUR PROCESS 4-STEP) SECTION ── */}
      <section className="w-full bg-white py-20 px-4 sm:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-[1280px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <span
                className="text-[#0084FF] uppercase tracking-wider font-extrabold"
                style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
              >
                OUR PROCESS
              </span>
              <h2
                className="mt-3 text-[#0C3352]"
                style={{ fontFamily: M, fontWeight: 800, }}
              >
                How It Works
              </h2>
              <p
                className="mt-3 text-[#5A6E7F]"
                style={{ fontFamily: M, fontSize: '14px', fontWeight: 400, lineHeight: '22px' }}
              >
                Getting your home cleaned is easy. Just follow these simple steps and relax.
              </p>
              <button
                onClick={handleMainBookNow}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-grad-primary-cta px-6 py-3 text-[#0C3352] font-extrabold text-xs shadow-md transition-all cursor-pointer"
                style={{ fontFamily: M }}
              >
                <CalendarBlank size={16} weight="bold" />
                Book Your Cleaning
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              {[
                { step: 1, icon: CalendarBlank, title: 'Book Online', desc: 'Choose your preferred date and time.' },
                { step: 2, icon: User, title: 'Our Team Arrives', desc: 'Trained professionals reach your location.' },
                { step: 3, icon: Sparkle, title: 'We Clean', desc: 'We follow a detailed cleaning checklist.' },
                { step: 4, icon: Smiley, title: 'You Enjoy', desc: 'A fresh, clean and healthy home!' },
              ].map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.step} className="flex flex-col items-center text-center relative">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF]">
                      <span className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0084FF] text-white text-[11px] font-extrabold">
                        {st.step}
                      </span>
                      <Icon size={26} weight="regular" />
                    </div>

                    <h4
                      className="mt-3 text-[#0C3352]"
                      style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, lineHeight: '18px' }}
                    >
                      {st.title}
                    </h4>
                    <p
                      className="mt-1 text-[#5A6E7F]"
                      style={{ fontFamily: M, fontSize: '11px', fontWeight: 400, lineHeight: '16px' }}
                    >
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* ── 6. SLEEK GALLERY TYPE BEFORE & AFTER SECTION ── */}
      <section className="w-full bg-[#F8FAFC] py-20 px-4 sm:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-[1280px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT TEXT & ELEGANT GALLERY BUTTONS (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span
                  className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold block mb-2"
                  style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
                >
                  TRANSFORMATION GALLERY
                </span>

                <h2
                  className="text-[#0C3352]"
                  style={{ fontFamily: M, fontWeight: 800, }}
                >
                  See the Difference
                </h2>

                <p
                  className="mt-3 text-[#5A6E7F]"
                  style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
                >
                  {activeScene.description}
                </p>
              </div>

              {/* CLEAN GALLERY CATEGORY BUTTONS */}
              <div className="space-y-3 pt-2">
                <span className="text-xs uppercase font-extrabold text-[#0C3352] tracking-wider block" style={{ fontFamily: M }}>
                  Select Category:
                </span>
                
                <div className="flex flex-wrap gap-2">
                  {GALLERY_SCENES.map((scene, idx) => {
                    const isSelected = activeSceneIdx === idx;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => setActiveSceneIdx(idx)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0C3352] border-[#0C3352] text-white shadow-sm'
                            : 'bg-white border-slate-200 text-[#5A6E7F] hover:border-slate-300 hover:text-[#0C3352]'
                        }`}
                        style={{ fontFamily: M }}
                      >
                        {scene.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleMainBookNow}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0084FF] hover:bg-[#0066CC] text-white px-7 py-3 font-extrabold text-xs transition-colors cursor-pointer shadow-sm"
                  style={{ fontFamily: M }}
                >
                  Book This Service
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>

            </div>

            {/* RIGHT ELEGANT 50/50 DRAG SLIDER (7 COLS) */}
            <div className="lg:col-span-7">
              <ElegantBeforeAfterSlider
                beforeImg={activeScene.beforeImg}
                afterImg={activeScene.afterImg}
                title={activeScene.title}
              />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ServiceDetailPage;

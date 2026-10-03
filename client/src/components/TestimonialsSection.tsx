import React, { useState, useEffect } from 'react';
import { Star, Quotes, CheckCircle } from '@phosphor-icons/react';
import { clientApi } from '../services/api';

const M = "'Manrope', sans-serif";

const fallbackTestimonials = [
  {
    id: 1,
    name: 'Sarah Al-Mansoori',
    location: 'Dubai Marina',
    service: 'Full Home Cleaning',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    review:
      'Maidslife has completely transformed our weekend routine. The cleaners arrived right on time, were incredibly polite, and left our apartment absolutely spotless. Best cleaning service in Dubai!',
    date: 'Verified Client • 2 days ago',
  },
  {
    id: 2,
    name: 'Marcus Brody',
    location: 'Downtown Dubai',
    service: 'Post Construction Cleaning',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    review:
      'We hired Maidslife after completing our apartment renovation. The team removed all dust, paint specks, and leftover mess effortlessly. Exceptional attention to detail and zero stress!',
    date: 'Verified Client • 1 week ago',
  },
  {
    id: 3,
    name: 'Fatima & Omar K.',
    location: 'Palm Jumeirah',
    service: 'Deep Cleaning & Upholstery',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    review:
      'The eco-friendly products they use are a huge plus for us having toddlers. Our carpets and sofas look brand new again. Highly professional, polite, and extremely reliable!',
    date: 'Verified Client • 3 days ago',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>(fallbackTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await clientApi.getTestimonials();
        if (data && data.length > 0) {
          const mapped = data.map((t: any) => ({
            id: t._id || t.id,
            name: t.name,
            location: t.role || 'Verified Client',
            service: 'Service',
            avatar: t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // default avatar
            rating: t.rating || 5,
            review: t.content,
            date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
          }));
          setTestimonials(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials', err);
      }
    };
    fetchTestimonials();
  }, []);
  return (
    <section className="w-full bg-[#F8FAFC] py-20 px-4 sm:px-8 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px]">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2.5 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            WHAT OUR CLIENTS SAY
            <span className="opacity-70">—</span>
          </div>
        </div>

        {/* ── HEADING ── */}
        <h2
          className="mt-4 text-center text-[#0C3352]"
          style={{ fontFamily: M, fontWeight: 800, }}
        >
          Loved by Thousands of Homes Across Dubai
        </h2>

        {/* ── SUBTITLE ── */}
        <p
          className="mt-3 text-center text-[#5A6E7F] mx-auto max-w-[600px]"
          style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
        >
          Read real experiences from satisfied homeowners and business managers who rely on Maidslife for pristine, hassle-free spaces.
        </p>

        {/* ── 3 DISTINCT TESTIMONIAL CARDS GRID (Desktop) / SLIDER (Mobile) ── */}
        <div 
          className="mt-14 flex sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 sm:pb-0"
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
          
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E2EEF8] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,132,255,0.08)] hover:border-[#B5D8F8] transition-all duration-300 w-[calc(100vw-32px)] sm:w-auto snap-start shrink-0"
            >

              <div>
                {/* Header Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between">
                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={18} weight="fill" className="text-[#FFB800]" />
                    ))}
                    <span
                      className="ml-2 text-[#0C3352]"
                      style={{ fontFamily: M, fontSize: '12px', fontWeight: 700 }}
                    >
                      5.0
                    </span>
                  </div>

                  {/* Large Stylized Quote Badge */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] group-hover:bg-[#0084FF] group-hover:text-white transition-colors duration-300">
                    <Quotes size={20} weight="fill" />
                  </div>
                </div>

                {/* Service Tag */}
                <div className="mt-4 inline-block rounded-md bg-[#F0F7FF] px-3 py-1 text-[#0C3352] font-semibold" style={{ fontFamily: M, fontSize: '11px' }}>
                  {item.service}
                </div>

                {/* Review Text */}
                <p
                  className="mt-4 text-[#334155] leading-relaxed"
                  style={{ fontFamily: M, fontSize: '14px', fontWeight: 400, lineHeight: '22px' }}
                >
                  "{item.review}"
                </p>
              </div>

              {/* Bottom User Info Row */}
              <div className="mt-8 pt-5 border-t border-[#F0F4F8] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  {/* Avatar Image */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Name & Location */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4
                        className="text-[#0C3352]"
                        style={{ fontFamily: M, fontSize: '15px', fontWeight: 700, lineHeight: '20px' }}
                      >
                        {item.name}
                      </h4>
                      <CheckCircle size={15} weight="fill" className="text-[#0084FF]" />
                    </div>
                    <p
                      className="text-[#64748B]"
                      style={{ fontFamily: M, fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                    >
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── MOBILE PAGINATION DOTS ── */}
        <div className="flex sm:hidden justify-center items-center gap-2 mt-2">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-[#0084FF]' : 'w-2 bg-[#DCEBF8]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

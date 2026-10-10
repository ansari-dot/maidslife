import React, { useState, useEffect } from 'react';
import { clientApi } from '../services/api';

const M = "'Manrope', sans-serif";

const teamMembers = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Senior Cleaning Specialist',
    experience: '5+ Years Experience',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Deep Cleaning Team Lead',
    experience: '7+ Years Experience',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Quality & Hygiene Supervisor',
    experience: '6+ Years Experience',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Upholstery & Carpet Expert',
    experience: '4+ Years Experience',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
  },
];

interface TeamSectionProps {
  onBookClick?: () => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onBookClick }) => {
  const [team, setTeam] = useState<any[]>(teamMembers);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await clientApi.getTeamMembers();
        if (data && data.length > 0) {
          const mapped = data.filter(t => t.isActive).map(t => ({
            id: t._id || t.id,
            name: t.name,
            role: t.role,
            experience: t.experience || '1+ Years Experience',
            image: t.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
          }));
          setTeam(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch team members', err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px]">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center">
          <span
            className="rounded-full bg-slate-100 px-4 py-1.5 text-[#0C3352] tracking-wider uppercase"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '16px' }}
          >
            MEET OUR TEAM
          </span>
        </div>

        {/* ── HEADING ── */}
        <h2
          className="mt-4 text-center text-[#0C3352]"
          style={{ fontFamily: M, fontWeight: 800, }}
        >
          The Experts Behind Maidslife
        </h2>

        {/* ── SUBTITLE ── */}
        <p
          className="mt-3 text-center text-[#5A6E7F] mx-auto max-w-[540px]"
          style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '24px' }}
        >
          Background-checked, highly trained, and dedicated professionals committed to giving you a spotless home.
        </p>

        {/* ── 4 CLEAN TEAM CARDS (Desktop) / SLIDER (Mobile) ── */}
        <div 
          className="mt-12 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 sm:pb-0"
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
          
          {team.map((member) => (
            <div key={member.id} className="group flex flex-col w-[calc(100vw-32px)] sm:w-auto snap-start shrink-0">

              {/* Clean Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Clean Left-Aligned Text Info */}
              <div className="mt-4 flex flex-col">
                <h3
                  className="text-[#0C3352]"
                  style={{ fontFamily: M, fontWeight: 800, }}
                >
                  {member.name}
                </h3>

                <p
                  className="mt-1 text-[#475569]"
                  style={{ fontFamily: M, fontSize: '13px', fontWeight: 500, lineHeight: '18px' }}
                >
                  {member.role}
                </p>

                <p
                  className="mt-1 text-[#94A3B8]"
                  style={{ fontFamily: M, fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                >
                  {member.experience}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* ── MOBILE PAGINATION DOTS ── */}
        <div className="flex sm:hidden justify-center items-center gap-2 mt-2">
          {team.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-[#0084FF]' : 'w-2 bg-[#DCEBF8]'
              }`}
            />
          ))}
        </div>

        {/* ── ACTION CTA BUTTON ── */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onBookClick}
            className="inline-flex items-center gap-2.5 rounded-full bg-grad-primary-cta px-8 py-3.5 text-foreground font-extrabold text-sm shadow-[0_4px_16px_rgba(255,184,0,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            style={{ fontFamily: M }}
          >
            <span>Book with our Trusted Specialists →</span>
          </button>
        </div>

      </div>
    </section>
  );
};

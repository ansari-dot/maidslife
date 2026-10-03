import React, { useState } from 'react';
import {
  House,
  List,
  X,
  User,
  CalendarBlank,
  CaretDown,
  MapPin,
} from '@phosphor-icons/react';

interface NavbarProps {
  onBookClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onMyBookingsClick?: () => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
  user?: { name: string; email: string; role?: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookClick,
  onLoginClick,
  onLogoutClick,
  onMyBookingsClick,
  activeNav = 'Home',
  onNavClick,
  user,
}) => {
  const [internalActive, setInternalActive] = useState('Home');
  const activeLink = activeNav || internalActive;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [city, setCity] = useState('Dubai, UAE');

  const navLinks = ['Home', 'Services', 'About', 'Careers', 'Contact'];
  const locations = [
    { name: 'Dubai, UAE', sub: 'We serve your area' },
    { name: 'Abu Dhabi, UAE', sub: 'Downtown & Islands' },
    { name: 'Sharjah, UAE', sub: 'Al Majaz, Nahda & more' },
  ];

  const handleLinkClick = (link: string) => {
    setInternalActive(link);
    onNavClick?.(link);
  };

  return (
    /* pill navbar — sticky so it floats over hero on scroll, bg-bg fills gap behind it */
    <header className="px-4 sm:px-8 pt-5 pb-3">
      <div className="max-w-[1280px] mx-auto bg-white/70 backdrop-blur-md rounded-full shadow-[0_4px_28px_rgba(12,51,82,0.10)] border border-white/60 px-5 sm:px-7 py-3 flex items-center justify-between gap-4">

        {/* ── LOGO ── */}
        <button onClick={() => handleLinkClick('Home')} className="shrink-0 select-none text-left focus:outline-none cursor-pointer">
          <img
            src="https://res.cloudinary.com/jbgpjagy/image/upload/f_auto,q_auto/v1791042676/logo.png"
            alt="Maidslife – Clean Homes, Happy Lives"
            className="h-10 w-auto object-contain"
            draggable={false}
          />
        </button>

        {/* ── NAV LINKS (desktop) ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link === activeLink;
            return (
              <button
                key={link}
                onClick={() => handleLinkClick(link)}
                className={`relative px-4 py-1.5 text-[14px] font-semibold rounded-full transition-colors cursor-pointer ${active ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                  }`}
              >
                {link}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── RIGHT ACTIONS (desktop) ── */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">

          {/* Location dropdown */}
          <div className="relative">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {/* UAE flag */}
              <div className="h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-sm shrink-0">
                <svg viewBox="0 0 30 20" className="h-full w-full">
                  <rect width="10" height="20" fill="#CE1126" />
                  <rect x="10" width="20" height="6.67" fill="#009A3D" />
                  <rect x="10" y="6.67" width="20" height="6.67" fill="#FFFFFF" />
                  <rect x="10" y="13.33" width="20" height="6.67" fill="#000000" />
                </svg>
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold text-foreground">{city}</span>
                  <CaretDown
                    size={13}
                    weight="bold"
                    className={`text-muted transition-transform ${locationOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                <span className="text-[10px] text-muted font-medium">We serve your area</span>
              </div>
            </button>

            {locationOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select City
                </p>
                <div className="space-y-1">
                  {locations.map((loc) => {
                    const isSelected = city === loc.name;
                    return (
                      <button
                        key={loc.name}
                        onClick={() => { setCity(loc.name); setLocationOpen(false); }}
                        className={`flex w-full items-start justify-start h-auto gap-3 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 text-primary'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin
                            size={18}
                            weight={isSelected ? "bold" : "regular"}
                            className={isSelected ? 'text-primary' : 'text-primary/70'}
                          />
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className={`text-[13px] leading-snug ${isSelected ? 'font-bold text-primary' : 'font-semibold text-slate-800'}`}>
                            {loc.name}
                          </span>
                          <span className={`text-[11px] leading-snug mt-0.5 ${isSelected ? 'text-primary/70 font-medium' : 'text-slate-400 font-normal'}`}>
                            {loc.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-bold text-slate-800 shadow-sm hover:border-primary/40 hover:bg-blue-50/50 transition-colors cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <CaretDown size={12} weight="bold" className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-primary">
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => { setUserMenuOpen(false); onMyBookingsClick?.(); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <CalendarBlank size={16} className="text-primary" />
                      My Bookings
                    </button>

                    {user.role === 'admin' && (
                      <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <User size={16} className="text-amber-500" />
                        Admin Dashboard ↗
                      </a>
                    )}

                    <button
                      onClick={() => { setUserMenuOpen(false); onLogoutClick?.(); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <X size={16} className="text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 h-[40px] text-[13px] font-semibold text-foreground shadow-sm hover:border-primary/40 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <User size={16} weight="regular" className="text-foreground" />
              Login
            </button>
          )}

          {/* Book a Cleaning */}
          <button
            onClick={onBookClick}
            className="flex items-center justify-center gap-2 rounded-full bg-grad-primary-cta px-5 h-[40px] text-[13px] font-extrabold text-foreground shadow-[0_4px_14px_rgba(255,184,0,0.35)] hover:brightness-105 active:scale-[0.97] transition-all cursor-pointer"
          >
            <CalendarBlank size={16} weight="bold" />
            Book a Cleaning
          </button>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-foreground hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {mobileOpen && (
        <div className="lg:hidden mx-auto mt-3 max-w-[1280px] rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl space-y-1">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => { handleLinkClick(link); setMobileOpen(false); }}
              className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${activeLink === link ? 'bg-blue-50 text-primary' : 'text-foreground hover:bg-slate-50'
                }`}
            >
              {link}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="px-2 py-1 text-xs font-bold text-slate-700">
                  Signed in as <span className="text-primary">{user.name}</span>
                </div>
                <button
                  onClick={() => { onMyBookingsClick?.(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-foreground cursor-pointer"
                >
                  <CalendarBlank size={16} /> My Bookings
                </button>
                <button
                  onClick={() => { onLogoutClick?.(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 py-2 text-sm font-semibold cursor-pointer"
                >
                  <X size={16} /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { onLoginClick?.(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-foreground cursor-pointer"
              >
                <User size={16} /> Login
              </button>
            )}
            <button
              onClick={() => { onBookClick?.(); setMobileOpen(false); }}
              className="flex items-center justify-center gap-2 rounded-xl bg-grad-primary-cta py-2 text-sm font-extrabold text-foreground cursor-pointer"
            >
              <CalendarBlank size={16} weight="bold" /> Book a Cleaning
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

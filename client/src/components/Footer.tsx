import React, { useState } from 'react';
import {
  Phone,
  EnvelopeSimple,
  MapPin,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
  WhatsappLogo,
  ArrowRight,
  ShieldCheck,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

interface FooterProps {
  onBookClick?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBookClick, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleQuickLink = (item: string) => {
    if (item.includes('About')) {
      onNavigate?.('/about');
    } else if (item.includes('Book')) {
      onBookClick?.();
    } else if (item.includes('FAQs') || item.includes('Support')) {
      onNavigate?.('/contact');
    } else if (item.includes('Careers')) {
      onNavigate?.('/careers');
    } else {
      onNavigate?.('/services');
    }
  };

  return (
    <footer className="w-full bg-[#082238] text-white">

      {/* ── TOP NEWSLETTER / CTA RIBBON ── */}
      <div className="border-b border-white/10 bg-[#0C3352] py-12 px-4 sm:px-8">
        <div className="mx-auto max-w-[1280px] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-white"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              Get Exclusive Cleaning Deals & Home Tips
            </h3>
            <p
              className="mt-1 text-[#94A3B8]"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}
            >
              Subscribe to our newsletter for special seasonal discounts across Dubai.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto items-center gap-3">
            {subscribed ? (
              <div
                className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-6 py-3 text-emerald-400 font-semibold text-sm"
                style={{ fontFamily: M }}
              >
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <div className="relative flex w-full sm:w-[400px] items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-3 pr-32 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0084FF] transition-colors"
                  style={{ fontFamily: M, fontSize: '14px' }}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 rounded-full bg-[#0084FF] hover:bg-[#0066CC] px-5 py-2 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  style={{ fontFamily: M }}
                >
                  Subscribe
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER CONTENT (4 Columns Grid) ── */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* COLUMN 1: Company Info */}
          <div className="flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="https://res.cloudinary.com/jbgpjagy/image/upload/f_auto,q_auto/v1791042676/logo.png" alt="Maidslife Logo" className="h-9 w-auto object-contain cursor-pointer" onClick={() => onNavigate?.('/')} />
            </div>

            <p
              className="mt-4 text-[#94A3B8] leading-relaxed"
              style={{ fontFamily: M, fontSize: '13px', fontWeight: 400, lineHeight: '22px' }}
            >
              Dubai’s trusted residential & commercial cleaning experts. Delivering background-checked staff, eco-friendly products, and 100% satisfaction guarantees.
            </p>

            {/* Contact Details */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[#CBD5E1]">
                <Phone size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px', fontWeight: 600 }}>056 213 3996</span>
              </div>
              <div className="flex items-center gap-3 text-[#CBD5E1]">
                <EnvelopeSimple size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px' }}>info@maidslife.com</span>
              </div>
              <div className="flex items-center gap-3 text-[#CBD5E1]">
                <MapPin size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px' }}>Business Bay, Dubai, UAE</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#0084FF] hover:text-white transition-colors">
                <InstagramLogo size={18} weight="bold" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#0084FF] hover:text-white transition-colors">
                <FacebookLogo size={18} weight="bold" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#0084FF] hover:text-white transition-colors">
                <LinkedinLogo size={18} weight="bold" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#0084FF] hover:text-white transition-colors">
                <WhatsappLogo size={18} weight="bold" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: Our Services */}
          <div>
            <h4
              className="text-white uppercase tracking-wider"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 800 }}
            >
              Our Services
            </h4>
            <div className="mt-2 h-0.5 w-8 bg-[#0084FF]" />

            <ul className="mt-5 space-y-3">
              {[
                'Home Cleaning Services',
                'Office Cleaning Services',
                'Deep Cleaning Services',
                'Move-In / Move-Out Cleaning',
                'Post Construction Cleaning',
                'Specialized Upholstery Care',
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      onNavigate?.(`/service/${slug}`);
                    }}
                    className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 group text-left focus:outline-none"
                    style={{ fontFamily: M, fontSize: '13px', fontWeight: 500 }}
                  >
                    <span className="text-[#0084FF] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Quick Links */}
          <div>
            <h4
              className="text-white uppercase tracking-wider"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 800 }}
            >
              Quick Links
            </h4>
            <div className="mt-2 h-0.5 w-8 bg-[#0084FF]" />

            <ul className="mt-5 space-y-3">
              {[
                'About Maidslife',
                'All Services',
                'Careers',
                'FAQs & Support',
                'Book a Service',
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleQuickLink(item)}
                    className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 group text-left focus:outline-none"
                    style={{ fontFamily: M, fontSize: '13px', fontWeight: 500 }}
                  >
                    <span className="text-[#0084FF] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>


          {/* COLUMN 4: Service Areas */}
          <div>
            <h4
              className="text-white uppercase tracking-wider"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 800 }}
            >
              Service Areas
            </h4>
            <div className="mt-2 h-0.5 w-8 bg-[#0084FF]" />

            <ul className="mt-5 space-y-3">
              {[
                'Downtown Dubai',
                'Dubai Marina & JBR',
                'Palm Jumeirah',
                'Business Bay',
                'Jumeirah Golf Estates',
                'Arabian Ranches & Mirdif',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[#94A3B8]" style={{ fontFamily: M, fontSize: '13px' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0084FF]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── BOTTOM LEGAL & COPYRIGHT BAR ── */}
      <div className="border-t border-white/10 bg-[#051726] py-6 px-6 sm:px-12">
        <div className="mx-auto max-w-[1280px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <p
              className="text-[#94A3B8]"
              style={{ fontFamily: M, fontSize: '12px', fontWeight: 400 }}
            >
              © {new Date().getFullYear()} GOODHANDS CLEANING SERVICES CO. All rights reserved.
            </p>
            <p
              className="text-[#94A3B8]/60"
              style={{ fontFamily: M, fontSize: '11px', fontWeight: 400 }}
            >
              Professional License No: 1400048
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-[#94A3B8] hover:text-white transition-colors" style={{ fontFamily: M, fontSize: '12px' }}>
              Privacy Policy
            </a>
            <a href="#" className="text-[#94A3B8] hover:text-white transition-colors" style={{ fontFamily: M, fontSize: '12px' }}>
              Terms of Service
            </a>
            <a href="#" className="text-[#94A3B8] hover:text-white transition-colors" style={{ fontFamily: M, fontSize: '12px' }}>
              Refund Policy
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
};

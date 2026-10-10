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
  X,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

interface FooterProps {
  onBookClick?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBookClick, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'refund' | null>(null);

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
              <a
                href="tel:0562133996"
                className="flex items-center gap-3 text-[#CBD5E1] hover:text-[#0084FF] transition-colors cursor-pointer w-fit"
              >
                <Phone size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px', fontWeight: 600 }}>056 213 3996</span>
              </a>
              <a
                href="mailto:info@maidslife.com"
                className="flex items-center gap-3 text-[#CBD5E1] hover:text-[#0084FF] transition-colors cursor-pointer w-fit"
              >
                <EnvelopeSimple size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px' }}>info@maidslife.com</span>
              </a>
              <a
                href="https://maps.google.com/?q=Business+Bay+Dubai+UAE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#CBD5E1] hover:text-[#0084FF] transition-colors cursor-pointer w-fit"
              >
                <MapPin size={18} className="text-[#0084FF] shrink-0" />
                <span style={{ fontFamily: M, fontSize: '13px' }}>Business Bay, Dubai, UAE</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#E1306C] hover:text-white transition-colors cursor-pointer"
              >
                <InstagramLogo size={18} weight="bold" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#1877F2] hover:text-white transition-colors cursor-pointer"
              >
                <FacebookLogo size={18} weight="bold" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#0A66C2] hover:text-white transition-colors cursor-pointer"
              >
                <LinkedinLogo size={18} weight="bold" />
              </a>
              <a
                href="https://wa.me/971562133996?text=Hello%20Maidslife!"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#CBD5E1] hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
              >
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
                <li key={idx}>
                  <button
                    onClick={() => onBookClick?.()}
                    className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors text-left cursor-pointer focus:outline-none"
                    style={{ fontFamily: M, fontSize: '13px' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0084FF]" />
                    {item}
                  </button>
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
            <button
              onClick={() => setLegalModal('privacy')}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: M, fontSize: '12px' }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: M, fontSize: '12px' }}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalModal('refund')}
              className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: M, fontSize: '12px' }}
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      {/* ── LEGAL INFORMATION POPUP MODAL ── */}
      {legalModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLegalModal(null)}
              className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>

            {legalModal === 'privacy' && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-[#0C3352]" style={{ fontFamily: M }}>
                  Privacy Policy
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Last updated: 2026. Goodhands Cleaning Services Co. (operating as Maidslife) respects your privacy and is committed to protecting your personal information.
                </p>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-slate-800">1. Information We Collect</h4>
                  <p>We collect details you provide when booking, such as your name, contact phone number, address in Dubai/UAE, and payment preferences.</p>
                  <h4 className="font-bold text-slate-800">2. How We Use Your Data</h4>
                  <p>Your details are used exclusively to fulfill cleaning appointments, communicate arrival times, provide customer support, and enhance our services.</p>
                  <h4 className="font-bold text-slate-800">3. Data Security</h4>
                  <p>We implement stringent industry-standard technical measures and secure protocols to safeguard your personal information against unauthorized access.</p>
                </div>
              </div>
            )}

            {legalModal === 'terms' && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-[#0C3352]" style={{ fontFamily: M }}>
                  Terms of Service
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Welcome to Maidslife. By scheduling a service through our platform, you agree to these Terms.
                </p>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-slate-800">1. Booking and Confirmation</h4>
                  <p>All bookings are subject to cleaner availability and confirmation. Rescheduling is available free of charge up to 2 hours before the scheduled time slot.</p>
                  <h4 className="font-bold text-slate-800">2. Service Quality</h4>
                  <p>Our specialists are trained and background checked. We provide a 24-Hour Satisfaction Guarantee: if any area does not meet expectations, notify us within 24 hours for a complimentary re-clean.</p>
                  <h4 className="font-bold text-slate-800">3. Safety &amp; Access</h4>
                  <p>Clients are required to ensure safe access to the premises during the confirmed booking hours.</p>
                </div>
              </div>
            )}

            {legalModal === 'refund' && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-[#0C3352]" style={{ fontFamily: M }}>
                  Refund &amp; Cancellation Policy
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We strive for 100% satisfaction across every cleaning appointment.
                </p>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-slate-800">1. Free Cancellation</h4>
                  <p>You may cancel or reschedule your cleaning appointment without penalty if done at least 2 hours before your scheduled arrival time.</p>
                  <h4 className="font-bold text-slate-800">2. Free 24h Re-Clean</h4>
                  <p>If any service is unsatisfactory, contact our team immediately. We will dispatch our team to re-clean the specific areas free of charge.</p>
                  <h4 className="font-bold text-slate-800">3. Refunds</h4>
                  <p>If an issue cannot be resolved through our re-clean guarantee, our management team will review and process appropriate refunds or service credits within 3-5 business days.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-6 py-2.5 rounded-full bg-[#0C3352] text-white font-bold text-xs hover:bg-[#0084FF] transition-colors cursor-pointer"
                style={{ fontFamily: M }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};

import React, { useState } from 'react';
import {
  PhoneCall,
  EnvelopeSimple,
  MapPin,
  Clock,
  PaperPlaneRight,
  CheckCircle,
  ChatCircleDots,
  House,
  Sparkle,
  CaretDown,
} from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

interface ContactPageProps {
  onBookClick?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBookClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Home Cleaning Services',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'Home Cleaning Services', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'How fast can a cleaning specialist arrive at my location in Dubai?',
      a: 'We offer same-day booking options! Cleaners can typically be dispatched to your area within 2 to 4 hours depending on availability.',
    },
    {
      q: 'Do I need to supply my own cleaning materials and equipment?',
      a: 'No! Our professional team comes fully equipped with premium cleaning supplies, microfiber cloths, and vacuum cleaners. If you prefer us to use your own specialized products, just let us know.',
    },
    {
      q: 'Are your cleaning staff background checked and insured?',
      a: 'Yes, 100%. Every single cleaner is employed directly by Maidslife, thoroughly background-checked, medically vetted, and fully insured.',
    },
    {
      q: 'What if I am not satisfied with the cleaning service?',
      a: 'We offer a 24-Hour Satisfaction Guarantee! If any area of your home is not cleaned to your expectations, contact us and we will send a team to re-clean for free.',
    },
  ];

  return (
    <div className="w-full bg-white min-h-screen pt-[130px]">

      {/* ── 1. TOP HEADER BANNER (NO HERO SECTION) ── */}
      <div className="w-full bg-white pt-10 pb-14 px-6 sm:px-12 text-center border-b border-slate-100">
        <div className="mx-auto max-w-[780px]">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase mb-4"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            CONTACT US
            <span className="opacity-70">—</span>
          </div>

          <h1
            className="text-[#0C3352]"
            style={{ fontFamily: M, fontWeight: 800, }}
          >
            We&apos;d Love to Hear <span className="text-[#0084FF]">From You</span>
          </h1>

          <p
            className="mt-4 text-[#5A6E7F]"
            style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
          >
            Have questions about our cleaning services, pricing, or customized packages? Our dedicated Dubai team is available 7 days a week to assist you.
          </p>
        </div>
      </div>

      {/* ── 2. MAIN CONTACT SECTION (2 COLUMNS: FORM & INFO) ── */}
      <section className="w-full bg-white py-16 sm:py-20 px-6 sm:px-12">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">

          {/* LEFT COLUMN: CONTACT FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#DCEBF8] p-8 sm:p-12 shadow-[0_6px_24px_rgba(12,51,82,0.04)]">
            <h2
              className="text-[#0C3352]"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              Send Us a Message
            </h2>
            <p
              className="mt-2 text-[#5A6E7F]"
              style={{ fontFamily: M, fontSize: '14px', fontWeight: 400 }}
            >
              Fill out the form below and our customer support team will respond within 15 minutes.
            </p>

            {submitted ? (
              <div className="mt-8 p-6 rounded-2xl bg-[#EBF5FF] border border-[#CCE3FF] text-[#0066CC] flex items-center gap-3">
                <CheckCircle size={28} weight="fill" className="shrink-0" />
                <div>
                  <h4 className="font-bold text-base" style={{ fontFamily: M }}>Thank You! Message Received.</h4>
                  <p className="text-xs mt-0.5 opacity-90" style={{ fontFamily: M }}>Our Dubai support representative will call or WhatsApp you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all"
                      style={{ fontFamily: M }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all"
                      style={{ fontFamily: M }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      Phone / WhatsApp *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-xs font-bold text-slate-500" style={{ fontFamily: M }}>+971</span>
                      <input
                        type="tel"
                        required
                        placeholder="50 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] pl-16 pr-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all"
                        style={{ fontFamily: M }}
                      />
                    </div>
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      Select Service *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all cursor-pointer"
                      style={{ fontFamily: M }}
                    >
                      <option>Home Cleaning Services</option>
                      <option>Office Cleaning Services</option>
                      <option>Deep Cleaning Services</option>
                      <option>Move-In / Move-Out Cleaning</option>
                      <option>Post Construction Cleaning</option>
                      <option>Specialized Cleaning Services</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                    Your Message / Cleaning Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us your location in Dubai, preferred timing, or special requests..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all"
                    style={{ fontFamily: M }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0C3352] hover:bg-[#0084FF] px-8 py-4 text-white font-extrabold text-sm transition-all duration-300 shadow-md focus:outline-none"
                  style={{ fontFamily: M }}
                >
                  <PaperPlaneRight size={18} weight="bold" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: CONTACT DETAILS & OPERATING HOURS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <span
                className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
                style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
              >
                GET IN TOUCH
              </span>
              <h2
                className="text-[#0C3352]"
                style={{ fontFamily: M, fontWeight: 800, }}
              >
                Direct Support &amp;<br />
                Office Location
              </h2>

              {/* Contact Cards */}
              <div className="space-y-4 pt-2">

                {/* Phone Card */}
                <a
                  href="tel:0562133996"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-[#0084FF] hover:bg-blue-50/40 transition-all group cursor-pointer"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] group-hover:scale-105 transition-transform">
                    <PhoneCall size={24} weight="regular" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, color: '#0C3352' }}>
                      Call Us Directly
                    </h4>
                    <p style={{ fontFamily: M, fontSize: '13px', color: '#5A6E7F' }} className="mt-0.5">
                      056 213 3996
                    </p>
                  </div>
                </a>

                {/* WhatsApp Card */}
                <a
                  href="https://wa.me/971562133996?text=Hello%20Maidslife!%20I%20would%20like%20to%20book%20a%20cleaning%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-[#25D366] hover:bg-emerald-50/40 transition-all group cursor-pointer"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs group-hover:scale-105 transition-transform">
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, color: '#0C3352' }}>
                      WhatsApp Instant Chat
                    </h4>
                    <p style={{ fontFamily: M, fontSize: '13px', color: '#5A6E7F' }} className="mt-0.5">
                      Available 24/7 for quick booking &amp; support
                    </p>
                  </div>
                </a>

                {/* Email Card */}
                <a
                  href="mailto:info@maidslife.com"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-[#0084FF] hover:bg-blue-50/40 transition-all group cursor-pointer"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] group-hover:scale-105 transition-transform">
                    <EnvelopeSimple size={24} weight="regular" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, color: '#0C3352' }}>
                      Email Support
                    </h4>
                    <p style={{ fontFamily: M, fontSize: '13px', color: '#5A6E7F' }} className="mt-0.5">
                      info@maidslife.com
                    </p>
                  </div>
                </a>

                {/* Location Card */}
                <a
                  href="https://maps.google.com/?q=Business+Bay+Dubai+UAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-[#0084FF] hover:bg-blue-50/40 transition-all group cursor-pointer"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0084FF] group-hover:scale-105 transition-transform">
                    <MapPin size={24} weight="regular" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: M, fontSize: '14px', fontWeight: 800, color: '#0C3352' }}>
                      Dubai Headquarters
                    </h4>
                    <p style={{ fontFamily: M, fontSize: '13px', color: '#5A6E7F' }} className="mt-0.5">
                      Level 14, Business Bay Tower, Dubai, UAE
                    </p>
                  </div>
                </a>

              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-6 rounded-2xl bg-[#0C3352] text-white space-y-3 shadow-md">
              <div className="flex items-center gap-2.5 text-[#92C7ED]">
                <Clock size={20} weight="bold" />
                <span className="text-xs uppercase font-extrabold tracking-wider" style={{ fontFamily: M }}>Service Working Hours</span>
              </div>
              <p style={{ fontFamily: M, fontSize: '15px', fontWeight: 700 }}>
                Monday &ndash; Sunday: 7:00 AM &ndash; 9:00 PM
              </p>
              <p style={{ fontFamily: M, fontSize: '12px', color: '#CBD5E1' }}>
                Online booking and customer phone support available 24 hours a day, 7 days a week.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. FREQUENTLY ASKED QUESTIONS ── */}
      <section className="w-full bg-[#F8FAFC] py-20 px-6 sm:px-12 border-t border-slate-100">
        <div className="mx-auto max-w-[1000px]">

          <div className="text-center max-w-[600px] mx-auto mb-12">
            <span
              className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
              style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
            >
              GOT QUESTIONS?
            </span>
            <h2
              className="mt-3 text-[#0C3352]"
              style={{ fontFamily: M, fontWeight: 800, }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-[#DCEBF8] p-6 transition-all shadow-xs cursor-pointer"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className="text-[#0C3352]"
                      style={{ fontFamily: M, fontWeight: 700 }}
                    >
                      {faq.q}
                    </h3>
                    <CaretDown
                      size={18}
                      weight="bold"
                      className={`text-[#0084FF] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {isOpen && (
                    <p
                      className="mt-3 text-[#5A6E7F] pt-2 border-t border-slate-100"
                      style={{ fontFamily: M, fontSize: '14px', lineHeight: '22px' }}
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;

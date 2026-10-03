import React, { useState } from 'react';
import {
  User,
  EnvelopeSimple,
  Lock,
  Phone,
  Eye,
  EyeSlash,
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  MapPin,
  CaretDown,
  Check,
  House,
  Sparkle,
  ArrowLeft,
} from '@phosphor-icons/react';

const FONT_FAMILY = "'Manrope', 'Plus Jakarta Sans', sans-serif";

interface LoginPageProps {
  onBackToHome?: () => void;
  onSuccessLogin?: (user: { name: string; email: string }) => void;
  initialMode?: 'login' | 'signup';
}

const REGIONS = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { code: 'QAT', name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { code: 'KWT', name: 'Kuwait', flag: '🇰🇼', dial: '+965' },
  { code: 'OMN', name: 'Oman', flag: '🇴🇲', dial: '+968' },
  { code: 'BHR', name: 'Bahrain', flag: '🇧🇭', dial: '+973' },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onSuccessLogin,
  initialMode = 'login',
}) => {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [showPassword, setShowPassword] = useState(false);

  // Region Selector State
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        onSuccessLogin?.({
          name: fullName || (isSignup ? 'New User' : 'Sarah Ahmed'),
          email: email || 'sarah@example.com',
        });
        if (onBackToHome) onBackToHome();
      }, 1400);
    }, 800);
  };

  const handleForgotPassword = () => {
    setForgotPasswordMsg(true);
    setTimeout(() => setForgotPasswordMsg(false), 4000);
  };

  return (
    <div
      className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12 font-sans antialiased select-none overflow-x-hidden"
      style={{ fontFamily: FONT_FAMILY }}
    >
      {/* ── LEFT SHOWCASE PANEL (6 COLS - 50% SCREEN WIDTH) ── */}
      <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden min-h-[600px] lg:min-h-screen bg-[#F0F7FF]">
        
        {/* Background Photo of Maid & Living Room with Dubai Skyline */}
        <div
          className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('/login_hero.png')` }}
        />

        {/* Soft Sky Blue Gradient Overlay (Left to Right smooth blend) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-35% to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0066FF]/90 via-[#EBF4FF]/60 via-40% to-transparent" />

        {/* Bottom Left Ocean Blue Organic Wave Decorative Element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#0066FF] via-[#0084FF]/80 to-transparent rounded-full blur-2xl pointer-events-none opacity-90" />

        {/* TOP SECTION: BRAND LOGO */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-3 group text-left cursor-pointer"
            title="Return to Home"
          >
            {/* House Outline Icon with Sparkle/Plus */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#D9ECFF] text-[#0066FF] shadow-sm shadow-[#0066FF]/10 group-hover:scale-105 transition-transform">
              <div className="relative">
                <House size={26} weight="bold" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0066FF] text-white text-[9px] font-black">
                  +
                </span>
              </div>
            </div>

            <div>
              <span className="block text-2xl font-black tracking-tight text-[#0B2038]">
                Maidslife
              </span>
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#5E7A99]">
                Home Services
              </span>
            </div>
          </button>
        </div>

        {/* MIDDLE SECTION: HERO HEADLINE & FEATURES */}
        <div className="relative z-10 my-8 space-y-6 max-w-lg">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0066FF]">
            <span className="h-[2px] w-6 bg-[#0066FF] rounded-full" />
            CLEAN HOMES • HAPPY LIVES
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B2038] leading-[1.15] tracking-tight">
            Professional home services,{' '}
            <span className="text-[#0066FF]">made easy.</span>
          </h1>

          {/* Description */}
          <p className="text-[#425B76] text-sm sm:text-base leading-relaxed max-w-md font-medium">
            Book trusted cleaners, track your service in real-time and enjoy a cleaner, healthier home — all in one place.
          </p>

          {/* Feature List Cards */}
          <div className="space-y-5 pt-3">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30">
                <ShieldCheck size={22} weight="bold" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0B2038]">
                  Trusted &amp; Vetted Professionals
                </h4>
                <p className="text-xs text-[#5E7A99] mt-0.5 font-medium">
                  Background checked and trained staff
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30">
                <Clock size={22} weight="bold" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0B2038]">
                  Flexible Booking
                </h4>
                <p className="text-xs text-[#5E7A99] mt-0.5 font-medium">
                  Book in minutes, at your convenience
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30">
                <Star size={22} weight="fill" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0B2038]">
                  100% Satisfaction
                </h4>
                <p className="text-xs text-[#5E7A99] mt-0.5 font-medium">
                  Your happiness is our priority
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: LOCATION FOOTER */}
        <div className="relative z-10 flex items-center gap-3 text-xs pt-4 border-t border-slate-900/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
            <MapPin size={18} weight="bold" />
          </div>
          <div>
            <span className="font-extrabold text-[#0B2038] block">
              Serving across UAE
            </span>
            <span className="text-[#5E7A99] text-[11px] font-medium">
              Dubai • Abu Dhabi • Sharjah
            </span>
          </div>
        </div>

      </div>

      {/* ── RIGHT FORM PANEL (6 COLS) ── */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative">
          
          <div>
            {/* TOP HEADER CONTROLS (COUNTRY SELECTOR & TAB SWITCHER) */}
            <div className="flex items-center justify-between gap-4 mb-8">
              
              {/* Left Spacer / Back Link */}
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0075FF] transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} weight="bold" />
                Home
              </button>

              {/* Right Controls Group */}
              <div className="flex items-center gap-3">
                
                {/* Sign In / Sign Up Toggle Pill Container */}
                <div className="flex items-center p-1 bg-[#F1F5F9] rounded-full border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      !isSignup
                        ? 'bg-[#0075FF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#0F2A4A]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      isSignup
                        ? 'bg-[#0075FF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#0F2A4A]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Country / Region Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-[#0F2A4A] bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <span>{selectedRegion.flag}</span>
                    <span>{selectedRegion.code}</span>
                    <CaretDown size={12} weight="bold" className="text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isRegionOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                        Select Region
                      </div>
                      {REGIONS.map((reg) => (
                        <button
                          key={reg.code}
                          type="button"
                          onClick={() => {
                            setSelectedRegion(reg);
                            setIsRegionOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left hover:bg-slate-50 transition-colors ${
                            selectedRegion.code === reg.code ? 'text-[#0075FF] bg-blue-50/50' : 'text-[#0F2A4A]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{reg.flag}</span>
                            <span>{reg.name}</span>
                          </span>
                          {selectedRegion.code === reg.code && <Check size={14} weight="bold" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* FORM HEADLINE */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#0F2A4A] tracking-tight">
                {isSignup ? 'Create an Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {isSignup
                  ? 'Sign up for a customer account to book services, track your appointments and manage your bookings.'
                  : 'Sign in to your customer account to book services, track your appointments and manage your bookings.'}
              </p>
            </div>

            {/* FORGOT PASSWORD NOTIFICATION */}
            {forgotPasswordMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-3">
                <EnvelopeSimple size={20} className="text-[#0075FF] shrink-0" />
                <span>
                  Password reset link sent to your registered email address. Please check your inbox.
                </span>
              </div>
            )}

            {/* SUCCESS STATE */}
            {submittedSuccess ? (
              <div className="my-10 p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto shadow-md">
                  <Check size={28} weight="bold" />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-950">
                  {isSignup ? 'Account Created Successfully!' : 'Welcome Back!'}
                </h3>
                <p className="text-xs text-emerald-700">
                  Redirecting to your personalized home dashboard...
                </p>
              </div>
            ) : (
              /* AUTH FORM */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* SIGNUP FULL NAME */}
                {isSignup && (
                  <div>
                    <label className="block text-xs font-extrabold text-[#0F2A4A] mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] pl-11 pr-4 py-3.5 text-sm text-[#0F2A4A] placeholder-slate-400 outline-none focus:border-[#0075FF] focus:bg-white focus:ring-4 focus:ring-[#0075FF]/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* EMAIL ADDRESS */}
                <div>
                  <label className="block text-xs font-extrabold text-[#0F2A4A] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <EnvelopeSimple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] pl-11 pr-4 py-3.5 text-sm text-[#0F2A4A] placeholder-slate-400 outline-none focus:border-[#0075FF] focus:bg-white focus:ring-4 focus:ring-[#0075FF]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* SIGNUP PHONE NUMBER */}
                {isSignup && (
                  <div>
                    <label className="block text-xs font-extrabold text-[#0F2A4A] mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-extrabold text-[#0F2A4A] border-r border-slate-200 pr-2.5">
                        <span>{selectedRegion.flag}</span>
                        <span>{selectedRegion.dial}</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] pl-24 pr-4 py-3.5 text-sm text-[#0F2A4A] placeholder-slate-400 outline-none focus:border-[#0075FF] focus:bg-white focus:ring-4 focus:ring-[#0075FF]/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#0F2A4A]">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {!isSignup && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#0075FF] font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] pl-11 pr-12 py-3.5 text-sm text-[#0F2A4A] placeholder-slate-400 outline-none focus:border-[#0075FF] focus:bg-white focus:ring-4 focus:ring-[#0075FF]/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CHECKBOX */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0075FF] focus:ring-[#0075FF] accent-[#0075FF] cursor-pointer"
                    />
                    <span className="font-semibold text-slate-700">
                      {isSignup
                        ? 'I agree to the Terms of Service & Privacy Policy'
                        : 'Keep me signed in'}
                    </span>
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0075FF] hover:bg-[#0066EE] active:scale-[0.99] py-4 text-white font-extrabold text-sm shadow-lg shadow-[#0075FF]/25 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5" />
                  ) : (
                    <>
                      <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight size={18} weight="bold" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* FOOTER DISCLAIMER */}
          <div className="mt-8 pt-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              By signing in, you agree to Maidslife&apos;s{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0075FF] hover:underline font-bold">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0075FF] hover:underline font-bold">
                Privacy Policy
              </a>
              .
            </p>
          </div>

        </div>

    </div>
  );
};

export default LoginPage;


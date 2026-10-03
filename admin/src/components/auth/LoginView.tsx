// LoginView.tsx – Exact replica of Maidslife Admin Login UI
import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Globe,
  ChevronDown,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import loginHero from '../../assets/login-hero.png';

/* ── Maidslife Logo SVG (reusable) ──────────────────────────── */
const MaidslifeLogo: React.FC<{ size?: number; light?: boolean }> = ({ size = 40, light = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill={light ? 'rgba(255,255,255,0.15)' : '#0B3D5B'} />
    <path
      d="M24 10L10 22H14V36H21V28H27V36H34V22H38L24 10Z"
      fill={light ? '#fff' : '#34B5C8'}
    />
    <path
      d="M20 20C20 17.79 21.79 16 24 16C26.21 16 28 17.79 28 20C28 22.21 26.21 24 24 24C21.79 24 20 22.21 20 20Z"
      fill={light ? 'rgba(255,255,255,0.6)' : '#0B3D5B'}
    />
  </svg>
);

/* ── Google "G" Icon ────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const LoginView: React.FC = () => {
  const { login, notify } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const fillDemoCredentials = () => {
    setEmail('admin@maidslife.ae');
    setPassword('Admin@123456');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      notify('Welcome back! Successfully authenticated to Maidslife Admin Console.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      {/* ═══════════════ LEFT PANEL – Hero Image ═══════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background Image */}
        <img
          src={loginHero}
          alt="Maidslife professional cleaning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2535]/90 via-[#0B2535]/40 to-[#0B2535]/20" />

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Top – Logo */}
          <div className="flex items-center gap-3">
            <MaidslifeLogo size={44} light />
            <div>
              <h2 className="text-white text-xl font-bold tracking-tight leading-none">Maidslife</h2>
              <p className="text-white/60 text-[11px] font-medium tracking-widest uppercase">Home Services</p>
            </div>
          </div>

          {/* Middle – Headline */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-white/50 text-[11px] font-bold tracking-[0.3em] uppercase">Maidslife</span>
              <div className="h-[1px] w-12 bg-white/30" />
            </div>
            <h1 className="text-white text-[2.8rem] leading-[1.1] font-bold tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Professional care<br />
              <span className="text-[#34B5C8]">for every home.</span>
            </h1>
            <p className="text-white/70 text-sm mt-5 leading-relaxed max-w-sm">
              Simple, reliable and professional<br />
              home services across the UAE.
            </p>
          </div>

          {/* Bottom – Features + Tagline */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              {/* Trusted Professionals */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/80 text-xs font-medium">Trusted<br />Professionals</span>
              </div>

              <div className="h-8 w-[1px] bg-white/20" />

              {/* On-Time Service */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/80 text-xs font-medium">On-Time<br />Service</span>
              </div>

              <div className="h-8 w-[1px] bg-white/20" />

              {/* Location */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/80 text-xs font-medium">Dubai • Abu Dhabi<br />Sharjah</span>
              </div>
            </div>

            <p className="text-white/40 text-xs">
              Quality home care delivered by trusted professionals across the UAE.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════ RIGHT PANEL – Login Form ═══════════════ */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Top Bar – UAE selector */}
        <div className="flex justify-end p-6">
          <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition font-medium">
            <Globe className="w-4 h-4" />
            <span>UAE</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center px-8 pb-10">
          <div className="w-full max-w-[400px]">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 mb-6">
              <MaidslifeLogo size={48} />
              <div>
                <h2 className="text-[#0B3D5B] text-xl font-bold tracking-tight leading-none">Maidslife</h2>
                <p className="text-[#34B5C8] text-[10px] font-bold tracking-[0.25em] uppercase mt-0.5">Admin Panel</p>
              </div>
            </div>

            {/* Welcome Text */}
            <h1 className="text-[#0B2535] text-2xl font-bold mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm mb-7 leading-relaxed">
              Sign in to your admin account to manage bookings,<br />
              customers, services and more.
            </p>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#0B2535] mb-1.5">
                  Admin Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-[18px] h-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@maidslife.ae"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34B5C8]/30 focus:border-[#34B5C8] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#0B2535]">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => notify('Contact IT Support at ops@maidslife.ae for credential recovery.', 'info')}
                    className="text-xs font-semibold text-[#34B5C8] hover:text-[#2a9aab] transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-[18px] h-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34B5C8]/30 focus:border-[#34B5C8] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Remember Me + JWT Badge */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-[5px] border-2 border-slate-300 bg-white peer-checked:bg-[#0B3D5B] peer-checked:border-[#0B3D5B] transition flex items-center justify-center">
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 font-medium">Keep me signed in</span>
                </label>
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  JWT Encrypted?
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-white rounded-full text-sm font-bold shadow-lg shadow-[#0B3D5B]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #0B3D5B 0%, #145A7B 50%, #1A7A9A 100%)',
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

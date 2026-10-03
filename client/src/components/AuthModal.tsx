import React, { useState } from 'react';
import {
  X,
  User,
  EnvelopeSimple,
  Lock,
  Phone,
  Eye,
  EyeSlash,
  ArrowRight,
  Check,
  CaretDown,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccessLogin?: (user: { name: string; email: string }) => void;
}

const REGIONS = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { code: 'QAT', name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { code: 'KWT', name: 'Kuwait', flag: '🇰🇼', dial: '+965' },
  { code: 'OMN', name: 'Oman', flag: '🇴🇲', dial: '+968' },
  { code: 'BHR', name: 'Bahrain', flag: '🇧🇭', dial: '+973' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
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
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isSignup) {
        const res = await clientApi.signup({
          name: fullName || 'New Customer',
          email,
          phone: `${selectedRegion.dial}${phone}`,
          password,
        });

        if (res.success && res.user) {
          setSubmittedSuccess(true);
          setTimeout(() => {
            onSuccessLogin?.(res.user);
            setSubmittedSuccess(false);
            onClose();
          }, 1000);
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      } else {
        const res = await clientApi.login(email, password);
        if (res.success && res.user) {
          setSubmittedSuccess(true);
          setTimeout(() => {
            onSuccessLogin?.(res.user);
            setSubmittedSuccess(false);
            onClose();
          }, 1000);
        } else {
          setErrorMessage(res.message || 'Invalid login details.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordMsg(true);
    setTimeout(() => setForgotPasswordMsg(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        {/* TOP BRAND HEADER */}
        <div className="pt-6 sm:pt-8 px-5 sm:px-8 pb-3.5 text-center border-b border-slate-100 bg-gradient-to-b from-blue-50/50 to-transparent shrink-0">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <img src="https://res.cloudinary.com/jbgpjagy/image/upload/f_auto,q_auto/v1791042676/logo.png" alt="Maidslife" className="h-7 sm:h-8 w-auto object-contain" />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            {isSignup
              ? 'Create your account to manage bookings & services'
              : 'Sign in to access your bookings & profile'}
          </p>

          {/* TAB SWITCHER */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setSubmittedSuccess(false); }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isSignup
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setSubmittedSuccess(false); }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isSignup
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">

          {/* FORGOT PASSWORD NOTIFICATION */}
          {forgotPasswordMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center gap-2.5">
              <EnvelopeSimple size={18} className="text-primary shrink-0" />
              <span>Password reset link sent to your email inbox!</span>
            </div>
          )}

          {/* ERROR NOTIFICATION */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
              <X size={18} className="text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUCCESS STATE */}
          {submittedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto shadow-md">
                <Check size={28} weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {isSignup ? 'Account Created Successfully!' : 'Welcome Back!'}
              </h3>
              <p className="text-xs text-slate-500">
                Logging you in now...
              </p>
            </div>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* SIGNUP FULL NAME */}
              {isSignup && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL ADDRESS */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* SIGNUP PHONE NUMBER */}
              {isSignup && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsRegionOpen(!isRegionOpen)}
                        className="flex items-center gap-1 pl-3 pr-2 py-2.5 border-r border-slate-200 text-xs font-bold text-slate-700 bg-transparent cursor-pointer"
                      >
                        <span>{selectedRegion.flag}</span>
                        <span>{selectedRegion.dial}</span>
                        <CaretDown size={10} className="text-slate-400" />
                      </button>

                      {isRegionOpen && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
                          {REGIONS.map((reg) => (
                            <button
                              key={reg.code}
                              type="button"
                              onClick={() => {
                                setSelectedRegion(reg);
                                setIsRegionOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span>{reg.flag} {reg.code} ({reg.dial})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-r-xl rounded-l-none border border-l-0 border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-primary font-bold hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* CHECKBOX */}
              <div className="flex items-center text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <span className="text-[11px] font-medium text-slate-600">
                    {isSignup
                      ? 'I agree to the Terms of Service & Privacy Policy'
                      : 'Remember me on this device'}
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-grad-primary-cta py-3 px-4 text-foreground font-extrabold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin border-2 border-foreground border-t-transparent rounded-full h-4 w-4" />
                ) : (
                  <>
                    <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight size={16} weight="bold" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* FOOTER DISCLAIMER */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-400">
              By continuing, you agree to Maidslife&apos;s{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-semibold">
                Terms
              </a>{' '}
              &amp;{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-semibold">
                Privacy Policy
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

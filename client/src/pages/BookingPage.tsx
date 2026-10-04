import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CalendarBlank,
  Clock,
  User,
  ShieldCheck,
  Tag,
  CreditCard,
  Lock,
  Sparkle,
  House,
  Buildings,
  CheckCircle,
  Info,
  Plus,
  Drop,
} from '@phosphor-icons/react';
import { ServiceCategory, ServiceItem, ServiceVariant, ServiceAddon } from '../data/servicesData';
import { clientApi } from '../services/api';

const M = "'Manrope', sans-serif";

interface BookingPageProps {
  onBackToHome?: () => void;
  initialServiceId?: string;
  initialVariantId?: string;
  initialAddonIds?: string[];
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onBackToHome,
  initialServiceId = 'home-cleaning',
  initialVariantId,
  initialAddonIds = [],
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // DYNAMIC DATA STATES
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Selected Variants state
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(initialVariantId ? [initialVariantId] : []);

  // Selected Add-ons state
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(initialAddonIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [cleanersList, setCleanersList] = useState<any[]>([{ id: 'auto', name: 'Auto Assign', rating: '★ 4.9', desc: "We'll assign the best professional" }]);

  // SERVICE DETAILS DYNAMIC STATES (From MaidsLife UI)
  const [hours, setHours] = useState<number>(2);
  const [professionalsCount, setProfessionalsCount] = useState<number>(1);
  const [needCleaningMaterials, setNeedCleaningMaterials] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // FETCH DYNAMIC CATEGORIES & SERVICES FROM BACKEND
  useEffect(() => {
    let isMounted = true;
    clientApi.getCategories().then((cats) => {
      if (isMounted && cats.length > 0) setCategories(cats);
    });

    clientApi.getServices().then((svcs) => {
      if (isMounted) {
        setAllServices(svcs);
        if (svcs.length > 0) {
          let match = svcs.find((s) => s.id === initialServiceId || s.slug === initialServiceId);
          if (!match) match = svcs[0];

          setSelectedService(match);
          setSelectedCategory(match.categoryId);
          if (match.variants && match.variants.length > 0) {
            let vMatch = match.variants.find(v => v.id === initialVariantId);
            if (vMatch) setSelectedVariantIds([vMatch.id]);
            else setSelectedVariantIds([match.variants[0].id]);
          } else {
            setSelectedVariantIds([]);
          }
        }
        setIsLoading(false);
      }
    });

    // Fetch dynamic cleaners based on default date will be handled in a separate effect
    return () => {
      isMounted = false;
    };
  }, [initialServiceId]);

  // Filter available services based on chosen category
  const availableServices = allServices.filter((s) => s.categoryId === selectedCategory);

  // When selected category changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const servicesForCat = allServices.filter((s) => s.categoryId === catId);
    if (servicesForCat.length > 0) {
      const s = servicesForCat[0];
      setSelectedService(s);
      if (s.variants && s.variants.length > 0) {
        setSelectedVariantIds([s.variants[0].id]);
      }
      setSelectedAddonIds([]);
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const s = allServices.find((item) => item.id === serviceId);
    if (s) {
      setSelectedService(s);
      if (s.variants && s.variants.length > 0) {
        setSelectedVariantIds([s.variants[0].id]);
      } else {
        setSelectedVariantIds([]);
      }
      setSelectedAddonIds([]);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  // STEP 2 STATE: Date, Time & Professional
  const [frequency, setFrequency] = useState<'One Time' | 'Weekly' | 'Bi-Weekly'>('One Time');
  const [selectedCleaner, setSelectedCleaner] = useState('Auto Assign');

  // Generate dynamic next 8 days
  const generateNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = d.getDate().toString();
      const isoDate = d.toISOString().split('T')[0];
      days.push({ day: dayName, date: dateNum, full: `${dayName} ${dateNum}`, isoDate });
    }
    return days;
  };
  const daysList = generateNextDays();

  const [selectedDate, setSelectedDate] = useState(daysList[0].full);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('08:30-09:00');

  // Dynamic Cleaner Availability
  useEffect(() => {
    const fetchAvailable = async () => {
      const targetDate = daysList.find((d) => d.full === selectedDate)?.isoDate;
      if (!targetDate) return;
      
      const clns = await clientApi.getAvailableCleaners({ date: targetDate });
      setCleanersList([
        { id: 'auto', name: 'Auto Assign', rating: '★ 4.9', desc: "We'll assign the best professional", busySlots: [] },
        ...clns,
      ]);
    };
    fetchAvailable();
  }, [selectedDate]);

  const timeSlots = [
    '08:00-08:30',
    '08:30-09:00',
    '09:00-09:30',
    '09:30-10:00',
    '10:00-10:30',
    '11:00-11:30',
    '14:00-14:30',
    '16:00-16:30',
  ];

  // STEP 3 STATE: Checkout & Payment
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent?: number; flatAmount?: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ziina' | 'applepay' | 'cash'>('ziina');
  
  const [checkoutCoupon, setCheckoutCoupon] = useState<{ code: string; discountType: string; discountValue: number } | null>(null);

  useEffect(() => {
    clientApi.getCheckoutCoupon().then(setCheckoutCoupon);
    clientApi.getCurrentUser().then((u) => {
      if (u) {
        if (u.name) setCustomerName(u.name);
        if (u.email) setCustomerEmail(u.email);
        if (u.phone) setCustomerPhone(u.phone);
      }
    });
  }, []);

  // PRICE CALCULATIONS
  const variantsPrice = selectedService?.variants
    ? selectedService.variants
      .filter((v) => selectedVariantIds.includes(v.id || (v as any)._id))
      .reduce((sum, v) => sum + (v.price || 0), 0)
    : 0;

  const addonsPrice = selectedService?.addons
    ? selectedService.addons
      .filter((a) => selectedAddonIds.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0)
    : 0;

  const baseServicePrice = (selectedService?.startingPrice || 0) * hours;
  
  const extraProPrice = selectedService?.extraProfessionalPrice
    ? (professionalsCount - 1) * selectedService.extraProfessionalPrice * hours
    : (baseServicePrice + addonsPrice) * (professionalsCount - 1);
    
  const basePrice = baseServicePrice + addonsPrice + extraProPrice + variantsPrice;
  const discountAmount = appliedCoupon
    ? (appliedCoupon.discountPercent
      ? (basePrice * appliedCoupon.discountPercent) / 100
      : Math.min(basePrice, appliedCoupon.flatAmount || 0))
    : 0;
  const totalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = async () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    
    if (!customerEmail.trim()) {
      setCouponError('Please enter your email above first to apply a promo code.');
      return;
    }

    const res = await clientApi.validateCoupon(code, basePrice, customerEmail.trim());
    if (res.valid) {
      setAppliedCoupon({
        code,
        discountPercent: res.discountPercent,
        flatAmount: res.discountPercent ? undefined : res.discountAmount
      });
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code, or minimum order not met.');
      setAppliedCoupon(null);
    }
  };

  const handlePayAndConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedVariant = selectedService?.variants?.find((v) => selectedVariantIds.includes(v.id || (v as any)._id));

    const bookingPayload = {
      service: selectedService?.id,
      variantId: selectedVariantIds[0] || null,
      variantName: selectedVariant?.name || '',
      addons: selectedAddonIds,
      category: selectedCategory,
      customerName,
      customerPhone,
      customerEmail,
      addressDetails,
      selectedDate: daysList.find(d => d.full === selectedDate)?.isoDate || new Date().toISOString().split('T')[0],
      selectedTimeSlot,
      totalPrice,
      discountAmount,
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      needCleaningMaterials,
      specialInstructions,
    };

    try {
      const res = await clientApi.createBooking(bookingPayload);
      
      const bookingId = res.booking?.id || res.booking?._id || res.data?.id || res.data?._id;

      if (!bookingId) {
        setIsSubmitting(false);
        alert(res.message || 'Failed to create booking. Please try again.');
        return;
      }

      if (paymentMethod === 'ziina') {
        try {
          const paymentRes = await clientApi.createPayment(bookingId);
          if (paymentRes.checkoutUrl) {
            window.location.href = paymentRes.checkoutUrl;
            return;
          } else {
            setIsSubmitting(false);
            alert('Failed to initialize payment gateway.');
          }
        } catch (paymentErr) {
          setIsSubmitting(false);
          alert('Error connecting to payment provider. Please try again later.');
          console.error(paymentErr);
        }
      } else {
        setIsSubmitting(false);
        setConfirmedBookingRef(res.booking?.bookingNumber || bookingId || 'ML-' + Math.floor(10000 + Math.random() * 90000));
        setStep(4);
      }
    } catch (err) {
      setIsSubmitting(false);
      alert('An error occurred while confirming the booking. Please check your network and try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084FF]"></div>
      </div>
    );
  }

  if (allServices.length === 0 || categories.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-[#0C3352]">No Services Available</h2>
        <p className="text-slate-500 mt-2">Please add categories and services in the admin panel.</p>
        <button onClick={onBackToHome} className="mt-6 px-6 py-2 bg-[#0084FF] text-white rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-[120px] pb-24 px-4 sm:px-8">
      <div className="mx-auto max-w-[1200px]">

        {/* ── TOP STEP NAVIGATION BAR ── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={() => {
              if (step > 1 && step < 4) setStep((step - 1) as any);
              else onBackToHome?.();
            }}
            className="inline-flex items-center gap-2 text-[#0C3352] hover:text-[#0084FF] font-extrabold text-sm transition-colors cursor-pointer"
            style={{ fontFamily: M }}
          >
            <ArrowLeft size={18} weight="bold" />
            {step === 4 ? 'Back to Home' : `Step ${step} of 3`}
          </button>

          {step < 4 && (
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-[#0084FF]' : s < step ? 'w-2.5 bg-[#0084FF]/60' : 'w-2.5 bg-slate-300'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── STEP HEADINGS ── */}
        {step === 1 && (
          <div>
            <h1 className="text-[#0C3352] text-3xl font-extrabold" style={{ fontFamily: M }}>
              Category &amp; Service Selection
            </h1>
            <p className="text-[#5A6E7F] text-xs mt-1" style={{ fontFamily: M }}>
              Select category → service → variant option → custom add-ons
            </p>
          </div>
        )}
        {step === 2 && (
          <h1 className="text-[#0C3352] text-3xl font-extrabold" style={{ fontFamily: M }}>
            Date &amp; Time Schedule
          </h1>
        )}
        {step === 3 && (
          <h1 className="text-[#0C3352] text-3xl font-extrabold" style={{ fontFamily: M }}>
            Checkout &amp; Payment
          </h1>
        )}

        {/* ── 2-COLUMN LAYOUT (FOR STEPS 1, 2, 3) ── */}
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

            {/* ── LEFT MAIN SELECTION CONTAINER (7 COLS) ── */}
            <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#DCEBF8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">

              {/* ── STEP 1: HIERARCHY (CATEGORY -> SERVICE -> VARIANT -> ADDONS) ── */}
              {step === 1 && (
                <div className="space-y-6">

                  {/* 1. CATEGORY SELECTOR TABS */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0084FF] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      1. Select Category *
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`shrink-0 w-24 rounded-[14px] border-2 transition-all flex flex-col items-center cursor-pointer p-1 snap-start ${
                              isSelected
                                ? 'border-[#00D1FF] bg-white shadow-sm'
                                : 'border-transparent bg-white hover:bg-slate-50'
                              }`}
                            style={{ fontFamily: M }}
                          >
                            <div className="w-full h-16 bg-[#E8F6FA] rounded-xl overflow-hidden flex items-center justify-center mb-1.5">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply" />
                              ) : (
                                <div className="w-full h-full bg-[#E8F6FA]" />
                              )}
                            </div>
                            <div className={`w-full text-center text-[12px] font-bold leading-tight px-0.5 ${isSelected ? 'text-[#00D1FF]' : 'text-slate-600'}`}>
                              {cat.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. SERVICE SELECTOR DROPDOWN / CARDS */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0084FF] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                      2. Select Service *
                    </label>
                    <div className="flex flex-col gap-4">
                      {availableServices.map((s) => {
                        const isSelected = selectedService?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleServiceChange(s.id)}
                            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${isSelected
                                ? 'bg-[#F2FBFF] border-[#00D1FF] shadow-sm ring-1 ring-[#00D1FF]'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                              }`}
                          >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
                              {s.image ? (
                                <img src={s.image} alt={s.name} className="w-full h-full object-cover mix-blend-multiply" />
                              ) : (
                                <span className="text-slate-300 text-xs font-bold">No image</span>
                              )}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between h-full min-h-[5rem] sm:min-h-[6rem]">
                              <div>
                                <h3 className="font-extrabold text-[#0C3352] text-sm sm:text-[17px] leading-tight mb-1" style={{ fontFamily: M }}>
                                  {s.name}
                                </h3>
                                <p className="text-[#5A6E7F] text-[11px] sm:text-[13px] leading-snug line-clamp-2" style={{ fontFamily: M }}>
                                  {s.tagline || s.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-normal text-slate-500 line-through text-xs" style={{ fontFamily: M }}>
                                    {s.startingPrice > 0 ? `AED ${s.startingPrice + 30}` : ''}
                                  </span>
                                  <span className="font-extrabold text-[#0C3352] text-[15px]" style={{ fontFamily: M }}>
                                    AED {s.startingPrice}
                                  </span>
                                </div>
                                <div className={`px-5 py-1.5 rounded-full text-[13px] font-extrabold transition-all shadow-sm ${
                                  isSelected 
                                    ? 'bg-[#0C3352] text-white' 
                                    : 'bg-[#00D1FF] text-white hover:brightness-110'
                                }`} style={{ fontFamily: M }}>
                                  {isSelected ? 'Selected' : 'Add +'}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2.5 VARIANT SELECTOR */}
                  {(selectedService?.variants?.length || 0) > 0 && (
                    <div>
                      <label className="block text-xs font-extrabold text-[#0084FF] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                        Select Service Option / Variant *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService?.variants?.filter(v => v.isActive !== false).map((v) => {
                          const vId = v.id || (v as any)._id;
                          const isSelected = selectedVariantIds.includes(vId);
                          return (
                            <button
                              key={vId}
                              type="button"
                              onClick={() => setSelectedVariantIds([vId])}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-start gap-1 ${isSelected
                                  ? 'bg-[#E8F3FF] border-[#0084FF] shadow-xs ring-1 ring-[#0084FF]'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                {v.image && (
                                  <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                )}
                                <div>
                                  <span className="font-extrabold text-xs text-[#0C3352] w-full break-words" style={{ fontFamily: M }}>
                                    {v.name}
                                  </span>
                                  {v.price > 0 && (
                                    <span className="text-[11px] font-bold text-[#0084FF] block mt-0.5" style={{ fontFamily: M }}>
                                      +AED {v.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. CONFIGURATION (HOURS, PROFESSIONALS, MATERIALS) */}
                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    
                    {/* Hours Counter */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                          Duration
                        </label>
                        <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>How many hours per professional?</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setHours(Math.max(1, hours - 1))}
                          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[18px] font-extrabold text-[#0C3352] w-4 text-center" style={{ fontFamily: M }}>{hours}</span>
                        <button 
                          onClick={() => setHours(Math.min(8, hours + 1))}
                          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-[#00D1FF] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Professionals Counter */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                          Professionals
                        </label>
                        <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>How many professionals do you need?</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setProfessionalsCount(Math.max(1, professionalsCount - 1))}
                          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[18px] font-extrabold text-[#0C3352] w-4 text-center" style={{ fontFamily: M }}>{professionalsCount}</span>
                        <button 
                          onClick={() => setProfessionalsCount(Math.min(4, professionalsCount + 1))}
                          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-[#00D1FF] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Materials Toggle */}
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                          Cleaning Materials
                        </label>
                        <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>Do you need us to bring materials? (+AED 10/hr)</p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                        <button 
                          onClick={() => setNeedCleaningMaterials(false)}
                          className={`px-5 py-1.5 rounded-full text-[13px] font-extrabold transition-all cursor-pointer ${!needCleaningMaterials ? 'bg-white shadow-sm text-[#0C3352]' : 'text-slate-500'}`}
                          style={{ fontFamily: M }}
                        >
                          No
                        </button>
                        <button 
                          onClick={() => setNeedCleaningMaterials(true)}
                          className={`px-5 py-1.5 rounded-full text-[13px] font-extrabold transition-all cursor-pointer ${needCleaningMaterials ? 'bg-[#00D1FF] shadow-sm text-white' : 'text-slate-500'}`}
                          style={{ fontFamily: M }}
                        >
                          Yes
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* 4. ADD-ONS SELECTOR */}
                  {(selectedService?.addons.length || 0) > 0 && (
                    <div>
                      <label className="block text-xs font-extrabold text-[#0084FF] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
                        4. Select Optional Add-ons
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedService?.addons.map((addon) => {
                          const isChecked = selectedAddonIds.includes(addon.id);
                          return (
                            <div
                              key={addon.id}
                              onClick={() => toggleAddon(addon.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${isChecked
                                  ? 'border-[#0084FF] bg-[#E8F3FF] font-bold text-[#0066CC]'
                                  : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300'
                                }`}
                              style={{ fontFamily: M }}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${isChecked ? 'bg-[#0084FF] border-[#0084FF]' : 'border-slate-300 bg-white'}`}>
                                  {isChecked && <Check size={10} weight="bold" className="text-white" />}
                                </div>
                                {addon.image && (
                                  <img src={addon.image} alt={addon.name} className="w-8 h-8 rounded-md object-cover shrink-0 bg-slate-100" />
                                )}
                                <span className="break-words line-clamp-2 leading-tight">{addon.name}</span>
                              </div>
                              <span className="font-extrabold shrink-0 pl-2">+AED {addon.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* NEXT BUTTON */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full rounded-full bg-grad-primary-cta py-4 px-2 flex items-center justify-center gap-1.5 text-[#0C3352] font-extrabold text-[13px] sm:text-base shadow-md hover:brightness-105 transition-all cursor-pointer"
                    style={{ fontFamily: M }}
                  >
                    <span>Next: Schedule Date &amp; Time</span>
                    <span>→</span>
                  </button>

                </div>
              )}

              {/* ── STEP 2: DATE & TIME & PROFESSIONAL ── */}
              {step === 2 && (
                <div className="space-y-6">

                  <div>
                    <h3 className="text-[#0C3352] text-sm font-extrabold mb-3" style={{ fontFamily: M }}>
                      Which professional do you prefer?
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x pt-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                      {cleanersList.map((cl) => {
                        const isSelected = selectedCleaner === cl.name;
                        return (
                          <div
                            key={cl.id}
                            onClick={() => setSelectedCleaner(cl.name)}
                            className={`snap-start shrink-0 cursor-pointer rounded-2xl border p-4 text-center flex flex-col items-center transition-all w-32 ${isSelected
                                ? 'border-[#0084FF] bg-[#E8F3FF] shadow-md ring-2 ring-[#0084FF] ring-offset-1'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                              }`}
                          >
                            <img
                              src={cl.image || cl.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cl.name)}&background=random&color=fff&size=128`}
                              alt={cl.name}
                              className={`w-16 h-16 rounded-full object-cover mb-3 shadow-sm ${isSelected ? 'ring-2 ring-[#0084FF]' : 'ring-1 ring-slate-200'}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cl.name)}&background=random&color=fff&size=128`;
                              }}
                            />
                            <h4 className={`font-bold text-xs ${isSelected ? 'text-[#0084FF]' : 'text-slate-700'}`} style={{ fontFamily: M }}>
                              {cl.name}
                            </h4>
                            {cl.rating && (
                              <p className="text-[10px] text-amber-500 font-bold mt-1" style={{ fontFamily: M }}>
                                {cl.rating}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#0C3352] text-sm font-extrabold mb-3" style={{ fontFamily: M }}>
                      When would you like your service?
                    </h3>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                      {daysList.map((d, idx) => {
                        const dateStr = d.full;
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDate(dateStr)}
                            className={`flex flex-col items-center justify-center h-16 w-14 shrink-0 rounded-full border transition-all cursor-pointer ${isSelected
                                ? 'bg-[#0084FF] border-[#0084FF] text-white shadow-md'
                                : 'bg-white border-slate-200 text-[#0C3352] hover:border-slate-300'
                              }`}
                          >
                            <span className="text-[10px] uppercase font-bold" style={{ fontFamily: M }}>{d.day}</span>
                            <span className="text-base font-extrabold mt-0.5" style={{ fontFamily: M }}>{d.date}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#0C3352] text-sm font-extrabold mb-3" style={{ fontFamily: M }}>
                      What time would you like us to start?
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot, idx) => {
                        let isBusy = false;
                        if (selectedCleaner === 'Auto Assign') {
                          const actualCleaners = cleanersList.filter((c: any) => c.id !== 'auto');
                          if (actualCleaners.length > 0) {
                            isBusy = actualCleaners.every((c: any) => c.busySlots?.includes(slot));
                          }
                        } else {
                          const cl = cleanersList.find((c: any) => c.name === selectedCleaner);
                          if (cl) {
                            isBusy = cl.busySlots?.includes(slot);
                          }
                        }

                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isBusy}
                            onClick={() => !isBusy && setSelectedTimeSlot(slot)}
                            className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all ${
                              isBusy 
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                                : isSelected
                                  ? 'border-[#0084FF] bg-[#E8F3FF] text-[#0084FF] cursor-pointer'
                                  : 'border-slate-200 bg-white text-[#0C3352] hover:border-slate-300 cursor-pointer'
                              }`}
                            style={{ fontFamily: M }}
                          >
                            {slot}
                            {isBusy && <span className="block text-[9px] text-rose-500 font-extrabold mt-0.5">Fully Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full rounded-full bg-grad-primary-cta py-4 px-2 flex items-center justify-center gap-1.5 text-[#0C3352] font-extrabold text-[13px] sm:text-base shadow-md hover:brightness-105 transition-all cursor-pointer"
                    style={{ fontFamily: M }}
                  >
                    <span>Next: Address &amp; Payment</span>
                    <span>→</span>
                  </button>

                </div>
              )}

              {/* ── STEP 3: CHECKOUT & PAYMENT ── */}
              {step === 3 && (
                <form onSubmit={handlePayAndConfirm} className="space-y-6">

                  <div className="space-y-4">
                    <h3 className="text-[#0C3352] text-base font-extrabold border-b border-slate-100 pb-2" style={{ fontFamily: M }}>
                      1. Contact &amp; Address Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarah Ahmed"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white"
                          style={{ fontFamily: M }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. sarah@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white"
                          style={{ fontFamily: M }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+971 50 123 4567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white"
                          style={{ fontFamily: M }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>Dubai Location / Building / Apartment *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apartment 1402, Business Bay Tower, Business Bay, Dubai"
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white"
                        style={{ fontFamily: M }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="needCleaningMaterials"
                        checked={needCleaningMaterials}
                        onChange={(e) => setNeedCleaningMaterials(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-[#0084FF] focus:ring-[#0084FF] cursor-pointer"
                      />
                      <label htmlFor="needCleaningMaterials" className="text-sm font-bold text-[#0C3352] cursor-pointer" style={{ fontFamily: M }}>
                        I need cleaning materials
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>Any special instructions?</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Please call when you arrive, watch out for the cat..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white resize-none"
                        style={{ fontFamily: M }}
                      />
                    </div>
                  </div>

                  {/* PROMO CODE */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-[#0C3352] text-base font-extrabold border-b border-slate-100 pb-2 flex items-center justify-between" style={{ fontFamily: M }}>
                      <span>2. Promo Code / Coupon</span>
                    </h3>
                    
                    {checkoutCoupon && !appliedCoupon && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
                        <Tag className="text-emerald-500 shrink-0 mt-0.5" size={16} weight="bold" />
                        <div>
                          <p className="text-xs text-emerald-800" style={{ fontFamily: M }}>
                            First time customer? Use code <strong className="font-extrabold">{checkoutCoupon.code}</strong> for {checkoutCoupon.discountType === 'percent' ? `${checkoutCoupon.discountValue}%` : `AED ${checkoutCoupon.discountValue}`} off your booking!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {couponError && (
                      <div className="text-red-500 text-xs font-bold" style={{ fontFamily: M }}>{couponError}</div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Try MAIDSLIFE20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] uppercase font-bold outline-none focus:border-[#0084FF] focus:bg-white"
                        style={{ fontFamily: M }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-6 py-3 rounded-xl bg-[#0C3352] text-white font-bold text-xs hover:bg-[#0084FF] transition-colors cursor-pointer"
                        style={{ fontFamily: M }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div className="space-y-3 pt-4">
                    <h3 className="text-[#0C3352] text-base font-extrabold border-b border-slate-100 pb-2 flex items-center justify-between" style={{ fontFamily: M }}>
                      <span>3. Payment Method</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ziina')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer font-bold text-sm ${paymentMethod === 'ziina' ? 'border-[#0084FF] bg-[#E8F3FF] text-[#0084FF]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        style={{ fontFamily: M }}
                      >
                        <CreditCard size={24} weight={paymentMethod === 'ziina' ? 'fill' : 'regular'} />
                        Pay by Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer font-bold text-sm ${paymentMethod === 'cash' ? 'border-[#0084FF] bg-[#E8F3FF] text-[#0084FF]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        style={{ fontFamily: M }}
                      >
                        <House size={24} weight={paymentMethod === 'cash' ? 'fill' : 'regular'} />
                        Cash on Delivery
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-grad-primary-cta py-4 px-2 flex items-center justify-center gap-1.5 text-[#0C3352] font-extrabold text-[13px] sm:text-base shadow-md hover:brightness-105 transition-all cursor-pointer"
                    style={{ fontFamily: M }}
                  >
                    <span>Pay AED {totalPrice.toFixed(2)} &amp; Confirm</span>
                    <span>→</span>
                  </button>

                </form>
              )}

            </div>

            {/* ── RIGHT HIERARCHY SUMMARY SIDEBAR (5 COLS) ── */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-[24px] border border-[#DCEBF8] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-[#0C3352] font-extrabold text-lg border-b border-slate-100 pb-3" style={{ fontFamily: M }}>
                  Booking Summary
                </h3>

                <div className="space-y-3 text-xs" style={{ fontFamily: M }}>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Category</span>
                    <span className="font-bold text-[#0084FF]">
                      {categories.find((c) => c.id === selectedCategory)?.name || 'Residential Cleaning'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-500">
                    <span>Service</span>
                    <span className="font-bold text-[#0C3352]">{selectedService?.name}</span>
                  </div>

                  <div className="flex justify-between items-start text-slate-500">
                    <span>Duration (Hours)</span>
                    <span className="font-bold text-[#0C3352]">{hours} Hour(s)</span>
                  </div>

                  <div className="flex justify-between items-start text-slate-500">
                    <span>Number of Professionals</span>
                    <span className="font-bold text-[#0C3352]">{professionalsCount}</span>
                  </div>

                  {selectedAddonIds.length > 0 && selectedService?.addons && (
                    <div className="flex justify-between items-start text-slate-500">
                      <span>Add-ons ({selectedAddonIds.length})</span>
                      <div className="text-right">
                        {selectedService?.addons
                          .filter((a) => selectedAddonIds.includes(a.id))
                          .map((a) => (
                            <span key={a.id} className="block font-bold text-[#0C3352]">
                              + {a.name} (AED {a.price})
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-500">
                    <span>Date &amp; Time</span>
                    <span className="font-bold text-[#0C3352]">{selectedDate}, {selectedTimeSlot}</span>
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs" style={{ fontFamily: M }}>
                  <div className="flex justify-between text-slate-500">
                    <span>Base Subtotal</span>
                    <span>AED {basePrice.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-AED {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[#0C3352]">
                    <span className="font-bold text-sm">Total Amount</span>
                    <span className="font-extrabold text-2xl text-[#0084FF]">
                      AED {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ── STEP 4: CONFIRMATION ── */
          <div className="max-w-[640px] mx-auto bg-white rounded-[28px] border border-[#DCEBF8] p-8 sm:p-12 shadow-xl text-center space-y-6 mt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle size={48} weight="fill" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0084FF]" style={{ fontFamily: M }}>
                BOOKING CONFIRMED!
              </span>
              <h2 className="mt-2 text-[#0C3352] text-3xl font-extrabold" style={{ fontFamily: M }}>
                Thank You for Choosing Maidslife!
              </h2>
              <p className="mt-2 text-[#5A6E7F] text-sm" style={{ fontFamily: M }}>
                Your booking reference number is <span className="font-extrabold text-[#0C3352]">#{confirmedBookingRef}</span>. We have sent a confirmation email &amp; SMS.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-left space-y-2 text-xs" style={{ fontFamily: M }}>
              <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="font-bold text-[#0C3352]">{categories.find((c) => c.id === selectedCategory)?.name || 'Residential Cleaning'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Service:</span><span className="font-bold text-[#0C3352]">{selectedService?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration:</span><span className="font-bold text-[#0C3352]">{hours} Hour(s)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Professionals:</span><span className="font-bold text-[#0C3352]">{professionalsCount}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date &amp; Time:</span><span className="font-bold text-[#0C3352]">{selectedDate}, 2026 at {selectedTimeSlot}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Paid:</span><span className="font-bold text-emerald-600 text-sm">AED {totalPrice.toFixed(2)}</span></div>
            </div>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 rounded-full bg-[#0C3352] text-white px-8 py-3.5 font-bold text-sm hover:bg-[#0084FF] transition-colors cursor-pointer"
              style={{ fontFamily: M }}
            >
              Return to Homepage
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;

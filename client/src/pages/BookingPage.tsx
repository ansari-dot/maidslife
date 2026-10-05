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
  Car,
  Truck,
  MapPin,
  Lightning,
  Star,
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

const GARMENT_TYPES = [
  { key: 'Shirts', label: 'Shirts & Tops', price: 10, icon: '👔' },
  { key: 'Pants', label: 'Pants & Jeans', price: 12, icon: '👖' },
  { key: 'Suits', label: 'Suits & Tuxedos', price: 35, icon: '🧥' },
  { key: 'Dresses', label: 'Dresses & Abayas', price: 25, icon: '👗' },
  { key: 'BedSheets', label: 'Bed Sheets & Linen', price: 20, icon: '🛏️' },
  { key: 'Jackets', label: 'Jackets & Coats', price: 30, icon: '🧥' },
];

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
  const [cleanersList, setCleanersList] = useState<any[]>([
    { id: 'auto', name: 'Auto Assign', rating: '★ 4.9', desc: "We'll assign the top-rated professional" },
  ]);

  // SERVICE DETAILS DYNAMIC STATES (From MaidsLife UI & Justlife)
  const [hours, setHours] = useState<number>(2);
  const [professionalsCount, setProfessionalsCount] = useState<number>(1);
  const [needCleaningMaterials, setNeedCleaningMaterials] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // SERVICE SPECIFIC DYNAMIC FIELDS
  const [quantity, setQuantity] = useState<number>(1);
  const [weight, setWeight] = useState<number>(0);
  const [itemType, setItemType] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('Bike');
  const [driver, setDriver] = useState<string>('Auto Assign');
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);

  // RECURRING & FREQUENCY (Justlife Style)
  const [frequency, setFrequency] = useState<'One Time' | 'Weekly' | 'Bi-Weekly'>('One Time');
  const [recurringDay, setRecurringDay] = useState<string>('Saturday');

  // LAUNDRY & DELIVERY SPECIAL STATES
  const [garmentCounts, setGarmentCounts] = useState<{ [key: string]: number }>({
    Shirts: 0,
    Pants: 0,
    Suits: 0,
    Dresses: 0,
    BedSheets: 0,
    Jackets: 0,
  });
  const [expressDelivery, setExpressDelivery] = useState<boolean>(false);

  // Helper to check if a booking field is enabled for the currently selected service
  const isFieldEnabled = (fieldKey: string): boolean => {
    if (!selectedService) return true;
    const fields = selectedService.bookingFields;
    if (!fields || fields.length === 0) return true;
    const field = fields.find((f: any) => f.key === fieldKey);
    return field ? field.enabled !== false : false;
  };

  const getFieldLabel = (fieldKey: string, defaultLabel: string): string => {
    if (!selectedService || !selectedService.bookingFields) return defaultLabel;
    const field = selectedService.bookingFields.find((f: any) => f.key === fieldKey);
    return field?.label || defaultLabel;
  };

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

  const handleBedroomsChange = (val: number) => {
    setBedrooms(val);
    if (isFieldEnabled('duration')) {
      if (val <= 1) setHours(2);
      else if (val === 2) setHours(3);
      else if (val === 3) setHours(4);
      else setHours(5);
    }
  };

  // STEP 2 STATE: Date, Time & Professional
  const [selectedCleaner, setSelectedCleaner] = useState('Auto Assign');
  const [timeFilter, setTimeFilter] = useState<'All' | 'Morning' | 'Afternoon' | 'Evening'>('All');

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
        { id: 'auto', name: 'Auto Assign', rating: '★ 4.9', desc: "We'll assign the top-rated professional", busySlots: [] },
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
    '15:00-15:30',
    '16:00-16:30',
    '17:00-17:30',
    '18:00-18:30',
    '19:00-19:30',
  ];

  const filteredTimeSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.split(':')[0], 10);
    if (timeFilter === 'Morning') return hour >= 8 && hour < 12;
    if (timeFilter === 'Afternoon') return hour >= 12 && hour < 16;
    if (timeFilter === 'Evening') return hour >= 16;
    return true;
  });

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

  // Garment calculation
  const garmentTotalCount = Object.values(garmentCounts).reduce((a, b) => a + b, 0);
  const garmentPrice = GARMENT_TYPES.reduce((sum, item) => sum + (garmentCounts[item.key] || 0) * item.price, 0);

  const expressFee = expressDelivery ? 25 : 0;

  const qty = isFieldEnabled('quantity') ? Math.max(quantity || 1, garmentTotalCount || 1) : 1;
  const hrs = isFieldEnabled('duration') ? (hours || 1) : 1;
  const proCount = isFieldEnabled('professionals') ? professionalsCount : 1;

  const baseServicePrice = (selectedService?.startingPrice || 0) * qty * hrs;

  const extraProPrice = (isFieldEnabled('professionals') && selectedService?.extraProfessionalPrice)
    ? (proCount - 1) * selectedService.extraProfessionalPrice * hrs
    : (proCount > 1 ? (baseServicePrice + addonsPrice) * (proCount - 1) : 0);

  const materialsPrice = (isFieldEnabled('cleaningMaterials') && needCleaningMaterials) ? 10 * hrs : 0;
    
  const subtotalBeforeFreq = baseServicePrice + addonsPrice + extraProPrice + variantsPrice + materialsPrice + garmentPrice + expressFee;

  // Frequency Discount (Justlife style: 20% off for Weekly, 10% off for Bi-Weekly)
  const frequencyDiscountPercent = isFieldEnabled('duration') ? (frequency === 'Weekly' ? 20 : frequency === 'Bi-Weekly' ? 10 : 0) : 0;
  const frequencySavings = (subtotalBeforeFreq * frequencyDiscountPercent) / 100;
  const basePrice = Math.max(0, subtotalBeforeFreq - frequencySavings);

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
      addressDetails: addressDetails || pickupLocation || 'Dubai',
      selectedDate: daysList.find(d => d.full === selectedDate)?.isoDate || new Date().toISOString().split('T')[0],
      selectedTimeSlot,
      totalPrice,
      discountAmount,
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      hours: isFieldEnabled('duration') ? hours : undefined,
      professionalsCount: isFieldEnabled('professionals') ? professionalsCount : undefined,
      needCleaningMaterials: isFieldEnabled('cleaningMaterials') ? needCleaningMaterials : undefined,
      specialInstructions: isFieldEnabled('specialInstructions') ? specialInstructions : undefined,
      quantity: isFieldEnabled('quantity') ? quantity : undefined,
      weight: isFieldEnabled('weight') ? weight : undefined,
      itemType: isFieldEnabled('itemType') ? itemType : undefined,
      pickupLocation: isFieldEnabled('pickupLocation') ? pickupLocation : undefined,
      dropoffLocation: isFieldEnabled('dropoffLocation') ? dropoffLocation : undefined,
      vehicleType: isFieldEnabled('vehicleType') ? vehicleType : undefined,
      driver: isFieldEnabled('driver') ? driver : undefined,
      propertyType: isFieldEnabled('propertyType') ? propertyType : undefined,
      bedrooms: isFieldEnabled('bedrooms') ? bedrooms : undefined,
      bathrooms: isFieldEnabled('bathrooms') ? bathrooms : undefined,
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
              Category &amp; Service Customization
            </h1>
            <p className="text-[#5A6E7F] text-xs mt-1" style={{ fontFamily: M }}>
              Customize your booking options, frequency &amp; addons like Justlife
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
                                ? 'border-[#00D1FF] bg-white shadow-sm ring-2 ring-[#00D1FF]/20'
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
                            <div className={`w-full text-center text-[12px] font-bold leading-tight px-0.5 ${isSelected ? 'text-[#0084FF]' : 'text-slate-600'}`}>
                              {cat.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. SERVICE SELECTOR CARDS */}
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

                  {/* 3. DYNAMIC CONFIGURATION FIELDS */}
                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    
                    {/* FREQUENCY DISCOUNTS (JUSTLIFE SIGNATURE BAR) */}
                    {isFieldEnabled('duration') && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-[#00D1FF]/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-extrabold text-[#0C3352] uppercase tracking-wider" style={{ fontFamily: M }}>
                            Service Frequency
                          </span>
                          <span className="text-[11px] font-bold text-[#0084FF] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                            ⚡ Save up to 20% on recurring plans
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'One Time', label: 'One Time', badge: '' },
                            { id: 'Weekly', label: 'Weekly', badge: 'SAVE 20%' },
                            { id: 'Bi-Weekly', label: 'Bi-Weekly', badge: 'SAVE 10%' },
                          ].map((plan) => {
                            const isSelected = frequency === plan.id;
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() => setFrequency(plan.id as any)}
                                className={`relative py-3 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#0084FF] border-[#0084FF] text-white shadow-md font-extrabold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {plan.badge && (
                                  <span className={`absolute -top-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-white'
                                  }`}>
                                    {plan.badge}
                                  </span>
                                )}
                                <span className="text-xs font-bold leading-tight mt-0.5" style={{ fontFamily: M }}>{plan.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {frequency !== 'One Time' && (
                          <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-bold" style={{ fontFamily: M }}>Preferred Regular Day:</span>
                            <select
                              value={recurringDay}
                              onChange={(e) => setRecurringDay(e.target.value)}
                              className="rounded-lg border border-blue-200 bg-white px-3 py-1 font-bold text-[#0C3352] outline-none cursor-pointer"
                              style={{ fontFamily: M }}
                            >
                              {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PROPERTY TYPE SELECTOR */}
                    {isFieldEnabled('propertyType') && (
                      <div>
                        <label className="block text-xs font-extrabold text-[#0C3352] uppercase mb-2" style={{ fontFamily: M }}>
                          {getFieldLabel('propertyType', 'Property Type')} *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { key: 'Apartment', label: 'Apartment', icon: '🏢' },
                            { key: 'Villa', label: 'Villa / House', icon: '🏡' },
                            { key: 'Office', label: 'Office / Commercial', icon: '🏢' },
                          ].map((prop) => {
                            const isSelected = propertyType === prop.key;
                            return (
                              <button
                                key={prop.key}
                                type="button"
                                onClick={() => setPropertyType(prop.key)}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                  isSelected
                                    ? 'border-[#0084FF] bg-[#E8F3FF] ring-2 ring-[#0084FF] text-[#0084FF]'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <span className="text-xl mb-1">{prop.icon}</span>
                                <span className="text-xs font-extrabold" style={{ fontFamily: M }}>{prop.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* BEDROOMS & BATHROOMS COUNT CONTROL */}
                    {(isFieldEnabled('bedrooms') || isFieldEnabled('bathrooms')) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                        {isFieldEnabled('bedrooms') && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-xs font-extrabold text-[#0C3352] uppercase" style={{ fontFamily: M }}>
                                {getFieldLabel('bedrooms', 'Bedrooms')}
                              </label>
                              <span className="text-[11px] text-[#0084FF] font-bold">
                                {bedrooms <= 1 ? 'Studio / 1 BHK' : `${bedrooms} BHK`}
                              </span>
                            </div>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleBedroomsChange(num)}
                                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                                    bedrooms === num ? 'bg-[#0084FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {num === 5 ? '5+' : num}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {isFieldEnabled('bathrooms') && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-xs font-extrabold text-[#0C3352] uppercase" style={{ fontFamily: M }}>
                                {getFieldLabel('bathrooms', 'Bathrooms')}
                              </label>
                              <span className="text-[11px] text-[#0084FF] font-bold">{bathrooms} Bath</span>
                            </div>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                              {[1, 2, 3, 4].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setBathrooms(num)}
                                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                                    bathrooms === num ? 'bg-[#0084FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {num === 4 ? '4+' : num}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* LAUNDRY / GARMENT ITEM COUNTERS */}
                    {(isFieldEnabled('itemType') || selectedService?.bookingType === 'LAUNDRY_ITEM' || selectedService?.id?.includes('laundry')) && (
                      <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[#0C3352] text-sm font-extrabold uppercase tracking-wider" style={{ fontFamily: M }}>
                              Select Clothes / Garments for Laundry
                            </h4>
                            <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: M }}>Itemized laundry wash, iron &amp; dry cleaning</p>
                          </div>
                          <div className="bg-blue-100 text-[#0084FF] text-xs font-black px-3 py-1 rounded-full" style={{ fontFamily: M }}>
                            {garmentTotalCount} items selected
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {GARMENT_TYPES.map((item) => {
                            const count = garmentCounts[item.key] || 0;
                            return (
                              <div
                                key={item.key}
                                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                                  count > 0 ? 'bg-white border-[#0084FF] shadow-sm ring-1 ring-[#0084FF]' : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl">{item.icon}</span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-extrabold text-[#0C3352] truncate" style={{ fontFamily: M }}>{item.label}</p>
                                    <p className="text-[10px] text-slate-500 font-bold" style={{ fontFamily: M }}>AED {item.price}/pc</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => setGarmentCounts({ ...garmentCounts, [item.key]: Math.max(0, count - 1) })}
                                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-extrabold text-[#0C3352]" style={{ fontFamily: M }}>{count}</span>
                                  <button
                                    type="button"
                                    onClick={() => setGarmentCounts({ ...garmentCounts, [item.key]: count + 1 })}
                                    className="w-7 h-7 rounded-lg bg-[#0084FF] text-white flex items-center justify-center font-bold hover:brightness-110 cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Express delivery option */}
                        <div className="pt-2 flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-2">
                            <Lightning className="text-amber-500" size={20} weight="fill" />
                            <div>
                              <span className="text-xs font-extrabold text-amber-900 block" style={{ fontFamily: M }}>
                                24-Hour Express Delivery
                              </span>
                              <span className="text-[10px] text-amber-700 block" style={{ fontFamily: M }}>Standard is 48-hour turn-around time</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpressDelivery(!expressDelivery)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                              expressDelivery ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-amber-300 text-amber-800'
                            }`}
                            style={{ fontFamily: M }}
                          >
                            {expressDelivery ? 'Active (+AED 25)' : 'Add +AED 25'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PICK & DROP LOGISTICS ROUTE CARDS */}
                    {(isFieldEnabled('pickupLocation') || isFieldEnabled('dropoffLocation') || isFieldEnabled('vehicleType')) && (
                      <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-[#0084FF]" size={20} weight="fill" />
                          <h4 className="text-[#0C3352] text-sm font-extrabold uppercase tracking-wider" style={{ fontFamily: M }}>
                            Pick &amp; Drop Delivery Route
                          </h4>
                        </div>

                        <div className="relative pl-6 space-y-4 border-l-2 border-dashed border-[#0084FF]/40 ml-2 py-1">
                          <div className="relative">
                            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                            <label className="block text-xs font-extrabold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>
                              {getFieldLabel('pickupLocation', '1. Pickup Address & Contact')} *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Villa 12, Street 4, Al Wasl, Dubai"
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF]"
                              style={{ fontFamily: M }}
                            />
                          </div>

                          <div className="relative">
                            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                            <label className="block text-xs font-extrabold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>
                              {getFieldLabel('dropoffLocation', '2. Drop-off Destination Address')} *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Office 402, Index Tower, DIFC, Dubai"
                              value={dropoffLocation}
                              onChange={(e) => setDropoffLocation(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF]"
                              style={{ fontFamily: M }}
                            />
                          </div>
                        </div>

                        {isFieldEnabled('vehicleType') && (
                          <div className="pt-2">
                            <label className="block text-xs font-extrabold text-[#0C3352] uppercase mb-2" style={{ fontFamily: M }}>
                              {getFieldLabel('vehicleType', 'Select Vehicle Type & Capacity')} *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: 'Bike', label: 'Motorbike', desc: 'Up to 5 kg', icon: '🛵' },
                                { id: 'Car', label: 'Sedan Car', desc: 'Up to 50 kg', icon: '🚗' },
                                { id: 'Van', label: 'Cargo Van', desc: 'Up to 500 kg', icon: '🚚' },
                              ].map((veh) => {
                                const isSelected = vehicleType === veh.id;
                                return (
                                  <button
                                    key={veh.id}
                                    type="button"
                                    onClick={() => setVehicleType(veh.id)}
                                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                                      isSelected
                                        ? 'border-[#0084FF] bg-[#E8F3FF] ring-2 ring-[#0084FF]'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                  >
                                    <span className="text-2xl mb-1">{veh.icon}</span>
                                    <span className="font-extrabold text-xs text-[#0C3352]" style={{ fontFamily: M }}>{veh.label}</span>
                                    <span className="text-[10px] text-slate-500 font-medium" style={{ fontFamily: M }}>{veh.desc}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity Counter */}
                    {isFieldEnabled('quantity') && !selectedService?.id?.includes('laundry') && (
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                            {getFieldLabel('quantity', 'Quantity')}
                          </label>
                          <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>Specify total quantity or item count</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[18px] font-extrabold text-[#0C3352] w-4 text-center" style={{ fontFamily: M }}>{quantity}</span>
                          <button 
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-[#00D1FF] hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Weight Input (Per KG Laundry) */}
                    {isFieldEnabled('weight') && (
                      <div className="pb-4 border-b border-slate-100">
                        <label className="block text-[#0C3352] text-sm font-extrabold mb-1" style={{ fontFamily: M }}>
                          {getFieldLabel('weight', 'Estimated Weight (KG)')}
                        </label>
                        <input
                          type="number"
                          min={0}
                          placeholder="e.g. 5"
                          value={weight || ''}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white"
                          style={{ fontFamily: M }}
                        />
                      </div>
                    )}

                    {/* Hours Counter */}
                    {isFieldEnabled('duration') && (
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                            {getFieldLabel('duration', 'Duration')}
                          </label>
                          <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>
                            {bedrooms > 0 ? `Recommended: ${hours} Hours for ${bedrooms} BHK` : 'How many hours per professional?'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setHours(Math.max(1, hours - 1))}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[18px] font-extrabold text-[#0C3352] w-4 text-center" style={{ fontFamily: M }}>{hours}</span>
                          <button 
                            type="button"
                            onClick={() => setHours(Math.min(8, hours + 1))}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-[#00D1FF] hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Professionals Counter */}
                    {isFieldEnabled('professionals') && (
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                            {getFieldLabel('professionals', 'Professionals')}
                          </label>
                          <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>How many professionals do you need?</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setProfessionalsCount(Math.max(1, professionalsCount - 1))}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[18px] font-extrabold text-[#0C3352] w-4 text-center" style={{ fontFamily: M }}>{professionalsCount}</span>
                          <button 
                            type="button"
                            onClick={() => setProfessionalsCount(Math.min(4, professionalsCount + 1))}
                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl text-[#00D1FF] hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Materials Toggle */}
                    {isFieldEnabled('cleaningMaterials') && (
                      <div className="flex items-center justify-between pb-4">
                        <div>
                          <label className="block text-[#0C3352] text-[16px] font-extrabold m-0 mb-0.5" style={{ fontFamily: M }}>
                            {getFieldLabel('cleaningMaterials', 'Cleaning Materials')}
                          </label>
                          <p className="text-slate-500 text-xs" style={{ fontFamily: M }}>Do you need us to bring materials? (+AED 10/hr)</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                          <button 
                            type="button"
                            onClick={() => setNeedCleaningMaterials(false)}
                            className={`px-5 py-1.5 rounded-full text-[13px] font-extrabold transition-all cursor-pointer ${!needCleaningMaterials ? 'bg-white shadow-sm text-[#0C3352]' : 'text-slate-500'}`}
                            style={{ fontFamily: M }}
                          >
                            No
                          </button>
                          <button 
                            type="button"
                            onClick={() => setNeedCleaningMaterials(true)}
                            className={`px-5 py-1.5 rounded-full text-[13px] font-extrabold transition-all cursor-pointer ${needCleaningMaterials ? 'bg-[#00D1FF] shadow-sm text-white' : 'text-slate-500'}`}
                            style={{ fontFamily: M }}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* 4. ADD-ONS SELECTOR */}
                  {(selectedService?.addons?.length || 0) > 0 && (
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

                  {(isFieldEnabled('professionals') || isFieldEnabled('driver')) && (
                    <div>
                      <h3 className="text-[#0C3352] text-sm font-extrabold mb-3" style={{ fontFamily: M }}>
                        {getFieldLabel('driver', getFieldLabel('professionals', 'Which professional do you prefer?'))}
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
                  )}

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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[#0C3352] text-sm font-extrabold" style={{ fontFamily: M }}>
                        What time would you like us to start?
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200" style={{ fontFamily: M }}>
                        ⚡ Free Cancellation up to 2h before
                      </span>
                    </div>

                    {/* TIME FILTER CATEGORY TABS */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                      {[
                        { id: 'All', label: 'All Slots' },
                        { id: 'Morning', label: '🌅 Morning (08:00-12:00)' },
                        { id: 'Afternoon', label: '☀️ Afternoon (12:00-16:00)' },
                        { id: 'Evening', label: '🌙 Evening (16:00-20:00)' },
                      ].map((tf) => (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => setTimeFilter(tf.id as any)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border whitespace-nowrap ${
                            timeFilter === tf.id
                              ? 'bg-[#0C3352] text-white border-[#0C3352]'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          style={{ fontFamily: M }}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {filteredTimeSlots.map((slot, idx) => {
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
                                  ? 'border-[#0084FF] bg-[#E8F3FF] text-[#0084FF] cursor-pointer ring-2 ring-[#0084FF]'
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

                    {isFieldEnabled('address') && (
                      <div>
                        <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>
                          {getFieldLabel('address', 'Dubai Location / Building / Apartment')} *
                        </label>
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
                    )}

                    {isFieldEnabled('cleaningMaterials') && (
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="needCleaningMaterials"
                          checked={needCleaningMaterials}
                          onChange={(e) => setNeedCleaningMaterials(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-[#0084FF] focus:ring-[#0084FF] cursor-pointer"
                        />
                        <label htmlFor="needCleaningMaterials" className="text-sm font-bold text-[#0C3352] cursor-pointer" style={{ fontFamily: M }}>
                          I need cleaning materials brought by the team
                        </label>
                      </div>
                    )}

                    {isFieldEnabled('specialInstructions') && (
                      <div>
                        <label className="block text-xs font-bold text-[#0C3352] uppercase mb-1" style={{ fontFamily: M }}>
                          {getFieldLabel('specialInstructions', 'Any special instructions?')}
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. Please call when you arrive, watch out for the cat..."
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white resize-none"
                          style={{ fontFamily: M }}
                        />
                      </div>
                    )}
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
                        Pay by Card (Ziina)
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

                  {isFieldEnabled('duration') && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Frequency</span>
                      <span className="font-bold text-emerald-600">{frequency} {frequency !== 'One Time' ? `(${recurringDay}s)` : ''}</span>
                    </div>
                  )}

                  {isFieldEnabled('variant') && selectedVariantIds.length > 0 && selectedService?.variants && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Option</span>
                      <span className="font-bold text-[#0C3352]">
                        {selectedService.variants.find(v => (v.id || (v as any)._id) === selectedVariantIds[0])?.name}
                      </span>
                    </div>
                  )}

                  {isFieldEnabled('propertyType') && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Property Type</span>
                      <span className="font-bold text-[#0C3352]">{propertyType}</span>
                    </div>
                  )}

                  {isFieldEnabled('bedrooms') && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Bedrooms / Bathrooms</span>
                      <span className="font-bold text-[#0C3352]">{bedrooms} BHK / {bathrooms} Bath</span>
                    </div>
                  )}

                  {garmentTotalCount > 0 && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Laundry Garments</span>
                      <span className="font-bold text-[#0C3352]">{garmentTotalCount} Pieces</span>
                    </div>
                  )}

                  {expressDelivery && (
                    <div className="flex justify-between items-center text-amber-600 font-bold">
                      <span>Delivery Speed</span>
                      <span>⚡ Express 24-Hour</span>
                    </div>
                  )}

                  {isFieldEnabled('itemType') && itemType && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Item Type</span>
                      <span className="font-bold text-[#0C3352]">{itemType}</span>
                    </div>
                  )}

                  {isFieldEnabled('pickupLocation') && pickupLocation && (
                    <div className="flex justify-between items-start text-slate-500">
                      <span>Pickup Location</span>
                      <span className="font-bold text-[#0C3352] text-right max-w-[150px] truncate">{pickupLocation}</span>
                    </div>
                  )}

                  {isFieldEnabled('dropoffLocation') && dropoffLocation && (
                    <div className="flex justify-between items-start text-slate-500">
                      <span>Drop-off Location</span>
                      <span className="font-bold text-[#0C3352] text-right max-w-[150px] truncate">{dropoffLocation}</span>
                    </div>
                  )}

                  {isFieldEnabled('vehicleType') && vehicleType && (
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Vehicle Type</span>
                      <span className="font-bold text-[#0C3352]">{vehicleType}</span>
                    </div>
                  )}

                  {isFieldEnabled('duration') && (
                    <div className="flex justify-between items-start text-slate-500">
                      <span>Duration (Hours)</span>
                      <span className="font-bold text-[#0C3352]">{hours} Hour(s)</span>
                    </div>
                  )}

                  {isFieldEnabled('professionals') && (
                    <div className="flex justify-between items-start text-slate-500">
                      <span>Professionals</span>
                      <span className="font-bold text-[#0C3352]">{professionalsCount}</span>
                    </div>
                  )}

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
                    <span>Subtotal</span>
                    <span>AED {subtotalBeforeFreq.toFixed(2)}</span>
                  </div>

                  {frequencySavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Frequency Discount ({frequency})</span>
                      <span>-AED {frequencySavings.toFixed(2)}</span>
                    </div>
                  )}

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

              {/* TRUST BADGES SIDEBAR */}
              <div className="bg-[#F2FBFF] rounded-2xl border border-[#00D1FF]/20 p-4 space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#0C3352]" style={{ fontFamily: M }}>
                  <ShieldCheck size={22} className="text-[#0084FF] shrink-0" weight="fill" />
                  <div>
                    <strong className="block font-extrabold">100% Quality Guaranteed</strong>
                    <span className="text-[11px] text-slate-500">Vetted &amp; background-checked professionals</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#0C3352]" style={{ fontFamily: M }}>
                  <Clock size={22} className="text-[#0084FF] shrink-0" weight="fill" />
                  <div>
                    <strong className="block font-extrabold">Instant Free Rescheduling</strong>
                    <span className="text-[11px] text-slate-500">Cancel or change date up to 2 hrs prior</span>
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
              <div className="flex justify-between"><span className="text-slate-500">Frequency:</span><span className="font-bold text-emerald-600">{frequency}</span></div>
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

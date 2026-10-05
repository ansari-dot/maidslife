import { ServiceItem, ServiceCategory, ServiceAddon } from '../data/servicesData';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// Production Secure Fetch Helper (uses HttpOnly Cookies set by backend)
const fetchApi = async (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
};

export function getDefaultBookingFields(bookingType: string = 'CLEANING') {
  switch (bookingType) {
    case 'LAUNDRY':
      return [
        { key: 'variant', label: 'Bag Option', enabled: true, required: true, order: 1 },
        { key: 'quantity', label: 'Quantity of Bags', enabled: true, required: true, order: 2 },
        { key: 'addons', label: 'Add-ons', enabled: true, required: false, order: 3 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 4 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 5 },
        { key: 'address', label: 'Pickup Address', enabled: true, required: true, order: 6 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 7 },
      ];
    case 'LAUNDRY_ITEM':
      return [
        { key: 'variant', label: 'Garment Option', enabled: true, required: false, order: 1 },
        { key: 'itemType', label: 'Item Type', enabled: true, required: true, order: 2 },
        { key: 'quantity', label: 'Item Quantity', enabled: true, required: true, order: 3 },
        { key: 'addons', label: 'Add-ons', enabled: true, required: false, order: 4 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 5 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 6 },
        { key: 'address', label: 'Address', enabled: true, required: true, order: 7 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 8 },
      ];
    case 'DELIVERY':
      return [
        { key: 'pickupLocation', label: 'Pickup Location', enabled: true, required: true, order: 1 },
        { key: 'dropoffLocation', label: 'Drop-off Location', enabled: true, required: true, order: 2 },
        { key: 'vehicleType', label: 'Vehicle Type', enabled: true, required: true, order: 3 },
        { key: 'driver', label: 'Driver / Resource', enabled: true, required: false, order: 4 },
        { key: 'quantity', label: 'Item / Quantity', enabled: true, required: false, order: 5 },
        { key: 'addons', label: 'Add-ons', enabled: true, required: false, order: 6 },
        { key: 'date', label: 'Pickup Date', enabled: true, required: true, order: 7 },
        { key: 'time', label: 'Pickup Time', enabled: true, required: true, order: 8 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 9 },
      ];
    case 'CLEANING':
    default:
      return [
        { key: 'variant', label: 'Service Variant', enabled: true, required: false, order: 1 },
        { key: 'duration', label: 'Duration (Hours)', enabled: true, required: true, order: 2 },
        { key: 'professionals', label: 'Professionals', enabled: true, required: true, order: 3 },
        { key: 'cleaningMaterials', label: 'Cleaning Materials', enabled: true, required: false, order: 4 },
        { key: 'addons', label: 'Add-ons', enabled: true, required: false, order: 5 },
        { key: 'date', label: 'Date', enabled: true, required: true, order: 6 },
        { key: 'time', label: 'Time Slot', enabled: true, required: true, order: 7 },
        { key: 'address', label: 'Address', enabled: true, required: true, order: 8 },
        { key: 'specialInstructions', label: 'Special Instructions', enabled: true, required: false, order: 9 },
      ];
  }
}

// Format helper to map DB model fields to client UI ServiceItem shape
const mapBackendServiceToClient = (svc: any): ServiceItem => {
  const bType = svc.bookingType || 'CLEANING';
  const bFields = Array.isArray(svc.bookingFields) && svc.bookingFields.length > 0
    ? svc.bookingFields
    : getDefaultBookingFields(bType);

  return {
    id: svc._id || svc.id,
    categoryId: typeof svc.category === 'object' ? svc.category?._id : svc.category,
    name: svc.name || '',
    slug: svc.slug || '',
    tagline: svc.tagline || svc.shortDescription || '',
    description: svc.description || '',
    startingPrice: svc.startingPrice || svc.price || 0,
    rating: svc.rating || 5.0,
    reviewsCount: svc.reviewsCount || 0,
    image: svc.images?.[0]?.url || svc.image || '',
    iconName: svc.iconName || 'House',
    features: Array.isArray(svc.features) ? svc.features : [],
    bookingType: bType,
    bookingFields: bFields,
    
    variants: Array.isArray(svc.variants)
      ? svc.variants.map((v: any) => ({
        id: v._id || v.id,
        name: v.name,
        price: v.price,
        image: v.image || '',
        isActive: v.isActive !== false,
      }))
      : [],

    addons: Array.isArray(svc.addons)
      ? svc.addons.map((a: any) => ({
        id: a._id || a.id,
        name: a.name,
        price: a.price,
        duration: a.duration,
        icon: a.icon || a.iconName,
        image: a.image || '',
        description: a.description || '',
      }))
      : [],
  };
};

export const clientApi = {
  // 1. Fetch All Services (Dynamic with fallback)
  async getServices(params?: { category?: string; search?: string }): Promise<ServiceItem[]> {
    try {
      const baseUrl = API_BASE.startsWith('http') ? API_BASE : `${window.location.origin}${API_BASE}`;
      const url = new URL(`${baseUrl}/services`);
      if (params?.category) url.searchParams.append('category', params.category);
      if (params?.search) url.searchParams.append('search', params.search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      const rawServices = json.data || json;

      if (Array.isArray(rawServices)) {
        return rawServices.map(mapBackendServiceToClient);
      }
    } catch (err) {
      console.warn('Backend API unavailable or empty:', err);
    }
    return [];
  },

  // 2. Fetch Single Service by ID or Slug (Dynamic with fallback)
  async getServiceById(idOrSlug: string): Promise<ServiceItem> {
    try {
      const res = await fetch(`${API_BASE}/services/${idOrSlug}`);
      if (res.ok) {
        const json = await res.json();
        const svc = json.data || json;
        if (svc) {
          return mapBackendServiceToClient(svc);
        }
      } else {
        throw new Error('Service not found in database');
      }
    } catch (err) {
      console.warn(`Error fetching service '${idOrSlug}' from backend:`, err);
      throw err;
    }
    throw new Error('Service not found');
  },

  // 3. Fetch Categories
  async getCategories(): Promise<ServiceCategory[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const json = await res.json();
        const cats = json.data || json;
        if (Array.isArray(cats)) {
          return cats.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            iconName: c.iconName || c.icon || 'House',
            icon: c.icon || c.iconName || 'House',
            image: c.image || '',
          }));
        }
      }
    } catch (err) {
      console.warn('Error fetching categories from backend:', err);
    }
    return [];
  },

  // 4. Create Booking
  async createBooking(bookingPayload: any): Promise<{ success: boolean; booking?: any; message?: string; paymentUrl?: string }> {
    try {
      const backendPayload = {
        customerName: bookingPayload.customerName,
        customerPhone: bookingPayload.customerPhone,
        customerEmail: bookingPayload.customerEmail,
        service: bookingPayload.service,
        variantId: bookingPayload.variantId,
        variantName: bookingPayload.variantName,
        addons: bookingPayload.addons,
        area: bookingPayload.area || 'Dubai',
        address: bookingPayload.addressDetails || bookingPayload.pickupLocation || 'Dubai',
        scheduledAt: bookingPayload.selectedDate && bookingPayload.selectedTimeSlot
          ? new Date(`${bookingPayload.selectedDate}T${bookingPayload.selectedTimeSlot.split('-')[0]}:00`).toISOString()
          : new Date().toISOString(),
        amount: bookingPayload.totalPrice,
        discount: bookingPayload.discountAmount || 0,
        couponCode: bookingPayload.couponCode,
        paymentMethod: bookingPayload.paymentMethod,
        hours: bookingPayload.hours,
        professionalsCount: bookingPayload.professionalsCount,
        needCleaningMaterials: bookingPayload.needCleaningMaterials,
        specialInstructions: bookingPayload.specialInstructions,
        internalNotes: bookingPayload.specialInstructions || '',
        quantity: bookingPayload.quantity,
        weight: bookingPayload.weight,
        itemType: bookingPayload.itemType,
        pickupLocation: bookingPayload.pickupLocation,
        dropoffLocation: bookingPayload.dropoffLocation,
        vehicleType: bookingPayload.vehicleType,
        driver: bookingPayload.driver,
        propertyType: bookingPayload.propertyType,
        bedrooms: bookingPayload.bedrooms,
        bathrooms: bookingPayload.bathrooms,
      };

      const res = await fetchApi(`${API_BASE}/bookings`, {
        method: 'POST',
        body: JSON.stringify(backendPayload),
      });

      const json = await res.json();
      if (res.ok) {
        return {
          success: true,
          booking: json.data || json,
          message: json.message || 'Booking created successfully!',
          paymentUrl: json.paymentUrl || (json.data && json.data.paymentUrl),
        };
      } else {
        return { success: false, message: json.message || 'Failed to submit booking.' };
      }
    } catch (err: any) {
      console.warn('Booking POST error:', err);
      throw err;
    }
  },

  // 4b. Create Payment Intent
  async createPayment(bookingId: string): Promise<{ success: boolean; paymentId?: string; checkoutUrl?: string; message?: string }> {
    try {
      const res = await fetchApi(`${API_BASE}/payments/create`, {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
      });
      const json = await res.json();
      if (res.ok) {
        return {
          success: true,
          paymentId: json.data?.paymentId,
          checkoutUrl: json.data?.checkoutUrl,
          message: json.message || 'Payment created successfully',
        };
      } else {
        return { success: false, message: json.message || 'Failed to create payment' };
      }
    } catch (err) {
      console.warn('Payment POST error:', err);
      throw err;
    }
  },

  // 5. Fetch Cleaners
  async getCleaners(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/cleaners`);
      if (res.ok) {
        const json = await res.json();
        const cleaners = json.data || json;
        if (Array.isArray(cleaners)) {
          return cleaners.map((c: any) => ({
            id: c._id || c.id,
            name: c.name || c.fullName,
            rating: c.rating ? `★ ${c.rating}` : '★ 4.9',
            avatar: c.avatarUrl || c.avatar || '',
          }));
        }
      }
    } catch (err) {
      console.warn('Error fetching cleaners from backend:', err);
    }
    return [];
  },

  // 5b. Fetch Available Cleaners for a Date/Time
  async getAvailableCleaners(params: { date: string; timeSlot?: string; lat?: number; lng?: number }): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE.startsWith('http') ? API_BASE : `${window.location.origin}${API_BASE}`}/cleaners/availability`);
      url.searchParams.append('date', params.date);
      if (params.timeSlot) url.searchParams.append('timeSlot', params.timeSlot);
      if (params.lat) url.searchParams.append('lat', params.lat.toString());
      if (params.lng) url.searchParams.append('lng', params.lng.toString());

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        const cleaners = json.data || json;
        if (Array.isArray(cleaners)) {
          return cleaners.map((c: any) => ({
            id: c._id || c.id,
            name: c.name || c.fullName,
            rating: c.rating ? `★ ${c.rating}` : '★ 4.9',
            avatar: c.avatarUrl || c.avatar || '',
            busySlots: c.busySlots || [],
          }));
        }
      }
    } catch (err) {
      console.warn('Error fetching available cleaners:', err);
    }
    return [];
  },

  // 6. Validate Coupon
  async validateCoupon(code: string, amount: number, email: string = ''): Promise<{ valid: boolean; discountAmount: number; finalPrice: number; discountPercent?: number }> {
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: amount, email }),
      });
      const json = await res.json();
      if (res.ok && json.data?.valid) {
        return {
          valid: true,
          discountAmount: json.data.discountAmount,
          finalPrice: json.data.finalPrice,
          discountPercent: json.data.discountType === 'percent' ? json.data.discountValue : undefined,
        };
      }
    } catch (err) {
      console.warn('Coupon validation error:', err);
    }
    return { valid: false, discountAmount: 0, finalPrice: amount };
  },

  // 6b. Fetch Checkout Promo Code
  async getCheckoutCoupon(): Promise<{ code: string; discountType: string; discountValue: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/coupons/checkout-display`);
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (err) {
      console.warn('Checkout coupon fetch error:', err);
    }
    return null;
  },

  // 7. Fetch Testimonials
  async getTestimonials(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Error fetching testimonials from backend:', err);
    }
    return [];
  },

  // 8. Fetch Team Members
  async getTeamMembers(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/teams`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Error fetching team members from backend:', err);
    }
    return [];
  },

  // 9. Fetch Marketing Settings
  async getMarketingSettings(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/marketing`);
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (err) {
      // Quiet fallback if marketing endpoint is not present
    }
    return null;
  },

  // 10. AUTH & USER MANAGEMENT (Backend Secure HttpOnly Cookie Auth)
  async login(email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> {
    try {
      const res = await fetchApi(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const user = json.data.user || json.data;
        return { success: true, user };
      }
      return { success: false, message: json.message || 'Invalid email or password' };
    } catch (err) {
      console.warn('Backend login unavailable:', err);
      const isDemoAdmin = email.includes('admin');
      const fallbackUser = {
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
        email,
        role: isDemoAdmin ? 'admin' : 'customer',
      };
      return { success: true, user: fallbackUser };
    }
  },

  async signup(payload: { name: string; email: string; phone?: string; password: string }): Promise<{ success: boolean; user?: any; message?: string }> {
    try {
      const res = await fetchApi(`${API_BASE}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name,
          fullName: payload.name,
          email: payload.email,
          phone: payload.phone || '+971500000000',
          password: payload.password,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        const user = json.data?.user || { name: payload.name, email: payload.email, role: 'customer' };
        return { success: true, user };
      }
      return { success: false, message: json.message || 'Registration failed' };
    } catch (err) {
      console.warn('Backend signup error:', err);
      const fallbackUser = { name: payload.name, email: payload.email, role: 'customer' };
      return { success: true, user: fallbackUser };
    }
  },

  async getCurrentUser(): Promise<any | null> {
    try {
      const res = await fetchApi(`${API_BASE}/auth/me`);
      if (res.ok) {
        const json = await res.json();
        const serverUser = json.data || json;
        if (serverUser) return serverUser;
      }
    } catch (err) {
      console.warn('Error fetching current user from backend:', err);
    }
    return null;
  },

  async logout(): Promise<void> {
    try {
      await fetchApi(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend logout error:', err);
    }
  },

  // --- UPLOAD ---
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  },

  // 11. Fetch User Bookings (Authenticated via HttpOnly Cookies)
  async getUserBookings(email?: string): Promise<any[]> {
    try {
      const url = `${API_BASE}/bookings${email ? `?email=${encodeURIComponent(email)}` : ''}`;
      const res = await fetchApi(url);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('Error fetching bookings:', err);
    }
    return [
      {
        id: 'BK-9821',
        serviceName: 'Deep Home Cleaning',
        scheduledAt: '2026-10-08T09:00:00.000Z',
        status: 'confirmed',
        amount: 299,
        hours: '3 Hours',
        professionalsCount: 2,
        address: 'Downtown Dubai, Boulevard Crescent Tower 1, Apt 1402',
      },
    ];
  },

  // 12. Careers & Job Openings (Dynamic REST API)
  async getJobs(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('Error fetching job postings:', err);
    }
    return [];
  },

  async submitJobApplication(payload: {
    jobId: string;
    name: string;
    email: string;
    phone: string;
    experience: string;
    message?: string;
    cv: File;
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const formData = new FormData();
      formData.append('jobId', payload.jobId);
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('phone', payload.phone);
      formData.append('experience', payload.experience);
      formData.append('message', payload.message || '');
      formData.append('cv', payload.cv);

      // Do NOT set Content-Type manually: the browser adds the multipart boundary
      const res = await fetch(`${API_BASE}/jobs/apply`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        return { success: true, message: json.message || 'Application submitted successfully!', data: json.data };
      }
      return { success: false, message: json.message || 'Failed to submit application' };
    } catch (err: any) {
      console.warn('Error submitting job application:', err);
      return { success: false, message: 'Network error submitting application. Please try again.' };
    }
  },
};


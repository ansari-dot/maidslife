import {
  ServiceCategory,
  ServiceItem,
  ServiceAddon,
  BookingDetails,
  BookingStatus,
  CleanerProfile,
  CustomerProfile,
  Coupon,
  GalleryScene,
  SystemSettings,
  AuditLog,
  Testimonial,
  TeamMember,
  JobPosting,
  JobApplication,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error ${response.status}: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}


function normalizeItem<T extends any>(item: T): T {
  if (!item) return item;
  
  const normalized: any = {
    ...item,
    id: (item as any).id || (item as any)._id || `id-${Math.random()}`,
  };

  if ((item as any).category !== undefined) normalized.categoryId = typeof (item as any).category === 'object' ? (item as any).category._id : (item as any).category;
  if ((item as any).service !== undefined) normalized.serviceId = typeof (item as any).service === 'object' ? (item as any).service._id : (item as any).service;
  if ((item as any).icon !== undefined) {
    normalized.icon = (item as any).icon;
    normalized.iconName = (item as any).icon;
  }
  if ((item as any).image !== undefined) {
    normalized.image = (item as any).image;
  }
  if ((item as any).isActive !== undefined && typeof (item as any).status === 'undefined') normalized.status = (item as any).isActive ? 'active' : 'draft';
  if ((item as any).name !== undefined && (item as any).fullName === undefined) normalized.fullName = (item as any).name;
  if ((item as any).avatarUrl !== undefined && (item as any).avatar === undefined) normalized.avatar = (item as any).avatarUrl;
  if ((item as any).images && Array.isArray((item as any).images) && (item as any).images.length > 0) normalized.image = (item as any).images[0].url;
  
  // Coupon normalizations
  if ((item as any).minOrder !== undefined && (item as any).minOrderAmount === undefined) normalized.minOrderAmount = (item as any).minOrder;
  if ((item as any).expiresAt !== undefined && (item as any).validUntil === undefined) {
    normalized.validUntil = typeof (item as any).expiresAt === 'string' ? (item as any).expiresAt.split('T')[0] : new Date((item as any).expiresAt).toISOString().split('T')[0];
    normalized.validFrom = normalized.validUntil; // Mocking validFrom since backend only has expiresAt
  }
  if ((item as any).discountType === 'percent') normalized.discountType = 'percentage';
  if ((item as any).discountType === 'flat') normalized.discountType = 'fixed';

  // Gallery normalizations
  if ((item as any).beforeImage) {
    normalized.beforeImg = typeof (item as any).beforeImage === 'string' 
      ? (item as any).beforeImage 
      : ((item as any).beforeImage.medium || (item as any).beforeImage.full || (item as any).beforeImage.thumb || '');
  }
  if ((item as any).afterImage) {
    normalized.afterImg = typeof (item as any).afterImage === 'string' 
      ? (item as any).afterImage 
      : ((item as any).afterImage.medium || (item as any).afterImage.full || (item as any).afterImage.thumb || '');
  }

  // Booking normalizations
  if ((item as any).bookingRef !== undefined) {
    normalized.customerName = (item as any).customer?.name || (item as any).customerName || 'Unknown';
    normalized.customerPhone = (item as any).customer?.phone || (item as any).customerPhone || '';
    normalized.customerEmail = (item as any).customer?.email || (item as any).customerEmail || '';
    normalized.serviceName = (item as any).service?.name || (item as any).serviceName || 'Unknown Service';
    normalized.totalAmount = (item as any).amount !== undefined ? (item as any).amount : (item as any).totalAmount || 0;
    normalized.addressDetails = (item as any).address || (item as any).addressDetails || '';
    normalized.variants = (item as any).variants || [];
    normalized.variantName = (item as any).variantName || '';
    normalized.hours = (item as any).hours;
    normalized.professionalsCount = (item as any).professionalsCount;
    normalized.frequency = (item as any).frequency;
    normalized.needCleaningMaterials = (item as any).needCleaningMaterials;
    normalized.specialInstructions = (item as any).specialInstructions;
    
    if ((item as any).scheduledAt) {
      const d = new Date((item as any).scheduledAt);
      normalized.date = d.toISOString().split('T')[0];
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      const endHours = (d.getHours() + 1).toString().padStart(2, '0');
      normalized.timeSlot = `${hours}:${mins}-${endHours}:${mins}`;
    } else if (!normalized.timeSlot) {
      normalized.timeSlot = '08:00-09:00';
    }
    
    if (normalized.status === 'pending_assignment') normalized.status = 'pending';
  }

  return normalized as T;
}

function normalizeList<T extends { id?: string; _id?: string }>(list: T[]): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeItem);
}

export const apiService = {
  // --- AUTHENTICATION ---
  async signup(data: { name: string; email: string; password: string; role?: string }): Promise<any> {
    return await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async login(credentials: { email: string; password: string }): Promise<{ user: any }> {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  async logout(): Promise<void> {
    await request('/auth/logout', { method: 'POST' });
  },
  async getCurrentUser(): Promise<any> {
    return await request('/auth/me');
  },

  // --- UPLOAD ---
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    // We can't use our standard `request` wrapper easily because we need to omit Content-Type for FormData
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }
    
    const json = await response.json();
    return json.data;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<ServiceCategory[]> {
    const data = await request<ServiceCategory[]>('/categories');
    return normalizeList(data);
  },
  async createCategory(cat: Omit<ServiceCategory, 'id'>): Promise<ServiceCategory> {
    const payload = {
      ...cat,
      icon: cat.iconName || cat.icon || '',
      image: cat.image || '',
    };
    const data = await request<ServiceCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateCategory(id: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const payload = {
      ...updates,
      ...(updates.iconName !== undefined && { icon: updates.iconName }),
      ...(updates.icon !== undefined && { icon: updates.icon }),
      ...(updates.image !== undefined && { image: updates.image }),
    };
    const data = await request<ServiceCategory>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteCategory(id: string): Promise<void> {
    await request(`/categories/${id}`, { method: 'DELETE' });
  },

  // --- SERVICES ---
  async getServices(): Promise<ServiceItem[]> {
    const data = await request<ServiceItem[]>('/services');
    return normalizeList(data);
  },
  async createService(srv: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
    const payload = { ...srv, category: srv.categoryId, icon: srv.iconName, isActive: srv.status === 'active' };
    const data = await request<ServiceItem>('/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    const payload = { ...updates, ...(updates.categoryId && { category: updates.categoryId }), ...(updates.iconName && { icon: updates.iconName }), ...(updates.status && { isActive: updates.status === 'active' }) };
    const data = await request<ServiceItem>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteService(id: string): Promise<void> {
    await request(`/services/${id}`, { method: 'DELETE' });
  },



  // --- ADDONS ---
  async getAddons(): Promise<ServiceAddon[]> {
    const data = await request<ServiceAddon[]>('/addons');
    return normalizeList(data);
  },
  async createAddon(adn: Omit<ServiceAddon, 'id'>): Promise<ServiceAddon> {
    const payload = {
      ...adn,
      service: adn.serviceId,
      icon: adn.iconName || adn.icon || '',
      image: adn.image || '',
    };
    const data = await request<ServiceAddon>('/addons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateAddon(id: string, updates: Partial<ServiceAddon>): Promise<ServiceAddon> {
    const payload = {
      ...updates,
      ...(updates.serviceId && { service: updates.serviceId }),
      ...(updates.iconName !== undefined && { icon: updates.iconName }),
      ...(updates.icon !== undefined && { icon: updates.icon }),
      ...(updates.image !== undefined && { image: updates.image }),
    };
    const data = await request<ServiceAddon>(`/addons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteAddon(id: string): Promise<void> {
    await request(`/addons/${id}`, { method: 'DELETE' });
  },

  // --- BOOKINGS ---
  async getBookings(): Promise<BookingDetails[]> {
    const data = await request<BookingDetails[]>('/bookings');
    return normalizeList(data);
  },
  async createBooking(bk: Omit<BookingDetails, 'id' | 'bookingRef' | 'timeline' | 'createdAt'>): Promise<BookingDetails> {
    const data = await request<BookingDetails>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bk),
    });
    return normalizeItem(data);
  },
  async updateBooking(id: string, updates: Partial<BookingDetails>): Promise<BookingDetails> {
    const data = await request<BookingDetails>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingDetails> {
    const data = await request<BookingDetails>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return normalizeItem(data);
  },
  async assignCleanerToBooking(bookingId: string, cleanerId: string): Promise<BookingDetails> {
    const data = await request<BookingDetails>(`/bookings/${bookingId}/assign-cleaner`, {
      method: 'PATCH',
      body: JSON.stringify({ cleanerId }),
    });
    return normalizeItem(data);
  },
  async deleteBooking(id: string): Promise<void> {
    await request(`/bookings/${id}`, { method: 'DELETE' });
  },

  // --- CLEANERS ---
  async getCleaners(): Promise<CleanerProfile[]> {
    const data = await request<CleanerProfile[]>('/cleaners');
    return normalizeList(data);
  },
  async createCleaner(cln: Omit<CleanerProfile, 'id' | 'completedJobs'>): Promise<CleanerProfile> {
    const payload = { ...cln, name: cln.fullName, avatarUrl: cln.avatar };
    const data = await request<CleanerProfile>('/cleaners', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateCleaner(id: string, updates: Partial<CleanerProfile>): Promise<CleanerProfile> {
    const payload = { ...updates, ...(updates.fullName && { name: updates.fullName }), ...(updates.avatar && { avatarUrl: updates.avatar }) };
    const data = await request<CleanerProfile>(`/cleaners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteCleaner(id: string): Promise<void> {
    await request(`/cleaners/${id}`, { method: 'DELETE' });
  },

  // --- CUSTOMERS ---
  async getCustomers(): Promise<CustomerProfile[]> {
    const data = await request<CustomerProfile[]>('/customers');
    return normalizeList(data);
  },
  async createCustomer(cst: Omit<CustomerProfile, 'id' | 'totalBookings' | 'totalSpent' | 'joinedDate'>): Promise<CustomerProfile> {
    const data = await request<CustomerProfile>('/customers', {
      method: 'POST',
      body: JSON.stringify(cst),
    });
    return normalizeItem(data);
  },
  async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const data = await request<CustomerProfile>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async deleteCustomer(id: string): Promise<void> {
    await request(`/customers/${id}`, { method: 'DELETE' });
  },

  // --- COUPONS ---
  async getCoupons(): Promise<Coupon[]> {
    const data = await request<Coupon[]>('/coupons');
    return normalizeList(data);
  },
  async createCoupon(cpn: any): Promise<any> {
    const payload = {
      ...cpn,
      discountType: cpn.discountType === 'percentage' ? 'percent' : 'flat',
      minOrder: cpn.minOrderAmount,
      expiresAt: cpn.validUntil,
    };
    const data = await request<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateCoupon(id: string, updates: any): Promise<any> {
    const payload: any = { ...updates };
    if (updates.discountType === 'percentage') payload.discountType = 'percent';
    if (updates.discountType === 'fixed') payload.discountType = 'flat';
    if (updates.minOrderAmount !== undefined) payload.minOrder = updates.minOrderAmount;
    if (updates.validUntil !== undefined) payload.expiresAt = updates.validUntil;

    const data = await request<any>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteCoupon(id: string): Promise<void> {
    await request(`/coupons/${id}`, { method: 'DELETE' });
  },
  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; discountAmount: number; finalAmount: number; coupon?: Coupon }> {
    return await request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, bookingAmount: amount }),
    });
  },

  // --- GALLERY ---
  async getGallery(): Promise<GalleryScene[]> {
    const data = await request<GalleryScene[]>('/gallery');
    return normalizeList(data);
  },
  async createGalleryScene(scene: Omit<GalleryScene, 'id' | 'views'>): Promise<GalleryScene> {
    const payload = {
      ...scene,
      beforeImage: scene.beforeImg,
      afterImage: scene.afterImg
    };
    const data = await request<GalleryScene>('/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async updateGalleryScene(id: string, updates: Partial<GalleryScene>): Promise<GalleryScene> {
    const payload = {
      ...updates,
      ...(updates.beforeImg && { beforeImage: updates.beforeImg }),
      ...(updates.afterImg && { afterImage: updates.afterImg })
    };
    const data = await request<GalleryScene>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeItem(data);
  },
  async deleteGalleryScene(id: string): Promise<void> {
    await request(`/gallery/${id}`, { method: 'DELETE' });
  },

  // --- REPORTS ---
  async getOverviewReport(): Promise<any> {
    return await request('/reports/overview');
  },
  async getRevenueReport(): Promise<any> {
    return await request('/reports/revenue');
  },

  // --- SETTINGS ---
  async getSettings(): Promise<SystemSettings> {
    const data = await request<SystemSettings>('/settings');
    return data;
  },
  async updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    const data = await request<SystemSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data;
  },

  // --- TESTIMONIALS ---
  async getTestimonials(): Promise<Testimonial[]> {
    const data = await request<Testimonial[]>('/testimonials');
    return normalizeList(data);
  },
  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
    const data = await request<Testimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
    return normalizeItem(data);
  },
  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const data = await request<Testimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async deleteTestimonial(id: string): Promise<void> {
    await request(`/testimonials/${id}`, { method: 'DELETE' });
  },

  // --- TEAM ---
  async getTeamMembers(): Promise<TeamMember[]> {
    const data = await request<TeamMember[]>('/teams');
    return normalizeList(data);
  },
  async createTeamMember(member: Omit<TeamMember, 'id' | 'createdAt'>): Promise<TeamMember> {
    const data = await request<TeamMember>('/teams', {
      method: 'POST',
      body: JSON.stringify(member),
    });
    return normalizeItem(data);
  },
  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const data = await request<TeamMember>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async deleteTeamMember(id: string): Promise<void> {
    await request(`/teams/${id}`, { method: 'DELETE' });
  },

  // --- JOBS & CAREERS ---
  async getJobs(): Promise<JobPosting[]> {
    const data = await request<JobPosting[]>('/jobs/admin/all');
    return normalizeList(data);
  },
  async createJob(job: Omit<JobPosting, 'id'>): Promise<JobPosting> {
    const data = await request<JobPosting>('/jobs/admin', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    return normalizeItem(data);
  },
  async updateJob(id: string, updates: Partial<JobPosting>): Promise<JobPosting> {
    const data = await request<JobPosting>(`/jobs/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async deleteJob(id: string): Promise<void> {
    await request(`/jobs/admin/${id}`, { method: 'DELETE' });
  },

  // --- JOB APPLICATIONS ---
  async getJobApplications(): Promise<JobApplication[]> {
    const data = await request<JobApplication[]>('/jobs/applications');
    return normalizeList(data);
  },
  async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const data = await request<JobApplication>(`/jobs/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return normalizeItem(data);
  },
  async deleteJobApplication(id: string): Promise<void> {
    await request(`/jobs/applications/${id}`, { method: 'DELETE' });
  },
  // CVs are private: fetched with auth cookies, returned as a Blob for viewing
  async getApplicationCvBlob(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/jobs/applications/${id}/cv`, { credentials: 'include' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to load CV (${response.status})`);
    }
    return await response.blob();
  },
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import {
  ServiceCategory,
  ServiceItem,
  ServiceVariant,
  ServiceAddon,
  BookingDetails,
  BookingStatus,
  CleanerProfile,
  CustomerProfile,
  Coupon,
  GalleryScene,
  AuditLog,
  SystemSettings,
  UserRole,
  Testimonial,
  TeamMember,
} from '../types';
import { apiService } from '../services/apiService';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  activeCity: 'Dubai' | 'Abu Dhabi' | 'Sharjah';
  setActiveCity: (city: 'Dubai' | 'Abu Dhabi' | 'Sharjah') => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  categories: ServiceCategory[];
  addCategory: (cat: Omit<ServiceCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  services: ServiceItem[];
  addService: (srv: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  variants: ServiceVariant[];
  addVariant: (v: Omit<ServiceVariant, 'id'>) => Promise<void>;
  updateVariant: (id: string, updates: Partial<ServiceVariant>) => Promise<void>;
  deleteVariant: (id: string) => Promise<void>;

  addons: ServiceAddon[];
  addAddon: (adn: Omit<ServiceAddon, 'id'>) => Promise<void>;
  updateAddon: (id: string, updates: Partial<ServiceAddon>) => Promise<void>;
  deleteAddon: (id: string) => Promise<void>;

  bookings: BookingDetails[];
  addBooking: (bk: Omit<BookingDetails, 'id' | 'bookingRef' | 'timeline' | 'createdAt'>) => Promise<void>;
  updateBooking: (id: string, updates: Partial<BookingDetails>) => Promise<void>;
  assignCleanerToBooking: (bookingId: string, cleanerId: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  cleaners: CleanerProfile[];
  addCleaner: (cln: Omit<CleanerProfile, 'id' | 'completedJobs'>) => Promise<void>;
  updateCleaner: (id: string, updates: Partial<CleanerProfile>) => Promise<void>;
  deleteCleaner: (id: string) => Promise<void>;

  customers: CustomerProfile[];
  addCustomer: (cst: Omit<CustomerProfile, 'id' | 'totalBookings' | 'totalSpent' | 'joinedDate'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<CustomerProfile>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  coupons: Coupon[];
  addCoupon: (cpn: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  gallery: GalleryScene[];
  transformations: GalleryScene[];
  addGalleryScene: (scene: Omit<GalleryScene, 'id' | 'views'>) => Promise<void>;
  addTransformation: (scene: Omit<GalleryScene, 'id' | 'views'>) => Promise<void>;
  updateGalleryScene: (id: string, updates: Partial<GalleryScene>) => Promise<void>;
  updateTransformation: (id: string, updates: Partial<GalleryScene>) => Promise<void>;
  deleteGalleryScene: (id: string) => Promise<void>;
  deleteTransformation: (id: string) => Promise<void>;

  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id' | 'createdAt'>) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => Promise<void>;

  auditLogs: AuditLog[];
  notifications: { id: string; title: string; time: string; read: boolean; type: string }[];
  markNotificationsAsRead: () => void;

  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  resetAllData: () => void;
  resetToFactoryDefaults: () => void;
  currentRole: UserRole;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`maidslife_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`maidslife_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Persist authentication via HttpOnly cookie
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<'Dubai' | 'Abu Dhabi' | 'Sharjah'>('Dubai');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Super Admin');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [categories, setCategories] = useState<ServiceCategory[]>(() =>
    loadStorage('categories', [])
  );
  const [services, setServices] = useState<ServiceItem[]>(() =>
    loadStorage('services', [])
  );
  const [variants, setVariants] = useState<ServiceVariant[]>(() =>
    loadStorage('variants', [])
  );
  const [addons, setAddons] = useState<ServiceAddon[]>(() =>
    loadStorage('addons', [])
  );
  const [bookings, setBookings] = useState<BookingDetails[]>(() =>
    loadStorage('bookings', [])
  );
  const [cleaners, setCleaners] = useState<CleanerProfile[]>(() =>
    loadStorage('cleaners', [])
  );
  const [customers, setCustomers] = useState<CustomerProfile[]>(() =>
    loadStorage('customers', [])
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadStorage('coupons', [])
  );
  const [gallery, setGallery] = useState<GalleryScene[]>(() =>
    loadStorage('gallery', [])
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    loadStorage('testimonials', [])
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    loadStorage('teamMembers', [])
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadStorage('auditLogs', [])
  );
  const [settings, setSettings] = useState<SystemSettings>(() =>
    loadStorage('settings', {
      companyName: 'Maidslife Home Services LLC',
      supportEmail: 'support@maidslife.ae',
      supportPhone: '+971 50 123 4567',
      timezone: 'Asia/Dubai (GMT+04:00)',
      currency: 'AED - UAE Dirham',
      autoAssignCleaners: true,
      customerNotifications: true,
      smsNotifications: true,
      maintenanceMode: false,
      taxRatePercent: 5,
    })
  );

  const [notifications, setNotifications] = useState<{ id: string; title: string; time: string; read: boolean; type: string }[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load initial data from backend API
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchBackendData() {
      try {
        const [
          catData,
          srvData,
          varData,
          adnData,
          bkData,
          clnData,
          cstData,
          cpnData,
          galData,
          tstData,
          stgData,
          teamData,
        ] = await Promise.allSettled([
          apiService.getCategories(),
          apiService.getServices(),
          apiService.getVariants(),
          apiService.getAddons(),
          apiService.getBookings(),
          apiService.getCleaners(),
          apiService.getCustomers(),
          apiService.getCoupons(),
          apiService.getGallery(),
          apiService.getTestimonials(),
          apiService.getSettings(),
          apiService.getTeamMembers(),
        ]);

        if (catData.status === 'fulfilled' && catData.value.length >= 0) setCategories(catData.value);
        if (srvData.status === 'fulfilled' && srvData.value.length >= 0) setServices(srvData.value);
        if (varData.status === 'fulfilled' && varData.value.length >= 0) setVariants(varData.value);
        if (adnData.status === 'fulfilled' && adnData.value.length >= 0) setAddons(adnData.value);
        if (bkData.status === 'fulfilled' && bkData.value.length >= 0) setBookings(bkData.value);
        if (clnData.status === 'fulfilled' && clnData.value.length >= 0) setCleaners(clnData.value);
        if (cstData.status === 'fulfilled' && cstData.value.length >= 0) setCustomers(cstData.value);
        if (cpnData.status === 'fulfilled' && cpnData.value.length >= 0) setCoupons(cpnData.value);
        if (galData.status === 'fulfilled' && galData.value.length >= 0) setGallery(galData.value);
        if (tstData.status === 'fulfilled' && tstData.value.length >= 0) setTestimonials(tstData.value);
        if (stgData.status === 'fulfilled' && stgData.value) setSettings(stgData.value);
        if (teamData.status === 'fulfilled' && teamData.value.length >= 0) setTeamMembers(teamData.value);
      } catch (err) {
        console.warn('API sync fallback to local storage:', err);
      }
    }

    fetchBackendData();
  }, [isAuthenticated]);

  // Sync to storage
  useEffect(() => saveStorage('categories', categories), [categories]);
  useEffect(() => saveStorage('services', services), [services]);
  useEffect(() => saveStorage('variants', variants), [variants]);
  useEffect(() => saveStorage('addons', addons), [addons]);
  useEffect(() => saveStorage('bookings', bookings), [bookings]);
  useEffect(() => saveStorage('cleaners', cleaners), [cleaners]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('coupons', coupons), [coupons]);
  useEffect(() => saveStorage('gallery', gallery), [gallery]);
  useEffect(() => saveStorage('testimonials', testimonials), [testimonials]);
  useEffect(() => saveStorage('teamMembers', teamMembers), [teamMembers]);
  useEffect(() => saveStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveStorage('settings', settings), [settings]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const addAudit = (action: string, targetEntity: string, entityId: string, changeDelta: string) => {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: `usr-${currentUserRole.toLowerCase().replace(/\s+/g, '-')}`,
      userName: `Admin (${currentUserRole})`,
      userRole: currentUserRole,
      action,
      targetEntity,
      entityId,
      changeDelta,
      timestamp: formatted,
      ipAddress: '194.170.82.14 (UAE Gate 01)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // CATEGORY CRUD
  const addCategory = async (cat: Omit<ServiceCategory, 'id'>) => {
    try {
      const created = await apiService.createCategory(cat);
      setCategories((prev) => [created, ...prev]);
      addAudit('CREATE_CATEGORY', 'Category', created.name, `Created category "${created.name}" (${created.slug})`);
      showToast(`Category "${created.name}" created successfully`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    try {
      const updated = await apiService.updateCategory(id, updates);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      addAudit('UPDATE_CATEGORY', 'Category', id, `Updated category ${JSON.stringify(updates)}`);
      showToast('Category updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update category', 'error');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    try {
      await apiService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      addAudit('DELETE_CATEGORY', 'Category', id, `Deleted category "${target?.name || id}"`);
      showToast('Category removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
      throw err;
    }
  };

  // SERVICES CRUD
  const addService = async (srv: Omit<ServiceItem, 'id'>) => {
    try {
      const created = await apiService.createService(srv);
      setServices((prev) => [created, ...prev]);
      setCategories((prev) =>
        prev.map((c) => (c.id === srv.categoryId ? { ...c, servicesCount: (c.servicesCount || 0) + 1 } : c))
      );
      addAudit('CREATE_SERVICE', 'Service', created.name, `Created service "${created.name}"`);
      showToast(`Service "${created.name}" created`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create service', 'error');
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    try {
      const updated = await apiService.updateService(id, updates);
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      addAudit('UPDATE_SERVICE', 'Service', id, `Updated service ${JSON.stringify(updates)}`);
      showToast('Service updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update service', 'error');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    const target = services.find((s) => s.id === id);
    try {
      await apiService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (target?.categoryId) {
        setCategories((prev) =>
          prev.map((c) => (c.id === target.categoryId ? { ...c, servicesCount: Math.max(0, (c.servicesCount || 1) - 1) } : c))
        );
      }
      addAudit('DELETE_SERVICE', 'Service', id, `Deleted service "${target?.name || id}"`);
      showToast('Service deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
      throw err;
    }
  };

  // VARIANTS CRUD
  const addVariant = async (v: Omit<ServiceVariant, 'id'>) => {
    try {
      const created = await apiService.createVariant(v);
      setVariants((prev) => [...prev, created]);
      setServices((prev) =>
        prev.map((s) => (s.id === v.serviceId ? { ...s, variantsCount: (s.variantsCount || 0) + 1 } : s))
      );
      addAudit('CREATE_VARIANT', 'Variant', v.name, `Added variant "${v.name}" (AED ${v.price})`);
      showToast(`Variant "${v.name}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add variant', 'error');
      throw err;
    }
  };

  const updateVariant = async (id: string, updates: Partial<ServiceVariant>) => {
    try {
      const updated = await apiService.updateVariant(id, updates);
      setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
      addAudit('UPDATE_VARIANT', 'Variant', id, `Updated variant ${JSON.stringify(updates)}`);
      showToast('Variant updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update variant', 'error');
      throw err;
    }
  };

  const deleteVariant = async (id: string) => {
    const target = variants.find((v) => v.id === id);
    try {
      await apiService.deleteVariant(id);
      setVariants((prev) => prev.filter((v) => v.id !== id));
      if (target?.serviceId) {
        setServices((prev) =>
          prev.map((s) => (s.id === target.serviceId ? { ...s, variantsCount: Math.max(0, (s.variantsCount || 1) - 1) } : s))
        );
      }
      addAudit('DELETE_VARIANT', 'Variant', id, `Deleted variant "${target?.name || id}"`);
      showToast('Variant removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete variant', 'error');
      throw err;
    }
  };

  // ADDONS CRUD
  const addAddon = async (adn: Omit<ServiceAddon, 'id'>) => {
    try {
      const created = await apiService.createAddon(adn);
      setAddons((prev) => [...prev, created]);
      addAudit('CREATE_ADDON', 'Addon', adn.name, `Created add-on "${adn.name}" (AED ${adn.price})`);
      showToast(`Add-on "${adn.name}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add add-on', 'error');
      throw err;
    }
  };

  const updateAddon = async (id: string, updates: Partial<ServiceAddon>) => {
    try {
      const updated = await apiService.updateAddon(id, updates);
      setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      addAudit('UPDATE_ADDON', 'Addon', id, `Updated add-on ${JSON.stringify(updates)}`);
      showToast('Add-on updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update add-on', 'error');
      throw err;
    }
  };

  const deleteAddon = async (id: string) => {
    const target = addons.find((a) => a.id === id);
    try {
      await apiService.deleteAddon(id);
      setAddons((prev) => prev.filter((a) => a.id !== id));
      addAudit('DELETE_ADDON', 'Addon', id, `Deleted add-on "${target?.name || id}"`);
      showToast('Add-on removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete add-on', 'error');
      throw err;
    }
  };

  // BOOKINGS CRUD
  const addBooking = async (bk: Omit<BookingDetails, 'id' | 'bookingRef' | 'timeline' | 'createdAt'>) => {
    try {
      const created = await apiService.createBooking(bk);
      setBookings((prev) => [created, ...prev]);
      
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: `New Booking ${created.bookingRef || created.id} received for ${created.serviceName}`,
        time: 'Just now',
        read: false,
        type: 'booking'
      };
      setNotifications((prev) => [newNotif, ...prev]);
      
      addAudit('CREATE_BOOKING', 'Booking', created.bookingRef || created.id, `Created booking`);
      showToast(`Booking ${created.bookingRef || created.id} created successfully`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create booking', 'error');
      throw err;
    }
  };

  const updateBooking = async (id: string, updates: Partial<BookingDetails>) => {
    try {
      const updated = await apiService.updateBooking(id, updates);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      addAudit('UPDATE_BOOKING', 'Booking', id, `Updated booking parameters`);
      showToast('Booking updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking', 'error');
      throw err;
    }
  };

  const assignCleanerToBooking = async (bookingId: string, cleanerId: string) => {
    const cleaner = cleaners.find((c) => c.id === cleanerId);
    if (!cleaner) return;

    try {
      await apiService.assignCleanerToBooking(bookingId, cleanerId);
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === bookingId) {
            const updatedTimeline = b.timeline.map((t) =>
              t.title === 'Assignment Pending' || t.title === 'Cleaner Assigned'
                ? { ...t, title: `Assigned to ${cleaner.fullName}`, completed: true, current: false }
                : t
            );
            if (!updatedTimeline.some((t) => t.title.includes('Assigned'))) {
              updatedTimeline.splice(1, 0, {
                title: `Assigned to ${cleaner.fullName}`,
                timestamp: 'Just now',
                completed: true,
              });
            }
            return {
              ...b,
              cleanerId,
              cleanerName: cleaner.fullName,
              cleanerPhone: cleaner.phone,
              cleanerAvatar: cleaner.avatar,
              cleanerRating: cleaner.rating,
              status: b.status === 'pending' ? 'assigned' : b.status,
              timeline: updatedTimeline,
            };
          }
          return b;
        })
      );

      setCleaners((prev) =>
        prev.map((c) => (c.id === cleanerId ? { ...c, status: 'on_job', activeBookingId: bookingId } : c))
      );

      const notif = {
        id: `notif-${Date.now()}`,
        title: `Cleaner ${cleaner.fullName} assigned to booking`,
        time: 'Just now',
        read: false,
        type: 'dispatch'
      };
      setNotifications((prev) => [notif, ...prev]);

      addAudit('ASSIGN_CLEANER', 'Booking', bookingId, `Assigned cleaner ${cleaner.fullName}`);
      showToast(`Assigned ${cleaner.fullName} to booking`);
    } catch (err: any) {
      showToast(err.message || 'Failed to assign cleaner', 'error');
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await apiService.updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === bookingId) {
            const updatedTimeline = [...b.timeline];
            if (status === 'completed') {
              updatedTimeline.push({
                title: 'Service Completed',
                timestamp: 'Just now',
                completed: true,
                current: true,
              });
            } else if (status === 'cancelled') {
              updatedTimeline.push({
                title: 'Booking Cancelled',
                timestamp: 'Just now',
                completed: true,
                current: true,
              });
            }
            return {
              ...b,
              status,
              paymentStatus: status === 'cancelled' && b.paymentStatus === 'paid' ? 'refunded' : b.paymentStatus,
              timeline: updatedTimeline,
            };
          }
          return b;
        })
      );
      
      const notif = {
        id: `notif-${Date.now()}`,
        title: `Booking status updated to ${status.replace('_', ' ')}`,
        time: 'Just now',
        read: false,
        type: 'status'
      };
      setNotifications((prev) => [notif, ...prev]);
      
      addAudit('UPDATE_BOOKING_STATUS', 'Booking', bookingId, `Status transitioned to "${status}"`);
      showToast(`Booking status changed to ${status.replace('_', ' ')}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking status', 'error');
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    const target = bookings.find((b) => b.id === id);
    try {
      await apiService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      addAudit('DELETE_BOOKING', 'Booking', target?.bookingRef || id, `Deleted booking`);
      showToast('Booking deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete booking', 'error');
      throw err;
    }
  };

  // CLEANERS CRUD
  const addCleaner = async (cln: Omit<CleanerProfile, 'id' | 'completedJobs'>) => {
    try {
      const created = await apiService.createCleaner(cln);
      setCleaners((prev) => [created, ...prev]);
      addAudit('CREATE_CLEANER', 'Cleaner', cln.fullName, `Added cleaner ${cln.fullName} (${cln.emirate})`);
      showToast(`Cleaner "${cln.fullName}" profile created`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add cleaner', 'error');
      throw err;
    }
  };

  const updateCleaner = async (id: string, updates: Partial<CleanerProfile>) => {
    try {
      const updated = await apiService.updateCleaner(id, updates);
      setCleaners((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      addAudit('UPDATE_CLEANER', 'Cleaner', id, `Updated cleaner details`);
      showToast('Cleaner profile updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update cleaner', 'error');
      throw err;
    }
  };

  const deleteCleaner = async (id: string) => {
    const target = cleaners.find((c) => c.id === id);
    try {
      await apiService.deleteCleaner(id);
      setCleaners((prev) => prev.filter((c) => c.id !== id));
      addAudit('DELETE_CLEANER', 'Cleaner', id, `Removed cleaner ${target?.fullName}`);
      showToast('Cleaner removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete cleaner', 'error');
      throw err;
    }
  };

  // CUSTOMERS CRUD
  const addCustomer = async (cst: Omit<CustomerProfile, 'id' | 'totalBookings' | 'totalSpent' | 'joinedDate'>) => {
    try {
      const created = await apiService.createCustomer(cst);
      setCustomers((prev) => [created, ...prev]);
      addAudit('CREATE_CUSTOMER', 'Customer', cst.name, `Added customer ${cst.name}`);
      showToast(`Customer "${cst.name}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add customer', 'error');
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<CustomerProfile>) => {
    try {
      const updated = await apiService.updateCustomer(id, updates);
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      addAudit('UPDATE_CUSTOMER', 'Customer', id, `Updated customer`);
      showToast('Customer record updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update customer', 'error');
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await apiService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      addAudit('DELETE_CUSTOMER', 'Customer', id, `Deleted customer`);
      showToast('Customer deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete customer', 'error');
      throw err;
    }
  };

  // COUPONS CRUD
  const addCoupon = async (cpn: Omit<Coupon, 'id' | 'usedCount'>) => {
    try {
      const created = await apiService.createCoupon(cpn);
      setCoupons((prev) => [created, ...prev]);
      addAudit('CREATE_COUPON', 'Coupon', cpn.code, `Created coupon ${cpn.code}`);
      showToast(`Coupon "${cpn.code}" created`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add coupon', 'error');
      throw err;
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    try {
      const updated = await apiService.updateCoupon(id, updates);
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      addAudit('UPDATE_COUPON', 'Coupon', id, `Updated coupon`);
      showToast('Coupon updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update coupon', 'error');
      throw err;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await apiService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      addAudit('DELETE_COUPON', 'Coupon', id, `Deleted coupon`);
      showToast('Coupon removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon', 'error');
      throw err;
    }
  };

  // GALLERY CRUD
  const addGalleryScene = async (scene: Omit<GalleryScene, 'id' | 'views'>) => {
    try {
      const created = await apiService.createGalleryScene(scene);
      setGallery((prev) => [created, ...prev]);
      addAudit('CREATE_GALLERY_SCENE', 'Gallery', scene.title, `Added transformation scene "${scene.title}"`);
      showToast(`Transformation scene "${scene.title}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add transformation scene', 'error');
      throw err;
    }
  };

  const updateGalleryScene = async (id: string, updates: Partial<GalleryScene>) => {
    try {
      const updated = await apiService.updateGalleryScene(id, updates);
      setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
      addAudit('UPDATE_GALLERY_SCENE', 'Gallery', id, `Updated transformation scene`);
      showToast('Transformation scene updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update transformation scene', 'error');
      throw err;
    }
  };

  const deleteGalleryScene = async (id: string) => {
    try {
      await apiService.deleteGalleryScene(id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
      addAudit('DELETE_GALLERY_SCENE', 'Gallery', id, `Deleted transformation scene`);
      showToast('Transformation scene removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete transformation scene', 'error');
      throw err;
    }
  };

  // TESTIMONIALS CRUD
  const addTestimonial = async (test: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
      const created = await apiService.createTestimonial(test);
      setTestimonials((prev) => [created, ...prev]);
      addAudit('CREATE_TESTIMONIAL', 'Testimonial', created.name, `Added testimonial from "${created.name}"`);
      showToast(`Testimonial from "${created.name}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add testimonial', 'error');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const updated = await apiService.updateTestimonial(id, updates);
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      addAudit('UPDATE_TESTIMONIAL', 'Testimonial', id, `Updated testimonial`);
      showToast('Testimonial updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update testimonial', 'error');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await apiService.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      addAudit('DELETE_TESTIMONIAL', 'Testimonial', id, `Deleted testimonial`);
      showToast('Testimonial removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete testimonial', 'error');
      throw err;
    }
  };

  // TEAM CRUD
  const addTeamMember = async (member: Omit<TeamMember, 'id' | 'createdAt'>) => {
    try {
      const created = await apiService.createTeamMember(member);
      setTeamMembers((prev) => [created, ...prev]);
      addAudit('CREATE_TEAM_MEMBER', 'TeamMember', created.name, `Added team member "${created.name}"`);
      showToast(`Team member "${created.name}" added`);
    } catch (err: any) {
      showToast(err.message || 'Failed to add team member', 'error');
      throw err;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const updated = await apiService.updateTeamMember(id, updates);
      setTeamMembers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
      addAudit('UPDATE_TEAM_MEMBER', 'TeamMember', id, `Updated team member`);
      showToast('Team member updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update team member', 'error');
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await apiService.deleteTeamMember(id);
      setTeamMembers((prev) => prev.filter((t) => t.id !== id));
      addAudit('DELETE_TEAM_MEMBER', 'TeamMember', id, `Deleted team member`);
      showToast('Team member removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete team member', 'error');
      throw err;
    }
  };

  // SETTINGS
  const updateSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const updated = await apiService.updateSettings(updates);
      setSettings(updated);
      addAudit('UPDATE_SETTINGS', 'Settings', 'global', `Updated system configuration`);
      showToast('System preferences saved');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
      throw err;
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCategories([]);
    setServices([]);
    setVariants([]);
    setAddons([]);
    setBookings([]);
    setCleaners([]);
    setCustomers([]);
    setCoupons([]);
    setGallery([]);
    setTestimonials([]);
    setTeamMembers([]);
    setAuditLogs([]);
    setSettings({
      companyName: 'Maidslife Home Services LLC',
      supportEmail: 'support@maidslife.ae',
      supportPhone: '+971 50 123 4567',
      timezone: 'Asia/Dubai (GMT+04:00)',
      currency: 'AED - UAE Dirham',
      autoAssignCleaners: true,
      customerNotifications: true,
      smsNotifications: true,
      maintenanceMode: false,
      taxRatePercent: 5,
    });
    showToast('System data reset to clean initial state', 'info');
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await apiService.login({ email, password });
      // Server sets HttpOnly cookie; no token stored on client
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      // Forward error for UI handling
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string, role: string = 'ops_manager') => {
    await apiService.signup({ name, email, password, role });
    showToast(`Admin account created successfully! Please sign in.`, 'success');
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch { }
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Logged out of admin portal', 'info');
  };

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        signup,
        logout,

        activeTab,
        setActiveTab,
        selectedBookingId,
        setSelectedBookingId,
        activeCity,
        setActiveCity,
        currentUserRole,
        setCurrentUserRole,
        searchQuery,
        setSearchQuery,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        services,
        addService,
        updateService,
        deleteService,

        variants,
        addVariant,
        updateVariant,
        deleteVariant,

        addons,
        addAddon,
        updateAddon,
        deleteAddon,

        bookings,
        addBooking,
        updateBooking,
        assignCleanerToBooking,
        updateBookingStatus,
        deleteBooking,

        cleaners,
        addCleaner,
        updateCleaner,
        deleteCleaner,

        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,

        gallery,
        transformations: gallery,
        addGalleryScene,
        addTransformation: addGalleryScene,
        updateGalleryScene,
        updateTransformation: updateGalleryScene,
    deleteTransformation: deleteGalleryScene,

    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,

    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,

    settings,
        updateSettings,

        auditLogs,
        notifications,
        markNotificationsAsRead,

        toast,
        showToast,
        notify: showToast,
        resetAllData,
        resetToFactoryDefaults: resetAllData,
        currentRole: currentUserRole,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

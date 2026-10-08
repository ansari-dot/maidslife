export type UserRole = 'Super Admin' | 'Dispatcher' | 'Support Representative';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  icon?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  servicesCount?: number;
}

export type BookingType = 'CLEANING' | 'LAUNDRY' | 'LAUNDRY_ITEM' | 'DELIVERY' | 'CUSTOM';

export interface BookingFieldConfig {
  key: string;
  label?: string;
  enabled: boolean;
  required: boolean;
  order: number;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  startingPrice: number;
  extraProfessionalPrice?: number;
  extraHourPrice?: number;
  image: string;
  iconName: string;
  features: string[];
  status: 'active' | 'draft' | 'archived';
  rating: number;
  bookingType?: BookingType;
  bookingFields?: BookingFieldConfig[];
  variants?: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    image?: string;
    isActive: boolean;
  }[];
}


export interface ServiceAddon {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  duration?: string;
  icon?: string;
  iconName?: string;
  image?: string;
  description?: string;
  isActive: boolean;
}

export type BookingStatus =
  | 'pending'
  | 'assigned'
  | 'in_transit'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BookingDetails {
  id: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  variantId?: string;
  variantName?: string;
  variants?: {
    variantId?: string;
    id?: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  hours?: number;
  professionalsCount?: number;
  frequency?: string;
  addonIds: string[];
  addonNames?: string[];
  cleanerId: string | null;
  cleanerName?: string;
  cleanerPhone?: string;
  cleanerAvatar?: string;
  cleanerRating?: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  status: BookingStatus;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  area: string; // e.g. "Dubai Marina", "Business Bay", "Downtown"
  addressDetails: string;
  paymentMethod: 'Cash on Delivery' | 'Credit Card' | 'Apple Pay';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  internalNotes?: string;
  customerNotes?: string;
  specialInstructions?: string;
  needCleaningMaterials?: boolean;
  timeline: {
    title: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
    description?: string;
  }[];
  createdAt: string;
}

export interface CleanerProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  emirate: 'Dubai' | 'Abu Dhabi' | 'Sharjah';
  currentLocation: string;
  rating: number;
  completedJobs: number;
  status: 'available' | 'on_job' | 'off_duty' | 'on_leave';
  skills: string[];
  activeBookingId?: string | null;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lifetimeSpend?: number;
  lastBookingDate: string;
  joinedDate: string;
  createdAt?: string;
  status: 'active' | 'inactive';
  preferredArea: string;
  notes?: string;
}

export interface PromoCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  isDisplayedOnCheckout?: boolean;
}

export type Coupon = PromoCoupon;

export interface Testimonial {
  id: string;
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  isActive: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  _id?: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface TransformationItem {
  id: string;
  title: string;
  category: string;
  serviceId: string;
  beforeImg: string;
  afterImg: string;
  cleanerName?: string;
  location?: string;
  customerReview?: string;
  isFeatured?: boolean;
  date?: string;
  sortOrder?: number;
  views?: number;
}

export type GalleryScene = TransformationItem;

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  userRole?: UserRole;
  role?: string;
  action: string;
  targetEntity?: string;
  target?: string;
  entityId?: string;
  changeDelta?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemSettings {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  currency: string;
  autoAssignCleaners: boolean;
  customerNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
  taxRatePercent: number;
}

export interface JobPosting {
  id: string;
  _id?: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  _id?: string;
  jobId?: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  cvFile?: string;
  cvOriginalName?: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  notes?: string;
  createdAt?: string;
}


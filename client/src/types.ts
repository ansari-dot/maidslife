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
  name: string;
  category: 'cleaning' | 'specialized' | 'personal' | 'maintenance';
  startingPrice: number;
  extraHourPrice?: number;
  priceUnit: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  img: string;
  badge?: string;
  description: string;
  highlights: string[];
  bookingType?: BookingType;
  bookingFields?: BookingFieldConfig[];
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: 'star' | 'clock' | 'shield' | 'smartphone';
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  service: string;
  verified: boolean;
}

export interface DubaiLocation {
  id: string;
  name: string;
  emirate: string;
  popular?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BookingDetails {
  serviceId: string;
  serviceName: string;
  hours: number;
  cleaners: number;
  withMaterials: boolean;
  frequency: 'one-time' | 'weekly' | 'bi-weekly';
  date: string;
  timeSlot: string;
  location: string;
  buildingName: string;
  apartmentNumber: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  promoCode: string;
  discount: number;
}

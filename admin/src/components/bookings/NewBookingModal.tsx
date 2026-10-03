import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Modal } from '../common/Modal';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const {
    services,
    variants,
    cleaners,
    customers,
    addBooking,
    activeCity,
  } = useAdmin();

  const [customerName, setCustomerName] = useState('Sarah Ahmed');
  const [customerPhone, setCustomerPhone] = useState('+971 50 111 2222');
  const [customerEmail, setCustomerEmail] = useState('sarah@example.com');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [variantId, setVariantId] = useState('');
  const [cleanerId, setCleanerId] = useState('');
  const [area, setArea] = useState('Dubai Marina');
  const [addressDetails, setAddressDetails] = useState('');
  const [date, setDate] = useState('2026-09-24');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Credit Card' | 'Apple Pay'>('Credit Card');
  const [customerNotes, setCustomerNotes] = useState('');
  const [error, setError] = useState('');

  // Auto-select first variant when service changes
  const availableVariants = variants.filter((v) => v.serviceId === serviceId);
  const currentVariant = variants.find((v) => v.id === (variantId || availableVariants[0]?.id));

  const handleCustomerSelect = (cstId: string) => {
    const c = customers.find((item) => item.id === cstId);
    if (c) {
      setCustomerName(c.name);
      setCustomerPhone(c.phone);
      setCustomerEmail(c.email);
      setArea(c.preferredArea);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Customer name and phone are required');
      return;
    }
    const chosenVariant = currentVariant || availableVariants[0];
    if (!chosenVariant) {
      setError('Please select a service variant');
      return;
    }

    const selectedService = services.find((s) => s.id === serviceId);
    const assignedCleaner = cleaners.find((c) => c.id === cleanerId);

    addBooking({
      customerId: 'cst-temp',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'customer@maidslife.ae',
      serviceId,
      serviceName: selectedService?.name || 'Cleaning Service',
      variantId: chosenVariant.id,
      variantName: chosenVariant.name,
      addonIds: [],
      cleanerId: cleanerId || null,
      cleanerName: assignedCleaner ? assignedCleaner.fullName : 'Pending Assignment',
      cleanerPhone: assignedCleaner?.phone,
      cleanerAvatar: assignedCleaner?.avatar,
      cleanerRating: assignedCleaner?.rating,
      date,
      timeSlot,
      status: cleanerId ? 'assigned' : 'pending',
      totalAmount: chosenVariant.price,
      subtotal: chosenVariant.originalPrice || chosenVariant.price,
      discountAmount: Math.max(0, (chosenVariant.originalPrice || chosenVariant.price) - chosenVariant.price),
      area,
      addressDetails: addressDetails.trim() || `${area}, ${activeCity}`,
      paymentMethod,
      paymentStatus: paymentMethod === 'Credit Card' ? 'paid' : 'pending',
      customerNotes: customerNotes.trim(),
      internalNotes: 'Created via Operations Dispatcher console',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Dispatch Booking"
      subtitle="Place a booking on behalf of customer and dispatch cleaners"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Customer Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Existing Customer Autofill
          </label>
          <select
            onChange={(e) => handleCustomerSelect(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
          >
            <option value="">-- Choose Existing Customer or type below --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone} - {c.preferredArea})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              UAE Phone *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Offering *
            </label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setVariantId('');
              }}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Variant & Size *
            </label>
            <select
              value={variantId || availableVariants[0]?.id || ''}
              onChange={(e) => setVariantId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              {availableVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — AED {v.price} ({v.duration})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Cleaner (Optional)
            </label>
            <select
              value={cleanerId}
              onChange={(e) => setCleanerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="">Leave in Pending Queue</option>
              {cleaners.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Area *</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="Dubai Marina">Dubai Marina</option>
              <option value="Business Bay">Business Bay</option>
              <option value="Downtown Dubai">Downtown Dubai</option>
              <option value="JLT (Jumeirah Lakes)">JLT (Jumeirah Lakes)</option>
              <option value="Dubai Hills Estate">Dubai Hills Estate</option>
              <option value="Palm Jumeirah">Palm Jumeirah</option>
              <option value="Sharjah City">Sharjah City</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="Credit Card">Credit Card (Stripe Paid)</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Apple Pay">Apple Pay</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Exact Street / Building / Apartment Address
          </label>
          <input
            type="text"
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            placeholder="e.g. Marina Heights Tower, Apt 1404, Dubai Marina"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer Special Instructions
          </label>
          <textarea
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Key in lockbox, pets on premise, eco-friendly supplies only..."
            rows={2}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
          >
            Dispatch & Create Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};

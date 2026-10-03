import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Users2,
  FileText,
  Star,
  Check,
  XCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BookingStatus } from '../../types';
import { Modal } from '../common/Modal';

export const BookingDetailsView: React.FC = () => {
  const {
    selectedBookingId,
    setSelectedBookingId,
    bookings,
    cleaners,
    assignCleanerToBooking,
    updateBookingStatus,
    updateBooking,
  } = useAdmin();

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedCleanerId, setSelectedCleanerId] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const booking = bookings.find((b) => b.id === selectedBookingId);

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Booking not found or has been removed.</p>
        <button
          onClick={() => setSelectedBookingId(null)}
          className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const assignedCleaner = cleaners.find((c) => c.id === booking.cleanerId);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Pending Assignment
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Cleaner Assigned
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Cleaner En Route
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  const handleSaveNotes = () => {
    if (internalNoteInput.trim()) {
      const updatedNotes = booking.internalNotes
        ? `${booking.internalNotes}\n[${new Date().toLocaleTimeString()}]: ${internalNoteInput.trim()}`
        : `[${new Date().toLocaleTimeString()}]: ${internalNoteInput.trim()}`;
      updateBooking(booking.id, { internalNotes: updatedNotes });
      setInternalNoteInput('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedBookingId(null)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookings</span>
          </button>
          <div className="h-5 w-[1px] bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {booking.bookingRef}
              </h2>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{booking.date ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{booking.timeSlot || ''}</span>
            </p>
          </div>
        </div>

        {/* Status transition controls */}
        <div className="flex items-center gap-2">
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <>
              {booking.status === 'pending' && (
                <button
                  onClick={() => setReassignModalOpen(true)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Assign Cleaner
                </button>
              )}
              {booking.status === 'assigned' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'in_transit')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark En Route</span>
                </button>
              )}
              {booking.status === 'in_transit' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Service</span>
                </button>
              )}
              {booking.status === 'in_progress' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Mark as Completed</span>
                </button>
              )}
              <button
                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
              >
                Cancel Booking
              </button>
            </>
          )}

          {(booking.status === 'completed' || booking.status === 'cancelled') && (
            <button
              onClick={() => updateBookingStatus(booking.id, 'in_progress')}
              className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Job</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
              {booking.customerName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{booking.customerPhone}</span>
            </p>
            <p className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{booking.customerEmail}</span>
            </p>
          </div>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Service Offering
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <p className="font-bold text-slate-900 text-sm">{booking.serviceName}</p>
            </div>
            <p className="text-xs text-slate-500 mt-1">{booking.variantName}</p>
            {booking.addonNames && booking.addonNames.length > 0 && (
              <p className="text-[11px] text-sky-600 font-medium mt-1">
                + {booking.addonNames.join(', ')}
              </p>
            )}
            {booking.needCleaningMaterials && (
              <p className="text-[11px] text-sky-600 font-medium mt-1">
                + Cleaning Materials Requested
              </p>
            )}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Price</span>
            <span className="font-extrabold text-slate-900 text-base">
              AED {booking.totalAmount}
            </span>
          </div>
        </div>

        {/* Assigned Staff Cleaner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Cleaner
              </span>
              <button
                onClick={() => setReassignModalOpen(true)}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
              >
                {booking.cleanerId ? 'Reassign' : 'Assign'}
              </button>
            </div>

            {assignedCleaner ? (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={assignedCleaner.avatar}
                  alt={assignedCleaner.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20"
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedCleaner.fullName)}&background=random`; }}
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{assignedCleaner.fullName}</p>
                  <p className="text-xs text-slate-500 font-mono">{assignedCleaner.phone}</p>
                  <p className="text-[11px] font-semibold text-amber-500 flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    <span>{assignedCleaner.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({assignedCleaner.completedJobs} jobs)</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-center">
                <p className="text-xs text-amber-800 font-semibold">No cleaner assigned yet</p>
                <button
                  onClick={() => setReassignModalOpen(true)}
                  className="mt-1 text-xs text-sky-600 font-bold hover:underline"
                >
                  + Select from duty pool
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location & Payment */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Location & Payment
            </span>
            <div className="flex items-start gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 text-xs">{booking.area}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {booking.addressDetails}
                </p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              {booking.paymentMethod}
            </span>
            <span
              className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded ${
                booking.paymentStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700'
                  : booking.paymentStatus === 'refunded'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {booking.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Timeline Tracker */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <h4 className="font-bold text-slate-900 text-sm mb-4">Booking Lifecycle Timeline</h4>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {booking.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start md:items-center gap-3 flex-1 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  step.completed
                    ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                    : step.current
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step.completed ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800">{step.title}</p>
                <p className="text-[10px] text-slate-400">{step.timestamp}</p>
                {step.description && (
                  <p className="text-[11px] text-sky-600 font-medium mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatcher Notes & Special Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Notes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Customer Instructions
            </h4>
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
            "{booking.customerNotes || 'No special customer instructions provided.'}"
          </p>
          {booking.specialInstructions && (
            <div className="mt-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Special Instructions
              </h4>
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100 italic">
                "{booking.specialInstructions}"
              </p>
            </div>
          )}
        </div>

        {/* Dispatcher Internal Log */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Dispatcher Internal Audit Notes
              </h4>
            </div>
            <pre className="text-xs font-sans text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap max-h-28 overflow-y-auto">
              {booking.internalNotes || 'No dispatcher notes recorded.'}
            </pre>
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={internalNoteInput}
              onChange={(e) => setInternalNoteInput(e.target.value)}
              placeholder="Add dispatcher remark..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNotes();
              }}
            />
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
            >
              Post Note
            </button>
          </div>
        </div>
      </div>

      {/* Reassign Cleaner Modal */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Assign Cleaner to Booking"
        subtitle={`Select staff for ${booking.bookingRef} in ${booking.area}`}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500 mb-2">
            Available cleaners in operating area:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cleaners.map((cleaner) => (
              <div
                key={cleaner.id}
                onClick={() => setSelectedCleanerId(cleaner.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedCleanerId === cleaner.id
                    ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cleaner.avatar}
                    alt={cleaner.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleaner.fullName)}&background=random`; }}
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{cleaner.fullName}</p>
                    <p className="text-[11px] text-slate-500">
                      {cleaner.currentLocation} • ★ {cleaner.rating.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      cleaner.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : cleaner.status === 'on_job'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cleaner.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setReassignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={!selectedCleanerId}
              onClick={() => {
                if (selectedCleanerId) {
                  assignCleanerToBooking(booking.id, selectedCleanerId);
                  setReassignModalOpen(false);
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-xl shadow-xs"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

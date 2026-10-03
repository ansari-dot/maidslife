import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarBlank,
  Clock,
  MapPin,
  CheckCircle,
  Spinner,
  ArrowRight,
  ShieldCheck,
  User,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; role?: string } | null;
  onBookNew?: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onBookNew,
}) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    clientApi
      .getUserBookings(user?.email)
      .then((data) => setBookings(data || []))
      .finally(() => setLoading(false));
  }, [isOpen, user?.email]);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle size={14} weight="bold" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-200">
            <ShieldCheck size={14} weight="bold" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock size={14} weight="bold" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* MODAL CARD */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start sm:items-center justify-between bg-slate-50/50 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-blue-50 text-primary flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <CalendarBlank size={20} weight="bold" className="sm:hidden" />
              <CalendarBlank size={24} weight="bold" className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight truncate">
                My Bookings &amp; Appointments
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {user ? `${user.name} (${user.email})` : 'Your cleaning history'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* TAB FILTERS */}
        <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {(['all', 'upcoming', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold rounded-xl capitalize transition-all cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>

        {/* BODY - BOOKINGS LIST */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Spinner size={28} className="animate-spin text-primary mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <CalendarBlank size={24} className="sm:hidden" />
                <CalendarBlank size={32} className="hidden sm:block" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">No Bookings Found</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">You haven&apos;t booked any cleaning services yet.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBookNew?.();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-grad-primary-cta px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-extrabold text-foreground shadow-sm hover:brightness-105 transition-all cursor-pointer"
              >
                Book Your First Cleaning <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id || b._id}
                className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        #{b.id || 'BK-1001'}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug break-words">
                      {b.serviceName || b.service?.name || 'Home Cleaning Service'}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">Total Amount</span>
                    <span className="text-sm sm:text-lg font-black text-primary leading-tight">
                      AED {b.amount || b.totalPrice || 299}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2.5 sm:p-3.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CalendarBlank size={14} className="text-primary shrink-0" />
                    <span className="truncate">
                      {b.scheduledAt
                        ? new Date(b.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Scheduled Date'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary shrink-0" />
                    <span className="truncate">
                      {b.scheduledAt
                        ? new Date(b.scheduledAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '09:00 AM'}{' '}
                      ({b.hours || '3 Hours'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2 mt-0.5">
                    <MapPin size={14} className="text-primary shrink-0" />
                    <span className="truncate">
                      {b.address || 'Downtown Dubai, UAE'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookNew?.();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-grad-primary-cta px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-extrabold text-foreground shadow-sm hover:brightness-105 transition-all cursor-pointer shrink-0"
          >
            <span>Book New Service</span> <ArrowRight size={14} weight="bold" />
          </button>
        </div>

      </div>
    </div>
  );
};

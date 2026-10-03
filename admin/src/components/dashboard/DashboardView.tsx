import React from 'react';
import {
  CalendarDays,
  DollarSign,
  Users2,
  Star,
  ArrowUpRight,
  Eye,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BookingStatus } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    bookings,
    cleaners,
    setActiveTab,
    setSelectedBookingId,
  } = useAdmin();

  // Metric Computations
  const totalBookingsCount = bookings.length;
  const activeCleanersOnDuty = cleaners.filter((c) => c.status === 'on_job').length;
  const totalCleaners = cleaners.length;
  const averageRating = (
    cleaners.reduce((acc, c) => acc + c.rating, 0) / (cleaners.length || 1)
  ).toFixed(2);

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' || b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + b.totalAmount, 0)
    .toLocaleString();

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-sky-700">
            ● In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-amber-700">
            ● Pending Assignment
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-blue-700">
            ● Assigned
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-indigo-700">
            ● In Transit
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
            ● Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-rose-700">
            ● Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time operations summary, dispatch telemetry, and 30-day business analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-600">
          <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
          <span className="font-mono tabular-nums">Sep 24, 2026</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-600 font-medium">System Online</span>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">{totalBookingsCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono tabular-nums">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total bookings in system</p>
        </div>

        {/* Card 2: Monthly Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs font-mono">
              AED
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              AED {totalRevenue}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono tabular-nums">
              Paid/Completed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total accumulated revenue</p>
        </div>

        {/* Card 3: Active Cleaners */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Cleaners On Duty</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {activeCleanersOnDuty} / {totalCleaners}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono tabular-nums">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{totalCleaners - activeCleanersOnDuty} cleaners on standby / break</p>
        </div>

        {/* Card 4: Customer Satisfaction */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Customer Satisfaction</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {averageRating} ★
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono tabular-nums">
              Average
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on cleaner ratings</p>
        </div>
      </div>



      {/* Row 4: Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Recent Bookings</h4>
            <p className="text-xs text-slate-400 mt-0.5">Live status updates and dispatch orders</p>
          </div>
          <button
            onClick={() => setActiveTab('bookings')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No bookings recorded yet. Create a new booking or sync with backend to get started.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3 px-5 font-bold text-sky-600 font-mono">{b.bookingRef}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{b.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{b.serviceName}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {b.date ? new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}, {b.timeSlot?.split('-')[0]?.trim() || ''}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono tabular-nums">AED {b.totalAmount}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setActiveTab('bookings');
                        }}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

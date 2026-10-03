import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Trash2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Edit2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BookingStatus, BookingDetails } from '../../types';
import { BookingDetailsView } from './BookingDetailsView';
import { NewBookingModal } from './NewBookingModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const BookingsView: React.FC = () => {
  const {
    bookings,
    selectedBookingId,
    setSelectedBookingId,
    services,
    cleaners,
    deleteBooking,
    updateBookingStatus,
    assignCleanerToBooking,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // If a booking is currently selected, display the detailed view
  if (selectedBookingId) {
    return <BookingDetailsView />;
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            Pending Assignment
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            Assigned
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            In Transit
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            Cancelled
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.area.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.serviceId === serviceFilter;
    const matchesArea = areaFilter === 'all' || b.area === areaFilter;
    const matchesDate = !dateFilter || b.date === dateFilter;

    return matchesSearch && matchesStatus && matchesService && matchesArea && matchesDate;
  });

  const areas = Array.from(new Set(bookings.map((b) => b.area)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bookings & Dispatch Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all customer bookings, cleaner assignments, and status transitions
          </p>
        </div>
        <button
          onClick={() => setNewBookingModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter Controls Row */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ref, customer, area..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Assignment</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Area Filter */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {/* Date Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none text-xs"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-slate-400 hover:text-slate-600 text-xs ml-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Cleaner</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition group">
                  {/* Ref ID */}
                  <td className="py-3 px-5">
                    <button
                      onClick={() => setSelectedBookingId(b.id)}
                      className="font-bold text-sky-600 hover:underline cursor-pointer"
                    >
                      {b.bookingRef}
                    </button>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {b.area}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{b.customerName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{b.customerPhone}</p>
                  </td>

                  {/* Service */}
                  <td className="py-3 px-4">
                    <p className="text-slate-800 font-semibold">{b.serviceName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{b.variantName}</p>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="text-slate-700 font-medium">
                      {b.date ? new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                    </p>
                    <p className="text-[11px] text-slate-400">{b.timeSlot || ''}</p>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">{getStatusBadge(b.status)}</td>

                  {/* Cleaner Assignment Column */}
                  <td className="py-3 px-4">
                    {b.cleanerId ? (
                      <div className="flex items-center gap-2">
                        {b.cleanerAvatar && (
                          <img
                            src={b.cleanerAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(b.cleanerName || 'Cleaner')}&background=random`; }}
                          />
                        )}
                        <span className="font-semibold text-slate-800 text-xs">
                          {b.cleanerName}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition"
                      >
                        + Assign Cleaner
                      </button>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 text-xs">AED {b.totalAmount}</span>
                    <span
                      className={`block text-[10px] font-semibold ${
                        b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {b.paymentStatus.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteBooking(deletingId);
        }}
        title="Delete Booking"
        message="Are you sure you want to permanently delete this booking record?"
      />
    </div>
  );
};

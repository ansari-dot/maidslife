import React, { useState } from 'react';
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const CustomersView: React.FC = () => {
  const { customers, bookings, setSelectedBookingId, setActiveTab } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.preferredArea.toLowerCase().includes(search.toLowerCase())
  );

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerBookings = activeCustomer
    ? bookings.filter((b) => b.customerName === activeCustomer.name || b.customerPhone === activeCustomer.phone)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Profiles, booking histories, lifetime spend, and service preferences across UAE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Customers Table */}
        <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden ${selectedCustomerId ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, phone, area..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {filteredCustomers.length} registered customers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4 text-center">Bookings</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Last Service</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCustomers.map((cst) => (
                  <tr
                    key={cst.id}
                    onClick={() => setSelectedCustomerId(cst.id === selectedCustomerId ? null : cst.id)}
                    className={`cursor-pointer transition ${
                      selectedCustomerId === cst.id ? 'bg-sky-50/60' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                          {cst.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{cst.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{cst.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {cst.preferredArea}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {cst.totalBookings}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      AED {(cst.lifetimeSpend || cst.totalSpent || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {cst.lastBookingDate}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(cst.id);
                        }}
                      >
                        History →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Detail Drawer */}
        {activeCustomer && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-extrabold flex items-center justify-center text-lg shadow-xs">
                    {activeCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{activeCustomer.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{activeCustomer.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Lifetime Spend</span>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    AED {(activeCustomer.lifetimeSpend || activeCustomer.totalSpent || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activeCustomer.totalBookings} orders
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeCustomer.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeCustomer.preferredArea}, UAE</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customer Since {activeCustomer.createdAt || activeCustomer.joinedDate}</span>
                </p>
              </div>

              {/* Past Bookings */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Linked Booking History
                </h4>
                {customerBookings.length > 0 ? (
                  <div className="space-y-2">
                    {customerBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setActiveTab('bookings');
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sky-600 text-xs">{b.bookingRef}</span>
                            <span className="text-xs text-slate-700 font-semibold">{b.serviceName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {b.date} • {b.timeSlot}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-xs">AED {b.totalAmount}</span>
                          <span className="block text-[10px] text-slate-400 capitalize">{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No recent bookings found for this customer.</p>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setActiveTab('bookings');
                }}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                + Place New Order for Customer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

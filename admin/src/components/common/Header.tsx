import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Bell,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface HeaderProps {
  onOpenNewBooking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewBooking }) => {
  const {
    activeCity,
    setActiveCity,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationsAsRead,
    currentUser,
    logout,
    resetAllData,
  } = useAdmin();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const cities: Array<'Dubai' | 'Abu Dhabi' | 'Sharjah'> = ['Dubai', 'Abu Dhabi', 'Sharjah'];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, cleaners, services, customers..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* City Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1 text-xs">
          <MapPin className="w-3.5 h-3.5 text-sky-600 ml-1.5" />
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                activeCity === city
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Quick New Booking Button */}
        {onOpenNewBooking && (
          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Booking</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markNotificationsAsRead();
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Dispatch & Job Alerts</span>
                <span className="text-[11px] text-sky-600 font-semibold cursor-pointer" onClick={markNotificationsAsRead}>
                  Mark read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-slate-50 rounded-lg transition text-left">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logged in User Profile & Logout Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {currentUser?.role || 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign out of Admin Console"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold border border-rose-200/80 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

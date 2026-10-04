import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderTree,
  Sparkles,
  SlidersHorizontal,
  PlusSquare,
  CalendarCheck2,
  Users2,
  UserCheck,
  TicketPercent,
  Image as ImageIcon,
  BarChart3,
  MessageSquareQuote,
  Users,
  Briefcase,
  Settings,
  ChevronRight,
  ShieldAlert,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { UserRole } from '../../types';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedBookingId,
    currentUserRole,
    setCurrentUserRole,
    bookings,
    cleaners,
    currentUser
  } = useAdmin();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const activeCleanersCount = cleaners.filter((c) => c.status === 'on_job').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'services', label: 'Services', icon: Sparkles },
        { id: 'addons', label: 'Add-ons', icon: PlusSquare },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: CalendarCheck2,
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'cleaners',
      label: 'Cleaners',
      icon: Users2,
      badge: `${activeCleanersCount} active`,
      badgeColor: 'bg-emerald-100 text-emerald-700 font-medium',
    },
    { id: 'customers', label: 'Customers', icon: UserCheck },
    { id: 'coupons', label: 'Promo Codes', icon: TicketPercent },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'careers', label: 'Careers & Hiring', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setSelectedBookingId(null);
    setActiveTab(id);
  };

  const roles: UserRole[] = ['Super Admin', 'Dispatcher', 'Support Representative'];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen select-none shrink-0 sticky top-0 z-30 transition-all duration-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
          <Sparkles className="w-5 h-5 fill-white/20 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-slate-900 tracking-tight">Maidslife</span>
            <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200/60 uppercase">
              Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium -mt-0.5">UAE Home-Services Ops</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.id === 'gallery' && (currentUser?.role === 'admin' || currentUserRole !== 'Super Admin')) {
            return null;
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User / RBAC profile card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 relative">
        <div
          onClick={() => setRoleMenuOpen(!roleMenuOpen)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition cursor-pointer border border-transparent hover:border-slate-200/60"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src="/uploads/cleaners/cleaner-4-medium.webp"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Noor Al Zaabi</p>
              <p className="text-[11px] text-sky-600 font-medium truncate flex items-center gap-1">
                {currentUserRole}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              roleMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Role Switcher Menu */}
        {roleMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-white rounded-xl shadow-lg border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-500" />
              Switch RBAC Role
            </div>
            <div className="space-y-1 mt-1">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentUserRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    currentUserRole === r
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{r}</span>
                  {currentUserRole === r && <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';

import { DashboardView } from './components/dashboard/DashboardView';
import { CategoriesView } from './components/categories/CategoriesView';
import { ServicesView } from './components/services/ServicesView';

import { AddonsView } from './components/addons/AddonsView';
import { BookingsView } from './components/bookings/BookingsView';
import { CleanersView } from './components/cleaners/CleanersView';
import { CouponsView } from './components/coupons/CouponsView';
import { GalleryView } from './components/gallery/GalleryView';
import { CustomersView } from './components/customers/CustomersView';
import { SettingsView } from './components/settings/SettingsView';
import { TestimonialsView } from './components/testimonials/TestimonialsView';
import { TeamView } from './components/team/TeamView';
import { CareersView } from './components/careers/CareersView';
import { ReportsView } from './components/reports/ReportsView';

import { LoginView } from './components/auth/LoginView';

const AdminLayout: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser, currentUserRole, setActiveTab } = useAdmin();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  if (currentUser && !['admin', 'super_admin'].includes(currentUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-800 font-sans">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Access Denied</h1>
        <p className="text-lg mb-6 text-slate-600">You do not have administrator privileges to access this panel.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'categories':
        return <CategoriesView />;
      case 'services':
        return <ServicesView />;

      case 'addons':
        return <AddonsView />;
      case 'bookings':
        return <BookingsView />;
      case 'cleaners':
        return <CleanersView />;
      case 'coupons':
        return <CouponsView />;
      case 'gallery':
        if (currentUser?.role === 'admin') {
          return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-800 font-sans mt-20">
              <h1 className="text-3xl font-bold mb-3 text-slate-900">Access Denied</h1>
              <p className="text-sm mb-5 text-slate-600">You must be a Super Admin to access the Gallery.</p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
              >
                Back to Dashboard
              </button>
            </div>
          );
        }
        return <GalleryView />;
      case 'customers':
        return <CustomersView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'testimonials':
        return <TestimonialsView />;
      case 'team':
        return <TeamView />;
      case 'careers':
        return <CareersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50/70 overflow-hidden text-slate-800 antialiased font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top App Header */}
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
}

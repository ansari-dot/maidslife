import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WelcomePopup } from './components/WelcomePopup';
import { AuthModal } from './components/AuthModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { LocationModal, LocationData } from './components/LocationModal';
import { clientApi } from './services/api';
import { trackPageView, trackEvent } from './analytics';

// Pages imported from src/pages directory
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';

// React Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('React ErrorBoundary caught an exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center bg-amber-50 text-amber-800 rounded-xl my-4 text-xs font-bold border border-amber-200">
          Component error recovered automatically.{' '}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="underline ml-2 cursor-pointer"
          >
            Reload Component
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Region URL Helper - extracts region prefix (e.g. /ae, /ae-en, /sa) and sub-path
const parseRegionFromPath = (path: string) => {
  const match = (path || '/').match(/^\/([a-z]{2}(?:-[a-z]{2})?)(?:\/|$)(.*)/i);
  if (match) {
    const code = match[1].toLowerCase();
    const subPath = '/' + (match[2] || '');
    return { region: code, path: subPath === '//' ? '/' : subPath };
  }
  return { region: 'ae', path: path || '/' };
};

export function App() {
  const initialParsed = parseRegionFromPath(window.location.pathname);
  const [regionCode, setRegionCode] = useState<string>(initialParsed.region);
  const [currentPath, setCurrentPath] = useState<string>(initialParsed.path);

  const [routeState, setRouteState] = useState<any>(null);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [marketingSettings, setMarketingSettings] = useState<any>(null);

  // Auth & Bookings & Location Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(() => {
    try {
      const saved = localStorage.getItem('maidslife_selected_location');
      return saved ? JSON.parse(saved) : undefined;
    } catch (_) {
      return undefined;
    }
  });

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // URL Region Prefix Normalization on Initial Load
  useEffect(() => {
    const parsed = parseRegionFromPath(window.location.pathname);
    const fullRegionalPath = `/${parsed.region}${parsed.path === '/' ? '' : parsed.path}`;
    if (window.location.pathname !== fullRegionalPath) {
      window.history.replaceState(null, '', fullRegionalPath);
    }
  }, []);

  useEffect(() => {
    // Update document title based on route
    let pageTitle = 'Maidslife - #1 Super App for Home Services in UAE';
    if (currentPath.startsWith('/services')) pageTitle = 'Services | Maidslife UAE';
    else if (currentPath.startsWith('/about')) pageTitle = 'About Us | Maidslife UAE';
    else if (currentPath.startsWith('/careers')) pageTitle = 'Careers | Maidslife UAE';
    else if (currentPath.startsWith('/contact')) pageTitle = 'Contact | Maidslife UAE';
    else if (currentPath.startsWith('/booking')) pageTitle = 'Booking | Maidslife UAE';
    else if (currentPath.startsWith('/service/')) pageTitle = 'Service Details | Maidslife UAE';

    document.title = pageTitle;

    // Track page views on route changes
    trackPageView(`/${regionCode}${currentPath === '/' ? '' : currentPath}`, pageTitle);
  }, [currentPath, regionCode]);

  useEffect(() => {
    // Restore session if user was logged in
    clientApi.getCurrentUser().then(u => {
      if (u) setUser(u);
    });

    clientApi.getMarketingSettings().then(res => {
      if (res) setMarketingSettings(res);
    });

    // Check if initial URL was /login or /signup
    const parsed = parseRegionFromPath(window.location.pathname);
    if (parsed.path === '/login' || parsed.path === '/signup') {
      openAuthModal(parsed.path === '/signup' ? 'signup' : 'login');
      const cleanPath = `/${parsed.region}`;
      window.history.replaceState(null, '', cleanPath);
      setCurrentPath('/');
    }

    const handlePopState = (e: PopStateEvent) => {
      const p = parseRegionFromPath(window.location.pathname);
      setRegionCode(p.region);
      setCurrentPath(p.path);
      setRouteState(e.state);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-show Location Picker Modal popup on website load removed as per user request

  const navigate = (newPath: string, state?: any) => {
    if (newPath === '/login' || newPath === '/signup') {
      openAuthModal(newPath === '/signup' ? 'signup' : 'login');
      return;
    }

    const parsed = parseRegionFromPath(newPath);
    const targetCleanPath = parsed.path;
    const targetRegion = parsed.region !== 'ae' ? parsed.region : regionCode;
    const fullRegionalPath = `/${targetRegion}${targetCleanPath === '/' ? '' : targetCleanPath}`;

    window.history.pushState(state || null, '', fullRegionalPath);
    setRegionCode(targetRegion);
    setCurrentPath(targetCleanPath);
    setRouteState(state || null);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    trackEvent('logout');
    clientApi.logout();
    setUser(null);
  };

  // Extract active nav title for Navbar
  const getActiveNav = () => {
    if (currentPath === '/') return 'Home';
    if (currentPath.startsWith('/services') || currentPath.startsWith('/service')) return 'Services';
    if (currentPath.startsWith('/about')) return 'About';
    if (currentPath.startsWith('/careers')) return 'Careers';
    if (currentPath.startsWith('/contact')) return 'Contact';
    return '';
  };

  const handleNavClick = (nav: string) => {
    switch (nav) {
      case 'Home':
        navigate('/');
        break;
      case 'Services':
        navigate('/services');
        break;
      case 'About':
        navigate('/about');
        break;
      case 'Careers':
        navigate('/careers');
        break;
      case 'Contact':
        navigate('/contact');
        break;
      default:
        navigate('/');
    }
  };

  // Derive serviceId from path
  const getServiceIdFromPath = () => {
    if (routeState?.serviceId) return routeState.serviceId;
    if (currentPath.startsWith('/service/')) {
      return currentPath.replace('/service/', '');
    }
    return 'home-cleaning';
  };

  // Render main page content based on currentPath
  const renderMainContent = () => {
    if (currentPath === '/payment/success' || currentPath === '/payment-success') {
      return <PaymentSuccessPage />;
    }

    if (currentPath === '/payment/failed' || currentPath === '/payment-failed') {
      return <PaymentFailedPage />;
    }

    if (currentPath === '/payment/cancel' || currentPath === '/payment-cancel' || currentPath === '/payment/cancelled') {
      return <PaymentCancelledPage />;
    }

    if (currentPath === '/booking') {
      return (
        <BookingPage
          initialServiceId={routeState?.serviceId || 'home-cleaning'}
          initialVariantId={routeState?.variantId}
          initialAddonIds={routeState?.addonIds || []}
          onBackToHome={() => navigate('/')}
        />
      );
    }

    if (currentPath === '/services') {
      return (
        <ServicesPage
          onServiceSelect={(serviceId) => {
            navigate(`/service/${serviceId}`, { serviceId });
          }}
          onBookClick={(serviceId, variantId) => {
            navigate('/booking', { serviceId, variantId });
          }}
        />
      );
    }

    if (currentPath.startsWith('/service/') || currentPath === '/service') {
      return (
        <ServiceDetailPage
          serviceId={getServiceIdFromPath()}
          onBackToHome={() => navigate('/services')}
          onBookClick={(serviceId, variantId, addonIds) => {
            navigate('/booking', { serviceId, variantId, addonIds });
          }}
        />
      );
    }

    if (currentPath === '/about') {
      return (
        <AboutPage
          onBookClick={() => navigate('/booking')}
          onExploreServices={() => navigate('/services')}
        />
      );
    }

    if (currentPath === '/careers') {
      return <CareersPage onBookClick={() => navigate('/booking')} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onBookClick={() => navigate('/booking')} />;
    }

    // Default to Home Page
    return (
      <HomePage
        onBookClick={() => navigate('/booking')}
        onServiceClick={(serviceTitle) => {
          const slug = serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          navigate(`/service/${slug}`, { serviceId: slug });
        }}
        onViewAllServices={() => navigate('/services')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col justify-between">
      <div>
        {/* ── PERSISTENT TOP FLOATING NAVBAR ── */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            activeNav={getActiveNav()}
            onNavClick={handleNavClick}
            onBookClick={() => navigate('/booking')}
            onLoginClick={() => openAuthModal('login')}
            onLogoutClick={handleLogout}
            onMyBookingsClick={() => setIsBookingsModalOpen(true)}
            onLocationClick={() => setIsLocationModalOpen(true)}
            selectedLocation={selectedLocation}
            user={user}
          />
        </div>

        {/* ── PAGE ROUTER ── */}
        <main>{renderMainContent()}</main>
      </div>

      {/* ── PERSISTENT FOOTER ── */}
      <Footer
        onBookClick={() => navigate('/booking')}
        onNavigate={(path) => navigate(path)}
      />

      {/* ── PERSISTENT FLOATING WHATSAPP BUTTON ── */}
      <WhatsAppButton />

      {/* ── LOCATION PICKER MODAL POPUP (JustLife Style) ── */}
      <ErrorBoundary>
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false);
            sessionStorage.setItem('maidslife_location_dismissed', 'true');
          }}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            sessionStorage.setItem('maidslife_location_dismissed', 'true');
            // Dynamic region code directly from map location!
            const newRegion = (loc.countryCode || 'ae').toLowerCase();
            setRegionCode(newRegion);
            const fullRegionalPath = `/${newRegion}${currentPath === '/' ? '' : currentPath}`;
            window.history.replaceState(null, '', fullRegionalPath);
          }}
          currentLocation={selectedLocation}
        />
      </ErrorBoundary>

      {/* ── LOGIN / SIGNUP MODAL POPUP ── */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccessLogin={(loggedInUser) => setUser(loggedInUser)}
        />
      )}

      {/* ── MY BOOKINGS MODAL ── */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        user={user}
        onBookNew={() => navigate('/booking')}
      />
    </div>
  );
}

export default App;

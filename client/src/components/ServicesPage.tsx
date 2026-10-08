import React, { useState, useEffect } from 'react';
import {
  House,
  Buildings,
  Sparkle,
  Truck,
  HardHat,
  Drop,
  ArrowRight,
  Check,
  CalendarBlank,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';
import { ServiceItem, ServiceCategory } from '../data/servicesData';

const M = "'Manrope', sans-serif";

const getIconComponent = (iconName?: string): React.ElementType => {
  switch (iconName?.toLowerCase()) {
    case 'buildings':
      return Buildings;
    case 'sparkle':
      return Sparkle;
    case 'truck':
      return Truck;
    case 'hardhat':
      return HardHat;
    case 'drop':
      return Drop;
    default:
      return House;
  }
};

interface ServicesPageProps {
  onServiceSelect?: (serviceTitle: string) => void;
  onBookClick?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onServiceSelect, onBookClick }) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    Promise.all([
      clientApi.getServices(),
      clientApi.getCategories()
    ]).then(([servicesData, categoriesData]) => {
      if (isMounted) {
        setServicesList(servicesData);
        setCategories(categoriesData);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = activeCategory === 'all' 
    ? servicesList 
    : servicesList.filter(s => s.categoryId === activeCategory);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pt-[130px] pb-24">
      
      {/* ── HEADER SECTION ── */}
      <div className="w-full pt-10 pb-12 px-6 sm:px-12 text-center">
        <div className="mx-auto max-w-[800px]">
          <div
            className="inline-flex items-center gap-2 bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase mb-6"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px', borderRadius: '2px' }}
          >
            <span className="opacity-70">—</span>
            OUR SERVICES
            <span className="opacity-70">—</span>
          </div>

          <h1
            className="text-[#0C3352] leading-tight"
            style={{ fontFamily: M, fontWeight: 800, fontSize: '42px' }}
          >
            Professional Solutions <br />
            <span className="text-[#0084FF]">Tailored For You</span>
          </h1>

          <p
            className="mt-6 text-[#5A6E7F] max-w-[600px] mx-auto"
            style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
          >
            Explore our comprehensive range of high-quality services. Designed with precision, delivered with excellence.
          </p>
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#0C3352] text-white'
                : 'bg-white text-[#5A6E7F] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
            }`}
            style={{ fontFamily: M, borderRadius: '2px' }}
          >
            All Services
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id.toString())}
              className={`px-6 py-2.5 text-sm font-bold transition-colors ${
                activeCategory === category.id.toString()
                  ? 'bg-[#0C3352] text-white'
                  : 'bg-white text-[#5A6E7F] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
              style={{ fontFamily: M, borderRadius: '2px' }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── SERVICES GRID (CARD UI WITH SHARP EDGES) ── */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#0084FF] border-t-transparent"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 text-[#5A6E7F]" style={{ fontFamily: M }}>
            No services found for the selected category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => {
              const Icon = getIconComponent(service.iconName);
              
              return (
                <div 
                  key={service.id} 
                  className="bg-white border border-[#E2E8F0] flex flex-col group hover:shadow-xl transition-shadow duration-300"
                  style={{ borderRadius: '2px' }}
                >
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Category badge overlay */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#0084FF] uppercase tracking-wide border border-white" style={{ borderRadius: '2px' }}>
                      {categories.find(c => c.id.toString() === service.categoryId?.toString())?.name || 'Service'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center bg-[#F1F5F9] text-[#0084FF] border border-[#E2E8F0]" style={{ borderRadius: '2px' }}>
                        <Icon size={20} weight="regular" />
                      </div>
                      <h3 
                        className="text-xl text-[#0C3352] leading-tight"
                        style={{ fontFamily: M, fontWeight: 800 }}
                      >
                        {service.name}
                      </h3>
                    </div>

                    <p 
                      className="text-[#5A6E7F] mb-6 flex-grow"
                      style={{ fontFamily: M, fontSize: '14px', lineHeight: '22px' }}
                    >
                      {service.description.length > 120 ? service.description.substring(0, 120) + '...' : service.description}
                    </p>

                    {/* Features List (up to 3) */}
                    <div className="space-y-2 mb-8">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check size={16} weight="bold" className="text-[#0084FF] shrink-0 mt-0.5" />
                          <span className="text-[#0C3352] text-sm font-semibold" style={{ fontFamily: M }}>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#F1F5F9]">
                      <button
                        onClick={() => onServiceSelect?.(service.slug || service.id.toString())}
                        className="flex items-center justify-center gap-2 bg-[#F8FAFC] text-[#0C3352] hover:bg-[#E2E8F0] py-2.5 text-sm font-bold transition-colors border border-[#E2E8F0]"
                        style={{ fontFamily: M, borderRadius: '2px' }}
                      >
                        Details
                      </button>

                      <button
                        onClick={onBookClick}
                        className="flex items-center justify-center gap-2 bg-[#0C3352] text-white hover:bg-[#0084FF] py-2.5 text-sm font-bold transition-colors"
                        style={{ fontFamily: M, borderRadius: '2px' }}
                      >
                        Book Now
                        <ArrowRight size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ServicesPage;

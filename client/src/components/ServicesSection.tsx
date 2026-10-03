import React from 'react';

const M = "'Manrope', sans-serif";

const services = [
  {
    id: 1,
    label: 'Home cleaning',
    img: '/service_home_cleaning.png',
  },
  {
    id: 2,
    label: 'Furniture Cleaning',
    img: '/service_furniture_cleaning.png',
  },
  {
    id: 3,
    label: 'Deep Cleaning',
    img: '/service_deep_cleaning.png',
  },
  {
    id: 4,
    label: "Premium Men's Salon",
    // Unsplash free-use photo — barber
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 5,
    label: 'Laundry and dry Cleaning',
    // Unsplash free-use photo — laundry
    img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop&auto=format',
  },
];

interface ServicesSectionProps {
  onServiceClick?: (label: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onServiceClick }) => {
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-8">
      <div className="mx-auto max-w-[1280px]">

        {/* Heading */}
        <div className="text-center">
          <h2
            className="text-foreground"
            style={{ fontFamily: M, fontWeight: 700, }}
          >
            Leave your to-do list to us!
          </h2>
          <p
            className="mt-2 text-muted"
            style={{ fontFamily: M, fontSize: '15px', fontWeight: 400, lineHeight: '22px' }}
          >
            Check out some of our top Services
          </p>
        </div>

        {/* Services Row */}
        <div className="mt-10 flex items-start justify-center gap-8 sm:gap-12 flex-wrap sm:flex-nowrap">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceClick?.(service.label)}
              className="flex flex-col items-center gap-3 group focus:outline-none"
            >
              {/* Circular image */}
              <div className="h-[120px] w-[120px] overflow-hidden rounded-full border-2 border-slate-100 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <img
                  src={service.img}
                  alt={service.label}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Label */}
              <span
                className="text-center text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: M, fontSize: '13px', fontWeight: 600, lineHeight: '18px' }}
              >
                {service.label}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { OurServicesSection } from '../components/OurServicesSection';
import { WhySection } from '../components/WhySection';
import { TeamSection } from '../components/TeamSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface HomePageProps {
  onBookClick?: () => void;
  onServiceClick?: (serviceTitle: string) => void;
  onViewAllServices?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onBookClick,
  onServiceClick,
  onViewAllServices,
}) => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <HeroSection
        onBookClick={onBookClick}
        onExploreClick={scrollToServices}
        navbarHeight={88}
      />

      {/* 2. ABOUT US */}
      <div id="about">
        <AboutSection />
      </div>

      {/* 3. OUR SERVICES */}
      <div id="services">
        <OurServicesSection
          onServiceClick={onServiceClick}
          onViewAllClick={onViewAllServices}
        />
      </div>

      {/* 4. WHY CHOOSE US */}
      <WhySection />

      {/* 5. OUR TEAM */}
      <TeamSection onBookClick={onBookClick} />

      {/* 6. TESTIMONIALS */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;

export interface ServiceVariant {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  description: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  duration?: string;
  icon?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  iconName: string;
  features: string[];
  variants: ServiceVariant[];
  addons: ServiceAddon[];
}

export const CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-residential',
    name: 'Residential Cleaning',
    slug: 'residential-cleaning',
    description: 'Routine and thorough cleaning for apartments, villas, and townhouses.',
    iconName: 'House',
  },
  {
    id: 'cat-upholstery',
    name: 'Specialized & Upholstery',
    slug: 'specialized-upholstery',
    description: 'Deep steam cleaning for sofas, carpets, mattresses, and curtains.',
    iconName: 'Sparkle',
  },
  {
    id: 'cat-ac-maintenance',
    name: 'AC & Maintenance',
    slug: 'ac-maintenance',
    description: 'AC unit washing, duct sanitization, and cooling maintenance.',
    iconName: 'Drop',
  },
  {
    id: 'cat-commercial',
    name: 'Commercial & Office',
    slug: 'commercial-office',
    description: 'Scheduled cleaning and disinfection for offices and retail spaces.',
    iconName: 'Buildings',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  // 1. Home Cleaning
  {
    id: 'home-cleaning',
    categoryId: 'cat-residential',
    name: 'Home Cleaning Services',
    slug: 'home-cleaning-services',
    tagline: 'Spotless living rooms, bedrooms, and kitchens for your daily comfort.',
    description: 'Keep your home fresh and tidy with our professional maids. We take care of dusting, vacuuming, mopping, kitchen dishwashing, and bathroom sanitization.',
    startingPrice: 299,
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80',
    iconName: 'House',
    features: [
      'Living rooms, bedrooms & hallway cleaning',
      'Kitchen counter & dishwashing wipe down',
      'Bathroom deep disinfection & floor mopping',
      'Bed making & trash removal',
    ],
    variants: [
      {
        id: 'hc-studio',
        name: 'Studio Apartment',
        price: 299,
        originalPrice: 399,
        duration: '2 Hours',
        description: 'Perfect for compact studio apartments. 1 Maid for 2 hours.',
      },
      {
        id: 'hc-1br',
        name: '1 Bedroom Apartment',
        price: 349,
        originalPrice: 449,
        duration: '2.5 Hours',
        description: 'Comprehensive cleaning for 1BR. 1 Maid for 2.5 hours.',
      },
      {
        id: 'hc-2br',
        name: '2 Bedroom Apartment',
        price: 449,
        originalPrice: 599,
        duration: '3.5 Hours',
        description: 'Complete detail clean for 2BR homes. 2 Maids for 2 hours.',
      },
      {
        id: 'hc-3br-villa',
        name: '3 Bedroom Villa / Townhouse',
        price: 649,
        originalPrice: 849,
        duration: '5 Hours',
        description: 'Full multi-story home clean. 2 Maids for 4 hours.',
      },
    ],
    addons: [
      { id: 'add-fridge', name: 'Refrigerator Internal Wash', price: 49 },
      { id: 'add-oven', name: 'Oven & Stove Degreasing', price: 49 },
      { id: 'add-balcony', name: 'Balcony Jet Wash', price: 69 },
      { id: 'add-ironing', name: 'Laundry & Clothes Ironing (1 Hr)', price: 39 },
      { id: 'add-cupboards', name: 'Inside Cupboard Organizing', price: 59 },
    ],
  },

  // 2. Deep Cleaning
  {
    id: 'deep-cleaning',
    categoryId: 'cat-residential',
    name: 'Deep Cleaning Services',
    slug: 'deep-cleaning-services',
    tagline: 'Heavy-duty medical grade sanitization for hidden dirt and stubborn grime.',
    description: 'Thorough, top-to-bottom scrub down using specialized machinery, single-disc floor scrubbers, steam equipment, and eco-friendly disinfectants.',
    startingPrice: 494,
    rating: 4.95,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&auto=format&fit=crop&q=80',
    iconName: 'Sparkle',
    features: [
      'Single-disc machine floor scrubbing & grout cleaning',
      'Appliances deep degreasing (Oven, Fridge, Hood)',
      'Cabinet & wardrobe interior steam wash',
      'Window glass & frame detailed wash',
    ],
    variants: [
      {
        id: 'dc-studio',
        name: 'Studio Deep Clean',
        price: 394,
        originalPrice: 599,
        duration: '2.5 Hours',
        description: 'Medical grade deep clean for studios.',
      },
      {
        id: 'dc-1br',
        name: '1 Bedroom Deep Clean',
        price: 494,
        originalPrice: 699,
        duration: '3.5 Hours',
        description: 'Intensive deep clean for 1 Bedroom apartments.',
      },
      {
        id: 'dc-2br',
        name: '2 Bedroom Deep Clean',
        price: 649,
        originalPrice: 899,
        duration: '4.5 Hours',
        description: 'Complete 2BR deep clean with floor scrubbing.',
      },
      {
        id: 'dc-3br-villa',
        name: '3 Bedroom Villa Deep Clean',
        price: 794,
        originalPrice: 1099,
        duration: '6 Hours',
        description: 'Full team deep clean for 3BR Villa & outdoor terrace.',
      },
    ],
    addons: [
      { id: 'add-grout-seal', name: 'Tile Grout Sanitization & Polish', price: 89 },
      { id: 'add-steam-vent', name: 'Air Vent Grille Steam Scrub', price: 79 },
      { id: 'add-chandelier', name: 'Chandelier & High Fixture Wash', price: 99 },
    ],
  },

  // 3. Sofa & Couch Cleaning
  {
    id: 'sofa-cleaning',
    categoryId: 'cat-upholstery',
    name: 'Sofa & Upholstery Steam Cleaning',
    slug: 'sofa-upholstery-cleaning',
    tagline: 'Deep hot water extraction & stain removal for fabric and leather sofas.',
    description: 'Restore the beauty and aroma of your sofas and chairs. We extract dust mites, spill stains, odors, and bacteria using high-pressure steam.',
    startingPrice: 149,
    rating: 4.88,
    reviewsCount: 750,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80',
    iconName: 'Sparkle',
    features: [
      'High-pressure hot steam extraction',
      'Stubborn food & pet stain treatment',
      'Fabric protection & anti-allergen spray',
      'Fast 2-hour dry time process',
    ],
    variants: [
      {
        id: 'sofa-2seater',
        name: '2-Seater Sofa / Couch',
        price: 149,
        originalPrice: 220,
        duration: '1 Hour',
        description: 'Shampooing & steam extraction for 2 seater sofa.',
      },
      {
        id: 'sofa-3seater',
        name: '3-Seater Sofa / Couch',
        price: 199,
        originalPrice: 280,
        duration: '1.5 Hours',
        description: 'Deep stain removal for 3 seater couch.',
      },
      {
        id: 'sofa-5seater',
        name: '5-Seater L-Shape / Sectional',
        price: 299,
        originalPrice: 420,
        duration: '2 Hours',
        description: 'Full sectional sofa steam shampooing.',
      },
      {
        id: 'sofa-7seater',
        name: '7-Seater Large Majlis / Sofa Set',
        price: 399,
        originalPrice: 550,
        duration: '2.5 Hours',
        description: 'Extensive majlis sofa deep steam treatment.',
      },
    ],
    addons: [
      { id: 'add-cushion', name: 'Extra Throw Cushions (Set of 4)', price: 49 },
      { id: 'add-fabric-guard', name: 'Stain Guard Fabric Coating', price: 79 },
      { id: 'add-sanitizer-spray', name: 'Anti-Bacterial UV Fogging', price: 59 },
    ],
  },

  // 4. AC Cleaning & Maintenance
  {
    id: 'ac-cleaning',
    categoryId: 'cat-ac-maintenance',
    name: 'AC Cleaning & Duct Sanitization',
    slug: 'ac-cleaning-maintenance',
    tagline: 'Improve air quality, lower electricity bills, and freeze cool.',
    description: 'Complete AC coil pressure washing, filter deep clean, drain pan Flushing, and antibacterial duct fogging to keep your cooling crisp and odor-free.',
    startingPrice: 150,
    rating: 4.92,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&auto=format&fit=crop&q=80',
    iconName: 'Drop',
    features: [
      'High-pressure coil pressure washing',
      'Filter washing & evaporator sanitization',
      'Drain line flushing to prevent water leaks',
      'Airflow & thermostat diagnostic check',
    ],
    variants: [
      {
        id: 'ac-1unit',
        name: 'Split AC (1 Unit)',
        price: 150,
        originalPrice: 220,
        duration: '1 Hour',
        description: 'Complete indoor & outdoor unit wash for 1 Split AC.',
      },
      {
        id: 'ac-2units',
        name: 'Split AC (2 Units)',
        price: 270,
        originalPrice: 400,
        duration: '1.5 Hours',
        description: 'Full service for 2 Split AC units.',
      },
      {
        id: 'ac-3units',
        name: 'Split AC (3 Units)',
        price: 380,
        originalPrice: 550,
        duration: '2 Hours',
        description: 'Full service for 3 Split AC units.',
      },
      {
        id: 'ac-central-duct',
        name: 'Central AC Duct & Grill Deep Wash',
        price: 490,
        originalPrice: 700,
        duration: '3 Hours',
        description: 'Complete duct camera inspection & air fogging.',
      },
    ],
    addons: [
      { id: 'add-gas-topup', name: 'Freon Gas Top-Up (R410A / R22)', price: 120 },
      { id: 'add-duct-disinfect', name: 'Anti-Mold Duct Disinfection', price: 89 },
    ],
  },

  // 5. Move-In / Move-Out Cleaning
  {
    id: 'move-in-out',
    categoryId: 'cat-residential',
    name: 'Move-In / Move-Out Cleaning',
    slug: 'move-in-move-out-cleaning',
    tagline: 'Guaranteed landlord deposit return & fresh key handovers.',
    description: 'Ensure your old or new property is 100% spotless. We clean inside every drawer, closet, appliance, light fixture, and balcony.',
    startingPrice: 450,
    rating: 4.96,
    reviewsCount: 640,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    iconName: 'House',
    features: [
      'Inspection-ready deposit refund cleaning',
      'Inside kitchen cabinets & wardrobes scrubbed',
      'Oven, fridge & hood deep degreasing',
      'Balcony, windows & tracks wash',
    ],
    variants: [
      {
        id: 'm-studio',
        name: 'Studio Move-In/Out',
        price: 450,
        originalPrice: 600,
        duration: '3 Hours',
        description: 'Full empty studio transformation.',
      },
      {
        id: 'm-1br',
        name: '1 Bedroom Move-In/Out',
        price: 550,
        originalPrice: 750,
        duration: '4 Hours',
        description: 'Complete 1BR deep clean for tenants & owners.',
      },
      {
        id: 'm-2br',
        name: '2 Bedroom Move-In/Out',
        price: 720,
        originalPrice: 950,
        duration: '5 Hours',
        description: 'Thorough 2BR key handover service.',
      },
    ],
    addons: [
      { id: 'add-wall-wash', name: 'Wall Mark & Scuff Washing', price: 99 },
      { id: 'add-key-pickup', name: 'Key Pickup from Real Estate Agent', price: 49 },
    ],
  },

  // 6. Office Cleaning
  {
    id: 'office-cleaning',
    categoryId: 'cat-commercial',
    name: 'Office & Commercial Cleaning',
    slug: 'office-commercial-cleaning',
    tagline: 'Clean workspaces for healthier, productive employees.',
    description: 'Tailored commercial cleaning programs for corporate offices, retail stores, clinics, and showrooms in Dubai.',
    startingPrice: 390,
    rating: 4.87,
    reviewsCount: 510,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80',
    iconName: 'Buildings',
    features: [
      'Desk & workstation surface disinfection',
      'Pantry, coffee station & fridge clean',
      'Restroom deep sanitization',
      'Trash bag replacement & floor buffing',
    ],
    variants: [
      {
        id: 'off-small',
        name: 'Small Office (< 1,000 sq.ft)',
        price: 390,
        originalPrice: 500,
        duration: '2 Hours',
        description: 'Ideal for startups & small offices.',
      },
      {
        id: 'off-med',
        name: 'Medium Office (1,000 - 2,500 sq.ft)',
        price: 650,
        originalPrice: 850,
        duration: '3.5 Hours',
        description: 'Complete workspace disinfection.',
      },
      {
        id: 'off-large',
        name: 'Large Corporate Office (2,500+ sq.ft)',
        price: 990,
        originalPrice: 1300,
        duration: '5 Hours',
        description: 'Multi-cleaner team with floor buffer equipment.',
      },
    ],
    addons: [
      { id: 'add-server-room', name: 'Server Room Antistatic Dusting', price: 110 },
      { id: 'add-water-cooler', name: 'Pantry Water Dispenser Sanitization', price: 59 },
    ],
  },
];

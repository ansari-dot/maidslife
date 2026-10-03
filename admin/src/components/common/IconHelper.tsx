import React from 'react';
import {
  Home,
  Sparkles,
  Building2,
  Armchair,
  Layers,
  Sun,
  ShieldCheck,
  Droplets,
  PackageOpen,
  Wrench,
  Brush,
  CheckCircle2,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  House: Home,
  Home: Home,
  Sparkles: Sparkles,
  Sparkle: Sparkles,
  Building2: Building2,
  Buildings: Building2,
  Armchair: Armchair,
  Layers: Layers,
  Sun: Sun,
  ShieldCheck: ShieldCheck,
  Droplets: Droplets,
  Drop: Droplets,
  PackageOpen: PackageOpen,
  Wrench: Wrench,
  Brush: Brush,
};

export const AVAILABLE_ICONS = [
  'House',
  'Sparkles',
  'Building2',
  'Armchair',
  'Layers',
  'Sun',
  'ShieldCheck',
  'Droplets',
  'PackageOpen',
  'Brush',
];

interface IconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = ICON_MAP[name] || Sparkles;
  return <IconComponent className={className} />;
};

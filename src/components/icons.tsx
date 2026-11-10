import {
  Bug,
  Building2,
  CreditCard,
  Cloud,
  FileText,
  Flame,
  Footprints,
  HeartPulse,
  Laptop,
  Lock,
  Scale,
  Server,
  ShieldCheck,
  Snowflake,
  Truck,
  Users,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import type {IconName, Tone} from '../data/types';

const MAP: Record<IconName, LucideIcon> = {
  laptop: Laptop,
  lock: Lock,
  server: Server,
  scale: Scale,
  users: Users,
  building: Building2,
  flame: Flame,
  snowflake: Snowflake,
  wine: Wine,
  footprints: Footprints,
  card: CreditCard,
  cloud: Cloud,
  shield: ShieldCheck,
  heart: HeartPulse,
  truck: Truck,
  utensils: UtensilsCrossed,
  bug: Bug,
  file: FileText,
};

export function Glyph({name, size = 18}: {name: IconName; size?: number}) {
  const C = MAP[name];
  return <C size={size} strokeWidth={1.9} aria-hidden="true" />;
}

/** Pastel tile carrying a category or policy glyph. */
export function Chip({name, tone, size = 40}: {name: IconName; tone: Tone; size?: number}) {
  return (
    <span className="chip" style={{background: `var(--${tone})`, width: size, height: size}}>
      <Glyph name={name} size={Math.round(size * 0.45)} />
    </span>
  );
}

export function Logo({size = 34}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="var(--yellow)" />
      <path d="M20 7.5l10 3.6v7.6c0 6.6-4.4 10.9-10 12.8-5.6-1.9-10-6.2-10-12.8v-7.6z" fill="#16140F" />
      <path d="M20 12.2v15.4c3.4-1.5 6-4.3 6-8.9v-4.8z" fill="var(--pink)" />
    </svg>
  );
}

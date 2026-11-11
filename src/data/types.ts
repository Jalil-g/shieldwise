export type Industry = 'saas' | 'restaurant';

export type Tone = 'pink' | 'yellow' | 'peri' | 'sage' | 'orange' | 'blue' | 'lilac';

export type CategoryId = string;

export interface RiskCategory {
  id: CategoryId;
  name: string;
  short: string;
  tone: Tone;
  icon: IconName;
  /** Multiplier vs peers before any actions. 1.0 = typical peer. */
  base: number;
  /** Share of total exposure, sums to 1 across categories. */
  weight: number;
  /** Plain-English reasons for the multiplier. */
  drivers: {text: string; effect: 'up' | 'down'}[];
  /** Which policy ids respond to this exposure. Empty means uncovered. */
  coveredBy: string[];
  /** Estimated cost of a typical bad event, used to rank gaps. */
  typicalLoss: number;
}

export interface RiskAction {
  id: string;
  category: CategoryId;
  title: string;
  detail: string;
  /** Reduction in that category's multiplier when done. */
  delta: number;
  effort: 'Under an hour' | 'An afternoon' | 'A week' | 'A month';
  cost: string;
  /** Some carriers price this in at renewal. */
  premiumNote?: string;
}

export interface PolicyTerm {
  label: string;
  value: string;
  plain: string;
  flag?: 'warn' | 'good';
}

export interface Policy {
  id: string;
  name: string;
  short: string;
  carrier: string;
  number: string;
  tone: Tone;
  icon: IconName;
  premium: number;
  limit: number;
  deductible: number;
  effective: string; // ISO
  renews: string; // ISO
  status: 'active' | 'renewing' | 'expired';
  summary: string;
  covers: string[];
  excludes: string[];
  terms: PolicyTerm[];
  wording: string;
}

export interface Gap {
  id: string;
  title: string;
  kind: 'missing' | 'underinsured' | 'sublimit';
  category: CategoryId;
  why: string;
  /** Estimated uncovered amount in a typical bad event. */
  exposure: number;
  fix: string;
  /** Shop product that closes this gap. */
  compareId?: string;
}

export interface Guide {
  id: string;
  title: string;
  minutes: number;
  policy: string | null;
  tone: Tone;
  points: string[];
}

export interface GlossaryTerm {
  term: string;
  def: string;
  yours?: string;
}

export interface TrendPoint {
  week: string;
  value: number;
  note?: string;
}

export interface Persona {
  id: Industry;
  owner: {first: string; last: string; initials: string; role: string};
  business: {
    name: string;
    industry: string;
    peerGroup: string;
    peer: string;
    city: string;
    employees: number;
    revenue: string;
    founded: number;
    descriptor: string;
  };
  categories: RiskCategory[];
  actions: RiskAction[];
  policies: Policy[];
  gaps: Gap[];
  guides: Guide[];
  glossary: GlossaryTerm[];
  trend: TrendPoint[];
  /** Upload simulation produces this policy. */
  uploadable: Policy;
  /** Distribution of peer multipliers for the peer strip. */
  peers: number[];
}

export type IconName =
  | 'laptop'
  | 'lock'
  | 'server'
  | 'scale'
  | 'users'
  | 'building'
  | 'flame'
  | 'snowflake'
  | 'wine'
  | 'footprints'
  | 'card'
  | 'cloud'
  | 'shield'
  | 'heart'
  | 'truck'
  | 'utensils'
  | 'bug'
  | 'file';

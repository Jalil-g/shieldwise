import type {Industry, IconName, Tone} from './types';

/** Something the owner can require of every quote. */
export interface MustHave {
  key: string;
  label: string;
  hint: string;
  /** On by default because it closes a gap we found. */
  recommended: boolean;
}

export interface ProviderQuote {
  id: string;
  carrier: string;
  /** Illustrative financial-strength grade. */
  rating: 'A+' | 'A' | 'A-' | 'B++';
  /** Yearly premium at the product's reference limit and deductible. */
  base: number;
  maxLimit: number;
  /** Deductibles this carrier will write. */
  deductibles: number[];
  features: Record<string, boolean>;
  /** Median days from claim to first payment (sample data). */
  claimsDays: number;
  /** Business days to bind once details are confirmed. */
  bindDays: number;
  highlight: string;
  caveat?: string;
  /** This is the owner's current carrier, quoting the renewal. */
  isCurrent?: boolean;
}

export interface ShopProduct {
  id: string;
  name: string;
  short: string;
  icon: IconName;
  tone: Tone;
  blurb: string;
  /** Why we suggest it, tied to a gap or renewal. Null when optional. */
  reason: string | null;
  /** Policy this would replace or renew, if any. */
  replaces?: string;
  limits: number[];
  defaultLimit: number;
  refLimit: number;
  deductibles: number[];
  defaultDeductible: number;
  refDeductible: number;
  mustHaves: MustHave[];
  /** Business facts shared with providers when you ask for a firm quote. */
  shares: string[];
  quotes: ProviderQuote[];
}

const SAAS: ShopProduct[] = [
  {
    id: 'cyber',
    name: 'Cyber + Tech E&O',
    short: 'Cyber',
    icon: 'lock',
    tone: 'pink',
    blurb: 'Hacks, data breaches, ransomware, and claims that a bug or outage cost a client money.',
    reason: 'Closes your two biggest gaps, about $1.3M at risk. Your cyber policy renews Dec 2.',
    replaces: 'cyber',
    limits: [250_000, 500_000, 1_000_000, 2_000_000, 3_000_000],
    defaultLimit: 1_000_000,
    refLimit: 1_000_000,
    deductibles: [5_000, 10_000, 25_000],
    defaultDeductible: 10_000,
    refDeductible: 10_000,
    mustHaves: [
      {key: 'ransom', label: 'Ransomware covered to the full limit', hint: 'No smaller cap on ransom and extortion', recommended: true},
      {key: 'eo', label: 'Includes Tech E&O', hint: 'Pays if a bug or outage costs a client money', recommended: true},
      {key: 'dbi', label: 'Pays if your cloud provider goes down', hint: 'Also called dependent business interruption', recommended: false},
      {key: 'monthly', label: 'Monthly payments', hint: 'Spread the premium instead of paying it all up front', recommended: false},
    ],
    shares: ['Revenue: $3.4M ARR', 'Staff: 22 across TX, CA, NY, CO', 'Records held: about 140,000', 'Controls: SOC 2 Type I, backups'],
    quotes: [
      {
        id: 'ledgerline',
        carrier: 'Ledgerline',
        rating: 'A',
        base: 4_380,
        maxLimit: 3_000_000,
        deductibles: [5_000, 10_000, 25_000],
        features: {ransom: true, eo: true, dbi: true, monthly: true},
        claimsDays: 12,
        bindDays: 2,
        highlight: 'Cyber and E&O share one limit. A claim under either coverage reduces what remains for both.',
        caveat: 'Needs multi-factor sign-in in place before it binds.',
      },
      {
        id: 'northstar',
        carrier: 'Northstar Specialty',
        rating: 'A',
        base: 3_260,
        maxLimit: 2_000_000,
        deductibles: [10_000, 25_000],
        features: {ransom: false, eo: false, dbi: true, monthly: true},
        claimsDays: 16,
        bindDays: 1,
        highlight: 'Cheapest way to raise the cyber limit.',
        caveat: 'Ransomware capped at $250K, and there’s no E&O.',
      },
      {
        id: 'meridian',
        carrier: 'Meridian Re',
        rating: 'A+',
        base: 5_640,
        maxLimit: 3_000_000,
        deductibles: [5_000, 10_000, 25_000],
        features: {ransom: true, eo: true, dbi: true, monthly: false},
        claimsDays: 9,
        bindDays: 3,
        highlight: 'Strongest carrier and the fastest claims payments in this set.',
        caveat: 'Annual payment only.',
      },
      {
        id: 'harborline',
        carrier: 'Harbor Mutual',
        rating: 'A-',
        base: 3_890,
        maxLimit: 1_000_000,
        deductibles: [5_000, 10_000],
        features: {ransom: true, eo: true, dbi: false, monthly: true},
        claimsDays: 18,
        bindDays: 2,
        highlight: 'Adds onto the BOP you already hold, so there’s one renewal date to remember.',
        caveat: 'Tops out at a $1M limit.',
      },
      {
        id: 'cobalt',
        carrier: 'Cobalt Specialty',
        rating: 'A-',
        base: 3_120,
        maxLimit: 1_000_000,
        deductibles: [5_000, 10_000],
        features: {ransom: false, eo: false, dbi: false, monthly: true},
        claimsDays: 21,
        bindDays: 0,
        highlight: 'Renewing with your current carrier is the least paperwork.',
        caveat: 'Keeps the $50K ransomware sublimit and still no E&O.',
        isCurrent: true,
      },
      {
        id: 'brightwell',
        carrier: 'Brightwell Digital',
        rating: 'B++',
        base: 2_740,
        maxLimit: 1_000_000,
        deductibles: [10_000, 25_000],
        features: {ransom: true, eo: true, dbi: false, monthly: true},
        claimsDays: 25,
        bindDays: 1,
        highlight: 'Lowest price that still meets both recommended must-haves.',
        caveat: 'Newer carrier with a lower financial-strength grade.',
      },
    ],
  },
  {
    id: 'epl',
    name: 'Employment practices (EPLI)',
    short: 'EPLI',
    icon: 'users',
    tone: 'sage',
    blurb: 'Claims from employees about hiring, firing, harassment, discrimination or pay.',
    reason: 'You hired 9 people across 4 states with no employee handbook. About $140K at risk.',
    limits: [250_000, 500_000, 1_000_000],
    defaultLimit: 500_000,
    refLimit: 500_000,
    deductibles: [5_000, 10_000, 25_000],
    defaultDeductible: 10_000,
    refDeductible: 10_000,
    mustHaves: [
      {key: 'states', label: 'Covers employees in all 4 states', hint: 'TX, CA, NY and CO', recommended: true},
      {key: 'third', label: 'Covers claims from clients too', hint: 'Third-party harassment or discrimination claims', recommended: true},
      {key: 'hr', label: 'Free HR hotline and handbook templates', hint: 'Helps you finish the handbook action', recommended: false},
      {key: 'monthly', label: 'Monthly payments', hint: 'Spread the premium', recommended: false},
    ],
    shares: ['Staff: 22, with 9 hired in the last year', 'States: TX, CA, NY, CO', 'Past employment claims: none'],
    quotes: [
      {id: 'fairway', carrier: 'Fairway Specialty', rating: 'A', base: 2_380, maxLimit: 1_000_000, deductibles: [5_000, 10_000, 25_000], features: {states: true, third: true, hr: true, monthly: true}, claimsDays: 20, bindDays: 2, highlight: 'Includes an HR hotline and state-specific handbook templates.'},
      {id: 'ledgerline-e', carrier: 'Ledgerline', rating: 'A', base: 2_150, maxLimit: 1_000_000, deductibles: [10_000, 25_000], features: {states: true, third: false, hr: false, monthly: true}, claimsDays: 18, bindDays: 2, highlight: 'Bundles with the Ledgerline cyber quote for a 5% discount.', caveat: 'No third-party cover.'},
      {id: 'lonestar', carrier: 'Lone Star Mutual', rating: 'A-', base: 1_860, maxLimit: 500_000, deductibles: [10_000, 25_000], features: {states: false, third: true, hr: true, monthly: true}, claimsDays: 24, bindDays: 3, highlight: 'Same carrier as your workers’ comp.', caveat: 'Writes only TX and CO, so your CA and NY staff aren’t covered.'},
      {id: 'meridian-e', carrier: 'Meridian Re', rating: 'A+', base: 2_920, maxLimit: 1_000_000, deductibles: [5_000, 10_000, 25_000], features: {states: true, third: true, hr: false, monthly: false}, claimsDays: 14, bindDays: 3, highlight: 'Strongest carrier, with defense costs outside the limit.', caveat: 'Annual payment only.'},
    ],
  },
];

const RESTAURANT: ShopProduct[] = [
  {
    id: 'bop',
    name: 'Restaurant business owner’s policy',
    short: 'BOP',
    icon: 'building',
    tone: 'orange',
    blurb: 'Guest injuries, your kitchen and fit-out, food spoilage, and lost income after a fire or flood.',
    reason: 'Your lost-income cover stops after 30 days, and spoilage is below your inventory. About $350K at risk.',
    replaces: 'bop',
    limits: [1_000_000, 2_000_000],
    defaultLimit: 1_000_000,
    refLimit: 1_000_000,
    deductibles: [1_000, 2_500, 5_000],
    defaultDeductible: 2_500,
    refDeductible: 2_500,
    mustHaves: [
      {key: 'bi12', label: '12+ months of lost income', hint: 'A serious kitchen fire closes you for 3–6 months', recommended: true},
      {key: 'spoil', label: 'Spoilage of $25K or more', hint: 'Your walk-in and bar hold about $18K on a Friday', recommended: true},
      {key: 'epl', label: 'Employment claims included', hint: 'Saves buying a separate EPLI policy', recommended: false},
      {key: 'monthly', label: 'Monthly payments', hint: 'Spread the premium', recommended: false},
    ],
    shares: ['Revenue: $2.1M', 'Staff: 28', 'Alcohol: 41% of sales, open until 2am', 'Fire suppression inspected Aug 2026'],
    quotes: [
      {id: 'midwest', carrier: 'Midwest Hospitality Group', rating: 'A', base: 7_860, maxLimit: 2_000_000, deductibles: [1_000, 2_500, 5_000], features: {bi12: true, spoil: true, epl: true, monthly: true}, claimsDays: 11, bindDays: 2, highlight: 'Built for restaurants. Closes the income, spoilage and employment gaps in one package.', caveat: 'Wants quarterly hood cleaning, with the tags on file.'},
      {id: 'harbor-r', carrier: 'Harbor Mutual', rating: 'A-', base: 7_150, maxLimit: 2_000_000, deductibles: [2_500, 5_000], features: {bi12: false, spoil: true, epl: false, monthly: true}, claimsDays: 17, bindDays: 0, highlight: 'Keep your carrier and add endorsements.', caveat: 'Lost income only goes up to 6 months.', isCurrent: true},
      {id: 'fairway-r', carrier: 'Fairway Specialty', rating: 'A+', base: 9_480, maxLimit: 2_000_000, deductibles: [1_000, 2_500, 5_000], features: {bi12: true, spoil: true, epl: true, monthly: false}, claimsDays: 8, bindDays: 3, highlight: '18 months of lost income and the fastest claims payments in this set.', caveat: 'Annual payment only.'},
      {id: 'lakeshore-r', carrier: 'Lakeshore Casualty', rating: 'A', base: 7_420, maxLimit: 1_000_000, deductibles: [2_500, 5_000], features: {bi12: true, spoil: false, epl: false, monthly: true}, claimsDays: 13, bindDays: 2, highlight: 'Same carrier as your liquor policy, with one claims contact.', caveat: 'Spoilage stays at $10K.'},
      {id: 'prairie-r', carrier: 'Prairie State Mutual', rating: 'B++', base: 6_690, maxLimit: 1_000_000, deductibles: [2_500, 5_000], features: {bi12: true, spoil: true, epl: false, monthly: true}, claimsDays: 22, bindDays: 2, highlight: 'Lowest price that meets both recommended must-haves.', caveat: 'Lower financial-strength grade.'},
    ],
  },
  {
    id: 'liquor',
    name: 'Liquor liability',
    short: 'Liquor',
    icon: 'wine',
    tone: 'peri',
    blurb: 'Injuries caused by guests you served, including fights and drunk-driving crashes.',
    reason: 'Your bar fights cover is capped at $100K. About $150K at risk for a late-night bar.',
    replaces: 'liquor',
    limits: [1_000_000, 2_000_000],
    defaultLimit: 1_000_000,
    refLimit: 1_000_000,
    deductibles: [0, 1_000, 2_500],
    defaultDeductible: 0,
    refDeductible: 0,
    mustHaves: [
      {key: 'ab', label: 'Assault & battery $500K or more', hint: 'Fights are the most common late-night claim', recommended: true},
      {key: 'defense', label: 'Defense costs outside the limit', hint: 'Lawyer bills don’t eat into the payout', recommended: true},
      {key: 'monthly', label: 'Monthly payments', hint: 'Spread the premium', recommended: false},
    ],
    shares: ['Alcohol: 41% of sales', 'Hours: until 2am Fri–Sat', 'Certified servers: 3 of 15'],
    quotes: [
      {id: 'lakeshore', carrier: 'Lakeshore Casualty', rating: 'A', base: 5_640, maxLimit: 2_000_000, deductibles: [0, 1_000, 2_500], features: {ab: true, defense: true, monthly: true}, claimsDays: 15, bindDays: 0, highlight: 'Your current carrier will raise assault & battery to $500K at renewal.', isCurrent: true},
      {id: 'nightcap', carrier: 'Nightcap Specialty', rating: 'A-', base: 5_210, maxLimit: 2_000_000, deductibles: [0, 1_000, 2_500], features: {ab: true, defense: false, monthly: true}, claimsDays: 19, bindDays: 1, highlight: 'Cheaper if all your bartenders get certified.', caveat: 'Defense costs come out of the limit.'},
      {id: 'fairway-l', carrier: 'Fairway Specialty', rating: 'A+', base: 6_380, maxLimit: 2_000_000, deductibles: [0, 1_000], features: {ab: true, defense: true, monthly: false}, claimsDays: 10, bindDays: 3, highlight: 'Full-limit assault & battery, with no smaller cap at all.'},
    ],
  },
  {
    id: 'epl-r',
    name: 'Employment practices (EPLI)',
    short: 'EPLI',
    icon: 'users',
    tone: 'yellow',
    blurb: 'Claims from staff about firing, harassment, discrimination, or tips and overtime.',
    reason: 'Restaurants see some of the most wage-and-hour claims, and none of your policies respond. About $95K at risk.',
    limits: [250_000, 500_000, 1_000_000],
    defaultLimit: 500_000,
    refLimit: 500_000,
    deductibles: [5_000, 10_000],
    defaultDeductible: 5_000,
    refDeductible: 5_000,
    mustHaves: [
      {key: 'wage', label: 'Wage-and-hour defense', hint: 'Tip pooling and overtime claims', recommended: true},
      {key: 'third', label: 'Covers claims from guests too', hint: 'Guest harassment or discrimination claims', recommended: true},
      {key: 'monthly', label: 'Monthly payments', hint: 'Spread the premium', recommended: false},
    ],
    shares: ['Staff: 28, 74% turnover last year', 'State: IL', 'Past employment claims: one, in 2023'],
    quotes: [
      {id: 'fairway-re', carrier: 'Fairway Specialty', rating: 'A+', base: 3_420, maxLimit: 1_000_000, deductibles: [5_000, 10_000], features: {wage: true, third: true, monthly: false}, claimsDays: 16, bindDays: 3, highlight: 'Wage-and-hour defense up to $100K.', caveat: 'Annual payment only.'},
      {id: 'midwest-e', carrier: 'Midwest Hospitality Group', rating: 'A', base: 2_980, maxLimit: 1_000_000, deductibles: [5_000, 10_000], features: {wage: true, third: true, monthly: true}, claimsDays: 14, bindDays: 2, highlight: 'Already included if you take their BOP package.'},
      {id: 'prairie-e', carrier: 'Prairie State Mutual', rating: 'B++', base: 2_310, maxLimit: 500_000, deductibles: [5_000, 10_000], features: {wage: false, third: true, monthly: true}, claimsDays: 26, bindDays: 2, highlight: 'Lowest price.', caveat: 'No wage-and-hour defense, which is the most common claim for restaurants.'},
    ],
  },
];

export const SHOP: Record<Industry, ShopProduct[]> = {saas: SAAS, restaurant: RESTAURANT};

export interface Needs {
  limit: number;
  deductible: number;
  must: string[];
}

export function defaultNeeds(p: ShopProduct): Needs {
  return {limit: p.defaultLimit, deductible: p.defaultDeductible, must: p.mustHaves.filter(m => m.recommended).map(m => m.key)};
}

/** Price a quote for the chosen limit and deductible. Illustrative curve, not a rating engine. */
export function priceFor(p: ShopProduct, q: ProviderQuote, n: Needs) {
  const limitF = Math.pow(n.limit / p.refLimit, 0.62);
  const dedF = p.refDeductible === 0 ? 1 - n.deductible / 25_000 : Math.pow(p.refDeductible / Math.max(n.deductible, 500), 0.12);
  return Math.round((q.base * limitF * dedF) / 10) * 10;
}

export interface Ranked {
  q: ProviderQuote;
  price: number;
  monthly: number | null;
  met: string[];
  missing: string[];
  fits: boolean;
  /** Reasons the quote can't be offered as configured. */
  blocked: string | null;
}

export function rank(p: ShopProduct, n: Needs): Ranked[] {
  return p.quotes.map(q => {
    const met = n.must.filter(k => q.features[k]);
    const missing = n.must.filter(k => !q.features[k]);
    const price = priceFor(p, q, n);
    const blocked =
      q.maxLimit < n.limit
        ? `Doesn’t offer a ${short(n.limit)} limit (max ${short(q.maxLimit)})`
        : !q.deductibles.includes(n.deductible)
          ? `Doesn’t offer a ${n.deductible ? short(n.deductible) : '$0'} deductible`
          : null;
    return {q, price, monthly: q.features.monthly ? Math.round((price * 1.04) / 12) : null, met, missing, fits: missing.length === 0 && !blocked, blocked};
  });
}

export type SortKey = 'fit' | 'price' | 'claims';

export function sortRanked(list: Ranked[], by: SortKey) {
  const avail = (r: Ranked) => (r.blocked ? 1 : 0);
  return [...list].sort((a, b) => {
    if (avail(a) !== avail(b)) return avail(a) - avail(b);
    if (by === 'price') return a.price - b.price;
    if (by === 'claims') return a.q.claimsDays - b.q.claimsDays;
    return b.met.length - a.met.length || a.price - b.price;
  });
}

function short(n: number) {
  return n >= 1_000_000 ? '$' + n / 1_000_000 + 'M' : '$' + n / 1000 + 'K';
}

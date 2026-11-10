import {moneyShort} from './format';
import type {CostLine, Persona, Policy, RiskCategory, Scenario} from '../data/types';

export function categoryValue(c: RiskCategory, persona: Persona, done: Set<string>) {
  const cut = persona.actions.filter(a => a.category === c.id && done.has(a.id)).reduce((s, a) => s + a.delta, 0);
  return Math.max(0.45, c.base - cut);
}

export function overall(persona: Persona, done: Set<string>) {
  return persona.categories.reduce((s, c) => s + categoryValue(c, persona, done) * c.weight, 0);
}

/** Overall multiplier if every listed action were done. */
export function bestCase(persona: Persona) {
  return overall(persona, new Set(persona.actions.map(a => a.id)));
}

/** How much one action moves the overall multiplier. */
export function actionImpact(persona: Persona, actionId: string) {
  const a = persona.actions.find(x => x.id === actionId)!;
  const c = persona.categories.find(x => x.id === a.category)!;
  return a.delta * c.weight;
}

export function percentile(persona: Persona, value: number) {
  const below = persona.peers.filter(p => p < value).length;
  return Math.round((below / persona.peers.length) * 100);
}

export type Band = {label: string; tone: string};
export function band(v: number): Band {
  if (v < 0.85) return {label: 'Lower than peers', tone: 'var(--sage)'};
  if (v < 1.15) return {label: 'About typical', tone: 'var(--peri)'};
  if (v < 1.5) return {label: 'Above typical', tone: 'var(--yellow)'};
  return {label: 'Well above typical', tone: 'var(--pink)'};
}

export interface LineResult {
  label: string;
  cost: number;
  covered: number;
  you: number;
  policy: string | null;
  policyName: string | null;
  reason: string;
}

export interface ScenarioResult {
  total: number;
  covered: number;
  you: number;
  lines: LineResult[];
}

/**
 * Walk each cost line in order, drawing down the responding policy's limit,
 * applying any sublimit, and charging each policy's deductible once.
 */
export function simulate(scenario: Scenario, severity: 0 | 1 | 2, policies: Policy[], useAlt: boolean): ScenarioResult {
  const terms: Record<string, {name: string; limit: number; deductible: number}> = {};
  for (const p of policies) terms[p.id] = {name: p.name, limit: p.limit, deductible: p.deductible};
  const alt = useAlt ? scenario.alt : undefined;
  if (alt) Object.assign(terms, alt.policies);

  const remaining: Record<string, number> = {};
  const deductibleUsed: Record<string, boolean> = {};
  const lines: LineResult[] = scenario.lines.map((raw: CostLine) => {
    const o = alt?.lines?.[raw.label];
    const policy = o && 'policy' in o ? (o.policy ?? null) : raw.policy;
    const sublimit = o && 'sublimit' in o ? (o.sublimit ?? undefined) : raw.sublimit;
    const cost = raw.cost[severity];
    if (!policy || !terms[policy]) {
      return {label: raw.label, cost, covered: 0, you: cost, policy: null, policyName: null, reason: 'Nothing you own responds'};
    }
    const t = terms[policy];
    remaining[policy] ??= t.limit;
    let covered = Math.min(cost, remaining[policy]);
    let reason = 'Covered';
    if (sublimit !== undefined && covered > sublimit) {
      covered = sublimit;
      reason = `Capped by ${shortMoney(sublimit)} sublimit`;
    } else if (covered < cost) {
      reason = 'Policy limit reached';
    }
    if (!deductibleUsed[policy] && t.deductible > 0 && covered > 0) {
      const d = Math.min(t.deductible, covered);
      covered -= d;
      deductibleUsed[policy] = true;
      if (reason === 'Covered') reason = `After ${shortMoney(t.deductible)} deductible`;
    }
    remaining[policy] -= covered;
    return {label: raw.label, cost, covered, you: cost - covered, policy, policyName: t.name, reason};
  });
  const total = lines.reduce((s, l) => s + l.cost, 0);
  const covered = lines.reduce((s, l) => s + l.covered, 0);
  return {total, covered, you: total - covered, lines};
}

const shortMoney = moneyShort;

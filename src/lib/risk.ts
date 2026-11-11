import type {Persona, RiskCategory} from '../data/types';

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


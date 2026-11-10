import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {PERSONAS, type Industry, type Persona, type Policy} from './data';
import {overall} from './lib/risk';

interface Stored {
  persona: Industry;
  done: Record<Industry, string[]>;
  uploaded: Record<Industry, boolean>;
  reminders: Record<string, boolean>;
  theme: 'light' | 'dark' | 'system';
  onboarded: boolean;
}

const KEY = 'shieldwise:v1';
const initial: Stored = {
  persona: 'saas',
  done: {saas: [], restaurant: []},
  uploaded: {saas: false, restaurant: false},
  reminders: {},
  theme: 'light',
  onboarded: false,
};

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? {...initial, ...JSON.parse(raw)} : initial;
  } catch {
    return initial;
  }
}

interface Ctx {
  persona: Persona;
  policies: Policy[];
  done: Set<string>;
  value: number;
  baseline: number;
  toggleAction: (id: string) => void;
  setPersona: (id: Industry) => void;
  uploaded: boolean;
  completeUpload: () => void;
  reminders: Record<string, boolean>;
  setReminder: (policyId: string, on: boolean) => void;
  theme: Stored['theme'];
  setTheme: (t: Stored['theme']) => void;
  onboarded: boolean;
  finishOnboarding: (id: Industry) => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({children}: {children: ReactNode}) {
  const [s, set] = useState<Stored>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  useEffect(() => {
    const root = document.documentElement;
    if (s.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', s.theme);
  }, [s.theme]);

  const persona = PERSONAS[s.persona];
  const done = useMemo(() => new Set(s.done[s.persona]), [s.done, s.persona]);
  const policies = useMemo(
    () => (s.uploaded[s.persona] ? [...persona.policies, persona.uploadable] : persona.policies),
    [persona, s.uploaded, s.persona],
  );

  const toggleAction = useCallback(
    (id: string) =>
      set(prev => {
        const cur = new Set(prev.done[prev.persona]);
        if (cur.has(id)) cur.delete(id);
        else cur.add(id);
        return {...prev, done: {...prev.done, [prev.persona]: [...cur]}};
      }),
    [],
  );

  const value: Ctx = {
    persona,
    policies,
    done,
    value: overall(persona, done),
    baseline: overall(persona, new Set()),
    toggleAction,
    setPersona: id => set(prev => ({...prev, persona: id})),
    uploaded: s.uploaded[s.persona],
    completeUpload: () => set(prev => ({...prev, uploaded: {...prev.uploaded, [prev.persona]: true}})),
    reminders: s.reminders,
    setReminder: (pid, on) => set(prev => ({...prev, reminders: {...prev.reminders, [`${prev.persona}:${pid}`]: on}})),
    theme: s.theme,
    setTheme: t => set(prev => ({...prev, theme: t})),
    onboarded: s.onboarded,
    finishOnboarding: id => set(prev => ({...prev, persona: id, onboarded: true})),
    reset: () => set({...initial, theme: s.theme}),
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}

import {useEffect, useMemo, useRef, useState} from 'react';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {Drawer} from '@astryxdesign/core/Drawer';
import {CommandPalette} from '@astryxdesign/core/CommandPalette';
import {createStaticSource} from '@astryxdesign/core/Typeahead';
import {
  Bell,
  BookOpen,
  Check,
  FolderLock,
  Gauge,
  Home,
  Laptop,
  Menu,
  Monitor,
  Moon,
  RotateCcw,
  Scale,
  Search,
  SlidersHorizontal,
  Sun,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {useApp} from '../state';
import {Logo} from './icons';
import {PERSONAS, type Industry} from '../data';
import {daysUntil, mult, shortDate} from '../lib/format';

const NAV = [
  {to: '/', label: 'Overview', icon: Home, end: true},
  {to: '/risk', label: 'Risk profile', icon: Gauge},
  {to: '/policies', label: 'Policy hub', icon: FolderLock},
  {to: '/coverage', label: 'Coverage', icon: Scale},
  {to: '/simulator', label: 'What-if simulator', icon: SlidersHorizontal},
  {to: '/learn', label: 'Learn', icon: BookOpen},
];

function Nav({onNavigate}: {onNavigate?: () => void}) {
  const {persona} = useApp();
  return (
    <nav className="nav" aria-label="Main">
      {NAV.map(n => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} className={({isActive}) => (isActive ? 'active' : '')}>
          <n.icon size={19} strokeWidth={1.9} aria-hidden="true" />
          <span>{n.label}</span>
          {n.to === '/coverage' && (
            <span className="count" aria-label={`${persona.gaps.length} gaps`}>
              {persona.gaps.length}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SideFoot() {
  return (
    <div className="side-foot">
      <div className="neutral-note">
        <h4>We don’t sell insurance.</h4>
        <p>ShieldWise is a neutral advisor. We compare options and refer you, and your policies stay yours.</p>
      </div>
    </div>
  );
}

type SearchItem = {id: string; label: string; auxiliaryData: {kind: string; to: string; hint: string}};

function useSearchItems(): SearchItem[] {
  const {persona, policies} = useApp();
  return useMemo(() => {
    const items: SearchItem[] = [];
    NAV.forEach(n => items.push({id: 'nav' + n.to, label: n.label, auxiliaryData: {kind: 'Page', to: n.to, hint: 'Go to page'}}));
    persona.categories.forEach(c =>
      items.push({id: 'cat-' + c.id, label: c.name, auxiliaryData: {kind: 'Risk', to: '/risk/' + c.id, hint: mult(c.base) + ' vs peers'}}),
    );
    policies.forEach(p =>
      items.push({id: 'pol-' + p.id, label: p.name, auxiliaryData: {kind: 'Policy', to: '/policies/' + p.id, hint: p.carrier}}),
    );
    persona.scenarios.forEach(s =>
      items.push({id: 'sc-' + s.id, label: s.name, auxiliaryData: {kind: 'Scenario', to: '/simulator/' + s.id, hint: 'Run what-if'}}),
    );
    persona.glossary.forEach(g =>
      items.push({id: 'g-' + g.term, label: g.term, auxiliaryData: {kind: 'Term', to: '/learn?term=' + encodeURIComponent(g.term), hint: g.def}}),
    );
    return items;
  }, [persona, policies]);
}

function PersonaSwitch() {
  const {persona, setPersona} = useApp();
  const opts: [Industry, string, typeof Laptop][] = [
    ['saas', 'SaaS', Laptop],
    ['restaurant', 'Restaurant', UtensilsCrossed],
  ];
  return (
    <div className="persona-seg" role="radiogroup" aria-label="Demo business">
      {opts.map(([id, label, I]) => (
        <button key={id} role="radio" aria-checked={persona.id === id} onClick={() => setPersona(id)} title={PERSONAS[id].business.name}>
          <I size={17} aria-hidden="true" />
          <span className="lbl">{label}</span>
        </button>
      ))}
    </div>
  );
}

function Notifications() {
  const {persona, policies} = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  useOutside(ref, () => setOpen(false));
  const soon = policies.filter(p => daysUntil(p.renews) <= 90).sort((a, b) => a.renews.localeCompare(b.renews));
  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button className="round" aria-label={`Notifications, ${soon.length + 1} new`} aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <Bell size={20} strokeWidth={1.9} aria-hidden="true" />
        <span className="dot" />
      </button>
      {open && (
        <div className="menu fade-in" role="dialog" aria-label="Notifications">
          <h5>Needs attention</h5>
          {soon.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setOpen(false);
                nav('/policies/' + p.id);
              }}>
              <span className="chip" style={{background: 'var(--yellow)', width: 34, height: 34, borderRadius: 10}}>
                <Bell size={16} aria-hidden="true" />
              </span>
              <span>
                <b>{p.name} renews in {daysUntil(p.renews)} days</b>
                <small>{shortDate(p.renews)} · compare options before it auto-renews</small>
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              nav('/risk');
            }}>
            <span className="chip" style={{background: 'var(--pink)', width: 34, height: 34, borderRadius: 10}}>
              <Gauge size={16} aria-hidden="true" />
            </span>
            <span>
              <b>Your risk went up {mult(persona.trend.at(-1)!.value - persona.trend[0].value).replace('×', '')} in 24 weeks</b>
              <small>{persona.trend.filter(t => t.note).at(-1)?.note}</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const {persona, setPersona, theme, setTheme, reset} = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  useOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} style={{position: 'relative'}}>
      <button className="me" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="av" style={{background: persona.id === 'saas' ? 'var(--orange)' : 'var(--sage)'}}>
          {persona.owner.initials}
        </span>
        <span className="who">
          <b>
            {persona.owner.first} {persona.owner.last}
          </b>
          <small>{persona.business.name}</small>
        </span>
      </button>
      {open && (
        <div className="menu fade-in" role="menu" aria-label="Account and demo settings">
          <h5>Demo business</h5>
          {(Object.keys(PERSONAS) as Industry[]).map(id => {
            const p = PERSONAS[id];
            return (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={persona.id === id}
                onClick={() => {
                  setPersona(id);
                  setOpen(false);
                }}>
                <span className="av" style={{width: 34, height: 34, fontSize: 13, background: id === 'saas' ? 'var(--orange)' : 'var(--sage)'}}>
                  {p.owner.initials}
                </span>
                <span style={{flex: 1}}>
                  <b>{p.business.name}</b>
                  <small>
                    {p.business.industry} · {p.owner.first} {p.owner.last}
                  </small>
                </span>
                {persona.id === id && <Check size={18} aria-hidden="true" />}
              </button>
            );
          })}
          <hr />
          <h5>Appearance</h5>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: '0 4px 4px'}}>
            {(
              [
                ['light', Sun, 'Light'],
                ['dark', Moon, 'Dark'],
                ['system', Monitor, 'Auto'],
              ] as const
            ).map(([v, I, l]) => (
              <button
                key={v}
                role="menuitemradio"
                aria-checked={theme === v}
                onClick={() => setTheme(v)}
                style={{flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600}}>
                <I size={18} aria-hidden="true" />
                {l}
              </button>
            ))}
          </div>
          <hr />
          <button
            role="menuitem"
            onClick={() => {
              reset();
              nav('/start');
            }}>
            <RotateCcw size={18} aria-hidden="true" />
            <span>
              <b>Restart the demo</b>
              <small>Clears progress and opens onboarding</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function useOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fn();
    };
    const k = (e: KeyboardEvent) => e.key === 'Escape' && fn();
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('keydown', k);
    };
  }, [ref, fn]);
}

export function Shell() {
  const {persona} = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useSearchItems();
  const source = useMemo(() => createStaticSource(items, {keywords: i => [i.auxiliaryData.kind, i.auxiliaryData.hint]}), [items]);
  const nav = useNavigate();

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  return (
    <div className="app">
      <aside className="side" aria-label="Sidebar">
        <NavLink to="/" className="brand">
          <Logo />
          <span>ShieldWise</span>
        </NavLink>
        <Nav />
        <SideFoot />
      </aside>

      <main className="main" id="main">
        <div className="mobile-bar">
          <NavLink to="/" className="brand" style={{color: 'var(--ink)', padding: 0}}>
            <Logo size={30} />
            <span>ShieldWise</span>
          </NavLink>
          <button className="round" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="top">
          <button className="search" onClick={() => setSearchOpen(true)} aria-label="Search risks, policies, scenarios and terms">
            <Search size={19} aria-hidden="true" />
            <span className="ph">Search a risk, policy, scenario or term</span>
            <span className="kbd">⌘K</span>
          </button>
          <PersonaSwitch />
          <Notifications />
          <AccountMenu />
        </div>
        <Outlet />
        <p className="foot">
          ShieldWise prototype · sample data for {persona.owner.first} {persona.owner.last}, {persona.business.name}. Carriers, quotes and
          scores are illustrative.
        </p>
      </main>

      <CommandPalette
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
        searchSource={source}
        label="Search ShieldWise"
        emptySearchText="Nothing matches. Try “deductible” or “ransomware”."
        emptyBootstrapText="Search pages, risks, policies, scenarios and insurance terms."
        onValueChange={id => {
          const it = items.find(i => i.id === id);
          if (it) {
            setSearchOpen(false);
            nav(it.auxiliaryData.to);
          }
        }}
        renderItem={item => (
          <span style={{display: 'flex', gap: 12, alignItems: 'baseline', width: '100%'}}>
            <span className="pill" style={{minWidth: 70, justifyContent: 'center'}}>
              {item.auxiliaryData.kind}
            </span>
            <b style={{fontWeight: 600}}>{item.label}</b>
            <small style={{color: 'var(--muted)', marginLeft: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '45%'}}>
              {item.auxiliaryData.hint}
            </small>
          </span>
        )}
      />

      <Drawer isOpen={menuOpen} onOpenChange={setMenuOpen} label="Menu" side="start" width={300} padding={0}>
        <div className="side" style={{position: 'static', height: '100%', borderRadius: 0, display: 'flex', border: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="brand">
              <Logo />
              <span>ShieldWise</span>
            </span>
            <button className="round" style={{background: 'transparent', color: '#f4efe3', borderColor: 'rgba(244,239,227,.3)'}} aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <Nav onNavigate={() => setMenuOpen(false)} />
          <SideFoot />
        </div>
      </Drawer>
    </div>
  );
}

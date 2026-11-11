import {useEffect, useMemo, useRef, useState} from 'react';
import {NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {Drawer} from '@astryxdesign/core/Drawer';
import {CommandPalette} from '@astryxdesign/core/CommandPalette';
import {createStaticSource} from '@astryxdesign/core/Typeahead';
import {BookOpen, Check, ChevronsUpDown, FolderLock, Gauge, Home, Menu, Monitor, Moon, RotateCcw, Scale, Search, SlidersHorizontal, Sun, X} from 'lucide-react';
import {useApp} from '../state';
import {Logo} from './icons';
import {PERSONAS, type Industry} from '../data';
import {SHOP} from '../data/shop';
import {mult} from '../lib/format';

const NAV = [
  {to: '/', label: 'Overview', icon: Home, end: true},
  {to: '/risk', label: 'Risk profile', icon: Gauge},
  {to: '/simulator', label: 'What-if', icon: SlidersHorizontal},
  {to: '/coverage', label: 'Coverage', icon: Scale},
  {to: '/policies', label: 'Policies', icon: FolderLock},
  {to: '/learn', label: 'Learn', icon: BookOpen},
];

function Nav({onNavigate}: {onNavigate?: () => void}) {
  const {persona} = useApp();
  const location = useLocation();
  return (
    <nav className="nav" aria-label="Main">
      {NAV.map(n => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          viewTransition
          onClick={onNavigate}
          className={({isActive}) => (isActive || (n.to === '/coverage' && location.pathname.startsWith('/shop')) ? 'active' : '')}>
          <n.icon size={18} strokeWidth={1.9} aria-hidden="true" />
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
    SHOP[persona.id].forEach(p =>
      items.push({id: 'shop-' + p.id, label: 'Get quotes: ' + p.name, auxiliaryData: {kind: 'Quotes', to: '/shop/' + p.id, hint: p.quotes.length + ' providers'}}),
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

function AccountMenu() {
  const {persona, setPersona, theme, setTheme, reset} = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  useOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="acct">
      <button className="me" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="av" style={{background: persona.id === 'saas' ? 'var(--orange)' : 'var(--sage)'}}>
          {persona.owner.initials}
        </span>
        <span className="who">
          <b>{persona.business.name}</b>
          <small>
            {persona.owner.first} {persona.owner.last}
          </small>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className="me-caret" />
      </button>
      {open && (
        <div className="menu up fade-in" role="menu" aria-label="Account and demo settings">
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
                <span className="av" style={{width: 32, height: 32, fontSize: 12, background: id === 'saas' ? 'var(--orange)' : 'var(--sage)'}}>
                  {p.owner.initials}
                </span>
                <span style={{flex: 1}}>
                  <b>{p.business.name}</b>
                  <small>{p.business.industry}</small>
                </span>
                {persona.id === id && <Check size={17} aria-hidden="true" />}
              </button>
            );
          })}
          <hr />
          <h5>Appearance</h5>
          <div className="theme-pick">
            {(
              [
                ['light', Sun, 'Light'],
                ['dark', Moon, 'Dark'],
                ['system', Monitor, 'Auto'],
              ] as const
            ).map(([v, I, l]) => (
              <button key={v} role="menuitemradio" aria-checked={theme === v} onClick={() => setTheme(v)}>
                <I size={16} aria-hidden="true" />
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
            <RotateCcw size={17} aria-hidden="true" />
            <span>
              <b>Restart the demo</b>
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

function SideBody({onNavigate, onSearch}: {onNavigate?: () => void; onSearch: () => void}) {
  return (
    <>
      <button className="side-search" onClick={onSearch} aria-label="Search risks, policies, scenarios and terms">
        <Search size={16} aria-hidden="true" />
        <span>Search</span>
        <span className="kbd">⌘K</span>
      </button>
      <Nav onNavigate={onNavigate} />
      <div className="side-foot">
        <p className="neutral-line">
          <i aria-hidden="true" />
          We don’t sell insurance. ShieldWise is a neutral advisor.
        </p>
        <AccountMenu />
      </div>
    </>
  );
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
          <Logo size={30} />
          <span>ShieldWise</span>
        </NavLink>
        <SideBody onSearch={() => setSearchOpen(true)} />
      </aside>

      <main className="main" id="main">
        <div className="mobile-bar">
          <NavLink to="/" className="brand">
            <Logo size={28} />
            <span>ShieldWise</span>
          </NavLink>
          <span style={{display: 'flex', gap: 8}}>
            <button className="round" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} aria-hidden="true" />
            </button>
            <button className="round" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu size={18} aria-hidden="true" />
            </button>
          </span>
        </div>
        <div className="page">
          <Outlet />
        </div>
        <p className="foot">
          Prototype with sample data for {persona.business.name}. Carriers, quotes and scores are illustrative.
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

      <Drawer isOpen={menuOpen} onOpenChange={setMenuOpen} label="Menu" side="start" width={292} padding={0}>
        <div className="side in-drawer">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="brand">
              <Logo size={30} />
              <span>ShieldWise</span>
            </span>
            <button className="round" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <SideBody
            onNavigate={() => setMenuOpen(false)}
            onSearch={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          />
        </div>
      </Drawer>
    </div>
  );
}

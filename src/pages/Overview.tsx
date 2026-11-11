import {Link} from 'react-router-dom';
import {ArrowRight, Check, Download, Info} from 'lucide-react';
import {Tooltip} from '@astryxdesign/core/Tooltip';
import {useApp} from '../state';
import {SHOP} from '../data/shop';
import {PeerStrip, useTween} from '../components/viz';
import {Chip} from '../components/icons';
import {actionImpact, band, bestCase, percentile} from '../lib/risk';
import {daysUntil, greeting, moneyShort, mult, shortDate} from '../lib/format';

export function Overview() {
  const app = useApp();
  const {persona, value, done, toggleAction, policies} = app;
  const shown = useTween(value);
  const goal = bestCase(persona);
  const pct = percentile(persona, value);
  const b = band(value);

  const actions = [...persona.actions].sort((a, z) => actionImpact(persona, z.id) - actionImpact(persona, a.id)).slice(0, 3);
  const renewal = [...policies].filter(p => daysUntil(p.renews) <= 90).sort((a, z) => a.renews.localeCompare(z.renews))[0];
  const renewalHasGap =
    !!renewal && persona.gaps.some(g => persona.categories.find(c => c.id === g.category)?.coveredBy.includes(renewal.id));

  return (
    <>
      <section className="hello">
        <div>
          <h1>
            {greeting()}, {persona.owner.first}
          </h1>
          <p>Here’s where {persona.business.name} stands, and the few things that would move it.</p>
        </div>
        <button className="btn ghost sm no-print" onClick={() => window.print()}>
          <Download size={15} aria-hidden="true" /> Report
        </button>
      </section>

      {renewal && (
        <Link
          className="notice fade-in"
          to={renewalHasGap ? `/shop/${SHOP[persona.id].find(p => p.replaces === renewal.id)?.id ?? ''}` : `/policies/${renewal.id}`}>
          <span className="pill pastel num" style={{background: 'var(--yellow)'}}>
            {daysUntil(renewal.renews)} days
          </span>
          <span className="notice-text">
            <b>{renewal.name}</b> renews {shortDate(renewal.renews).replace(/, \d{4}$/, '')}
            {renewalHasGap ? ` with ${persona.gaps.length} open gaps.` : '. Update headcount and payroll first.'}
          </span>
          <span className="notice-cta">
            {renewalHasGap ? 'Compare quotes' : 'Review'} <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      )}

      <div className="grid">
        <section className="card s8 hero-card" aria-labelledby="h-score">
          <div className="head" style={{marginBottom: 0}}>
            <h2 id="h-score">Your risk vs. peers</h2>
            <Tooltip content="A relative measure. 1.0× is a typical business like yours. It is not the chance you’ll file a claim." placement="below">
              <button className="icon-btn" aria-label="What does this number mean?">
                <Info size={17} aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
          <div className="hero-top">
            <div className="big-mult" aria-label={`${mult(value)} the exposure of a typical peer`}>
              <span className="num">{shown.toFixed(1)}</span>
              <span className="x">×</span>
            </div>
            <div className="hero-copy">
              <p className="lead">
                {persona.business.name} is <b>{mult(value)}</b> as exposed as a typical {persona.business.peer}.
              </p>
              <p className="sub" style={{marginTop: 10}}>
                <span className="pill pastel" style={{background: b.tone, marginRight: 8}}>
                  {b.label}
                </span>
                Higher than {pct}% of peers.
              </p>
            </div>
          </div>
          <PeerStrip persona={persona} value={value} goal={goal} />
        </section>

        <section className="card s4 actions-card" aria-labelledby="h-act">
          <div>
            <h2 id="h-act">Lower your number</h2>
            <p className="goal-line">
              <span className="goal-pill num" aria-label={`From ${mult(value)} to ${mult(goal)}`}>
                {mult(value)} <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" /> {mult(goal)}
              </span>
              <span>if you finish all {persona.actions.length}</span>
            </p>
          </div>
          <div>
            {actions.map(a => {
              const on = done.has(a.id);
              return (
                <button key={a.id} className="act" aria-pressed={on} onClick={() => toggleAction(a.id)}>
                  <span className="ck">{on && <Check size={15} strokeWidth={3} aria-hidden="true" />}</span>
                  <span>
                    <b>{a.title}</b>
                    <small>
                      {a.effort} · {a.cost}
                    </small>
                  </span>
                  <span className="delta num" aria-label={`lowers your multiplier by ${actionImpact(persona, a.id).toFixed(2)}`}>
                    −{actionImpact(persona, a.id).toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
          <Link to="/risk" className="link on-blue">
            All {persona.actions.length} actions <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>

        <section className="card s12" aria-labelledby="h-cov">
          <div className="head">
            <div>
              <h2 id="h-cov">Would your policies pay?</h2>
              <p className="sub">Each bar is a typical bad event. Blue is what your policies would pay.</p>
            </div>
            <Link to="/coverage" className="link">
              Close gaps <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <CoverageMap />
        </section>
      </div>
    </>
  );
}

function CoverageMap() {
  const {persona} = useApp();
  const rows = [...persona.categories].sort((a, z) => z.typicalLoss - a.typicalLoss);
  const max = Math.max(...rows.map(r => r.typicalLoss));
  return (
    <div className="cov">
      {rows.map(c => {
        const gap = persona.gaps.find(g => g.category === c.id);
        const uncovered = c.coveredBy.length === 0 ? c.typicalLoss : Math.min(c.typicalLoss, gap?.exposure ?? 0);
        const covered = c.typicalLoss - uncovered;
        const state = uncovered === 0 ? ['Covered', 'var(--ink)'] : covered === 0 ? ['Not covered', 'var(--orange)'] : ['Underinsured', 'var(--orange)'];
        return (
          <Link key={c.id} to={`/risk/${c.id}`} className="covrow" style={{textDecoration: 'none'}}>
            <span style={{display: 'flex', gap: 10, alignItems: 'center', minWidth: 0}}>
              <Chip name={c.icon} tone={c.tone} size={30} />
              <b style={{fontWeight: 600, fontSize: 14, lineHeight: 1.2}}>{c.short}</b>
            </span>
            <span className="covbar" style={{width: `${Math.max(18, (c.typicalLoss / max) * 100)}%`}} aria-hidden="true">
              <span className="fill" style={{transform: `scaleX(${covered / c.typicalLoss})`}} />
            </span>
            <span className="covstate">
              <span style={{color: state[1] === 'var(--orange)' ? 'var(--ink)' : 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6}}>
                {state[1] === 'var(--orange)' && <i style={{width: 8, height: 8, borderRadius: 9, background: 'var(--orange)', display: 'inline-block'}} />}
                {state[0]}
              </span>
              <br />
              <small className="num" style={{color: 'var(--muted)', fontWeight: 500}}>
                {moneyShort(covered)} of {moneyShort(c.typicalLoss)}
              </small>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

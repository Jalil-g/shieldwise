import {Link} from 'react-router-dom';
import {ArrowRight, Check, Download, Info} from 'lucide-react';
import {Tooltip} from '@astryxdesign/core/Tooltip';
import {useApp} from '../state';
import {PeerStrip, TrendChart, useTween} from '../components/viz';
import {Chip} from '../components/icons';
import {actionImpact, band, bestCase, categoryValue, percentile} from '../lib/risk';
import {daysUntil, greeting, moneyShort, mult, shortDate} from '../lib/format';

export function Overview() {
  const app = useApp();
  const {persona, value, done, toggleAction, policies} = app;
  const shown = useTween(value);
  const goal = bestCase(persona);
  const pct = percentile(persona, value);
  const b = band(value);

  const topCats = [...persona.categories]
    .map(c => ({c, v: categoryValue(c, persona, done)}))
    .sort((a, z) => z.v * z.c.weight - a.v * a.c.weight)
    .slice(0, 3);

  const actions = [...persona.actions].sort((a, z) => actionImpact(persona, z.id) - actionImpact(persona, a.id)).slice(0, 4);
  const renewal = [...policies].filter(p => daysUntil(p.renews) <= 90).sort((a, z) => a.renews.localeCompare(z.renews))[0];
  const firstGap = persona.gaps.find(g => g.compareId);
  const renewalHasGap =
    !!renewal && persona.gaps.some(g => persona.categories.find(c => c.id === g.category)?.coveredBy.includes(renewal.id));

  return (
    <>
      <section className="hello">
        <div>
          <h1>
            {greeting()}, {persona.owner.first}
          </h1>
          <p>
            Here’s how exposed {persona.business.name} is compared with similar businesses, how well your policies cover it, and what would
            move the number.
          </p>
        </div>
        <button className="btn no-print" onClick={() => window.print()}>
          Download report
          <span className="circ">
            <Download size={14} aria-hidden="true" />
          </span>
        </button>
      </section>

      {renewal && (
        <section className="banner fade-in" aria-label="Upcoming renewal">
          <div className="days">
            <b className="num">{daysUntil(renewal.renews)}</b>
            <small>days</small>
          </div>
          <div>
            <p className="h3" style={{color: '#16140f'}}>
              Your {renewal.name.toLowerCase()} policy renews on {shortDate(renewal.renews)}
            </p>
            <p>
              {renewalHasGap
                ? `It auto-renews with the same gaps unless you change it. ${firstGap ? `We found ${persona.gaps.length} gaps, the biggest worth about ${moneyShort(Math.max(...persona.gaps.map(g => g.exposure)))} in a bad year.` : ''}`
                : 'No gaps here, but update headcount and payroll before it renews so the year-end audit doesn’t surprise you.'}
            </p>
          </div>
          <Link className="btn" to={renewalHasGap ? '/coverage' : `/policies/${renewal.id}`}>
            {renewalHasGap ? 'Compare before you renew' : 'Review the policy'} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      )}

      <div className="grid">
        <section className="card s8 hero-card" aria-labelledby="h-score">
          <div className="hero">
            <div className="head" style={{marginBottom: 0}}>
              <h2 id="h-score">Your risk compared with peers</h2>
              <Tooltip content="A relative measure. 1.0× is a typical business like yours. It is not the chance you’ll file a claim." placement="below">
                <button className="link" style={{textDecoration: 'none'}} aria-label="What does this number mean?">
                  <Info size={16} aria-hidden="true" /> What is this?
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
                  More exposed than {pct}% of peers.
                </p>
              </div>
            </div>
            <PeerStrip persona={persona} value={value} goal={goal} />
            <div className="drivers-wrap">
              <h3 className="h3" style={{marginBottom: 10}}>
                What’s driving it
              </h3>
              <div className="drivers">
                {topCats.map(({c, v}) => (
                  <Link key={c.id} to={`/risk/${c.id}`} className="driver">
                    <Chip name={c.icon} tone={c.tone} size={38} />
                    <span>
                      <span className="v num">{mult(v)}</span>
                    </span>
                    <b style={{gridColumn: '1 / -1'}}>{c.name}</b>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card s4 actions-card" aria-labelledby="h-act">
          <div>
            <h2 id="h-act">Lower your number</h2>
            <p className="sub">
              Do all {persona.actions.length} and you’d sit at <b style={{color: '#fff'}}>{mult(goal)}</b>. Tick one off to see it move.
            </p>
          </div>
          <div>
            {actions.map(a => {
              const on = done.has(a.id);
              return (
                <button key={a.id} className="act" aria-pressed={on} onClick={() => toggleAction(a.id)}>
                  <span className="ck">{on && <Check size={16} strokeWidth={3} aria-hidden="true" />}</span>
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
          <Link to="/risk" className="btn" style={{background: '#fff', color: '#16140f', borderColor: '#fff', alignSelf: 'flex-start', marginTop: 'auto'}}>
            See every action <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>

        <section className="card s7" aria-labelledby="h-cov">
          <div className="head">
            <div>
              <h2 id="h-cov">Are you covered?</h2>
              <p className="sub">Each bar is a typical bad event for that risk. Blue is what your policies would pay.</p>
            </div>
            <Link to="/coverage" className="link">
              Close gaps <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <CoverageMap />
        </section>

        <section className="card s5" aria-labelledby="h-trend">
          <div className="head">
            <div>
              <h2 id="h-trend">Last 24 weeks</h2>
              <p className="sub">What changed and why. Tap a dot.</p>
            </div>
            <span className="pill pastel num" style={{background: 'var(--yellow)'}}>
              {value >= persona.trend[0].value ? '+' : '−'}
              {Math.abs(value - persona.trend[0].value).toFixed(2)} since {persona.trend[0].week}
            </span>
          </div>
          <TrendChart points={persona.trend} live={value} />
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

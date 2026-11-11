import {Link, useNavigate, useParams} from 'react-router-dom';
import {ArrowDown, ArrowRight, ArrowUp, Check, ShieldAlert, ShieldCheck} from 'lucide-react';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {Diverge, TrendChart, useTween} from '../components/viz';
import {actionImpact, bestCase, categoryValue} from '../lib/risk';
import {moneyShort, mult} from '../lib/format';

export function RiskProfile() {
  const {persona, value, baseline, done, toggleAction, policies} = useApp();
  const {cat} = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const shown = useTween(value);
  const goal = bestCase(persona);
  const sel = persona.categories.find(c => c.id === cat) ?? [...persona.categories].sort((a, z) => z.base * z.weight - a.base * a.weight)[0];
  const selVal = categoryValue(sel, persona, done);
  const acts = persona.actions.filter(a => a.category === sel.id);
  const responders = policies.filter(p => sel.coveredBy.includes(p.id));
  const gap = persona.gaps.find(g => g.category === sel.id);

  const onToggle = (id: string) => {
    const was = done.has(id);
    toggleAction(id);
    const a = persona.actions.find(x => x.id === id)!;
    if (!was)
      toast({
        body: `Marked done: ${a.title}. Your multiplier drops by ${actionImpact(persona, id).toFixed(2)}.`,
        uniqueID: 'act',
        endContent: (
          <button className="link" onClick={() => toggleAction(id)}>
            Undo
          </button>
        ),
      });
  };

  return (
    <>
      <section className="hello">
        <div>
          <h1>Risk profile</h1>
          <p>
            Scored against {persona.business.peerGroup}. 1.0× is typical. Pick a risk to see why, and what lowers it.
          </p>
        </div>
        <div className="score-chip" aria-live="polite">
          <span className="display num">{shown.toFixed(1)}×</span>
          <span>
            <b>{done.size === 0 ? 'Overall today' : `Down from ${mult(baseline)}`}</b>
            <small>
              {done.size} of {persona.actions.length} actions done
              {value - goal > 0.02 ? ` · ${mult(goal)} possible` : ''}
            </small>
          </span>
        </div>
      </section>

      <div className="grid">
        <div className="s5 col risk-col">
        <section className="card" aria-labelledby="h-cats">
          <h2 id="h-cats" style={{marginBottom: 6}}>
            By risk
          </h2>
          <p className="sub" style={{marginBottom: 16}}>
            The line marks a typical peer.
          </p>
          <div className="cat-list" role="list">
            {[...persona.categories]
              .sort((a, z) => z.base - a.base)
              .map(c => {
                const v = categoryValue(c, persona, done);
                return (
                  <button
                    role="listitem"
                    key={c.id}
                    className="catbtn"
                    aria-current={c.id === sel.id}
                    onClick={() => nav(`/risk/${c.id}`, {replace: true})}
                    aria-label={`${c.name}: ${mult(v)} vs peers`}>
                    <Chip name={c.icon} tone={c.tone} size={40} />
                    <span>
                      <b style={{fontWeight: 600, display: 'block', lineHeight: 1.2}}>{c.name}</b>
                      <small style={{color: 'var(--muted)', fontSize: 13}}>{Math.round(c.weight * 100)}% of your score</small>
                    </span>
                    <span className="v num">{mult(v)}</span>
                    <Diverge value={v} base={c.base} tone={`var(--${c.tone})`} />
                  </button>
                );
              })}
          </div>
        </section>
        <section className="card trend-card" aria-labelledby="h-trend">
          <div className="head">
            <div>
              <h2 id="h-trend">Last 24 weeks</h2>
              <p className="sub">What changed, and why.</p>
            </div>
          </div>
          <TrendChart points={persona.trend} live={value} />
        </section>
        </div>

        <section className="card s7 fade-in" key={sel.id} aria-labelledby="h-sel">
          <div className="head">
            <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
              <Chip name={sel.icon} tone={sel.tone} size={52} />
              <div>
                <h2 id="h-sel">{sel.name}</h2>
                <p className="sub" style={{marginTop: 2}}>
                  <b className="num" style={{color: 'var(--ink)'}}>{mult(selVal)}</b> vs peers · a bad event typically costs{' '}
                  {moneyShort(sel.typicalLoss)}
                </p>
              </div>
            </div>
          </div>

          <h3 className="h3" style={{marginBottom: 10}}>
            Why it’s {selVal >= 1 ? 'higher' : 'lower'} than typical
          </h3>
          <ul className="ul" style={{marginBottom: 22}}>
            {sel.drivers.map(d => (
              <li key={d.text}>
                {d.effect === 'up' ? (
                  <ArrowUp size={18} color="var(--orange)" aria-label="raises risk" />
                ) : (
                  <ArrowDown size={18} color="var(--blue)" aria-label="lowers risk" />
                )}
                <span>{d.text}</span>
              </li>
            ))}
          </ul>

          {acts.length > 0 && (
            <>
              <h3 className="h3" style={{marginBottom: 10}}>
                What lowers it
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22}}>
                {acts.map(a => {
                  const on = done.has(a.id);
                  return (
                    <button key={a.id} className="check" aria-pressed={on} onClick={() => onToggle(a.id)}>
                      <span className="ck">{on && <Check size={16} strokeWidth={3} aria-hidden="true" />}</span>
                      <span>
                        <b>{a.title}</b>
                        <span className="check-detail">{a.detail}</span>
                        <span className="check-meta">
                          {a.effort} · {a.cost}
                          {a.premiumNote && <span className="hl">{a.premiumNote}</span>}
                        </span>
                      </span>
                      <span className="display num check-delta" aria-label={`lowers this risk by ${a.delta.toFixed(2)}`}>
                        −{a.delta.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <h3 className="h3" style={{marginBottom: 10}}>
            What pays if it happens
          </h3>
          {responders.length ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {responders.map(p => (
                <Link key={p.id} to={`/policies/${p.id}`} className="rowcard">
                  <ShieldCheck size={22} aria-hidden="true" />
                  <span>
                    <b>{p.name}</b>
                    <small>
                      {p.carrier} · {moneyShort(p.limit)} limit
                    </small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              ))}
              {gap && (
                <Link to="/coverage" className="rowcard" style={{background: 'color-mix(in srgb, var(--orange) 18%, var(--card))'}}>
                  <ShieldAlert size={22} color="var(--orange)" aria-hidden="true" />
                  <span>
                    <b>{gap.title}</b>
                    <small>About {moneyShort(gap.exposure)} you’d pay yourself in a typical bad event</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
            </div>
          ) : (
            <Link to="/coverage" className="rowcard" style={{background: 'color-mix(in srgb, var(--orange) 18%, var(--card))'}}>
              <ShieldAlert size={22} color="var(--orange)" aria-hidden="true" />
              <span>
                <b>None of your policies cover this</b>
                <small>{gap ? gap.fix : 'See options in Coverage & compare'}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </section>
      </div>
    </>
  );
}

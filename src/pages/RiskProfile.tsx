import {Link, useNavigate, useParams} from 'react-router-dom';
import {ArrowDown, ArrowRight, ArrowUp, Check, ShieldAlert, ShieldCheck} from 'lucide-react';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {Diverge, PeerStrip, useTween} from '../components/viz';
import {actionImpact, band, bestCase, categoryValue} from '../lib/risk';
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
            Each risk is scored against {persona.business.peerGroup}. 1.0× is typical. Higher means more exposed. Pick a risk to see why, and
            what changes it.
          </p>
        </div>
      </section>

      <section className="card" aria-labelledby="h-sum">
        <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8}}>
          <div className="hero-top" style={{alignItems: 'center'}}>
            <div className="big-mult" style={{fontSize: 'clamp(64px,7vw,104px)'}} aria-hidden="true">
              <span className="num">{shown.toFixed(1)}</span>
              <span className="x">×</span>
            </div>
            <div className="hero-copy" style={{maxWidth: '52ch'}}>
              <h2 id="h-sum" className="h2">
                {done.size === 0
                  ? `You’re at ${mult(value)} today`
                  : `Down from ${mult(baseline)} to ${mult(value)}`}
              </h2>
              <p className="sub">
                {done.size} of {persona.actions.length} actions done.{' '}
                {value - goal > 0.02 ? `Finish the rest to reach ${mult(goal)}, which is ${band(goal).label.toLowerCase()}.` : 'You’ve done everything on the list. Nice work.'}{' '}
                Carriers price many of these in at renewal.
              </p>
            </div>
          </div>
          <PeerStrip persona={persona} value={value} goal={goal} />
        </div>
      </section>

      <div className="grid">
        <section className="card s5" aria-labelledby="h-cats">
          <h2 id="h-cats" style={{marginBottom: 6}}>
            By risk
          </h2>
          <p className="sub" style={{marginBottom: 16}}>
            Bars grow left or right from the typical peer line. Dashed is where you started.
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
                      <small style={{color: 'var(--muted)', fontSize: 12.5}}>{Math.round(c.weight * 100)}% of your overall score</small>
                    </span>
                    <span className="v num">{mult(v)}</span>
                    <Diverge value={v} base={c.base} tone={`var(--${c.tone})`} />
                  </button>
                );
              })}
          </div>
        </section>

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
                        <span style={{fontSize: 14, color: 'var(--muted)', display: 'block', marginTop: 2}}>{a.detail}</span>
                        <span className="meta">
                          <span className="pill">{a.effort}</span>
                          <span className="pill">{a.cost}</span>
                          {a.premiumNote && (
                            <span className="pill pastel" style={{background: 'var(--yellow)', border: 0}}>
                              {a.premiumNote}
                            </span>
                          )}
                        </span>
                      </span>
                      <span style={{textAlign: 'right'}}>
                        <span className="display num" style={{fontSize: 20, fontWeight: 600}}>
                          −{a.delta.toFixed(2)}
                        </span>
                        <small style={{display: 'block', fontSize: 12, color: 'var(--muted)'}}>on this risk</small>
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

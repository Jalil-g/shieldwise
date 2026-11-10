import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Lightbulb} from 'lucide-react';
import {Switch} from '@astryxdesign/core/Switch';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {useTween} from '../components/viz';
import {simulate} from '../lib/risk';
import {money, moneyShort} from '../lib/format';

const SEV = ['Minor', 'Typical', 'Severe'] as const;

export function Simulator() {
  const {persona, policies} = useApp();
  const {id} = useParams();
  const nav = useNavigate();
  const sc = persona.scenarios.find(s => s.id === id) ?? persona.scenarios[0];
  const [sev, setSev] = useState<0 | 1 | 2>(1);
  const [alt, setAlt] = useState(false);
  const useAlt = alt && !!sc.alt;
  const r = simulate(sc, sev, policies, useAlt);
  const base = simulate(sc, sev, policies, false);
  const you = useTween(r.you, 600);
  const coveredPct = r.total ? (r.covered / r.total) * 100 : 0;

  return (
    <>
      <section className="hello">
        <div>
          <h1>What-if simulator</h1>
          <p>Pick something that could go wrong. We’ll show what your policies would pay, line by line, and what you’d pay yourself.</p>
        </div>
      </section>

      <section className="card" aria-labelledby="h-sc">
        <h2 id="h-sc" className="h3" style={{marginBottom: 12}}>
          Choose a scenario for {persona.business.name}
        </h2>
        <div className="scen" role="radiogroup" aria-label="Scenario">
          {persona.scenarios.map(s => (
            <button
              key={s.id}
              role="radio"
              aria-checked={s.id === sc.id}
              aria-pressed={s.id === sc.id}
              onClick={() => {
                nav(`/simulator/${s.id}`, {replace: true});
                setAlt(false);
              }}>
              <Chip name={s.icon} tone={s.tone} size={28} />
              {s.name}
            </button>
          ))}
        </div>
      </section>

      <div className="grid">
        <section className="card s5" aria-labelledby="h-res" style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          <div>
            <h2 id="h-res">{sc.name}</h2>
            <p className="sub">{sc.blurb}</p>
          </div>
          <div>
            <p style={{fontWeight: 600, fontSize: 14, marginBottom: 8}} id="sev-l">
              How bad is it?
            </p>
            <div className="sev" role="radiogroup" aria-labelledby="sev-l">
              {SEV.map((l, i) => (
                <button key={l} role="radio" aria-checked={sev === i} aria-pressed={sev === i} onClick={() => setSev(i as 0 | 1 | 2)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="sub" style={{marginTop: 0}}>
              You’d pay about
            </p>
            <div className="youpay" aria-live="polite" aria-label={`You'd pay about ${money(r.you)}`}>
              {money(you)}
            </div>
            {useAlt && base.you > r.you && (
              <p className="fade-in" style={{marginTop: 8, fontWeight: 600}}>
                <span className="pill pastel" style={{background: 'var(--sage)'}}>
                  {money(base.you - r.you)} less than today
                </span>
              </p>
            )}
          </div>
          <div>
            <div className="split" role="img" aria-label={`Insurance pays ${money(r.covered)}, you pay ${money(r.you)}, of ${money(r.total)} total`}>
              <i style={{width: `${coveredPct}%`, background: 'var(--blue)'}} />
              <i style={{width: `${100 - coveredPct}%`, background: 'var(--pink)'}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginTop: 8, gap: 10, flexWrap: 'wrap'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                <i style={{width: 10, height: 10, borderRadius: 3, background: 'var(--blue)'}} /> Insurance pays <b className="num">{money(r.covered)}</b>
              </span>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                <i style={{width: 10, height: 10, borderRadius: 3, background: 'var(--pink)'}} /> You pay <b className="num">{money(r.you)}</b>
              </span>
            </div>
          </div>
          {sc.alt && (
            <div className="well" style={{padding: 14}}>
              <Switch
                label={sc.alt.label}
                description="Replay this scenario with the recommended coverage in place."
                value={alt}
                onChange={setAlt}
                labelSpacing="spread"
                width="100%"
              />
            </div>
          )}
          <p className="well" style={{padding: '12px 14px', fontSize: 14, display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10}}>
            <Lightbulb size={18} aria-hidden="true" />
            <span>{sc.takeaway}</span>
          </p>
        </section>

        <section className="card s7" aria-labelledby="h-led">
          <div className="head">
            <div>
              <h2 id="h-led">Where the money goes</h2>
              <p className="sub">
                Total cost about <b style={{color: 'var(--ink)'}}>{money(r.total)}</b>. Deductibles apply once per policy, and sublimits cap individual lines.
              </p>
            </div>
          </div>
          <div className="ledger" role="table" aria-label="Cost breakdown">
            <div className="lrow headr" role="row">
              <span role="columnheader">Cost</span>
              <span role="columnheader" className="who-pays">
                Who pays
              </span>
              <span role="columnheader" className="r">
                Insurance
              </span>
              <span role="columnheader" className="r">
                You
              </span>
            </div>
            {r.lines.map(l => (
              <div className="lrow" role="row" key={l.label}>
                <span role="cell">
                  <b style={{fontWeight: 600}}>{l.label}</b>
                  <small style={{display: 'block', color: l.you > 0 ? 'var(--ink)' : 'var(--muted)', fontSize: 12.5}}>
                    {l.reason}
                    <span className="num"> · {moneyShort(l.cost)}</span>
                  </small>
                  <span className="mini" aria-hidden="true">
                    <i style={{width: `${l.cost ? (l.covered / l.cost) * 100 : 0}%`, background: 'var(--blue)'}} />
                    <i style={{width: `${l.cost ? (l.you / l.cost) * 100 : 0}%`, background: 'var(--pink)'}} />
                  </span>
                </span>
                <span role="cell" className="who-pays" style={{fontSize: 13, color: 'var(--muted)'}}>
                  {l.policyName ?? 'Nobody'}
                </span>
                <span role="cell" className="r">
                  {money(l.covered)}
                </span>
                <span role="cell" className="r" style={{fontWeight: l.you > 0 ? 700 : 400}}>
                  {money(l.you)}
                </span>
              </div>
            ))}
            <div className="lrow" role="row" style={{borderBottom: 0, fontWeight: 700}}>
              <span role="cell">Total</span>
              <span role="cell" className="who-pays" />
              <span role="cell" className="r">
                {money(r.covered)}
              </span>
              <span role="cell" className="r">
                {money(r.you)}
              </span>
            </div>
          </div>
          <p className="fine" style={{marginTop: 12}}>
            Illustrative estimates for a prototype, not a quote or a claim decision.
          </p>
        </section>
      </div>
    </>
  );
}

import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, Check, Minus, ShieldCheck} from 'lucide-react';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {money, moneyShort} from '../lib/format';
import type {Comparison, QuoteOption} from '../data';

const KIND: Record<string, string> = {missing: 'Not covered', underinsured: 'Underinsured', sublimit: 'Capped by a sublimit'};

export function Coverage() {
  const {persona} = useApp();
  const gaps = [...persona.gaps].sort((a, z) => z.exposure - a.exposure);
  const max = gaps[0]?.exposure ?? 1;
  const total = gaps.reduce((s, g) => s + g.exposure, 0);
  const fine = persona.categories.filter(c => c.coveredBy.length && !persona.gaps.some(g => g.category === c.id));

  return (
    <>
      <section className="hello">
        <div>
          <h1>Coverage &amp; compare</h1>
          <p>
            Recommendations come from your risk profile and the gaps in what you already own, not from what a carrier wants to sell.
          </p>
        </div>
      </section>

      <div className="grid">
        <section className="card s7" aria-labelledby="h-gaps">
          <div className="head">
            <div>
              <h2 id="h-gaps">
                {gaps.length} gaps worth closing
              </h2>
              <p className="sub">
                Ranked by what you’d pay yourself in a typical bad event. About <b style={{color: 'var(--ink)'}}>{moneyShort(total)}</b> in total.
              </p>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {gaps.map(g => {
              const c = persona.categories.find(x => x.id === g.category)!;
              return (
                <article key={g.id} className="gap">
                  <div>
                    <span className="amt num">{moneyShort(g.exposure)}</span>
                    <div className="gapbar" style={{width: `${Math.max(10, (g.exposure / max) * 100)}%`}} aria-hidden="true" />
                    <small style={{fontSize: 12, color: 'var(--muted)'}}>at risk</small>
                    <span className="pill desk-only" style={{background: 'var(--card)', display: 'flex', width: 'fit-content'}}>
                      {KIND[g.kind]}
                    </span>
                  </div>
                  <div>
                    <h3 className="h3" style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                      <Chip name={c.icon} tone={c.tone} size={28} />
                      {g.title}
                    </h3>
                    <p style={{fontSize: 14, color: 'var(--muted)', marginTop: 4}}>{g.why}</p>
                    <p style={{fontSize: 14, marginTop: 8, fontWeight: 600}}>Fix: {g.fix}</p>
                    <span className="pill mob-only" style={{background: 'var(--card)'}}>
                      {KIND[g.kind]}
                    </span>
                  </div>
                  {g.compareId ? (
                    <a href={`#cmp-${g.compareId}`} className="btn sm">
                      Compare <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={`/risk/${g.category}`} className="btn sm ghost">
                      Lower the risk
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="s5" style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          <section className="card" style={{background: 'var(--sage)', color: '#16140f', borderColor: '#16140f'}} aria-labelledby="h-fine">
            <h2 id="h-fine">Where you’re fine</h2>
            <p style={{fontSize: 14, marginTop: 6, color: 'rgba(22,20,15,.78)'}}>
              We won’t push you to buy more here. Your current policies handle a typical bad event.
            </p>
            <ul className="ul" style={{marginTop: 14}}>
              {fine.map(c => (
                <li key={c.id}>
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>
                    <b>{c.name}</b>: covered by your {c.coveredBy.map(id => persona.policies.find(p => p.id === id)?.short).join(' & ')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card" aria-labelledby="h-how">
            <h2 id="h-how">How we stay neutral</h2>
            <ul className="ul" style={{marginTop: 14}}>
              {[
                'We rank options by how well they close your gaps, then by price.',
                'We show when cheaper or no coverage is reasonable.',
                'When you choose an option, we refer you to a licensed agent or the carrier to bind it.',
              ].map(t => (
                <li key={t}>
                  <Check size={18} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {persona.comparisons.map(c => (
          <CompareBlock key={c.id} cmp={c} />
        ))}
      </div>
    </>
  );
}

function fmt(kind: string, v: string | number | boolean) {
  if (kind === 'money') return typeof v === 'number' ? moneyShort(v) : String(v);
  if (kind === 'bool') return v ? 'Yes' : 'No';
  return String(v);
}

function diff(cmp: Comparison, key: string, cur: QuoteOption, opt: QuoteOption): 'better' | 'worse' | null {
  if (opt.isCurrent) return null;
  const row = cmp.rows.find(r => r.key === key)!;
  const a = cur.rows[key];
  const b = opt.rows[key];
  if (a === b) return null;
  if (row.kind === 'bool') {
    if (key === 'mfa') return null;
    return b ? 'better' : 'worse';
  }
  if (row.kind === 'money' && typeof a === 'number' && typeof b === 'number') {
    const up = b > a;
    return row.higherIsBetter === false ? (up ? 'worse' : 'better') : up ? 'better' : 'worse';
  }
  return 'better';
}

function CompareBlock({cmp}: {cmp: Comparison}) {
  const cur = cmp.options.find(o => o.isCurrent)!;
  const [sel, setSel] = useState(cmp.options.find(o => o.label === 'Balanced')?.id ?? cmp.options[1].id);
  const opt = cmp.options.find(o => o.id === sel)!;
  const toast = useToast();
  const delta = opt.premium - cur.premium;
  const better = cmp.rows.filter(r => diff(cmp, r.key, cur, opt) === 'better').map(r => r.label.toLowerCase());
  const worse = cmp.rows.filter(r => diff(cmp, r.key, cur, opt) === 'worse').map(r => r.label.toLowerCase());

  return (
    <section className="card s12" id={`cmp-${cmp.id}`} aria-labelledby={`h-${cmp.id}`} style={{scrollMarginTop: 18}}>
      <div className="head">
        <div>
          <h2 id={`h-${cmp.id}`}>{cmp.title}</h2>
          <p className="sub">{cmp.subtitle} Sample quotes from illustrative carriers.</p>
        </div>
      </div>
      <div className="cmp" style={{gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`}} role="radiogroup" aria-label="Choose an option to compare with today">
        {cmp.options.map(o => (
          <button key={o.id} className="opt" aria-pressed={o.id === sel} role="radio" aria-checked={o.id === sel} onClick={() => setSel(o.id)}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
              <span className="pill pastel" style={{background: o.isCurrent ? 'var(--track)' : o.label === 'Balanced' ? 'var(--yellow)' : 'var(--peri)'}}>
                {o.isCurrent ? 'What you have' : o.label === 'Balanced' ? 'Best fit' : o.label}
              </span>
              <small style={{fontSize: 13}}>{o.carrier}</small>
            </div>
            <div className="price num">
              {money(o.premium)}
              <small> /yr</small>
            </div>
            <ul>
              {cmp.rows.map(r => {
                const d = diff(cmp, r.key, cur, o);
                return (
                  <li key={r.key}>
                    <span>{r.label}</span>
                    <span className={'num ' + (d ?? '')}>{fmt(r.kind, o.rows[r.key])}</span>
                  </li>
                );
              })}
            </ul>
            <p style={{fontSize: 13.5}}>{o.note}</p>
          </button>
        ))}
      </div>

      <div className="verdict" style={{marginTop: 16}} aria-live="polite">
        {opt.isCurrent ? (
          <p>
            Keeping what you have costs {money(cur.premium)} a year and leaves {cmp.id === 'cyber' ? 'your two biggest gaps' : 'your income and employment gaps'} open.
          </p>
        ) : (
          <p>
            <b>{opt.carrier}</b> costs {money(Math.abs(delta))} {delta >= 0 ? 'more' : 'less'} a year ({money(Math.round(Math.abs(delta) / 12))}/month).{' '}
            {better.length > 0 && <>It improves {better.join(', ')}. </>}
            {worse.length > 0 ? <>Trade-off: {worse.join(', ')}.</> : 'No trade-offs against what you have.'}
          </p>
        )}
        {!opt.isCurrent ? (
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <Link to="/simulator" className="btn sm ghost" style={{color: '#16140f'}}>
              Test it in a what-if
            </Link>
            <button
              className="btn sm"
              style={{background: '#16140f', color: '#faf6ec', borderColor: '#16140f'}}
              onClick={() =>
                toast({
                  body: `Referral requested. A licensed agent will contact you with the ${opt.carrier} quote. (Demo: nothing was sent.)`,
                  uniqueID: 'ref',
                })
              }>
              Request this quote
            </button>
          </div>
        ) : (
          <span className="pill" style={{background: 'rgba(255,255,255,.6)', color: '#16140f'}}>
            <Minus size={14} aria-hidden="true" /> No change
          </span>
        )}
      </div>
    </section>
  );
}

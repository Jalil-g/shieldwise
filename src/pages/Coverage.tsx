import {Link} from 'react-router-dom';
import {ArrowRight, ShieldCheck} from 'lucide-react';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {money, moneyShort} from '../lib/format';
import {SHOP, defaultNeeds, rank} from '../data/shop';

const KIND: Record<string, string> = {missing: 'Not covered', underinsured: 'Underinsured', sublimit: 'Capped by a sublimit'};

export function Coverage() {
  const {persona, requests} = useApp();
  const gaps = [...persona.gaps].sort((a, z) => z.exposure - a.exposure);
  const total = gaps.reduce((s, g) => s + g.exposure, 0);
  const fine = persona.categories.filter(c => c.coveredBy.length && !persona.gaps.some(g => g.category === c.id));
  const products = SHOP[persona.id];

  return (
    <>
      <section className="hello">
        <div>
          <h1>Coverage &amp; quotes</h1>
          <p>
            {gaps.length} gaps leave about <b style={{color: 'var(--ink)'}}>{moneyShort(total)}</b> on you in a bad year. Close them by
            comparing quotes from several providers.
          </p>
        </div>
      </section>

      <div className="grid">
        <section className="card s8" aria-labelledby="h-gaps">
          <div className="head">
            <div>
              <h2 id="h-gaps">Gaps worth closing</h2>
              <p className="sub">Ranked by what you’d pay yourself in a typical bad event.</p>
            </div>
          </div>
          <div className="gap-list">
            {gaps.map(g => {
              const c = persona.categories.find(x => x.id === g.category)!;
              const product = products.find(p => p.id === g.compareId);
              const req = product && requests.find(r => r.product === product.id);
              const from = product ? Math.min(...rank(product, defaultNeeds(product)).filter(r => !r.blocked).map(r => r.price)) : null;
              return (
                <article key={g.id} className="gap">
                  <Chip name={c.icon} tone={c.tone} size={40} />
                  <div className="gap-main">
                    <h3 className="h3">{g.title}</h3>
                    <p>{g.fix}</p>
                    <span className="gap-meta">
                      <span className="status-dot" aria-hidden="true" />
                      {KIND[g.kind]}
                      {req ? ' · Quote requested' : product && from ? ` · ${product.quotes.length} quotes from ${money(from)}/yr` : ''}
                    </span>
                  </div>
                  <div className="gap-side">
                    <span className="gap-amt num">{moneyShort(g.exposure)}</span>
                    <small>on you</small>
                  </div>
                  {product ? (
                    <Link to={`/shop/${product.id}`} className="btn sm gap-cta">
                      Compare <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  ) : (
                    <Link to={`/risk/${g.category}`} className="btn sm ghost gap-cta">
                      Lower it
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="s4 col">
          <section className="card" aria-labelledby="h-fine">
            <h2 id="h-fine">Where you’re fine</h2>
            <p className="sub">No need to buy more here.</p>
            <ul className="ul" style={{marginTop: 14}}>
              {fine.map(c => (
                <li key={c.id}>
                  <ShieldCheck size={18} color="var(--blue)" aria-hidden="true" />
                  <span>
                    <b style={{fontWeight: 600}}>{c.name}</b>
                    <small className="block-sub">
                      Your {c.coveredBy.map(id => persona.policies.find(p => p.id === id)?.short).join(' & ')}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <p className="aside-note">
            <i aria-hidden="true" />
            We rank quotes by how well they close your gaps, then by price. No provider pays for placement.
          </p>
        </aside>
      </div>
    </>
  );
}

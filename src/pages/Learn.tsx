import {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {Clock, Plus, Search} from 'lucide-react';
import {useApp} from '../state';

export function Learn() {
  const {persona, policies} = useApp();
  const [params] = useSearchParams();
  const focus = params.get('term');
  const [q, setQ] = useState('');
  const terms = persona.glossary.filter(g => (g.term + ' ' + g.def).toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    if (focus) document.getElementById('t-' + focus)?.scrollIntoView({block: 'center'});
  }, [focus]);

  return (
    <>
      <section className="hello">
        <div>
          <h1>Learn</h1>
          <p>Short, plain-English guides matched to the coverage {persona.business.name} owns, and the terms you’ll see on your policies.</p>
        </div>
      </section>

      <div className="grid">
        {persona.guides.map(g => {
          const pol = policies.find(p => p.id === g.policy);
          return (
            <article key={g.id} className="guide s4" style={{background: `var(--${g.tone})`}}>
              <h2 className="h2" style={{fontSize: 24}}>
                {g.title}
              </h2>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <span className="pill" style={{background: 'rgba(255,255,255,.6)', color: '#16140f'}}>
                  <Clock size={13} aria-hidden="true" /> {g.minutes} min
                </span>
                {pol ? (
                  <Link to={`/policies/${pol.id}`} className="pill" style={{background: '#16140f', color: '#faf6ec', textDecoration: 'none'}}>
                    About your {pol.short}
                  </Link>
                ) : (
                  <span className="pill" style={{background: 'rgba(255,255,255,.6)', color: '#16140f'}}>
                    Before you buy
                  </span>
                )}
              </div>
              <ol>
                {g.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </article>
          );
        })}

        <section className="card s12" aria-labelledby="h-gl">
          <div className="head" style={{flexWrap: 'wrap'}}>
            <div>
              <h2 id="h-gl">Terms you’ll see on your policies</h2>
              <p className="sub">Highlighted notes show where each term appears in your own coverage.</p>
            </div>
            <label className="field" style={{minWidth: 260}}>
              <Search size={17} aria-hidden="true" />
              <input type="search" placeholder="Filter terms" value={q} onChange={e => setQ(e.target.value)} aria-label="Filter terms" />
            </label>
          </div>
          <div className="gloss" style={{columnGap: 32}}>
            {terms.map(g => (
              <details key={g.term} id={'t-' + g.term} open={focus === g.term || undefined}>
                <summary>
                  {g.term}
                  <Plus className="plus" size={20} aria-hidden="true" />
                </summary>
                <div className="body">
                  <p>{g.def}</p>
                  {g.yours && <p className="yours">For you: {g.yours}</p>}
                </div>
              </details>
            ))}
            {terms.length === 0 && (
              <p className="sub" style={{padding: '16px 4px'}}>
                No terms match “{q}”. Try “limit” or “claims”.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

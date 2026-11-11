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
          <p>Short guides for the coverage {persona.business.name} owns, and the terms on your policies.</p>
        </div>
      </section>

      <div className="grid">
        {persona.guides.map(g => {
          const pol = policies.find(p => p.id === g.policy);
          return (
            <article key={g.id} className="card guide s4">
              <span className="guide-tab" style={{background: `var(--${g.tone})`}} aria-hidden="true" />
              <h2 className="h3">{g.title}</h2>
              <p className="guide-meta">
                <Clock size={13} aria-hidden="true" /> {g.minutes} min
                {pol ? (
                  <>
                    {' · '}
                    <Link to={`/policies/${pol.id}`}>About your {pol.short}</Link>
                  </>
                ) : (
                  ' · Before you buy'
                )}
              </p>
              <ul>
                {g.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          );
        })}

        <section className="card s12" aria-labelledby="h-gl">
          <div className="head" style={{flexWrap: 'wrap'}}>
            <div>
              <h2 id="h-gl">Glossary</h2>
              <p className="sub">Highlighted notes show where a term shows up in your coverage.</p>
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

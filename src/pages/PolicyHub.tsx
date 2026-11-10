import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Check, CircleCheck, CircleX, FileUp, Loader2, Plus, ScrollText, X} from 'lucide-react';
import {Drawer} from '@astryxdesign/core/Drawer';
import {Switch} from '@astryxdesign/core/Switch';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {Chip, Glyph} from '../components/icons';
import {TODAY, daysUntil, money, moneyShort, shortDate} from '../lib/format';
import type {Policy} from '../data';

export function PolicyHub() {
  const {policies, persona} = useApp();
  const {id} = useParams();
  const nav = useNavigate();
  const open = policies.find(p => p.id === id);
  const total = policies.reduce((s, p) => s + p.premium, 0);

  return (
    <>
      <section className="hello">
        <div>
          <h1>Policy hub</h1>
          <p>
            Every policy {persona.business.name} holds, in one place and in plain English. {policies.length} active, {money(total)} a year
            in premiums.
          </p>
        </div>
        <a href="#upload" className="btn">
          Add a policy
          <span className="circ">
            <Plus size={14} aria-hidden="true" />
          </span>
        </a>
      </section>

      <section className="card" aria-labelledby="h-tl">
        <div className="head" style={{marginBottom: 0}}>
          <div>
            <h2 id="h-tl">Renewals in the next 12 months</h2>
            <p className="sub">Start comparing 30–45 days before a renewal. We’ll remind you.</p>
          </div>
        </div>
        <Timeline policies={policies} />
      </section>

      <div className="grid">
        {policies.map(p => (
          <div className={policies.length % 4 === 0 ? 's3' : 's4'} key={p.id} style={{display: 'flex'}}>
            <PolicyCard p={p} />
          </div>
        ))}
        <div className="s12" id="upload" style={{display: 'flex'}}>
          <Upload />
        </div>
      </div>

      <Drawer isOpen={!!open} onOpenChange={o => !o && nav('/policies', {replace: true})} label={open ? open.name : 'Policy'} width={520} padding={0}>
        {open && <PolicyDetail p={open} onClose={() => nav('/policies', {replace: true})} />}
      </Drawer>
    </>
  );
}

function Timeline({policies}: {policies: Policy[]}) {
  const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const end = new Date(start.getFullYear() + 1, start.getMonth(), 1);
  const span = end.getTime() - start.getTime();
  const at = (d: Date) => ((d.getTime() - start.getTime()) / span) * 100;
  const months = Array.from({length: 12}, (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1).toLocaleDateString('en-US', {month: 'short'}));
  return (
    <div className="timeline">
      <div className="rail">
        <span className="today" style={{left: `${at(TODAY)}%`}}>
          <span>Today</span>
        </span>
        {policies.map(p => {
          const d = new Date(p.renews + 'T12:00:00');
          if (d > end) return null;
          return (
            <Link
              key={p.id}
              to={`/policies/${p.id}`}
              className="renew-dot"
              style={{left: `${at(d)}%`, background: `var(--${p.tone})`}}
              aria-label={`${p.name} renews ${shortDate(p.renews)}, in ${daysUntil(p.renews)} days`}
              title={`${p.short} · ${shortDate(p.renews)}`}>
              <Glyph name={p.icon} size={16} />
            </Link>
          );
        })}
      </div>
      <div className="months" aria-hidden="true">
        {months.map(m => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function PolicyCard({p}: {p: Policy}) {
  const d = daysUntil(p.renews);
  const warns = p.terms.filter(t => t.flag === 'warn').length;
  return (
    <Link to={`/policies/${p.id}`} className="pcard fade-in" style={{textDecoration: 'none'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10}}>
        <Chip name={p.icon} tone={p.tone} size={46} />
        {d <= 45 ? (
          <span className="pill pastel" style={{background: 'var(--yellow)'}}>
            Renews in {d} days
          </span>
        ) : (
          <span className="pill">Renews {shortDate(p.renews).replace(/, \d{4}$/, '')}</span>
        )}
      </div>
      <div>
        <h3 className="h3" style={{fontSize: 20}}>
          {p.name}
        </h3>
        <p className="sub" style={{marginTop: 2}}>
          {p.carrier} · {p.number}
        </p>
      </div>
      <p style={{fontSize: 14, color: 'var(--muted)', flex: 1}}>{p.summary}</p>
      <div className="kv">
        <div>
          <small>Limit</small>
          <b className="num">{moneyShort(p.limit)}</b>
        </div>
        <div>
          <small>Deductible</small>
          <b className="num">{p.deductible ? moneyShort(p.deductible) : 'None'}</b>
        </div>
        <div>
          <small>Premium</small>
          <b className="num">{moneyShort(p.premium)}</b>
        </div>
      </div>
      {warns > 0 && (
        <p style={{fontSize: 13.5, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center'}}>
          <i style={{width: 8, height: 8, borderRadius: 9, background: 'var(--orange)'}} />
          {warns} {warns === 1 ? 'term' : 'terms'} worth a closer look
        </p>
      )}
    </Link>
  );
}

const STEPS = ['Reading the PDF', 'Finding the declarations page', 'Pulling out limits, deductibles and sublimits', 'Translating into plain English'];

function Upload() {
  const {uploaded, completeUpload, persona} = useApp();
  const [over, setOver] = useState(false);
  const [step, setStep] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (step < 0) return;
    if (step >= STEPS.length) {
      completeUpload();
      toast({body: `${persona.uploadable.name} added to your Policy Hub.`, uniqueID: 'up'});
      setStep(-1);
      nav(`/policies/${persona.uploadable.id}`);
      return;
    }
    const t = setTimeout(() => setStep(s => s + 1), 750);
    return () => clearTimeout(t);
  }, [step, completeUpload, nav, persona, toast]);

  const start = () => setStep(0);

  if (uploaded && step < 0)
    return (
      <div className="drop wide" style={{borderStyle: 'solid', borderColor: 'var(--hair)', width: '100%'}}>
        <Chip name="file" tone="sage" size={46} />
        <div>
        <h3 className="h3">All caught up</h3>
        <p className="sub" style={{marginTop: 0}}>
          In the full product you could forward policy emails to <b>policies@shieldwise.app</b> or connect your broker portal.
        </p>
        </div>
        <p className="fine">The upload in this demo is simulated.</p>
      </div>
    );

  return (
    <div
      className={'drop wide' + (over ? ' over' : '')}
      style={{width: '100%'}}
      onDragOver={e => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault();
        setOver(false);
        start();
      }}>
      <Chip name="file" tone="yellow" size={46} />
      <div>
        <h3 className="h3">Drop a policy PDF</h3>
        <p className="sub">We’ll read it and explain it in plain English. Declarations pages work best.</p>
      </div>
      {step < 0 ? (
        <>
          <input ref={input} type="file" accept="application/pdf" hidden onChange={start} />
          <button className="btn sm" onClick={() => input.current?.click()}>
            <FileUp size={16} aria-hidden="true" /> Choose a file
          </button>
          <button className="link" onClick={start}>
            Try it with a sample policy
          </button>
        </>
      ) : (
        <ol className="steps" aria-live="polite" style={{flexBasis: '100%'}}>
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'ok' : i === step ? 'on' : ''}>
              {i < step ? (
                <Check size={18} aria-hidden="true" />
              ) : i === step ? (
                <Loader2 size={18} className="pulse" aria-hidden="true" />
              ) : (
                <span style={{width: 8, height: 8, borderRadius: 9, background: 'var(--track)', justifySelf: 'center'}} />
              )}
              {s}
            </li>
          ))}
        </ol>
      )}
      <p className="fine">The upload in this demo is simulated. Nothing leaves your browser.</p>
    </div>
  );
}

function PolicyDetail({p, onClose}: {p: Policy; onClose: () => void}) {
  const {reminders, setReminder, persona} = useApp();
  const [showWording, setShowWording] = useState(false);
  const key = `${persona.id}:${p.id}`;
  const on = reminders[key] ?? true;
  const toast = useToast();
  const compare = persona.comparisons.find(c => persona.gaps.some(g => g.compareId === c.id && persona.categories.find(x => x.id === g.category)?.coveredBy.includes(p.id)));

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--card)', color: 'var(--ink)'}}>
      <div style={{background: `var(--${p.tone})`, color: '#16140f', padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <Chip name={p.icon} tone={p.tone} size={48} />
          <button className="round" style={{width: 42, height: 42, background: 'rgba(255,255,255,.55)', borderColor: '#16140f', color: '#16140f'}} aria-label="Close" onClick={onClose} data-autofocus>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div>
          <h2 className="h2" style={{fontSize: 28}}>
            {p.name}
          </h2>
          <p style={{fontSize: 14, opacity: 0.8, marginTop: 4}}>
            {p.carrier} · {p.number} · {shortDate(p.effective)} – {shortDate(p.renews)}
          </p>
        </div>
        <p style={{fontSize: 15}}>{p.summary}</p>
      </div>

      <div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 24}}>
        <div className="dsec">
          <h3>The numbers that matter</h3>
          {p.terms.map(t => (
            <div key={t.label} className={'term ' + (t.flag ?? '')}>
              <b>{t.label}</b>
              <span className="val num">{t.value}</span>
              <p>{t.plain}</p>
            </div>
          ))}
        </div>

        <div className="dsec">
          <h3>Covered</h3>
          <ul className="ul">
            {p.covers.map(c => (
              <li key={c}>
                <CircleCheck size={18} color="var(--blue)" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="dsec">
          <h3>Not covered</h3>
          <ul className="ul">
            {p.excludes.map(c => (
              <li key={c}>
                <CircleX size={18} color="var(--orange)" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="dsec">
          <button className="link" onClick={() => setShowWording(s => !s)} aria-expanded={showWording} style={{alignSelf: 'flex-start'}}>
            <ScrollText size={16} aria-hidden="true" /> {showWording ? 'Hide' : 'Show'} the policy’s own wording
          </button>
          {showWording && <p className="wording fade-in">{p.wording}</p>}
        </div>

        <div className="well" style={{padding: 16}}>
          <Switch
            label="Remind me 45 days before renewal"
            description={`We’ll email ${persona.owner.first.toLowerCase()}@${persona.business.name.toLowerCase().replace(/[^a-z]/g, '')}.com and show it here.`}
            value={on}
            onChange={v => {
              setReminder(p.id, v);
              toast({body: v ? 'Renewal reminder on.' : 'Renewal reminder off.', uniqueID: 'rem'});
            }}
            labelSpacing="spread"
            width="100%"
          />
        </div>
      </div>

      <div style={{marginTop: 'auto', padding: '16px 22px', borderTop: '1px solid var(--hair)', display: 'flex', gap: 10, flexWrap: 'wrap', position: 'sticky', bottom: 0, background: 'var(--card)'}}>
        {compare ? (
          <Link to="/coverage" className="btn blue">
            Compare options
          </Link>
        ) : (
          <Link to="/simulator" className="btn">
            Test it in a what-if
          </Link>
        )}
        <button className="btn ghost" onClick={() => toast({body: 'In the full product this downloads the original PDF.', uniqueID: 'dl'})}>
          Original PDF
        </button>
      </div>
    </div>
  );
}

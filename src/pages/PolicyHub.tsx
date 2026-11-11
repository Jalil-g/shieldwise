import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ArrowRight, Check, CircleCheck, CircleX, FileUp, Loader2, Plus, ScrollText, X} from 'lucide-react';
import {Drawer} from '@astryxdesign/core/Drawer';
import {Switch} from '@astryxdesign/core/Switch';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {Chip} from '../components/icons';
import {daysUntil, money, moneyShort, shortDate} from '../lib/format';
import type {Policy} from '../data';
import {SHOP} from '../data/shop';

export function PolicyHub() {
  const {policies, persona} = useApp();
  const {id} = useParams();
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const open = policies.find(p => p.id === id);
  const total = policies.reduce((s, p) => s + p.premium, 0);

  return (
    <>
      <section className="hello">
        <div>
          <h1>Policies</h1>
          <p>
            Everything {persona.business.name} holds, in plain English. {policies.length} active · {money(total)} a year.
          </p>
        </div>
        <button className="btn sm" onClick={() => setAdding(true)}>
          <Plus size={15} aria-hidden="true" /> Add a policy
        </button>
      </section>

      <QuoteRequests />

      <div className="grid">
        {policies.map(p => (
          <div className={policies.length % 4 === 0 ? 's3' : 's4'} key={p.id} style={{display: 'flex'}}>
            <PolicyCard p={p} />
          </div>
        ))}
      </div>

      <Drawer isOpen={!!open} onOpenChange={o => !o && nav('/policies', {replace: true})} label={open ? open.name : 'Policy'} width={520} padding={0}>
        {open && <PolicyDetail p={open} onClose={() => nav('/policies', {replace: true})} />}
      </Drawer>
      <Drawer isOpen={adding} onOpenChange={setAdding} label="Add a policy" width={460} padding={0}>
        {adding && <Upload onClose={() => setAdding(false)} />}
      </Drawer>
    </>
  );
}

function QuoteRequests() {
  const {requests, cancelRequest} = useApp();
  const toast = useToast();
  if (!requests.length) return null;
  return (
    <section className="card requests" aria-labelledby="h-req">
      <div className="head" style={{marginBottom: 14}}>
        <div>
          <h2 id="h-req">Quote requests</h2>
          <p className="sub">Demo requests saved on this device. Nothing was sent to a provider.</p>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {requests.map(r => (
          <div key={r.id} className="rowcard req-row">
            <span className="req-dot" aria-hidden="true" />
            <span>
              <b>
                {r.productName} · {r.carrier}
              </b>
              <small>
                {moneyShort(r.limit)} limit · {money(r.price)}/yr{r.pay === 'monthly' ? ' paid monthly' : ''} · starts {r.start === 'asap' ? 'once confirmed' : shortDate(r.start)}
              </small>
            </span>
            <span style={{display: 'flex', gap: 10, alignItems: 'center'}}>
              <span className="pill">Demo · not sent</span>
              <button
                className="link"
                onClick={() => {
                  cancelRequest(r.id);
                  toast({body: `Request to ${r.carrier} withdrawn.`, uniqueID: 'cx'});
                }}>
                Withdraw
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PolicyCard({p}: {p: Policy}) {
  const d = daysUntil(p.renews);
  const warns = p.terms.filter(t => t.flag === 'warn').length;
  return (
    <Link to={`/policies/${p.id}`} className="pcard fade-in">
      <div className="pcard-top">
        <Chip name={p.icon} tone={p.tone} size={40} />
        {d <= 45 ? (
          <span className="pill pastel" style={{background: 'var(--yellow)'}}>
            Renews in {d} days
          </span>
        ) : (
          <span className="pcard-date">Renews {shortDate(p.renews).replace(/, \d{4}$/, '')}</span>
        )}
      </div>
      <div>
        <h3 className="h3">{p.name}</h3>
        <p className="sub" style={{marginTop: 2}}>
          {p.carrier}
        </p>
      </div>
      <dl className="kv">
        <div>
          <dt>Limit</dt>
          <dd className="num">{moneyShort(p.limit)}</dd>
        </div>
        <div>
          <dt>Deductible</dt>
          <dd className="num">{p.deductible ? moneyShort(p.deductible) : 'None'}</dd>
        </div>
        <div>
          <dt>Premium</dt>
          <dd className="num">{moneyShort(p.premium)}</dd>
        </div>
      </dl>
      <p className="pcard-foot">
        {warns > 0 ? (
          <>
            <span className="status-dot" aria-hidden="true" />
            {warns} {warns === 1 ? 'term' : 'terms'} to check
          </>
        ) : (
          <span style={{color: 'var(--muted)'}}>Nothing unusual</span>
        )}
        <ArrowRight size={15} aria-hidden="true" className="pcard-arrow" />
      </p>
    </Link>
  );
}

const STEPS = ['Reading the PDF', 'Finding the declarations page', 'Pulling out limits, deductibles and sublimits', 'Translating into plain English'];

function Upload({onClose}: {onClose: () => void}) {
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
      toast({body: `${persona.uploadable.name} added to your policies.`, uniqueID: 'up'});
      setStep(-1);
      onClose();
      nav(`/policies/${persona.uploadable.id}`);
      return;
    }
    const t = setTimeout(() => setStep(s => s + 1), 750);
    return () => clearTimeout(t);
  }, [step, completeUpload, nav, persona, toast, onClose]);

  const start = () => setStep(0);

  return (
    <div className="drawer-body">
      <div className="drawer-head">
        <div>
          <h2 className="h2">Add a policy</h2>
          <p className="sub">We’ll read it and explain it in plain English.</p>
        </div>
        <button className="round" aria-label="Close" onClick={onClose} data-autofocus>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {uploaded && step < 0 ? (
        <div className="well" style={{padding: 18}}>
          <h3 className="h3">All caught up</h3>
          <p className="sub">
            In the full product you could forward policy emails to <b>policies@shieldwise.app</b> or connect your broker portal.
          </p>
        </div>
      ) : (
        <div
          className={'drop' + (over ? ' over' : '')}
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
          <Chip name="file" tone="yellow" size={44} />
          <div>
            <h3 className="h3">Drop a policy PDF here</h3>
            <p className="sub">Declarations pages work best.</p>
          </div>
          {step < 0 ? (
            <div style={{display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap'}}>
              <input ref={input} type="file" accept="application/pdf" hidden onChange={start} />
              <button className="btn sm" onClick={() => input.current?.click()}>
                <FileUp size={15} aria-hidden="true" /> Choose a file
              </button>
              <button className="link" onClick={start}>
                Use a sample policy
              </button>
            </div>
          ) : (
            <ol className="steps" aria-live="polite">
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
        </div>
      )}
      <p className="fine">Demo: the upload is simulated and nothing leaves your browser.</p>
    </div>
  );
}

function PolicyDetail({p, onClose}: {p: Policy; onClose: () => void}) {
  const {reminders, setReminder, persona} = useApp();
  const [showWording, setShowWording] = useState(false);
  const key = `${persona.id}:${p.id}`;
  const on = reminders[key] ?? true;
  const toast = useToast();
  const shop = SHOP[persona.id].find(x => x.replaces === p.id);

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--card)', color: 'var(--ink)'}}>
      <div className="pd-head">
        <span className="pd-band" style={{background: `var(--${p.tone})`}} aria-hidden="true" />
        <div className="drawer-head">
          <Chip name={p.icon} tone={p.tone} size={44} />
          <button className="round" aria-label="Close" onClick={onClose} data-autofocus>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div>
          <h2 className="h2" style={{fontSize: 26}}>
            {p.name}
          </h2>
          <p className="sub" style={{marginTop: 4}}>
            {p.carrier} · {p.number} · {shortDate(p.effective)} – {shortDate(p.renews)}
          </p>
        </div>
        <p className="pd-summary">{p.summary}</p>
      </div>

      <div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 24}}>
        <div className="dsec">
          <h3>The numbers that matter</h3>
          {p.terms.map(t => (
            <div key={t.label} className={'term ' + (t.flag ?? '')}>
              <b>
                {t.flag === 'warn' && <span className="status-dot" role="img" aria-label="Worth a closer look" />} {t.label}
              </b>
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
            labelPosition="start"
            width="100%"
          />
        </div>
      </div>

      <div style={{marginTop: 'auto', padding: '16px 22px', borderTop: '1px solid var(--hair)', display: 'flex', gap: 10, flexWrap: 'wrap', position: 'sticky', bottom: 0, background: 'var(--card)'}}>
        {shop ? (
          <Link to={`/shop/${shop.id}`} className="btn blue">
            Compare {shop.quotes.length} providers
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

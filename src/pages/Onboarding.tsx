import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, ArrowRight, Check, FileUp, Loader2} from 'lucide-react';
import {useApp} from '../state';
import {Chip, Logo} from '../components/icons';
import {PeerStrip, useTween} from '../components/viz';
import {PERSONAS, type Industry} from '../data';
import {overall, percentile} from '../lib/risk';
import {mult} from '../lib/format';

const QUESTIONS: Record<Industry, {q: string; options: string[]; answer: string}[]> = {
  saas: [
    {q: 'Do you store personal data about end users?', options: ['No', 'Under 10K people', '10K–100K', 'Over 100K'], answer: 'Over 100K'},
    {q: 'Do your contracts promise uptime or service levels?', options: ['No', 'Some', 'Most enterprise deals'], answer: 'Most enterprise deals'},
    {q: 'Is multi-factor sign-in required for admin tools?', options: ['Everywhere', 'Some tools', 'Not yet'], answer: 'Not yet'},
  ],
  restaurant: [
    {q: 'What share of sales is alcohol?', options: ['None', 'Under 20%', '20–40%', 'Over 40%'], answer: 'Over 40%'},
    {q: 'Latest closing time?', options: ['Before 10pm', 'Midnight', '2am or later'], answer: '2am or later'},
    {q: 'How do you cook?', options: ['No open flame', 'Gas range', 'Fryers + charbroiler'], answer: 'Fryers + charbroiler'},
  ],
};

const SIZE: Record<Industry, {staff: string[]; staffA: string; rev: string[]; revA: string}> = {
  saas: {staff: ['1–9', '10–50', '51–200'], staffA: '10–50', rev: ['Under $1M', '$1–5M', '$5–20M'], revA: '$1–5M'},
  restaurant: {staff: ['1–9', '10–40', '41–100'], staffA: '10–40', rev: ['Under $1M', '$1–3M', '$3M+'], revA: '$1–3M'},
};

const COMPUTE = ['Matching you with similar businesses', 'Scoring six risk areas', 'Reading your policies', 'Finding gaps'];

export function Onboarding() {
  const {finishOnboarding, setPersona} = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [ind, setInd] = useState<Industry | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState(0);
  const p = ind ? PERSONAS[ind] : null;

  const pickIndustry = (i: Industry) => {
    setInd(i);
    const a: Record<string, string> = {staff: SIZE[i].staffA, rev: SIZE[i].revA};
    QUESTIONS[i].forEach(q => (a[q.q] = q.answer));
    setAnswers(a);
  };

  useEffect(() => {
    if (step !== 4) return;
    if (phase >= COMPUTE.length) return;
    const t = setTimeout(() => setPhase(x => x + 1), 650);
    return () => clearTimeout(t);
  }, [step, phase]);

  const total = 5;
  const go = (n: number) => {
    setStep(n);
    if (n === 4) setPhase(0);
  };

  return (
    <div className="ob">
      <div className={'ob-left' + (step > 0 ? ' compact' : '')}>
        <div className="brand" style={{padding: 0}}>
          <Logo />
          <span>ShieldWise</span>
        </div>
        <div className="ob-intro" style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 20}}>
          <h1>Know your risk. Own your coverage.</h1>
          <p style={{color: '#cfc9ba', maxWidth: '42ch', fontSize: 16}}>
            See how exposed your business is compared with businesses like yours, whether your policies would actually pay, and what to do
            next. We don’t sell insurance, so we have no reason to oversell it.
          </p>
          <ul className="ul" style={{color: '#f4efe3'}}>
            {['A risk score you can move, not a scary number', 'All your policies, explained in plain English', 'Neutral comparisons when it’s time to renew'].map(t => (
              <li key={t}>
                <Check size={18} color="var(--yellow)" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p style={{color: '#9c978a', fontSize: 12.5}}>Prototype with sample businesses. Nothing you enter is stored outside this browser.</p>
      </div>

      <div className="ob-right">
        <div className="progress" aria-label={`Step ${step + 1} of ${total}`}>
          {Array.from({length: total}, (_, i) => (
            <i key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        {step === 0 && (
          <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 22}}>
            <div>
              <h2>What kind of business do you run?</h2>
              <p className="sub" style={{fontSize: 15}}>We start with SaaS companies and restaurants. Each demo uses a sample business.</p>
            </div>
            <div className="pick" role="radiogroup" aria-label="Industry">
              {(Object.keys(PERSONAS) as Industry[]).map(i => {
                const x = PERSONAS[i];
                return (
                  <button key={i} role="radio" aria-checked={ind === i} aria-pressed={ind === i} onClick={() => pickIndustry(i)}>
                    <Chip name={i === 'saas' ? 'laptop' : 'utensils'} tone={i === 'saas' ? 'peri' : 'orange'} size={52} />
                    <span>
                      <b className="h3" style={{display: 'block', fontSize: 22}}>
                        {i === 'saas' ? 'SaaS company' : 'Restaurant'}
                      </b>
                      <small style={{opacity: 0.75, fontSize: 14}}>
                        e.g. {x.business.name}, {x.business.descriptor.toLowerCase()}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
            <Nav onNext={() => go(1)} disabled={!ind} />
          </div>
        )}

        {step === 1 && p && ind && (
          <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <div>
              <h2>Tell us about {p.business.name}</h2>
              <p className="sub" style={{fontSize: 15}}>Size decides who you’re compared with.</p>
            </div>
            <Seg label="How many people work there?" options={SIZE[ind].staff} value={answers.staff} onChange={v => setAnswers(a => ({...a, staff: v}))} />
            <Seg label="Yearly revenue" options={SIZE[ind].rev} value={answers.rev} onChange={v => setAnswers(a => ({...a, rev: v}))} />
            <p className="well" style={{padding: '12px 16px', fontSize: 14}}>
              You’ll be compared with <b>{p.business.peerGroup}</b>.
            </p>
            <Nav onBack={() => go(0)} onNext={() => go(2)} />
          </div>
        )}

        {step === 2 && ind && (
          <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <div>
              <h2>A few questions that move the score most</h2>
              <p className="sub" style={{fontSize: 15}}>Answers are prefilled for the sample business. Change them if you like.</p>
            </div>
            {QUESTIONS[ind].map(q => (
              <Seg key={q.q} label={q.q} options={q.options} value={answers[q.q]} onChange={v => setAnswers(a => ({...a, [q.q]: v}))} />
            ))}
            <Nav onBack={() => go(1)} onNext={() => go(3)} />
          </div>
        )}

        {step === 3 && p && (
          <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 22}}>
            <div>
              <h2>Add the policies you already have</h2>
              <p className="sub" style={{fontSize: 15}}>We read them to find what’s covered, what isn’t, and when they renew.</p>
            </div>
            <div className="drop" style={{minHeight: 0}}>
              <Chip name="file" tone="yellow" size={46} />
              <p style={{fontWeight: 600}}>Drop declarations pages here, or forward policy emails later.</p>
              <button className="btn sm" onClick={() => go(4)}>
                <FileUp size={16} aria-hidden="true" /> Use {p.business.name}’s {p.policies.length} sample policies
              </button>
            </div>
            <ul className="ul">
              {p.policies.map(x => (
                <li key={x.id}>
                  <Check size={18} aria-hidden="true" />
                  {x.name} · {x.carrier}
                </li>
              ))}
            </ul>
            <Nav onBack={() => go(2)} onNext={() => go(4)} nextLabel="Calculate my risk" />
          </div>
        )}

        {step === 4 && p && ind && (
          <Result
            done={phase >= COMPUTE.length}
            phase={phase}
            ind={ind}
            onGo={() => {
              setPersona(ind);
              finishOnboarding(ind);
              nav('/');
            }}
          />
        )}
      </div>
    </div>
  );
}

function Result({done, phase, ind, onGo}: {done: boolean; phase: number; ind: Industry; onGo: () => void}) {
  const p = PERSONAS[ind];
  const v = overall(p, new Set());
  const shown = useTween(done ? v : 1, 1100);
  if (!done)
    return (
      <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <h2>Working it out…</h2>
        <ol className="steps" aria-live="polite">
          {COMPUTE.map((s, i) => (
            <li key={s} className={i < phase ? 'ok' : i === phase ? 'on' : ''}>
              {i < phase ? <Check size={18} aria-hidden="true" /> : i === phase ? <Loader2 size={18} className="pulse" aria-hidden="true" /> : <span />}
              {s}
            </li>
          ))}
        </ol>
      </div>
    );
  return (
    <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: 22}}>
      <div>
        <h2>{p.business.name} is</h2>
        <div className="big-mult" style={{margin: '8px 0 6px'}}>
          <span className="num">{shown.toFixed(1)}</span>
          <span className="x">×</span>
        </div>
        <p className="h3" style={{fontWeight: 500, maxWidth: '36ch'}}>
          as exposed as a typical {p.business.peer}. More exposed than {percentile(p, v)}% of peers.
        </p>
      </div>
      <div className="card" style={{padding: '18px 18px 10px'}}>
        <PeerStrip persona={p} value={v} />
      </div>
      <p className="sub" style={{fontSize: 15, marginTop: 0}}>
        That isn’t the chance you’ll file a claim. It’s how much exposure you carry relative to peers. The good news: we found{' '}
        {p.actions.length} actions that would bring it down to {mult(overall(p, new Set(p.actions.map(a => a.id))))}, and {p.gaps.length} coverage gaps
        to look at.
      </p>
      <div>
        <button className="btn blue" onClick={onGo} data-autofocus>
          See my dashboard <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Seg({label, options, value, onChange}: {label: string; options: string[]; value?: string; onChange: (v: string) => void}) {
  return (
    <div className="q" role="radiogroup" aria-label={label}>
      <span>{label}</span>
      <div className="seg">
        {options.map(o => (
          <button key={o} role="radio" aria-checked={value === o} aria-pressed={value === o} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Nav({onBack, onNext, disabled, nextLabel = 'Continue'}: {onBack?: () => void; onNext: () => void; disabled?: boolean; nextLabel?: string}) {
  return (
    <div style={{display: 'flex', gap: 10, marginTop: 8}}>
      {onBack && (
        <button className="btn ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
      )}
      <button className="btn" onClick={onNext} disabled={disabled}>
        {nextLabel} <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

import {useEffect, useMemo, useState} from 'react';
import {flushSync} from 'react-dom';
import {Link, Navigate, useParams} from 'react-router-dom';
import {ArrowLeft, ArrowRight, BadgeCheck, Check, CircleCheck, Columns3, Minus, X} from 'lucide-react';
import {Stepper, Step} from '@astryxdesign/core/Stepper';
import {Slider} from '@astryxdesign/core/Slider';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Switch} from '@astryxdesign/core/Switch';
import {Drawer} from '@astryxdesign/core/Drawer';
import {InfoTip} from '@astryxdesign/core/InfoTip';
import {useToast} from '@astryxdesign/core/Toast';
import {useApp} from '../state';
import {useTween} from '../components/viz';
import {SHOP, defaultNeeds, rank, sortRanked, type Needs, type Ranked, type ShopProduct, type SortKey} from '../data/shop';
import {daysUntil, money, moneyShort, shortDate} from '../lib/format';

const STEPS = ['Your needs', 'Compare', 'Request'];
const RATING_TIP = 'Financial-strength grade: how able the carrier is to pay claims. A+ is strongest. Sample grades for this demo.';

export function Shop() {
  const {persona} = useApp();
  const {product: pid} = useParams();
  const products = SHOP[persona.id];
  const product = products.find(p => p.id === pid);

  if (!product) return <Navigate to="/coverage" replace />;
  return <Flow key={persona.id + product.id} product={product} />;
}

function Progress({active, onStep}: {active: number; onStep?: (i: number) => void}) {
  return (
    <div className="shop-steps">
      <Stepper activeStep={active} label="Quote progress" density="compact" onStepClick={onStep ? i => i < active && onStep(i) : undefined}>
        {STEPS.map((l, i) => (
          <Step key={l} step={i} label={l} />
        ))}
      </Stepper>
    </div>
  );
}

/* ---------------- steps 1–3 ---------------- */

function Flow({product}: {product: ShopProduct}) {
  const {policies, addRequest, requests} = useApp();
  const [step, setStep] = useState(1);
  const [needs, setNeeds] = useState<Needs>(() => defaultNeeds(product));
  const [chosen, setChosen] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const ranked = useMemo(() => rank(product, needs), [product, needs]);
  const current = product.replaces ? policies.find(p => p.id === product.replaces) : undefined;
  const existing = requests.find(r => r.product === product.id);

  useEffect(() => {
    window.scrollTo({top: 0});
  }, [step]);

  const pick = (id: string) => {
    setChosen(id);
    setStep(3);
  };

  return (
    <>
      <section className="hello">
        <div>
          <Link to="/coverage" className="back no-print">
            <ArrowLeft size={15} aria-hidden="true" /> Coverage
          </Link>
          <h1>{product.name}</h1>
          <p>{product.reason ?? product.blurb}</p>
        </div>
      </section>
      <Progress active={step - 1} onStep={sent ? undefined : i => setStep(i + 1)} />

      {existing && !sent && step === 1 && (
        <p className="well" style={{padding: '12px 16px', fontSize: 14}}>
          You already asked {existing.carrier} for a firm quote on {shortDate(existing.at.slice(0, 10))}. Starting again replaces that request.
        </p>
      )}

      {step === 1 && <NeedsStep product={product} needs={needs} setNeeds={setNeeds} ranked={ranked} onNext={() => setStep(2)} />}
      {step === 2 && (
        <QuotesStep product={product} needs={needs} setNeeds={setNeeds} ranked={ranked} onEdit={() => setStep(1)} onPick={pick} />
      )}
      {step === 3 && chosen && (
        <ReviewStep
          product={product}
          needs={needs}
          r={ranked.find(r => r.q.id === chosen)!}
          sent={sent}
          renewsOn={current?.renews}
          onBack={() => setStep(2)}
          onSend={(pay, start) => {
            const r = ranked.find(x => x.q.id === chosen)!;
            addRequest({
              id: `${product.id}-${Date.now()}`,
              product: product.id,
              productName: product.name,
              quote: r.q.id,
              carrier: r.q.carrier,
              price: pay === 'monthly' && r.monthly ? r.monthly * 12 : r.price,
              pay,
              limit: needs.limit,
              deductible: needs.deductible,
              start,
              at: new Date().toISOString(),
            });
            setSent(true);
          }}
        />
      )}
      <p className="fine" style={{textAlign: 'center'}}>Prices are estimates until a licensed agent confirms them.</p>
    </>
  );
}

function NeedsStep({
  product,
  needs,
  setNeeds,
  ranked,
  onNext,
}: {
  product: ShopProduct;
  needs: Needs;
  setNeeds: (n: Needs) => void;
  ranked: Ranked[];
  onNext: () => void;
}) {
  const fits = ranked.filter(r => r.fits);
  const avail = ranked.filter(r => !r.blocked);
  const from = fits.length ? Math.min(...fits.map(r => r.price)) : null;
  const idx = product.limits.indexOf(needs.limit);
  const gapTip = product.limits.find(l => l >= 1_000_000);

  return (
    <div className="grid">
      <section className="card s7" aria-labelledby="h-needs" style={{display: 'flex', flexDirection: 'column', gap: 26}}>
        <div>
          <h2 id="h-needs">What should every quote include?</h2>
          <p className="sub">We’ve filled this in from your gaps. Change anything and the quotes update.</p>
        </div>

        <div className="needs-row">
          <div className="needs-label">
            <b>Limit</b>
            <small>The most it pays in a year</small>
          </div>
          <div>
            <div className="display num" style={{fontSize: 34, fontWeight: 600, lineHeight: 1, marginBottom: 6}} aria-hidden="true">
              {moneyShort(needs.limit)}
            </div>
            <Slider
              label="Limit"
              isLabelHidden
              min={0}
              max={product.limits.length - 1}
              step={1}
              value={idx}
              onChange={(v: number) => setNeeds({...needs, limit: product.limits[v]})}
              formatValue={(v: number) => moneyShort(product.limits[v])}
              valueDisplay="none"
              marks={product.limits.map((l, i) => ({value: i, label: moneyShort(l)}))}
            />
            {product.id === 'cyber' && needs.limit < 1_000_000 && gapTip && (
              <p className="warnline">A typical breach at your size costs about $1.15M. Below {moneyShort(gapTip)} you keep most of that risk.</p>
            )}
          </div>
        </div>

        <div className="needs-row">
          <div className="needs-label">
            <b>Deductible</b>
            <small>What you pay first on a claim</small>
          </div>
          <SegmentedControl label="Deductible" value={String(needs.deductible)} onChange={v => setNeeds({...needs, deductible: Number(v)})} layout="fill">
            {product.deductibles.map(d => (
              <SegmentedControlItem key={d} value={String(d)} label={d ? moneyShort(d) : 'None'} />
            ))}
          </SegmentedControl>
        </div>

        <div className="needs-row">
          <div className="needs-label">
            <b>Must-haves</b>
            <small>Quotes missing these rank lower</small>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {product.mustHaves.map(m => {
              const on = needs.must.includes(m.key);
              return (
                <div key={m.key} className={'must' + (on ? ' on' : '')}>
                  <CheckboxInput
                    label={m.label}
                    description={m.hint}
                    value={on}
                    onChange={c => setNeeds({...needs, must: c ? [...needs.must, m.key] : needs.must.filter(k => k !== m.key)})}
                  />
                  {m.recommended && <span className="pill pastel" style={{background: 'var(--yellow)'}}>Closes a gap</span>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mobile-cta" aria-live="polite">
        <span>
          <b className="num">{fits.length} of {product.quotes.length} match</b>
          <small>{from ? `from ${money(from)}/yr` : 'Relax a must-have'}</small>
        </span>
        <button className="btn sm" onClick={onNext}>
          Compare {avail.length} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
      <aside className="s5 sticky-col">
        <section className="card match-card" aria-live="polite" aria-labelledby="h-match">
          <h2 id="h-match" className="h3" style={{color: 'inherit'}}>
            Right now
          </h2>
          <div className="match-big">
            <span className="display num">{fits.length}</span>
            <span>
              of {product.quotes.length} providers meet everything
              {avail.length > fits.length && <small> · {avail.length - fits.length} more come close</small>}
            </span>
          </div>
          <div className="match-dots" aria-hidden="true">
            {ranked.map(r => (
              <i key={r.q.id} className={r.fits ? 'fit' : r.blocked ? 'off' : 'near'} title={r.q.carrier} />
            ))}
          </div>
          <p style={{fontSize: 15}}>{from ? <>Prices that fit start at <b className="num">{money(from)}</b> a year.</> : 'Nothing meets every must-have. Try relaxing one.'}</p>
          <button className="btn" style={{background: '#fff', color: '#16140f', borderColor: '#fff', alignSelf: 'flex-start'}} onClick={onNext}>
            Compare {avail.length} quotes <ArrowRight size={16} aria-hidden="true" />
          </button>
        </section>
      </aside>
    </div>
  );
}

function QuotesStep({
  product,
  needs,
  setNeeds,
  ranked,
  onEdit,
  onPick,
}: {
  product: ShopProduct;
  needs: Needs;
  setNeeds: (n: Needs) => void;
  ranked: Ranked[];
  onEdit: () => void;
  onPick: (id: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>('fit');
  const [onlyFits, setOnlyFits] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const list = sortRanked(ranked, sort).filter(r => !onlyFits || r.fits);
  const fits = ranked.filter(r => r.fits);
  const best = sortRanked(fits, 'fit')[0]?.q.id;
  const cheapest = [...fits].sort((a, b) => a.price - b.price)[0]?.q.id;
  const toggle = (id: string) => setCompare(c => (c.includes(id) ? c.filter(x => x !== id) : c.length >= 3 ? c : [...c, id]));

  return (
    <>
      <section className="card quote-bar" aria-label="Your needs and sorting">
        <div className="needs-chips">
          <span className="pill">{moneyShort(needs.limit)} limit</span>
          <span className="pill">{needs.deductible ? moneyShort(needs.deductible) : 'No'} deductible</span>
          {needs.must.map(k => (
            <span key={k} className="pill">
              {product.mustHaves.find(m => m.key === k)?.label}
            </span>
          ))}
          <button className="link" onClick={onEdit}>
            Edit needs
          </button>
        </div>
        <div className="quote-tools">
          <SegmentedControl label="Sort quotes" value={sort} onChange={v => animate(() => setSort(v as SortKey))} size="sm">
            <SegmentedControlItem value="fit" label="Best fit" />
            <SegmentedControlItem value="price" label="Lowest price" />
            <SegmentedControlItem value="claims" label="Fastest claims" />
          </SegmentedControl>
          <Switch label="Only full matches" value={onlyFits} onChange={v => animate(() => setOnlyFits(v))} size="sm" />
        </div>
      </section>

      <div className="quotes" role="list" aria-label={`${list.length} quotes`}>
        {list.map(r => (
          <QuoteRow
            key={r.q.id}
            r={r}
            product={product}
            needs={needs}
            badge={r.q.id === best ? 'Best fit' : r.q.id === cheapest ? 'Lowest price that fits' : null}
            isCurrent={!!r.q.isCurrent}
            inCompare={compare.includes(r.q.id)}
            compareFull={compare.length >= 3}
            onCompare={() => toggle(r.q.id)}
            onPick={() => onPick(r.q.id)}
            onRelax={k => setNeeds({...needs, must: needs.must.filter(x => x !== k)})}
          />
        ))}
        {list.length === 0 && (
          <div className="card" style={{textAlign: 'center'}}>
            <p className="h3">No quote meets every must-have.</p>
            <p className="sub">Turn off “Only full matches” to see what comes close, or relax a must-have.</p>
          </div>
        )}
      </div>

      {compare.length > 0 && (
        <div className="tray fade-in" role="region" aria-label="Compare tray">
          <span className="tray-names">
            {compare.map(id => {
              const r = ranked.find(x => x.q.id === id)!;
              return (
                <span key={id} className="pill">
                  {r.q.carrier}
                  <button aria-label={`Remove ${r.q.carrier}`} onClick={() => toggle(id)} className="tray-x">
                    <X size={13} aria-hidden="true" />
                  </button>
                </span>
              );
            })}
          </span>
          <span className="tray-hint">{compare.length < 2 ? 'Pick one more to compare' : `${compare.length} of 3 selected`}</span>
          <button className="btn sm" disabled={compare.length < 2} onClick={() => setOpen(true)}>
            <Columns3 size={16} aria-hidden="true" /> Compare side by side
          </button>
        </div>
      )}

      <Drawer isOpen={open} onOpenChange={setOpen} label="Compare quotes side by side" width={980} padding={0}>
        {open && (
          <CompareTable
            product={product}
            needs={needs}
            rows={compare.map(id => ranked.find(r => r.q.id === id)!)}
            onClose={() => setOpen(false)}
            onPick={id => {
              setOpen(false);
              onPick(id);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

function Monogram({name, tone}: {name: string; tone: string}) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('');
  return (
    <span className="mono" style={{background: tone}} aria-hidden="true">
      {letters}
    </span>
  );
}

const TONES = ['var(--peri)', 'var(--pink)', 'var(--sage)', 'var(--lilac)', 'var(--yellow)', 'var(--orange)'];
const toneFor = (id: string) => TONES[[...id].reduce((s, c) => s + c.charCodeAt(0), 0) % TONES.length];

function QuoteRow({
  r,
  product,
  needs,
  badge,
  isCurrent,
  inCompare,
  compareFull,
  onCompare,
  onPick,
  onRelax,
}: {
  r: Ranked;
  product: ShopProduct;
  needs: Needs;
  badge: string | null;
  isCurrent: boolean;
  inCompare: boolean;
  compareFull: boolean;
  onCompare: () => void;
  onPick: () => void;
  onRelax: (k: string) => void;
}) {
  const price = useTween(r.price, 450);
  return (
    <article
      role="listitem"
      className={'quote' + (r.blocked ? ' blocked' : '') + (badge === 'Best fit' ? ' top' : '')}
      style={{viewTransitionName: `q-${r.q.id}`}}
      aria-label={`${r.q.carrier}, ${money(r.price)} a year`}>
      <Monogram name={r.q.carrier} tone={toneFor(r.q.id)} />
      <div className="quote-main">
        <div className="quote-title">
          <h3 className="h3">{r.q.carrier}</h3>
          {badge && (
            <span className="pill pastel" style={{background: badge === 'Best fit' ? 'var(--yellow)' : 'var(--sage)'}}>
              {badge}
            </span>
          )}
          {isCurrent && <span className="pill">Current carrier</span>}
        </div>
        <p className="quote-meta">
          <span className="rating">
            <BadgeCheck size={15} aria-hidden="true" /> {r.q.rating}
            <InfoTip content={RATING_TIP} label="What the rating means" size="xsm" />
          </span>
          <span aria-hidden="true">·</span>
          <span>~{r.q.claimsDays}-day claims</span>
        </p>
        {needs.must.length > 0 && (
          <ul className="musts" aria-label="Must-haves">
            {needs.must.map(k => {
              const ok = r.q.features[k];
              const m = product.mustHaves.find(x => x.key === k)!;
              return (
                <li key={k} className={ok ? 'ok' : 'no'}>
                  {ok ? <Check size={14} strokeWidth={2.8} aria-label="Included" /> : <X size={14} strokeWidth={2.8} aria-label="Missing" />}
                  <span>{m.label}</span>
                  {!ok && !r.blocked && (
                    <button className="relax" onClick={() => onRelax(k)} aria-label={`I don’t need: ${m.label}`}>
                      Don’t need it
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="quote-hl">
          {r.q.highlight}
          {(r.blocked || r.q.caveat) && <span className="quote-caveat"> {r.blocked ?? r.q.caveat}</span>}
        </p>
      </div>

      <div className="quote-price">
        {r.blocked ? (
          <span className="sub" style={{marginTop: 0}}>
            Not available as set up
          </span>
        ) : (
          <>
            <div className="display num price">
              {money(price)}
              <small>/yr</small>
            </div>
            <small className="quote-monthly">{r.monthly ? `or ${money(r.monthly)}/mo` : 'Annual only'}</small>
            <div className="quote-actions">
              <label className={'cmpbox' + (inCompare ? ' on' : '')}>
                <input type="checkbox" aria-label={`Compare ${r.q.carrier}`} checked={inCompare} disabled={!inCompare && compareFull} onChange={onCompare} />
                <span className="box" aria-hidden="true">
                  {inCompare && <Check size={13} strokeWidth={3} />}
                </span>
                Compare
              </label>
              <button className={'btn sm' + (badge === 'Best fit' ? ' blue' : '')} onClick={onPick}>
                Choose
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

/** Animates a state change with the View Transitions API when available. */
function animate(fn: () => void) {
  const d = document as Document & {startViewTransition?: (cb: () => void) => unknown};
  if (!d.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return fn();
  d.startViewTransition(() => flushSync(fn));
}

function CompareTable({
  product,
  needs,
  rows,
  onClose,
  onPick,
}: {
  product: ShopProduct;
  needs: Needs;
  rows: Ranked[];
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const [diffOnly, setDiffOnly] = useState(false);
  type Line = {label: string; cells: (string | boolean)[]; best?: number; hint?: string};
  const minIdx = (vals: number[]) => vals.indexOf(Math.min(...vals));
  const lines: Line[] = [
    {label: 'Price per year', cells: rows.map(r => money(r.price)), best: minIdx(rows.map(r => r.price))},
    {label: 'Monthly option', cells: rows.map(r => (r.monthly ? `${money(r.monthly)}/mo` : 'No'))},
    {label: 'Limit', cells: rows.map(() => moneyShort(needs.limit))},
    {label: 'Deductible', cells: rows.map(() => (needs.deductible ? moneyShort(needs.deductible) : 'None'))},
    ...product.mustHaves.map(m => ({label: m.label, cells: rows.map(r => !!r.q.features[m.key]), hint: needs.must.includes(m.key) ? 'Must-have' : undefined})),
    {label: 'Claims paid in', cells: rows.map(r => `~${r.q.claimsDays} days`), best: minIdx(rows.map(r => r.q.claimsDays))},
    {label: 'Financial strength', cells: rows.map(r => r.q.rating)},
    {label: 'Highest limit offered', cells: rows.map(r => moneyShort(r.q.maxLimit))},
  ];
  const shown = diffOnly ? lines.filter(l => new Set(l.cells.map(String)).size > 1) : lines;

  return (
    <div className="cmp-drawer">
      <div className="cmp-head">
        <div>
          <h2 className="h2">Side by side</h2>
          <p className="sub">
            {product.name} at a {moneyShort(needs.limit)} limit. Green marks the better value in a row.
          </p>
        </div>
        <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
          <Switch label="Only differences" value={diffOnly} onChange={setDiffOnly} size="sm" />
          <button className="round" style={{width: 42, height: 42}} aria-label="Close" onClick={onClose} data-autofocus>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="sub" style={{marginBottom: 12}}>Scroll the table sideways on smaller screens to see every provider.</p>
      <div className="cmp-scroll" tabIndex={0} role="region" aria-label="Provider comparison table">
        <table className="cmp-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Detail</span>
              </th>
              {rows.map(r => (
                <th scope="col" key={r.q.id}>
                  <Monogram name={r.q.carrier} tone={toneFor(r.q.id)} />
                  <b>{r.q.carrier}</b>
                  {r.fits ? (
                    <span className="pill pastel" style={{background: 'var(--sage)'}}>
                      Meets all must-haves
                    </span>
                  ) : (
                    <span className="pill pastel" style={{background: 'var(--pink)'}}>
                      Misses {r.missing.length}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(l => (
              <tr key={l.label}>
                <th scope="row">
                  {l.label}
                  {l.hint && <small>{l.hint}</small>}
                </th>
                {l.cells.map((c, i) => (
                  <td key={i} className={l.best === i && rows.length > 1 ? 'best' : typeof c === 'boolean' ? (c ? 'yes' : 'no') : ''}>
                    {typeof c === 'boolean' ? (
                      c ? (
                        <>
                          <CircleCheck size={18} aria-hidden="true" /> <span className="sr-only">Yes</span>
                        </>
                      ) : (
                        <>
                          <Minus size={18} aria-hidden="true" /> <span className="sr-only">No</span>
                        </>
                      )
                    ) : (
                      c
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">In their words</th>
              {rows.map(r => (
                <td key={r.q.id} style={{fontSize: 13.5, textAlign: 'left'}}>
                  {r.q.highlight}
                  {r.q.caveat && <span style={{display: 'block', color: 'var(--muted)', marginTop: 6}}>{r.q.caveat}</span>}
                </td>
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" />
              {rows.map(r => (
                <td key={r.q.id}>
                  <button className="btn sm" onClick={() => onPick(r.q.id)}>
                    Choose {r.q.carrier.split(' ')[0]}
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function ReviewStep({
  product,
  needs,
  r,
  sent,
  renewsOn,
  onBack,
  onSend,
}: {
  product: ShopProduct;
  needs: Needs;
  r: Ranked;
  sent: boolean;
  renewsOn?: string;
  onBack: () => void;
  onSend: (pay: 'annual' | 'monthly', start: string) => void;
}) {
  const {persona} = useApp();
  const toast = useToast();
  const [pay, setPay] = useState<'annual' | 'monthly'>('annual');
  const [start, setStart] = useState(renewsOn && daysUntil(renewsOn) > 0 ? 'renewal' : 'asap');
  const [consent, setConsent] = useState(false);
  const closes = persona.gaps.filter(g => g.compareId === product.id || (product.id === 'epl-r' && g.id === 'g-epl'));
  const closesRecommended = product.mustHaves.filter(m => m.recommended).every(m => r.q.features[m.key]);
  const closed = closesRecommended && needs.limit >= product.defaultLimit ? closes : [];
  const total = pay === 'monthly' && r.monthly ? r.monthly * 12 : r.price;
  const startLabel = start === 'renewal' && renewsOn ? `${shortDate(renewsOn)} (when your current policy ends)` : 'As soon as it’s confirmed';

  if (sent)
    return (
      <section className="card sent fade-in" aria-live="polite">
        <span className="sent-check" aria-hidden="true">
          <Check size={34} strokeWidth={3} />
        </span>
        <h2 className="h2" style={{fontSize: 34}}>
          Request sent to {r.q.carrier}
        </h2>
        <p style={{maxWidth: '56ch', fontSize: 16}}>
          A licensed agent will confirm your details and send a firm quote, usually within one business day. Nothing is bought until you sign and
          pay the carrier. <b>Demo: nothing was actually sent.</b>
        </p>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Link to="/policies" className="btn">
            Track it in Policies <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/coverage" className="btn ghost">
            Back to coverage
          </Link>
        </div>
      </section>
    );

  return (
    <div className="grid">
      <section className="card s7" aria-labelledby="h-rev" style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <div className="review-head">
          <Monogram name={r.q.carrier} tone={toneFor(r.q.id)} />
          <div>
            <h2 id="h-rev">{r.q.carrier}</h2>
            <p className="sub" style={{marginTop: 2}}>
              {product.name} · {moneyShort(needs.limit)} limit · {needs.deductible ? moneyShort(needs.deductible) : 'no'} deductible
            </p>
          </div>
          <div style={{marginLeft: 'auto', textAlign: 'right'}}>
            <div className="display num" style={{fontSize: 40, fontWeight: 600, lineHeight: 1}}>
              {money(total)}
            </div>
            <small className="sub" style={{marginTop: 2, display: 'block'}}>
              per year
            </small>
          </div>
        </div>

        {r.q.caveat && <p className="warnline" style={{marginTop: 0}}>Worth knowing: {r.q.caveat}</p>}

        {r.monthly && (
          <div className="needs-row">
            <div className="needs-label">
              <b>How you’ll pay</b>
              <small>Paid to the carrier, not to us</small>
            </div>
            <SegmentedControl label="Payment" value={pay} onChange={v => setPay(v as 'annual' | 'monthly')} layout="fill">
              <SegmentedControlItem value="annual" label={`Yearly · ${money(r.price)}`} />
              <SegmentedControlItem value="monthly" label={`Monthly · ${money(r.monthly)}`} />
            </SegmentedControl>
          </div>
        )}
        {renewsOn && daysUntil(renewsOn) > 0 && (
          <div className="needs-row">
            <div className="needs-label">
              <b>Start date</b>
              <small>Avoid paying for two policies</small>
            </div>
            <SegmentedControl label="Start date" value={start} onChange={setStart} layout="fill">
              <SegmentedControlItem value="renewal" label={`At renewal · ${shortDate(renewsOn).replace(/, \d{4}$/, '')}`} />
              <SegmentedControlItem value="asap" label="As soon as possible" />
            </SegmentedControl>
          </div>
        )}

        <div>
          <h3 className="h3" style={{marginBottom: 10}}>
            What happens next
          </h3>
          <ol className="next">
            <li>
              <b>A licensed agent checks your details</b>
              <span>Usually within one business day. They may ask a few underwriting questions.</span>
            </li>
            <li>
              <b>You get a firm quote and the policy wording</b>
              <span>We’ll explain it in plain English in Policies before you sign.</span>
            </li>
            <li>
              <b>You sign and pay {r.q.carrier} directly</b>
              <span>Coverage starts {startLabel.toLowerCase().startsWith('as') ? 'as soon as it’s confirmed' : `on ${startLabel}`}.</span>
            </li>
          </ol>
        </div>

        <p className="fine">Demo only: nothing is shared or sent. This saves a simulated request in Policies.</p>
        <div className="well" style={{padding: 14}}>
          <Switch
            label="Allow sharing business details (demo)"
            description={product.shares.join(' · ')}
            value={consent}
            onChange={setConsent}
            labelSpacing="spread"
            labelPosition="start"
            width="100%"
          />
        </div>

        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <button className="btn ghost" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to quotes
          </button>
          <button
            className="btn blue"
            disabled={!consent}
            onClick={() => {
              onSend(pay, start === 'renewal' && renewsOn ? renewsOn : 'asap');
              toast({body: `Firm quote requested from ${r.q.carrier}. Track it in Policies. (Demo: nothing was sent.)`, uniqueID: 'req'});
            }}>
            Request firm quote <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      <aside className="s5" style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        <section className={'card verdict-card ' + (closed.length ? 'good' : 'warn')} aria-labelledby="h-gapsclosed">
          <h2 id="h-gapsclosed">
            {closed.length ? `Addresses ${closed.length === 1 ? 'a coverage gap' : `${closed.length} gaps`}` : 'Doesn’t fully close your gap'}
          </h2>
          {closed.length ? (
            <ul className="ul" style={{marginTop: 12}}>
              {closed.map(g => (
                <li key={g.id}>
                  <Check size={18} aria-hidden="true" />
                  <span>
                    {g.title} <b className="num">({moneyShort(g.exposure)})</b>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{marginTop: 10, fontSize: 14.5}}>
              {!closesRecommended ? `It misses recommended coverage: ${product.mustHaves.filter(m => m.recommended && !r.q.features[m.key]).map(m => m.label.toLowerCase()).join(', ')}.` : needs.limit < product.defaultLimit ? 'Your chosen limit is below the recommended amount.' : 'Review the policy wording with an agent to confirm your coverage.'} You can still request it.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}

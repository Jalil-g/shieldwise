import {useEffect, useMemo, useRef, useState} from 'react';
import type {Persona, TrendPoint} from '../data/types';
import {mult} from '../lib/format';

const MIN = 0.4;
const MAX = 2.6;
const pos = (v: number) => ((Math.min(MAX, Math.max(MIN, v)) - MIN) / (MAX - MIN)) * 100;

/** Smoothly animates a number toward its target. */
export function useTween(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setV(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 4);
      const cur = a + (target - a) * e;
      setV(cur);
      from.current = cur;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/**
 * Peer distribution as a dot histogram along a multiplier axis, with markers
 * for the typical peer, the owner, and where the owner could be after actions.
 */
export function PeerStrip({persona, value, goal}: {persona: Persona; value: number; goal?: number}) {
  const dots = useMemo(() => {
    const bins: Record<number, number> = {};
    return persona.peers.map(p => {
      const b = Math.round(pos(p) / 1.6);
      const row = (bins[b] = (bins[b] ?? 0) + 1) - 1;
      return {left: b * 1.6, row, hot: Math.abs(p - 1) < 0.15};
    });
  }, [persona.peers]);
  const ticks = [0.5, 1, 1.5, 2, 2.5];
  const describe = `Peer comparison: a typical ${persona.business.peer} is 1.0×. You are at ${mult(value)}${goal ? `, and could reach ${mult(goal)} by completing your actions` : ''}.`;
  return (
    <div className="strip" role="img" aria-label={describe} style={goal === undefined ? {marginBottom: -30} : undefined}>
      <div className="dots" aria-hidden="true">
        {dots.map((d, i) => (
          <i key={i} className={d.hot ? 'hot' : ''} style={{left: `${d.left}%`, bottom: d.row * 9}} />
        ))}
      </div>
      <div className="axis" aria-hidden="true" />
      <div className="ticks" aria-hidden="true">
        {ticks.map(t => (
          <span key={t} style={{left: `${pos(t)}%`}}>
            {t.toFixed(1)}×
          </span>
        ))}
      </div>
      <div className="marker typical" style={{left: `${pos(1)}%`}} aria-hidden="true">
        <span className="tag">Typical 1.0×</span>
        <span className="stem" style={{height: 84}} />
      </div>
      {goal !== undefined && goal < value - 0.02 && (
        <div className="marker goal below" style={{left: `${pos(goal)}%`}} aria-hidden="true">
          <span className="tag">Possible {mult(goal)}</span>
          <span className="stem" style={{height: 30}} />
        </div>
      )}
      <div className="marker you" style={{left: `${pos(value)}%`}} aria-hidden="true">
        <span className="tag">You {mult(value)}</span>
        <span className="stem" style={{height: 114}} />
      </div>
    </div>
  );
}

/** Weekly multiplier line with annotated events. */
export function TrendChart({points, live}: {points: TrendPoint[]; live: number}) {
  const W = 440;
  const H = 210;
  const pad = {l: 36, r: 10, t: 14, b: 26};
  const data = [...points.slice(0, -1), {...points.at(-1)!, value: live}];
  const lo = Math.min(1.0, ...data.map(d => d.value)) - 0.1;
  const hi = Math.max(...data.map(d => d.value)) + 0.1;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const [hover, setHover] = useState<number | null>(null);
  const notes = data.map((d, i) => ({...d, i})).filter(d => d.note);
  const active = hover ?? notes.at(-1)!.i;
  const grid = [1, Math.round(((lo + hi) / 2) * 10) / 10, Math.floor(hi * 10) / 10].filter((v, i, a) => a.indexOf(v) === i && v > lo && v < hi);

  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Weekly risk multiplier from ${data[0].week} (${mult(data[0].value)}) to now (${mult(live)}).`}>
        {grid.map(g => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="var(--track)" strokeWidth={g === 1 ? 2 : 1} strokeDasharray={g === 1 ? '0' : '3 5'} />
            <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">
              {g.toFixed(1)}×
            </text>
          </g>
        ))}
        <text x={W - pad.r} y={y(1) - 6} textAnchor="end" fontSize="11.5" fill="var(--muted)">
          typical peer
        </text>
        <path d={area} fill="var(--pink)" opacity="0.35" />
        <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {notes.map(n => (
          <g key={n.i} className="note-dot" onMouseEnter={() => setHover(n.i)} onFocus={() => setHover(n.i)} tabIndex={0} role="button" aria-label={`${n.week}: ${n.note}`}>
            <circle cx={x(n.i)} cy={y(n.value)} r="14" fill="transparent" />
            <circle cx={x(n.i)} cy={y(n.value)} r={active === n.i ? 7 : 5.5} fill={active === n.i ? 'var(--orange)' : 'var(--card)'} stroke="var(--ink)" strokeWidth="2" />
          </g>
        ))}
        <circle cx={x(data.length - 1)} cy={y(live)} r="7" fill="var(--blue)" stroke="var(--card)" strokeWidth="2.5" />
        {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
          <text key={i} x={x(i)} y={H - 6} fontSize="12" fill="var(--muted)" textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>
            {i === data.length - 1 ? 'Now' : data[i].week}
          </text>
        ))}
      </svg>
      <p className="well" style={{padding: '10px 14px', fontSize: 14, marginTop: 10}} aria-live="polite">
        <b>{data[active].week}:</b> {data[active].note}
      </p>
    </div>
  );
}

/** Bar that diverges from the 1.0× peer baseline. */
export function Diverge({value, base, tone}: {value: number; base?: number; tone: string}) {
  const b = pos(1);
  const v = pos(value);
  const left = Math.min(b, v);
  const width = Math.abs(v - b);
  return (
    <div className="diverge" aria-hidden="true">
      <div className="track" />
      {base !== undefined && base > value + 0.01 && (
        <div className="bar" style={{left: `${Math.min(b, pos(base))}%`, width: `${Math.abs(pos(base) - b)}%`, background: 'transparent', outline: '1.5px dashed var(--ink)', outlineOffset: -1.5, opacity: 0.45}} />
      )}
      <div className="bar" style={{left: `${left}%`, width: `${width}%`, background: tone, outline: '1.5px solid var(--ink)', outlineOffset: -1.5}} />
      <div className="base" style={{left: `calc(${b}% - 1px)`}} />
    </div>
  );
}

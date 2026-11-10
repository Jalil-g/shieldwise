/** Deterministic synthetic peer distribution (log-normal-ish around a median). */
export function peerCloud(seed: number, median: number, spread: number, n = 140): number[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    // Box–Muller
    const u = Math.max(rand(), 1e-6);
    const v = rand();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    const x = median * Math.exp(z * spread);
    if (x >= 0.45 && x <= 2.5) out.push(x);
  }
  return out.sort((a, b) => a - b);
}

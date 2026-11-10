export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export const moneyShort = (n: number) => {
  if (n >= 1_000_000) return '$' + +(n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 0) + 'M';
  if (n >= 1_000) return '$' + +(n / 1_000).toFixed(n % 1000 && n < 10_000 ? 1 : 0) + 'K';
  return '$' + n;
};

export const mult = (n: number) => n.toFixed(1) + '×';

/** Demo "today". The prototype is pinned so renewal countdowns stay stable in pitches. */
export const TODAY = new Date('2026-11-10T12:00:00');

export const daysUntil = (iso: string) =>
  Math.round((new Date(iso + 'T12:00:00').getTime() - TODAY.getTime()) / 86_400_000);

export const shortDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

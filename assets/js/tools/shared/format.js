// Number formatting helpers shared by the tools (pure functions, unit-tested).
export function fmtInt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export function fmtMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (n === 0) return "$0";
  const abs = Math.abs(n);
  if (abs < 0.00001) return "<$0.00001";
  const digits = abs >= 100 ? 0 : abs >= 1 ? 2 : abs >= 0.01 ? 3 : 5;
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: Math.min(digits, 2), maximumFractionDigits: digits });
}

export function fmtTokens(n) {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 0)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(n % 1_000 ? 1 : 0)}K`;
  return String(n);
}

export function fmtPct(n) {
  if (n > 0 && n < 0.001) return "<0.1%";
  return `${(n * 100).toFixed(n < 0.1 ? 1 : 0)}%`;
}

// Whole days from `today` (a Date at local midnight) to an ISO date string.
export function daysUntil(iso, today = new Date()) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

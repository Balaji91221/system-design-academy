// ============================================================================
//  STREAKS & HEATMAP — derive study streaks and a GitHub-style activity grid
//  from a { "YYYY-MM-DD": count } activity map. Pure logic, no deps.
// ============================================================================

const DAY = 86_400_000;

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / DAY);

// Current streak (counting back from today, tolerant of "not yet today") and
// the longest streak ever.
export function computeStreaks(activity) {
  const active = (d) => (activity[todayStr(d)] || 0) > 0;

  let current = 0;
  const d = new Date();
  if (!active(d)) d.setDate(d.getDate() - 1); // today not done yet — start from yesterday
  while (active(d)) { current++; d.setDate(d.getDate() - 1); }

  const dates = Object.keys(activity).filter((k) => activity[k] > 0).sort();
  let longest = 0, run = 0, prev = null;
  for (const ds of dates) {
    run = prev && diffDays(prev, ds) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = ds;
  }
  return { current, longest };
}

// Build `weeks` columns of 7 days (Sun→Sat), ending today, for the heatmap.
export function heatmapWeeks(activity, weeks = 12) {
  const end = new Date(); end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay()); // align to Sunday

  const cells = [];
  const todayKey = todayStr();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = todayStr(d);
    cells.push({ date: key, count: activity[key] || 0, isToday: key === todayKey });
  }
  const cols = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));
  return cols;
}

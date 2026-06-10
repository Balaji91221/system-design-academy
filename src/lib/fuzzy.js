// ============================================================================
//  FUZZY MATCH — a tiny subsequence scorer (no dependencies). Returns a score
//  (higher = better) or -1 when `query` is not an in-order subsequence of
//  `text`. Bonuses for consecutive matches and word-start matches.
// ============================================================================

const BOUNDARY = /[\s\-_/.:,]/;

export function fuzzyScore(query, text) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0, score = 0, prev = -2;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += ti === prev + 1 ? 3 : 1;                 // consecutive bonus
      if (ti === 0 || BOUNDARY.test(t[ti - 1])) score += 2; // word-start bonus
      prev = ti;
      qi++;
    }
  }
  return qi === q.length ? score : -1; // require the whole query to match
}

// Rank a list of items by best fuzzy score against their searchable text.
// `getText` maps an item to its searchable string. Drops non-matches.
export function fuzzyRank(query, items, getText, limit = 25) {
  if (!query.trim()) return items.slice(0, limit);
  return items
    .map((item) => ({ item, score: fuzzyScore(query, getText(item)) }))
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}

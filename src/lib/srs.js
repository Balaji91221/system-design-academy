// ============================================================================
//  SPACED REPETITION (SM-2) — schedules flashcard reviews. Each card stores
//  { easeFactor, interval (days), repetitions, dueDate (ms) }. Grades:
//  again / hard / good / easy. Pure logic, no deps.
// ============================================================================

const DAY = 86_400_000;
const QUALITY = { again: 2, hard: 3, good: 4, easy: 5 };
const round2 = (n) => Math.round(n * 100) / 100;

// Compute the next schedule from the previous one and a grade.
export function sm2(prev, grade, now = Date.now()) {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = prev || {};
  const q = QUALITY[grade] ?? 4;

  if (q < 3) {
    // "Again" — reset and resurface almost immediately.
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = grade === "hard" ? 3 : 6;
    else interval = Math.round(interval * (grade === "hard" ? Math.max(1.2, easeFactor - 0.15) : easeFactor));
    repetitions += 1;
  }

  // Standard SM-2 ease adjustment, clamped to a 1.3 floor.
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const dueDate = now + (interval > 0 ? interval * DAY : 30_000); // 30s if "again"
  return { easeFactor: round2(easeFactor), interval, repetitions, dueDate };
}

// A card is due if it has no schedule yet (new) or its dueDate has passed.
export const isDue = (schedule, now = Date.now()) => !schedule || (schedule.dueDate || 0) <= now;

// How many of `allCards` are currently due, given the srs map (id -> schedule).
export function countDue(srs, allCards, now = Date.now()) {
  return allCards.filter((c) => isDue(srs[c.id], now)).length;
}

// Human label for when a grade will next surface the card (for button hints).
export function nextHint(grade) {
  return { again: "<1m", hard: "short", good: "days", easy: "longer" }[grade] || "";
}

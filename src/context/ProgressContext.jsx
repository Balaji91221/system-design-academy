import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { todayStr } from "../lib/streaks.js";

// ============================================================================
//  GLOBAL PROGRESS / PREFERENCES — persisted to localStorage so a learner's
//  state (completed concepts, bookmarks, chosen depth & tier, flashcard
//  scheduling) survives reloads and is shared across every page.
// ============================================================================

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [done, setDone] = useLocalStorage("sda.done", []);          // concept nums
  const [bookmarks, setBookmarks] = useLocalStorage("sda.bookmarks", []);
  const [depth, setDepth] = useLocalStorage("sda.depth", "core");   // simple|core|deep
  const [tier, setTier] = useLocalStorage("sda.tier", null);        // chosen on first visit
  const [lastConcept, setLastConcept] = useLocalStorage("sda.last", 0);
  const [customQuestions, setCustomQuestions] = useLocalStorage("sda.customQ", []); // user-added interview Qs

  // Versioned keys (future migrations won't corrupt old data):
  const [srs, setSrs] = useLocalStorage("sda.srs.v2", {});               // cardId -> SM-2 schedule
  const [quizzesPassed, setQuizzesPassed] = useLocalStorage("sda.quizzes.v1", []); // section indices
  const [activity, setActivity] = useLocalStorage("sda.activity.v1", {}); // "YYYY-MM-DD" -> count

  const doneSet = useMemo(() => new Set(done), [done]);
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const toggleDone = (num) =>
    setDone((p) => (p.includes(num) ? p.filter((n) => n !== num) : [...p, num]));
  const toggleBookmark = (num) =>
    setBookmarks((p) => (p.includes(num) ? p.filter((n) => n !== num) : [...p, num]));

  const addQuestion = (qObj) =>
    setCustomQuestions((p) => [{ ...qObj, id: `custom-${Date.now()}`, custom: true }, ...p]);
  const removeQuestion = (id) =>
    setCustomQuestions((p) => p.filter((x) => x.id !== id));

  // Record a day of study activity (lesson done / card reviewed / quiz taken).
  const recordActivity = () =>
    setActivity((a) => { const d = todayStr(); return { ...a, [d]: (a[d] || 0) + 1 }; });

  const quizSet = useMemo(() => new Set(quizzesPassed), [quizzesPassed]);
  const isQuizPassed = (si) => quizSet.has(si);
  const markQuizPassed = (si) =>
    setQuizzesPassed((p) => (p.includes(si) ? p : [...p, si]));

  const value = {
    done, doneSet, toggleDone,
    bookmarks, bookmarkSet, toggleBookmark,
    depth, setDepth,
    tier, setTier,
    lastConcept, setLastConcept,
    customQuestions, addQuestion, removeQuestion,
    srs, setSrs,
    quizzesPassed, quizSet, isQuizPassed, markQuizPassed,
    activity, recordActivity,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}

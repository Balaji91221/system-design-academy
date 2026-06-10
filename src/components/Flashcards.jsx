import React, { useMemo, useState } from "react";
import { C, mono, display } from "../theme.js";
import { FLASHCARDS } from "../data/flashcards.js";
import { useProgress } from "../context/ProgressContext.jsx";
import { sm2, isDue, nextHint } from "../lib/srs.js";

const GRADES = [
  { g: "again", label: "Again", c: C.red },
  { g: "hard", label: "Hard", c: C.amber },
  { g: "good", label: "Good", c: C.blue },
  { g: "easy", label: "Easy", c: C.green },
];

// Spaced-repetition flashcards (SM-2). In `reviewOnly` mode the deck contains
// only due cards. Grading reschedules the card and records study activity.
export default function Flashcards({ topic, reviewOnly = false }) {
  const { srs, setSrs, recordActivity } = useProgress();
  const [flipped, setFlipped] = useState(false);
  const [pos, setPos] = useState(0);

  const deck = useMemo(
    () => (topic === "All" ? FLASHCARDS : FLASHCARDS.filter((c) => c.topic === topic)),
    [topic]
  );

  const pool = useMemo(() => {
    const due = deck.filter((c) => isDue(srs[c.id]));
    if (reviewOnly) return due;
    return due.concat(deck.filter((c) => !isDue(srs[c.id]))); // due first, then the rest
  }, [deck, srs, reviewOnly]);

  const dueCount = useMemo(() => deck.filter((c) => isDue(srs[c.id])).length, [deck, srs]);

  if (reviewOnly && pool.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: C.dim }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>All caught up!</div>
        <div style={{ fontSize: 13, fontFamily: mono, marginTop: 6 }}>No cards due for review in this topic.</div>
      </div>
    );
  }
  if (pool.length === 0) return <div style={{ color: C.dim, fontFamily: mono, padding: 30 }}>No cards in this topic.</div>;

  const card = pool[pos % pool.length];

  const grade = (g) => {
    setSrs((prev) => ({ ...prev, [card.id]: sm2(prev[card.id], g) }));
    recordActivity();
    setFlipped(false);
    setPos((p) => p + 1);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontFamily: mono, fontSize: 12, color: C.dim }}>
        <span>{card.topic}</span>
        <span>{dueCount} due · {deck.length} in deck</span>
      </div>

      {/* card */}
      <button onClick={() => setFlipped((f) => !f)} className="animCard" aria-label="Flip flashcard" style={{
        width: "100%", minHeight: 220, padding: "28px 26px", borderRadius: 16, cursor: "pointer",
        background: flipped ? `linear-gradient(135deg,${C.teal}12,transparent)` : C.panel,
        border: `1px solid ${flipped ? C.teal + "55" : C.line}`, textAlign: "left", color: C.ink,
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 12,
      }}>
        <div style={{ fontSize: 10.5, fontFamily: mono, color: flipped ? C.teal : C.faint, letterSpacing: 1 }}>
          {flipped ? "ANSWER" : "QUESTION · tap to flip"}
        </div>
        <div style={{ fontSize: flipped ? 16 : 20, fontWeight: flipped ? 400 : 700, lineHeight: 1.5, fontFamily: display }}>
          {flipped ? card.back : card.front}
        </div>
      </button>

      {/* grading */}
      {flipped ? (
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {GRADES.map((b) => (
            <button key={b.g} className="btn" onClick={() => grade(b.g)} style={{
              flex: 1, padding: "11px 6px", borderRadius: 10, border: `1px solid ${b.c}55`, cursor: "pointer",
              background: `${b.c}14`, color: b.c, fontFamily: display, fontSize: 13.5, fontWeight: 600,
            }}>{b.label}<br /><span style={{ fontSize: 9.5, color: C.faint, fontFamily: mono }}>{nextHint(b.g)}</span></button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: 16, fontFamily: mono, fontSize: 12, color: C.faint }}>
          tap the card to reveal the answer
        </div>
      )}
    </div>
  );
}

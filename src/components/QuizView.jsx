import React, { useState, useEffect } from "react";
import { C, mono, display } from "../theme.js";
import { QUIZZES, PASS_RATIO } from "../data/quizzes.js";
import { useProgress } from "../context/ProgressContext.jsx";

// A section checkpoint quiz shown as a modal overlay. Scoring >= 80% marks the
// section's quiz as passed and records study activity.
export default function QuizView({ sectionIndex, color = C.teal, onClose }) {
  const quiz = QUIZZES[sectionIndex];
  const { markQuizPassed, recordActivity } = useProgress();
  const [answers, setAnswers] = useState({});       // qIndex -> chosen option index
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!quiz) return null;
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const ratio = correct / total;
  const passed = ratio >= PASS_RATIO;
  const allAnswered = Object.keys(answers).length === total;

  const submit = () => {
    setSubmitted(true);
    recordActivity();
    if (ratio >= PASS_RATIO) markQuizPassed(sectionIndex);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`${quiz.title} checkpoint quiz`}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(4,8,14,.72)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "5vh 16px" }}>
      <div className="reveal" onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 680, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, boxShadow: "0 40px 90px -30px rgba(0,0,0,.9)" }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.line}`, background: `${color}10` }}>
          <div>
            <div style={{ fontSize: 10.5, fontFamily: mono, color, letterSpacing: 1 }}>SECTION CHECKPOINT</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{quiz.title}</div>
          </div>
          <button className="btn" onClick={onClose} aria-label="Close quiz" style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontFamily: mono, fontSize: 18 }}>✕</button>
        </div>

        {/* result banner */}
        {submitted && (
          <div style={{ padding: "14px 20px", background: passed ? `${C.green}14` : `${C.red}12`, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>{passed ? "🎉" : "📚"}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: passed ? C.green : C.red }}>
                {correct}/{total} correct ({Math.round(ratio * 100)}%) — {passed ? "Passed!" : "Keep going"}
              </div>
              <div style={{ fontSize: 12.5, color: C.dim }}>{passed ? "This section's checkpoint is now marked complete." : `You need ${Math.round(PASS_RATIO * 100)}% to pass — review and retry.`}</div>
            </div>
          </div>
        )}

        {/* questions */}
        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 22 }}>
          {quiz.questions.map((q, qi) => (
            <div key={qi}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
                <span style={{ color, fontFamily: mono, marginRight: 8 }}>{qi + 1}.</span>{q.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const isCorrect = oi === q.answer;
                  let bg = C.panel2, bd = C.line, fg = C.ink;
                  if (submitted) {
                    if (isCorrect) { bg = `${C.green}14`; bd = C.green; fg = C.green; }
                    else if (chosen) { bg = `${C.red}12`; bd = C.red; fg = C.red; }
                  } else if (chosen) { bg = `${color}14`; bd = color; }
                  return (
                    <button key={oi} className="btn" disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      style={{ textAlign: "left", padding: "10px 14px", borderRadius: 9, border: `1px solid ${bd}`, background: bg, color: fg, cursor: submitted ? "default" : "pointer", fontFamily: display, fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: mono, fontSize: 12, color: C.faint }}>{String.fromCharCode(65 + oi)}</span>
                      <span>{opt}</span>
                      {submitted && isCorrect && <span style={{ marginLeft: "auto", color: C.green }}>✓</span>}
                      {submitted && chosen && !isCorrect && <span style={{ marginLeft: "auto", color: C.red }}>✗</span>}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div style={{ marginTop: 8, fontSize: 12.5, color: C.dim, lineHeight: 1.5, paddingLeft: 4 }}>
                  <span style={{ color: C.amber, fontFamily: mono }}>why: </span>{q.explain}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {!submitted ? (
            <button className="btn" onClick={submit} disabled={!allAnswered} style={{
              padding: "11px 22px", borderRadius: 10, border: "none",
              background: allAnswered ? `linear-gradient(135deg,${color},${C.teal})` : C.panel2,
              color: allAnswered ? "#04121a" : C.faint, cursor: allAnswered ? "pointer" : "default",
              fontFamily: display, fontSize: 14, fontWeight: 700,
            }}>{allAnswered ? "Submit answers" : `Answer all ${total} questions`}</button>
          ) : (
            <>
              <button className="btn" onClick={() => { setAnswers({}); setSubmitted(false); }} style={{
                padding: "11px 20px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.panel2, color: C.ink, cursor: "pointer", fontFamily: display, fontSize: 14, fontWeight: 600,
              }}>Retry</button>
              <button className="btn" onClick={onClose} style={{
                padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${color},${C.teal})`, color: "#04121a", cursor: "pointer", fontFamily: display, fontSize: 14, fontWeight: 700,
              }}>Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

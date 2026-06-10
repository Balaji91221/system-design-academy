import React, { useState, useEffect } from "react";
import { C, mono, display } from "../theme.js";
import AnimationFrame from "./AnimationFrame.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Celebration from "./Celebration.jsx";
import ConceptDetails from "./ConceptDetails.jsx";
import QuizView from "./QuizView.jsx";
import { DEPTH } from "../data/depth.js";
import { CURRICULUM } from "../data/curriculum.js";
import { QUIZZES } from "../data/quizzes.js";
import { useProgress } from "../context/ProgressContext.jsx";

// Segmented tab control: diagram vs Python.
function Tabs({ tab, setTab, color }) {
  const items = [{ key: "diagram", label: "◈ Diagram" }, { key: "code", label: "</> Python" }];
  return (
    <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 10, background: C.panel2, border: `1px solid ${C.line}`, marginBottom: 14 }}>
      {items.map((it) => {
        const on = tab === it.key;
        return (
          <button key={it.key} className="btn" onClick={() => setTab(it.key)} style={{
            padding: "6px 16px", borderRadius: 7, border: "none", cursor: "pointer",
            fontFamily: mono, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
            background: on ? `linear-gradient(135deg,${color},${C.teal})` : "transparent",
            color: on ? "#04121a" : C.dim,
          }}>{it.label}</button>
        );
      })}
    </div>
  );
}

// A depth callout shown when the global depth is Simple or Deep.
function DepthCallout({ depth, num, color }) {
  const d = DEPTH[num];
  if (!d) return null;
  if (depth === "simple" && d.simple) {
    return (
      <div className="reveal" style={{ margin: "0 0 20px", padding: "14px 18px", borderRadius: 12, background: `${C.green}10`, border: `1px solid ${C.green}33` }}>
        <div style={{ fontSize: 11, fontFamily: mono, color: C.green, letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>🌱 IN PLAIN WORDS</div>
        <div style={{ fontSize: 15.5, lineHeight: 1.6, color: C.ink }}>{d.simple}</div>
      </div>
    );
  }
  if (depth === "deep" && d.deep) {
    return (
      <div className="reveal" style={{ margin: "0 0 20px", padding: "14px 18px", borderRadius: 12, background: `${C.purple}10`, border: `1px solid ${C.purple}33` }}>
        <div style={{ fontSize: 11, fontFamily: mono, color: C.purple, letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>🚀 DEEP DIVE — internals &amp; failure modes</div>
        <div style={{ fontSize: 15, lineHeight: 1.65, color: C.ink }}>{d.deep}</div>
      </div>
    );
  }
  return null;
}

// The main reading pane. Depth-aware (Simple/Core/Deep), bookmarkable, with a
// tabbed Diagram/Python panel, staggered reveals, confetti on completion, and
// prev/next navigation.
export default function LessonView({ active, total, activeIdx, onNavigate }) {
  const { doneSet, toggleDone, bookmarkSet, toggleBookmark, depth, setLastConcept, recordActivity, isQuizPassed } = useProgress();
  const isDone = doneSet.has(active.num);
  const isBooked = bookmarkSet.has(active.num);
  const atStart = activeIdx === 0;
  const atEnd = activeIdx === total - 1;

  const [scrollPct, setScrollPct] = useState(0);
  const [fireKey, setFireKey] = useState(0);
  const [tab, setTab] = useState("diagram");
  const [quizOpen, setQuizOpen] = useState(false);

  // Show the section checkpoint at the end of each section (last lesson).
  const sectionLessons = CURRICULUM[active.si]?.lessons.length || 1;
  const isSectionEnd = active.li === sectionLessons - 1;
  const hasQuiz = !!QUIZZES[active.si];
  const quizPassed = isQuizPassed(active.si);

  useEffect(() => { setLastConcept(activeIdx); }, [activeIdx, setLastConcept]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
  };
  const handleToggleDone = () => {
    if (!isDone) { setFireKey((k) => k + 1); recordActivity(); }
    toggleDone(active.num);
  };

  return (
    <main id="lesson-scroll" onScroll={onScroll} style={{ flex: 1, overflowY: "auto", padding: "0 0 70px", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: 3, zIndex: 4, background: C.panel2 }}>
        <div style={{ height: "100%", width: `${scrollPct}%`, background: `linear-gradient(90deg,${active.color},${C.teal})`, transition: "width .08s linear", boxShadow: `0 0 10px ${active.color}aa` }} />
      </div>

      <div key={active.num} className="lessonEnter" style={{ maxWidth: 820, margin: "0 auto", padding: "30px 36px" }}>
        {/* badges + bookmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 11px", borderRadius: 99,
            border: `1px solid ${active.color}40`, background: `${active.color}12`, fontSize: 11, fontFamily: mono, color: active.color, fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: active.color }} />
            {active.sec}
          </span>
          <span style={{ fontSize: 11, fontFamily: mono, color: C.faint }}>concept {active.num} of {total}</span>
          <button className="btn" onClick={() => toggleBookmark(active.num)} title="Bookmark" style={{
            marginLeft: "auto", background: "transparent", border: `1px solid ${isBooked ? C.amber : C.line}`,
            borderRadius: 7, color: isBooked ? C.amber : C.dim, padding: "4px 11px", fontSize: 11.5, fontFamily: mono, cursor: "pointer",
          }}>{isBooked ? "★ Bookmarked" : "☆ Bookmark"}</button>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px", letterSpacing: -0.8, lineHeight: 1.12 }}>{active.title}</h1>
        <p style={{ fontSize: 16, color: C.dim, margin: "0 0 22px", lineHeight: 1.55 }}>{active.what}</p>

        <DepthCallout depth={depth} num={active.num} color={active.color} />

        {/* tabbed panel */}
        <Tabs tab={tab} setTab={setTab} color={active.color} />
        {tab === "diagram"
          ? <AnimationFrame animKey={active.anim} />
          : <CodeBlock code={active.code} />}

        {/* key mechanics */}
        <h3 style={{ fontSize: 12, fontFamily: mono, color: active.color, letterSpacing: 1, margin: "30px 0 14px", fontWeight: 500 }}>◆ KEY MECHANICS</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {active.points.map((p, i) => (
            <div key={i} className="reveal" style={{ display: "flex", gap: 13, alignItems: "flex-start", animationDelay: `${120 + i * 90}ms` }}>
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: 7, marginTop: 1,
                background: `${active.color}18`, border: `1px solid ${active.color}40`, color: active.color,
                fontFamily: mono, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{i + 1}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: C.ink, paddingTop: 2 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* structured details: step-by-step, trade-offs, pro tip */}
        <ConceptDetails num={active.num} color={active.color} />

        {/* use case */}
        <div className="reveal" style={{
          marginTop: 26, padding: "18px 20px", borderRadius: 12,
          background: `linear-gradient(135deg,${active.color}10,transparent)`, border: `1px solid ${active.color}30`,
          animationDelay: `${160 + active.points.length * 90}ms`,
        }}>
          <div style={{ fontSize: 11, fontFamily: mono, color: active.color, letterSpacing: 1, marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 13 }}>🌐</span> REAL-WORLD USE CASE
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.62, color: C.ink }}>{active.use}</div>
        </div>

        {/* mark complete */}
        <div style={{ position: "relative", marginTop: 22 }}>
          <Celebration fire={fireKey} />
          <button className="btn" onClick={handleToggleDone} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${isDone ? C.green : C.line}`,
            background: isDone ? `${C.green}15` : C.panel, color: isDone ? C.green : C.dim, cursor: "pointer",
            fontFamily: display, fontSize: 14, fontWeight: 500,
          }}>{isDone ? "✓ Completed — click to undo" : "○ Mark this concept complete"}</button>
        </div>

        {/* nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, gap: 12 }}>
          <button className="btn" onClick={() => onNavigate(-1)} disabled={atStart} style={{
            padding: "11px 20px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.panel,
            color: atStart ? C.faint : C.ink, cursor: atStart ? "default" : "pointer", fontFamily: display, fontSize: 14, fontWeight: 500, opacity: atStart ? 0.4 : 1,
          }}>← Previous</button>
          <button className="btn" onClick={() => onNavigate(1)} disabled={atEnd} style={{
            padding: "11px 24px", borderRadius: 10, border: "none",
            background: atEnd ? C.panel : `linear-gradient(135deg,${C.teal},${C.blue})`,
            color: atEnd ? C.faint : "#04121a", cursor: atEnd ? "default" : "pointer", fontFamily: display, fontSize: 14, fontWeight: 700, opacity: atEnd ? 0.4 : 1,
          }}>{atEnd ? "Course complete ✓" : "Next concept →"}</button>
        </div>

        {/* section checkpoint quiz (end of each section) */}
        {isSectionEnd && hasQuiz && (
          <div className="reveal" style={{
            marginTop: 24, padding: "18px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
            background: `linear-gradient(135deg,${active.color}12,transparent)`, border: `1px solid ${quizPassed ? C.green + "55" : active.color + "40"}`,
          }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: mono, color: quizPassed ? C.green : active.color, letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>
                {quizPassed ? "✓ CHECKPOINT PASSED" : "🏁 SECTION CHECKPOINT"}
              </div>
              <div style={{ fontSize: 14.5, color: C.ink }}>
                {quizPassed ? "You've passed this section's quiz. Revisit it anytime." : "Test yourself on this section — 5 questions, 80% to pass."}
              </div>
            </div>
            <button className="btn" onClick={() => setQuizOpen(true)} style={{
              padding: "11px 22px", borderRadius: 10, border: "none", cursor: "pointer", flexShrink: 0,
              background: `linear-gradient(135deg,${active.color},${C.teal})`, color: "#04121a", fontFamily: display, fontSize: 14, fontWeight: 700,
            }}>{quizPassed ? "Retake quiz" : "Take the quiz"}</button>
          </div>
        )}
      </div>

      {quizOpen && <QuizView sectionIndex={active.si} color={active.color} onClose={() => setQuizOpen(false)} />}
    </main>
  );
}

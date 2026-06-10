import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { INTERVIEW_QUESTIONS, DIFFICULTIES, COMPANY_META } from "../data/interviewQuestions.js";
import { FLASHCARD_TOPICS } from "../data/flashcards.js";
import Flashcards from "../components/Flashcards.jsx";
import AnimationFrame from "../components/AnimationFrame.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AddQuestionForm from "../components/AddQuestionForm.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

const DIFF_COLOR = { easy: C.green, medium: C.amber, hard: C.red };

// Build the sorted company list (with icon/color/count) from a question set.
function companiesFrom(questions) {
  const count = {};
  questions.forEach((q) => (q.companies || []).forEach((c) => { count[c] = (count[c] || 0) + 1; }));
  return Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b))
    .map((name) => ({ name, count: count[name], ...(COMPANY_META[name] || { icon: "🏢", color: "#90a0b8" }) }));
}

// An expandable question card with a detailed answer, key points, the related
// live animation, a concept link, and (for user-added cards) a delete button.
function QuestionCard({ q, highlightCompany, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="animCard" style={{ border: `1px solid ${open ? C.teal + "55" : C.line}`, borderRadius: 12, background: C.panel, overflow: "hidden" }}>
      <button className="btn" onClick={() => setOpen((o) => !o)} style={{
        width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
        padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start", color: C.ink,
      }}>
        <span style={{ flex: 1 }}>
          <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.45 }}>
            {q.custom && <span style={{ fontSize: 10, fontFamily: mono, color: C.purple, border: `1px solid ${C.purple}55`, borderRadius: 99, padding: "1px 7px", marginRight: 8 }}>yours</span>}
            {q.q}
          </span>
          <span style={{ display: "flex", gap: 8, marginTop: 9, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontFamily: mono, color: DIFF_COLOR[q.difficulty] || C.dim, border: `1px solid ${(DIFF_COLOR[q.difficulty] || C.line)}55`, borderRadius: 99, padding: "2px 8px" }}>{q.difficulty}</span>
            <span style={{ fontSize: 10, fontFamily: mono, color: C.dim, border: `1px solid ${C.line}`, borderRadius: 99, padding: "2px 8px" }}>{q.topic}</span>
            {(q.companies || []).map((c) => {
              const on = c === highlightCompany;
              const m = COMPANY_META[c] || {};
              return (
                <span key={c} style={{
                  fontSize: 10, fontFamily: mono, padding: "2px 8px", borderRadius: 99,
                  color: on ? "#04121a" : C.faint, background: on ? (m.color || C.teal) : "transparent",
                  border: `1px solid ${on ? (m.color || C.teal) : "transparent"}`, fontWeight: on ? 700 : 400,
                }}>{m.icon ? `${m.icon} ` : ""}{c}</span>
              );
            })}
          </span>
        </span>
        <span style={{ fontFamily: mono, fontSize: 13, color: C.teal, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", marginTop: 2 }}>▶</span>
      </button>

      {open && (
        <div className="reveal" style={{ padding: "16px 18px", borderTop: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 14.5, lineHeight: 1.65, color: C.ink }}>{q.a}</div>

          {q.points?.length > 0 && (
            <div>
              <div style={{ fontSize: 10.5, fontFamily: mono, color: C.teal, letterSpacing: 1, fontWeight: 600, marginBottom: 9 }}>◆ KEY POINTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {q.points.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ color: C.teal, flexShrink: 0 }}>›</span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.anim && (
            <div>
              <div style={{ fontSize: 10.5, fontFamily: mono, color: C.amber, letterSpacing: 1, fontWeight: 600, marginBottom: 9 }}>▶ VISUAL</div>
              <AnimationFrame animKey={q.anim} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {q.concept && (
              <Link to={`/learn/${q.concept}`} className="btn" style={{
                textDecoration: "none", padding: "8px 14px", borderRadius: 9,
                border: `1px solid ${C.teal}55`, background: `${C.teal}12`, color: C.teal, fontFamily: mono, fontSize: 12, fontWeight: 600,
              }}>Study the full concept →</Link>
            )}
            {q.custom && onDelete && (
              <button className="btn" onClick={() => onDelete(q.id)} style={{
                padding: "8px 14px", borderRadius: 9, border: `1px solid ${C.red}55`, background: `${C.red}12`,
                color: C.red, fontFamily: mono, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>🗑 Delete</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ active, onClick, children, color }) {
  return (
    <button className="btn" onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 99, cursor: "pointer", fontFamily: mono, fontSize: 11.5, fontWeight: 600,
      border: `1px solid ${active ? (color || C.teal) : C.line}`,
      background: active ? `${color || C.teal}1a` : "transparent", color: active ? (color || C.teal) : C.dim,
    }}>{children}</button>
  );
}

function CompanyBrowser({ questions, companies, onDelete }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const m = COMPANY_META[selected] || { icon: "🏢", color: C.dim };
    const qs = questions.filter((q) => (q.companies || []).includes(selected));
    return (
      <div>
        <button className="btn" onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.teal, fontFamily: mono, fontSize: 12.5, padding: 0, marginBottom: 16 }}>← all companies</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 30 }}>{m.icon}</span>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: m.color || C.ink }}>{selected}</h2>
        </div>
        <p style={{ fontSize: 13, color: C.dim, fontFamily: mono, margin: "0 0 18px" }}>{qs.length} previously-asked question{qs.length > 1 ? "s" : ""}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {qs.map((q) => <QuestionCard key={q.id} q={q} highlightCompany={selected} onDelete={onDelete} />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <p style={{ fontSize: 13.5, color: C.dim, margin: "0 0 18px", lineHeight: 1.5 }}>
        Pick a company to see the system-design questions candidates report being asked there.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14 }}>
        {companies.map((c, i) => (
          <button key={c.name} className="animCard reveal" onClick={() => setSelected(c.name)} style={{
            cursor: "pointer", textAlign: "left", padding: "18px", borderRadius: 14, animationDelay: `${i * 30}ms`,
            background: `linear-gradient(150deg,${c.color}14,${C.panel} 60%)`, border: `1px solid ${c.color}33`, color: C.ink,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c.name}</div>
            <div style={{ fontSize: 11, fontFamily: mono, color: c.color, marginTop: 3 }}>{c.count} question{c.count > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>
    </>
  );
}

// Interview Prep: browse by company, work the full bank (incl. your own added
// questions), or drill spaced-repetition flashcards.
export default function InterviewPage() {
  const { customQuestions, removeQuestion } = useProgress();
  const [mode, setMode] = useState("company");
  const [topic, setTopic] = useState("All");
  const [diff, setDiff] = useState("All");
  const [query, setQuery] = useState("");
  const [cardTopic, setCardTopic] = useState("All");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [adding, setAdding] = useState(false);

  // Merge built-in + user-added questions, then derive companies/topics.
  const ALL = useMemo(() => [...customQuestions, ...INTERVIEW_QUESTIONS], [customQuestions]);
  const companies = useMemo(() => companiesFrom(ALL), [ALL]);
  const topics = useMemo(() => [...new Set(ALL.map((q) => q.topic))].sort(), [ALL]);

  const q = query.trim().toLowerCase();
  const filtered = ALL.filter((it) =>
    (topic === "All" || it.topic === topic) &&
    (diff === "All" || it.difficulty === diff) &&
    (!q || (it.q + it.a).toLowerCase().includes(q))
  );

  const MODES = [
    { k: "company", l: "🏢 By Company" },
    { k: "bank", l: "📋 Question Bank" },
    { k: "cards", l: "🃏 Flashcards" },
  ];

  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 26px 90px" }}>
      <PageHeader
        eyebrow="🎯 Interview Prep"
        title="Practice the questions they actually ask"
        sub="Browse real, previously-asked questions by company, expand each for a detailed answer with key points and a live visual — and add your own to build a personal bank."
        color={C.amber}
        action={(
          <button className="btn" onClick={() => { setAdding((a) => !a); setMode("bank"); }} style={{
            padding: "11px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#04121a", fontFamily: display, fontSize: 13.5, fontWeight: 700,
          }}>➕ Add question</button>
        )}
      />

      {adding && <AddQuestionForm onClose={() => setAdding(false)} />}

      <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 10, background: C.panel2, border: `1px solid ${C.line}`, marginBottom: 24, flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button key={m.k} className="btn" onClick={() => setMode(m.k)} style={{
            padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: mono, fontSize: 12.5, fontWeight: 600,
            background: mode === m.k ? `linear-gradient(135deg,${C.amber},${C.teal})` : "transparent",
            color: mode === m.k ? "#04121a" : C.dim,
          }}>{m.l}</button>
        ))}
      </div>

      {mode === "company" && <CompanyBrowser questions={ALL} companies={companies} onDelete={removeQuestion} />}

      {mode === "bank" && (
        <>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 Search questions…"
            style={{ width: "100%", marginBottom: 14, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 9, color: C.ink, padding: "10px 13px", fontSize: 13.5, fontFamily: display, outline: "none" }} />
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
            <Pill active={topic === "All"} onClick={() => setTopic("All")}>All topics</Pill>
            {topics.map((t) => <Pill key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</Pill>)}
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
            <Pill active={diff === "All"} onClick={() => setDiff("All")}>Any level</Pill>
            {DIFFICULTIES.map((d) => <Pill key={d} active={diff === d} onClick={() => setDiff(d)} color={DIFF_COLOR[d]}>{d}</Pill>)}
          </div>
          <div style={{ fontSize: 11.5, fontFamily: mono, color: C.faint, marginBottom: 12 }}>{filtered.length} questions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((it) => <QuestionCard key={it.id} q={it} onDelete={removeQuestion} />)}
          </div>
        </>
      )}

      {mode === "cards" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Pill active={cardTopic === "All"} onClick={() => setCardTopic("All")}>All topics</Pill>
              {FLASHCARD_TOPICS.map((t) => <Pill key={t} active={cardTopic === t} onClick={() => setCardTopic(t)}>{t}</Pill>)}
            </div>
            <Pill active={reviewOnly} onClick={() => setReviewOnly((r) => !r)} color={C.amber}>
              {reviewOnly ? "● Review due only" : "○ Review due only"}
            </Pill>
          </div>
          <Flashcards topic={cardTopic} reviewOnly={reviewOnly} />
        </>
      )}
    </div>
  );
}

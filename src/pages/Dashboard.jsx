import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { flattenCurriculum } from "../data/curriculum.js";
import { PATHS, pathProgress } from "../data/paths.js";
import { INTERVIEW_QUESTIONS } from "../data/interviewQuestions.js";
import { DRILLS } from "../data/designDrills.js";
import { FLASHCARDS } from "../data/flashcards.js";
import { QUIZZES } from "../data/quizzes.js";
import { useProgress } from "../context/ProgressContext.jsx";
import { countDue } from "../lib/srs.js";
import { computeStreaks } from "../lib/streaks.js";
import Heatmap from "../components/Heatmap.jsx";

function Stat({ label, value, color, icon }) {
  return (
    <div style={{
      flex: 1, minWidth: 130, padding: "16px 18px", borderRadius: 14, position: "relative", overflow: "hidden",
      background: C.panel, border: `1px solid ${C.line}`,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(${color},${C.teal})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: -0.5 }}>{value}</span>
      </div>
      <div style={{ fontSize: 11.5, color: C.dim, fontFamily: mono, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Card({ to, icon, title, sub, color, delay }) {
  return (
    <Link to={to} className="animCard reveal" style={{
      display: "block", textDecoration: "none", padding: "20px", borderRadius: 14, animationDelay: `${delay}ms`,
      background: `linear-gradient(150deg,${color}14,${C.panel} 60%)`, border: `1px solid ${color}33`,
    }}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 13, color: C.dim, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>
    </Link>
  );
}

// The landing page: a premium hero, headline stats, "continue learning", the
// curated learning paths, and quick entry points into each pillar.
export default function Dashboard() {
  const nav = useNavigate();
  const { doneSet, lastConcept, srs, activity, quizzesPassed } = useProgress();
  const flat = flattenCurriculum();
  const total = flat.length;
  const pct = Math.round((doneSet.size / total) * 100);
  const resume = flat[Math.min(lastConcept, total - 1)];

  const due = countDue(srs, FLASHCARDS);
  const { current, longest } = computeStreaks(activity);
  const totalQuizzes = Object.keys(QUIZZES).length;

  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 26px 90px" }}>
      {/* hero */}
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ color: C.teal, marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 99, border: `1px solid ${C.teal}33`, background: `${C.teal}10` }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: C.teal }} /> Zero → Mastery · Interview-Ready
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1.05, margin: "0 0 16px" }}>
          Master System Design,<br />
          <span className="gradText">from first principles to FAANG interviews.</span>
        </h1>
        <p style={{ fontSize: 17, color: C.dim, lineHeight: 1.6, maxWidth: 660, margin: "0 0 26px" }}>
          {total} animated concepts, runnable Python, a depth you choose (beginner → senior), an interview
          question bank, spaced-repetition flashcards, and a system-design studio — all in one place, self-paced.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => nav(`/learn/${resume.num}`)} style={{
            padding: "13px 24px", borderRadius: 11, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#04121a",
            fontFamily: display, fontSize: 15, fontWeight: 700, boxShadow: `0 14px 34px -14px ${C.teal}`,
          }}>{doneSet.size ? `Resume → ${resume.title}` : "Start learning →"}</button>
          <button className="btn" onClick={() => nav("/interview")} style={{
            padding: "13px 24px", borderRadius: 11, border: `1px solid ${C.line}`, cursor: "pointer",
            background: C.panel, color: C.ink, fontFamily: display, fontSize: 15, fontWeight: 600,
          }}>Prep for interviews</button>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Stat icon="✅" label="concepts mastered" value={`${doneSet.size}/${total}`} color={C.teal} />
        <Stat icon="🔥" label="day streak" value={current} color={C.amber} />
        <Stat icon="🃏" label="cards due today" value={due} color={C.purple} />
        <Stat icon="🏁" label="quizzes passed" value={`${quizzesPassed.length}/${totalQuizzes}`} color={C.blue} />
      </div>

      {/* activity */}
      <div className="reveal" style={{ marginBottom: 40, padding: "20px", borderRadius: 16, background: C.panel, border: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>📅 Your activity</div>
          <div style={{ display: "flex", gap: 18, fontFamily: mono, fontSize: 12 }}>
            <span style={{ color: C.amber }}>🔥 {current} day streak</span>
            <span style={{ color: C.dim }}>best: {longest}</span>
            <span style={{ color: C.purple }}>{due} due</span>
          </div>
        </div>
        <Heatmap activity={activity} weeks={12} />
        <div style={{ fontSize: 11.5, color: C.faint, fontFamily: mono, marginTop: 10 }}>
          Complete a lesson, review a card, or take a quiz to keep your streak alive. Press <span style={{ color: C.teal }}>⌘K</span> to search anything.
        </div>
      </div>

      {/* learning paths */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.4 }}>Learning paths</h2>
        <p style={{ fontSize: 13.5, color: C.dim, margin: 0 }}>Pick the track that matches where you are — each is an ordered, curated sequence.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginBottom: 42, marginTop: 18 }}>
        {PATHS.map((p, i) => {
          const pr = pathProgress(p, doneSet);
          return (
            <Link key={p.id} to={`/learn/${p.concepts[0]}`} className="animCard reveal" style={{
              display: "block", textDecoration: "none", padding: "20px", borderRadius: 16, animationDelay: `${i * 70}ms`,
              background: `linear-gradient(155deg,${p.color}12,${C.panel} 55%)`, border: `1px solid ${p.color}2e`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{
                  fontSize: 24, width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${p.color}1a`, border: `1px solid ${p.color}40`,
                }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 16.5, fontWeight: 700, color: C.ink }}>{p.title}</div>
                  <div style={{ fontSize: 10.5, fontFamily: mono, color: p.color, marginTop: 2 }}>{p.tier} · ~{p.weeks} wks · {p.concepts.length} concepts</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.55, margin: "0 0 16px" }}>{p.blurb}</p>
              <div style={{ height: 7, background: C.panel2, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pr.pct}%`, background: `linear-gradient(90deg,${p.color},${C.teal})`, transition: "width .5s", boxShadow: `0 0 10px ${p.color}88` }} />
              </div>
              <div style={{ fontSize: 11, fontFamily: mono, color: C.faint, marginTop: 7 }}>{pr.done}/{pr.total} done · {pr.pct}%</div>
            </Link>
          );
        })}
      </div>

      {/* pillars */}
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px", letterSpacing: -0.4 }}>Explore</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
        <Card to="/learn" icon="📚" title="Concept Library" sub={`${total} animated concepts with code, leveled simple → deep.`} color={C.teal} delay={0} />
        <Card to="/interview" icon="🎯" title="Interview Prep" sub="Question bank + spaced-repetition flashcards." color={C.amber} delay={70} />
        <Card to="/design" icon="🧩" title="Design Studio" sub="Guided 'Design X' drills with a checklist & timer." color={C.purple} delay={140} />
        <Card to="/cheatsheets" icon="📝" title="Cheat Sheets" sub="One-page summaries to review before an interview." color={C.blue} delay={210} />
      </div>
    </div>
  );
}

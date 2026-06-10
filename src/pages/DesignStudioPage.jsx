import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { DRILLS, SOLUTIONS, APPROACHES } from "../data/designDrills.js";
import PageHeader from "../components/PageHeader.jsx";
import ArchDiagram from "../components/ArchDiagram.jsx";

const DIFF_COLOR = { easy: C.green, medium: C.amber, hard: C.red };

// A running stopwatch — interviews are timed, so practice against the clock.
function Timer() {
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running) ref.current = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(ref.current);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: secs > 2400 ? C.red : C.teal, minWidth: 64 }}>{mm}:{ss}</span>
      <button className="btn" onClick={() => setRunning((r) => !r)} style={btn(running ? C.amber : C.green)}>{running ? "❚❚ pause" : "▶ start"}</button>
      <button className="btn" onClick={() => { setRunning(false); setSecs(0); }} style={btn(C.line, C.dim)}>↺ reset</button>
    </div>
  );
}
const btn = (border, color) => ({ background: "transparent", border: `1px solid ${border}`, borderRadius: 7, color: color || border, padding: "5px 11px", fontSize: 11.5, fontFamily: mono, cursor: "pointer" });

function Section({ title, items, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, overflow: "hidden" }}>
      <button className="btn" onClick={() => setOpen((o) => !o)} style={{
        width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
        padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", color: C.ink,
      }}>
        <span style={{ fontSize: 13, fontFamily: mono, fontWeight: 600, color, letterSpacing: 0.5 }}>{title}</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.faint }}>{open ? "hide" : "reveal"}</span>
      </button>
      {open && (
        <ul className="reveal" style={{ margin: 0, padding: "0 22px 16px 38px", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => <li key={i} style={{ fontSize: 14, lineHeight: 1.55, color: C.ink }}>{it}</li>)}
        </ul>
      )}
    </div>
  );
}

function DrillList() {
  const [filter, setFilter] = useState("all");
  const order = { easy: 0, medium: 1, hard: 2 };
  const drills = [...DRILLS]
    .filter((d) => filter === "all" || d.difficulty === filter)
    .sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  const counts = DRILLS.reduce((m, d) => ((m[d.difficulty] = (m[d.difficulty] || 0) + 1), m), {});
  const LEVELS = [
    { k: "all", label: `All (${DRILLS.length})`, c: C.teal },
    { k: "easy", label: `Easy (${counts.easy || 0})`, c: C.green },
    { k: "medium", label: `Medium (${counts.medium || 0})`, c: C.amber },
    { k: "hard", label: `Hard (${counts.hard || 0})`, c: C.red },
  ];

  return (
    <div className="page" style={{ maxWidth: 980, margin: "0 auto", padding: "40px 26px 90px" }}>
      <PageHeader
        eyebrow="🧩 System Design Studio"
        title="Drill the classic 'Design X' problems"
        sub="Pick a problem, start the timer, work it against the rubric, learn how to approach it, then reveal the reference solution."
        color={C.purple}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {LEVELS.map((lv) => {
          const on = filter === lv.k;
          return (
            <button key={lv.k} className="btn" onClick={() => setFilter(lv.k)} style={{
              padding: "6px 14px", borderRadius: 99, cursor: "pointer", fontFamily: mono, fontSize: 12, fontWeight: 600,
              border: `1px solid ${on ? lv.c : C.line}`, background: on ? `${lv.c}1a` : "transparent", color: on ? lv.c : C.dim,
            }}>{lv.label}</button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {drills.map((d, i) => (
          <Link key={d.id} to={`/design/${d.id}`} className="animCard reveal" style={{
            display: "block", textDecoration: "none", padding: "20px", borderRadius: 16, animationDelay: `${i * 70}ms`,
            background: `linear-gradient(150deg,${d.color}14,${C.panel} 60%)`, border: `1px solid ${d.color}33`,
          }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{d.icon}</div>
            <div style={{ fontSize: 16.5, fontWeight: 700, color: C.ink }}>{d.title}</div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>{d.prompt}</div>
            <div style={{ marginTop: 12, fontSize: 10, fontFamily: mono, color: DIFF_COLOR[d.difficulty], border: `1px solid ${DIFF_COLOR[d.difficulty]}55`, borderRadius: 99, padding: "2px 9px", display: "inline-block" }}>{d.difficulty}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Drill({ drill }) {
  const [checked, setChecked] = useState(() => new Set());
  const toggle = (i) => setChecked((p) => { const s = new Set(p); s.has(i) ? s.delete(i) : s.add(i); return s; });
  const w = drill.walk;
  const sol = SOLUTIONS[drill.id];
  const approach = APPROACHES[drill.id];

  return (
    <div className="page" style={{ maxWidth: 860, margin: "0 auto", padding: "30px 26px 90px" }}>
      <Link to="/design" style={{ fontSize: 12.5, fontFamily: mono, color: C.teal, textDecoration: "none" }}>← all drills</Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.7, margin: "12px 0 6px" }}>{drill.icon} {drill.title}</h1>
      <p style={{ fontSize: 15.5, color: C.dim, lineHeight: 1.55, margin: "0 0 18px" }}>{drill.prompt}</p>

      {/* timer */}
      <div style={{ padding: "14px 18px", borderRadius: 12, background: C.panel, border: `1px solid ${C.line}`, marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, fontFamily: mono, color: C.dim }}>⏱ Aim for ~40 min, like a real round</span>
        <Timer />
      </div>

      {/* how to approach — plain-English method, always visible */}
      {approach && (
        <>
          <h3 style={{ fontSize: 12, fontFamily: mono, color: drill.color, letterSpacing: 1, margin: "0 0 14px", fontWeight: 600 }}>
            🧭 HOW TO APPROACH THIS — step by step
          </h3>
          <div style={{ position: "relative", marginBottom: 30 }}>
            {approach.map((s, i) => {
              const last = i === approach.length - 1;
              return (
                <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${drill.color}1a`, border: `1.5px solid ${drill.color}`, color: drill.color, fontFamily: mono, fontSize: 13, fontWeight: 700, zIndex: 1,
                    }}>{i + 1}</span>
                    {!last && <span style={{ width: 2, flex: 1, minHeight: 14, background: `linear-gradient(${drill.color}66, ${C.line})` }} />}
                  </div>
                  <div style={{ paddingBottom: last ? 0 : 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{s.step}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: C.dim }}>{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* rubric checklist */}
      <h3 style={{ fontSize: 12, fontFamily: mono, color: drill.color, letterSpacing: 1, margin: "0 0 12px", fontWeight: 600 }}>
        ✓ RUBRIC — tick each as you cover it ({checked.size}/{drill.checklist.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {drill.checklist.map((it, i) => {
          const on = checked.has(i);
          return (
            <button key={i} className="btn" onClick={() => toggle(i)} style={{
              display: "flex", gap: 11, alignItems: "flex-start", textAlign: "left", cursor: "pointer",
              background: on ? `${C.green}10` : C.panel, border: `1px solid ${on ? C.green + "55" : C.line}`,
              borderRadius: 10, padding: "11px 14px", color: C.ink,
            }}>
              <span style={{
                flexShrink: 0, width: 18, height: 18, borderRadius: 5, marginTop: 1, fontSize: 11,
                border: `1.5px solid ${on ? C.green : C.line}`, background: on ? C.green : "transparent",
                color: "#04121a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>{on ? "✓" : ""}</span>
              <span style={{ fontSize: 14, lineHeight: 1.5, textDecoration: on ? "line-through" : "none", opacity: on ? 0.7 : 1 }}>{it}</span>
            </button>
          );
        })}
      </div>

      {/* model walkthrough */}
      <h3 style={{ fontSize: 12, fontFamily: mono, color: C.dim, letterSpacing: 1, margin: "0 0 12px", fontWeight: 600 }}>
        📖 MODEL WALKTHROUGH — try first, then reveal
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Section title="1 · REQUIREMENTS & SCOPE" items={w.requirements} color={C.blue} />
        <Section title="2 · ESTIMATION" items={w.estimation} color={C.teal} />
        <Section title="3 · HIGH-LEVEL DESIGN" items={w.hld} color={C.amber} />
        <Section title="4 · DEEP DIVE" items={w.deepDive} color={C.purple} />
        <Section title="5 · TRADE-OFFS" items={w.tradeoffs} color={C.pink} />
      </div>

      {/* reference solution — the concrete architecture */}
      {sol && (
        <>
          <h3 style={{ fontSize: 12, fontFamily: mono, color: drill.color, letterSpacing: 1, margin: "30px 0 12px", fontWeight: 600 }}>
            ✅ REFERENCE SOLUTION
          </h3>
          <div style={{ border: `1px solid ${drill.color}40`, borderRadius: 14, overflow: "hidden", background: C.panel, boxShadow: "0 24px 60px -28px rgba(0,0,0,.7)" }}>
            <ArchDiagram nodes={sol.nodes} edges={sol.edges} />
            <div style={{ padding: "16px 18px", borderTop: `1px solid ${C.line}` }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink, margin: "0 0 14px" }}>{sol.summary}</p>
              <div style={{ fontSize: 10.5, fontFamily: mono, color: drill.color, letterSpacing: 1, fontWeight: 600, marginBottom: 9 }}>KEY DECISIONS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
                {sol.decisions.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.45, color: C.ink }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// System Design Studio: either the list of drills, or one drill in practice mode.
export default function DesignStudioPage() {
  const { id } = useParams();
  const nav = useNavigate();
  if (!id) return <DrillList />;
  const drill = DRILLS.find((d) => d.id === id);
  if (!drill) { nav("/design"); return null; }
  return <Drill drill={drill} />;
}

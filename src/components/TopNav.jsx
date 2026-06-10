import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { flattenCurriculum } from "../data/curriculum.js";
import { QUIZZES } from "../data/quizzes.js";
import { useProgress } from "../context/ProgressContext.jsx";
import DepthToggle from "./DepthToggle.jsx";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/learn", label: "Concepts" },
  { to: "/interview", label: "Interview" },
  { to: "/design", label: "Design Studio" },
  { to: "/cheatsheets", label: "Cheat Sheets" },
];

// The persistent top bar: brand, primary navigation, depth toggle, and a live
// overall-progress meter. The depth toggle only shows where it's relevant.
export default function TopNav() {
  const { doneSet, quizzesPassed } = useProgress();
  const loc = useLocation();
  const total = flattenCurriculum().length;
  const pct = Math.round((doneSet.size / total) * 100);
  const totalQuizzes = Object.keys(QUIZZES).length;
  const showDepth = loc.pathname.startsWith("/learn");

  return (
    <header style={{
      borderBottom: `1px solid ${C.line}`, padding: "12px 22px", display: "flex",
      alignItems: "center", gap: 18, flexWrap: "wrap",
      background: `${C.panel}cc`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      position: "sticky", top: 0, zIndex: 20, boxShadow: `0 1px 0 ${C.line}, 0 8px 24px -16px rgba(0,0,0,.6)`,
    }}>
      <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", color: C.ink }}>
        <div className="logoGlow" style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `linear-gradient(135deg,${C.teal},${C.blue})`, display: "flex",
          alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 700, color: "#04121a", fontSize: 17,
        }}>⌬</div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
          System Design <span style={{ color: C.teal }}>Academy</span>
        </div>
      </NavLink>

      <nav className="topnav" style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} style={({ isActive }) => ({
            padding: "7px 13px", borderRadius: 8, textDecoration: "none",
            fontFamily: display, fontSize: 13.5, fontWeight: 600,
            color: isActive ? C.ink : C.dim,
            background: isActive ? C.panel : "transparent",
            border: `1px solid ${isActive ? C.line : "transparent"}`,
          })}>{l.label}</NavLink>
        ))}
      </nav>

      {showDepth && <DepthToggle compact />}

      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span title="Section quizzes passed" style={{ fontSize: 11, fontFamily: mono, color: quizzesPassed.length === totalQuizzes ? C.green : C.dim, whiteSpace: "nowrap" }}>
          🏁 {quizzesPassed.length}/{totalQuizzes}
        </span>
        <div style={{ height: 6, width: 100, background: C.panel2, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 3, transition: "width .4s ease",
            background: `linear-gradient(90deg,${C.blue},${C.teal},${C.blue})`,
            backgroundSize: "200% 100%", animation: "shimmer 2.4s linear infinite",
          }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: mono, color: C.dim, whiteSpace: "nowrap" }}>{pct}%</span>
      </div>
    </header>
  );
}

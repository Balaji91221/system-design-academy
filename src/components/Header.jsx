import React from "react";
import { C, mono, display } from "../theme.js";

// Top bar: brand, concept search box, and the overall progress meter.
export default function Header({ query, setQuery, doneCount, total, progress }) {
  return (
    <header style={{
      borderBottom: `1px solid ${C.line}`, padding: "16px 26px", display: "flex",
      alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      background: `linear-gradient(180deg,${C.panel},${C.bg})`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="logoGlow" style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg,${C.teal},${C.blue})`, display: "flex",
          alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 700, color: "#04121a", fontSize: 18,
        }}>⌬</div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>
            System Design <span style={{ color: C.teal }}>Academy</span>
          </div>
          <div style={{ fontSize: 11, color: C.dim, fontFamily: mono, marginTop: 1 }}>
            13 sections · {total} animated concepts · zero → advanced
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search concepts…"
          style={{
            background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 9, color: C.ink,
            padding: "8px 13px", fontSize: 13, fontFamily: display, outline: "none", width: 200,
          }} />
        <div style={{ minWidth: 150 }}>
          <div style={{ fontSize: 11, color: C.dim, fontFamily: mono, marginBottom: 4, textAlign: "right" }}>
            {doneCount}/{total} done · {progress}%
          </div>
          <div style={{ height: 6, width: 170, background: C.panel2, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: 3, transition: "width .4s ease",
              background: `linear-gradient(90deg,${C.blue},${C.teal},${C.blue})`,
              backgroundSize: "200% 100%", animation: "shimmer 2.4s linear infinite",
            }} />
          </div>
        </div>
      </div>
    </header>
  );
}

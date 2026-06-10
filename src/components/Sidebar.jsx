import React from "react";
import { C, mono, display } from "../theme.js";
import { CURRICULUM } from "../data/curriculum.js";

// Left navigation: a search box, collapsible sections, per-lesson completion
// ticks, and live filtering against the search query.
export default function Sidebar({ flat, query, setQuery, activeNum, done, openSecs, secStats, onSelect, onToggleSec }) {
  const q = query.trim().toLowerCase();
  return (
    <nav className="sidebar" style={{
      width: 300, borderRight: `1px solid ${C.line}`, overflowY: "auto",
      padding: "14px 10px", background: C.panel2, flexShrink: 0,
    }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 Search concepts…"
        style={{
          width: "100%", marginBottom: 10, background: C.bg, border: `1px solid ${C.line}`,
          borderRadius: 9, color: C.ink, padding: "9px 12px", fontSize: 13, fontFamily: display, outline: "none",
        }} />
      {CURRICULUM.map((s, si) => {
        const lessons = flat.filter((l) => l.si === si);
        const visible = q ? lessons.filter((l) => (l.title + l.what).toLowerCase().includes(q)) : lessons;
        if (q && visible.length === 0) return null;
        const open = openSecs.has(si) || q;
        const st = secStats[si];
        return (
          <div key={si} style={{ marginBottom: 6 }}>
            <div className="secHdr" onClick={() => onToggleSec(si)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
              borderRadius: 8, cursor: "pointer", userSelect: "none",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: s.color, fontFamily: mono, letterSpacing: 0.3, flex: 1, lineHeight: 1.3 }}>
                {s.sec}
              </span>
              <span style={{ fontSize: 10, color: C.faint, fontFamily: mono }}>{st.completed}/{st.total}</span>
              <span style={{ fontSize: 10, color: C.faint, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
            </div>
            {open && visible.map((l) => {
              const on = l.num === activeNum;
              const isDone = done.has(l.num);
              return (
                <div key={l.num} className="navItem" onClick={() => onSelect(l.num - 1)} style={{
                  display: "flex", alignItems: "center", gap: 9, padding: "7px 10px 7px 14px",
                  borderRadius: 8, cursor: "pointer", marginBottom: 1,
                  background: on ? C.panel : "transparent",
                  borderLeft: on ? `2px solid ${s.color}` : "2px solid transparent",
                }}>
                  <span style={{
                    width: 17, height: 17, borderRadius: 5, flexShrink: 0, fontSize: 10,
                    border: `1.5px solid ${isDone ? C.green : C.line}`, background: isDone ? C.green : "transparent",
                    color: "#04121a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                  }}>{isDone ? "✓" : ""}</span>
                  <span style={{ fontSize: 12.5, color: on ? C.ink : C.dim, fontWeight: on ? 500 : 400, lineHeight: 1.35 }}>
                    {l.title}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

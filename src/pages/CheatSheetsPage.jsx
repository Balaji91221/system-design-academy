import React from "react";
import { Link } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { CURRICULUM, flattenCurriculum } from "../data/curriculum.js";
import { DEPTH } from "../data/depth.js";
import PageHeader from "../components/PageHeader.jsx";

// One-line takeaway per concept — the simple ELI5 if we have one, else the
// lesson's own summary.
function takeaway(lesson) {
  return DEPTH[lesson.num]?.simple || lesson.what;
}

// Cheat Sheets: a dense, scannable, printable summary of every concept —
// perfect for a last-minute review before an interview.
export default function CheatSheetsPage() {
  const flat = flattenCurriculum();
  const byNum = Object.fromEntries(flat.map((l) => [`${l.si}-${l.li}`, l]));

  return (
    <div className="page" style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 26px 90px" }}>
      <PageHeader
        eyebrow="📝 Cheat Sheets"
        title="Every concept, in one line"
        sub="A dense, scannable summary of the whole curriculum — skim it the morning of your interview."
        color={C.blue}
        action={(
          <button className="btn" onClick={() => window.print()} style={{
            padding: "11px 18px", borderRadius: 10, border: `1px solid ${C.line}`, cursor: "pointer",
            background: C.panel, color: C.ink, fontFamily: display, fontSize: 13.5, fontWeight: 600,
          }}>🖨 Print / Save PDF</button>
        )}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {CURRICULUM.map((s, si) => (
          <div key={si} className="animCard reveal" style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.panel, overflow: "hidden", animationDelay: `${si * 40}ms` }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 9, background: `${s.color}10` }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: s.color, fontFamily: mono, letterSpacing: 0.3 }}>{s.sec}</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 11 }}>
              {s.lessons.map((l, li) => {
                const lesson = byNum[`${si}-${li}`];
                return (
                  <Link key={li} to={`/learn/${lesson.num}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{l.title}</div>
                    <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.5 }}>{takeaway(lesson)}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { C, mono } from "../theme.js";
import { DETAILS } from "../data/details.js";

function Heading({ children, color }) {
  return (
    <h3 style={{ fontSize: 12, fontFamily: mono, color, letterSpacing: 1, margin: "32px 0 16px", fontWeight: 600 }}>
      {children}
    </h3>
  );
}

// A vertical numbered timeline — the "how it works, step by step" walkthrough.
function StepTimeline({ steps, color }) {
  return (
    <div style={{ position: "relative", paddingLeft: 6 }}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={i} className="reveal" style={{ display: "flex", gap: 16, position: "relative", animationDelay: `${i * 80}ms` }}>
            {/* node + connector */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center",
                background: `${color}1a`, border: `1.5px solid ${color}`, color, fontFamily: mono, fontSize: 13, fontWeight: 700, zIndex: 1,
              }}>{i + 1}</span>
              {!last && <span style={{ width: 2, flex: 1, minHeight: 18, background: `linear-gradient(${color}66, ${C.line})` }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 16, paddingTop: 4 }}>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: C.ink }}>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Two-column strengths vs costs grid.
function TradeOffs({ pros, cons }) {
  const Col = ({ title, items, color, mark }) => (
    <div style={{ flex: 1, minWidth: 220, padding: "16px 18px", borderRadius: 12, background: `${color}0c`, border: `1px solid ${color}30` }}>
      <div style={{ fontSize: 11, fontFamily: mono, color, letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ color, fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>{mark}</span>
            <span style={{ fontSize: 14, lineHeight: 1.5, color: C.ink }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <Col title="STRENGTHS" items={pros} color={C.green} mark="✓" />
      <Col title="COSTS / WATCH OUT" items={cons} color={C.red} mark="✗" />
    </div>
  );
}

// Renders the structured details (steps, trade-offs, tip) for a concept, if any.
export default function ConceptDetails({ num, color }) {
  const d = DETAILS[num];
  if (!d) return null;
  return (
    <>
      {d.steps?.length > 0 && (
        <>
          <Heading color={color}>⚙ HOW IT WORKS — STEP BY STEP</Heading>
          <StepTimeline steps={d.steps} color={color} />
        </>
      )}

      {(d.pros?.length > 0 || d.cons?.length > 0) && (
        <>
          <Heading color={color}>⚖ TRADE-OFFS</Heading>
          <TradeOffs pros={d.pros || []} cons={d.cons || []} />
        </>
      )}

      {d.tip && (
        <div className="reveal" style={{
          marginTop: 24, padding: "16px 18px", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start",
          background: `${C.amber}10`, border: `1px solid ${C.amber}33`,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 11, fontFamily: mono, color: C.amber, letterSpacing: 1, fontWeight: 600, marginBottom: 5 }}>PRO / INTERVIEW TIP</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, color: C.ink }}>{d.tip}</div>
          </div>
        </div>
      )}
    </>
  );
}

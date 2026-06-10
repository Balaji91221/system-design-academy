import React from "react";
import { C } from "../theme.js";

// A consistent page header: eyebrow + gradient title + subtitle, with an
// optional right-aligned action slot. Keeps every page visually cohesive.
export default function PageHeader({ eyebrow, title, sub, color = C.teal, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
      <div>
        <div className="eyebrow" style={{ color, marginBottom: 10 }}>{eyebrow}</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.9, margin: "0 0 8px", lineHeight: 1.1 }}>{title}</h1>
        {sub && <p style={{ fontSize: 15.5, color: C.dim, margin: 0, lineHeight: 1.55, maxWidth: 640 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

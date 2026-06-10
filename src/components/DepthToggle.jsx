import React from "react";
import { C, mono } from "../theme.js";
import { useProgress } from "../context/ProgressContext.jsx";

const LEVELS = [
  { key: "simple", label: "🌱 Simple", hint: "Plain-language, ELI5" },
  { key: "core", label: "🔧 Core", hint: "The standard explanation" },
  { key: "deep", label: "🚀 Deep", hint: "Internals & failure modes" },
];

// A segmented control that sets the global content depth, letting one page
// serve a total beginner and a senior engineer from the same lesson.
export default function DepthToggle({ compact }) {
  const { depth, setDepth } = useProgress();
  return (
    <div title="Choose how deep each concept goes" style={{
      display: "inline-flex", gap: 3, padding: 3, borderRadius: 9,
      background: C.panel2, border: `1px solid ${C.line}`,
    }}>
      {LEVELS.map((lv) => {
        const on = depth === lv.key;
        return (
          <button key={lv.key} className="btn" onClick={() => setDepth(lv.key)} title={lv.hint} style={{
            padding: compact ? "4px 9px" : "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: mono, fontSize: compact ? 10.5 : 11.5, fontWeight: 600,
            background: on ? `linear-gradient(135deg,${C.teal},${C.blue})` : "transparent",
            color: on ? "#04121a" : C.dim,
          }}>{lv.label}</button>
        );
      })}
    </div>
  );
}

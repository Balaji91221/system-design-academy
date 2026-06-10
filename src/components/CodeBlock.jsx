import React, { useMemo, useState } from "react";
import { C, mono } from "../theme.js";
import { tokenizePython } from "../lib/highlight.js";

const KIND_STYLE = {
  comment: { color: C.faint, fontStyle: "italic" },
  string: { color: C.green },
  keyword: { color: C.purple, fontWeight: 600 },
  const: { color: C.amber },
  builtin: { color: C.blue },
  number: { color: C.amber },
  decorator: { color: C.pink },
  punct: { color: C.dim },
  plain: { color: C.ink },
  ws: { color: C.ink },
};

// A professional, syntax-highlighted Python panel: window chrome, language
// label, line-number gutter, horizontal scroll, and copy-to-clipboard.
export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenizePython(code || ""), [code]);
  const lineCount = (code || "").split("\n").length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", background: C.panel2, boxShadow: "0 24px 60px -28px rgba(0,0,0,.7)" }}>
      {/* chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderBottom: `1px solid ${C.line}`, background: C.panel }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.red }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.yellow }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.green }} />
        <span style={{ marginLeft: 8, fontSize: 11, fontFamily: mono, color: C.faint, flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ color: C.blue }}>{"</>"}</span> example.py
        </span>
        <button className="btn" onClick={copy} style={{
          background: copied ? `${C.green}1a` : "transparent",
          border: `1px solid ${copied ? C.green : C.line}`, borderRadius: 6,
          color: copied ? C.green : C.dim, padding: "3px 10px", fontSize: 11,
          fontFamily: mono, cursor: "pointer",
        }}>{copied ? "✓ copied" : "⧉ copy"}</button>
      </div>

      {/* code body */}
      <div style={{ display: "flex", overflowX: "auto", fontFamily: mono, fontSize: 13, lineHeight: "21px" }}>
        {/* gutter */}
        <div aria-hidden style={{
          flexShrink: 0, padding: "16px 0", textAlign: "right", userSelect: "none",
          color: C.faint, background: C.panel2, borderRight: `1px solid ${C.line}`, opacity: 0.6,
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ padding: "0 12px" }}>{i + 1}</div>
          ))}
        </div>
        {/* tokens */}
        <pre style={{ margin: 0, padding: "16px 18px", whiteSpace: "pre", flex: 1 }}>
          <code>
            {tokens.map((tok, i) => (
              <span key={i} style={KIND_STYLE[tok.k] || KIND_STYLE.plain}>{tok.t}</span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { C, mono, display } from "../theme.js";
import { ANIM } from "../animations/index.js";
import { DIFFICULTIES } from "../data/interviewQuestions.js";
import { useProgress } from "../context/ProgressContext.jsx";

const ANIM_KEYS = ["", ...Object.keys(ANIM)];

const fieldStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 9,
  color: C.ink, padding: "9px 12px", fontSize: 13.5, fontFamily: display, outline: "none",
};
const labelStyle = { fontSize: 11, fontFamily: mono, color: C.dim, letterSpacing: 0.5, marginBottom: 5, display: "block" };

// An inline form to add your own company-tagged interview question. Saved to
// localStorage via context, so it persists and merges into the bank + company view.
export default function AddQuestionForm({ onClose }) {
  const { addQuestion } = useProgress();
  const [f, setF] = useState({
    q: "", a: "", topic: "", difficulty: "medium", companies: "", points: "", concept: "", anim: "",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!f.q.trim() || !f.a.trim()) return;
    addQuestion({
      q: f.q.trim(),
      a: f.a.trim(),
      topic: f.topic.trim() || "Custom",
      difficulty: f.difficulty,
      companies: f.companies.split(",").map((s) => s.trim()).filter(Boolean),
      points: f.points.split("\n").map((s) => s.trim()).filter(Boolean),
      concept: f.concept ? Number(f.concept) : null,
      anim: f.anim || null,
    });
    onClose();
  };

  return (
    <div className="reveal" style={{
      border: `1px solid ${C.teal}55`, borderRadius: 14, background: C.panel, padding: "20px", marginBottom: 22,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>➕ Add a question</div>
        <button className="btn" onClick={onClose} style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontFamily: mono, fontSize: 16 }}>✕</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Question *</label>
          <input value={f.q} onChange={set("q")} placeholder="e.g. How would you design a notification system?" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Detailed answer *</label>
          <textarea value={f.a} onChange={set("a")} rows={4} placeholder="The model answer…" style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.5 }} />
        </div>
        <div>
          <label style={labelStyle}>Key points (one per line)</label>
          <textarea value={f.points} onChange={set("points")} rows={3} placeholder={"Use a message queue\nFan-out to channels\nDedupe + rate-limit"} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.5 }} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Topic</label>
            <input value={f.topic} onChange={set("topic")} placeholder="e.g. Messaging" style={fieldStyle} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={labelStyle}>Difficulty</label>
            <select value={f.difficulty} onChange={set("difficulty")} style={fieldStyle}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Companies (comma-separated)</label>
          <input value={f.companies} onChange={set("companies")} placeholder="e.g. Amazon, Google, Uber" style={fieldStyle} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Related animation (optional)</label>
            <select value={f.anim} onChange={set("anim")} style={fieldStyle}>
              {ANIM_KEYS.map((k) => <option key={k} value={k}>{k || "— none —"}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Related concept # (optional, 1–54)</label>
            <input value={f.concept} onChange={set("concept")} type="number" min="1" max="54" placeholder="e.g. 30" style={fieldStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose} style={{
            padding: "10px 18px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.panel2,
            color: C.dim, cursor: "pointer", fontFamily: display, fontSize: 13.5, fontWeight: 600,
          }}>Cancel</button>
          <button className="btn" onClick={submit} disabled={!f.q.trim() || !f.a.trim()} style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: (!f.q.trim() || !f.a.trim()) ? C.panel2 : `linear-gradient(135deg,${C.teal},${C.blue})`,
            color: (!f.q.trim() || !f.a.trim()) ? C.faint : "#04121a",
            cursor: (!f.q.trim() || !f.a.trim()) ? "default" : "pointer",
            fontFamily: display, fontSize: 13.5, fontWeight: 700,
          }}>Save question</button>
        </div>
      </div>
    </div>
  );
}

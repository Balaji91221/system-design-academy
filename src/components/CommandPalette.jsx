import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { C, mono, display } from "../theme.js";
import { flattenCurriculum } from "../data/curriculum.js";
import { FLASHCARDS } from "../data/flashcards.js";
import { INTERVIEW_QUESTIONS } from "../data/interviewQuestions.js";
import { fuzzyRank } from "../lib/fuzzy.js";
import { useProgress } from "../context/ProgressContext.jsx";

const TYPE_META = {
  concept: { icon: "📚", label: "Concept", color: C.teal },
  flashcard: { icon: "🃏", label: "Flashcard", color: C.purple },
  question: { icon: "🎯", label: "Interview", color: C.amber },
};

// A global Cmd/Ctrl-K command palette: fuzzy search across concepts, flashcards,
// and interview questions; fully keyboard-navigable.
export default function CommandPalette() {
  const nav = useNavigate();
  const { customQuestions } = useProgress();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // One flat, searchable index of everything navigable.
  const index = useMemo(() => {
    const concepts = flattenCurriculum().map((l) => ({
      type: "concept", title: l.title, sub: l.sec, text: `${l.title} ${l.what} ${l.sec}`, to: `/learn/${l.num}`,
    }));
    const cards = FLASHCARDS.map((c) => ({
      type: "flashcard", title: c.front, sub: c.topic, text: `${c.front} ${c.back} ${c.topic}`, to: "/interview",
    }));
    const qs = [...customQuestions, ...INTERVIEW_QUESTIONS].map((q) => ({
      type: "question", title: q.q, sub: q.topic, text: `${q.q} ${q.a} ${q.topic} ${(q.companies || []).join(" ")}`, to: "/interview",
    }));
    return [...concepts, ...qs, ...cards];
  }, [customQuestions]);

  const results = useMemo(() => fuzzyRank(query, index, (it) => it.text, 30), [query, index]);

  // Global hotkey: Cmd/Ctrl-K toggles the palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input + reset when opened.
  useEffect(() => {
    if (open) { setQuery(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);

  useEffect(() => { setSel(0); }, [query]);

  const go = (item) => { if (!item) return; setOpen(false); nav(item.to); };

  const onKeyDown = (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[sel]); }
  };

  // Keep the selected row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-i="${sel}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={() => setOpen(false)}
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(4,8,14,.72)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "12vh 16px" }}>
      <div onClick={(e) => e.stopPropagation()} className="reveal" style={{
        width: "100%", maxWidth: 600, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14,
        boxShadow: "0 40px 90px -30px rgba(0,0,0,.9)", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.line}` }}>
          <span style={{ color: C.teal, fontFamily: mono }}>⌘K</span>
          <input
            ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Search concepts, questions, flashcards…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.ink, fontSize: 15.5, fontFamily: display }}
          />
          <span style={{ fontSize: 10, fontFamily: mono, color: C.faint }}>esc</span>
        </div>

        <div ref={listRef} style={{ maxHeight: "52vh", overflowY: "auto", padding: 6 }}>
          {results.length === 0 && (
            <div style={{ padding: "26px 16px", textAlign: "center", color: C.faint, fontFamily: mono, fontSize: 13 }}>No matches</div>
          )}
          {results.map((it, i) => {
            const m = TYPE_META[it.type];
            const on = i === sel;
            return (
              <button key={i} data-i={i} onMouseEnter={() => setSel(i)} onClick={() => go(it)} style={{
                width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                padding: "10px 12px", borderRadius: 9, border: "none", marginBottom: 2,
                background: on ? C.panel2 : "transparent", color: C.ink,
              }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{m.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</span>
                  <span style={{ fontSize: 11, fontFamily: mono, color: C.faint }}>{it.sub}</span>
                </span>
                <span style={{ fontSize: 9.5, fontFamily: mono, color: m.color, border: `1px solid ${m.color}55`, borderRadius: 99, padding: "2px 8px", flexShrink: 0 }}>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 14, padding: "8px 16px", borderTop: `1px solid ${C.line}`, fontFamily: mono, fontSize: 10.5, color: C.faint }}>
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}

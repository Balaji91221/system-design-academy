import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  DESIGN WALKTHROUGH animations
//  blueprint (4-step framework) · urlshort (TinyURL) · ticket (BookMyShow)
// ============================================================================

// 4-step blueprint
export function A_blueprint() {
  const t = useTick(); const steps = [{ n: "1", l: "Requirements", s: "scope + scale", c: C.blue }, { n: "2", l: "High-Level", s: "boxes & arrows", c: C.teal }, { n: "3", l: "Deep Dive", s: "data + APIs", c: C.amber }, { n: "4", l: "Trade-offs", s: "bottlenecks", c: C.purple }]; const active = Math.floor(t) % 4;
  return (<Stage><T x={265} y={32}>a repeatable interview framework</T>
    {steps.map((s, i) => { const x = 70 + i * 110; return (<g key={i}>
      {i < 3 && <K a={{ x: x + 42, y: 130 }} b={{ x: x + 68, y: 130 }} color={i < active ? s.c : C.line} />}
      <circle cx={x} cy={130} r="26" fill={C.panel} stroke={s.c} strokeWidth={i === active ? 3 : 2} opacity={i <= active ? 1 : 0.4} />
      <text x={x} y={135} fill={s.c} fontFamily={display} fontWeight="700" fontSize="18" textAnchor="middle">{s.n}</text>
      <text x={x} y={175} fill={i <= active ? C.ink : C.faint} fontFamily={display} fontSize="11" fontWeight="600" textAnchor="middle">{s.l}</text>
      <text x={x} y={190} fill={C.faint} fontFamily={mono} fontSize="8" textAnchor="middle">{s.s}</text></g>); })}</Stage>);
}

// URL shortener design
export function A_urlshort() {
  const t = useTick(); const p = (t % 4) / 4;
  return (<Stage><T x={265} y={30}>long URL → hash → short code → redirect</T>
    <N x={75} y={90} label="CLIENT" small color={C.blue} /><N x={250} y={90} label="APP" sub="base62 id" color={C.teal} /><N x={440} y={90} label="DB/KV" sub="code→url" color={C.amber} />
    <N x={250} y={185} label="CACHE" sub="hot links" small color={C.green} w={110} />
    <K a={{ x: 108, y: 90 }} b={{ x: 204, y: 90 }} /><K a={{ x: 296, y: 90 }} b={{ x: 394, y: 90 }} /><K a={{ x: 250, y: 116 }} b={{ x: 250, y: 159 }} dash="3 3" />
    <D x={p < 0.5 ? L(108, 204, ease(p * 2)) : L(296, 394, ease((p - 0.5) * 2))} y={90} color={p < 0.5 ? C.blue : C.teal} text={p < 0.5 ? "tiny.cc/x7Bq" : "lookup"} />
    <T x={265} y={228} color={C.faint} size={9}>read-heavy → cache aggressively · 7-char code = 62⁷ URLs</T></Stage>);
}

// ticketing / concurrency
export function A_ticket() {
  const t = useTick(); const locked = (t % 4) < 2;
  return (<Stage><T x={265} y={30} color={locked ? C.amber : C.green}>{locked ? "seat LOCKED during checkout (no double-book)" : "seat released / confirmed"}</T>
    <N x={80} y={90} label="USER A" small color={C.blue} /><N x={80} y={175} label="USER B" small color={C.purple} />
    <N x={300} y={130} label="BOOKING" sub="lock + TTL" color={C.teal} w={120} />
    <N x={460} y={130} label="SEAT 4A" sub={locked ? "🔒 held" : "✓ free"} small color={locked ? C.amber : C.green} />
    <K a={{ x: 113, y: 95 }} b={{ x: 240, y: 122 }} color={C.green} /><K a={{ x: 113, y: 170 }} b={{ x: 240, y: 138 }} color={locked ? C.red : C.line} dash={locked ? "4 4" : "0"} />
    <K a={{ x: 360, y: 130 }} b={{ x: 437, y: 130 }} />
    {locked && <T x={175} y={158} color={C.red} size={9}>B blocked</T>}
    <T x={265} y={225} color={C.faint} size={9}>distributed lock · idempotent payment · queue at peak</T></Stage>);
}

import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  ARCHITECTURAL PATTERNS animations
//  tiers · micro · eventdriven
// ============================================================================

// layered/multi-tier
export function A_tiers() {
  const t = useTick(); const tiers = [{ n: "PRESENTATION", s: "UI / web", c: C.blue }, { n: "APPLICATION", s: "business logic", c: C.teal }, { n: "DATA", s: "database", c: C.amber }];
  const flow = (t * 0.7) % 3;
  return (<Stage><T x={265} y={30}>requests flow down · responses flow up</T>
    {tiers.map((tr, i) => (<g key={i}>
      <rect x={140} y={50 + i * 58} width="250" height="44" rx="9" fill={C.panel} stroke={tr.c} strokeWidth="2" />
      <text x={265} y={70 + i * 58} fill={tr.c} fontFamily={display} fontWeight="700" fontSize="13" textAnchor="middle">{tr.n}</text>
      <text x={265} y={84 + i * 58} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">{tr.s}</text></g>))}
    <D x={265} y={50 + Math.min(2.5, flow) * 58 + 22} color={flow < 1.5 ? C.blue : C.amber} r={6} /></Stage>);
}

// microservices vs monolith
export function A_micro() {
  const t = useTick(); const split = Math.sin(t * 0.7) * 0.5 + 0.5; const sv = ["auth", "cart", "pay", "ship"];
  return (<Stage><T x={265} y={30}>{split < 0.5 ? "← MONOLITH (one unit)" : "MICROSERVICES (independent) →"}</T>
    {sv.map((s, i) => { const x = 200 + (i % 2) * 130 * split - split * 65; const y = 80 + Math.floor(i / 2) * 70 * split; return (<g key={i}>
      <rect x={x} y={y} width="100" height="50" rx="8" fill={C.panel} stroke={split > 0.5 ? C.teal : C.line} strokeWidth="2" />
      <text x={x + 50} y={y + 30} fill={split > 0.5 ? C.teal : C.dim} fontFamily={mono} fontSize="11" textAnchor="middle">{s}</text></g>); })}
    <T x={265} y={230} color={C.faint} size={9}>scale + deploy each independently — at the cost of network/ops</T></Stage>);
}

// event-driven
export function A_eventdriven() {
  const t = useTick(); const bus = { x: 265, y: 120 }; const pub = { x: 70, y: 120 }; const subs = [{ x: 460, y: 60 }, { x: 460, y: 120 }, { x: 460, y: 180 }];
  return (<Stage><N x={pub.x} y={pub.y} label="PRODUCER" small color={C.amber} />
    <rect x={195} y={100} width="140" height="40" rx="20" fill={C.panel} stroke={C.purple} strokeWidth="2" /><text x={265} y={124} fill={C.purple} fontFamily={display} fontWeight="700" fontSize="12" textAnchor="middle">EVENT BUS</text>
    {subs.map((s, i) => (<g key={i}><K a={{ x: 335, y: 120 }} b={s} color={C.line} /><N x={s.x} y={s.y} label={`SUB ${i + 1}`} small color={C.teal} /></g>))}
    <D x={L(pub.x + 30, 195, ease((t % 2) / 2))} y={120} color={C.amber} text={(t % 2) < 1 ? "event" : ""} />
    {subs.map((s, i) => { const lp = ((t * 0.6 + i * 0.2) % 1); return <D key={i} x={L(335, s.x, ease(lp))} y={L(120, s.y, ease(lp))} r={5} color={C.purple} />; })}
    <T x={265} y={232} color={C.faint} size={9}>publishers don't know subscribers · loose coupling</T></Stage>);
}

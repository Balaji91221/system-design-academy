import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  SCALABILITY animations
//  scaling · autoscale  (load balancing reuses A_lb from networking)
// ============================================================================

// scaling H/V/D
export function A_scaling() {
  const t = useTick(); const pulse = 0.5 + 0.5 * Math.sin(t * 2); const nodes = Math.min(4, 1 + Math.floor(t % 6));
  return (<Stage><T x={120} y={28} color={C.amber}>VERTICAL ↑</T><T x={400} y={28} color={C.teal}>HORIZONTAL →</T>
    <rect x={120 - 30} y={160 - 60 * pulse} width="60" height={50 + 60 * pulse} rx="8" fill={C.panel} stroke={C.amber} strokeWidth="2" /><T x={120} y={185} color={C.amber} size={9}>bigger box</T>
    {Array.from({ length: nodes }).map((_, i) => (<g key={i}><rect x={310 + i * 44} y={120} width="38" height="50" rx="8" fill={C.panel} stroke={C.teal} strokeWidth="2" /><text x={329 + i * 44} y={150} fill={C.teal} fontFamily={mono} fontSize="14" textAnchor="middle">+</text></g>))}
    <T x={400} y={190} color={C.teal} size={9}>more boxes</T>
    <T x={265} y={225} color={C.faint} size={9}>diagonal = grow boxes, then add more (best of both)</T></Stage>);
}

// autoscaling
export function A_autoscale() {
  const t = useTick(); const load = 0.5 + 0.5 * Math.sin(t * 0.8); const n = 1 + Math.round(load * 3);
  return (<Stage><T x={265} y={32}>traffic up → add boxes · traffic down → remove</T>
    <rect x={60} y={55} width="160" height="120" rx="8" fill={C.panel2} stroke={C.line} /><T x={140} y={50} color={C.dim} size={9}>LOAD</T>
    <rect x={75} y={170 - load * 100} width="130" height={load * 100} rx="4" fill={load > 0.7 ? C.red : C.green} opacity="0.7" />
    {Array.from({ length: 4 }).map((_, i) => (<rect key={i} x={300 + i * 50} y={100} width="42" height="55" rx="8" fill={C.panel} stroke={i < n ? C.teal : C.line} strokeWidth="2" opacity={i < n ? 1 : 0.25} />))}
    <T x={390} y={180} color={C.teal} size={10}>{n} active instances</T></Stage>);
}

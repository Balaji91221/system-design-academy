import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";

// Renders a reference-architecture graph (nodes + edges) as an animated SVG,
// matching the app's diagram style. Edges marked `flow` get a travelling data
// dot. Self-clocked via useTick's fallback loop (no AnimationFrame needed).
export default function ArchDiagram({ nodes, edges }) {
  const t = useTick();
  const by = {};
  nodes.forEach((n) => { by[n.id] = n; });
  const W = 600, H = 340;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Reference architecture diagram">
      <rect width={W} height={H} fill={C.panel2} />
      <defs>
        <pattern id="agrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0v26" fill="none" stroke={C.line} strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <marker id="aarrow" markerWidth="9" markerHeight="9" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.faint} />
        </marker>
      </defs>
      <rect width={W} height={H} fill="url(#agrid)" />

      {/* edges */}
      {edges.map((e, i) => {
        const a = by[e.from], b = by[e.to];
        if (!a || !b) return null;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const sx = a.x + ux * 54, sy = a.y + uy * 28;
        const ex = b.x - ux * 58, ey = b.y - uy * 30;
        const col = e.dashed ? C.line : C.faint;
        const p = ease(((t * 0.45) + i * 0.18) % 1);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={e.flow ? 2.2 : 1.6} strokeDasharray={e.dashed ? "5 5" : "0"} markerEnd="url(#aarrow)" />
            {e.label && <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 5} fill={C.faint} fontFamily={mono} fontSize="9" textAnchor="middle">{e.label}</text>}
            {e.flow && <circle cx={L(sx, ex, p)} cy={L(sy, ey, p)} r="4.5" fill={C.teal} />}
          </g>
        );
      })}

      {/* nodes */}
      {nodes.map((n) => {
        const w = n.w || 100, h = 46, c = n.color || C.teal;
        return (
          <g key={n.id}>
            <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx="9" fill={C.panel} stroke={c} strokeWidth="2" />
            <text x={n.x} y={n.y + (n.sub ? -4 : 1)} fill={c} fontFamily={display} fontWeight="700" fontSize="12" textAnchor="middle" dominantBaseline="middle">{n.label}</text>
            {n.sub && <text x={n.x} y={n.y + 12} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">{n.sub}</text>}
          </g>
        );
      })}
    </svg>
  );
}

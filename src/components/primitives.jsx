import React from "react";
import { C, mono, display } from "../theme.js";

// ============================================================================
//  SVG PRIMITIVES — the small building blocks every animation is composed from:
//  Stage (canvas), N (node box), D (moving dot), K (link line), T (text label).
// ============================================================================

// Stage: the gridded SVG canvas every animation draws into.
export function Stage({ children, h = 250 }) {
  return (
    <svg viewBox={`0 0 530 ${h}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="530" height={h} fill={C.panel2} />
      <defs><pattern id="grd" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M26 0H0v26" fill="none" stroke={C.line} strokeWidth="0.5" opacity="0.4" /></pattern></defs>
      <rect width="530" height={h} fill="url(#grd)" />
      {children}
    </svg>
  );
}

// N: a labelled node box (with optional subtitle).
export function N({ x, y, label, sub, color = C.teal, small, dim, w, h }) {
  const W = w || (small ? 66 : 92), H = h || (small ? 40 : 52);
  return (
    <g opacity={dim ? 0.35 : 1}>
      <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx="9" fill={C.panel} stroke={color} strokeWidth="2" />
      <text x={x} y={y + (sub ? -4 : 1)} fill={color} fontFamily={display} fontWeight="700" fontSize={small ? 11 : 13} textAnchor="middle" dominantBaseline="middle">{label}</text>
      {sub && <text x={x} y={y + 12} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">{sub}</text>}
    </g>
  );
}

// D: a travelling dot/packet, optionally labelled.
export function D({ x, y, color = C.teal, r = 7, text }) {
  return (<g>
    <circle cx={x} cy={y} r={r} fill={color} />
    <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
    {text && <text x={x} y={y - r - 5} fill={color} fontFamily={mono} fontSize="9" textAnchor="middle">{text}</text>}
  </g>);
}

// K: a connecting line/edge between two points.
export function K({ a, b, color = C.line, w = 2, dash }) {
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={w} strokeDasharray={dash || "0"} />;
}

// T: a positioned text label.
export function T({ x, y, children, color = C.dim, size = 11, anchor = "middle", weight }) {
  return <text x={x} y={y} fill={color} fontFamily={mono} fontSize={size} textAnchor={anchor} fontWeight={weight}>{children}</text>;
}

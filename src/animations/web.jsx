import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  WEB CONCEPTS animations
//  session · serial · cors
// ============================================================================

// sessions
export function A_session() {
  const t = useTick(); const mode = Math.floor(t / 3) % 2; const cl = { x: 80, y: 120 }, sv = { x: 450, y: 120 };
  return (<Stage><T x={265} y={35} color={mode === 0 ? C.blue : C.teal}>{mode === 0 ? "SESSION — state stored server-side, cookie holds ID" : "JWT TOKEN — state inside the signed token (stateless)"}</T>
    <N x={cl.x} y={cl.y} label="CLIENT" small color={C.blue} /><N x={sv.x} y={sv.y} label="SERVER" small color={C.teal} />
    {mode === 0 ? <N x={265} y={195} label="SESSION STORE" sub="redis" small color={C.amber} w={120} /> : null}
    {mode === 0 && <K a={{ x: 450, y: 146 }} b={{ x: 305, y: 180 }} dash="3 3" />}
    {(t % 1.5) < 0.75 ? <D x={L(cl.x, sv.x, ease((t % 1.5) / 0.75))} y={110} color={C.blue} text={mode === 0 ? "cookie: sid=abc" : "Bearer eyJ..."} /> : <D x={L(sv.x, cl.x, ease(((t % 1.5) - 0.75) / 0.75))} y={130} color={C.teal} text="200 OK" />}</Stage>);
}

// serialization
export function A_serial() {
  const t = useTick(); const p = (t % 4) / 4; const fmt = Math.floor(t / 4) % 3; const names = ["JSON", "Protobuf", "XML"]; const cols = [C.amber, C.purple, C.blue];
  return (<Stage><T x={265} y={35}>object → bytes (serialize) → object (deserialize)</T>
    <rect x={50} y={90} width="110" height="70" rx="9" fill={C.panel} stroke={C.blue} strokeWidth="2" /><text x={105} y={120} fill={C.blue} fontFamily={mono} fontSize="11" textAnchor="middle">{"{ user }"}</text><text x={105} y={138} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">in memory</text>
    <rect x={210} y={100} width="110" height="50" rx="9" fill={C.panel} stroke={cols[fmt]} strokeWidth="2" /><text x={265} y={130} fill={cols[fmt]} fontFamily={mono} fontSize="12" fontWeight="700" textAnchor="middle">{names[fmt]}</text>
    <rect x={370} y={90} width="110" height="70" rx="9" fill={C.panel} stroke={C.teal} strokeWidth="2" /><text x={425} y={120} fill={C.teal} fontFamily={mono} fontSize="11" textAnchor="middle">{"{ user }"}</text><text x={425} y={138} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">restored</text>
    <D x={p < 0.5 ? L(160, 210, ease(p * 2)) : L(320, 370, ease((p - 0.5) * 2))} y={125} r={6} color={cols[fmt]} />
    <T x={265} y={195} color={C.faint} size={9}>JSON readable · Protobuf tiny+fast · XML verbose</T></Stage>);
}

// CORS
export function A_cors() {
  const t = useTick(); const allowed = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={allowed ? C.green : C.red}>{allowed ? "Origin ALLOWED → browser delivers response" : "Origin BLOCKED → browser drops response"}</T>
    <N x={80} y={120} label="app.com" sub="origin" small color={C.blue} /><N x={450} y={120} label="api.other" sub="server" small color={C.teal} />
    <K a={{ x: 113, y: 120 }} b={{ x: 417, y: 120 }} color={allowed ? C.green : C.red} dash={allowed ? "0" : "5 5"} />
    {(t % 1.5) < 0.75 ? <D x={L(80, 450, ease((t % 1.5) / 0.75))} y={108} color={C.blue} text="fetch()" /> : <D x={L(450, 80, ease(((t % 1.5) - 0.75) / 0.75))} y={132} color={allowed ? C.green : C.red} text={allowed ? "ACAO: *" : "no header"} />}
    <T x={265} y={185} color={C.faint} size={9}>Access-Control-Allow-Origin header decides</T>
    <T x={265} y={205} color={C.faint} size={9}>it's a browser policy — not server-side security</T></Stage>);
}

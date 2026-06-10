import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  BONUS — ADVANCED CONCEPTS animations
//  idempotent · consensus · bloom · ratelimit · breaker
// ============================================================================

// idempotency
export function A_idempotent() {
  const t = useTick(); const dup = (t % 4) > 2;
  return (<Stage><T x={265} y={35} color={C.teal}>same request twice → charged once</T>
    <N x={80} y={120} label="CLIENT" small color={C.blue} /><N x={300} y={120} label="SERVER" sub="dedupe by key" color={C.teal} w={130} /><N x={470} y={120} label="$" small color={C.green} />
    <K a={{ x: 113, y: 120 }} b={{ x: 235, y: 120 }} /><K a={{ x: 365, y: 120 }} b={{ x: 454, y: 120 }} />
    <D x={L(113, 235, ease((t % 2) / 2))} y={108} color={C.blue} text="pay key=A1" />
    {dup && <D x={L(113, 235, ease(((t % 2)) / 2))} y={134} color={C.red} text="retry key=A1" />}
    <T x={265} y={175} color={dup ? C.amber : C.faint} size={10}>{dup ? "duplicate key seen → ignored, returns same result" : "first time → process & store key"}</T>
    <T x={265} y={200} color={C.faint} size={9}>critical for payments, retries, at-least-once delivery</T></Stage>);
}

// consensus / leader election
export function A_consensus() {
  const t = useTick(); const leader = Math.floor(t / 3) % 5; const cx = 265, cy = 125, r = 70;
  return (<Stage><T x={265} y={30}>nodes vote → elect one leader (Raft/Paxos)</T>
    {Array.from({ length: 5 }).map((_, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); const isL = i === leader;
      return (<g key={i}>{Array.from({ length: 5 }).map((_, j) => j !== i && j === leader ? <K key={j} a={{ x, y }} b={{ x: cx + r * Math.cos((j / 5) * Math.PI * 2 - Math.PI / 2), y: cy + r * Math.sin((j / 5) * Math.PI * 2 - Math.PI / 2) }} color={C.amber} /> : null)}
        <circle cx={x} cy={y} r="22" fill={C.panel} stroke={isL ? C.amber : C.blue} strokeWidth={isL ? 3 : 2} /><text x={x} y={y + 1} fill={isL ? C.amber : C.blue} fontFamily={mono} fontSize="10" textAnchor="middle" dominantBaseline="middle">{isL ? "★" : `N${i}`}</text></g>); })}
    <T x={265} y={230} color={C.faint} size={9}>majority quorum agrees · leader handles writes</T></Stage>);
}

// bloom filter
export function A_bloom() {
  const t = useTick(); const bits = [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0]; const probe = Math.floor(t * 1.5) % 12; const present = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={C.purple}>"definitely not here" or "maybe here"</T>
    {bits.map((b, i) => (<g key={i}><rect x={75 + i * 32} y={100} width="28" height="36" rx="5" fill={b ? C.panel : C.panel2} stroke={i === probe ? C.amber : (b ? C.purple : C.line)} strokeWidth={i === probe ? 2.5 : 1.5} /><text x={89 + i * 32} y={123} fill={b ? C.purple : C.faint} fontFamily={mono} fontSize="12" fontWeight="700" textAnchor="middle">{b}</text></g>))}
    <T x={265} y={175} color={present ? C.green : C.red} size={11}>{present ? "all probed bits = 1 → maybe present" : "a probed bit = 0 → definitely absent"}</T>
    <T x={265} y={205} color={C.faint} size={9}>tiny memory · no false negatives · used before costly DB hits</T></Stage>);
}

// rate limiting
export function A_ratelimit() {
  const t = useTick(); const tokens = Math.floor((Math.sin(t) * 0.5 + 0.5) * 5); const ok = tokens > 0;
  return (<Stage><T x={150} y={40} color={C.amber}>TOKEN BUCKET</T>
    <rect x={100} y={58} width="100" height="120" rx="10" fill={C.panel2} stroke={C.line} strokeWidth="2" />
    {Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={150} cy={163 - i * 22} r="9" fill={i < tokens ? C.amber : "transparent"} stroke={i < tokens ? C.amber : C.line} strokeWidth="2" opacity={i < tokens ? 1 : 0.4} />)}
    <T x={150} y={198} size={10}>{tokens} tokens left</T>
    <N x={400} y={118} label="REQUEST" small color={ok ? C.green : C.red} sub={ok ? "ALLOWED ✓" : "DROPPED ✗"} />
    <K a={{ x: 200, y: 118 }} b={{ x: 360, y: 118 }} color={ok ? C.green : C.red} dash={ok ? "0" : "4 4"} /></Stage>);
}

// circuit breaker
export function A_breaker() {
  const t = useTick(); const st = Math.floor(t / 2.5) % 3; const states = [{ n: "CLOSED", c: C.green, d: "traffic flows" }, { n: "OPEN", c: C.red, d: "fail fast" }, { n: "HALF-OPEN", c: C.yellow, d: "test 1 req" }]; const s = states[st]; const flow = st === 0;
  return (<Stage><N x={70} y={120} label="APP" small color={C.blue} /><N x={445} y={120} label="SERVICE" small color={st === 1 ? C.red : C.teal} sub={st === 1 ? "down" : "ok"} />
    <g transform="translate(258,120)"><circle r="34" fill={C.panel} stroke={s.c} strokeWidth="3" /><text y="-3" fill={s.c} fontFamily={display} fontWeight="700" fontSize="11" textAnchor="middle">{s.n}</text><text y="12" fill={C.dim} fontFamily={mono} fontSize="8" textAnchor="middle">{s.d}</text></g>
    <K a={{ x: 104, y: 120 }} b={{ x: 220, y: 120 }} color={flow ? C.green : C.line} dash={flow ? "0" : "4 4"} /><K a={{ x: 292, y: 120 }} b={{ x: 408, y: 120 }} color={flow ? C.green : C.line} dash={flow ? "0" : "4 4"} />
    {flow && <D x={L(104, 408, ease(t % 1))} y={120} r={5} color={C.green} />}
    <T x={258} y={225} color={C.faint} size={9}>stops cascading failure from one sick dependency</T></Stage>);
}

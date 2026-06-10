import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  PERFORMANCE animations
//  cache · queue · concur · index
// ============================================================================

// caching (hit/miss)
export function A_cache() {
  const t = useTick(); const cyc = t % 4; const hit = cyc < 2; const cl = { x: 60, y: 120 }, ca = { x: 250, y: 120 }, db = { x: 450, y: 120 }; const lo = cyc % 2;
  return (<Stage><K a={cl} b={ca} /><K a={ca} b={db} dash={hit ? "4 4" : "0"} />
    <N x={cl.x} y={cl.y} label="APP" small color={C.blue} /><N x={ca.x} y={ca.y} label="CACHE" sub={hit ? "HIT ✓" : "MISS ✗"} color={hit ? C.green : C.red} /><N x={db.x} y={db.y} label="DB" sub="slow disk" color={C.amber} dim={hit} />
    {hit ? (lo < 0.5 ? <D x={L(cl.x, ca.x, ease(lo * 2))} y={110} color={C.blue} text="read" /> : <D x={L(ca.x, cl.x, ease((lo - 0.5) * 2))} y={130} color={C.green} text="fast!" />)
      : (lo < 0.5 ? <D x={L(ca.x, db.x, ease(lo * 2))} y={110} color={C.red} text="fetch" /> : <D x={L(db.x, ca.x, ease((lo - 0.5) * 2))} y={130} color={C.amber} text="store" />)}
    <T x={265} y={210} color={C.faint} size={9}>hit = fast memory · miss = slow source then cache</T></Stage>);
}

// message queue
export function A_queue() {
  const t = useTick(); const pr = { x: 60, y: 120 }, co = { x: 460, y: 120 }; const qx = 170, qw = 200;
  return (<Stage><N x={pr.x} y={pr.y} label="PRODUCER" small color={C.amber} /><N x={co.x} y={co.y} label="CONSUMER" small color={C.blue} />
    <rect x={qx} y={100} width={qw} height={40} rx="8" fill={C.panel2} stroke={C.line} strokeWidth="2" /><T x={qx + qw / 2} y={90} size={9}>QUEUE (FIFO)</T>
    {Array.from({ length: 5 }).map((_, i) => { const p = (t * 0.4 + i / 5) % 1; return <circle key={i} cx={qx + 20 + p * (qw - 40)} cy={120} r="7" fill={C.teal} opacity="0.85" />; })}
    <K a={{ x: 90, y: 120 }} b={{ x: qx, y: 120 }} /><K a={{ x: qx + qw, y: 120 }} b={{ x: 430, y: 120 }} />
    <T x={265} y={205} color={C.faint} size={9}>decouples producer & consumer · absorbs spikes · retries</T></Stage>);
}

// concurrency vs parallelism
export function A_concur() {
  const t = useTick(); const mode = Math.floor(t / 3) % 2;
  return (<Stage><T x={265} y={35} color={mode === 0 ? C.amber : C.teal}>{mode === 0 ? "CONCURRENCY — 1 core, interleaved tasks" : "PARALLELISM — many cores, truly at once"}</T>
    {mode === 0 ? (<>
      <rect x={90} y={110} width="350" height="30" rx="6" fill={C.panel} stroke={C.amber} strokeWidth="2" /><T x={70} y={130} color={C.amber} size={10} anchor="end">core</T>
      {["A", "B", "A", "B", "A", "B"].map((task, i) => (<rect key={i} x={95 + i * 57} y={113} width="54" height="24" rx="3" fill={task === "A" ? C.blue : C.purple} opacity={Math.floor(t * 3) % 6 === i ? 1 : 0.4} />))}
      <T x={265} y={175} color={C.faint} size={9}>switches fast — feels simultaneous</T></>) : (<>
      {[C.blue, C.purple, C.teal].map((c, i) => (<g key={i}><rect x={90} y={75 + i * 45} width="350" height="30" rx="6" fill={C.panel} stroke={c} strokeWidth="2" /><T x={70} y={95 + i * 45} color={c} size={10} anchor="end">c{i}</T>
        <rect x={95} y={78 + i * 45} width={340 * ((Math.sin(t * 2 + i) * 0.3 + 0.6))} height="24" rx="3" fill={c} opacity="0.6" /></g>))}
      <T x={265} y={215} color={C.faint} size={9}>3 cores → 3 tasks at the same instant</T></>)}</Stage>);
}

// db indexing / perf
export function A_index() {
  const t = useTick(); const idx = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={idx ? C.green : C.red}>{idx ? "WITH INDEX — jump straight to the row (B-tree)" : "NO INDEX — scan every row"}</T>
    {Array.from({ length: 8 }).map((_, i) => { const target = i === 5; const scanning = !idx && Math.floor(t * 4) % 8 >= i && Math.floor(t * 4) % 8 < 8; return (<rect key={i} x={90 + i * 44} y={100} width="38" height="50" rx="6" fill={target ? C.panel : C.panel2} stroke={target ? C.green : (scanning ? C.red : C.line)} strokeWidth={target ? 2.5 : 1.5} opacity={!idx && Math.floor(t * 4) % 8 < i ? 0.3 : 1} />); })}
    {idx ? <D x={90 + 5 * 44 + 19} y={80} color={C.green} text="O(log n)" /> : <D x={90 + (Math.floor(t * 4) % 8) * 44 + 19} y={80} color={C.red} text="O(n)" />}
    <T x={265} y={185} color={C.faint} size={9}>index trades extra writes/space for fast reads</T></Stage>);
}

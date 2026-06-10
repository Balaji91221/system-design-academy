import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  PROTOCOLS animations
//  tcpudp · http · rest · realtime · modernapi
// ============================================================================

// TCP vs UDP
export function A_tcpudp() {
  const t = useTick(); const tcp = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={tcp ? C.teal : C.amber}>{tcp ? "TCP — reliable, ordered, ACK'd" : "UDP — fast, fire-and-forget"}</T>
    <N x={70} y={120} label="A" small color={C.blue} /><N x={460} y={120} label="B" small color={C.blue} />
    {tcp ? ["1", "2", "3", "ACK"].map((p, i) => { const lp = (t * 0.8 + i * 0.18) % 1; const back = p === "ACK"; return <D key={i} x={L(back ? 460 : 70, back ? 70 : 460, ease(lp))} y={100 + i * 11} color={back ? C.green : C.teal} text={p} />; })
      : Array.from({ length: 6 }).map((_, i) => { const lp = (t + i * 0.16) % 1; const drop = i === 3 && lp > 0.5; return !drop ? <D key={i} x={L(70, 460, lp)} y={110 + (i % 2) * 22} r={5} color={C.amber} /> : null; })}
    <T x={265} y={215} color={C.faint} size={9}>{tcp ? "handshake + retransmit lost packets" : "no handshake · lost packets ignored (live video/games)"}</T></Stage>);
}

// HTTP
export function A_http() {
  const t = useTick(); const me = ["GET", "POST", "PUT", "DELETE"]; const m = Math.floor(t) % 4, ph = t % 1; const cd = ["200", "201", "200", "204"];
  return (<Stage><N x={75} y={120} label="CLIENT" small color={C.blue} /><N x={455} y={120} label="SERVER" small color={C.teal} />
    <rect x={150} y={103} width="230" height="34" rx="8" fill="none" stroke={C.line} strokeDasharray="4 4" />
    {ph < 0.5 ? <D x={L(105, 425, ease(ph * 2))} y={113} color={C.blue} text={`${me[m]} /resource`} /> : <D x={L(425, 105, ease((ph - 0.5) * 2))} y={127} color={C.green} text={`${cd[m]} OK`} />}
    <T x={265} y={175} color={C.amber} size={10}>stateless · headers + body</T>
    <T x={265} y={200} color={C.faint} size={9}>2xx ok · 3xx redirect · 4xx client err · 5xx server err</T></Stage>);
}

// REST
export function A_rest() {
  const t = useTick(); const rows = [{ m: "GET", p: "/users", c: C.green }, { m: "GET", p: "/users/42", c: C.green }, { m: "POST", p: "/users", c: C.blue }, { m: "PUT", p: "/users/42", c: C.amber }, { m: "DELETE", p: "/users/42", c: C.red }];
  const hl = Math.floor(t * 1.2) % rows.length;
  return (<Stage><T x={265} y={32}>resource = noun · HTTP verb = action</T>
    {rows.map((r, i) => (<g key={i} opacity={i === hl ? 1 : 0.45}>
      <rect x={120} y={52 + i * 32} width="290" height="26" rx="6" fill={i === hl ? C.panel : "transparent"} stroke={i === hl ? r.c : C.line} strokeWidth="1.5" />
      <text x={135} y={69 + i * 32} fill={r.c} fontFamily={mono} fontSize="12" fontWeight="700">{r.m}</text>
      <text x={210} y={69 + i * 32} fill={C.ink} fontFamily={mono} fontSize="12">{r.p}</text></g>))}
    <T x={265} y={232} color={C.faint} size={9}>stateless · uniform · cacheable</T></Stage>);
}

// realtime
export function A_realtime() {
  const t = useTick(); const mode = Math.floor(t / 3) % 3; const lab = ["POLLING (wasteful)", "WEBSOCKET (2-way)", "SSE (server→client)"]; const cl = { x: 80, y: 130 }, sv = { x: 450, y: 130 };
  return (<Stage><T x={265} y={35} color={C.teal}>{lab[mode]}</T><N x={cl.x} y={cl.y} label="CLIENT" small color={C.blue} /><N x={sv.x} y={sv.y} label="SERVER" small color={C.teal} /><K a={cl} b={sv} dash="4 4" />
    {mode === 0 && Array.from({ length: 3 }).map((_, i) => { const lp = (t * 1.5 + i * 0.33) % 1; return lp < 0.5 ? <D key={i} x={L(cl.x, sv.x, ease(lp * 2))} y={120} r={5} color={C.faint} text={i === 0 ? "any data?" : ""} /> : <D key={i} x={L(sv.x, cl.x, ease((lp - 0.5) * 2))} y={140} r={5} color={C.red} text={i === 0 ? "nope" : ""} />; })}
    {mode === 1 && [0, 1, 2, 3].map((i) => { const lp = (t + i * 0.25) % 1; const up = i % 2 === 0; return <D key={i} x={L(up ? cl.x : sv.x, up ? sv.x : cl.x, ease(lp))} y={up ? 118 : 142} r={6} color={up ? C.blue : C.teal} />; })}
    {mode === 2 && [0, 1, 2].map((i) => { const lp = (t + i * 0.33) % 1; return <D key={i} x={L(sv.x, cl.x, ease(lp))} y={130} r={6} color={C.teal} text={i === 0 ? "push" : ""} />; })}
    <T x={265} y={220} color={C.faint} size={9}>chat · live scores · notifications · dashboards</T></Stage>);
}

// modern api
export function A_modernapi() {
  const t = useTick(); const mode = Math.floor(t / 3) % 2;
  return (<Stage><T x={265} y={35} color={C.purple}>{mode === 0 ? "gRPC — binary, typed, service↔service" : "GraphQL — ask exactly what you need"}</T>
    {mode === 0 ? (<>
      <N x={90} y={130} label="SVC A" small color={C.blue} /><N x={440} y={130} label="SVC B" small color={C.teal} />
      <K a={{ x: 130, y: 130 }} b={{ x: 400, y: 130 }} color={C.purple} w={2.5} />
      {[0, 1].map((i) => <D key={i} x={L(130, 400, ease((t + i * 0.4) % 1))} y={130} r={6} color={C.purple} text={i === 0 ? "protobuf" : ""} />)}
      <T x={265} y={180} color={C.faint} size={9}>HTTP/2 · streaming · ~7× smaller than JSON</T></>) : (<>
      <N x={80} y={130} label="CLIENT" small color={C.blue} /><N x={280} y={130} label="GraphQL" sub="one endpoint" color={C.purple} />
      <N x={460} y={70} label="DB" small color={C.teal} /><N x={460} y={130} label="API" small color={C.teal} /><N x={460} y={190} label="svc" small color={C.teal} />
      <K a={{ x: 115, y: 130 }} b={{ x: 245, y: 130 }} color={C.purple} w={2.5} /><K a={{ x: 315, y: 122 }} b={{ x: 435, y: 70 }} /><K a={{ x: 315, y: 130 }} b={{ x: 435, y: 130 }} /><K a={{ x: 315, y: 138 }} b={{ x: 435, y: 190 }} />
      <D x={L(115, 245, ease(t % 1))} y={130} r={6} color={C.purple} text="{ name email }" /></>)}</Stage>);
}

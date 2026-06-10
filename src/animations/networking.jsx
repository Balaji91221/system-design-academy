import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  NETWORKING & COMMUNICATION animations
//  ip · dns · cs · proxy · lb · gw · cdn
// ============================================================================

// IP addresses
export function A_ip() {
  const t = useTick(); const oct = ["192", "168", "1", "42"]; const lit = Math.floor(t * 1.5) % 4;
  return (<Stage><T x={265} y={45}>IPv4 · 4 octets · each 0–255</T>
    {oct.map((o, i) => (<g key={i}>
      <rect x={88 + i * 92} y={85} width="78" height="56" rx="10" fill={C.panel} stroke={i === lit ? C.blue : C.line} strokeWidth={i === lit ? 3 : 2} />
      <text x={127 + i * 92} y={118} fill={i === lit ? C.blue : C.dim} fontFamily={mono} fontSize="20" fontWeight="700" textAnchor="middle">{o}</text>
      {i < 3 && <text x={170 + i * 92} y={118} fill={C.faint} fontFamily={mono} fontSize="20" textAnchor="middle">.</text>}</g>))}
    <T x={127} y={172} color={C.faint} size={9}>network</T><T x={403} y={172} color={C.faint} size={9}>host</T>
    <T x={265} y={205} color={C.amber} size={10}>IPv6 → 128-bit, ~340 undecillion addresses</T></Stage>);
}

// DNS
export function A_dns() {
  const t = useTick();
  const s = [{ x: 65, y: 130, l: "You", sub: "type url" }, { x: 195, y: 65, l: "Resolver", sub: "ISP cache" }, { x: 335, y: 65, l: "Root/TLD", sub: ".com" }, { x: 460, y: 130, l: "Auth NS", sub: "→93.184.x" }];
  const seg = Math.floor(t % 4), p = t % 1;
  return (<Stage>{s.map((n, i) => i < 3 && <K key={i} a={n} b={s[i + 1]} />)}
    {s.map((n, i) => <N key={i} x={n.x} y={n.y} label={n.l} sub={n.sub} small color={i === 3 ? C.green : C.amber} dim={i > seg} />)}
    {seg < 3 && <D x={L(s[seg].x, s[seg + 1].x, ease(p))} y={L(s[seg].y, s[seg + 1].y, ease(p))} color={C.amber} text="who?" />}</Stage>);
}

// client-server
export function A_cs() {
  const t = useTick(); const cl = { x: 90, y: 120 }, sv = { x: 430, y: 120 }; const rq = (t % 3) / 1.4, rs = ((t % 3) - 1.5) / 1.4;
  return (<Stage><K a={{ x: cl.x, y: 130 }} b={{ x: sv.x, y: 130 }} dash="4 4" />
    <N x={cl.x} y={cl.y} label="CLIENT" sub="browser/app" color={C.blue} /><N x={sv.x} y={sv.y} label="SERVER" sub="logic+data" color={C.teal} />
    {rq >= 0 && rq <= 1 && <D x={L(cl.x, sv.x, ease(rq))} y={112} color={C.blue} text="GET /data" />}
    {rs >= 0 && rs <= 1 && <D x={L(sv.x, cl.x, ease(rs))} y={132} color={C.teal} text="200 OK" />}</Stage>);
}

// proxy
export function A_proxy() {
  const t = useTick(); const fwd = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={fwd ? C.blue : C.teal}>{fwd ? "FORWARD PROXY — shields clients" : "REVERSE PROXY — shields servers"}</T>
    {fwd ? (<>
      <N x={70} y={90} label="C1" small color={C.blue} /><N x={70} y={160} label="C2" small color={C.blue} />
      <N x={250} y={125} label="PROXY" sub="hides clients" color={C.amber} /><N x={445} y={125} label="WEB" small color={C.faint} />
      <K a={{ x: 100, y: 95 }} b={{ x: 210, y: 118 }} /><K a={{ x: 100, y: 158 }} b={{ x: 210, y: 135 }} /><K a={{ x: 290, y: 125 }} b={{ x: 415, y: 125 }} />
      <D x={L(250, 445, ease((t % 3) / 3))} y={125} color={C.amber} /></>) : (<>
      <N x={70} y={125} label="CLIENTS" small color={C.faint} /><N x={250} y={125} label="PROXY" sub="LB+TLS+cache" color={C.amber} />
      <N x={445} y={70} label="S1" small color={C.teal} /><N x={445} y={125} label="S2" small color={C.teal} /><N x={445} y={180} label="S3" small color={C.teal} />
      <K a={{ x: 105, y: 125 }} b={{ x: 210, y: 125 }} /><K a={{ x: 290, y: 118 }} b={{ x: 415, y: 70 }} /><K a={{ x: 290, y: 125 }} b={{ x: 415, y: 125 }} /><K a={{ x: 290, y: 132 }} b={{ x: 415, y: 180 }} />
      <D x={L(105, 250, ease((t % 3) / 3))} y={125} color={C.amber} /></>)}</Stage>);
}

// load balancer
export function A_lb() {
  const t = useTick(); const lb = { x: 200, y: 120 }, cl = { x: 50, y: 120 }; const sv = [{ x: 430, y: 55 }, { x: 430, y: 120 }, { x: 430, y: 185 }]; const tg = Math.floor(t) % 3, ph = t % 1;
  return (<Stage><K a={cl} b={lb} />{sv.map((s, i) => <K key={i} a={lb} b={s} color={i === tg ? C.teal : C.line} w={i === tg ? 2.5 : 1.5} />)}
    <N x={cl.x} y={cl.y} label="USERS" small color={C.blue} /><N x={lb.x} y={lb.y} label="LB" sub="round-robin" color={C.amber} />
    {sv.map((s, i) => <N key={i} x={s.x} y={s.y} label={`S${i + 1}`} small color={i === tg ? C.teal : C.dim} dim={i !== tg} />)}
    <D x={L(lb.x, sv[tg].x, ease(ph))} y={L(lb.y, sv[tg].y, ease(ph))} color={C.teal} /></Stage>);
}

// gateway
export function A_gw() {
  const t = useTick(); const cl = { x: 55, y: 120 }, gw = { x: 205, y: 120 }; const sv = [{ x: 435, y: 55, n: "users" }, { x: 435, y: 120, n: "orders" }, { x: 435, y: 185, n: "pay" }]; const tg = Math.floor(t) % 3;
  return (<Stage><K a={cl} b={gw} />{sv.map((s, i) => <K key={i} a={gw} b={s} color={i === tg ? C.teal : C.line} w={i === tg ? 2.5 : 1.5} />)}
    <N x={cl.x} y={cl.y} label="CLIENT" small color={C.blue} /><N x={gw.x} y={gw.y} label="GATEWAY" sub="auth·route·limit" color={C.amber} />
    {sv.map((s, i) => <N key={i} x={s.x} y={s.y} label={s.n} small color={i === tg ? C.teal : C.dim} dim={i !== tg} />)}
    <D x={L(gw.x, sv[tg].x, ease(t % 1))} y={L(gw.y, sv[tg].y, ease(t % 1))} color={C.teal} /></Stage>);
}

// CDN
export function A_cdn() {
  const t = useTick(); const o = { x: 265, y: 55 }; const e = [{ x: 90, y: 165 }, { x: 265, y: 178 }, { x: 440, y: 165 }]; const u = [{ x: 60, y: 205 }, { x: 265, y: 213 }, { x: 470, y: 205 }];
  return (<Stage><N x={o.x} y={o.y} label="ORIGIN" sub="far away" small color={C.amber} />
    {e.map((ed, i) => (<g key={i}><K a={o} b={ed} dash="3 3" /><K a={ed} b={u[i]} color={C.teal} />
      <N x={ed.x} y={ed.y} label="EDGE" small color={C.teal} /><D x={u[i].x} y={u[i].y} r={6} color={C.blue} />
      <D x={L(ed.x, u[i].x, ease((t + i * 0.3) % 1))} y={L(ed.y, u[i].y, ease((t + i * 0.3) % 1))} r={5} color={C.teal} /></g>))}
    <T x={265} y={235} color={C.faint} size={9}>cached assets served from nearest edge</T></Stage>);
}

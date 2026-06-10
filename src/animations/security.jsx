import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  SECURITY animations
//  auth · encrypt · netsec
// ============================================================================

// auth (AuthN vs AuthZ)
export function A_auth() {
  const t = useTick(); const mode = Math.floor(t / 3) % 2;
  return (<Stage><T x={265} y={35} color={mode === 0 ? C.blue : C.amber}>{mode === 0 ? "AUTHENTICATION — who are you?" : "AUTHORIZATION — what may you do?"}</T>
    <N x={90} y={130} label="USER" small color={C.blue} />
    {mode === 0 ? (<>
      <N x={300} y={130} label="LOGIN" sub="verify identity" color={C.teal} w={120} /><N x={460} y={130} label="🔑" small color={C.green} />
      <K a={{ x: 116, y: 130 }} b={{ x: 240, y: 130 }} /><K a={{ x: 360, y: 130 }} b={{ x: 444, y: 130 }} />
      <D x={L(116, 240, ease(t % 1))} y={130} color={C.blue} text="user+pass / OTP" /></>) : (<>
      <N x={300} y={130} label="PERMISSIONS" sub="roles / scopes" color={C.amber} w={130} />
      <N x={470} y={80} label="read" small color={C.green} /><N x={470} y={180} label="delete" small color={C.red} />
      <K a={{ x: 116, y: 130 }} b={{ x: 235, y: 130 }} /><K a={{ x: 365, y: 122 }} b={{ x: 445, y: 80 }} color={C.green} /><K a={{ x: 365, y: 138 }} b={{ x: 445, y: 180 }} color={C.red} dash="4 4" />
      <D x={L(116, 235, ease(t % 1))} y={130} color={C.amber} text="role: editor" /></>)}</Stage>);
}

// data protection / encryption
export function A_encrypt() {
  const t = useTick(); const p = (t % 3) / 3;
  return (<Stage><T x={265} y={35}>encrypt in transit (TLS) & at rest</T>
    <N x={80} y={130} label="SENDER" small color={C.blue} /><N x={450} y={130} label="RECEIVER" small color={C.teal} />
    <K a={{ x: 113, y: 130 }} b={{ x: 417, y: 130 }} color={C.green} />
    {p < 0.4 ? <D x={L(113, 230, ease(p / 0.4))} y={130} color={C.blue} text="hello" /> : p < 0.6 ? <g><rect x={240} y={115} width="50" height="30" rx="6" fill={C.panel} stroke={C.green} strokeWidth="2" /><text x={265} y={134} fill={C.green} fontFamily={mono} fontSize="14" textAnchor="middle">🔒</text></g> : <D x={L(290, 417, ease((p - 0.6) / 0.4))} y={130} color={C.teal} text="hello" />}
    <T x={265} y={185} color={C.faint} size={9}>symmetric (AES) fast · asymmetric (RSA) for key exchange</T>
    <T x={265} y={205} color={C.faint} size={9}>hash + salt passwords · never store plaintext</T></Stage>);
}

// network/infra security
export function A_netsec() {
  const t = useTick(); const blocked = Math.floor(t) % 2 === 0;
  return (<Stage><T x={265} y={32}>firewall + layers filter malicious traffic</T>
    <N x={70} y={90} label="GOOD" small color={C.green} /><N x={70} y={170} label="BAD" small color={C.red} />
    <rect x={210} y={60} width="60" height="140" rx="8" fill={C.panel} stroke={C.amber} strokeWidth="2.5" /><T x={240} y={50} color={C.amber} size={10}>FIREWALL</T>
    {Array.from({ length: 4 }).map((_, i) => <line key={i} x1={216} y1={75 + i * 38} x2={264} y2={75 + i * 38} stroke={C.amber} strokeWidth="1" opacity="0.4" />)}
    <N x={430} y={120} label="SERVER" small color={C.teal} />
    <K a={{ x: 100, y: 95 }} b={{ x: 210, y: 110 }} color={C.green} /><K a={{ x: 270, y: 110 }} b={{ x: 400, y: 118 }} color={C.green} />
    <K a={{ x: 100, y: 168 }} b={{ x: 210, y: 150 }} color={C.red} dash="4 4" />
    <D x={L(100, 210, ease((t % 1.5) / 1.5))} y={L(95, 110, ease((t % 1.5) / 1.5))} r={5} color={C.green} />
    <D x={L(100, 205, ease((t % 1.5) / 1.5))} y={L(168, 150, ease((t % 1.5) / 1.5))} r={5} color={C.red} />
    <T x={265} y={228} color={C.faint} size={9}>defense in depth · VPC · DDoS protection · least privilege</T></Stage>);
}

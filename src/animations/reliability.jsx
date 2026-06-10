import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  RELIABILITY, AVAILABILITY & DISASTER RECOVERY animations
//  ha · backup · dr
// ============================================================================

// high availability / failover
export function A_ha() {
  const t = useTick(); const failed = (t % 6) > 3;
  return (<Stage><T x={265} y={35} color={failed ? C.amber : C.green}>{failed ? "PRIMARY DOWN → failover to standby" : "PRIMARY healthy · standby ready"}</T>
    <N x={120} y={130} label="PRIMARY" sub={failed ? "✗ down" : "✓ live"} color={failed ? C.red : C.green} />
    <N x={400} y={130} label="STANDBY" sub={failed ? "✓ live" : "waiting"} color={failed ? C.green : C.dim} dim={!failed} />
    <K a={{ x: 166, y: 130 }} b={{ x: 354, y: 130 }} dash="4 4" color={C.line} />
    <N x={260} y={205} label="HEARTBEAT" small color={C.amber} w={110} />
    {!failed && <D x={L(120, 260, ease((t % 1)))} y={L(130, 195, ease(t % 1))} r={5} color={C.green} />}
    <T x={265} y={70} color={C.faint} size={9}>no single point of failure = high availability</T></Stage>);
}

// backup / recovery
export function A_backup() {
  const t = useTick(); const phase = t % 4;
  return (<Stage><T x={265} y={35}>regular snapshots → restore after disaster</T>
    <N x={100} y={110} label="LIVE DB" sub="primary" color={C.teal} />
    {[0, 1, 2].map(i => (<rect key={i} x={300 + i * 55} y={88} width="44" height="44" rx="8" fill={C.panel} stroke={C.amber} strokeWidth="2" opacity={phase > i ? 1 : 0.3} />))}
    {[0, 1, 2].map(i => <T key={i} x={322 + i * 55} y={114} color={C.amber} size={9}>T{i}</T>)}
    <K a={{ x: 146, y: 110 }} b={{ x: 300, y: 110 }} dash="3 3" />
    <D x={L(146, 455, ease((phase / 4)))} y={110} r={5} color={C.teal} text={phase < 1 ? "snapshot" : ""} />
    <T x={265} y={175} color={C.faint} size={10}>RPO = data loss window · RTO = time to restore</T>
    <T x={265} y={200} color={C.faint} size={9}>full + incremental backups, tested regularly</T></Stage>);
}

// disaster recovery (multi-region)
export function A_dr() {
  const t = useTick(); const failed = (t % 8) > 4;
  return (<Stage><T x={265} y={32}>whole region fails → traffic shifts to another</T>
    <N x={130} y={90} label="REGION A" sub={failed ? "✗ outage" : "✓ active"} color={failed ? C.red : C.green} w={110} />
    <N x={400} y={90} label="REGION B" sub={failed ? "✓ active" : "warm standby"} color={failed ? C.green : C.dim} dim={!failed} w={110} />
    <N x={265} y={185} label="GLOBAL DNS / LB" small color={C.amber} w={150} />
    <K a={{ x: 265, y: 159 }} b={{ x: 150, y: 116 }} color={failed ? C.line : C.green} dash={failed ? "5 5" : "0"} />
    <K a={{ x: 265, y: 159 }} b={{ x: 385, y: 116 }} color={failed ? C.green : C.line} dash={failed ? "0" : "5 5"} />
    <D x={L(265, failed ? 385 : 150, ease(t % 1))} y={L(185, 100, ease(t % 1))} r={5} color={failed ? C.green : C.teal} /></Stage>);
}

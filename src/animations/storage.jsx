import React from "react";
import { C, mono, display } from "../theme.js";
import { useTick, ease, L } from "../lib/animation.js";
import { Stage, N, D, K, T } from "../components/primitives.jsx";

// ============================================================================
//  STORAGE — DATABASE & STORAGE animations
//  cap · sqlnosql · shardrep · object · dfs · bigdata
// ============================================================================

// CAP
export function A_cap() {
  const t = useTick(); const cx = 265, cy = 125, r = 68; const pts = [{ a: -90, l: "C", f: "Consistency", c: C.teal }, { a: 30, l: "A", f: "Availability", c: C.amber }, { a: 150, l: "P", f: "Partition", c: C.blue }]; const pick = Math.floor(t / 2) % 3;
  return (<Stage><T x={cx} y={30}>under a partition: pick 2 of 3</T>
    <polygon points={pts.map(p => `${cx + r * Math.cos(p.a * Math.PI / 180)},${cy + r * Math.sin(p.a * Math.PI / 180)}`).join(" ")} fill="none" stroke={C.line} strokeWidth="2" />
    {pts.map((p, i) => { const x = cx + r * Math.cos(p.a * Math.PI / 180), y = cy + r * Math.sin(p.a * Math.PI / 180); const off = i !== pick; return (<g key={i} opacity={off ? 1 : 0.22}>
      <circle cx={x} cy={y} r="25" fill={C.panel} stroke={p.c} strokeWidth="2.5" /><text x={x} y={y + 1} fill={p.c} fontFamily={display} fontWeight="700" fontSize="19" textAnchor="middle" dominantBaseline="middle">{p.l}</text>
      <text x={x} y={y + (i === 0 ? -38 : 40)} fill={C.dim} fontFamily={mono} fontSize="9" textAnchor="middle">{p.f}</text></g>); })}
    <T x={cx} y={235} color={C.faint} size={9}>CP=etcd/HBase · AP=Cassandra/Dynamo</T></Stage>);
}

// SQL vs NoSQL
export function A_sqlnosql() {
  const t = useTick(); const sql = (t % 6) < 3;
  return (<Stage><T x={265} y={35} color={sql ? C.blue : C.amber}>{sql ? "SQL — structured rows, fixed schema, JOINs" : "NoSQL — flexible docs/KV, scales out"}</T>
    {sql ? (<>{[0, 1, 2, 3].map(i => (<rect key={i} x={120} y={70 + i * 28} width="290" height="24" rx="3" fill={i === 0 ? C.panel : "transparent"} stroke={C.blue} strokeWidth="1.5" />))}
      <line x1={215} y1={70} x2={215} y2={182} stroke={C.blue} strokeWidth="1" opacity="0.5" /><line x1={310} y1={70} x2={310} y2={182} stroke={C.blue} strokeWidth="1" opacity="0.5" />
      <text x={167} y={86} fill={C.blue} fontFamily={mono} fontSize="9" textAnchor="middle">id</text><text x={262} y={86} fill={C.blue} fontFamily={mono} fontSize="9" textAnchor="middle">name</text><text x={360} y={86} fill={C.blue} fontFamily={mono} fontSize="9" textAnchor="middle">email</text>
      <T x={265} y={210} color={C.faint} size={9}>ACID · Postgres, MySQL</T></>) : (<>
      {[{ x: 110, y: 90 }, { x: 280, y: 80 }, { x: 230, y: 150 }, { x: 380, y: 140 }].map((d, i) => (<g key={i}><rect x={d.x} y={d.y} width="100" height="48" rx="9" fill={C.panel} stroke={C.amber} strokeWidth="1.5" /><text x={d.x + 50} y={d.y + 20} fill={C.amber} fontFamily={mono} fontSize="9" textAnchor="middle">{"{ doc }"}</text><text x={d.x + 50} y={d.y + 36} fill={C.dim} fontFamily={mono} fontSize="8" textAnchor="middle">flexible</text></g>))}
      <T x={265} y={210} color={C.faint} size={9}>BASE · Mongo, Cassandra, DynamoDB, Redis</T></>)}</Stage>);
}

// sharding + replication
export function A_shardrep() {
  const t = useTick(); const mode = Math.floor(t / 3.5) % 2;
  if (mode === 0) { const router = { x: 110, y: 120 }; const sh = [{ x: 400, y: 55, r: "A–H" }, { x: 400, y: 120, r: "I–P" }, { x: 400, y: 185, r: "Q–Z" }]; const tg = Math.floor(t) % 3; const keys = ["alice", "marco", "zoe"];
    return (<Stage><T x={265} y={32} color={C.teal}>SHARDING — split data by key across nodes</T>
      {sh.map((s, i) => <K key={i} a={router} b={s} color={i === tg ? C.teal : C.line} w={i === tg ? 2.5 : 1.5} />)}
      <N x={router.x} y={router.y} label="ROUTER" sub={`key:${keys[tg]}`} color={C.amber} />
      {sh.map((s, i) => <N key={i} x={s.x} y={s.y} label={`SHARD ${i + 1}`} sub={s.r} small color={i === tg ? C.teal : C.dim} dim={i !== tg} />)}
      <D x={L(router.x, sh[tg].x, ease(t % 1))} y={L(router.y, sh[tg].y, ease(t % 1))} color={C.teal} text={keys[tg]} /></Stage>); }
  const ld = { x: 120, y: 120 }; const fo = [{ x: 400, y: 55 }, { x: 400, y: 120 }, { x: 400, y: 185 }];
  return (<Stage><T x={265} y={32} color={C.amber}>REPLICATION — copies for reads + failover</T>
    {fo.map((f, i) => <K key={i} a={ld} b={f} />)}<N x={ld.x} y={ld.y} label="LEADER" sub="writes" color={C.amber} />
    {fo.map((f, i) => <N key={i} x={f.x} y={f.y} label={`R${i + 1}`} sub="reads" small color={C.blue} />)}
    {fo.map((f, i) => { const lp = (t * 0.5 + i * 0.2) % 1; return <D key={i} x={L(ld.x, f.x, ease(lp))} y={L(ld.y, f.y, ease(lp))} r={5} color={C.teal} text={i === 1 ? "repl" : ""} />; })}</Stage>);
}

// object storage
export function A_object() {
  const t = useTick(); const items = ["img_01.jpg", "video.mp4", "backup.zip", "doc.pdf"]; const up = Math.floor(t) % 4;
  return (<Stage><T x={265} y={32}>flat buckets · each object has a unique key + URL</T>
    <rect x={170} y={70} width="190" height="130" rx="12" fill={C.panel} stroke={C.teal} strokeWidth="2" /><text x={265} y={92} fill={C.teal} fontFamily={display} fontWeight="700" fontSize="13" textAnchor="middle">BUCKET</text>
    {items.map((it, i) => (<g key={i} opacity={i <= up ? 1 : 0.25}><rect x={185} y={102 + i * 22} width="160" height="18" rx="4" fill={i === up ? C.panel2 : "transparent"} stroke={C.amber} strokeWidth="1" /><text x={195} y={115 + i * 22} fill={C.amber} fontFamily={mono} fontSize="9">{it}</text></g>))}
    <T x={265} y={222} color={C.faint} size={9}>S3 · GCS · cheap, durable, infinitely scalable</T></Stage>);
}

// distributed file systems
export function A_dfs() {
  const t = useTick(); const blocks = [{ x: 360, y: 60 }, { x: 460, y: 60 }, { x: 360, y: 130 }, { x: 460, y: 130 }, { x: 410, y: 195 }]; const hl = Math.floor(t * 1.5) % blocks.length;
  return (<Stage><T x={265} y={32}>big file → split into blocks → replicated across nodes</T>
    <rect x={50} y={95} width="90" height="60" rx="9" fill={C.panel} stroke={C.blue} strokeWidth="2" /><text x={95} y={130} fill={C.blue} fontFamily={mono} fontSize="11" textAnchor="middle">FILE</text>
    {blocks.map((b, i) => (<g key={i}><K a={{ x: 140, y: 125 }} b={b} color={i === hl ? C.teal : C.line} /><rect x={b.x - 22} y={b.y - 16} width="44" height="32" rx="6" fill={C.panel} stroke={i === hl ? C.teal : C.amber} strokeWidth="2" /><text x={b.x} y={b.y + 1} fill={i === hl ? C.teal : C.amber} fontFamily={mono} fontSize="9" textAnchor="middle" dominantBaseline="middle">blk{i}</text></g>))}
    <T x={265} y={230} color={C.faint} size={9}>HDFS · GFS — fault-tolerant via replication</T></Stage>);
}

// big data
export function A_bigdata() {
  const t = useTick(); const vs = [{ l: "Volume", c: C.teal }, { l: "Velocity", c: C.amber }, { l: "Variety", c: C.blue }]; const hl = Math.floor(t) % 3;
  return (<Stage><T x={265} y={32}>process data too big for one machine</T>
    {vs.map((v, i) => (<g key={i} opacity={i === hl ? 1 : 0.45}><circle cx={140 + i * 125} cy={120} r="42" fill={C.panel} stroke={v.c} strokeWidth="2.5" /><text x={140 + i * 125} y={124} fill={v.c} fontFamily={display} fontWeight="700" fontSize="12" textAnchor="middle">{v.l}</text></g>))}
    <T x={265} y={195} color={C.faint} size={9}>batch (Hadoop/Spark) + streaming (Kafka/Flink)</T>
    <T x={265} y={215} color={C.faint} size={9}>map → shuffle → reduce across a cluster</T></Stage>);
}

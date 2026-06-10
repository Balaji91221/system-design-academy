// ============================================================================
//  ANIM REGISTRY — maps a lesson's `anim` key to its animation component.
//  Each animation lives in a section file; lessons may reuse a related one.
// ============================================================================

import { A_ip, A_dns, A_cs, A_proxy, A_lb, A_gw, A_cdn } from "./networking.jsx";
import { A_tcpudp, A_http, A_rest, A_realtime, A_modernapi } from "./protocols.jsx";
import { A_tiers, A_micro, A_eventdriven } from "./architecture.jsx";
import { A_session, A_serial, A_cors } from "./web.jsx";
import { A_scaling, A_autoscale } from "./scalability.jsx";
import { A_cap, A_sqlnosql, A_shardrep, A_object, A_dfs, A_bigdata } from "./storage.jsx";
import { A_cache, A_queue, A_concur, A_index } from "./performance.jsx";
import { A_ha, A_backup, A_dr } from "./reliability.jsx";
import { A_auth, A_encrypt, A_netsec } from "./security.jsx";
import { A_blueprint, A_urlshort, A_ticket } from "./designs.jsx";
import { A_idempotent, A_consensus, A_bloom, A_ratelimit, A_breaker } from "./bonus.jsx";

export const ANIM = {
  ip: A_ip, dns: A_dns, cs: A_cs, proxy: A_proxy, lb: A_lb, gw: A_gw, cdn: A_cdn,
  tcpudp: A_tcpudp, http: A_http, rest: A_rest, realtime: A_realtime, modernapi: A_modernapi,
  tiers: A_tiers, micro: A_micro, eventdriven: A_eventdriven,
  session: A_session, serial: A_serial, cors: A_cors,
  scaling: A_scaling, autoscale: A_autoscale,
  cap: A_cap, sqlnosql: A_sqlnosql, shardrep: A_shardrep, object: A_object, dfs: A_dfs, bigdata: A_bigdata,
  cache: A_cache, queue: A_queue, concur: A_concur, index: A_index,
  ha: A_ha, backup: A_backup, dr: A_dr,
  auth: A_auth, encrypt: A_encrypt, netsec: A_netsec,
  blueprint: A_blueprint, urlshort: A_urlshort, ticket: A_ticket,
  idempotent: A_idempotent, consensus: A_consensus, bloom: A_bloom, ratelimit: A_ratelimit, breaker: A_breaker,
};

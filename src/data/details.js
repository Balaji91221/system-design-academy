// ============================================================================
//  STRUCTURED DETAILS — per-concept, professional, step-by-step content keyed
//  by the global concept number (1..54). Each entry adds:
//    steps  : an ordered "how it works" walkthrough (clarity for everyone)
//    pros   : strengths / why you'd use it
//    cons   : costs / what to watch out for
//    tip    : a pro / interview tip
//  Rendered by LessonView. Missing entries degrade gracefully.
// ============================================================================

export const DETAILS = {
  // ---------- Networking ----------
  1: {
    steps: [
      "A device joins a network and gets an IP address — set manually or handed out automatically by DHCP.",
      "The address is split into a network part and a host part using the subnet mask (CIDR, e.g. /24).",
      "Routers forward each packet hop-by-hop using the network part (longest-prefix match).",
      "At the edge, NAT rewrites private IPs to a shared public IP so many devices reach the internet.",
    ],
    pros: ["Universal, hierarchical addressing that scales to the whole internet.", "Subnetting cleanly isolates and routes networks."],
    cons: ["IPv4 space is exhausted; NAT adds complexity and breaks some peer-to-peer.", "Dynamic IPs can change — you need DNS on top."],
    tip: "Know the private ranges (10/8, 172.16/12, 192.168/16) and what a /24 means — a common warm-up question.",
  },
  2: {
    steps: [
      "You request a domain; the browser and OS caches are checked first.",
      "On a miss, the recursive resolver asks a root server, then the TLD server (.com), then the authoritative nameserver.",
      "The authoritative server returns the record (A/AAAA/CNAME...), cached at each layer for its TTL.",
      "The browser opens a connection to the returned IP address.",
    ],
    pros: ["Human-friendly names decoupled from changing IPs.", "Caching + TTL make lookups fast and enable geo-routing & failover."],
    cons: ["Changes take up to the TTL to propagate.", "A DNS outage or poisoning can take down or hijack a service."],
    tip: "Low TTL = faster failover but more query load — name that trade-off explicitly in interviews.",
  },
  3: {
    steps: [
      "The client opens a connection and sends a request (method, path, headers, body).",
      "The server parses it, runs business logic, and queries data stores as needed.",
      "The server returns a response (status + body); the connection may be reused (keep-alive).",
      "The client renders or processes the result.",
    ],
    pros: ["Clear separation of concerns; servers centralize logic and data.", "One server handles many clients; update and secure centrally."],
    cons: ["The server is a potential bottleneck / single point of failure without scaling.", "Network latency and partial failure must be handled by the client."],
    tip: "Everything else (load balancers, caches, queues) is just a smarter way to scale this one request/response loop.",
  },
  4: {
    steps: [
      "A client sends a request that lands on the proxy instead of the real destination.",
      "A forward proxy (in front of clients) may filter, cache, or anonymize, then fetch on the client's behalf.",
      "A reverse proxy (in front of servers) terminates TLS, picks a backend, and may cache the response.",
      "The proxy returns the response, hiding the other side's identity and details.",
    ],
    pros: ["Centralizes TLS, caching, and access control in one place.", "Hides and protects the side it fronts (clients or servers)."],
    cons: ["Adds a hop (latency) and another component to operate.", "Becomes a bottleneck / SPOF if not made redundant."],
    tip: "Forward proxy protects clients; reverse proxy protects servers. A reverse proxy is the front door to most production systems.",
  },
  5: {
    steps: [
      "Clients send requests to a single virtual address (the load balancer).",
      "The balancer picks a healthy backend using an algorithm (round-robin, least-connections, hash...).",
      "Health checks continuously probe servers and remove dead ones from the pool.",
      "The response flows back through the balancer to the client.",
    ],
    pros: ["Makes horizontal scaling real and enables zero-downtime deploys.", "Automatically routes around failed instances."],
    cons: ["The balancer itself needs redundancy (or it's a SPOF).", "Sticky sessions complicate scaling; stateless servers are better."],
    tip: "L4 balances on IP/port (fast); L7 routes on URL/header/cookie (smart). Know when to reach for each.",
  },
  6: {
    steps: [
      "A client calls a single API endpoint instead of many services.",
      "The gateway authenticates the caller and applies rate limits and logging.",
      "It routes the request to the correct internal service (and may aggregate several).",
      "It returns one clean, unified response to the client.",
    ],
    pros: ["Centralizes auth, rate limiting, and routing — services stay focused.", "Hides internal topology; clients see one stable API."],
    cons: ["Risks becoming a fat coupling point and a latency tax.", "Another critical component to scale and keep available."],
    tip: "A gateway orchestrates and applies policy — keep business logic out of it, or it turns into a distributed monolith.",
  },
  7: {
    steps: [
      "Your static assets are pushed to (or pulled into) edge servers worldwide.",
      "A user requests an asset; DNS/anycast routes them to the nearest edge.",
      "On a cache hit, the edge serves it instantly; on a miss it fetches from the origin, then caches it.",
      "Cache-control headers / TTL decide how long the edge keeps it before revalidating.",
    ],
    pros: ["Cuts latency by serving from physically close edges.", "Offloads huge read traffic from the origin."],
    cons: ["Invalidating stale content globally is hard.", "Only suits cacheable, non-personalized content."],
    tip: "Latency is bounded by the speed of light — a CDN 'beats physics' by moving data closer to the user.",
  },

  // ---------- Protocols ----------
  8: {
    steps: [
      "TCP first performs a 3-way handshake (SYN → SYN-ACK → ACK) to establish a connection.",
      "Data is split into segments, sequenced, and acknowledged; lost segments are retransmitted.",
      "Flow + congestion control adapt the send rate to the receiver and network.",
      "UDP skips all of this: it just fires datagrams with no handshake, ordering, or retransmission.",
    ],
    pros: ["TCP: reliable, ordered delivery for correctness-critical data.", "UDP: minimal overhead and latency for real-time data."],
    cons: ["TCP: handshake + head-of-line blocking add latency.", "UDP: you must handle loss/ordering yourself if you need them."],
    tip: "Zoom audio uses UDP (skip a lost frame, don't freeze); loading its website uses TCP (every byte must arrive).",
  },
  9: {
    steps: [
      "The client builds a request: method (GET/POST...), path, headers, optional body.",
      "It's sent over a connection (often reused via keep-alive or multiplexed in HTTP/2).",
      "The server processes it and returns a status code + headers + body.",
      "The client acts on the status (2xx ok, 3xx redirect, 4xx client error, 5xx server error).",
    ],
    pros: ["Simple, stateless, and universally supported.", "Rich semantics via methods, status codes, and headers (incl. caching)."],
    cons: ["Statelessness means you must add sessions/tokens for identity.", "HTTP/1.1 head-of-line blocking (fixed by HTTP/2 and HTTP/3)."],
    tip: "Get methods + status codes right: GET is safe/idempotent, POST isn't. Interviewers probe this constantly.",
  },
  10: {
    steps: [
      "Model your domain as resources with clean noun URLs (/users, /users/42).",
      "Map actions to HTTP verbs: GET read, POST create, PUT/PATCH update, DELETE remove.",
      "Keep each request stateless — it carries everything the server needs.",
      "Return standard status codes and cacheable, predictable responses.",
    ],
    pros: ["Predictable, self-documenting, and cacheable.", "Stateless and uniform — easy to scale and consume."],
    cons: ["Over/under-fetching (fixed by GraphQL) on complex screens.", "Versioning and pagination conventions get messy at scale."],
    tip: "GET = safe + idempotent, PUT/DELETE = idempotent, POST = not. Idempotency is a favorite REST interview thread.",
  },
  11: {
    steps: [
      "Decide the direction: client↔server (WebSocket) or server→client only (SSE).",
      "The client opens a persistent connection instead of repeatedly polling.",
      "The server pushes messages the instant data changes; the client reacts immediately.",
      "Across many servers, a shared pub/sub (e.g. Redis) fans messages to the right connection.",
    ],
    pros: ["Instant, efficient updates — no wasteful polling.", "WebSockets are full-duplex; SSE is simple and auto-reconnects."],
    cons: ["Persistent connections are stateful — the connection count is the bottleneck.", "Reconnection storms and scaling fan-out need care."],
    tip: "Default to WebSocket for chat/games, SSE for one-way feeds, and long-polling only as a fallback.",
  },
  12: {
    steps: [
      "Pick the protocol for the job: gRPC for internal service calls, GraphQL for flexible client queries.",
      "gRPC: define a .proto schema, generate typed stubs, send compact protobuf over HTTP/2.",
      "GraphQL: expose one endpoint; the client asks for exactly the fields it needs.",
      "The server resolves fields from underlying services/DBs and returns just that shape.",
    ],
    pros: ["gRPC: fast, strongly typed, streaming — great service-to-service.", "GraphQL: no over/under-fetching; one request for nested data."],
    cons: ["gRPC: awkward through browsers/proxies; binary is hard to debug.", "GraphQL: N+1 resolvers, query-depth abuse, and caching are on you."],
    tip: "REST for public/cacheable APIs, gRPC for internal performance, GraphQL for rich client-driven data needs.",
  },

  // ---------- Architecture ----------
  13: {
    steps: [
      "Identify the responsibilities: presentation, business logic, and data access.",
      "Put each in its own layer; a layer only talks to the one directly below it.",
      "Define clear interfaces between layers so implementations can be swapped.",
      "Requests flow down through the layers; responses flow back up.",
    ],
    pros: ["Separation of concerns makes code testable and maintainable.", "You can replace one layer (e.g. the DB) without touching others."],
    cons: ["Rigid layering can cause boilerplate 'pass-through' code.", "Not every problem fits a strict top-down flow."],
    tip: "Hexagonal/ports-and-adapters generalizes this: the domain core depends on nothing; infrastructure plugs in at the edges.",
  },
  14: {
    steps: [
      "Separate the app into physical tiers: web, application, and data.",
      "Run each tier on its own machines, communicating over the network.",
      "Scale each tier independently to match its own load.",
      "Isolate tiers with firewalls/subnets for security and blast-radius control.",
    ],
    pros: ["Independent scaling and deployment per tier.", "Better security and fault isolation between tiers."],
    cons: ["Network hops add latency and partial-failure modes.", "The data tier is usually the hardest to scale."],
    tip: "Scale the stateless app tier horizontally; the data tier often forces replication/sharding first.",
  },
  15: {
    steps: [
      "Find business capabilities and their data boundaries (no shared database).",
      "Carve each capability into a service that owns its data and ships independently.",
      "Let services communicate via APIs or events, not in-process calls.",
      "Add observability (tracing, metrics) and resilience (timeouts, retries, breakers).",
    ],
    pros: ["Independent deploys, scaling, and tech choices per service.", "A fault in one service needn't take down the others."],
    cons: ["Distributed data, network calls, and ops overhead explode.", "Eventual consistency and debugging across services are hard."],
    tip: "Start with a monolith; extract services only when team/scale pain is real (Conway's Law).",
  },
  16: {
    steps: [
      "A producer does its work and emits an event ('order placed') to a broker.",
      "The broker (Kafka/RabbitMQ/SNS) stores and routes the event.",
      "Independent consumers subscribe and react — email, inventory, analytics.",
      "Each consumer processes at its own pace and retries on failure.",
    ],
    pros: ["Loose coupling — producers don't know who's listening.", "Naturally async, resilient, and easy to extend with new consumers."],
    cons: ["Eventual consistency and out-of-order delivery to reason about.", "Harder to trace and debug async flows."],
    tip: "Delivery is usually at-least-once, so make consumers idempotent or you'll process duplicates.",
  },

  // ---------- Web ----------
  17: {
    steps: [
      "A user logs in; the server verifies credentials and creates a session or signs a token.",
      "Server sessions store state server-side and hand the client a session-ID cookie; JWTs put signed claims in the token.",
      "The client sends the cookie/token on every subsequent request.",
      "The server validates it (lookup for sessions, signature check for JWTs) and identifies the user.",
    ],
    pros: ["Sessions: easy to revoke instantly.", "JWTs: stateless — any server can validate without a shared store."],
    cons: ["Sessions need a shared store to scale.", "JWTs are hard to revoke before expiry (use short TTL + refresh)."],
    tip: "Harden cookies with HttpOnly, Secure, and SameSite to blunt XSS and CSRF.",
  },
  18: {
    steps: [
      "Take an in-memory object you want to send or store.",
      "Serialize it into bytes using a format (JSON, Protobuf, Avro, XML).",
      "Transmit or persist those bytes.",
      "On the other side, deserialize them back into an object.",
    ],
    pros: ["JSON: human-readable and ubiquitous.", "Binary (Protobuf/Avro): compact, fast, and schema-evolvable."],
    cons: ["JSON is verbose and slower to parse at scale.", "Binary formats need a shared schema and are hard to eyeball."],
    tip: "Schema formats with field tags give forward/backward compatibility — crucial for rolling deploys.",
  },
  19: {
    steps: [
      "Browser JS on app.com tries to call api.other.com (a different origin).",
      "For non-simple requests the browser first sends a preflight OPTIONS check.",
      "The server responds with Access-Control-Allow-Origin and related headers.",
      "If the origin is allowed, the browser delivers the response to your JS; otherwise it blocks it.",
    ],
    pros: ["Lets servers safely opt in to cross-origin browser access.", "Protects users from malicious cross-site requests."],
    cons: ["Confusing to debug (preflight, credentials rules).", "Easy to misconfigure into either breakage or over-permissive wildcards."],
    tip: "CORS is a browser policy that protects users — it is NOT server-side auth. Always validate tokens regardless.",
  },

  // ---------- Scalability ----------
  20: {
    steps: [
      "Measure where you're constrained (CPU, memory, connections, DB).",
      "Scale vertically first: move to a bigger machine — simple, no code changes.",
      "When you hit the ceiling, scale horizontally: add machines behind a load balancer.",
      "Make services stateless so any instance can handle any request.",
    ],
    pros: ["Vertical is simple; horizontal scales near-limitlessly + adds redundancy.", "Horizontal removes the single-machine ceiling and SPOF."],
    cons: ["Vertical has a hard ceiling and is a SPOF.", "Horizontal needs statelessness and coordination."],
    tip: "Amdahl's law: your speedup is capped by the serial fraction — find and shrink the part that can't parallelize.",
  },
  21: {
    steps: [
      "Choose the layer: L4 (fast, IP/port) or L7 (HTTP-aware routing).",
      "Choose an algorithm: round-robin, least-connections, weighted, or consistent-hash.",
      "Configure health checks and connection draining for safe rollouts.",
      "Add outlier detection so a half-dead node stops receiving traffic.",
    ],
    pros: ["Least-connections/latency-aware beats round-robin under uneven load.", "Consistent hashing preserves cache locality as the pool changes."],
    cons: ["Sticky sessions undermine even distribution.", "The LB tier must itself be redundant (anycast/DNS/paired)."],
    tip: "Mention consistent hashing whenever caches sit behind the balancer — it minimizes cache misses on resize.",
  },
  22: {
    steps: [
      "Pick a signal: CPU, request rate, or queue depth.",
      "Define scale-out and scale-in rules with min/max bounds.",
      "On a spike, launch new (stateless) instances and register them with the LB.",
      "On a lull, drain and terminate idle instances — add cooldowns to avoid flapping.",
    ],
    pros: ["Pay only for the capacity you actually use.", "Absorbs spikes automatically without manual ops."],
    cons: ["Reactive scaling lags sudden spikes (cold starts).", "The database behind elastic app tiers can become the real bottleneck."],
    tip: "Pre-warm (scheduled/predictive scaling) before known events like a product launch or premiere.",
  },

  // ---------- Storage ----------
  23: {
    steps: [
      "Accept that network partitions WILL happen — partition tolerance is mandatory.",
      "During a partition, a node gets a request it can't fully coordinate.",
      "A CP system refuses/blocks the request to avoid returning wrong data.",
      "An AP system answers anyway, accepting possibly stale data, and reconciles later.",
    ],
    pros: ["CP: correctness guarantees (ledgers, locks, config).", "AP: stays available under failure (feeds, counters, carts)."],
    cons: ["CP sacrifices availability during partitions.", "AP exposes stale reads / conflicts you must resolve."],
    tip: "PACELC extends CAP: even with no partition, you trade Latency vs Consistency. Many DBs are tunable per-operation.",
  },
  24: {
    steps: [
      "Model your data and list the queries/access patterns you need.",
      "If you need joins, transactions, and a fixed schema → relational (SQL).",
      "If you need huge scale, flexible schema, or high write throughput → NoSQL.",
      "For NoSQL, design tables around access patterns and denormalize deliberately.",
    ],
    pros: ["SQL: ACID, powerful joins, strong integrity.", "NoSQL: horizontal scale, flexible schema, high throughput."],
    cons: ["SQL scales writes the hardest.", "NoSQL trades joins/consistency and forces query-first modeling."],
    tip: "It's not either/or — polyglot persistence (the right DB per job) is the realistic production answer.",
  },
  25: {
    steps: [
      "Replicate: copy data to followers; the leader takes writes, followers serve reads/failover.",
      "Shard: split the dataset across machines by a key (range or hash).",
      "Route each request to the right shard/replica via a directory or hash function.",
      "Plan rebalancing for when you add/remove nodes (consistent hashing helps).",
    ],
    pros: ["Replication scales reads and gives failover.", "Sharding scales writes and storage beyond one machine."],
    cons: ["Replication lag breaks read-your-writes.", "Bad shard keys cause hot shards; cross-shard joins are painful."],
    tip: "Choose a shard key with high cardinality and even access; resharding later is the real nightmare.",
  },
  26: {
    steps: [
      "Create a bucket (a flat namespace) in the object store.",
      "Upload each file as an object with a unique key; large files use multipart upload.",
      "Read objects by key via an API or a (often presigned) URL.",
      "Use lifecycle rules to tier cold data and a CDN for fast global delivery.",
    ],
    pros: ["Cheap, virtually infinite, and extremely durable (11 nines).", "Simple key→blob model with built-in scale."],
    cons: ["Higher latency than block/disk; no in-place edits (replace whole objects).", "Not a filesystem — no real directories or partial writes."],
    tip: "Front object storage with a CDN and presigned URLs for secure, fast user uploads/downloads.",
  },
  27: {
    steps: [
      "A large file is split into fixed-size blocks (e.g. 128 MB).",
      "Each block is replicated (e.g. 3×) and spread across many data nodes.",
      "A master/namenode tracks which blocks live where (metadata).",
      "Clients read blocks in parallel; lost replicas are re-replicated automatically.",
    ],
    pros: ["Fault-tolerant via replication; survives node failures.", "High throughput from parallel, data-local reads."],
    cons: ["The namenode is a SPOF and a metadata bottleneck (small-files problem).", "High latency for small random reads."],
    tip: "Data-locality scheduling (move compute to the data) is the key insight behind Hadoop/HDFS performance.",
  },
  28: {
    steps: [
      "Ingest data that's too big/fast for one machine (the 3 Vs: volume, velocity, variety).",
      "Batch path: store it, then run periodic jobs (MapReduce/Spark) for throughput.",
      "Stream path: process events in real time (Kafka/Flink) with windowing.",
      "Map → shuffle → reduce across a cluster to aggregate results.",
    ],
    pros: ["Processes datasets no single machine could hold.", "Batch maximizes throughput; streaming minimizes latency."],
    cons: ["The shuffle stage is usually the cost/perf bottleneck.", "Maintaining batch + streaming pipelines is complex (lambda/kappa)."],
    tip: "Use streaming for fresh, low-latency results and batch for accurate, full-history recomputation.",
  },

  // ---------- Performance ----------
  29: {
    steps: [
      "On a read, check the cache first (cache-aside).",
      "On a hit, return instantly from fast memory.",
      "On a miss, load from the slow source, store it in the cache, then return it.",
      "Evict with LRU/LFU + TTL; invalidate on writes to avoid staleness.",
    ],
    pros: ["Massive latency reduction for read-heavy workloads.", "Offloads pressure from the database."],
    cons: ["Invalidation is hard — stale data is a constant risk.", "Hot-key expiry can cause a stampede onto the DB."],
    tip: "Prevent stampedes with a per-key lock, early recompute, or stale-while-revalidate plus TTL jitter.",
  },
  30: {
    steps: [
      "The producer drops a message onto the queue and returns immediately.",
      "The broker durably holds the message until a consumer is ready.",
      "A consumer pulls the message, processes it, and acknowledges it.",
      "Failures are retried; poison messages go to a dead-letter queue.",
    ],
    pros: ["Decouples producers from consumers; absorbs spikes.", "Enables retries and isolates slow downstream services."],
    cons: ["At-least-once delivery → consumers must be idempotent.", "Ordering is only per-partition; adds operational moving parts."],
    tip: "Always monitor consumer lag and set up a dead-letter queue — these are the two things that bite in production.",
  },
  31: {
    steps: [
      "Classify the work: I/O-bound (waiting) vs CPU-bound (computing).",
      "For I/O-bound, use concurrency: interleave many tasks on one thread (async/event loop).",
      "For CPU-bound, use parallelism: run tasks at once on multiple cores/processes.",
      "Protect shared state with locks/atomics, or avoid sharing via message-passing.",
    ],
    pros: ["Concurrency handles thousands of slow connections cheaply.", "Parallelism delivers real speedups for heavy computation."],
    cons: ["Races, deadlocks, and subtle bugs are easy to introduce.", "Python's GIL limits CPU parallelism to processes, not threads."],
    tip: "'Concurrency is dealing with many things; parallelism is doing many things' — quote this and explain it.",
  },
  32: {
    steps: [
      "Identify slow queries (e.g. with EXPLAIN / the query plan).",
      "Add an index (usually a B-tree) on the filtered/sorted columns.",
      "The DB now jumps to matching rows in O(log n) instead of scanning O(n).",
      "Balance it: index selectively, since each index slows writes and uses space.",
    ],
    pros: ["Turns full-table scans into fast lookups.", "Composite/covering indexes can satisfy a query without touching the table."],
    cons: ["Every index slows inserts/updates and adds storage.", "Wrong column order/low selectivity means the index goes unused."],
    tip: "Always read the query plan before adding indexes — guessing leads to unused indexes that only cost writes.",
  },

  // ---------- Reliability ----------
  33: {
    steps: [
      "Remove single points of failure with redundancy at every layer.",
      "Run a primary plus one or more standbys.",
      "Heartbeats continuously check the primary's health.",
      "On failure, promote a standby automatically; clients reconnect.",
    ],
    pros: ["Keeps serving through component failures.", "Automatic failover minimizes downtime."],
    cons: ["Replication lag means possible data loss on failover (RPO).", "Split-brain risk needs consensus/quorum to prevent."],
    tip: "Availability multiplies across dependencies: 99.9% × 99.9% < 99.9%. Count the chain, not one link.",
  },
  34: {
    steps: [
      "Decide your RPO (acceptable data loss) and RTO (acceptable downtime).",
      "Take full backups periodically plus incrementals/log-shipping between them.",
      "Store copies off-region and immutable (ransomware/bad-deploy safe).",
      "Regularly run restore drills — an untested backup isn't a backup.",
    ],
    pros: ["Lets you recover from corruption, deletion, or disaster.", "Incrementals balance completeness against cost/time."],
    cons: ["Backups consume storage and need lifecycle management.", "Restores can be slow and surprisingly error-prone."],
    tip: "The only real backup is a tested restore — interviewers love when you say this and mean it.",
  },
  35: {
    steps: [
      "Keep a copy of the system in another region (cold → warm → active-active).",
      "Replicate data continuously to the standby region.",
      "Health-check the primary region globally.",
      "On a regional outage, shift traffic via global DNS/anycast to the healthy region.",
    ],
    pros: ["Survives the loss of an entire data center or region.", "Tunable: pick readiness vs cost (pilot-light → active-active)."],
    cons: ["Hotter standbys cost much more.", "Async replication risks data loss; sync replication costs latency."],
    tip: "Run game-days. A DR plan you've never exercised will fail exactly when you need it.",
  },

  // ---------- Security ----------
  36: {
    steps: [
      "Authenticate first: verify identity (password, OTP, OAuth, biometrics, MFA).",
      "Issue a short-lived token/session representing that identity.",
      "On each action, authorize: check the identity's roles/scopes/policies.",
      "Enforce least privilege and check permissions per resource, every time.",
    ],
    pros: ["Clean separation: who you are vs what you may do.", "OAuth2/OIDC enable delegated 'Sign in with...' flows."],
    cons: ["Misplaced trust (client/gateway only) causes privilege escalation.", "Token revocation and rotation add complexity."],
    tip: "Always authN before authZ, and check authorization at every layer — never trust the client or a single gateway.",
  },
  37: {
    steps: [
      "Encrypt in transit with TLS/HTTPS so the network can't read data.",
      "Encrypt at rest on disk/DB, with keys managed by a KMS (and rotated).",
      "Use symmetric (AES) for bulk data and asymmetric (RSA/ECC) for key exchange/signatures.",
      "For passwords, store a slow, salted hash (bcrypt/argon2) — never the password.",
    ],
    pros: ["Keeps data unreadable to attackers in transit and at rest.", "Layered crypto limits the damage of any single breach."],
    cons: ["Key management is the hard, high-stakes part.", "Crypto adds CPU cost and operational complexity."],
    tip: "The key, not the algorithm, is the weak point. Never hand-roll crypto — use vetted libraries and a KMS.",
  },
  38: {
    steps: [
      "Segment the network: VPCs, subnets, and security groups.",
      "Put sensitive systems (databases) in private subnets, unreachable from the internet.",
      "Grant least-privilege access between components, allow-listed explicitly.",
      "Front everything with a WAF + DDoS protection; monitor, log, and patch continuously.",
    ],
    pros: ["Defense-in-depth shrinks the blast radius of any breach.", "Least privilege limits lateral movement by attackers."],
    cons: ["More moving parts to configure correctly.", "Security is ongoing work, never 'done'."],
    tip: "Assume breach: minimize blast radius, log everything, and rotate secrets — that mindset wins points.",
  },

  // ---------- Blueprint ----------
  39: {
    steps: [
      "1. Clarify requirements & scope: functional needs + scale numbers (users, QPS, data).",
      "2. High-level design: sketch the major components and how they connect.",
      "3. Deep dive: data models, APIs, and the one or two genuinely hard components.",
      "4. Trade-offs: discuss bottlenecks, failure modes, scaling, and alternatives.",
    ],
    pros: ["A repeatable structure keeps you calm and complete under pressure.", "Requirements/scale numbers justify every later decision."],
    cons: ["Skipping step 1 leads to designing the wrong system.", "Spending too long high-level leaves no time to deep-dive."],
    tip: "Drive the interview: nail scope + scale first, time-box the high level, then own the hard part out loud.",
  },

  // ---------- URL Shortener ----------
  40: {
    steps: [
      "List functional needs: shorten(long)→code and redirect(code)→long.",
      "Separate must-haves from optional (custom alias, expiry, analytics).",
      "State the scale: URLs created/day and redirects/sec (read-heavy).",
      "State non-functional goals: low-latency redirects, high availability.",
    ],
    pros: ["A crisp scope prevents over-engineering.", "The read:write ratio set here drives every later choice."],
    cons: ["Vague scope leads to a sprawling, unfocused design.", "Forgetting non-functional needs misses the real challenge."],
    tip: "Pin down the read:write ratio early — it justifies the aggressive caching you'll add later.",
  },
  41: {
    steps: [
      "Estimate writes (e.g. 100M new URLs/month) and reads (≈10×).",
      "Convert to QPS: writes ≈ 40/s, reads ≈ 400/s, with higher peaks.",
      "Size the keyspace: 7 base62 chars = 62⁷ ≈ 3.5 trillion codes.",
      "Conclude the read path is the bottleneck → design around caching.",
    ],
    pros: ["Numbers reveal the true bottleneck (reads).", "Justifies cache-first architecture quantitatively."],
    cons: ["Bad assumptions skew the whole design.", "Storage looks tiny per row but balloons over billions of rows."],
    tip: "Always state the read:write ratio out loud — it's the single most important number here.",
  },
  42: {
    steps: [
      "Define the API: POST /shorten and GET /{code} → 301 redirect.",
      "Choose code generation: counter+base62 (collision-free) or hashing.",
      "Store the code→URL mapping in a fast key-value store.",
      "Put a cache in front of the read path for hot links.",
    ],
    pros: ["Simple two-endpoint contract.", "Cache-fronted KV lookup keeps redirects fast."],
    cons: ["Counter needs a distributed ID source; hashing needs collision handling.", "301 (cacheable) vs 302 (countable) is a real trade-off."],
    tip: "Counter+base62 sidesteps collision checks entirely — call that out as a clean design choice.",
  },
  43: {
    steps: [
      "Pick the KV store (DynamoDB/Redis) for O(1) lookups by code.",
      "Add Redis for hot links and a CDN for geographic reach.",
      "Handle collisions/uniqueness (retry, or pre-allocated ID ranges).",
      "Rate-limit the shorten endpoint to stop spam/abuse.",
    ],
    pros: ["Predictable low-latency reads at scale.", "Pre-allocated ID ranges remove the write bottleneck."],
    cons: ["More infrastructure to operate.", "Abuse/malware links require detection and rate limiting."],
    tip: "Pre-allocate ID ranges per app server so code generation never becomes a central write bottleneck.",
  },
  44: {
    steps: [
      "Write path: generate id → base62 code → store in KV.",
      "Read path: cache → KV → return HTTP 301.",
      "Log clicks asynchronously via a queue so redirects never block.",
      "Replicate multi-region + CDN edge for global availability and speed.",
    ],
    pros: ["Fast, cacheable redirects with analytics that don't slow them.", "Highly available and globally low-latency."],
    cons: ["Async analytics is eventually consistent.", "Multi-region adds replication and operational complexity."],
    tip: "Keep analytics off the hot path (async event stream) — a redirect must never wait on logging.",
  },

  // ---------- Ticketing ----------
  45: {
    steps: [
      "List flows: browse events, view seat availability, book, and pay.",
      "Pin the hard constraint: never sell the same seat twice.",
      "Note traffic shape: huge cacheable browsing vs spiky contended booking.",
      "Set guarantees: strong consistency for booking, high availability for browsing.",
    ],
    pros: ["Correctly identifies correctness-under-contention as the core problem.", "Separates the easy (browse) from the hard (book)."],
    cons: ["Underestimating contention leads to double-booking.", "Treating booking like browsing breaks consistency."],
    tip: "Frame it as two systems: an AP-friendly read path and a strongly-consistent write path.",
  },
  46: {
    steps: [
      "Quantify the on-sale spike: e.g. 1M users hitting one show at t=0.",
      "Compute contention: ~20 buyers fighting per seat.",
      "Identify the seat-lock/checkout path as the bottleneck.",
      "Note the payment dependency adds latency and must be reliable.",
    ],
    pros: ["Pinpoints exactly where to spend the design budget.", "Shows browsing scales trivially with caching."],
    cons: ["Ignoring hot-row contention causes oversell or lock contention.", "Payment latency can stall the whole booking."],
    tip: "Say it plainly: browsing is cacheable; the seat-reservation step is the true bottleneck.",
  },
  47: {
    steps: [
      "Split into services: catalog, inventory, booking, payment, notification.",
      "Reserve a seat with a temporary TTL lock during checkout.",
      "Throttle the stampede with a virtual waiting room/queue.",
      "Confirm the booking transactionally and idempotently.",
    ],
    pros: ["TTL locks guarantee one buyer per seat without permanent holds.", "A waiting room flattens the spike fairly."],
    cons: ["Abandoned carts must reliably release locks (TTL handles it).", "Coordinating lock + payment + confirm is intricate."],
    tip: "A short-TTL lock auto-releases abandoned seats — no cron cleanup, no stuck inventory.",
  },
  48: {
    steps: [
      "Reserve atomically: a distributed lock (Redis) or DB row lock (SELECT FOR UPDATE).",
      "Attach idempotency keys so retried payments never double-charge/book.",
      "Use a relational DB for booking integrity and a cache for the catalog.",
      "Smooth the on-sale with a waiting-room queue.",
    ],
    pros: ["Guarantees exactly one sale per seat under massive concurrency.", "Idempotency makes payment retries safe."],
    cons: ["Distributed locks have failure modes (Redlock caveats).", "Strong consistency on booking costs some throughput."],
    tip: "Pair seat locks with idempotency keys — together they kill both double-booking and double-charging.",
  },
  49: {
    steps: [
      "Browse path: CDN + cache over the catalog for huge read scale.",
      "Book path: lock seat → process payment idempotently → confirm in a transaction.",
      "Absorb spikes with a waiting room; confirm tickets via async notifications.",
      "Run multi-AZ databases with replication for durability and availability.",
    ],
    pros: ["Scales reads while keeping the booking core strongly consistent.", "Fair, correct, and durable under concert-on-sale chaos."],
    cons: ["The strongly-consistent core caps booking throughput.", "Many coordinated components to operate."],
    tip: "The whole art is isolating the strongly-consistent booking core from the massively-scalable read path.",
  },

  // ---------- Bonus ----------
  50: {
    steps: [
      "The client attaches a unique idempotency key to the operation.",
      "The server atomically checks whether that key was already processed.",
      "If new, it performs the work and stores the key with its result.",
      "If seen, it returns the stored result instead of doing the work again.",
    ],
    pros: ["Safe retries — exactly-once effect under at-least-once delivery.", "Prevents duplicate charges, orders, and side effects."],
    cons: ["Needs a durable, consistent key store with expiry.", "Keys must be scoped per operation or you'll collide."],
    tip: "Store the response with the key so a retry returns the original result, not just 'already done'.",
  },
  51: {
    steps: [
      "Nodes start as followers with randomized election timeouts.",
      "A timed-out follower becomes a candidate and requests votes.",
      "Winning a majority quorum makes it leader; it serializes writes.",
      "The leader replicates its log; if its heartbeat stops, a new election runs.",
    ],
    pros: ["A single source of truth despite node failures.", "Survives any minority failure with a majority quorum."],
    cons: ["Unavailable without a quorum (sacrifices A under partition).", "Subtle to implement correctly (use Raft, don't invent it)."],
    tip: "Randomized election timeouts are what prevent endless split votes — a great detail to mention.",
  },
  52: {
    steps: [
      "Allocate a bit array and choose k hash functions.",
      "To add an item, hash it k ways and set those k bits.",
      "To test an item, hash it and check those k bits.",
      "Any bit 0 → definitely absent; all bits 1 → maybe present (verify).",
    ],
    pros: ["Tiny memory footprint; very fast.", "No false negatives — 'absent' is always true."],
    cons: ["False positives (tunable via size m and k).", "Standard variant can't delete (use a counting Bloom filter)."],
    tip: "Used as a cheap gatekeeper before expensive disk/network lookups — e.g. Cassandra skipping SSTable reads.",
  },
  53: {
    steps: [
      "Define the limit and window (e.g. 100 requests/min per API key).",
      "On each request, check the client's counter/bucket in a fast shared store.",
      "Token bucket: refill tokens steadily; spend one per request; empty → reject.",
      "Return HTTP 429 + Retry-After when the limit is exceeded.",
    ],
    pros: ["Protects against abuse, runaway clients, and thundering herds.", "Token bucket allows controlled bursts."],
    cons: ["Distributed limiting needs an atomic shared store (Redis + Lua).", "Clock skew and limiter downtime need a fail-open/closed policy."],
    tip: "Sliding-window-counter is the cheap, accurate-enough default; sliding-window-log is precise but memory-heavy.",
  },
  54: {
    steps: [
      "Wrap calls to a dependency in a breaker that counts failures.",
      "CLOSED: traffic flows normally while errors stay low.",
      "Too many errors → OPEN: reject instantly (fail fast) for a cooldown.",
      "After cooldown → HALF-OPEN: allow one trial; success closes it, failure re-opens.",
    ],
    pros: ["Stops one sick dependency from cascading into a full outage.", "Fails fast instead of hanging and exhausting threads."],
    cons: ["Needs tuning (thresholds, cooldown) to avoid false trips.", "Must be paired with timeouts/fallbacks to be useful."],
    tip: "Combine breakers with timeouts, bounded retries (with jitter), and bulkheads — alone none is enough.",
  },
};

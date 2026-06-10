// ============================================================================
//  DEPTH LAYERS — per-concept "Simple" (ELI5) and "Deep dive" (internals &
//  failure modes) text, keyed by the global concept number (1..54).
//  The "Core" layer is the lesson's existing `what` + `points`.
//  Anything missing falls back gracefully in the UI.
// ============================================================================

export const DEPTH = {
  // --- Networking ---
  1: { simple: "An IP address is like a home address for a computer — it tells the internet where to deliver data.",
       deep: "Subnetting splits the 32-bit space with a mask (CIDR); routers forward by longest-prefix match. NAT lets many private hosts share one public IP, which is why IPv4 survived exhaustion. IPv6 removes NAT need but adoption is gated on hardware/ISP support." },
  2: { simple: "DNS is the internet's contacts app — you type a name, it finds the number (IP) to call.",
       deep: "Resolution is recursive then iterative; answers are cached per TTL at every hop. Anycast routes a query to the nearest copy of a nameserver. Low TTLs enable fast failover but raise query volume and resolver load; DNS is also a classic DDoS amplification vector." },
  3: { simple: "Your app asks a question (request), a server answers (response). That back-and-forth runs everything online.",
       deep: "Servers multiplex thousands of connections via event loops or thread pools; keep-alive reuses TCP connections to dodge handshake cost. Statelessness is what lets you add identical servers behind a balancer — any of them can serve any request." },
  4: { simple: "A proxy is a middleman: a forward proxy hides you from websites; a reverse proxy hides servers from you.",
       deep: "Reverse proxies terminate TLS, do L7 routing, response caching, compression, and shield origins from direct exposure. Watch for header spoofing (X-Forwarded-For), buffering vs streaming trade-offs, and the proxy itself becoming a bottleneck/SPOF." },
  5: { simple: "A load balancer is a traffic cop sending each visitor to whichever server is free.",
       deep: "L4 balances on IP/port (fast, opaque); L7 inspects HTTP for path/header routing and can do retries, sticky sessions, and circuit breaking. Health checks must distinguish 'slow' from 'dead'; the balancer needs its own redundancy (e.g. paired with DNS or anycast)." },
  6: { simple: "An API gateway is the single front door to many backend services — it checks your ID and routes you.",
       deep: "Centralizes auth, rate limiting, request shaping, and protocol translation, but risks becoming a fat coupling point. Beware added latency, and keep business logic out of the gateway — it should orchestrate, not implement." },
  7: { simple: "A CDN keeps copies of files near you, so they load fast instead of crossing the planet.",
       deep: "Edges cache by URL with TTL/ETag revalidation; cache-control headers and key normalization decide hit ratio. Hard parts: purging stale content globally, cache-key explosion from query params, and origin-shield tiers to protect the origin on mass misses." },

  // --- Protocols ---
  8: { simple: "TCP is a phone call (reliable, ordered). UDP is a postcard (fast, might get lost).",
       deep: "TCP gives ordering, flow control, and congestion control (slow-start, AIMD) at the cost of head-of-line blocking. UDP is the substrate for QUIC/HTTP3, which rebuilds reliability in user space to avoid kernel TCP's HOL blocking and speed up handshakes." },
  9: { simple: "HTTP is the language browsers and servers use to ask for and send web pages.",
       deep: "HTTP/1.1 serializes requests per connection; HTTP/2 multiplexes streams over one TCP connection (but suffers TCP HOL blocking); HTTP/3 moves to QUIC/UDP. Idempotency and caching semantics live in the method + status + headers — get them right." },
  10: { simple: "REST is a tidy convention: nouns in the URL (/users), verbs as the action (GET, POST).",
       deep: "Richardson maturity, HATEOAS, and proper status/idempotency separate REST from RPC-over-HTTP. Pagination, filtering, versioning, and partial responses are where real APIs get messy; cache-ability is a first-class design goal." },
  11: { simple: "Instead of refreshing to check for new messages, the server pushes them to you the instant they happen.",
       deep: "WebSockets need sticky routing or a shared pub/sub (Redis) to fan out across servers; SSE is simpler and auto-reconnects but is one-way. At scale, the connection count itself is the bottleneck — plan for backpressure and graceful reconnection storms." },
  12: { simple: "gRPC is fast machine-to-machine talk; GraphQL lets the client ask for exactly the fields it wants.",
       deep: "gRPC uses protobuf + HTTP/2 streaming and codegen'd stubs — great internally, awkward through browsers/proxies. GraphQL solves over/under-fetching but shifts cost to the server: N+1 resolvers, query-depth abuse, and caching become your problem." },

  // --- Architecture ---
  13: { simple: "Organize code in layers — screen on top, logic in the middle, data at the bottom — each minding its own job.",
       deep: "Clean separation enables testing and swapping implementations, but rigid layering can cause 'pass-through' anemia. Hexagonal/ports-and-adapters generalizes this: the domain core depends on nothing, infrastructure plugs in at the edges." },
  14: { simple: "Run the web part, the logic part, and the database on separate machines so each can grow on its own.",
       deep: "Physical tiers add network hops (latency, partial failure) but enable independent scaling and blast-radius isolation. The data tier is usually the hardest to scale — it often forces the move to replication/sharding while app tiers stay stateless." },
  15: { simple: "Break one big app into small services that each do one thing and ship on their own schedule.",
       deep: "Service boundaries should follow business capabilities and data ownership (no shared DB). The tax: distributed transactions (sagas), eventual consistency, observability (tracing), and operational sprawl. Don't start here — extract when a monolith genuinely hurts." },
  16: { simple: "Services shout out 'this happened!' and whoever cares listens — no one waits on anyone.",
       deep: "Pub/sub decouples producers from consumers; event sourcing makes the log the source of truth and CQRS splits read/write models. Hard parts: ordering, exactly-once (really effectively-once via idempotency), schema evolution, and debugging async flows." },

  // --- Web ---
  17: { simple: "HTTP forgets you between clicks; a session or token is the wristband that proves you're still logged in.",
       deep: "Server sessions centralize revocation but need a shared store; JWTs scale statelessly but are hard to revoke before expiry (use short TTL + refresh tokens + a denylist). Cookie flags (HttpOnly/Secure/SameSite) defend against XSS/CSRF." },
  18: { simple: "Serialization turns an object into bytes to send or store, then back into an object on the other side.",
       deep: "Schema-driven formats (protobuf/Avro) give compactness and forward/backward compatibility via field tags — critical for rolling deploys. JSON is great for humans/debugging; binary wins on CPU and bandwidth at high throughput." },
  19: { simple: "CORS is the browser's rule about which websites are allowed to call which APIs from your browser.",
       deep: "It's enforced by the browser, not the server — it protects users, not your data. Preflight (OPTIONS) checks method/headers; credentials require explicit allow-list (no wildcard). It is not auth: always validate tokens server-side regardless." },

  // --- Scalability ---
  20: { simple: "Need more power? Get a bigger machine (vertical) or add more machines (horizontal).",
       deep: "Vertical hits a hardware ceiling and is a SPOF; horizontal needs statelessness + a balancer and introduces coordination. Amdahl's law caps speedups by the serial fraction — find and shrink the part that can't parallelize." },
  21: { simple: "A closer look at the traffic cop: different rules for choosing servers, working at different layers.",
       deep: "Least-connections and EWMA-latency beat round-robin under uneven request cost. Consistent hashing keeps cache locality when the pool changes. Connection draining and outlier detection prevent sending traffic to a half-dead node." },
  22: { simple: "Add servers automatically when it's busy, remove them when it's quiet — pay only for what you use.",
       deep: "Reactive scaling (CPU/QPS) lags spikes; predictive/scheduled scaling pre-warms for known events. Watch cold starts, scale-in safety (drain first), metric flapping (cooldowns/hysteresis), and the database becoming the unscalable bottleneck behind elastic app tiers." },

  // --- Storage ---
  23: { simple: "When the network splits, a database must choose: stay correct (refuse) or stay up (maybe stale).",
       deep: "CAP is about behavior during a partition; PACELC adds the latency-vs-consistency trade-off when there's no partition. Real systems are tunable per-operation (e.g. Dynamo/Cassandra quorum R+W>N) rather than globally CP or AP." },
  24: { simple: "SQL = neat tables with strict rules; NoSQL = flexible bags of data that spread across many machines.",
       deep: "Relational gives ACID + joins but scales writes hardest; NoSQL families (KV, document, wide-column, graph) trade joins/consistency for horizontal scale and flexible schema. Model NoSQL around access patterns, not entities — denormalize deliberately." },
  25: { simple: "Replication makes copies (for reads + safety); sharding splits the data so no single machine holds it all.",
       deep: "Replication lag breaks read-your-writes; sharding by a poor key creates hot shards and painful cross-shard joins/transactions. Resharding is the nightmare — consistent hashing and a routing/directory layer make rebalancing survivable." },
  26: { simple: "Object storage is an infinite bucket of files, each with a unique key and web address.",
       deep: "Flat key namespace, no in-place edits, eventual-then-strong read-after-write consistency (modern S3). Lifecycle policies tier to cold storage; multipart upload handles huge objects; pair with a CDN and presigned URLs for secure, fast delivery." },
  27: { simple: "Split a giant file into blocks, scatter copies across many machines so nothing is lost if one dies.",
       deep: "A namenode/master holds metadata (a SPOF to protect via HA); blocks are replicated (or erasure-coded for space). Data-locality scheduling moves compute to the data. The master's memory bounds file/block count — small-files problem is real." },
  28: { simple: "Data too big for one computer, so an army of machines chews through it together.",
       deep: "Batch (MapReduce/Spark) maximizes throughput; streaming (Flink/Kafka Streams) minimizes latency with windowing and watermarks for late data. The lambda/kappa debate is about whether to maintain one pipeline or two; shuffle is usually the cost center." },

  // --- Performance ---
  29: { simple: "A cache is a sticky note of answers you've already worked out, so you don't redo the work.",
       deep: "Cache-aside is common but races on concurrent misses (stampede — fix with locks/early recompute). Invalidation is the hard problem: TTL vs write-through vs event-based busting. Watch hot keys, thundering herds, and consistency windows." },
  30: { simple: "A queue is a to-do list between a fast producer and a slower worker, so neither has to wait.",
       deep: "Delivery is usually at-least-once → consumers must be idempotent; ordering is only per-partition. Backpressure, dead-letter queues, visibility timeouts, and consumer-lag monitoring are the operational essentials; exactly-once is mostly a marketing word." },
  31: { simple: "Concurrency juggles many tasks by switching fast; parallelism actually does them at the same time.",
       deep: "I/O-bound work loves async/event loops on one core; CPU-bound work needs real parallelism (processes/threads, minding the GIL in Python). Beware races, deadlocks, and false sharing; prefer immutability and message-passing over shared mutable state." },
  32: { simple: "An index is a book's table of contents — jump straight to the row instead of reading every page.",
       deep: "B-tree indexes serve range + equality; hash indexes only equality; composite-index column order and selectivity decide if it's even used. Indexes slow writes and bloat storage; covering indexes avoid table lookups. Read the query plan, don't guess." },

  // --- Reliability ---
  33: { simple: "Keep a spare ready so if the main server dies, a backup takes over before users notice.",
       deep: "Heartbeats + consensus prevent split-brain (two primaries). Failover isn't free: replication lag means possible data loss (RPO) and promotion takes time (RTO). Measure availability honestly — dependencies multiply, so 99.9% × 99.9% < 99.9%." },
  34: { simple: "Take regular snapshots so you can rewind to a good state after a disaster.",
       deep: "RPO (data you can lose) and RTO (time to recover) drive the strategy and cost. Full + incremental + WAL/log shipping minimize loss; the only real backup is a tested restore. Keep copies off-region and immutable to survive ransomware/bad deploys." },
  35: { simple: "If a whole data center burns down, traffic flips to another region and the app stays up.",
       deep: "Strategies climb in cost/readiness: backup-restore → pilot light → warm standby → active-active. Global routing (DNS/anycast) shifts traffic; the catch is data — async replication risks loss, sync replication costs latency. Run game-days or it won't work when it counts." },

  // --- Security ---
  36: { simple: "Authentication proves WHO you are; authorization decides WHAT you're allowed to do.",
       deep: "OAuth2/OIDC delegate identity; RBAC/ABAC scale permissions. Tokens should be short-lived with rotating refresh; enforce authZ at every layer (don't trust the client or the gateway alone). Least privilege and per-resource checks prevent IDOR/privilege escalation." },
  37: { simple: "Scramble data so only the right person can read it — both while it travels and while it's stored.",
       deep: "TLS secures transit; envelope encryption + a KMS handles at-rest keys with rotation. Symmetric (AES-GCM) for bulk, asymmetric for key exchange/signatures. Passwords: bcrypt/argon2 with per-user salts — never reversible encryption. The key, not the cipher, is the weak point." },
  38: { simple: "Build walls and checkpoints around your systems so attackers can't just walk in.",
       deep: "Defense-in-depth: VPC segmentation, security groups, private subnets, WAF, and least-privilege IAM. Assume breach — minimize blast radius, log everything, rotate secrets, and patch continuously. Rate limiting + DDoS scrubbing absorb volumetric attacks." },

  // --- Blueprint ---
  39: { simple: "A simple recipe for any design question: clarify, sketch, dive deep, then weigh trade-offs.",
       deep: "Drive the interview: pin functional + non-functional requirements and scale numbers first, because they justify every later choice. Time-box the high-level design, then deep-dive the one or two genuinely hard components and own the trade-offs out loud." },

  // --- URL Shortener ---
  40: { simple: "First, agree on exactly what the link shortener should do before drawing anything.",
       deep: "Separate must-haves (shorten, redirect) from nice-to-haves (custom alias, expiry, analytics). State scale targets and the read:write ratio early — they decide caching, storage, and code-generation strategy." },
  41: { simple: "Do the napkin math: way more clicks than new links, so make redirects blazing fast.",
       deep: "Reads dominate ~10:1+, so the redirect path is the hot path → cache aggressively and keep lookups O(1). 62^7 ≈ 3.5T codes is plenty; storage is tiny per row but billions of rows need partitioning and a cheap KV store." },
  42: { simple: "Two endpoints: one to create a short code, one to redirect it to the long URL.",
       deep: "Counter+base62 guarantees uniqueness (no collision checks) but needs a distributed ID source (range allocation / Snowflake); hashing risks collisions and needs retries. Return 301 (cacheable) vs 302 (lets you count clicks) — a real trade-off." },
  43: { simple: "Pick the tools: a fast key-value store, a cache for popular links, and abuse protection.",
       deep: "KV store (DynamoDB/Redis) for O(1) by code; cache hot links; CDN for geo reach. Pre-allocate ID ranges per app server to avoid a write bottleneck; add rate limiting and bot detection on the shorten endpoint to stop spam/malware links." },
  44: { simple: "Put it all together: create codes on write, serve redirects from cache, log clicks in the background.",
       deep: "Write path: ID → base62 → KV. Read path: cache → KV → 301. Analytics via async event stream (Kafka) so clicks never block redirects. Multi-region replication + a global anycast edge keep redirects fast and available worldwide." },

  // --- Ticketing ---
  45: { simple: "Define a system to browse shows and book seats — and never sell the same seat twice.",
       deep: "The defining constraint is correctness under contention, not raw scale. Split the problem: browsing (read-heavy, cacheable, AP-friendly) vs booking (write-heavy, contended, needs strong consistency)." },
  46: { simple: "Figure out where it strains: browsing is easy to scale, but seat-grabbing is a war zone.",
       deep: "At on-sale, contention concentrates on a few hot rows at the same millisecond — that single seat-lock path, plus the payment dependency, is the bottleneck. Everything else (catalog) is cacheable and trivially horizontal." },
  47: { simple: "Lock a seat for a few minutes while you pay; if you bail, it goes back on sale.",
       deep: "Services: catalog, inventory, booking, payment, notification. A TTL lock (Redis SETNX + expiry) reserves a seat during checkout; a virtual waiting room throttles the stampede. Confirmation must be transactional and idempotent end-to-end." },
  48: { simple: "Choose tools that guarantee one buyer per seat even with a million people clicking at once.",
       deep: "Distributed lock (Redlock caveats) or DB row lock / SELECT FOR UPDATE for atomic reservation; idempotency keys make payment retries safe. Relational DB for booking integrity, cache for catalog, queue + waiting room to flatten the spike." },
  49: { simple: "The finished design: cached browsing, a locked-and-idempotent booking pipeline, fair queuing.",
       deep: "Browse via CDN+cache; book via lock → idempotent payment → transactional confirm; waiting room for fairness; async notifications. Multi-AZ DB with replication for durability. The whole art is isolating the strongly-consistent core from the scalable read path." },

  // --- Bonus ---
  50: { simple: "Make an action safe to repeat — clicking 'pay' twice still charges you once.",
       deep: "An idempotency key + a processed-keys store (with the stored response) dedupes retries; scope keys per operation and expire them. Essential under at-least-once delivery and client retries. The store itself must be consistent or the guarantee leaks." },
  51: { simple: "A group of servers votes to pick one leader so they all agree on what's true.",
       deep: "Raft/Paxos achieve agreement with a majority quorum and survive minority failures; the leader serializes writes, followers replicate the log. Liveness needs randomized election timeouts to avoid split votes; you trade availability for consistency under partition." },
  52: { simple: "A tiny memory trick that can say 'definitely not here' or 'maybe here' — never wrong about absence.",
       deep: "k hash functions set bits in an array; false-positive rate ≈ (1−e^(−kn/m))^k, tuned by m and k. No deletes (use a counting variant). Used as a cheap gatekeeper before expensive disk/network lookups (e.g. SSTable reads)." },
  53: { simple: "Cap how often someone can call you, so one user can't overwhelm the system.",
       deep: "Token bucket allows bursts up to capacity; sliding-window-log is precise but memory-heavy; sliding-window-counter approximates cheaply. Distributed limiting needs a shared atomic store (Redis Lua) and a policy for clock skew and the limiter being down." },
  54: { simple: "If a service keeps failing, stop calling it for a bit — fail fast instead of hanging.",
       deep: "Closed → Open on an error/latency threshold → Half-Open trials recovery. Pair with timeouts, bounded retries (with jitter), and bulkheads so one sick dependency can't exhaust threads and cascade. Without it, retries amplify an outage into a meltdown." },
};

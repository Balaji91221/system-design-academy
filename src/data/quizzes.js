// ============================================================================
//  SECTION CHECKPOINT QUIZZES — keyed by section index (0..12, matching the
//  curriculum order). Each section has 5 MCQs: { q, options, answer, explain }
//  where `answer` is the index of the correct option. Score >= 80% passes.
// ============================================================================

export const PASS_RATIO = 0.8;

export const QUIZZES = {
  // 0 — Networking & Communication
  0: { title: "Networking & Communication", questions: [
    { q: "How many bits is an IPv4 address?", options: ["16", "32", "64", "128"], answer: 1,
      explain: "IPv4 is 32 bits (four 0–255 octets); IPv6 is 128 bits." },
    { q: "What does DNS primarily do?", options: ["Encrypt traffic", "Balance load", "Map names to IPs", "Cache images"], answer: 2,
      explain: "DNS resolves human-readable domain names to IP addresses." },
    { q: "A reverse proxy primarily protects…", options: ["Clients", "Backend servers", "DNS resolvers", "The CDN"], answer: 1,
      explain: "A reverse proxy fronts and shields backend servers (TLS, LB, caching)." },
    { q: "Which load-balancing layer can route by URL path?", options: ["L2", "L3", "L4", "L7"], answer: 3,
      explain: "L7 is application-aware and can route on path/header/cookie; L4 only sees IP/port." },
    { q: "A CDN's main benefit is…", options: ["Stronger consistency", "Lower latency via edge caching", "Cheaper writes", "Schema flexibility"], answer: 1,
      explain: "CDNs serve cached assets from edges near the user, cutting round-trip time." },
  ] },

  // 1 — Protocols
  1: { title: "Protocols", questions: [
    { q: "Which protocol guarantees ordered, reliable delivery?", options: ["UDP", "TCP", "IP", "ICMP"], answer: 1,
      explain: "TCP is connection-oriented with ordering and retransmission; UDP is not." },
    { q: "An HTTP 4xx status code means…", options: ["Success", "Redirect", "Client error", "Server error"], answer: 2,
      explain: "4xx = client error, 5xx = server error, 2xx = success, 3xx = redirect." },
    { q: "Which HTTP method is NOT naturally idempotent?", options: ["GET", "PUT", "DELETE", "POST"], answer: 3,
      explain: "POST typically creates a new resource each call; GET/PUT/DELETE are idempotent." },
    { q: "Best fit for instant two-way chat updates?", options: ["Polling", "WebSockets", "Plain REST", "Cron"], answer: 1,
      explain: "WebSockets give a persistent full-duplex channel for instant messaging." },
    { q: "gRPC is best suited for…", options: ["Public browser APIs", "Internal service-to-service calls", "Static files", "DNS"], answer: 1,
      explain: "gRPC (protobuf over HTTP/2) shines for fast, typed internal RPC." },
  ] },

  // 2 — Architectural Patterns
  2: { title: "Architectural Patterns", questions: [
    { q: "In layered architecture, a layer should talk to…", options: ["Any layer", "Only the layer below it", "Only the UI", "The database directly"], answer: 1,
      explain: "Each layer depends on the one directly beneath it for clean separation." },
    { q: "A core rule of microservices is that each service…", options: ["Shares one database", "Owns its own data", "Runs in one process", "Skips APIs"], answer: 1,
      explain: "Services own their data and ship independently — no shared DB." },
    { q: "When should you usually start microservices?", options: ["Day one", "Never", "After a monolith genuinely hurts", "Only for static sites"], answer: 2,
      explain: "Start monolith-first; extract services when team/scale pain is real." },
    { q: "In event-driven systems, producers…", options: ["Call consumers directly", "Know all subscribers", "Don't know who listens", "Block on responses"], answer: 2,
      explain: "Producers emit events; consumers subscribe independently (loose coupling)." },
    { q: "Event delivery is usually…", options: ["Exactly-once for free", "At-least-once", "At-most-once always", "Never retried"], answer: 1,
      explain: "At-least-once is the common default, so consumers must be idempotent." },
  ] },

  // 3 — Web Concepts
  3: { title: "Web Concepts", questions: [
    { q: "A JWT is attractive because it…", options: ["Is easy to revoke", "Lets servers stay stateless", "Stores data server-side", "Needs a shared DB"], answer: 1,
      explain: "A signed JWT carries claims, so any server validates it without a shared store." },
    { q: "Which cookie flag blocks JavaScript access?", options: ["Secure", "SameSite", "HttpOnly", "Path"], answer: 2,
      explain: "HttpOnly prevents JS access (XSS mitigation); Secure forces HTTPS." },
    { q: "Protobuf vs JSON: Protobuf is…", options: ["More human-readable", "Compact and fast", "Schema-free", "Slower to parse"], answer: 1,
      explain: "Protobuf is compact binary and fast; JSON is readable but verbose." },
    { q: "CORS is enforced by…", options: ["The server's firewall", "The database", "The browser", "The OS kernel"], answer: 2,
      explain: "CORS is a browser-enforced policy protecting users — not server-side auth." },
    { q: "Serialization converts…", options: ["Bytes to electricity", "Objects to bytes and back", "SQL to NoSQL", "HTTP to TCP"], answer: 1,
      explain: "Serialize = object→bytes for transport/storage; deserialize reverses it." },
  ] },

  // 4 — Scalability
  4: { title: "Scalability", questions: [
    { q: "Vertical scaling means…", options: ["More machines", "A bigger machine", "More regions", "More caches"], answer: 1,
      explain: "Vertical = scale up (bigger box); horizontal = scale out (more boxes)." },
    { q: "Horizontal scaling requires services to be…", options: ["Stateful", "Stateless", "Single-threaded", "Monolithic"], answer: 1,
      explain: "Statelessness lets any instance serve any request behind a balancer." },
    { q: "Which algorithm best preserves cache locality on resize?", options: ["Round-robin", "Random", "Consistent hashing", "FIFO"], answer: 2,
      explain: "Consistent hashing minimizes key remapping when the pool changes." },
    { q: "Autoscaling reacts to signals like…", options: ["Disk color", "CPU / request rate / queue depth", "DNS TTL", "Cookie size"], answer: 1,
      explain: "Scale-out/in rules trigger on metrics such as CPU, QPS, or queue depth." },
    { q: "The usual bottleneck behind elastic app tiers is…", options: ["The load balancer", "The database", "The CDN", "DNS"], answer: 1,
      explain: "Stateless app tiers scale easily; the database is the hard part." },
  ] },

  // 5 — Storage
  5: { title: "Storage & Databases", questions: [
    { q: "Under a network partition, CAP forces a choice between…", options: ["Cost & speed", "Consistency & Availability", "SQL & NoSQL", "Reads & writes"], answer: 1,
      explain: "Partition tolerance is mandatory, so you trade C vs A during a partition." },
    { q: "Which is a good fit for ACID transactions?", options: ["Cassandra", "PostgreSQL", "S3", "Redis pub/sub"], answer: 1,
      explain: "Relational DBs like PostgreSQL provide ACID guarantees." },
    { q: "Sharding splits data by…", options: ["Time of day", "A key (range or hash)", "User color", "Random nodes only"], answer: 1,
      explain: "Sharding partitions a dataset across machines by a shard key." },
    { q: "Replication primarily improves…", options: ["Write throughput only", "Read scaling and failover", "Schema flexibility", "Cache size"], answer: 1,
      explain: "Followers serve reads and enable failover; the leader takes writes." },
    { q: "Object storage (e.g. S3) is best for…", options: ["Row-level transactions", "Unstructured blobs at scale", "Joins", "Low-latency RAM cache"], answer: 1,
      explain: "Object stores hold files/media/backups cheaply and durably at scale." },
  ] },

  // 6 — Performance
  6: { title: "Performance", questions: [
    { q: "A cache 'miss' means…", options: ["Data served from cache", "Fall through to the slow source", "The cache crashed", "A write failed"], answer: 1,
      explain: "A miss falls through to the source, then (usually) populates the cache." },
    { q: "A cache stampede is caused by…", options: ["Too much RAM", "A hot key expiring under load", "Low traffic", "Strong consistency"], answer: 1,
      explain: "When a hot key expires, many requests miss at once and hammer the DB." },
    { q: "A message queue mainly provides…", options: ["Stronger joins", "Producer/consumer decoupling", "Lower storage cost", "Schema validation"], answer: 1,
      explain: "Queues decouple producers from consumers and absorb spikes." },
    { q: "For CPU-bound work you want…", options: ["Concurrency on one core", "True parallelism on many cores", "More DNS lookups", "A bigger cache"], answer: 1,
      explain: "CPU-bound work needs real parallelism; I/O-bound work loves concurrency." },
    { q: "A database index turns a scan into roughly…", options: ["O(n²)", "O(n)", "O(log n)", "O(1) always"], answer: 2,
      explain: "A B-tree index gives O(log n) lookups instead of an O(n) full scan." },
  ] },

  // 7 — Reliability
  7: { title: "Reliability & DR", questions: [
    { q: "Heartbeats are used to…", options: ["Encrypt data", "Detect failure for failover", "Balance load", "Shard data"], answer: 1,
      explain: "Heartbeats detect a dead primary so a standby can be promoted." },
    { q: "RPO measures…", options: ["Time to recover", "Acceptable data loss", "Request rate", "Replica count"], answer: 1,
      explain: "RPO = how much data you can lose; RTO = how fast you must recover." },
    { q: "'99.99% availability' is about…", options: ["52 min downtime/year", "52 hours/year", "Zero downtime", "Daily reboots"], answer: 0,
      explain: "Four nines ≈ 52 minutes of downtime per year." },
    { q: "Multi-region DR shifts traffic on outage via…", options: ["A bigger CPU", "Global DNS / load balancing", "A new schema", "More indexes"], answer: 1,
      explain: "Global DNS/anycast reroutes users to a healthy region." },
    { q: "The only trustworthy backup is one that…", options: ["Is encrypted", "Has been test-restored", "Is large", "Runs hourly"], answer: 1,
      explain: "Untested backups fail when needed — restore drills are essential." },
  ] },

  // 8 — Security
  8: { title: "Security", questions: [
    { q: "Authentication answers…", options: ["What may you do?", "Who are you?", "Where are you?", "When did you log in?"], answer: 1,
      explain: "AuthN = identity (who); AuthZ = permissions (what you may do)." },
    { q: "How should passwords be stored?", options: ["Plaintext", "Reversible encryption", "Salted slow hash (bcrypt/argon2)", "Base64"], answer: 2,
      explain: "Hash with a slow, salted algorithm — never plaintext or reversible crypto." },
    { q: "Which secures data in transit?", options: ["AES at rest", "TLS/HTTPS", "A firewall", "A VPC"], answer: 1,
      explain: "TLS encrypts data in transit; at-rest encryption protects stored data." },
    { q: "'Least privilege' means each component gets…", options: ["All access", "Only the access it needs", "No access", "Admin access"], answer: 1,
      explain: "Grant the minimum access required to limit blast radius." },
    { q: "Databases in production should usually live in…", options: ["A public subnet", "A private subnet", "The CDN", "The browser"], answer: 1,
      explain: "Keep databases in private subnets, unreachable directly from the internet." },
  ] },

  // 9 — Blueprint
  9: { title: "The Design Blueprint", questions: [
    { q: "The first step of the 4-step framework is…", options: ["Deep dive", "Clarify requirements & scale", "Trade-offs", "Draw the database"], answer: 1,
      explain: "Pin functional needs + scale numbers first — they justify later choices." },
    { q: "High-level design should produce…", options: ["Final code", "Boxes-and-arrows of components", "A marketing plan", "A test suite"], answer: 1,
      explain: "Step 2 sketches the major components and how they connect." },
    { q: "Scale estimates matter because they…", options: ["Impress the panel", "Justify every later decision", "Replace the design", "Are optional"], answer: 1,
      explain: "QPS/data numbers drive caching, storage, and scaling choices." },
    { q: "In the deep dive you focus on…", options: ["Every component equally", "The one or two hard components", "The UI colors", "The logo"], answer: 1,
      explain: "Spend time on the genuinely hard/bottleneck components." },
    { q: "The final step discusses…", options: ["Trade-offs & failure modes", "Salary", "The README", "Fonts"], answer: 0,
      explain: "Step 4 covers bottlenecks, scaling, failure modes, and alternatives." },
  ] },

  // 10 — URL Shortener
  10: { title: "Design: URL Shortener", questions: [
    { q: "A URL shortener's traffic is mostly…", options: ["Write-heavy", "Read-heavy", "Evenly split", "Batch only"], answer: 1,
      explain: "Far more redirects (reads) than new links (writes) — optimize reads." },
    { q: "Which code-gen avoids collisions entirely?", options: ["Random hashing", "Counter + base62", "UUID truncation", "Timestamp prefix"], answer: 1,
      explain: "A monotonic counter encoded in base62 is collision-free by construction." },
    { q: "Best store for O(1) code→URL lookups?", options: ["A graph DB", "A key-value store", "A full-text index", "A message queue"], answer: 1,
      explain: "A KV store gives fast O(1) lookups by short code." },
    { q: "To keep redirects fast you should…", options: ["Skip caching", "Cache hot links + use a CDN", "Add more joins", "Use 500 errors"], answer: 1,
      explain: "Cache the hot read path and serve globally via a CDN." },
    { q: "Click analytics should be…", options: ["Synchronous on redirect", "Async via a queue", "Skipped", "Stored in the URL"], answer: 1,
      explain: "Log clicks asynchronously so redirects never wait on analytics." },
  ] },

  // 11 — Ticketing
  11: { title: "Design: Ticketing", questions: [
    { q: "The defining hard requirement is…", options: ["Pretty UI", "Never double-book a seat", "Fast signup", "Cheap storage"], answer: 1,
      explain: "Correctness under contention (no double-booking) is the core challenge." },
    { q: "Seats are reserved during checkout with…", options: ["A permanent flag", "A short-TTL lock", "A daily batch job", "An email"], answer: 1,
      explain: "A TTL lock holds the seat and auto-releases if checkout is abandoned." },
    { q: "Idempotency keys ensure…", options: ["Faster reads", "No double-charge on retry", "Smaller payloads", "More shards"], answer: 1,
      explain: "A retried payment with the same key yields exactly one charge." },
    { q: "Browsing the catalog is best served by…", options: ["Row locks", "CDN + cache", "A distributed lock", "A queue only"], answer: 1,
      explain: "Browsing is read-heavy and cacheable — front it with CDN + cache." },
    { q: "A virtual waiting room exists to…", options: ["Sell ads", "Flatten the on-sale spike fairly", "Store seats", "Encrypt data"], answer: 1,
      explain: "It throttles and orders the stampede so the core stays healthy." },
  ] },

  // 12 — Bonus
  12: { title: "Bonus: Advanced Concepts", questions: [
    { q: "Idempotency means running an op twice…", options: ["Doubles the effect", "Has the same effect as once", "Fails", "Is forbidden"], answer: 1,
      explain: "Idempotent operations are safe to retry — the effect happens once." },
    { q: "Raft elects a leader using…", options: ["The fastest CPU", "A majority quorum vote", "Random always", "DNS"], answer: 1,
      explain: "A candidate winning a majority quorum becomes leader and serializes writes." },
    { q: "A Bloom filter can say…", options: ["Definitely present", "'Definitely not' or 'maybe'", "Exact counts", "Nothing useful"], answer: 1,
      explain: "No false negatives: 'definitely not present' or 'maybe present'." },
    { q: "A token bucket allows…", options: ["No bursts", "Controlled bursts up to capacity", "Unlimited requests", "Only one request ever"], answer: 1,
      explain: "Tokens refill steadily; bursts are allowed up to the bucket capacity." },
    { q: "A circuit breaker that is OPEN will…", options: ["Retry forever", "Fail fast without calling", "Cache responses", "Shard the DB"], answer: 1,
      explain: "OPEN rejects instantly (fail fast) to stop cascading failure." },
  ] },
};

// ============================================================================
//  FLASHCARDS — quick recall pairs for spaced-repetition review. Each is a
//  short prompt (front) and a tight answer (back), tagged by topic.
// ============================================================================

export const FLASHCARDS = [
  { id: "f1", topic: "Networking", front: "What does DNS do?", back: "Translates human-readable domain names into IP addresses, walking a cache hierarchy (browser → resolver → root → TLD → authoritative)." },
  { id: "f2", topic: "Networking", front: "Forward vs reverse proxy?", back: "Forward proxy shields clients (hides who's calling); reverse proxy shields servers (TLS termination, LB, caching, single front door)." },
  { id: "f3", topic: "Protocols", front: "TCP vs UDP in one line each?", back: "TCP: reliable, ordered, connection-oriented (handshake + ACKs). UDP: fast, connectionless, no delivery guarantee (live video, games, DNS)." },
  { id: "f4", topic: "Protocols", front: "HTTP status code families?", back: "2xx success · 3xx redirect · 4xx client error · 5xx server error." },
  { id: "f5", topic: "Load Balancing", front: "L4 vs L7 load balancing?", back: "L4 routes on IP/port (fast, opaque). L7 inspects HTTP to route by path/header/cookie and can retry, do sticky sessions, etc." },
  { id: "f6", topic: "Caching", front: "Cache hit vs miss?", back: "Hit = served fast from cache. Miss = fall through to the slow source, then populate the cache for next time." },
  { id: "f7", topic: "Caching", front: "Hardest problem in caching?", back: "Invalidation — keeping cached data fresh. Plus stampedes on hot-key expiry and choosing TTL vs write-through vs event-based busting." },
  { id: "f8", topic: "Databases", front: "ACID vs BASE?", back: "ACID (SQL): Atomic, Consistent, Isolated, Durable. BASE (NoSQL): Basically Available, Soft state, Eventually consistent." },
  { id: "f9", topic: "Databases", front: "Replication vs sharding?", back: "Replication: copies of the same data (read scaling + failover). Sharding: splitting different data across machines by a key (write/storage scaling)." },
  { id: "f10", topic: "Databases", front: "Why add a database index?", back: "Turns O(n) full-table scans into O(log n) lookups (B-tree). Costs extra write time and storage, so index selectively." },
  { id: "f11", topic: "CAP", front: "What does CAP force you to choose?", back: "Under a network partition: Consistency OR Availability. Partition tolerance is non-negotiable in real networks." },
  { id: "f12", topic: "Scalability", front: "Vertical vs horizontal scaling?", back: "Vertical = bigger machine (simple, hard ceiling, SPOF). Horizontal = more machines + load balancer (scales out, needs statelessness)." },
  { id: "f13", topic: "Messaging", front: "Default delivery guarantee of queues?", back: "At-least-once — messages may be duplicated, so consumers must be idempotent. Ordering is only per-partition." },
  { id: "f14", topic: "Reliability", front: "Circuit breaker states?", back: "Closed (normal) → Open (fail fast after too many errors) → Half-Open (let one trial request test recovery)." },
  { id: "f15", topic: "Reliability", front: "RPO vs RTO?", back: "RPO = how much data you can afford to lose (backup frequency). RTO = how fast you must be back up (recovery speed)." },
  { id: "f16", topic: "Security", front: "Authentication vs authorization?", back: "Authentication = who you are (login). Authorization = what you may do (roles/permissions). AuthN first, then AuthZ." },
  { id: "f17", topic: "Security", front: "How to store passwords?", back: "Hash with a slow, salted algorithm (bcrypt/argon2), unique salt per user. Never plaintext or reversible encryption." },
  { id: "f18", topic: "Idempotency", front: "What is idempotency and why care?", back: "Running an operation twice has the same effect as once. Lets clients safely retry (payments, at-least-once delivery) without duplicates." },
  { id: "f19", topic: "Rate Limiting", front: "How does a token bucket work?", back: "Tokens refill at a steady rate up to a capacity; each request spends one; empty bucket → reject (HTTP 429). Allows bursts." },
  { id: "f20", topic: "Consensus", front: "How is a leader elected in Raft?", back: "Nodes vote; a candidate winning a majority quorum becomes leader and serializes writes. New election if its heartbeat stops." },
  { id: "f21", topic: "Bloom Filter", front: "What can a Bloom filter tell you?", back: "'Definitely not present' or 'maybe present' — no false negatives, possible false positives. Tiny memory; gatekeeps expensive lookups." },
  { id: "f22", topic: "CDN", front: "What does a CDN optimize?", back: "Latency — serves cached static assets from an edge near the user. Origin is hit only on a miss or to revalidate." },
  { id: "f23", topic: "APIs", front: "When pick gRPC over REST?", back: "Internal service-to-service calls needing speed and strong typing: binary protobuf over HTTP/2 with streaming, ~7x smaller than JSON." },
  { id: "f24", topic: "Architecture", front: "When to use microservices?", back: "When a monolith genuinely hurts (team/scale). Each service owns one capability + its data. Cost: distributed data, ops, observability." },
  { id: "f25", topic: "Design", front: "The 4-step design framework?", back: "1) Clarify requirements + scale. 2) High-level design. 3) Deep-dive the hard component. 4) Discuss trade-offs & bottlenecks." },
];

export const FLASHCARD_TOPICS = [...new Set(FLASHCARDS.map((c) => c.topic))].sort();

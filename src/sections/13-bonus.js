// Section 13 — Bonus: Advanced Concepts Most Courses Skip
export default {
  sec: "Bonus — Advanced Concepts Most Courses Skip", color: "#ff9ec4",
  lessons: [
    { id: "idempotent", title: "Idempotency", anim: "idempotent",
      what: "Making an operation safe to retry — running it twice has the same effect as once.",
      points: [
        "Clients retry on timeouts; without idempotency you get duplicate charges/orders.",
        "Attach a unique idempotency key; the server records processed keys and dedupes.",
        "Essential for payments, 'at-least-once' message delivery, and webhooks.",
        "GET/PUT/DELETE are naturally idempotent; POST usually isn't without a key.",
      ],
      use: "Stripe requires an idempotency key on charge requests. If your network drops and you retry, Stripe sees the same key and returns the original result — the customer is charged exactly once.",
      code: `processed = {}   # idempotency_key -> result

def charge(idem_key, amount):
    if idem_key in processed:
        return processed[idem_key]       # retry returns the same result
    result = {"charged": amount, "id": len(processed) + 1}
    processed[idem_key] = result
    return result

print(charge("key-A1", 50))   # {'charged': 50, 'id': 1}
print(charge("key-A1", 50))   # same result — not charged twice` },
    { id: "consensus", title: "Consensus & Leader Election", anim: "consensus",
      what: "How distributed nodes agree on a single source of truth.",
      points: [
        "Algorithms like Raft and Paxos let nodes agree despite failures.",
        "A leader is elected by majority vote (quorum) and handles writes.",
        "If the leader dies, a new election picks a replacement automatically.",
        "Underpins distributed databases, config stores, and lock services.",
      ],
      use: "etcd (which powers Kubernetes) uses Raft: one node is elected leader to serve writes; if it crashes, the remaining nodes elect a new leader within seconds, keeping the cluster consistent.",
      code: `def elect_leader(votes, total_nodes):
    needed = total_nodes // 2 + 1       # majority quorum
    tally = {}
    for v in votes:
        tally[v] = tally.get(v, 0) + 1
        if tally[v] >= needed:
            return f"{v} elected with {tally[v]}/{total_nodes}"
    return "no quorum — re-election"

print(elect_leader(["n1", "n1", "n2", "n1"], total_nodes=5))
# n1 elected with 3/5` },
    { id: "bloom", title: "Bloom Filters", anim: "bloom",
      what: "A tiny probabilistic structure that says 'definitely not present' or 'maybe present'.",
      points: [
        "Uses a bit array + several hash functions — extremely memory-efficient.",
        "No false negatives: if it says absent, it's truly absent.",
        "Possible false positives: 'maybe present' must be verified.",
        "Great for skipping expensive lookups when an item is likely missing.",
      ],
      use: "Databases like Cassandra use Bloom filters to avoid disk reads: before hitting an SSTable on disk, the filter says 'this key is definitely not here', saving a costly I/O on most negative lookups.",
      code: `import hashlib

class BloomFilter:
    def __init__(self, size=64, k=3):
        self.size, self.k, self.bits = size, k, 0

    def _positions(self, item):
        for i in range(self.k):
            h = hashlib.md5(f"{item}{i}".encode()).hexdigest()
            yield int(h, 16) % self.size

    def add(self, item):
        for b in self._positions(item):
            self.bits |= (1 << b)

    def __contains__(self, item):          # "maybe" or "definitely not"
        return all(self.bits & (1 << b) for b in self._positions(item))

bf = BloomFilter(); bf.add("alice")
print("alice" in bf, "bob" in bf)   # True False (no false negatives)` },
    { id: "ratelimit", title: "Rate Limiting", anim: "ratelimit",
      what: "Capping how many requests a client can make in a time window.",
      points: [
        "Token bucket: tokens refill steadily; each request spends one; empty = rejected.",
        "Alternatives: leaky bucket, fixed/sliding window counters.",
        "Protects against abuse, runaway clients, and accidental thundering herds.",
        "Usually enforced at the API gateway, often backed by Redis for distributed counts.",
      ],
      use: "Twitter's API limits you to N requests per 15 minutes. A token bucket per API key tracks usage; once you're out of tokens, you get HTTP 429 until they refill — protecting the platform from overload.",
      code: `import time

class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate, self.capacity = rate, capacity
        self.tokens, self.last = capacity, time.time()

    def allow(self):
        now = time.time()
        self.tokens = min(self.capacity,
                          self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False           # empty bucket -> HTTP 429

bucket = TokenBucket(rate=1, capacity=5)
print([bucket.allow() for _ in range(7)])  # 5x True, then False` },
    { id: "breaker", title: "Circuit Breaker Pattern", anim: "breaker",
      what: "Stop hammering a failing dependency; fail fast and recover gracefully.",
      points: [
        "Closed = normal. Too many errors → Open (reject instantly without calling).",
        "After a cooldown → Half-Open: allow one trial request to test recovery.",
        "Prevents one slow/dead service from cascading into a full outage.",
        "Libraries: Hystrix, Resilience4j, and most service meshes implement it.",
      ],
      use: "If Netflix's recommendation service starts timing out, a circuit breaker trips and the app instantly shows a default row instead of hanging — the failure is contained and playback stays responsive.",
      code: `import time

class CircuitBreaker:
    def __init__(self, threshold=3, cooldown=30):
        self.threshold, self.cooldown = threshold, cooldown
        self.failures, self.opened_at, self.state = 0, 0, "CLOSED"

    def call(self, fn):
        if self.state == "OPEN":
            if time.time() - self.opened_at < self.cooldown:
                raise RuntimeError("circuit OPEN — failing fast")
            self.state = "HALF_OPEN"          # let one trial through
        try:
            result = fn()
            self.failures, self.state = 0, "CLOSED"
            return result
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state, self.opened_at = "OPEN", time.time()
            raise` },
  ],
};

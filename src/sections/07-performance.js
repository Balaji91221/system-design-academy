// Section 7 — Performance: Concepts, Tools & Techniques
export default {
  sec: "Performance — Concepts, Tools & Techniques", color: "#f0a868",
  lessons: [
    { id: "cache", title: "Caching for Speed Optimization", anim: "cache",
      what: "Store expensive results so you don't recompute them.",
      points: [
        "Hit = served from fast memory; miss = fall through to the slow source, then store.",
        "Layers: browser → CDN → app cache (Redis/Memcached) → DB query cache.",
        "Strategies: cache-aside, write-through, write-back; eviction via LRU/LFU + TTL.",
        "Hard parts: invalidation, stale data, and cache stampedes.",
      ],
      use: "Twitter caches popular tweets and timelines in Redis. When a celebrity tweets, millions read it from cache in milliseconds instead of hammering the database — the single biggest latency lever.",
      code: `from functools import lru_cache

@lru_cache(maxsize=128)        # automatic cache-aside
def expensive(n):
    print("computing", n)      # only runs on a cache MISS
    return n * n

print(expensive(4))   # computing 4 -> 16
print(expensive(4))   # 16  (served from cache, no recompute)` },
    { id: "queue", title: "Messaging & Queues for Decoupling", anim: "queue",
      what: "A buffer that decouples producers from consumers and absorbs spikes.",
      points: [
        "Producers drop messages; consumers pull when ready — fully asynchronous.",
        "Smooths traffic bursts, enables retries, and isolates slow downstream services.",
        "Patterns: work queues, pub/sub, dead-letter queues for failures.",
        "Backed by Kafka, RabbitMQ, AWS SQS, Google Pub/Sub.",
      ],
      use: "When you upload a video to YouTube, the request returns instantly; a message goes on a queue and transcoding workers process it in the background. The upload isn't blocked by the slow encoding step.",
      code: `import threading, queue

q = queue.Queue()

def consumer():
    while (job := q.get()) is not None:   # pulls when ready
        print("processing", job)
        q.task_done()

threading.Thread(target=consumer, daemon=True).start()
for i in range(3):
    q.put(i)         # producer drops work and moves on
q.join()             # wait for all jobs to be processed` },
    { id: "concur", title: "Concurrency & Parallelism", anim: "concur",
      what: "Two different ways of doing more than one thing at once.",
      points: [
        "Concurrency: structuring work as independent tasks, interleaved on one core.",
        "Parallelism: actually running tasks simultaneously on multiple cores/machines.",
        "Concurrency is about dealing with many things; parallelism is about doing many things.",
        "Watch for race conditions, deadlocks, and the need for locks/atomic ops.",
      ],
      use: "A web server uses concurrency to juggle thousands of slow client connections on a few threads (async I/O). A video encoder uses parallelism to process different chunks of footage on different CPU cores at once.",
      code: `import asyncio

# Concurrency: interleave many I/O-bound tasks on one thread
async def fetch(n):
    await asyncio.sleep(1)        # simulate slow I/O
    return n

async def main():
    # All three run concurrently -> ~1s total, not 3s
    return await asyncio.gather(fetch(1), fetch(2), fetch(3))

print(asyncio.run(main()))   # [1, 2, 3]` },
    { id: "index", title: "Database Performance Optimization", anim: "index",
      what: "Making queries fast as data grows.",
      points: [
        "Indexes (usually B-trees) turn full-table scans into O(log n) lookups.",
        "Indexes speed reads but cost extra writes and storage — index selectively.",
        "Also: query optimization, denormalization, connection pooling, read replicas.",
        "Use EXPLAIN to see the query plan and find missing indexes.",
      ],
      use: "An e-commerce site adds an index on product category so 'show all electronics' returns instantly instead of scanning millions of rows. Without it, that query would slow down every page that uses it.",
      code: `rows = [{"id": i, "email": f"u{i}@x.com"} for i in range(1_000_000)]

# Without an index: O(n) full scan
def scan(email):
    return next(r for r in rows if r["email"] == email)

# With an index: O(1) hash lookup
index = {r["email"]: r for r in rows}
print(index["u42@x.com"])    # instant — no scan` },
  ],
};

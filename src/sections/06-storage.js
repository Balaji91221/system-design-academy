// Section 6 — Storage: Database & Storage
export default {
  sec: "Storage — Database & Storage", color: "#48d6c0",
  lessons: [
    { id: "cap", title: "Storage in System Design + CAP Theorem", anim: "cap",
      what: "The fundamental trade-off in any distributed data store.",
      points: [
        "Consistency: every read sees the latest write. Availability: every request gets a response.",
        "Partition tolerance is mandatory in real networks, so the real choice is C vs. A under a partition.",
        "CP systems (etcd, HBase) refuse some requests to stay correct.",
        "AP systems (Cassandra, DynamoDB) stay up but may serve stale data briefly.",
      ],
      use: "A bank's ledger chooses consistency (CP) — better to reject a transaction than show a wrong balance. A social media 'like' counter chooses availability (AP) — a slightly stale count is fine, downtime isn't.",
      code: `# Under a network partition you must choose C or A
def handle_read(partitioned, mode):
    if partitioned and mode == "CP":
        raise RuntimeError("refuse read to stay consistent")  # CP
    if partitioned and mode == "AP":
        return "possibly stale value"                         # AP
    return "fresh value"

print(handle_read(True, "AP"))   # possibly stale value
# handle_read(True, "CP")        # raises — sacrifices availability` },
    { id: "sqlnosql", title: "Database Models: SQL vs. NoSQL", anim: "sqlnosql",
      what: "Two families of databases for different data shapes and scale.",
      points: [
        "SQL (relational): structured tables, fixed schema, powerful JOINs, ACID guarantees.",
        "NoSQL: flexible documents/key-value/column/graph models; scales out horizontally.",
        "SQL excels at complex queries and transactional integrity.",
        "NoSQL excels at huge scale, flexible schemas, and high write throughput.",
      ],
      use: "A bank uses PostgreSQL (SQL) for accounts where transactions and integrity are non-negotiable. Instagram uses Cassandra (NoSQL) for the feed, where massive write volume and horizontal scale matter most.",
      code: `import sqlite3

# SQL: structured, fixed schema, transactional
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT)")
db.execute("INSERT INTO users(name) VALUES (?)", ("Ada",))
db.commit()
print(db.execute("SELECT name FROM users WHERE id=1").fetchone())

# NoSQL (document): flexible, schemaless
doc_store = {}
doc_store["user:1"] = {"name": "Ada", "tags": ["admin"]}  # any shape` },
    { id: "shardrep", title: "Advanced DB: Sharding, Replication & Polyglot", anim: "shardrep",
      what: "Techniques to scale databases beyond one machine.",
      points: [
        "Replication: copy data to followers for read scaling and failover (leader takes writes).",
        "Sharding: split one dataset across machines by a key (range or hash).",
        "Polyglot persistence: use the right database per use case in one system.",
        "Hard parts: replication lag, cross-shard queries, rebalancing, hot shards.",
      ],
      use: "Uber uses polyglot persistence: relational DBs for trips, Redis for geospatial lookups, and sharded stores for scale. Trip data is sharded by city so each shard handles only its region's load.",
      code: `import hashlib

SHARDS = ["shard-A", "shard-B", "shard-C"]

def route(key):
    # Hash the key to pick a shard deterministically
    h = int(hashlib.md5(key.encode()).hexdigest(), 16)
    return SHARDS[h % len(SHARDS)]

print(route("alice"))   # always lands on the same shard
print(route("marco"))` },
    { id: "object", title: "Object Storage in Modern Systems", anim: "object",
      what: "Storing unstructured blobs (files, media, backups) at massive scale.",
      points: [
        "Flat namespace of buckets and objects, each with a unique key and URL.",
        "Cheap, virtually infinite, highly durable (often 11 nines), but higher latency than disk.",
        "Not a filesystem — no in-place edits; you replace whole objects.",
        "Often fronted by a CDN for fast global delivery.",
      ],
      use: "Dropbox and Netflix store files and video on object storage like Amazon S3. Each upload becomes an object with a key; S3 handles durability and scale while a CDN serves it quickly worldwide.",
      code: `# Object storage: a flat key -> blob namespace, each with a URL
bucket = {}

def put(key, data): bucket[key] = data
def get(key): return bucket[key]
def url(key): return f"https://cdn.example.com/{key}"

put("img/01.jpg", b"<bytes>")           # no in-place edit; replace whole object
print(url("img/01.jpg"))                # https://cdn.example.com/img/01.jpg` },
    { id: "dfs", title: "File Systems and Distributed Storage", anim: "dfs",
      what: "Storing huge files across many machines reliably.",
      points: [
        "Big files are split into fixed-size blocks spread across nodes.",
        "Each block is replicated (e.g. 3×) so node failures don't lose data.",
        "A master/namenode tracks where blocks live; clients read in parallel.",
        "Foundational for big-data processing frameworks.",
      ],
      use: "Hadoop HDFS stores petabytes of logs by chopping files into blocks across a cluster, each replicated three times. Spark jobs then read those blocks in parallel for fast analytics.",
      code: `# Split a big file into blocks, replicate each across nodes
def split_and_replicate(data, block=4, replicas=3, nodes=5):
    blocks = [data[i:i + block] for i in range(0, len(data), block)]
    placement = {i: [(i + r) % nodes for r in range(replicas)]
                 for i in range(len(blocks))}
    return blocks, placement

blocks, placement = split_and_replicate(b"systemdesign")
print(placement)   # {0: [0,1,2], 1: [1,2,3], 2: [2,3,4]}` },
    { id: "bigdata", title: "Big Data Fundamentals", anim: "bigdata",
      what: "Processing data too large or fast for a single machine.",
      points: [
        "The 3 Vs: Volume (size), Velocity (speed), Variety (formats).",
        "Batch processing (Hadoop, Spark) crunches large datasets periodically.",
        "Stream processing (Kafka, Flink) handles data in real time as it arrives.",
        "MapReduce pattern: map → shuffle → reduce across a cluster.",
      ],
      use: "Spotify analyzes billions of listening events to build Discover Weekly. Streaming pipelines ingest plays in real time, while batch jobs run nightly over the full history to train recommendation models.",
      code: `from collections import Counter
from functools import reduce

# MapReduce word count: map -> shuffle -> reduce
docs = ["the cat sat", "the dog ran", "the cat ran"]

mapped = [Counter(d.split()) for d in docs]            # map
total = reduce(lambda a, b: a + b, mapped, Counter())  # reduce
print(total.most_common(2))   # [('the', 3), ('cat', 2)]` },
  ],
};

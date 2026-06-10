// Section 11 — Design a URL Shortener (TinyURL)
export default {
  sec: "Design a URL Shortener (TinyURL)", color: "#48d6c0",
  lessons: [
    { id: "blueprint", title: "Understanding the Problem & Scope", anim: "blueprint",
      what: "Define what the URL shortener must (and must not) do.",
      points: [
        "Core: take a long URL, return a short code; redirect the code to the original.",
        "Decide on custom aliases, expiration, and analytics as optional features.",
        "Clarify scale: how many URLs created/day and redirects/sec (read-heavy).",
        "Non-functional: low-latency redirects, high availability, short codes.",
      ],
      use: "Bit.ly turns a 200-character marketing link into bit.ly/3xYz. Step one is agreeing on exactly this scope before designing anything — what features are in, what scale to target.",
      code: `from dataclasses import dataclass, field

@dataclass
class Requirements:
    functional: list = field(default_factory=lambda: [
        "shorten(long_url) -> code",
        "redirect(code) -> long_url",
    ])
    non_functional: list = field(default_factory=lambda: [
        "low-latency redirects", "high availability", "read-heavy",
    ])

print(Requirements().functional)` },
    { id: "urlshort", title: "Estimating Scale & Identifying Bottlenecks", anim: "urlshort",
      what: "Back-of-envelope math to find the pressure points.",
      points: [
        "Reads ≫ writes (every share creates one URL but many clicks) — optimize redirects.",
        "A 7-char base62 code yields 62⁷ ≈ 3.5 trillion unique URLs.",
        "Storage is small per record but adds up over billions of links.",
        "The redirect path must be cached to stay fast under heavy read load.",
      ],
      use: "If you expect 100M new URLs/month and 10× that in redirects, the bottleneck is clearly the read path — so you design around an aggressive cache in front of the key-value store.",
      code: `# 100M new URLs/month, 10x reads -> find the bottleneck
writes = 100_000_000
reads = writes * 10
write_qps = writes / (30 * 86_400)
read_qps = reads / (30 * 86_400)

print(f"write {write_qps:.0f}/s, read {read_qps:.0f}/s")  # read dominates
print("62**7 =", 62 ** 7, "possible 7-char codes")` },
    { id: "urlshort", title: "High-Level Design: Services, APIs & Communication", anim: "urlshort",
      what: "The components and the contract between them.",
      points: [
        "API: POST /shorten (long→code), GET /{code} (redirect).",
        "Code generation: hash, counter+base62, or a key-generation service.",
        "Store the code→URL mapping in a fast key-value DB.",
        "Front the read path with a cache for hot links.",
      ],
      use: "The write API hashes the long URL into a short code and stores the mapping; the read API looks the code up (cache first, DB second) and issues an HTTP 301 redirect to the original URL.",
      code: `import string

ALPHABET = string.digits + string.ascii_letters   # base62

def to_base62(n):
    code = ""
    while n:
        n, r = divmod(n, 62)
        code = ALPHABET[r] + code
    return code or "0"

# Turn a unique auto-increment id into a short code
print(to_base62(125_000_000))   # 'eL8s' style short code` },
    { id: "urlshort", title: "Making Tech & Infra Decisions", anim: "urlshort",
      what: "Choosing concrete technologies and trade-offs.",
      points: [
        "Key-value store (Redis/DynamoDB) for O(1) lookups by code.",
        "Cache (Redis) for the hottest links; CDN for geographic reach.",
        "Handle collisions (retry/regenerate) and ensure code uniqueness.",
        "Add rate limiting to prevent abuse of the shorten endpoint.",
      ],
      use: "You pick DynamoDB for the mapping (scales horizontally, predictable latency), Redis to cache trending links, and a counter-based code generator to avoid hash collisions entirely.",
      code: `import string
ALPHABET = string.digits + string.ascii_letters
store, cache = {}, {}
counter = iter(range(1, 10 ** 9))   # counter avoids hash collisions

def shorten(long_url):
    code = _b62(next(counter))
    store[code] = long_url
    return code

def resolve(code):
    if code in cache:               # hot links served from cache
        return cache[code]
    cache[code] = store.get(code)   # miss -> KV store, then cache it
    return cache[code]

def _b62(n):
    s = ""
    while n: n, r = divmod(n, 62); s = ALPHABET[r] + s
    return s or "0"` },
    { id: "urlshort", title: "The Final Design — URL Shortener", anim: "urlshort",
      what: "Putting all the pieces together into one coherent system.",
      points: [
        "Client → API gateway → shorten/redirect services → cache → KV store.",
        "Redirects served from cache in milliseconds; misses fall to the KV store.",
        "Optional analytics pipeline logs clicks asynchronously via a queue.",
        "Multi-region + replication for availability and low global latency.",
      ],
      use: "The finished TinyURL: write path generates and stores codes; read path is a cache-fronted KV lookup returning a 301; an async event stream powers click analytics — fast, scalable, and highly available.",
      code: `class TinyURL:
    A = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def __init__(self):
        self.store, self.cache, self.n = {}, {}, 0

    def shorten(self, long_url):
        self.n += 1
        code = self._b62(self.n)
        self.store[code] = long_url
        return f"tiny.cc/{code}"

    def redirect(self, code):
        if code not in self.cache:           # cache miss -> KV store
            self.cache[code] = self.store.get(code)
        return self.cache[code]              # 301 to the original URL

    def _b62(self, n):
        s = ""
        while n: n, r = divmod(n, 62); s = self.A[r] + s
        return s or "0"

t = TinyURL()
short = t.shorten("https://example.com/very/long/path")
print(short, "->", t.redirect(short.split("/")[-1]))` },
  ],
};

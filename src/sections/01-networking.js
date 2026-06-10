// Section 1 — Networking & Communication
export default {
  sec: "Networking & Communication", color: "#7aa2f7",
  lessons: [
    { id: "ip", title: "Understanding IP Addresses", anim: "ip",
      what: "Every device on a network needs a unique address so packets know where to go.",
      points: [
        "IPv4 = 32 bits, written as four 0–255 octets (e.g. 192.168.1.42); ~4.3 billion addresses, now exhausted.",
        "IPv6 = 128 bits, vastly larger space, written in hex groups.",
        "Public IPs are globally routable; private ranges (10.x, 192.168.x) live behind NAT.",
        "Split into network portion + host portion via a subnet mask (CIDR like /24).",
      ],
      use: "When you deploy a server on AWS, it gets a private IP inside your VPC and (optionally) a public IP. Load balancers, security groups, and routing tables all operate on these addresses to decide what can talk to what.",
      code: `import ipaddress

net = ipaddress.ip_network("192.168.1.0/24")
print(net.network_address)    # 192.168.1.0
print(net.broadcast_address)  # 192.168.1.255
print(net.num_addresses)      # 256

ip = ipaddress.ip_address("192.168.1.42")
print(ip in net)              # True
print(ip.is_private)          # True` },
    { id: "dns", title: "How DNS Works", anim: "dns",
      what: "The phonebook of the internet — turns human names into machine IP addresses.",
      points: [
        "Resolution walks a cache hierarchy: browser → OS → ISP resolver → root → TLD → authoritative nameserver.",
        "TTL controls how long each answer is cached; low TTL = faster failover but more lookups.",
        "Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification).",
        "Geo-DNS and weighted records let you route users to the nearest or healthiest region.",
      ],
      use: "Netflix uses DNS to send you to the closest edge cluster. During a regional outage, they update DNS so your device resolves the domain to a healthy region instead — failover without you noticing.",
      code: `import socket

# Resolve a hostname using the OS resolver chain
host = "example.com"
print(host, "->", socket.gethostbyname(host))

# A domain can map to many IPs (load distribution / failover)
for info in socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP):
    print(info[4][0])` },
    { id: "cs", title: "Client–Server Model", anim: "cs",
      what: "The request/response loop underneath every networked app.",
      points: [
        "Client initiates (browser, mobile app, another service); server listens, processes, responds.",
        "Communication is stateless by default — each request stands alone unless you add sessions/tokens.",
        "Servers are typically long-running and handle many clients concurrently.",
        "Everything else (load balancers, caches, queues) is a smarter way to scale this one loop.",
      ],
      use: "Opening Instagram: your app (client) sends a request to Instagram's servers for your feed; the server queries databases, assembles the response, and sends back JSON your app renders into posts.",
      code: `import socket

# Minimal TCP server: listen, accept, respond
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    print("listening on :9000")
    conn, addr = srv.accept()        # blocks until a client connects
    with conn:
        request = conn.recv(1024).decode()
        conn.sendall(b"HTTP/1.1 200 OK\\r\\n\\r\\nHello")` },
    { id: "proxy", title: "Forward Proxy vs. Reverse Proxy", anim: "proxy",
      what: "Two kinds of middlemen — one protects clients, one protects servers.",
      points: [
        "Forward proxy sits in front of clients: hides their identity, filters/caches outbound traffic (corporate proxies, VPNs).",
        "Reverse proxy sits in front of servers: hides the backend, terminates TLS, load-balances, caches responses.",
        "A reverse proxy is the front door to most production systems.",
        "Nginx, HAProxy, Envoy, and Cloudflare commonly play the reverse-proxy role.",
      ],
      use: "Cloudflare is a giant reverse proxy: it sits in front of millions of sites, absorbs DDoS attacks, caches static content, and handles HTTPS — so the origin servers only see clean, reduced traffic.",
      code: `import requests

# A reverse proxy forwards client requests to a hidden backend
BACKENDS = ["http://10.0.0.1", "http://10.0.0.2"]

def reverse_proxy(path, i=0):
    backend = BACKENDS[i % len(BACKENDS)]
    resp = requests.get(backend + path,
                        headers={"X-Forwarded-For": "client-ip"})
    return resp.status_code, resp.text` },
    { id: "lb", title: "Introduction to Load Balancing", anim: "lb",
      what: "A traffic cop that spreads requests across many identical servers.",
      points: [
        "Algorithms: round-robin, least-connections, IP-hash (sticky sessions), weighted.",
        "Operates at L4 (TCP, fast) or L7 (HTTP, content-aware routing).",
        "Health checks automatically remove dead servers from the pool.",
        "It's what makes horizontal scaling real and enables zero-downtime deploys.",
      ],
      use: "Amazon on Prime Day routes billions of requests through Elastic Load Balancers that fan out across thousands of servers, pulling unhealthy instances out instantly so checkout never goes down.",
      code: `from itertools import cycle

class RoundRobinBalancer:
    def __init__(self, servers):
        self.pool = cycle(servers)

    def next_server(self):
        return next(self.pool)

lb = RoundRobinBalancer(["s1", "s2", "s3"])
print([lb.next_server() for _ in range(5)])
# ['s1', 's2', 's3', 's1', 's2']` },
    { id: "gw", title: "What is an API Gateway?", anim: "gw",
      what: "A single front door that routes to many backend microservices.",
      points: [
        "Centralizes cross-cutting concerns: authentication, rate limiting, logging, routing.",
        "Hides internal service topology — clients see one clean API.",
        "Can aggregate responses, translate protocols, and manage versioning.",
        "Different from a plain load balancer: it understands application-level routing and policy.",
      ],
      use: "When you use the Uber app, one API gateway authenticates you, rate-limits abusive callers, then routes to the trips service, pricing service, and maps service — the app never needs to know they're separate.",
      code: `# One entry point: authenticate, then route to the right service
ROUTES = {"/users": "user-svc", "/orders": "order-svc", "/pay": "pay-svc"}

def gateway(path, token):
    if not token:
        return 401, "unauthorized"
    service = ROUTES.get(path)
    if not service:
        return 404, "no route"
    return 200, f"routed to {service}"

print(gateway("/orders", token="abc"))  # (200, 'routed to order-svc')` },
    { id: "cdn", title: "Content Delivery Networks (CDN)", anim: "cdn",
      what: "Copies of your static content placed physically close to users.",
      points: [
        "Edge servers (PoPs) serve cached assets from the nearest location, cutting round-trip time.",
        "Origin is only hit on a cache miss or to revalidate stale content.",
        "Ideal for images, video, JS/CSS — anything not personalized per user.",
        "Latency is bounded by the speed of light; a CDN beats physics by moving data closer.",
      ],
      use: "YouTube serves video from CDN edges in your city. The original file might live in a US data center, but you stream from a cache a few miles away — that's why playback starts almost instantly.",
      code: `# Edge cache sitting in front of a far-away origin
origin = {"/logo.png": "<bytes>"}
edge_cache = {}

def get_asset(path):
    if path in edge_cache:        # HIT — served from a nearby edge
        return "HIT", edge_cache[path]
    data = origin[path]           # MISS — fetch from origin once
    edge_cache[path] = data
    return "MISS", data

print(get_asset("/logo.png")[0])  # MISS
print(get_asset("/logo.png")[0])  # HIT` },
  ],
};

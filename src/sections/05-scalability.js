// Section 5 — Scalability
export default {
  sec: "Scalability", color: "#9ece6a",
  lessons: [
    { id: "scaling", title: "Scaling Strategies: Horizontal, Vertical & Diagonal", anim: "scaling",
      what: "Three ways to handle more load.",
      points: [
        "Vertical (scale up): bigger machine. Simple, but a hard ceiling + single point of failure.",
        "Horizontal (scale out): more machines behind a load balancer. Near-limitless, needs statelessness.",
        "Diagonal: scale up first (cheap, easy), then scale out when you hit the box's limit.",
        "Most systems scale the stateless tier horizontally and the database vertically until they shard.",
      ],
      use: "A startup first upgrades to a bigger database server (vertical). As traffic grows, they add identical web servers behind a load balancer (horizontal) — the diagonal path most companies actually take.",
      code: `# Horizontal scaling: spread work across identical stateless workers
from multiprocessing import Pool

def handle(request):
    return request * request

if __name__ == "__main__":
    with Pool(processes=4) as workers:   # more workers = scale out
        print(workers.map(handle, range(8)))
        # [0, 1, 4, 9, 16, 25, 36, 49]` },
    { id: "lb", title: "Load Balancers: Types, Algorithms & Cloud Solutions", anim: "lb",
      what: "A deeper look at how load balancers distribute and protect traffic.",
      points: [
        "L4 (transport) balancers are fast and protocol-agnostic; L7 (application) route by URL/header/cookie.",
        "Algorithms: round-robin, least-connections, weighted, IP-hash for stickiness.",
        "Cloud options: AWS ALB/NLB, GCP Load Balancing, Azure Load Balancer.",
        "Health checks + auto-removal of bad nodes are what keep the pool healthy.",
      ],
      use: "AWS Application Load Balancer routes /api/* to one service and /images/* to another based on URL (L7), while a Network Load Balancer handles millions of raw TCP connections for a gaming backend (L4).",
      code: `class LeastConnections:
    def __init__(self, servers):
        self.conns = {s: 0 for s in servers}

    def acquire(self):
        s = min(self.conns, key=self.conns.get)  # fewest active conns
        self.conns[s] += 1
        return s

    def release(self, s):
        self.conns[s] -= 1

lb = LeastConnections(["s1", "s2", "s3"])
print(lb.acquire(), lb.acquire(), lb.acquire())  # s1 s2 s3` },
    { id: "autoscale", title: "Autoscaling & Best Practices in the Cloud", anim: "autoscale",
      what: "Automatically adding/removing capacity as load changes.",
      points: [
        "Scale-out rules trigger on metrics (CPU, request rate, queue depth).",
        "Scale-in removes idle instances to save cost when traffic drops.",
        "Combine with stateless services so any instance can be added/killed safely.",
        "Set sensible min/max bounds and cooldowns to avoid thrashing.",
      ],
      use: "Disney+ autoscales before a big premiere: as concurrent viewers spike, new servers spin up automatically; hours later when traffic falls, they're terminated — you only pay for what you use.",
      code: `def desired_instances(cpu, cur, low=0.3, high=0.7, lo=1, hi=10):
    if cpu > high:
        return min(hi, cur + 1)    # scale out under load
    if cpu < low:
        return max(lo, cur - 1)    # scale in when idle
    return cur                     # within band -> hold (avoid thrashing)

print(desired_instances(0.85, cur=2))  # 3
print(desired_instances(0.10, cur=2))  # 1` },
  ],
};

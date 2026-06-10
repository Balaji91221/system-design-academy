// Section 8 — Reliability, Availability & Disaster Recovery
export default {
  sec: "Reliability, Availability & Disaster Recovery", color: "#9ece6a",
  lessons: [
    { id: "ha", title: "High Availability, Fault Tolerance & Failover", anim: "ha",
      what: "Keeping a system running despite component failures.",
      points: [
        "Eliminate single points of failure with redundancy at every layer.",
        "Heartbeats detect failure; failover promotes a standby automatically.",
        "Availability is measured in nines (99.99% ≈ 52 min downtime/year).",
        "Fault tolerance means the system keeps working even mid-failure.",
      ],
      use: "Databases like PostgreSQL run a primary plus hot standbys. If the primary's heartbeat stops, a standby is promoted within seconds — apps reconnect and keep serving, often before users notice.",
      code: `import time

class Cluster:
    def __init__(self):
        self.primary, self.standby = "node-A", "node-B"
        self.last_beat = time.time()

    def heartbeat(self):
        self.last_beat = time.time()

    def check(self, timeout=5):
        if time.time() - self.last_beat > timeout:   # primary went silent
            self.primary, self.standby = self.standby, self.primary
            return f"failover -> {self.primary}"
        return "primary healthy"` },
    { id: "backup", title: "Backup & Recovery Strategies", anim: "backup",
      what: "Protecting data so you can restore after loss or corruption.",
      points: [
        "Full + incremental backups balance completeness against cost/time.",
        "RPO (Recovery Point Objective) = how much data you can afford to lose.",
        "RTO (Recovery Time Objective) = how fast you must be back up.",
        "Backups are worthless until tested — restore drills are essential.",
      ],
      use: "A SaaS company snapshots its database hourly to object storage in another region. If a bad migration corrupts data, they restore to the last good snapshot — bounded by their one-hour RPO.",
      code: `import copy, time

snapshots = []

def snapshot(db):
    snapshots.append((time.time(), copy.deepcopy(db)))  # point-in-time copy

def restore():
    return copy.deepcopy(snapshots[-1][1])  # roll back to last good state

db = {"balance": 100}
snapshot(db)
db["balance"] = -999          # corruption!
db = restore()
print(db["balance"])          # 100  (RPO = time since last snapshot)` },
    { id: "dr", title: "Disaster Recovery in Practice", anim: "dr",
      what: "Surviving the loss of an entire data center or region.",
      points: [
        "Multi-region deployments keep a warm/standby copy elsewhere.",
        "Strategies range from backup-and-restore to pilot-light to active-active.",
        "Global DNS/load balancing shifts traffic to a healthy region on failure.",
        "Cost rises with how 'hot' the standby is — pick based on RTO/RPO needs.",
      ],
      use: "When AWS has a regional outage, well-prepared companies fail over to another region: DNS reroutes users, the standby region's services take traffic, and the product stays up while one region is dark.",
      code: `REGIONS = {"us-east": "healthy", "eu-west": "healthy"}

def route_traffic(primary="us-east", standby="eu-west"):
    if REGIONS[primary] == "healthy":
        return primary
    return standby             # global DNS shifts traffic on outage

REGIONS["us-east"] = "outage"
print(route_traffic())        # eu-west` },
  ],
};

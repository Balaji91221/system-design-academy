// Section 12 — Design a Ticketing System (BookMyShow)
export default {
  sec: "Design a Ticketing System (BookMyShow)", color: "#bb9af7",
  lessons: [
    { id: "blueprint", title: "Understanding the Problem & Scope", anim: "blueprint",
      what: "Define a system to browse events and book seats.",
      points: [
        "Core: browse events/shows, view seat availability, book and pay.",
        "The hard requirement: never sell the same seat twice (no double-booking).",
        "Massive read traffic for browsing; spiky write traffic at on-sale moments.",
        "Strong consistency for seat booking; high availability for browsing.",
      ],
      use: "BookMyShow sells movie and concert tickets. The defining challenge is concurrency: when a blockbuster goes on sale, thousands grab the same seats at once — the design must guarantee one buyer per seat.",
      code: `from dataclasses import dataclass

@dataclass
class Seat:
    id: str
    status: str = "free"      # free | held | booked

@dataclass
class Show:
    name: str
    seats: dict               # seat_id -> Seat

show = Show("Concert",
            {f"{r}{n}": Seat(f"{r}{n}") for r in "AB" for n in range(1, 4)})
print(list(show.seats))       # ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']` },
    { id: "ticket", title: "Estimating Scale & Identifying Bottlenecks", anim: "ticket",
      what: "Find where the system will strain.",
      points: [
        "Browsing is read-heavy and cacheable; booking is write-heavy and contended.",
        "Hot events create extreme spikes on specific seat rows at the same instant.",
        "The seat-locking/checkout path is the critical bottleneck.",
        "Payment integration adds latency and must be handled reliably.",
      ],
      use: "For a Taylor Swift concert, millions hit one show simultaneously. Browsing scales easily with caching, but the seat-reservation step becomes the bottleneck where careful concurrency control is essential.",
      code: `# Hot on-sale: 1M users hit one show at t=0
concurrent_users = 1_000_000
seats = 50_000
contention = concurrent_users / seats     # buyers fighting per seat

print(f"{contention:.0f} buyers per seat at peak")   # 20
# Browsing is cacheable; the seat-lock path is the real bottleneck.` },
    { id: "ticket", title: "High-Level Design: Services, APIs & Communication", anim: "ticket",
      what: "The services and how booking flows through them.",
      points: [
        "Services: catalog (events), inventory (seats), booking, payment, notification.",
        "Seat reservation uses a temporary lock with a TTL during checkout.",
        "A queue/waiting room throttles traffic during extreme spikes.",
        "Booking confirmation is transactional and idempotent.",
      ],
      use: "You select a seat → booking service locks it for 10 minutes → you pay → on success the seat is confirmed; if you abandon, the lock expires and the seat returns to the pool for others.",
      code: `import time

locks = {}   # seat_id -> (user, expires_at)

def hold_seat(seat, user, ttl=600):
    now = time.time()
    held = locks.get(seat)
    if held and held[1] > now and held[0] != user:
        return False                  # someone else holds it
    locks[seat] = (user, now + ttl)   # lock with a TTL during checkout
    return True

print(hold_seat("A1", "ada"))   # True
print(hold_seat("A1", "bob"))   # False — no double-booking` },
    { id: "ticket", title: "Making Tech & Infra Decisions Strategically", anim: "ticket",
      what: "Concrete choices to guarantee correctness under load.",
      points: [
        "Distributed locks (Redis) or DB row locks to reserve seats atomically.",
        "Idempotency keys so a retried payment never double-charges or double-books.",
        "Relational DB for booking integrity; cache for the read-heavy catalog.",
        "A virtual waiting room/queue smooths the on-sale stampede.",
      ],
      use: "You use a Redis lock per seat with a TTL, idempotent payment processing, and a waiting-room queue. Even with a million simultaneous buyers, each seat is sold exactly once and no one is charged twice.",
      code: `import time, uuid

seen_keys = set()                 # idempotency: dedupe retried payments

def book(seat, user, idem_key, locks):
    if idem_key in seen_keys:
        return "already processed"            # safe to retry
    held = locks.get(seat)
    if not held or held[0] != user or held[1] < time.time():
        return "lock expired"
    seen_keys.add(idem_key)
    return "confirmed"

key = str(uuid.uuid4())
locks = {"A1": ("ada", time.time() + 60)}
print(book("A1", "ada", key, locks))   # confirmed
print(book("A1", "ada", key, locks))   # already processed` },
    { id: "ticket", title: "The Final Design — Ticketing System", anim: "ticket",
      what: "The complete, consistency-safe booking architecture.",
      points: [
        "Browse path: CDN + cache over the catalog service for huge read scale.",
        "Booking path: lock seat → process payment idempotently → confirm in a transaction.",
        "Waiting room + queue absorb spikes; async notifications confirm tickets.",
        "Multi-AZ databases and replication keep it available and durable.",
      ],
      use: "The finished BookMyShow: cached browsing for scale, a locked-and-idempotent booking pipeline for correctness, and a waiting room for fairness — handling concert-on-sale chaos without double-selling a single seat.",
      code: `import time

class Booking:
    def __init__(self):
        self.locks, self.booked, self.idem = {}, set(), set()

    def hold(self, seat, user, ttl=600):
        h = self.locks.get(seat)
        if h and h[1] > time.time() and h[0] != user:
            return False
        self.locks[seat] = (user, time.time() + ttl)
        return True

    def confirm(self, seat, user, idem_key):
        if idem_key in self.idem:              # idempotent
            return "duplicate -> same result"
        h = self.locks.get(seat)
        if not h or h[0] != user or h[1] < time.time():
            return "lock expired"
        self.booked.add(seat); self.idem.add(idem_key)
        return "booked"

b = Booking(); b.hold("A1", "ada")
print(b.confirm("A1", "ada", "k1"))   # booked
print(b.confirm("A1", "ada", "k1"))   # duplicate -> same result` },
  ],
};

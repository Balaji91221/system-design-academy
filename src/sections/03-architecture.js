// Section 3 — Architectural Patterns
export default {
  sec: "Architectural Patterns", color: "#f0a868",
  lessons: [
    { id: "tiers", title: "Software Architecture Patterns & Styles", anim: "tiers",
      what: "Common high-level structures for organizing a system.",
      points: [
        "Layered (n-tier): separate presentation, business logic, and data layers.",
        "Client-server, peer-to-peer, microkernel, and pipe-and-filter are other classic styles.",
        "Each style trades off simplicity, scalability, and coupling differently.",
        "The right pattern depends on team size, scale, and how parts must evolve.",
      ],
      use: "A traditional banking web app uses a layered architecture: a web UI layer, a transaction-processing logic layer, and a database layer — each can be maintained and secured independently.",
      code: `# Layered architecture: each layer only talks to the one below it
class DataLayer:
    def fetch(self, uid):                  # talks to the database
        return {"id": uid, "name": "Ada"}

class LogicLayer:
    def __init__(self, data): self.data = data
    def get_profile(self, uid):            # business rules
        u = self.data.fetch(uid)
        u["display"] = u["name"].upper()
        return u

class PresentationLayer:
    def __init__(self, logic): self.logic = logic
    def render(self, uid):                 # UI / response shaping
        return f"<h1>{self.logic.get_profile(uid)['display']}</h1>"

print(PresentationLayer(LogicLayer(DataLayer())).render(1))` },
    { id: "tiers", title: "Multi-Tier Architecture", anim: "tiers",
      what: "Physically separating an app into tiers that scale independently.",
      points: [
        "Typical 3-tier: presentation (web), application (logic), data (DB).",
        "Each tier runs on its own machines and scales to its own load.",
        "Tiers communicate over the network, improving security and isolation.",
        "You can scale the app tier horizontally while the DB tier scales vertically.",
      ],
      use: "An e-commerce site runs web servers, app servers, and database servers as separate tiers. On Black Friday they add more app servers without touching the database tier — independent scaling.",
      code: `# Each tier scales on its own, behind its own pool
class Tier:
    def __init__(self, name, instances):
        self.name, self.instances = name, instances
    def scale(self, n):
        self.instances = n
        return f"{self.name} -> {n} instances"

web = Tier("web", 4)
app = Tier("app", 8)
db  = Tier("db", 2)
print(app.scale(16))   # scale app tier without touching web or db` },
    { id: "micro", title: "Microservices Architecture", anim: "micro",
      what: "Splitting an app into small, independently deployable services.",
      points: [
        "Each service owns one business capability and its own data.",
        "Independent deploys, independent scaling, and per-service tech choices.",
        "Adds complexity: network calls, distributed data, observability, ops overhead.",
        "Start with a monolith; extract services when team/scale pain is real (Conway's Law).",
      ],
      use: "Netflix runs hundreds of microservices — separate ones for recommendations, billing, streaming, and user profiles. A bug in recommendations can't take down playback, and each team ships on its own schedule.",
      code: `# Independent services, each owning its data, talking over the network
class UserService:
    def get(self, uid):
        return {"id": uid, "name": "Ada"}

class OrderService:
    def __init__(self, users):      # depends on UserService
        self.users = users
    def place(self, uid, item):
        user = self.users.get(uid)
        return {"order": item, "for": user["name"]}

orders = OrderService(UserService())
print(orders.place(1, "book"))      # {'order': 'book', 'for': 'Ada'}` },
    { id: "eventdriven", title: "Event-Driven Architecture", anim: "eventdriven",
      what: "Services communicate by emitting and reacting to events, not direct calls.",
      points: [
        "Producers publish events to a bus/broker; consumers subscribe independently.",
        "Loose coupling: publishers don't know who (if anyone) is listening.",
        "Naturally async, resilient, and easy to extend with new consumers.",
        "Patterns: pub/sub, event sourcing, CQRS; backed by Kafka, RabbitMQ, SNS/SQS.",
      ],
      use: "When you place an order on Amazon, an 'order placed' event fires. Independently, the inventory service decrements stock, the email service sends a receipt, and analytics logs the sale — all reacting to one event.",
      code: `from collections import defaultdict

class EventBus:
    def __init__(self): self.subs = defaultdict(list)
    def subscribe(self, event, fn): self.subs[event].append(fn)
    def publish(self, event, data):
        for fn in self.subs[event]:     # publisher doesn't know who listens
            fn(data)

bus = EventBus()
bus.subscribe("order_placed", lambda d: print("email receipt:", d))
bus.subscribe("order_placed", lambda d: print("decrement stock:", d))
bus.publish("order_placed", {"id": 42})` },
  ],
};

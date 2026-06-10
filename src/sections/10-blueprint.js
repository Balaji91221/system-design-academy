// Section 10 — The System Design Blueprint
export default {
  sec: "The System Design Blueprint", color: "#7aa2f7",
  lessons: [
    { id: "blueprint", title: "The 4-Step System Design Approach", anim: "blueprint",
      what: "A repeatable framework for any design problem or interview.",
      points: [
        "1. Clarify requirements & scope — functional needs + scale estimates (users, QPS, data).",
        "2. High-level design — sketch the major components and how they connect.",
        "3. Deep dive — data models, APIs, and the critical/bottleneck components.",
        "4. Trade-offs — discuss bottlenecks, scaling, failure modes, and alternatives.",
      ],
      use: "Asked to 'design Twitter' in an interview: first nail down scope (tweets, timelines, scale), then sketch services and storage, then deep-dive the fan-out problem, then discuss trade-offs — a clear, structured answer.",
      code: `# Step 1: back-of-the-envelope estimation (requirements & scale)
def estimate(daily_active_users, actions_per_user):
    total = daily_active_users * actions_per_user
    qps = total / 86_400            # seconds in a day
    peak_qps = qps * 3              # traffic peaks ~3x average
    return {"qps": round(qps), "peak_qps": round(peak_qps)}

print(estimate(10_000_000, 20))    # {'qps': 2315, 'peak_qps': 6944}` },
  ],
};

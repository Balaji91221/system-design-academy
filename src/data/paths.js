// ============================================================================
//  LEARNING PATHS — curated, ordered sequences of concepts (by global `num`)
//  that form the "zero → mastery" spine. Each path targets an audience tier.
//  Concept numbering follows flattenCurriculum() (1..54).
// ============================================================================

export const PATHS = [
  {
    id: "beginner",
    icon: "🌱",
    title: "Absolute Beginner",
    tier: "Zero → Foundations",
    color: "#9ece6a",
    blurb: "Never built a system before? Start here. Plain-language intros to how the internet and apps actually work.",
    weeks: 6,
    concepts: [1, 2, 3, 9, 10, 5, 13, 24, 29, 20],
  },
  {
    id: "backend",
    icon: "🔧",
    title: "Backend Engineer",
    tier: "Practitioner",
    color: "#7aa2f7",
    blurb: "Level up on the day-to-day building blocks: protocols, architecture, databases, caching, and reliability.",
    weeks: 8,
    concepts: [8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 29, 30, 31, 33],
  },
  {
    id: "interview",
    icon: "🎯",
    title: "System Design Interview",
    tier: "Interview-Ready",
    color: "#f0a868",
    blurb: "A focused sprint to a confident interview: the 4-step framework, two full designs, and the high-frequency concepts.",
    weeks: 4,
    concepts: [39, 23, 25, 29, 30, 5, 6, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54],
  },
  {
    id: "devops",
    icon: "☁️",
    title: "DevOps & Cloud",
    tier: "Advanced",
    color: "#bb9af7",
    blurb: "Operate systems at scale: load balancing, autoscaling, high availability, disaster recovery, and security.",
    weeks: 6,
    concepts: [5, 20, 21, 22, 33, 34, 35, 36, 37, 38],
  },
];

export function pathProgress(path, doneSet) {
  const done = path.concepts.filter((n) => doneSet.has(n)).length;
  return { done, total: path.concepts.length, pct: Math.round((done / path.concepts.length) * 100) };
}

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { C } from "../theme.js";
import { CURRICULUM, flattenCurriculum } from "../data/curriculum.js";
import { useProgress } from "../context/ProgressContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import LessonView from "../components/LessonView.jsx";

// The Concept Library: the leveled, animated course. The active concept lives
// in the URL (/learn/:num) so lessons are shareable and the browser back/forward
// buttons work. Completion/bookmarks/depth come from global context.
export default function LibraryPage() {
  const { num } = useParams();
  const nav = useNavigate();
  const { doneSet } = useProgress();

  const flat = flattenCurriculum();
  const activeIdx = Math.min(flat.length - 1, Math.max(0, (parseInt(num, 10) || 1) - 1));
  const active = flat[activeIdx];

  const [query, setQuery] = useState("");
  const [openSecs, setOpenSecs] = useState(() => new Set(CURRICULUM.map((_, i) => i)));

  const go = (d) => {
    const n = Math.min(flat.length, Math.max(1, active.num + d));
    nav(`/learn/${n}`);
    document.getElementById("lesson-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleSec = (i) =>
    setOpenSecs((p) => { const s = new Set(p); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const secStats = CURRICULUM.map((s) => {
    const nums = flat.filter((l) => l.sec === s.sec).map((l) => l.num);
    return { total: nums.length, completed: nums.filter((n) => doneSet.has(n)).length };
  });

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <Sidebar
        flat={flat}
        query={query}
        setQuery={setQuery}
        activeNum={active.num}
        done={doneSet}
        openSecs={openSecs}
        secStats={secStats}
        onSelect={(idx) => nav(`/learn/${idx + 1}`)}
        onToggleSec={toggleSec}
      />
      <LessonView active={active} total={flat.length} activeIdx={activeIdx} onNavigate={go} />
    </div>
  );
}

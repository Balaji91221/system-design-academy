import React from "react";
import { C, mono } from "../theme.js";
import { heatmapWeeks } from "../lib/streaks.js";

// Color a cell by activity count (GitHub-style intensity ramp), using theme tokens.
function cellColor(count) {
  if (count <= 0) return C.panel2;
  if (count === 1) return `${C.green}55`;
  if (count === 2) return `${C.green}99`;
  if (count <= 4) return `${C.green}cc`;
  return C.green;
}

// A 12-week activity heatmap rendered as inline SVG (matching the app's SVG
// style). Cells are keyboard-focusable with a native title tooltip.
export default function Heatmap({ activity, weeks = 12 }) {
  const cols = heatmapWeeks(activity, weeks);
  const CELL = 13, GAP = 4, R = 3;
  const w = cols.length * (CELL + GAP);
  const h = 7 * (CELL + GAP);

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: w, display: "block" }} role="img" aria-label="12-week study activity heatmap">
        {cols.map((week, ci) =>
          week.map((cell, ri) => (
            <rect
              key={`${ci}-${ri}`}
              x={ci * (CELL + GAP)} y={ri * (CELL + GAP)}
              width={CELL} height={CELL} rx={R}
              fill={cellColor(cell.count)}
              stroke={cell.isToday ? C.teal : "transparent"} strokeWidth={cell.isToday ? 1.5 : 0}
            >
              <title>{cell.date}: {cell.count} {cell.count === 1 ? "activity" : "activities"}</title>
            </rect>
          ))
        )}
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontFamily: mono, fontSize: 10, color: C.faint }}>
        <span>less</span>
        {[0, 1, 2, 3, 5].map((n) => (
          <span key={n} style={{ width: 11, height: 11, borderRadius: 3, background: cellColor(n), display: "inline-block" }} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

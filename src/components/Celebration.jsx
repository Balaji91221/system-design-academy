import React, { useEffect, useState } from "react";
import { C } from "../theme.js";

const COLORS = [C.teal, C.blue, C.amber, C.green, C.purple, C.pink, C.yellow, C.red];

// A lightweight, dependency-free confetti burst. Render it with a changing
// `fire` key to replay; it spawns particles that fan out and fade, then clears.
// Deterministic spread (no Math.random reliance) so it looks tidy every time.
export default function Celebration({ fire }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!fire) return;
    const N = 28;
    const burst = Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2;
      const dist = 90 + (i % 5) * 26;          // staggered radii for a fuller burst
      return {
        id: `${fire}-${i}`,
        color: COLORS[i % COLORS.length],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 40,        // bias upward
        rot: (i % 2 ? 1 : -1) * (220 + i * 18),
        delay: (i % 6) * 18,
        size: 7 + (i % 3) * 3,
        square: i % 2 === 0,
      };
    });
    setParticles(burst);
    const t = setTimeout(() => setParticles([]), 1100);
    return () => clearTimeout(t);
  }, [fire]);

  if (!particles.length) return null;

  return (
    <div style={{ position: "absolute", left: "50%", top: 0, width: 0, height: 0, pointerEvents: "none", zIndex: 5 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.square ? 2 : "50%",
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            "--rot": `${p.rot}deg`,
            animation: `confettiFall .95s cubic-bezier(.2,.6,.3,1) ${p.delay}ms both`,
          }}
        />
      ))}
    </div>
  );
}

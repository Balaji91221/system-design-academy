import React, { useState, useRef, useEffect } from "react";
import { C, mono } from "../theme.js";
import { ANIM } from "../animations/index.js";
import { TickContext } from "../lib/animation.js";

// The visible span of the scrubber (animations loop within this window).
const DURATION = 12;
const SPEEDS = [0.5, 1, 2];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// AnimationFrame owns one rAF clock (ref-based, never restarts the loop), feeds
// the time to its animation via TickContext, and exposes play/pause, a seek
// scrubber, and a speed control. Defaults to paused under reduced-motion.
export default function AnimationFrame({ animKey }) {
  const Anim = ANIM[animKey] || (() => null);

  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [rate, setRate] = useState(1);
  const [t, setT] = useState(0);

  const st = useRef({ t: 0, prev: null });
  const playingRef = useRef(playing);
  const rateRef = useRef(rate);
  playingRef.current = playing;
  rateRef.current = rate;

  useEffect(() => {
    let raf;
    const loop = (n) => {
      const s = st.current;
      if (s.prev == null) s.prev = n;
      const dt = (n - s.prev) / 1000;
      s.prev = n;
      if (playingRef.current) {
        s.t += dt * rateRef.current;
        setT(s.t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = (frac) => {
    const nt = frac * DURATION;
    st.current.t = nt;
    setT(nt); // updates the frame even while paused
  };

  const pos = (((t % DURATION) + DURATION) % DURATION) / DURATION; // 0..1 within the loop

  return (
    <div className="animCard" style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", background: C.panel, boxShadow: "0 24px 60px -28px rgba(0,0,0,.7)" }}>
      {/* chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderBottom: `1px solid ${C.line}`, background: C.panel2 }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.red }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.yellow }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: C.green }} />
        <span style={{ marginLeft: 8, fontSize: 11, fontFamily: mono, color: C.faint, flex: 1 }}>
          ● live animation · {animKey}.svg
        </span>
      </div>

      {/* the animation, driven by our clock */}
      <TickContext.Provider value={{ t }}>
        <Anim />
      </TickContext.Provider>

      {/* transport controls: play/pause · scrubber · speed */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderTop: `1px solid ${C.line}`, background: C.panel2 }}>
        <button
          className="btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause animation" : "Play animation"}
          style={{ background: "transparent", border: `1px solid ${C.line}`, borderRadius: 6, color: C.dim, padding: "3px 10px", fontSize: 12, fontFamily: mono, cursor: "pointer", flexShrink: 0 }}
        >{playing ? "❚❚" : "▶"}</button>

        <span style={{ fontSize: 10, fontFamily: mono, color: C.faint, width: 30, flexShrink: 0 }}>{fmt(pos * DURATION)}</span>

        <input
          type="range" min="0" max="1000" value={Math.round(pos * 1000)}
          onChange={(e) => seek(Number(e.target.value) / 1000)}
          aria-label="Seek animation"
          className="scrub"
          style={{ flex: 1, accentColor: C.teal }}
        />

        <span style={{ fontSize: 10, fontFamily: mono, color: C.faint, width: 30, flexShrink: 0 }}>{fmt(DURATION)}</span>

        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {SPEEDS.map((sp) => (
            <button key={sp} className="btn" onClick={() => setRate(sp)} aria-pressed={rate === sp} style={{
              background: rate === sp ? `${C.teal}1a` : "transparent",
              border: `1px solid ${rate === sp ? C.teal : C.line}`, borderRadius: 6,
              color: rate === sp ? C.teal : C.dim, padding: "3px 7px", fontSize: 10.5, fontFamily: mono, cursor: "pointer",
            }}>{sp}x</button>
          ))}
        </div>
      </div>
    </div>
  );
}

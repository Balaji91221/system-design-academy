import React from "react";
import { C } from "../theme.js";

// Injects the fonts, custom scrollbar, keyframes, and micro-interaction styles
// used across the app. Kept in one place so the visual language is centralized.
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }

      /* ---- Custom scrollbar (WebKit) ---- */
      ::-webkit-scrollbar { width: 11px; height: 11px; }
      ::-webkit-scrollbar-track { background: ${C.panel2}; }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, ${C.blue}, ${C.teal});
        border-radius: 99px;
        border: 2px solid ${C.panel2};
        background-clip: padding-box;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, ${C.teal}, ${C.blue});
        background-clip: padding-box;
      }
      ::-webkit-scrollbar-corner { background: ${C.panel2}; }
      /* ---- Custom scrollbar (Firefox) ---- */
      * { scrollbar-width: thin; scrollbar-color: ${C.teal} ${C.panel2}; }

      /* ---- Sidebar: a slim, always-visible custom scroller ---- */
      .sidebar { scrollbar-width: thin; scrollbar-color: ${C.teal} transparent; }
      .sidebar::-webkit-scrollbar { width: 8px; }
      .sidebar::-webkit-scrollbar-track { background: transparent; }
      .sidebar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, ${C.teal}, ${C.blue});
        border-radius: 99px;
        border: none;
        background-clip: padding-box;
        transition: background .2s ease;
      }
      .sidebar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, ${C.blue}, ${C.teal});
        background-clip: padding-box;
      }

      /* ---- Keyframes ---- */
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn    { 0% { opacity: 0; transform: scale(.8); } 60% { transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes floatGlow {
        0%,100% { box-shadow: 0 0 0 0 ${C.teal}00, 0 6px 18px -6px ${C.blue}88; transform: translateY(0); }
        50%     { box-shadow: 0 0 22px 2px ${C.teal}55, 0 8px 22px -6px ${C.blue}aa; transform: translateY(-1.5px); }
      }
      @keyframes confettiFall {
        0%   { opacity: 1; transform: translate(0,0) rotate(0deg) scale(1); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(.4); }
      }
      @keyframes auroraDrift {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        50%     { transform: translate3d(0,-3%,0) scale(1.08); }
      }
      @keyframes borderFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }

      /* ---- Ambient background depth (site-wide) ---- */
      .aurora {
        position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
      }
      .aurora::before, .aurora::after {
        content: ""; position: absolute; border-radius: 50%; filter: blur(90px); opacity: .5;
        animation: auroraDrift 16s ease-in-out infinite;
      }
      .aurora::before { width: 60vw; height: 60vw; top: -22vw; right: -14vw; background: radial-gradient(circle, ${C.blue}33, transparent 62%); }
      .aurora::after  { width: 52vw; height: 52vw; bottom: -24vw; left: -14vw; background: radial-gradient(circle, ${C.teal}2e, transparent 62%); animation-delay: -8s; }

      /* ---- Entrance helpers ---- */
      .lessonEnter { animation: fadeInUp .5s cubic-bezier(.22,.8,.3,1) both; }
      .reveal { animation: fadeInUp .55s cubic-bezier(.22,.8,.3,1) both; }
      .page { animation: fadeInUp .5s cubic-bezier(.22,.8,.3,1) both; position: relative; z-index: 1; }
      .pop { animation: popIn .45s cubic-bezier(.22,1.2,.4,1) both; }

      /* ---- Reusable surfaces ---- */
      .gradText {
        background: linear-gradient(120deg, ${C.teal}, ${C.blue}, ${C.purple});
        -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      }
      .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }

      /* ---- Micro-interactions ---- */
      .navItem { transition: background .18s ease, transform .18s ease, border-color .18s ease; }
      .navItem:hover { background: ${C.panel} !important; transform: translateX(3px); }
      .secHdr { transition: background .18s ease; }
      .secHdr:hover { background: ${C.panel} !important; }
      .btn { transition: all .15s ease; }
      .btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
      .btn:active:not(:disabled) { transform: translateY(0) scale(.99); }
      .chk:hover { border-color: ${C.teal} !important; }
      .animCard { transition: box-shadow .28s ease, transform .28s ease, border-color .28s ease; position: relative; }
      .animCard:hover { transform: translateY(-3px); box-shadow: 0 30px 70px -28px rgba(0,0,0,.85); border-color: ${C.faint}; }
      .logoGlow { animation: floatGlow 3.4s ease-in-out infinite; }
      a { color: inherit; }
      ::selection { background: ${C.teal}44; }
      input { transition: border-color .18s ease, box-shadow .18s ease; }
      input:focus { border-color: ${C.teal} !important; box-shadow: 0 0 0 3px ${C.teal}22; }

      input::placeholder { color: ${C.faint}; }

      /* ---- Animation scrubber (range input) ---- */
      input[type="range"].scrub { -webkit-appearance: none; appearance: none; height: 5px; border-radius: 99px; background: ${C.line}; outline: none; cursor: pointer; }
      input[type="range"].scrub::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 13px; height: 13px; border-radius: 50%; background: ${C.teal}; border: 2px solid ${C.panel2}; cursor: pointer; }
      input[type="range"].scrub::-moz-range-thumb { width: 13px; height: 13px; border-radius: 50%; background: ${C.teal}; border: 2px solid ${C.panel2}; cursor: pointer; }
      input[type="range"].scrub:focus-visible { box-shadow: 0 0 0 3px ${C.teal}33; }

      @media (max-width: 820px) { .sidebar { display: none !important; } }

      /* ---- Respect reduced motion ---- */
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .lessonEnter, .reveal, .pop, .page, .logoGlow, .aurora::before, .aurora::after { animation: none !important; }
        * { transition-duration: .01ms !important; }
      }
    `}</style>
  );
}

"use client";
/**
 * Compare · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Drag anywhere, or focus the handle and use the arrow keys.
 */
import React, { useRef, useState } from "react";

/* A drawn landscape so the demo needs no image files. Swap in <img> for real use. */
function Scene() {
  return (
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#f6b27a 0%,#e58aa0 45%,#6b3a63 100%)" }}>
      <span className="absolute left-[62%] top-[22%] h-12 w-12 rounded-full" style={{ background: "#ffe7b8", boxShadow: "0 0 60px #ffd38a" }} />
      <span className="absolute inset-x-0 bottom-0 h-[62%]" style={{ background: "#4a2a4f", clipPath: "polygon(0 60%,18% 25%,34% 52%,52% 10%,70% 48%,86% 22%,100% 46%,100% 100%,0 100%)" }} />
      <span className="absolute inset-x-0 bottom-0 h-[40%]" style={{ background: "#2a1830", clipPath: "polygon(0 45%,22% 70%,40% 30%,62% 64%,80% 36%,100% 58%,100% 100%,0 100%)" }} />
    </div>
  );
}

export default function Compare() {
  const [x, setX] = useState(50);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => { const r = ref.current!.getBoundingClientRect(); setX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))); };
  const ease = drag ? "none" : "all .6s cubic-bezier(.16,1,.3,1)";

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
      <div ref={ref}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); move(e.clientX); }}
        onPointerMove={e => drag && move(e.clientX)} onPointerUp={() => setDrag(false)}
        className="relative h-[190px] w-full max-w-sm cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line2">
        <div className="absolute inset-0" style={{ filter: "grayscale(1) contrast(.85) brightness(1.05)" }}><Scene /></div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${x}%)`, transition: ease }}><Scene /></div>
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] text-white backdrop-blur">Before</span>
        <span className="absolute right-2.5 top-2.5 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] text-white backdrop-blur">After</span>
        <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${x}%`, transition: ease }}>
          <button role="slider" aria-label="Compare position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(x)}
            onKeyDown={e => { if (e.key === "ArrowLeft") setX(v => Math.max(0, v - 5)); if (e.key === "ArrowRight") setX(v => Math.min(100, v + 5)); }}
            className={`absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] bg-white text-black shadow-lg transition-transform duration-300 ${drag ? "scale-110" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="m9 7-5 5 5 5M15 7l5 5-5 5" /></svg>
          </button>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[0, 50, 100].map(v => (
          <button key={v} onClick={() => setX(v)} className={`h-7 rounded-md border px-2 font-mono text-[11px] transition-colors duration-300 ${Math.round(x) === v ? "border-ink text-ink" : "border-line2 text-ink3 hover:text-ink"}`}>
            {v === 0 ? "After" : v === 100 ? "Before" : "Split"}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";
/**
 * Ring · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Timer" | "Goals"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function Timer() {
  const [len, setLen] = useState(5 * 60);
  const [left, setLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft(l => (l <= 1 ? 0 : l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  const done = left === 0;
  const R = 70, C = 2 * Math.PI * R;
  const state = done ? "done, take five" : running ? "focusing" : left === len ? "ready" : "paused";
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--surface3)" strokeWidth="8" />
          <circle cx="80" cy="80" r={R} fill="none" stroke={done ? "var(--green)" : "var(--accent)"} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - left / len)} style={{ transition: "stroke-dashoffset 1s linear, stroke .5s" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[28px] font-medium tabular-nums tracking-tight">{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span>
          <span className="text-[11.5px] text-ink3">{state}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          {[1, 5, 25].map(m => (
            <button key={m} onClick={() => { setLen(m * 60); setLeft(m * 60); setRunning(false); }}
              className={cx("h-7 w-10 rounded-md border font-mono text-xs transition-colors duration-300", len === m * 60 ? "border-ink bg-ink text-onink" : "border-line2 text-ink2 hover:border-ink3/50")}>{m}m</button>
          ))}
        </div>
        <button onClick={() => setRunning(r => !r)} disabled={done} className="h-9 rounded-lg bg-ink text-[13px] font-medium text-onink transition-colors hover:bg-ink/85 disabled:opacity-40">{running ? "Pause" : left < len ? "Resume" : "Start"}</button>
        <button onClick={() => { setLeft(len); setRunning(false); }} className="h-7 rounded-md text-xs text-ink2 hover:bg-surface2">Reset</button>
      </div>
    </div>
  );
}

const RINGS = [["Move", "var(--red)"], ["Focus", "var(--green)"], ["Sleep", "var(--blue)"]] as const;
const SETS = [[0.72, 0.48, 0.9], [0.35, 0.82, 0.6], [0.95, 0.3, 0.74], [0.55, 0.66, 0.42]];
function Goals() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [set, setSet] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const vals = SETS[set];
  return (
    <div ref={ref} className="flex items-center gap-7">
      <button onClick={() => setSet(s => (s + 1) % SETS.length)} aria-label="Show another day" className="transition-transform duration-300 active:scale-95">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          {RINGS.map(([label, color], i) => {
            const R = 70 - i * 18, C = 2 * Math.PI * R;
            return (
              <g key={label}>
                <circle cx="80" cy="80" r={R} fill="none" stroke={color} strokeOpacity=".15" strokeWidth="13" />
                <circle cx="80" cy="80" r={R} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - (visible ? vals[i] : 0))}
                  style={{ transition: `stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1) ${i * 150}ms` }} />
              </g>
            );
          })}
        </svg>
      </button>
      <div className="flex flex-col gap-2.5">
        {RINGS.map(([label, color], i) => (
          <div key={label} className="flex items-center gap-2 text-[13px]">
            <i className="h-2 w-2 rounded-sm" style={{ background: color }} /><span className="w-11 text-ink2">{label}</span>
            <span className="font-mono">{Math.round(vals[i] * 100)}%</span>
          </div>
        ))}
        <span className="text-[11.5px] text-ink3">Day {set + 1} of {SETS.length}. Click the rings.</span>
      </div>
    </div>
  );
}

export default function RingDemo({ variant = "Timer" }: { variant?: string }) {
  return <div className="relative flex h-full w-full items-center justify-center">{variant === "Timer" ? <Timer /> : <Goals />}</div>;
}

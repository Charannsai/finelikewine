"use client";
/**
 * Dock · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Icons scale with the pointer's distance; click to "open" an app.
 */
import React, { useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const APPS = [
  { name: "Home", hue: "#c97a8c", d: "M3 11 12 4l9 7v9H3zM9 20v-6h6v6" },
  { name: "Search", hue: "#7d9bd8", d: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5" },
  { name: "Mail", hue: "#6fae84", d: "M3 6h18v12H3zM3 7l9 6 9-6" },
  { name: "Calendar", hue: "#c9a35a", d: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" },
  { name: "Analytics", hue: "#9a86c9", d: "M5 20V10M12 20V4M19 20v-7" },
  { name: "Settings", hue: "#6fa9ab", d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" },
  { name: "Notes", hue: "#a8a29a", d: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h4" },
];

export default function Dock() {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ptr, setPtr] = useState<{ x: number; centers: number[] } | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [bounce, setBounce] = useState<Record<number, number>>({});
  const [open, setOpen] = useState<number[]>([0]);
  const [last, setLast] = useState("Home");

  const scale = (i: number) => {
    if (!ptr) return 1;
    const d = Math.abs(ptr.x - ptr.centers[i]);
    return 1 + 0.75 * Math.max(0, 1 - d / 130);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
      <style>{`@keyframes dock-bounce { 0%,100% { transform: translateY(0) } 30% { transform: translateY(-14px) } 55% { transform: translateY(0) } 72% { transform: translateY(-5px) } }`}</style>
      <p className="text-[13px] text-ink3">Open: <span className="text-ink">{last}</span></p>
      <div className="flex h-[110px] items-end">
        <div
          onPointerMove={e => {
            const x = e.clientX;
            setPtr(p => ({ x, centers: p?.centers ?? refs.current.map(r => { const b = r!.getBoundingClientRect(); return b.left + b.width / 2; }) }));
          }}
          onPointerLeave={() => { setPtr(null); setHover(null); }}
          className="flex items-end gap-2 rounded-2xl border border-line2 bg-surface/80 p-2.5 backdrop-blur">
          {APPS.map((a, i) => {
            const s = scale(i);
            return (
              <div key={a.name} className="relative flex flex-col items-center">
                <span className={cx("pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11.5px] font-medium text-onink transition-opacity duration-300", hover === i ? "opacity-100" : "opacity-0")}>{a.name}</span>
                <button ref={el => { refs.current[i] = el; }} aria-label={a.name} onPointerEnter={() => setHover(i)}
                  onClick={() => { setBounce(b => ({ ...b, [i]: (b[i] ?? 0) + 1 })); setOpen(o => (o.includes(i) ? o : [...o, i])); setLast(a.name); }}
                  className="flex items-center justify-center rounded-xl transition-[width,height] duration-150 ease-out"
                  style={{ width: 42 * s, height: 42 * s, background: `linear-gradient(160deg, ${a.hue}, color-mix(in oklab, ${a.hue} 60%, #000))` }}>
                  <span key={bounce[i] ?? 0} className="flex" style={bounce[i] ? { animation: "dock-bounce .8s ease" } : undefined}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d={a.d} /></svg>
                  </span>
                </button>
                <span className={cx("mt-1 h-[3px] w-[3px] rounded-full bg-ink2 transition-opacity duration-500", open.includes(i) ? "opacity-100" : "opacity-0")} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

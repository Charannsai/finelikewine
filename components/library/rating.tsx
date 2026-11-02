"use client";
/**
 * Rating · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Stars" | "Reactions"
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const STAR = "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z";
const LABELS = ["How was it?", "Not for me", "It’s okay", "Pretty good", "Really good", "Loved it"];
const POP = `@keyframes rate-pop { 0% { transform: scale(1) } 40% { transform: scale(1.3) } 100% { transform: scale(1) } }`;

function Roll({ value }: { value: number }) {
  return (
    <span className="inline-flex font-mono tabular-nums leading-none">
      {String(value).split("").map((ch, i) => (
        <span key={i} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
          <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateY(-${+ch}em)` }}>
            {"0123456789".split("").map(n => <span key={n} className="block h-[1em] text-center">{n}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

function Stars() {
  const [val, setVal] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || val;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1" onPointerLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onPointerEnter={() => setHover(i)} onClick={() => setVal(i === val ? 0 : i)} aria-label={`${i} star${i > 1 ? "s" : ""}`} className="p-1 transition-transform duration-300 hover:scale-110 active:scale-90">
            <svg key={val >= i ? `on-${val}` : "off"} viewBox="0 0 24 24" className="h-9 w-9 transition-colors duration-300"
              fill={shown >= i ? "var(--amber)" : "none"} stroke={shown >= i ? "var(--amber)" : "var(--line2)"} strokeWidth="1.5" strokeLinejoin="round"
              style={val >= i && !hover ? { animation: `rate-pop .45s cubic-bezier(.3,1.6,.5,1) ${i * 40}ms` } : undefined}><path d={STAR} /></svg>
          </button>
        ))}
      </div>
      <span key={shown} className="h-5 text-[13.5px] text-ink2">{LABELS[shown]}</span>
      <span className="text-xs text-ink3">{val ? `You rated ${val} of 5. Click again to clear.` : "Hover to preview, click to rate."}</span>
    </div>
  );
}

const REACTIONS = [
  { label: "Love", n: 24, d: "M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C17 15.6 12 20 12 20Z" },
  { label: "Fast", n: 9, d: "M13 2 4 14h7l-1 8 9-12h-7z" },
  { label: "Neat", n: 15, d: "M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5" },
  { label: "Ship it", n: 31, d: "M5 12l5 5L20 7" },
];
function Reactions() {
  const [mine, setMine] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-xs flex-wrap justify-center gap-2">
        {REACTIONS.map(r => {
          const on = mine.includes(r.label);
          return (
            <button key={r.label} aria-pressed={on} onClick={() => setMine(m => (on ? m.filter(x => x !== r.label) : [...m, r.label]))}
              className={cx("flex h-10 items-center gap-2 rounded-xl border px-3 text-[13px] transition-colors duration-500 active:scale-95", on ? "border-wine/50 bg-winebg text-wine" : "border-line2 bg-surface text-ink2 hover:border-ink3/50")}>
              <svg key={String(on)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"
                style={on ? { animation: "rate-pop .45s cubic-bezier(.3,1.6,.5,1)" } : undefined}><path d={r.d} /></svg>
              {r.label}
              <span className="text-xs"><Roll value={r.n + (on ? 1 : 0)} /></span>
            </button>
          );
        })}
      </div>
      <span className="text-xs text-ink3">{mine.length ? `You reacted with ${mine.join(", ").toLowerCase()}.` : "Tap any reaction."}</span>
    </div>
  );
}

export default function RatingDemo({ variant = "Stars" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{POP}</style>
      {variant === "Stars" ? <Stars /> : <Reactions />}
    </div>
  );
}

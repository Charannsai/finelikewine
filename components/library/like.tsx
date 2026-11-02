"use client";
/**
 * Like · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Heart" | "Actions"
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* Digits roll like a slot machine: each digit is a 0–9 strip moved to its value. */
export function Roll({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={cx("inline-flex tabular-nums leading-none", className)} aria-label={value.toLocaleString()}>
      {Array.from(value.toLocaleString()).map((ch, i) => /\d/.test(ch) ? (
        <span key={i} aria-hidden className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
          <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateY(-${+ch}em)` }}>
            {"0123456789".split("").map(n => <span key={n} className="block h-[1em] text-center">{n}</span>)}
          </span>
        </span>
      ) : <span key={i} aria-hidden>{ch}</span>)}
    </span>
  );
}

const HEART = "M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C17 15.6 12 20 12 20Z";
const ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const KEYFRAMES = `
@keyframes like-burst { from { transform: translate(0,0) scale(1); opacity: 1 } to { transform: translate(var(--bx),var(--by)) scale(0); opacity: 0 } }
@keyframes like-pop { 0% { transform: scale(1) } 40% { transform: scale(1.28) } 100% { transform: scale(1) } }`;

function Burst() {
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {ANGLES.map((a, i) => {
        const r = 34 + (i % 3) * 8, rad = (a * Math.PI) / 180;
        return <i key={a} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-sm"
          style={{ background: i % 2 ? "var(--accent)" : "var(--amber)", "--bx": `${Math.cos(rad) * r}px`, "--by": `${Math.sin(rad) * r}px`, animation: "like-burst .7s cubic-bezier(.2,.8,.3,1) forwards" } as React.CSSProperties} />;
      })}
    </span>
  );
}

function Heart() {
  const [on, setOn] = useState(false);
  const [count, setCount] = useState(1284);
  const [burst, setBurst] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <button aria-pressed={on} aria-label="Like"
        onClick={() => { setOn(!on); setCount(c => c + (on ? -1 : 1)); if (!on) setBurst(b => b + 1); }}
        className={cx("relative flex h-20 w-20 items-center justify-center rounded-2xl border transition-colors duration-500 active:scale-95", on ? "border-wine/40 bg-winebg" : "border-line2 bg-surface hover:border-ink3/50")}>
        <svg key={String(on)} viewBox="0 0 24 24" className="h-8 w-8" fill={on ? "var(--accent)" : "none"} stroke={on ? "var(--accent)" : "var(--ink2)"} strokeWidth="1.6" strokeLinejoin="round"
          style={on ? { animation: "like-pop .4s cubic-bezier(.3,1.6,.5,1)" } : undefined}><path d={HEART} /></svg>
        {burst > 0 && <Burst key={burst} />}
      </button>
      <span className="font-mono text-[15px] text-ink2"><Roll value={count} /></span>
      <span className="h-4 text-xs text-ink3">{on ? "You and 1,283 others" : "1,284 people liked this"}</span>
    </div>
  );
}

const ACTIONS = [
  { key: "like", label: "Like", color: "var(--red)", d: HEART, n: 48 },
  { key: "repost", label: "Repost", color: "var(--green)", d: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3", n: 12 },
  { key: "save", label: "Save", color: "var(--amber)", d: "M6 3h12v18l-6-4-6 4z", n: 7 },
];
function Actions() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return (
    <div className="w-full max-w-xs rounded-xl border border-line2 bg-surface p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c97a8c] text-[10.5px] font-semibold text-white">NK</span>
        <div><div className="text-[13px] font-medium">Nora Kim</div><div className="text-xs text-ink3">2h</div></div>
      </div>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink2">Shipped the new onboarding today. Three screens instead of nine.</p>
      <div className="mt-3 flex gap-1 border-t border-line pt-2">
        {ACTIONS.map(a => (
          <button key={a.key} aria-pressed={!!on[a.key]} aria-label={a.label} onClick={() => setOn(s => ({ ...s, [a.key]: !s[a.key] }))}
            className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12.5px] transition-colors duration-300 hover:bg-surface2" style={{ color: on[a.key] ? a.color : "var(--ink3)" }}>
            <svg key={String(!!on[a.key])} viewBox="0 0 24 24" className="h-4 w-4" fill={on[a.key] && a.key !== "repost" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
              style={on[a.key] ? { animation: "like-pop .4s cubic-bezier(.3,1.6,.5,1)" } : undefined}><path d={a.d} /></svg>
            <Roll value={a.n + (on[a.key] ? 1 : 0)} className="font-mono" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LikeDemo({ variant = "Heart" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{KEYFRAMES}</style>
      {variant === "Heart" ? <Heart /> : <Actions />}
    </div>
  );
}

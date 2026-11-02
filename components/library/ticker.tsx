"use client";
/**
 * Number ticker · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Counter" | "Revenue" | "Clock"
 */
import React, { useEffect, useRef, useState } from "react";

/* Each digit is a strip of 0–9 that slides to its value, so every change rolls. */
export function Ticker({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex tabular-nums leading-none ${className}`} aria-label={text}>
      {Array.from(text).map((ch, i) => /\d/.test(ch) ? (
        <span key={`${text.length}-${i}`} aria-hidden className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
          <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: `translateY(-${+ch}em)`, transitionDelay: `${i * 30}ms` }}>
            {"0123456789".split("").map(n => <span key={n} className="block h-[1em] text-center">{n}</span>)}
          </span>
        </span>
      ) : <span key={`${text.length}-${i}`} aria-hidden>{ch}</span>)}
    </span>
  );
}

const btn = "h-8 rounded-lg border border-line2 bg-surface px-2.5 font-mono text-xs transition-colors duration-300 hover:bg-surface2";

function Counter() {
  const [n, setN] = useState(1984);
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[52px] font-semibold tracking-tight"><Ticker text={n.toLocaleString()} /></span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {[-1, 1, 10, 137].map(d => <button key={d} onClick={() => setN(x => Math.max(0, x + d))} className={btn}>{d > 0 ? `+${d}` : d}</button>)}
        <button onClick={() => setN(Math.floor(Math.random() * 99999))} className={btn}>Random</button>
      </div>
    </div>
  );
}

function Revenue() {
  const [rev, setRev] = useState(48210);
  const [sales, setSales] = useState<number[]>([]);
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[12.5px] text-ink3">Revenue today</span>
      <span className="text-[40px] font-semibold tracking-tight"><Ticker text={`$${rev.toLocaleString()}`} /></span>
      <button onClick={() => { const s = 40 + Math.floor(Math.random() * 900); setRev(r => r + s); setSales(l => [s, ...l].slice(0, 3)); }} className={`${btn} font-sans text-[12.5px]`}>Add a sale</button>
      <div className="flex h-5 gap-2 text-xs">
        {sales.map((s, i) => <span key={`${s}-${sales.length - i}`} className="font-mono text-green" style={{ opacity: 1 - i * 0.3, animation: i === 0 ? "tick-in .6s ease" : undefined }}>+${s}</span>)}
      </div>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const first = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    first.current = setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => { clearTimeout(first.current); clearInterval(t); };
  }, []);
  const p = (v: number) => String(v).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[44px] font-medium tracking-tight">{now ? <Ticker text={`${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`} /> : <span className="text-ink3">--:--:--</span>}</span>
      <span className="text-xs text-ink3">Your local time</span>
    </div>
  );
}

export default function TickerDemo({ variant = "Counter" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`@keyframes tick-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }`}</style>
      {variant === "Counter" && <Counter />}
      {variant === "Revenue" && <Revenue />}
      {variant === "Clock" && <Clock />}
    </div>
  );
}

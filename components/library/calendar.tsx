"use client";
/**
 * Calendar · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Single" | "Range". Weeks start on Monday.
 */
import React, { useEffect, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const short = (d: Date) => d.toLocaleDateString("en", { month: "short", day: "numeric" });

function Arrow({ d, label, onClick }: { d: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex h-7 w-7 items-center justify-center rounded-md text-ink3 transition-colors hover:bg-surface2 hover:text-ink">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d={d} /></svg>
    </button>
  );
}

/* "Today" is read on the client after mount, so the server render never depends on the clock. */
export default function Calendar({ variant = "Single" }: { variant?: string }) {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    const t = setTimeout(() => { const d = new Date(); setToday(new Date(d.getFullYear(), d.getMonth(), d.getDate())); }, 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {today ? <Month today={today} range={variant === "Range"} /> : <div className="h-[330px] w-full max-w-[300px] rounded-xl border border-line2 bg-surface" />}
    </div>
  );
}

function Month({ today, range }: { today: Date; range: boolean }) {
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [a, setA] = useState<Date | null>(() => (range ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3) : today));
  const [b, setB] = useState<Date | null>(() => (range ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9) : null));
  const [hover, setHover] = useState<Date | null>(null);

  const offset = (month.getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - offset + 1));
  const end = b ?? (range && a && hover ? hover : null);
  const [lo, hi] = a && end ? (a < end ? [a, end] : [end, a]) : [a, a];
  const nights = a && b ? Math.round(Math.abs(+b - +a) / 864e5) : 0;

  const pick = (d: Date) => {
    if (!range) return setA(d);
    if (!a || b) { setA(d); setB(null); } else setB(d);
  };
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return (
      <div className="w-full max-w-[300px] rounded-xl border border-line2 bg-surface p-3.5">
        <div className="flex items-center justify-between">
          <span key={month.toISOString()} className="text-[13.5px] font-medium">{month.toLocaleString("en", { month: "long", year: "numeric" })}</span>
          <div className="flex"><Arrow d="m15 18-6-6 6-6" label="Previous month" onClick={() => shift(-1)} /><Arrow d="m9 18 6-6-6-6" label="Next month" onClick={() => shift(1)} /></div>
        </div>
        <div className="mt-2.5 grid grid-cols-7 text-center text-[11px] text-ink3">{DOW.map(d => <span key={d} className="py-1">{d}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-0.5" onPointerLeave={() => setHover(null)}>
          {cells.map((d, i) => {
            const inMonth = d.getMonth() === month.getMonth();
            const edge = same(d, lo) || same(d, hi);
            const between = range && lo && hi && d > lo && d < hi;
            return (
              <button key={i} disabled={!inMonth} onClick={() => pick(d)} onPointerEnter={() => setHover(d)}
                className={cx("relative h-[34px] text-[12.5px] tabular-nums transition-colors duration-300", !inMonth && "invisible",
                  edge ? "rounded-lg bg-wine font-medium text-onink" : between ? "bg-winebg text-ink" : "rounded-lg hover:bg-surface2",
                  same(d, today) && !edge && "font-semibold text-wine")}>
                {d.getDate()}
                {same(d, today) && <span className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-current" />}
              </button>
            );
          })}
        </div>
        <div className="mt-2.5 flex h-6 items-center justify-between border-t border-line pt-2.5 text-xs">
          {range
            ? (a && b ? <><span className="text-ink2">{short(lo!)} – {short(hi!)}</span><span className="font-mono text-ink3">{nights} nights</span></> : <span className="text-ink3">Now pick an end date</span>)
            : <span className="text-ink2">{a?.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</span>}
        </div>
      </div>
  );
}

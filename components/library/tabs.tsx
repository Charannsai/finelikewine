"use client";
/**
 * Tabs · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Segmented" | "Underline" | "Vertical". Each indicator is measured from the active tab.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const EASE = "ease-[cubic-bezier(.16,1,.3,1)]";

function useIndicator(index: number) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = useState({ left: 0, width: 0, ready: false });
  useLayoutEffect(() => {
    const measure = () => { const el = refs.current[index]; if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth, ready: true }); };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach(r => r && ro.observe(r));
    return () => ro.disconnect();
  }, [index]);
  return { refs, box };
}

/* Counts from the previous value to the new one. */
function useCount(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 4);
      setV(a + (target - a) * e);
      if (k < 1) raf = requestAnimationFrame(step); else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = target; };
  }, [target]);
  return v;
}

const RANGES: Record<string, [number, string]> = { Day: [1284, "+4.1%"], Week: [8920, "+12.6%"], Month: [38410, "+8.3%"], Year: [402880, "+31.0%"] };
function Segmented() {
  const keys = Object.keys(RANGES);
  const [r, setR] = useState("Week");
  const { refs, box } = useIndicator(keys.indexOf(r));
  const n = useCount(RANGES[r][0]);
  return (
    <div className="w-full max-w-sm rounded-xl border border-line2 bg-surface p-4">
      <div role="tablist" className="relative flex rounded-[10px] border border-line bg-surface2 p-[3px]">
        <span aria-hidden className={cx("absolute bottom-[3px] top-[3px] rounded-[7px] border border-line2 bg-surface", box.ready && `transition-[left,width] duration-700 ${EASE}`)} style={{ left: box.left, width: box.width }} />
        {keys.map((k, i) => (
          <button key={k} ref={el => { refs.current[i] = el; }} role="tab" aria-selected={r === k} onClick={() => setR(k)}
            className={cx("relative z-[1] h-7 flex-1 text-[12.5px] font-medium transition-colors duration-500", r === k ? "text-ink" : "text-ink3 hover:text-ink2")}>{k}</button>
        ))}
      </div>
      <div className="mt-5 text-[12.5px] text-ink3">Visitors</div>
      <div className="mt-0.5 flex items-baseline gap-2.5">
        <span className="text-[30px] font-semibold tracking-tight tabular-nums">{Math.round(n).toLocaleString()}</span>
        <span className="text-[12.5px] font-medium text-green">{RANGES[r][1]}</span>
      </div>
    </div>
  );
}

const PANELS = [
  { tab: "Overview", body: <div className="flex gap-6">{[["Open", "12"], ["Merged", "48"], ["Closed", "7"]].map(([k, n]) => <div key={k}><div className="text-xl font-semibold tabular-nums text-ink">{n}</div><div className="text-xs text-ink3">{k}</div></div>)}</div> },
  { tab: "Activity", body: <div className="flex flex-col gap-2">{[["AK", "merged #482", "2m"], ["JR", "commented on #479", "18m"], ["MS", "opened #483", "1h"]].map(([a, t, w]) => <div key={t} className="flex items-center gap-2.5 text-[13px]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface3 text-[9.5px] font-semibold text-ink2">{a}</span><span className="text-ink">{t}</span><span className="ml-auto font-mono text-[11px] text-ink3">{w}</span></div>)}</div> },
  { tab: "Settings", body: <p className="text-[13px] leading-relaxed text-ink2">Require one review before merging, and delete branches after merge.</p> },
];
function Underline() {
  const [i, setI] = useState(0);
  const { refs, box } = useIndicator(i);
  const onKey = (e: React.KeyboardEvent) => {
    const n = e.key === "ArrowRight" ? (i + 1) % PANELS.length : e.key === "ArrowLeft" ? (i - 1 + PANELS.length) % PANELS.length : -1;
    if (n >= 0) { setI(n); refs.current[n]?.focus(); }
  };
  return (
    <div className="w-full max-w-sm rounded-xl border border-line2 bg-surface px-4 pb-4 pt-3">
      <div role="tablist" onKeyDown={onKey} className="relative flex gap-5 border-b border-line">
        {PANELS.map((p, j) => (
          <button key={p.tab} ref={el => { refs.current[j] = el; }} role="tab" aria-selected={i === j} tabIndex={i === j ? 0 : -1} onClick={() => setI(j)}
            className={cx("pb-2.5 text-[13px] font-medium transition-colors duration-500 focus-visible:outline-none", i === j ? "text-ink" : "text-ink3 hover:text-ink2")}>{p.tab}</button>
        ))}
        <span aria-hidden className={cx("absolute -bottom-px h-0.5 rounded-sm bg-ink", box.ready && `transition-[left,width] duration-700 ${EASE}`)} style={{ left: box.left, width: box.width }} />
      </div>
      <div key={i} role="tabpanel" className="min-h-16 pt-3.5" style={{ animation: "tabs-in .6s cubic-bezier(.16,1,.3,1)" }}>{PANELS[i].body}</div>
    </div>
  );
}

const SETTINGS = [["General", "Workspace name, URL and language."], ["Members", "Invite people and set what they can change."], ["Billing", "Plan, invoices and payment method."], ["Security", "Two-factor, sessions and audit log."]];
function Vertical() {
  const [i, setI] = useState(0);
  return (
    <div className="flex w-full max-w-md overflow-hidden rounded-xl border border-line2 bg-surface">
      <div className="relative w-36 flex-none border-r border-line p-1.5">
        <span className={cx("absolute left-1.5 right-1.5 top-1.5 h-[34px] rounded-lg bg-surface2 transition-transform duration-700", EASE)} style={{ transform: `translateY(${i * 36}px)` }} />
        <span className={cx("absolute left-0 top-1.5 h-[18px] w-0.5 rounded-sm bg-wine transition-transform duration-700", EASE)} style={{ transform: `translateY(${i * 36 + 8}px)` }} />
        {SETTINGS.map(([t], j) => (
          <button key={t} onClick={() => setI(j)} className={cx("relative mb-0.5 flex h-[34px] w-full items-center rounded-lg px-2.5 text-[13px] transition-colors duration-500", i === j ? "text-ink" : "text-ink3 hover:text-ink2")}>{t}</button>
        ))}
      </div>
      <div key={i} className="flex-1 p-4" style={{ animation: "tabs-in .6s cubic-bezier(.16,1,.3,1)" }}>
        <div className="text-sm font-medium">{SETTINGS[i][0]}</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink3">{SETTINGS[i][1]}</p>
        <div className="mt-3.5 flex flex-col gap-2"><div className="h-7 rounded-md bg-surface2" /><div className="h-7 w-[70%] rounded-md bg-surface2" /></div>
      </div>
    </div>
  );
}

export default function TabsDemo({ variant = "Segmented" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`@keyframes tabs-in { from { opacity: 0; transform: translateY(4px); filter: blur(4px) } to { opacity: 1; transform: none; filter: none } }`}</style>
      {variant === "Segmented" && <Segmented />}
      {variant === "Underline" && <Underline />}
      {variant === "Vertical" && <Vertical />}
    </div>
  );
}

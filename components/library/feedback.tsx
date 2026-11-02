"use client";
/**
 * Feedback · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Alerts" | "Progress" | "Skeleton" | "Empty"
 */
import React, { useEffect, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const CHECK_CIRCLE = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8 12l3 3 5-6";
const FILE = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5";

const ALERTS = [
  { k: "success", bar: "bg-green", tint: "text-green", d: CHECK_CIRCLE, t: "Deploy finished", b: "acme-web is live in 3 regions." },
  { k: "warn", bar: "bg-amber", tint: "text-amber", d: "M12 4 2 20h20L12 4ZM12 10v4M12 17v.5", t: "Usage at 82%", b: "You’ll reach the plan limit in about 4 days." },
  { k: "error", bar: "bg-red", tint: "text-red", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8v5M12 16v.5", t: "Build failed", b: "Type error in app/page.tsx on line 14." },
  { k: "info", bar: "bg-blue", tint: "text-blue", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8v.5", t: "Maintenance Saturday", b: "Read-only from 02:00 to 02:30 UTC." },
];
function Alerts() {
  const [shown, setShown] = useState(ALERTS.map(a => a.k));
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {ALERTS.filter(a => shown.includes(a.k)).map(a => (
        <div key={a.k} role="status" className="relative flex items-start gap-2.5 overflow-hidden rounded-xl border border-line bg-surface py-3 pl-4 pr-3 text-[13px]">
          <span className={cx("absolute inset-y-0 left-0 w-[3px]", a.bar)} />
          <span className={cx("mt-px", a.tint)}><Icon d={a.d} /></span>
          <div className="min-w-0 flex-1"><div className="font-medium">{a.t}</div><div className="mt-0.5 text-ink3">{a.b}</div></div>
          <button onClick={() => setShown(s => s.filter(x => x !== a.k))} aria-label="Dismiss" className="rounded-md p-1 text-ink3 transition-colors hover:bg-surface2 hover:text-ink"><Icon d="M18 6 6 18M6 6l12 12" className="h-3 w-3" /></button>
        </div>
      ))}
      {!shown.length && (
        <div className="flex flex-col items-center gap-2.5 py-6 text-[13px] text-ink3">
          All clear.
          <button onClick={() => setShown(ALERTS.map(a => a.k))} className="h-8 rounded-lg border border-line2 px-3 text-ink2 hover:bg-surface2">Bring them back</button>
        </div>
      )}
    </div>
  );
}

const FILES: [string, string, number][] = [["brand-guidelines.pdf", "4.2 MB", 2.4], ["hero@2x.png", "1.1 MB", 4.6], ["interview-03.mp4", "38 MB", 1.1]];
function Progress() {
  const [p, setP] = useState([0, 0, 0]);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setP(ps => {
      const next = ps.map((v, i) => Math.min(100, v + FILES[i][2] * 1.4));
      if (next.every(v => v >= 100)) clearInterval(t);
      return next;
    }), 70);
    return () => clearInterval(t);
  }, [run]);
  return (
    <div className="w-full max-w-sm rounded-xl border border-line2 bg-surface p-1.5">
      {FILES.map(([n, s], i) => (
        <div key={n} className="flex items-center gap-3 px-2.5 py-2.5">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line bg-surface2 text-ink3"><Icon d={FILE} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[13px]"><span className="truncate font-medium">{n}</span><span className="ml-2 flex-none font-mono text-[11.5px] text-ink3">{p[i] >= 100 ? s : `${Math.floor(p[i])}%`}</span></div>
            <div className="mt-1.5 h-[5px] overflow-hidden rounded-sm bg-surface3"><div className="h-full rounded-sm transition-[width,background] duration-300" style={{ width: `${p[i]}%`, background: p[i] >= 100 ? "var(--green)" : "var(--accent)" }} /></div>
          </div>
          <span className={cx("w-4 transition-opacity duration-500", p[i] >= 100 ? "text-green opacity-100" : "opacity-0")}><Icon d={CHECK_CIRCLE} /></span>
        </div>
      ))}
      <div className="flex justify-between border-t border-line px-2.5 pb-0.5 pt-2 text-xs">
        <span className="self-center text-ink3">{p.filter(v => v >= 100).length} of 3 uploaded</span>
        <button onClick={() => { setP([0, 0, 0]); setRun(r => r + 1); }} className="h-7 rounded-md px-2 text-ink2 hover:bg-surface2">Upload again</button>
      </div>
    </div>
  );
}

function Skeleton() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [loading]);
  const bar = "rounded-md bg-[linear-gradient(90deg,var(--surface2)_25%,var(--surface3)_50%,var(--surface2)_75%)] bg-[length:400%_100%] animate-[fb-shimmer_1.6s_linear_infinite]";
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="w-full rounded-xl border border-line2 bg-surface p-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5"><div className={cx(bar, "h-9 w-9 rounded-full")} /><div className="flex-1"><div className={cx(bar, "h-2.5 w-[45%]")} /><div className={cx(bar, "mt-2 h-2.5 w-[30%]")} /></div></div>
            <div className={cx(bar, "h-2.5")} /><div className={cx(bar, "h-2.5 w-[85%]")} /><div className={cx(bar, "h-24 rounded-lg")} />
          </div>
        ) : (
          <div className="flex flex-col gap-3" style={{ animation: "fb-in .8s cubic-bezier(.16,1,.3,1)" }}>
            <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7d9bd8] text-[11px] font-semibold text-white">JR</span><div><div className="text-[13px] font-medium">Jon Reyes</div><div className="text-xs text-ink3">posted in #design</div></div></div>
            <p className="text-[13px] leading-relaxed text-ink2">New empty states are in. Fewer words, one clear action, and they finally match dark mode.</p>
            <div className="h-24 rounded-lg border border-line bg-surface2" />
          </div>
        )}
      </div>
      <button onClick={() => setLoading(true)} disabled={loading} className="h-7 rounded-md px-2.5 text-xs text-ink2 hover:bg-surface2 disabled:opacity-40">{loading ? "Loading" : "Reload"}</button>
    </div>
  );
}

function Empty() {
  const [docs, setDocs] = useState<string[]>([]);
  return (
    <div className="w-full max-w-sm rounded-xl border border-line2 bg-surface">
      {docs.length ? (
        <div className="p-2" style={{ animation: "fb-in .8s cubic-bezier(.16,1,.3,1)" }}>
          {docs.map(d => <div key={d} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]"><span className="text-ink3"><Icon d={FILE} /></span>{d}<span className="ml-auto font-mono text-[11px] text-ink3">just now</span></div>)}
          <div className="mt-1 flex justify-end border-t border-line px-1 pt-2"><button onClick={() => setDocs([])} className="h-7 rounded-md px-2 text-xs text-ink2 hover:bg-surface2">Clear</button></div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-line2 text-ink3"><Icon d={FILE} className="h-5 w-5" /></span>
          <h4 className="mt-3.5 text-sm font-medium">No documents yet</h4>
          <p className="mt-1 max-w-[240px] text-[12.5px] leading-relaxed text-ink3">Documents you create or import show up here, newest first.</p>
          <button onClick={() => setDocs(["Q3 planning", "Launch checklist"])} className="mt-4 h-8 rounded-lg bg-ink px-3 text-[13px] font-medium text-onink hover:bg-ink/85">New document</button>
        </div>
      )}
    </div>
  );
}

export default function FeedbackDemo({ variant = "Alerts" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`@keyframes fb-shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }
@keyframes fb-in { from { opacity: 0; filter: blur(6px); transform: translateY(6px) } to { opacity: 1; filter: none; transform: none } }`}</style>
      {variant === "Alerts" && <Alerts />}
      {variant === "Progress" && <Progress />}
      {variant === "Skeleton" && <Skeleton />}
      {variant === "Empty" && <Empty />}
    </div>
  );
}

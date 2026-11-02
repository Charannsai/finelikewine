"use client";
/**
 * Timeline · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Activity" | "Deploy log"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const IN = "tl-in .7s cubic-bezier(.16,1,.3,1)";
const COLORS: Record<string, string> = { NK: "#c97a8c", JR: "#7d9bd8", MS: "#9a86c9", AL: "#6fae84", DO: "#c9a35a", BK: "#6fa9ab", CW: "#c97a8c", FB: "#7d9bd8" };

type Event = { id: number; who: string; what: string; when: string };
const FIRST: Event[] = [
  { id: 1, who: "NK", what: "merged pull request #482", when: "2m" },
  { id: 2, who: "JR", what: "commented on Billing migration", when: "18m" },
  { id: 3, who: "MS", what: "uploaded brand-guidelines.pdf", when: "1h" },
  { id: 4, who: "AL", what: "created the Q3 roadmap", when: "3h" },
];
const MORE: [string, string][] = [["DO", "joined the workspace"], ["BK", "closed issue #311"], ["CW", "renamed a project"], ["FB", "starred finelikewine"]];

function Activity() {
  const [items, setItems] = useState(FIRST);
  const n = useRef(0);
  const add = () => {
    const [who, what] = MORE[n.current++ % MORE.length];
    setItems(list => [{ id: 100 + n.current, who, what, when: "now" }, ...list].slice(0, 4));
  };
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="relative">
        <span className="absolute bottom-4 left-[14px] top-4 w-px bg-line" />
        {items.map(e => (
          <div key={e.id} className="relative flex items-center gap-3 py-1.5" style={e.id > 100 ? { animation: IN } : undefined}>
            <span className="relative flex h-7 w-7 flex-none items-center justify-center rounded-full text-[10px] font-semibold text-white ring-4 ring-surface" style={{ background: COLORS[e.who] }}>{e.who}</span>
            <span className="flex-1 text-[13px] text-ink2"><span className="font-medium text-ink">{e.who}</span> {e.what}</span>
            <span className={cx("font-mono text-[11px]", e.when === "now" ? "text-wine" : "text-ink3")}>{e.when}</span>
          </div>
        ))}
      </div>
      <button onClick={add} className="h-8 self-center rounded-lg border border-line2 px-3 text-[12.5px] transition-colors hover:bg-surface2">Add an event</button>
    </div>
  );
}

const LOG = ["Cloning acme/web (main)", "Installing dependencies", "Restored build cache", "Compiling 214 modules", "Generating 38 pages", "Uploading build output", "Assigning domains"];
function DeployLog() {
  const [n, setN] = useState(0);
  const [run, setRun] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (n > LOG.length) return;
    const t = setTimeout(() => setN(x => x + 1), n === 0 ? 400 : 520);
    return () => clearTimeout(t);
  }, [n, run]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [n]);
  const ready = n > LOG.length;
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-line2 bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-xs">
        {ready
          ? <span className="flex items-center gap-1.5 text-green"><i className="h-1.5 w-1.5 rounded-full bg-green" />Ready</span>
          : <span className="flex items-center gap-1.5 text-ink2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />Building</span>}
        <span className="ml-auto font-mono text-ink3">{(Math.min(n, LOG.length) * 0.9).toFixed(1)}s</span>
        <button onClick={() => { setN(0); setRun(r => r + 1); }} disabled={!ready} className="text-ink3 hover:text-ink disabled:opacity-40">Redeploy</button>
      </div>
      <div ref={box} className="h-44 overflow-y-auto px-3 py-2.5 font-mono text-[11.5px] leading-[1.9]">
        {LOG.slice(0, n).map((l, i) => (
          <div key={`${run}-${i}`} className="flex gap-2.5" style={{ animation: IN }}>
            <span className="text-ink3">{String(i + 1).padStart(2, "0")}</span><span className="text-ink2">{l}</span>
            {(i < n - 1 || ready) && <span className="ml-auto text-green">✓</span>}
          </div>
        ))}
        {ready && <div className="mt-1 text-wine" style={{ animation: IN }}>→ acme-web.app</div>}
      </div>
    </div>
  );
}

export default function TimelineDemo({ variant = "Activity" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`@keyframes tl-in { from { opacity: 0; filter: blur(6px); transform: translateY(-4px) } to { opacity: 1; filter: none; transform: none } }`}</style>
      {variant === "Activity" ? <Activity /> : <DeployLog />}
    </div>
  );
}

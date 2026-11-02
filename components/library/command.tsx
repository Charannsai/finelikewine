"use client";
/**
 * Command · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Arrow keys move, Enter runs, and the result shows in the menu's own status line.
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded border border-line2 bg-surface2 px-1 font-mono text-[10.5px] text-ink3">{children}</kbd>
);

type Action = { label: string; group: string; d: string; kbd?: string; result: string };
const ACTIONS: Action[] = [
  { label: "New document", group: "Create", d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 11v6M9 14h6", kbd: "N", result: "Created “Untitled document”" },
  { label: "New project", group: "Create", d: "M3 7h6l2 2h10v10H3zM12 12v5M9.5 14.5h5", result: "Created project “New project”" },
  { label: "Invite people", group: "Create", d: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21c1-4 4-6 7-6s6 2 7 6M19 8v6M16 11h6", result: "Invite link copied" },
  { label: "Go to settings", group: "Navigate", d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v3M12 19v3M2 12h3M19 12h3", kbd: "G S", result: "Opened Settings" },
  { label: "Go to billing", group: "Navigate", d: "M3 6h18v12H3zM3 10h18M7 15h3", kbd: "G B", result: "Opened Billing" },
  { label: "Toggle sidebar", group: "View", d: "M3 4h18v16H3zM9 4v16", kbd: "⌘B", result: "Sidebar hidden" },
  { label: "Keyboard shortcuts", group: "Help", d: "M3 6h18v12H3zM7 10h1M11 10h1M15 10h1M7 14h10", kbd: "?", result: "Showing shortcuts" },
];

export default function Command() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [log, setLog] = useState<{ text: string; n: number } | null>(null);
  const list = useRef<HTMLDivElement>(null);

  const found = ACTIONS.filter(a => (a.label + a.group).toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(found.map(a => a.group))];
  const ordered = groups.flatMap(g => found.filter(a => a.group === g));

  useEffect(() => {
    const box = list.current, el = box?.querySelector<HTMLElement>(`[data-i="${sel}"]`);
    if (!box || !el) return;
    if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop - 28;
    else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight + 6;
  }, [sel]);

  const run = (a: Action) => { setLog(l => ({ text: a.result, n: (l?.n ?? 0) + 1 })); setQ(""); setSel(0); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, ordered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && ordered[sel]) { e.preventDefault(); run(ordered[sel]); }
  };

  let idx = -1;
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-line2 bg-surface" onKeyDown={onKey}>
        <div className="flex items-center gap-2.5 border-b border-line px-3.5">
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5" className="h-4 w-4 text-ink3" />
          <input value={q} onChange={e => { setQ(e.target.value); setSel(0); }} placeholder="Type a command or search" aria-label="Command"
            className="h-12 w-full bg-transparent text-sm placeholder:text-ink3 focus:outline-none" />
        </div>
        <div ref={list} className="relative max-h-[220px] overflow-y-auto p-1.5">
          {groups.map(g => (
            <div key={g}>
              <div className="px-2 pb-1 pt-2 text-[11px] font-medium text-ink3">{g}</div>
              {found.filter(a => a.group === g).map(a => {
                idx++;
                const mine = idx;
                return (
                  <button key={a.label} data-i={mine} onMouseMove={() => setSel(mine)} onClick={() => run(a)}
                    className={cx("flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] transition-colors duration-200", sel === mine ? "bg-surface2 text-ink" : "text-ink2")}>
                    <span className={sel === mine ? "text-ink" : "text-ink3"}><Icon d={a.d} /></span>
                    {a.label}
                    <span className="ml-auto">{a.kbd && <Kbd>{a.kbd}</Kbd>}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {!found.length && <div className="px-2.5 py-7 text-center text-[13px] text-ink3">No results for “{q}”</div>}
        </div>
        <div className="flex h-10 items-center gap-3 border-t border-line px-3.5 text-[11.5px] text-ink3">
          {log ? (
            <span key={log.n} className="flex items-center gap-1.5 text-ink2" style={{ animation: "cmd-in .5s ease" }}>
              <Icon d="M20 6 9 17l-5-5" className="h-3.5 w-3.5 text-green" />{log.text}
            </span>
          ) : <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> move <Kbd>↵</Kbd> run</span>}
          <style>{`@keyframes cmd-in { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
        </div>
      </div>
    </div>
  );
}

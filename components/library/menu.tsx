"use client";
/**
 * Menu · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Dropdown" | "Context". Arrow keys move focus; Escape closes.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-[15px] w-[15px]" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);

type Item = { label: string; d: string; kbd?: string; danger?: boolean } | "sep";

function MenuPanel({ items, onPick, onClose, style, className = "" }: { items: Item[]; onPick: (label: string) => void; onClose: () => void; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(); }, []);
  const onKey = (e: React.KeyboardEvent) => {
    const els = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const at = els.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") { e.preventDefault(); els[(at + 1) % els.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); els[(at - 1 + els.length) % els.length]?.focus(); }
    if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); onClose(); }
  };
  return (
    <div ref={ref} role="menu" onKeyDown={onKey} style={{ ...style, animation: "menu-in .35s cubic-bezier(.16,1,.3,1)" }}
      className={cx("z-30 w-56 rounded-xl border border-line2 bg-surface p-1 shadow-[var(--shadow-pop)]", className)}>
      {items.map((it, i) => it === "sep" ? <div key={i} className="-mx-1 my-1 h-px bg-line" /> : (
        <button key={it.label} role="menuitem" tabIndex={-1} onClick={() => { onPick(it.label); onClose(); }}
          className={cx("flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] outline-none transition-colors duration-200",
            it.danger ? "text-red hover:bg-redbg focus:bg-redbg" : "text-ink2 hover:bg-surface2 hover:text-ink focus:bg-surface2 focus:text-ink")}>
          <Icon d={it.d} />{it.label}
          {it.kbd && <span className="ml-auto font-mono text-[11px] text-ink3">{it.kbd}</span>}
        </button>
      ))}
    </div>
  );
}

function useOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) fn(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, fn, active]);
}

const ACCOUNT: Item[] = [
  { label: "Profile", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6", kbd: "⇧P" },
  { label: "Settings", d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v3M12 19v3M2 12h3M19 12h3", kbd: "⌘," },
  { label: "Shortcuts", d: "M3 6h18v12H3zM7 10h1M11 10h1M15 10h1M7 14h10", kbd: "?" },
  "sep",
  { label: "Sign out", d: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10", danger: true },
];
const FILE: Item[] = [
  { label: "Copy", d: "M9 9h10v10H9zM5 15V5h10", kbd: "⌘C" },
  { label: "Rename", d: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4", kbd: "⌘R" },
  { label: "Share", d: "M4 12v8h16v-8M12 3v13M7 8l5-5 5 5" },
  "sep",
  { label: "Delete", d: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", kbd: "⌫", danger: true },
];

function Dropdown() {
  const [open, setOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(ref, close, open);
  if (signedOut) {
    return (
      <div className="flex flex-col items-center gap-3 self-center">
        <p className="text-[13px] text-ink2">You’re signed out.</p>
        <button onClick={() => { setSignedOut(false); setLast(null); }} className="h-8 rounded-lg border border-line2 px-3 text-[13px] hover:bg-surface2">Sign back in</button>
      </div>
    );
  }
  return (
    <div ref={ref} className="relative flex flex-col items-start">
      <button onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}
        className={cx("flex h-10 items-center gap-2.5 rounded-xl border bg-surface pl-1.5 pr-2.5 transition-colors duration-300", open ? "border-line2 bg-surface2" : "border-line hover:border-line2")}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9a86c9] text-[10.5px] font-semibold text-white">MS</span>
        <span className="text-left"><span className="block text-[12.5px] font-medium leading-tight">Mira Sato</span><span className="block text-[11px] leading-tight text-ink3">Design team</span></span>
        <span className={cx("ml-1.5 text-ink3 transition-transform duration-300", open && "rotate-180")}><Icon d="m6 9 6 6 6-6" className="h-3 w-3" /></span>
      </button>
      {open && <MenuPanel items={ACCOUNT} onClose={close} onPick={l => (l === "Sign out" ? setSignedOut(true) : setLast(l))} className="absolute left-0 top-12" />}
      <p className="mt-3 h-4 text-xs text-ink3">{last ? `Opened ${last}` : " "}</p>
    </div>
  );
}

function Context() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [name, setName] = useState("Q3 roadmap.pdf");
  const [status, setStatus] = useState("Right-click the file");
  const [deleted, setDeleted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setPos(null), []);
  useOutside(ref, close, !!pos);
  const pick = (l: string) => {
    if (l === "Delete") { setDeleted(true); setStatus("Moved to trash"); }
    else if (l === "Rename") { setName(n => (n.startsWith("Final") ? "Q3 roadmap.pdf" : "Final Q3 roadmap.pdf")); setStatus("Renamed"); }
    else setStatus(l === "Copy" ? "Copied to clipboard" : "Share link ready");
  };
  return (
    <div ref={ref}
      onContextMenu={e => { e.preventDefault(); const r = ref.current!.getBoundingClientRect(); setPos({ x: Math.min(e.clientX - r.left, r.width - 230), y: Math.min(e.clientY - r.top, r.height - 200) }); }}
      className="relative flex h-full max-h-60 w-full max-w-sm select-none flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line2">
      {deleted ? (
        <button onClick={() => { setDeleted(false); setStatus("Restored"); }} className="text-[13px] text-ink2 underline-offset-2 hover:underline">Restore file</button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-12 w-10 items-center justify-center rounded-md border border-line2 bg-surface text-[10px] font-medium text-red">PDF</span>
          <span className="text-[12.5px]">{name}</span>
        </div>
      )}
      <span className="text-xs text-ink3">{status}</span>
      {pos && <MenuPanel items={FILE} onPick={pick} onClose={close} className="absolute" style={{ left: pos.x, top: pos.y }} />}
    </div>
  );
}

export default function MenuDemo({ variant = "Dropdown" }: { variant?: string }) {
  return (
    <div className={cx("relative flex h-full w-full justify-center", variant === "Dropdown" ? "items-start pt-8" : "items-center")}>
      <style>{`@keyframes menu-in { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: none } }`}</style>
      {variant === "Dropdown" ? <Dropdown /> : <Context />}
    </div>
  );
}

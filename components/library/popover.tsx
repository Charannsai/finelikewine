"use client";
/**
 * Tooltip & Popover · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Tooltip" | "Popover"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);

export function Tooltip({ tip, children }: { tip: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11.5px] font-medium text-onink opacity-0 transition-[opacity,transform] duration-300 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-hover/tip:delay-300 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100">
        {tip}
      </span>
    </span>
  );
}

const TOOLS = [
  { label: "Bold", key: "⌘B", d: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" },
  { label: "Italic", key: "⌘I", d: "M10 5h8M6 19h8M14 5l-4 14" },
  { label: "Link", key: "⌘K", d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" },
  { label: "Quote", key: "⇧⌘.", d: "M6 7h4v6H6zM14 7h4v6h-4zM6 13c0 2 1 4 3 4M14 13c0 2 1 4 3 4" },
];
function Toolbar() {
  const [on, setOn] = useState<string[]>(["Bold"]);
  const style = { fontWeight: on.includes("Bold") ? 600 : 400, fontStyle: on.includes("Italic") ? "italic" : "normal", textDecoration: on.includes("Link") ? "underline" : "none" } as React.CSSProperties;
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="flex items-center gap-0.5 rounded-xl border border-line2 bg-surface p-1">
        {TOOLS.map(t => (
          <Tooltip key={t.label} tip={<span className="flex items-center gap-2">{t.label}<span className="font-mono text-[10.5px] opacity-60">{t.key}</span></span>}>
            <button aria-label={t.label} aria-pressed={on.includes(t.label)} onClick={() => setOn(o => (o.includes(t.label) ? o.filter(x => x !== t.label) : [...o, t.label]))}
              className={cx("flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300", on.includes(t.label) ? "bg-surface2 text-ink" : "text-ink3 hover:bg-surface2 hover:text-ink")}>
              <Icon d={t.d} />
            </button>
          </Tooltip>
        ))}
      </div>
      <p className={cx("rounded-lg border border-line px-4 py-3 text-[14px] leading-relaxed transition-all duration-500", on.includes("Quote") ? "border-l-[3px] border-l-wine text-ink2" : "text-ink")} style={style}>
        Good tools disappear into the work.
      </p>
    </div>
  );
}

const MOODS = ["Bad", "Okay", "Good", "Great"];
function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const out = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", out);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", out); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(o => !o); setSent(false); }} aria-expanded={open}
        className={cx("flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[13px] transition-colors duration-300", open ? "border-line2 bg-surface2" : "border-line2 bg-surface hover:bg-surface2")}>
        <Icon d="M4 5h16v11H8l-4 4z" />Feedback
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-20 mt-2.5 w-72 -translate-x-1/2 rounded-xl border border-line2 bg-surface p-3.5 shadow-[var(--shadow-pop)]" style={{ animation: "pop-in .5s cubic-bezier(.16,1,.3,1)" }}>
          <span className="absolute -top-[6px] left-1/2 h-[11px] w-[11px] -translate-x-1/2 rotate-45 border-l border-t border-line2 bg-surface" />
          {sent ? (
            <div className="flex flex-col items-center py-4 text-center" style={{ animation: "pop-in .5s cubic-bezier(.16,1,.3,1)" }}>
              <span className="text-green"><Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8 12l3 3 5-6" className="h-6 w-6" /></span>
              <div className="mt-2 text-[13px] font-medium">Thanks, that helps.</div>
              <div className="mt-0.5 text-xs text-ink3">You said it was {MOODS[mood ?? 0].toLowerCase()}.</div>
            </div>
          ) : (
            <>
              <div className="text-[13px] font-medium">How is the new editor?</div>
              <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                {MOODS.map((m, i) => <button key={m} onClick={() => setMood(i)} className={cx("h-8 rounded-lg border text-xs transition-colors duration-300", mood === i ? "border-wine bg-winebg text-wine" : "border-line text-ink2 hover:border-line2")}>{m}</button>)}
              </div>
              <textarea rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="What would make it better?" className="mt-2.5 w-full rounded-lg border border-line2 bg-surface px-3 py-2 text-[12.5px] placeholder:text-ink3 focus:border-wine focus:outline-none" />
              <div className="mt-2.5 flex justify-end">
                <button disabled={mood === null} onClick={() => { setSent(true); setMood(mood); setText(""); }} className="h-7 rounded-md bg-ink px-3 text-xs font-medium text-onink hover:bg-ink/85 disabled:opacity-40">Send</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function PopoverDemo({ variant = "Tooltip" }: { variant?: string }) {
  return (
    <div className={cx("relative flex h-full w-full justify-center", variant === "Popover" ? "items-start pt-6" : "items-center")}>
      <style>{`@keyframes pop-in { from { opacity: 0; transform: translate(-50%, -4px) scale(.98) } to { opacity: 1; transform: translate(-50%, 0) } }`}</style>
      {variant === "Tooltip" ? <Toolbar /> : <FeedbackPopover />}
    </div>
  );
}

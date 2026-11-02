"use client";
/**
 * Sortable · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Pointer events only: drag a row by its handle, the others slide aside, order commits on release.
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const H = 46;
const START = ["Write the release notes", "Record the demo video", "Fix the Safari scroll bug", "Update the pricing page", "Reply to Dana"];

export default function Sortable() {
  const [order, setOrder] = useState(START);
  const [drag, setDrag] = useState<{ i: number; y0: number; dy: number } | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const target = drag ? Math.max(0, Math.min(order.length - 1, Math.round(drag.i + drag.dy / H))) : -1;

  const drop = () => {
    if (!drag) return;
    const next = [...order];
    const [moved] = next.splice(drag.i, 1);
    next.splice(target, 0, moved);
    setOrder(next);
    setDrag(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="relative w-full max-w-sm select-none" style={{ height: order.length * H - 6 }}>
        {order.map((t, j) => {
          let y = j * H;
          if (drag) {
            if (j === drag.i) y += drag.dy;
            else if (drag.i < target && j > drag.i && j <= target) y -= H;
            else if (drag.i > target && j >= target && j < drag.i) y += H;
          }
          const me = drag?.i === j;
          const isDone = done.includes(t);
          return (
            <div key={t} className={cx("absolute inset-x-0 flex h-10 items-center gap-2.5 rounded-xl border bg-surface px-2.5 text-[13px]",
              me ? "z-10 border-wine/50 shadow-[var(--shadow-pop)]" : "border-line2 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]")}
              style={{ transform: `translateY(${y}px) scale(${me ? 1.03 : 1})` }}>
              <span aria-label="Drag to reorder"
                onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag({ i: j, y0: e.clientY, dy: 0 }); }}
                onPointerMove={e => { if (drag?.i === j) setDrag({ ...drag, dy: e.clientY - drag.y0 }); }}
                onPointerUp={drop} onPointerCancel={drop}
                className={cx("grid h-7 w-5 touch-none grid-cols-2 place-content-center gap-[3px] text-ink3", me ? "cursor-grabbing" : "cursor-grab")}>
                {Array.from({ length: 6 }, (_, k) => <i key={k} className="h-[3px] w-[3px] rounded-full bg-current" />)}
              </span>
              <button onClick={() => setDone(d => (d.includes(t) ? d.filter(x => x !== t) : [...d, t]))} aria-label={`Mark “${t}” done`}
                className={cx("flex h-4 w-4 flex-none items-center justify-center rounded-[5px] border transition-colors duration-300", isDone ? "border-green bg-green text-onink" : "border-line2")}>
                {isDone && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="M20 6 9 17l-5-5" /></svg>}
              </button>
              <span className={cx("truncate transition-colors duration-500", isDone && "text-ink3 line-through")}>{t}</span>
              <span className="ml-auto font-mono text-[11px] text-ink3">{j + 1}</span>
            </div>
          );
        })}
      </div>
      <span className="text-xs text-ink3">{drag ? `Moving to position ${target + 1}` : `${done.length} of ${order.length} done`}</span>
    </div>
  );
}

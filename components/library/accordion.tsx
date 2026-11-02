"use client";
/**
 * Accordion · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Height animates with grid-template-rows 0fr → 1fr, so no measuring is needed.
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const FAQ = [
  ["Do I install a package?", "No. Every component is one plain file. Copy it into your project and import it from there. You own the code and can change anything."],
  ["Does it work with dark mode?", "Yes. Colors are CSS variables on the root element. Switch the data-theme attribute and every component follows, charts included."],
  ["Is it accessible?", "Menus move focus with arrow keys, dialogs close on Escape, and switches and checkboxes expose their state to screen readers."],
  ["Which versions does it target?", "Next.js 16, React 19 and Tailwind CSS 4. Nothing else is required."],
];

export default function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="w-full max-w-xl divide-y divide-line rounded-xl border border-line2 bg-surface">
        {FAQ.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q}>
              <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="group flex w-full items-center gap-3 px-4 py-3.5 text-left text-[13.5px] font-medium">
                <span className="font-mono text-[11px] text-ink3">{String(i + 1).padStart(2, "0")}</span>
                <span className={cx("flex-1 transition-colors duration-500", on ? "text-ink" : "text-ink2 group-hover:text-ink")}>{q}</span>
                <span className="relative h-3 w-3 text-ink3">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-sm bg-current" />
                  <span className={cx("absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-sm bg-current transition-transform duration-500", on && "scale-y-0")} />
                </span>
              </button>
              <div className={cx("grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.16,1,.3,1)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className={cx("pb-4 pl-[46px] pr-6 text-[13px] leading-relaxed text-ink3 transition-[opacity,filter] duration-700", on ? "opacity-100 blur-0" : "opacity-0 blur-[3px]")}>{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

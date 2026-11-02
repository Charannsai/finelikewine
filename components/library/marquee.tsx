"use client";
/**
 * Marquee · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * The row is rendered twice and slid from 0 to -100%, so the loop has no seam.
 */
import React, { useState } from "react";

export function Marquee({ children, seconds = 40, reverse, gap = 40 }: { children: React.ReactNode; seconds?: number; reverse?: boolean; gap?: number }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      {[0, 1].map(k => (
        <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center group-hover:[animation-play-state:paused]"
          style={{ gap, paddingRight: gap, animation: `marquee ${seconds}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}>
          {children}
        </div>
      ))}
    </div>
  );
}

const BRANDS = [
  ["Voltline", "M13 2 4 14h7l-1 8 9-12h-7z"], ["Northwind", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"],
  ["Ledgerly", "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"], ["Orbital", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 12c0-3 4-5 9-5s9 2 9 5-4 5-9 5-9-2-9-5Z"],
  ["Keystone", "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"], ["Lumen", "M12 3v3M12 18v3M3 12h3M18 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  ["Stackwise", "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5"], ["Tallyho", "M5 20V10M12 20V4M19 20v-7"],
];
const QUOTES = ["“Finally, a pricing page we didn’t have to explain.” · Copperline", "“Shipped the redesign in a week.” · Halvard", "“Our support tickets dropped by a third.” · Nortide", "“The calmest dashboard we’ve used.” · Fern & Co"];

export default function MarqueeDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-5">
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
      <Marquee seconds={50}>
        {BRANDS.map(([name, d]) => (
          <button key={name} onClick={() => setPicked(name)} className={`flex items-center gap-2 text-lg font-semibold tracking-tight transition-colors duration-500 ${picked === name ? "text-wine" : "text-ink3 hover:text-ink"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d={d} /></svg>{name}
          </button>
        ))}
      </Marquee>
      <Marquee seconds={70} reverse gap={12}>
        {QUOTES.map(q => <span key={q} className="whitespace-nowrap rounded-xl border border-line2 bg-surface px-3.5 py-2 text-[13px] text-ink2">{q}</span>)}
      </Marquee>
      <p className="text-center text-xs text-ink3">{picked ? `${picked} selected` : "Hover to pause, click a logo to pick it."}</p>
    </div>
  );
}

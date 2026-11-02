"use client";
/**
 * Spotlight · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Cards" | "Beam"
 */
import React, { useState } from "react";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d={d} /></svg>
);

/* Writes the pointer position into --x / --y; the background reads them. */
export function SpotlightCard({ children, className = "", active, onClick }: { children: React.ReactNode; className?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`); }}
      className={`group relative overflow-hidden rounded-2xl border bg-surface p-3.5 text-left transition-colors duration-700 ${active ? "border-wine/50" : "border-line2 hover:border-ink3/40"} ${className}`}>
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), var(--accent-bg), transparent 65%)" }} />
      <span className="relative block">{children}</span>
    </button>
  );
}

const CARDS = [
  { t: "Fast", d: "Under 4 KB", p: "M13 2 4 14h7l-1 8 9-12h-7z" },
  { t: "Private", d: "No tracking", p: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" },
  { t: "Typed", d: "Strict TypeScript", p: "M8 7l-5 5 5 5M16 7l5 5-5 5" },
  { t: "Themed", d: "Light and dark", p: "M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" },
];
function Cards() {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <div className="grid w-full grid-cols-2 gap-2">
        {CARDS.map(c => (
          <SpotlightCard key={c.t} active={pick === c.t} onClick={() => setPick(c.t)}>
            <span className="text-wine"><Icon d={c.p} /></span>
            <span className="mt-2.5 block text-[13px] font-medium">{c.t}</span>
            <span className="block text-xs text-ink3">{c.d}</span>
          </SpotlightCard>
        ))}
      </div>
      <span className="h-4 text-xs text-ink3">{pick ? `${pick} is the one you care about` : "Move across the cards"}</span>
    </div>
  );
}

function Beam() {
  const [claimed, setClaimed] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-[18px] p-px">
      <span aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite]"
        style={{ background: "conic-gradient(from 0deg, var(--line2) 0 65%, var(--accent) 82%, var(--line2) 100%)" }} />
      <div className="relative flex w-64 flex-col items-center rounded-[17px] bg-surface px-5 py-6 text-center">
        <span className="text-wine"><Icon d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5" /></span>
        <div className="mt-3 text-[15px] font-semibold tracking-tight">{claimed ? "It’s yours" : "Pro, for a year"}</div>
        <p className="mt-1 text-[12.5px] text-ink3">{claimed ? "Pro is active until next November." : "A light runs the border, slowly."}</p>
        <button onClick={() => setClaimed(c => !c)} className={`mt-3.5 h-8 rounded-lg px-3 text-[13px] font-medium transition-colors duration-500 ${claimed ? "bg-greenbg text-green" : "bg-ink text-onink hover:bg-ink/85"}`}>
          {claimed ? "Claimed" : "Claim it"}
        </button>
      </div>
    </div>
  );
}

export default function SpotlightDemo({ variant = "Cards" }: { variant?: string }) {
  return <div className="relative flex h-full w-full items-center justify-center">{variant === "Cards" ? <Cards /> : <Beam />}</div>;
}

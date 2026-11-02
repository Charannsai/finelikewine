"use client";
/**
 * Avatars · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 */
import React, { useState } from "react";

const PEOPLE = [
  ["Ana Lopes", "AL", "#c97a8c", true], ["Bilal Khan", "BK", "#7d9bd8", true], ["Chen Wei", "CW", "#6fae84", true],
  ["Dara Okafor", "DO", "#c9a35a", false], ["Elif Demir", "ED", "#9a86c9", false], ["Felix Braun", "FB", "#6fa9ab", false],
  ["Grace Ito", "GI", "#c97a8c", false], ["Hugo Martin", "HM", "#7d9bd8", false],
] as const;

export default function Avatars() {
  const [spread, setSpread] = useState(false);
  const [all, setAll] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const shown = all ? PEOPLE : PEOPLE.slice(0, 5);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center" onPointerEnter={() => setSpread(true)} onPointerLeave={() => setSpread(false)}>
        {shown.map(([name, ini, color, online], i) => (
          <span key={ini} className="group relative transition-[margin] duration-700 ease-[cubic-bezier(.3,1.2,.4,1)]" style={{ marginLeft: i === 0 ? 0 : spread ? 6 : -14, zIndex: shown.length - i }}>
            <button onClick={() => setPicked(name)} aria-label={name}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[11.5px] font-semibold text-white ring-[3px] transition-transform duration-500 group-hover:-translate-y-1 ${picked === name ? "ring-wine" : "ring-surface"}`}
              style={{ background: color }}>{ini}</button>
            {online && <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green ring-2 ring-surface" />}
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[11px] text-onink opacity-0 transition-opacity duration-300 group-hover:opacity-100">{name}</span>
          </span>
        ))}
        {!all && (
          <button onClick={() => setAll(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface3 font-mono text-xs text-ink2 ring-[3px] ring-surface transition-[margin] duration-700" style={{ marginLeft: spread ? 6 : -14 }}>
            +{PEOPLE.length - 5}
          </button>
        )}
      </div>
      <p className="h-4 text-xs text-ink3">
        {picked ? <>Assigned to <span className="text-ink">{picked}</span></> : all ? <button onClick={() => setAll(false)} className="hover:text-ink">Show fewer</button> : "3 online. Hover to spread, click to assign."}
      </p>
    </div>
  );
}

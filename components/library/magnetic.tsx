"use client";
/**
 * Magnetic · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Buttons" | "Icons"
 */
import React, { useRef, useState } from "react";

/* Pulls its child toward the pointer, then springs back. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, active: false });
  return (
    <span ref={ref} className="inline-flex"
      onPointerMove={e => {
        const r = ref.current!.getBoundingClientRect();
        setT({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, active: true });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0, active: false })}
      style={{ transform: `translate(${t.x}px, ${t.y}px)`, transition: t.active ? "transform .15s ease-out" : "transform .8s cubic-bezier(.2,1.5,.4,1)" }}>
      {children}
    </span>
  );
}

const ICONS = [
  { label: "GitHub", d: "M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" },
  { label: "Mail", d: "M3 6h18v12H3zM3 7l9 6 9-6" },
  { label: "Share", d: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4" },
  { label: "Save", d: "M6 3h12v18l-6-4-6 4z" },
];

function Buttons() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Magnetic strength={0.4}>
          <button onClick={() => setN(n + 1)} className="flex h-12 items-center rounded-xl bg-ink px-6 text-sm font-medium text-onink transition-colors duration-300 hover:bg-ink/85">
            <Magnetic strength={0.25}><span className="flex items-center gap-2">Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span></Magnetic>
          </button>
        </Magnetic>
        <Magnetic strength={0.3}>
          <button className="h-12 rounded-xl border border-line2 bg-surface px-6 text-sm font-medium transition-colors duration-300 hover:bg-surface2">Book a demo</button>
        </Magnetic>
      </div>
      <span className="text-xs text-ink3">{n ? `Started ${n} time${n > 1 ? "s" : ""}` : "Move your cursor near the buttons"}</span>
    </div>
  );
}

function Icons() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-2.5">
        {ICONS.map(ic => (
          <Magnetic key={ic.label} strength={0.55}>
            <button aria-label={ic.label} onClick={() => setPicked(ic.label)}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-surface transition-colors duration-300 active:scale-95 ${picked === ic.label ? "border-wine/50 text-wine" : "border-line2 text-ink2 hover:text-ink"}`}>
              <Magnetic strength={0.3}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d={ic.d} /></svg>
              </Magnetic>
            </button>
          </Magnetic>
        ))}
      </div>
      <span className="text-xs text-ink3">{picked ? `${picked} selected` : "Pick one"}</span>
    </div>
  );
}

export default function MagneticDemo({ variant = "Buttons" }: { variant?: string }) {
  return <div className="relative flex h-full w-full items-center justify-center">{variant === "Buttons" ? <Buttons /> : <Icons />}</div>;
}

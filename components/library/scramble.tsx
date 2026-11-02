"use client";
/**
 * Scramble · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Hover" | "On view"
 */
import React, { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

function useScramble(text: string, duration = 800) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = (t: number) => {
      const settled = Math.floor(((t - t0) / duration) * text.length);
      setOut(Array.from(text).map((c, i) => (c === " " || i < settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (settled < text.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  return [out, run] as const;
}

export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const [out, run] = useScramble(text);
  return <span onPointerEnter={run} className={`cursor-default font-mono ${className}`} aria-label={text}>{out}</span>;
}

function OnView() {
  const ref = useRef<HTMLDivElement>(null);
  const [out, run] = useScramble("ACCESS GRANTED", 1100);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} className="flex flex-col items-center gap-5">
      <span className="font-mono text-[26px] font-medium text-green" aria-label="Access granted">{out}</span>
      <button onClick={() => { run(); setCount(c => c + 1); }} className="h-8 rounded-lg border border-line2 px-3 text-[12.5px] transition-colors duration-300 hover:bg-surface2">
        Replay{count ? ` · ${count}` : ""}
      </button>
    </div>
  );
}

export default function ScrambleDemo({ variant = "Hover" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {variant === "Hover" ? (
        <div className="flex flex-col items-center gap-1">
          {["DEPLOY", "ENCRYPT", "DECODE", "RELEASE"].map(w => <Scramble key={w} text={w} className="text-[30px] font-medium text-ink2 transition-colors duration-500 hover:text-wine" />)}
        </div>
      ) : <OnView />}
    </div>
  );
}

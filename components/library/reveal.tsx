"use client";
/**
 * Blur reveal · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Words" | "Letters" | "Lines". Plays when scrolled into view; Replay runs it again.
 */
import React, { useEffect, useRef, useState } from "react";

export function BlurReveal({ parts, step, className = "", block }: { parts: string[]; step: number; className?: string; block?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { requestAnimationFrame(() => setShown(true)); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} aria-label={parts.join(block ? " " : "")}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden className={block ? "block" : "inline-block whitespace-pre"}
          style={{
            opacity: shown ? 1 : 0, filter: shown ? "blur(0)" : "blur(8px)", transform: shown ? "none" : "translateY(0.25em)",
            transition: `opacity 1.2s cubic-bezier(.16,1,.3,1) ${i * step}ms, filter 1.2s cubic-bezier(.16,1,.3,1) ${i * step}ms, transform 1.2s cubic-bezier(.16,1,.3,1) ${i * step}ms`,
          }}>
          {p}
        </span>
      ))}
    </span>
  );
}

const words = (s: string) => s.split(" ").map((w, i, a) => (i < a.length - 1 ? w + " " : w));

export default function RevealDemo({ variant = "Words" }: { variant?: string }) {
  const [run, setRun] = useState(0);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 text-center">
      <div key={run} className="min-h-[120px] max-w-md">
        {variant === "Words" && <BlurReveal parts={words("Good interfaces disappear. You notice the work, not the tool.")} step={90} className="text-[26px] font-medium leading-tight tracking-tight" />}
        {variant === "Letters" && <BlurReveal parts={Array.from("Fine like wine.")} step={60} className="text-[44px] font-medium tracking-tight" />}
        {variant === "Lines" && <BlurReveal block parts={["Press it.", "Drag it.", "Type into it.", "Then copy it."]} step={220} className="text-[22px] font-medium leading-snug tracking-tight" />}
      </div>
      <button onClick={() => setRun(r => r + 1)} className="h-8 rounded-lg border border-line2 px-3 text-[12.5px] transition-colors duration-300 hover:bg-surface2">Replay</button>
    </div>
  );
}

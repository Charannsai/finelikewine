"use client";
import React, { useEffect, useRef, useState } from "react";
import { cx } from "./ui";

/* One observer for the whole app: anything with [data-reveal] blurs in when it enters the viewport,
   and any .spot element gets a cursor-following light. */
export function MotionRoot() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { (e.target as HTMLElement).dataset.shown = ""; io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    const scan = (root: Element | Document) => root.querySelectorAll("[data-reveal]:not([data-shown])").forEach(el => io.observe(el));
    scan(document);
    const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (!(n instanceof Element)) return;
      if (n.matches("[data-reveal]:not([data-shown])")) io.observe(n);
      scan(n);
    })));
    mo.observe(document.body, { childList: true, subtree: true });

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".glow");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { io.disconnect(); mo.disconnect(); document.removeEventListener("pointermove", onMove); };
  }, []);
  return null;
}

export function useInView<T extends Element>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); } else if (!once) setInView(false);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as const;
}

/* Words (or letters) arrive one by one out of a blur. */
export function BlurText({ text, by = "word", step = 55, delay = 0, className = "" }: { text: string; by?: "word" | "letter"; step?: number; delay?: number; className?: string }) {
  const parts = by === "word" ? text.split(" ") : Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden data-reveal="soft" className="inline-block whitespace-pre" style={{ "--d": `${delay + i * step}ms` } as React.CSSProperties}>
          {p}{by === "word" && i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* Slot-machine digits. Columns roll to the target when the number scrolls into view. */
export function NumberTicker({ value, className = "", format }: { value: number; className?: string; format?: (n: number) => string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const text = format ? format(value) : value.toLocaleString();
  return (
    <span ref={ref} className={cx("inline-flex tabular-nums leading-none", className)} aria-label={text}>
      {Array.from(text).map((ch, i) => {
        const d = ch >= "0" && ch <= "9" ? +ch : -1;
        if (d < 0) return <span key={i} aria-hidden>{ch}</span>;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden" style={{ width: "0.62em" }}>
            <span className="absolute left-0 top-0 flex flex-col transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.9,.25,1)]"
              style={{ transform: `translateY(${-(inView ? d : 0)}em)`, transitionDelay: `${i * 40}ms` }}>
              {"0123456789".split("").map(n => <span key={n} className="block h-[1em] text-center">{n}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* Pulls its child toward the pointer. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, on: false });
  return (
    <span ref={ref} className={cx("inline-flex", className)}
      onPointerMove={e => { const r = ref.current!.getBoundingClientRect(); setT({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, on: true }); }}
      onPointerLeave={() => setT({ x: 0, y: 0, on: false })}
      style={{ transform: `translate(${t.x}px, ${t.y}px)`, transition: t.on ? "transform .12s ease-out" : "transform .6s cubic-bezier(.2,1.6,.4,1)" }}>
      {children}
    </span>
  );
}

/* 3D tilt with a moving glare. */
export function Tilt({ children, max = 10, className = "", glare = true }: { children: React.ReactNode; max?: number; className?: string; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  return (
    <div className={cx("[perspective:900px]", className)}>
      <div ref={ref}
        onPointerMove={e => { const r = ref.current!.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; setS({ rx: (0.5 - py) * max * 2, ry: (px - 0.5) * max * 2, gx: px * 100, gy: py * 100, on: true }); }}
        onPointerLeave={() => setS({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
        className="relative [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`, transition: s.on ? "transform .08s linear" : "transform .7s cubic-bezier(.2,1.4,.4,1)" }}>
        {children}
        {glare && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300" style={{ opacity: s.on ? 1 : 0, background: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,.28), transparent 55%)`, mixBlendMode: "overlay", borderRadius: "inherit" }} />}
      </div>
    </div>
  );
}

/* Infinite horizontal scroll with faded edges. */
export function Marquee({ children, speed = 40, reverse, className = "" }: { children: React.ReactNode; speed?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={cx("group/mq flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]", className)}>
      {[0, 1].map(k => (
        <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-[inherit] pr-[var(--mq-gap,2.5rem)] [animation:flw-marquee_var(--mq-dur)_linear_infinite] group-hover/mq:[animation-play-state:paused]"
          style={{ "--mq-dur": `${speed}s`, animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}>
          {children}
        </div>
      ))}
    </div>
  );
}

/* Text that decodes from random glyphs. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
export function Scramble({ text, trigger = "hover", className = "" }: { text: string; trigger?: "hover" | "view"; className?: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const [ref, inView] = useInView<HTMLSpanElement>(false);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (t: number) => {
      const k = (t - start) / 700;
      const settled = Math.floor(k * text.length);
      setOut(Array.from(text).map((c, i) => c === " " ? " " : i < settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join(""));
      if (settled < text.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => {
    if (trigger !== "view" || !inView) return;
    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, trigger]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return <span ref={ref} onPointerEnter={trigger === "hover" ? run : undefined} className={cx("font-mono", className)} aria-label={text}>{out}</span>;
}

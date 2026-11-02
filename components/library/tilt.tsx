"use client";
/**
 * Tilt · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Pointer tilt with a moving glare; click to flip.
 */
import React, { useRef, useState } from "react";

export function Tilt({ children, max = 12 }: { children: React.ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  return (
    <div className="[perspective:900px]">
      <div ref={ref} className="relative rounded-2xl [transform-style:preserve-3d]"
        onPointerMove={e => {
          const r = ref.current!.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          setS({ rx: (0.5 - py) * max * 2, ry: (px - 0.5) * max * 2, gx: px * 100, gy: py * 100, on: true });
        }}
        onPointerLeave={() => setS({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
        style={{ transform: `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`, transition: s.on ? "transform .1s linear" : "transform 1s cubic-bezier(.2,1.3,.4,1)" }}>
        {children}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 [mix-blend-mode:overlay]"
          style={{ opacity: s.on ? 1 : 0, background: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,.3), transparent 55%)` }} />
      </div>
    </div>
  );
}

export default function TiltCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <Tilt>
        <button onClick={() => setFlipped(!flipped)} aria-label={flipped ? "Show front" : "Show back"}
          className="relative block h-[176px] w-[280px] text-left transition-transform duration-1000 ease-[cubic-bezier(.3,1.2,.4,1)] [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-[18px] text-white [backface-visibility:hidden]" style={{ background: "linear-gradient(135deg,#3a1420,#722e3f 55%,#c97a8c)" }}>
            <div className="flex items-center justify-between"><span className="text-sm font-semibold tracking-tight">finelikewine</span><span className="text-[11px] opacity-70">Debit</span></div>
            <span className="h-[26px] w-9 rounded-[5px]" style={{ background: "linear-gradient(135deg,#f3d9a4,#b98a3e)" }} />
            <div><div className="font-mono text-[15px] tracking-[.12em]">4242 •••• •••• 1881</div><div className="mt-1.5 flex justify-between text-[11px] opacity-80"><span>MIRA SATO</span><span>09 / 29</span></div></div>
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#2a1018] text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mt-5 h-9 bg-black/70" />
            <div className="mx-[18px] mt-4 flex h-[30px] items-center justify-end rounded bg-white/90 px-2.5 font-mono text-[13px] text-black">•••</div>
            <p className="mx-[18px] mt-3 text-[10px] leading-snug opacity-60">A demo card. Click to flip back.</p>
          </div>
        </button>
      </Tilt>
      <span className="text-xs text-ink3">{flipped ? "Back side" : "Move over it, click to flip"}</span>
    </div>
  );
}

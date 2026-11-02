"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SECTIONS, indexOf, type SectionMeta } from "./registry";
import { Code, Kbd, cx } from "./ui";

/* ---------- Inspector context ---------- */
type Insp = { open: string | null; setOpen: (id: string | null) => void };
const InspectCtx = createContext<Insp>({ open: null, setOpen: () => {} });
export const useInspector = () => useContext(InspectCtx);
export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<string | null>(null);
  return <InspectCtx.Provider value={{ open, setOpen }}>{children}</InspectCtx.Provider>;
}

export type Demo = React.ComponentType<{ variant?: string }>;

const Svg = ({ d, className = "h-[13px] w-[13px]" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d} /></svg>
);
const COPY = "M9 9h10v10H9zM5 15V5h10";
const CHECK = "M20 6 9 17l-5-5";
const SPARK = "M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5";
const EXPAND = "M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7";

/* A labelled action. Copy actions confirm in place. */
function Action({ icon, label, onClick, copy }: { icon: string; label: string; onClick?: () => void; copy?: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (
    <button
      onClick={() => {
        if (copy !== undefined) { navigator.clipboard?.writeText(copy); setDone(true); clearTimeout(t.current); t.current = setTimeout(() => setDone(false), 1600); }
        onClick?.();
      }}
      className={cx("flex h-[28px] flex-none items-center gap-[6px] rounded-[8px] border px-[9px] text-[12px] transition-colors duration-500",
        done ? "border-green/40 text-green" : "border-line text-ink2 hover:border-line2 hover:text-ink")}>
      <Svg d={done ? CHECK : icon} />
      {done ? "Copied" : label}
    </button>
  );
}

function Variants({ list, value, onChange }: { list: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-[16px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {list.map(v => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={v === value}
          className={cx("relative whitespace-nowrap py-[4px] text-[12.5px] transition-colors duration-500", v === value ? "text-ink" : "text-ink3 hover:text-ink2")}>
          {v}
          <span className={cx("absolute inset-x-0 -bottom-px h-px bg-ink transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]", v === value ? "scale-x-100" : "scale-x-0")} />
        </button>
      ))}
    </div>
  );
}

export function Tile({ meta, code, Comp, place }: { meta: SectionMeta; code: string; Comp: Demo; place?: React.CSSProperties }) {
  const [variant, setVariant] = useState(meta.variants?.[0] ?? "");
  const { open, setOpen } = useInspector();
  const h = meta.rows * 8 - 16;
  return (
    <div id={meta.id} data-reveal className="scroll-mt-[24px] pb-[16px]" style={place}>
      <article className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-colors duration-700 hover:border-line2" style={{ height: h }}>
        <header className="flex h-[44px] flex-none items-center px-[20px]">
          {meta.variants ? <Variants list={meta.variants} value={variant} onChange={setVariant} /> : <span className="truncate text-[12.5px] text-ink3">{meta.desc}</span>}
        </header>

        <div key={variant} className="anim-fade relative min-h-0 flex-1 px-[16px]">
          <Comp variant={variant} />
        </div>

        <footer className="flex h-[54px] flex-none items-center gap-[6px] border-t border-line px-[14px]">
          <h3 className="min-w-0 flex-1 truncate pl-[4px] text-[13.5px] font-medium tracking-[-0.01em]">{meta.title}</h3>
          <Action icon={SPARK} label="Prompt" copy={meta.prompt} />
          <Action icon={COPY} label="Code" copy={code} />
          <Action icon={EXPAND} label="Open" onClick={() => setOpen(meta.id)} />
        </footer>
      </article>

      {open === meta.id && <Inspector meta={meta} variant={variant} setVariant={setVariant} code={code} Comp={Comp} />}
    </div>
  );
}

function Inspector({ meta, variant, setVariant, code, Comp }: { meta: SectionMeta; variant: string; setVariant: (v: string) => void; code: string; Comp: Demo }) {
  const { setOpen } = useInspector();
  const i = indexOf(meta.id);
  const prev = SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length], next = SECTIONS[(i + 1) % SECTIONS.length];
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const box = useRef<HTMLDivElement>(null);
  const variants = meta.variants;

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    box.current?.focus();
    const ov = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable) { if (e.key === "Escape") t.blur(); return; }
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen(next.id);
      if (e.key === "ArrowLeft") setOpen(prev.id);
      if (variants && /^[1-9]$/.test(e.key) && variants[+e.key - 1]) setVariant(variants[+e.key - 1]);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = ov;
      if (!document.querySelector("[data-inspector]")) {
        document.getElementById(meta.id)?.scrollIntoView({ block: "center" });
        prevFocus?.focus({ preventScroll: true });
      }
    };
  }, [meta.id, next.id, prev.id, setOpen, variants, setVariant]);

  return (
    <div className="anim-fade fixed inset-0 z-[75] bg-paper/80 p-[10px] backdrop-blur-md sm:p-[24px]" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(null); }}>
      <div ref={box} tabIndex={-1} data-inspector role="dialog" aria-modal="true" aria-label={meta.title}
        className="anim-in flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface outline-none">
        <header className="flex flex-wrap items-center gap-[10px] border-b border-line px-[20px] py-[14px]">
          <div key={meta.id} className="anim-in min-w-0 pr-[10px]">
            <h2 className="text-[18px] font-medium tracking-[-0.02em]">{meta.title}</h2>
            <p className="text-[12.5px] text-ink3">{meta.desc}</p>
          </div>
          <span className="flex-1" />
          <div className="flex rounded-[9px] border border-line p-[3px]">
            {(["preview", "code"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={cx("h-[26px] rounded-[6px] px-[12px] text-[12.5px] capitalize transition-colors duration-500", tab === t ? "bg-surface2 text-ink" : "text-ink3 hover:text-ink2")}>{t}</button>
            ))}
          </div>
          <Action icon={SPARK} label="Copy prompt" copy={meta.prompt} />
          <Action icon={COPY} label="Copy code" copy={code} />
          <button onClick={() => setOpen(null)} className="flex h-[28px] items-center gap-[6px] rounded-[8px] border border-line px-[9px] text-[12px] text-ink2 hover:border-line2 hover:text-ink">Close <Kbd>esc</Kbd></button>
        </header>

        {variants && tab === "preview" && (
          <div className="border-b border-line px-[20px] py-[8px]"><Variants list={variants} value={variant} onChange={setVariant} /></div>
        )}

        <div className="relative min-h-0 flex-1">
          {tab === "preview"
            ? <div key={meta.id + variant} className="anim-fade relative h-full px-[20px] py-[16px]"><Comp variant={variant} /></div>
            : <div className="scroll-thin h-full overflow-auto px-[22px] py-[18px]"><Code>{code}</Code></div>}
        </div>

        <footer className="flex items-center gap-[10px] border-t border-line px-[20px] py-[10px] text-[12.5px] text-ink3">
          <button onClick={() => setOpen(prev.id)} className="transition-colors duration-500 hover:text-ink">← {prev.title}</button>
          <span className="flex-1 text-center font-mono text-[11.5px]">{i + 1} / {SECTIONS.length}</span>
          <button onClick={() => setOpen(next.id)} className="transition-colors duration-500 hover:text-ink">{next.title} →</button>
        </footer>
      </div>
    </div>
  );
}

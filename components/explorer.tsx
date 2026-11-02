"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES, SECTIONS, PAGES } from "./registry";
import { InspectorProvider, useInspector } from "./section";
import { Cmdk, cx, useTheme, type CmdkAction } from "./ui";

/* The original FineLikeWine tile: a wine glass on a merlot square. */
export function BrandMark({ size = 22 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/tile-light.svg" alt="" width={size} height={size} className="flex-none" style={{ width: size, height: size }} />;
}

/* The tile nearest the middle of the screen is the one you are reading. */
function useActive() {
  const [active, setActive] = useState(SECTIONS[0].id);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const cy = window.innerHeight / 2, cx0 = window.innerWidth / 2;
      let best = SECTIONS[0].id, dist = Infinity;
      for (const s of SECTIONS) {
        const r = document.getElementById(s.id)?.getBoundingClientRect();
        if (!r) continue;
        const d = Math.hypot((r.top + r.bottom) / 2 - cy, ((r.left + r.right) / 2 - cx0) * 0.35);
        if (d < dist) { dist = d; best = s.id; }
      }
      setActive(best);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return active;
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });

export function Index({ onNavigate, onCommand }: { onNavigate?: () => void; onCommand: () => void }) {
  const active = useActive();
  const [theme, setTheme] = useTheme();
  const list = useRef<HTMLDivElement>(null);
  const items = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [mark, setMark] = useState({ y: 0, h: 0, ready: false });

  useLayoutEffect(() => {
    const el = items.current[active];
    if (!el) return;
    setMark({ y: el.offsetTop, h: el.offsetHeight, ready: true });
    const box = list.current;
    if (box && (el.offsetTop < box.scrollTop + 40 || el.offsetTop > box.scrollTop + box.clientHeight - 80))
      box.scrollTo({ top: el.offsetTop - box.clientHeight / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-[32px] pt-[36px]">
        <Link href="/" className="flex items-center gap-[11px] text-[18px] font-semibold tracking-[-0.025em]">
          <BrandMark size={34} />finelikewine
        </Link>
      </div>

      <div ref={list} className="fade-y relative mt-[28px] min-h-0 flex-1 overflow-y-auto px-[32px] pb-[40px] pt-[8px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative">
          <span aria-hidden className={cx("absolute -left-[14px] w-px bg-ink transition-[transform,height,opacity] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]", mark.ready ? "opacity-100" : "opacity-0")}
            style={{ transform: `translateY(${mark.y + 8}px)`, height: Math.max(0, mark.h - 16) }} />
          {CATEGORIES.map((c, ci) => (
            <div key={c.id} className={ci ? "mt-[26px]" : ""}>
              <div className="mb-[6px] text-[12px] text-ink3/80">{c.title}</div>
              {SECTIONS.filter(s => s.cat === c.id).map(s => (
                <a key={s.id} href={`#${s.id}`} ref={el => { items.current[s.id] = el; }}
                  onClick={e => { e.preventDefault(); go(s.id); onNavigate?.(); }}
                  className={cx("block py-[5px] text-[13.5px] transition-colors duration-500", active === s.id ? "text-ink" : "text-ink3 hover:text-ink2")}>
                  {s.title}
                </a>
              ))}
            </div>
          ))}
          <div className="mt-[26px]">
            <div className="mb-[6px] text-[12px] text-ink3/80">Pages</div>
            {PAGES.map(p => (
              <a key={p.href} href={p.href} className="block py-[5px] text-[13.5px] text-ink3 transition-colors duration-500 hover:text-ink2">{p.title}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[18px] px-[32px] pb-[30px] pt-[14px] text-[12.5px] text-ink3">
        <button onClick={onCommand} className="transition-colors duration-500 hover:text-ink">Search <span className="font-mono text-[11px]">⌘K</span></button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-colors duration-500 hover:text-ink">{theme === "dark" ? "Light" : "Dark"}</button>
        <a href="https://github.com/Charannsai/finelikewine" className="transition-colors duration-500 hover:text-ink">GitHub</a>
      </div>
    </div>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const [cmdk, setCmdk] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [theme, setTheme] = useTheme();
  const { setOpen } = useInspector();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdk(o => !o); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);

  const actions: CmdkAction[] = [
    ...SECTIONS.map(s => ({ label: s.title, icon: s.icon, group: CATEGORIES.find(c => c.id === s.cat)!.title, onSelect: () => setOpen(s.id) })),
    ...PAGES.map(p => ({ label: p.title, icon: p.icon, hint: p.desc, href: p.href, group: "Pages" })),
    { label: theme === "dark" ? "Switch to light" : "Switch to dark", icon: "magic-wand-01", group: "Preferences", onSelect: () => setTheme(theme === "dark" ? "light" : "dark") },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">
        <Index onCommand={() => setCmdk(true)} />
      </aside>

      <div className="sticky top-0 z-40 flex h-[56px] items-center bg-paper/85 px-[20px] backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-[10px] text-[16.5px] font-semibold tracking-[-0.02em]"><BrandMark size={30} />finelikewine</Link>
        <span className="flex-1" />
        <button onClick={() => setDrawer(true)} className="text-[13px] text-ink2">Index</button>
      </div>
      {drawer && (
        <div className="anim-fade fixed inset-0 z-[70] bg-paper/70 backdrop-blur-md lg:hidden" onMouseDown={e => { if (e.target === e.currentTarget) setDrawer(false); }}>
          <div className="anim-in h-full w-[min(280px,86vw)] border-r border-line bg-paper">
            <Index onNavigate={() => setDrawer(false)} onCommand={() => { setDrawer(false); setCmdk(true); }} />
          </div>
        </div>
      )}

      <main className="min-w-0 lg:pl-[248px]">{children}</main>
      {/* Soft edges: components fade out at the top and bottom of the viewport as they scroll. */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[56px] z-30 h-[40px] bg-linear-to-b from-paper to-transparent lg:left-[248px] lg:top-0 lg:h-[64px]" />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[80px] bg-linear-to-t from-paper to-transparent lg:left-[248px]" />
      <Cmdk open={cmdk} onClose={() => setCmdk(false)} actions={actions} />
    </div>
  );
}

export function LibraryShell({ children }: { children: React.ReactNode }) {
  return <InspectorProvider><ShellInner>{children}</ShellInner></InspectorProvider>;
}

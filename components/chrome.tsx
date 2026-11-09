"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon, type IconName } from "./icons";
import { Button, Cmdk, Kbd, useToast, type CmdkAction } from "./ui";

export type NavEntry = { href: string; label: string; icon: IconName; count?: number };
export type NavGroup = { label?: string; items: NavEntry[] };

export function Sidebar({ groups, brand, brandHref = "/", tile }: { groups: NavGroup[]; brand: string; brandHref?: string; tile?: boolean }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".flw-nav[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map: Record<string, HTMLAnchorElement> = {};
    links.forEach(l => { const id = l.getAttribute("href")!.slice(1); const s = document.getElementById(id); if (s) map[id] = l; });
    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove("flw-on"));
          map[e.target.id]?.classList.add("flw-on");
        }
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    Object.keys(map).forEach(id => obs.observe(document.getElementById(id)!));
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="fixed inset-y-0 left-0 z-50 hidden w-[220px] flex-col gap-[2px] overflow-y-auto border-r border-line bg-paper px-[12px] py-[18px] lg:flex" aria-label="Primary">
      <a href={brandHref} className="mb-[14px] flex items-center gap-[9px] px-[8px] text-[14.5px] font-semibold tracking-[-0.01em]">
        {tile ? <Image src="/brand/tile-light.svg" alt="" width={26} height={26} className="rounded-[8px]" />
              : <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-ink text-[13px] font-bold text-paper">{brand[0]}</span>}
        {brand}
      </a>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <div className="px-[9px] pb-[5px] pt-[14px] text-[10.5px] font-semibold uppercase tracking-[.09em] text-ink3">{g.label}</div>}
          {g.items.map(it => (
            <a key={it.label} href={it.href}
              className={`flw-nav flex items-center gap-[9px] rounded-[8px] px-[9px] py-[6.5px] text-[13px] text-ink2 transition-colors hover:bg-black/[.045] ${active === it.href ? "" : ""} [&.flw-on]:bg-winebg [&.flw-on]:font-medium [&.flw-on]:text-winedeep`}>
              <Icon name={it.icon} className="h-[16px] w-[16px] text-ink3 [.flw-on_&]:text-wine" />
              {it.label}
              {it.count != null && <span className="ml-auto rounded-full bg-black/[.06] px-[6px] py-[1px] text-[10.5px] font-medium text-ink2">{it.count}</span>}
            </a>
          ))}
        </div>
      ))}
      <div className="flex-1" />
    </nav>
  );
}

export function Topbar({ crumbs, actions, onMenu }: { crumbs: React.ReactNode; actions: CmdkAction[]; onMenu?: () => void }) {
  const [cmdk, setCmdk] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdk(o => !o); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const withToast = actions.map(a => a.label === "Copy clone URL" ? { ...a, onSelect: () => { navigator.clipboard?.writeText("git clone https://github.com/Charannsai/finelikewine.git"); toast("Clone URL copied"); } } : a);
  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-[12px] border-b border-line bg-paper/85 px-[16px] py-[11px] backdrop-blur lg:px-[26px]">
        <button className="rounded-[8px] p-[7px] hover:bg-black/[.05] lg:hidden" aria-label="Menu" onClick={onMenu}><Icon name="menu-01" /></button>
        <span className="text-[13px] text-ink3">{crumbs}</span>
        <span className="flex-1" />
        <Button variant="secondary" size="sm" onClick={() => setCmdk(true)}><Icon name="search-01" className="h-[14px] w-[14px]" />Search<Kbd>⌘K</Kbd></Button>
        <a href="https://github.com/Charannsai/finelikewine" className="hidden items-center gap-[7px] rounded-[9px] bg-ink px-[11px] py-[6px] text-[12.5px] font-medium text-paper hover:bg-[#2c2824] sm:inline-flex"><Icon name="github" className="h-[14px] w-[14px]" />Star on GitHub</a>
      </div>
      <Cmdk open={cmdk} onClose={() => setCmdk(false)} actions={withToast} />
    </>
  );
}

export function Shell({ sidebar, topbar, children }: { sidebar: React.ReactNode; topbar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      {sidebar}
      <div className="lg:pl-[220px]">
        {topbar}
        <main className="mx-auto max-w-[1120px] px-[20px] pb-[60px] lg:px-[34px]">{children}</main>
      </div>
    </div>
  );
}

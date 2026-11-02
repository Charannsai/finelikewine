"use client";
import React, { useEffect, useState } from "react";
import { Icon, type IconName } from "./icons";
import { Button, Cmdk, Kbd, ThemeToggle, cx, type CmdkAction } from "./ui";

export type NavEntry = { href: string; label: string; icon: IconName; count?: number };
export type NavGroup = { label?: string; items: NavEntry[] };

export function Sidebar({ groups, brand, brandHref = "/" }: { groups: NavGroup[]; brand: string; brandHref?: string; tile?: boolean }) {
  const [active, setActive] = useState(groups[0]?.items[0]?.href ?? "");
  return (
    <nav className="fixed inset-y-0 left-0 z-50 hidden w-[232px] flex-col border-r border-line bg-paper px-[12px] py-[16px] lg:flex" aria-label="Primary">
      <a href={brandHref} className="mb-[14px] flex items-center gap-[9px] px-[8px] text-[14.5px] font-semibold tracking-[-0.02em]">
        <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] bg-wine text-[12px] font-bold text-onink">{brand[0]}</span>
        {brand}
      </a>
      {groups.map((g, gi) => (
        <div key={gi} className={cx(!g.label && "mt-auto border-t border-line pt-[10px]")}>
          {g.label && <div className="px-[10px] pb-[5px] pt-[14px] text-[11.5px] font-medium text-ink3">{g.label}</div>}
          {g.items.map(it => {
            const on = active === it.href;
            return (
              <a key={it.label} href={it.href} onClick={() => setActive(it.href)}
                className={cx("flex h-[32px] items-center gap-[10px] rounded-[7px] px-[10px] text-[13px] transition-colors", on ? "bg-surface2 font-medium text-ink ring-1 ring-line" : "text-ink2 hover:bg-surface2/60 hover:text-ink")}>
                <Icon name={it.icon} className={cx("h-[15px] w-[15px]", on ? "text-wine" : "text-ink3")} />
                {it.label}
                {it.count != null && <span className="ml-auto font-mono text-[11px] tabular-nums text-ink3">{it.count}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function Topbar({ crumbs, actions, onMenu }: { crumbs: React.ReactNode; actions: CmdkAction[]; onMenu?: () => void }) {
  const [cmdk, setCmdk] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdk(o => !o); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="sticky top-0 z-40 flex h-[54px] items-center gap-[10px] border-b border-line bg-paper/85 px-[16px] backdrop-blur lg:px-[28px]">
        <button className="rounded-[7px] p-[7px] hover:bg-surface2 lg:hidden" aria-label="Menu" onClick={onMenu}><Icon name="menu-01" /></button>
        <span className="text-[13px] text-ink3">{crumbs}</span>
        <span className="flex-1" />
        <Button variant="secondary" size="sm" onClick={() => setCmdk(true)} className="text-ink3"><Icon name="search-01" className="h-[14px] w-[14px]" />Search<Kbd>⌘K</Kbd></Button>
        <ThemeToggle />
      </div>
      <Cmdk open={cmdk} onClose={() => setCmdk(false)} actions={actions} />
    </>
  );
}

export function Shell({ sidebar, topbar, children }: { sidebar: React.ReactNode; topbar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      {sidebar}
      <div className="lg:pl-[232px]">
        {topbar}
        <main className="mx-auto max-w-[1160px] px-[16px] pb-[60px] lg:px-[28px]">{children}</main>
      </div>
    </div>
  );
}

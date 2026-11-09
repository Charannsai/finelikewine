"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

type Leaf = { href: string; label: string; icon: IconName };
type Folder = { id: string; label: string; icon: IconName; children: Leaf[] };

const TREE: Folder[] = [
  { id: "foundations", label: "foundations", icon: "paint-board", children: [
    { href: "/foundations/colors", label: "colors", icon: "paint-board" },
    { href: "/foundations/typography", label: "typography", icon: "text-font" },
  ]},
  { id: "components", label: "components", icon: "cursor-01", children: [
    { href: "/components/buttons", label: "buttons", icon: "cursor-01" },
    { href: "/components/badges", label: "badges", icon: "tag-01" },
    { href: "/components/forms", label: "forms", icon: "check-box" },
    { href: "/components/cards", label: "cards", icon: "credit-card" },
    { href: "/components/tables", label: "tables", icon: "table-01" },
    { href: "/components/navigation", label: "navigation", icon: "layout-01" },
    { href: "/components/overlays", label: "overlays", icon: "layers-01" },
    { href: "/components/charts", label: "charts", icon: "chart-bar-line" },
    { href: "/components/feedback", label: "feedback", icon: "alert-circle" },
  ]},
  { id: "resources", label: "resources", icon: "grid-view", children: [
    { href: "/resources/pages", label: "pages", icon: "grid-view" },
  ]},
  { id: "demos", label: "demos", icon: "rocket-01", children: [
    { href: "/dashboard", label: "vigil dashboard", icon: "grid-view" },
    { href: "/landing/meridian", label: "meridian landing", icon: "rocket-01" },
    { href: "/landing/fieldnotes", label: "fieldnotes landing", icon: "mail-01" },
  ]},
];

function FolderRow({ folder, pathname }: { folder: Folder; pathname: string }) {
  const hasActive = folder.children.some(c => c.href === pathname);
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className={`group flex w-full items-center gap-[8px] rounded-[9px] px-[9px] py-[7px] font-mono text-[12.5px] transition-colors hover:bg-black/[.045] ${hasActive ? "text-winedeep" : "text-ink2"}`}
        aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" className={`h-[13px] w-[13px] shrink-0 text-ink3 transition-transform duration-200 ${open ? "rotate-90" : ""} ${hasActive ? "text-wine" : ""}`} aria-hidden="true">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Icon name={folder.icon} className={`h-[15px] w-[15px] shrink-0 ${hasActive ? "text-wine" : "text-ink3"}`} />
        <span className={`truncate ${hasActive ? "font-medium" : ""}`}>{folder.label}/</span>
        <span className="ml-auto rounded-full bg-black/[.05] px-[7px] py-[1px] text-[10px] tabular-nums text-ink3">{folder.children.length}</span>
      </button>
      <div className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="ml-[19px] border-l border-line2 pl-[8px]">
            {folder.children.map(c => {
              const active = pathname === c.href;
              return (
                <a key={c.href} href={c.href}
                  className={`relative flex items-center gap-[8px] rounded-[8px] px-[9px] py-[6px] font-mono text-[12.5px] transition-all hover:bg-black/[.045] ${active ? "bg-winebg font-medium text-winedeep" : "text-ink2"}`}>
                  {active && <span className="absolute -left-[9px] top-1/2 h-[14px] w-[2px] -translate-y-1/2 rounded-full bg-wine" />}
                  <Icon name={c.icon} className={`h-[14px] w-[14px] shrink-0 ${active ? "text-wine" : "text-ink3"}`} />
                  <span className="truncate">{c.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Explorer() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-y-0 left-0 z-50 hidden w-[220px] flex-col border-r border-line bg-paper px-[12px] py-[16px] lg:flex" aria-label="Library explorer">
      <a href="/" className="mb-[16px] flex items-center gap-[9px] px-[8px]">
        <img src="/brand/tile-light.svg" alt="" className="h-[26px] w-[26px] rounded-[8px]" />
        <span className="text-[14.5px] font-semibold tracking-[-0.01em]">finelikewine<span className="text-wine">.</span></span>
      </a>
      <a href="/" className={`mb-[10px] flex items-center gap-[8px] rounded-[9px] px-[9px] py-[7px] font-mono text-[12.5px] transition-colors hover:bg-black/[.045] ${pathname === "/" ? "bg-winebg font-medium text-winedeep" : "text-ink2"}`}>
        <Icon name="home-02" className={`h-[15px] w-[15px] ${pathname === "/" ? "text-wine" : "text-ink3"}`} />overview
      </a>
      <div className="mb-[8px] px-[9px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink3">library</div>
      <div className="flex flex-col gap-[2px] overflow-y-auto pb-[10px]">
        {TREE.map(f => <FolderRow key={f.id} folder={f} pathname={pathname} />)}
      </div>
      <div className="mt-auto border-t border-line pt-[10px]">
        <a href="https://github.com/Charannsai/finelikewine" className="flex items-center gap-[8px] rounded-[9px] px-[9px] py-[7px] font-mono text-[12.5px] text-ink2 transition-colors hover:bg-black/[.045]">
          <Icon name="github" className="h-[15px] w-[15px] text-ink3" />github
        </a>
      </div>
    </nav>
  );
}

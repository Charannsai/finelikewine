"use client";
import React from "react";
import { PAGES } from "./registry";
import { cx } from "./ui";

function Thumb({ kind }: { kind: string }) {
  const bar = "rounded-[2px] bg-line2";
  return (
    <div className="flex h-full flex-col gap-[7px] rounded-t-[8px] border border-b-0 border-line2 bg-paper p-[10px] transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[4px]">
      {kind === "dash" && <div className="flex flex-1 gap-[8px]">
        <div className="flex w-[38px] flex-col gap-[5px] border-r border-line pr-[6px]"><i className="h-[7px] w-[7px] rounded-[2px] bg-wine" />{[0, 1, 2, 3].map(i => <i key={i} className={cx("h-[5px]", bar)} />)}</div>
        <div className="flex flex-1 flex-col gap-[6px]"><div className="grid grid-cols-3 gap-[5px]">{[0, 1, 2].map(i => <i key={i} className="h-[20px] rounded-[3px] border border-line bg-surface" />)}</div>
          <div className="flex flex-1 items-end gap-[4px] rounded-[3px] border border-line bg-surface p-[5px]">{[40, 55, 35, 70, 60, 85, 75].map((h, i) => <i key={i} className="flex-1 rounded-[1px] bg-wine/60" style={{ height: `${h}%` }} />)}</div></div>
      </div>}
      {kind === "saas" && <>
        <div className="flex items-center gap-[5px]"><i className="h-[7px] w-[7px] rounded-[2px] bg-wine" /><span className="flex-1" /><i className={cx("h-[4px] w-[16px]", bar)} /><i className={cx("h-[4px] w-[16px]", bar)} /><i className="h-[8px] w-[22px] rounded-[2px] bg-ink" /></div>
        <div className="flex flex-1 flex-col items-center justify-center gap-[6px]"><i className="h-[8px] w-[58%] rounded-[2px] bg-ink/70" /><i className={cx("h-[4px] w-[40%]", bar)} /><i className="mt-[2px] h-[10px] w-[22%] rounded-[2px] bg-wine" /><div className="mt-[4px] grid w-[80%] grid-cols-3 gap-[4px]">{[0, 1, 2].map(i => <i key={i} className="h-[16px] rounded-[2px] border border-line bg-surface" />)}</div></div>
      </>}
      {kind === "news" && <>
        <div className="flex items-center gap-[5px]"><i className="h-[7px] w-[7px] rounded-[2px] bg-wine" /><i className={cx("h-[4px] w-[30px]", bar)} /></div>
        <div className="flex flex-1 flex-col justify-center gap-[6px] px-[10%]"><i className="h-[8px] w-[70%] rounded-[2px] bg-ink/70" /><i className={cx("h-[4px] w-[85%]", bar)} /><div className="mt-[3px] flex gap-[4px]"><i className="h-[12px] flex-1 rounded-[2px] border border-line bg-surface" /><i className="h-[12px] w-[24%] rounded-[2px] bg-ink" /></div>
          <div className="mt-[6px] flex flex-col gap-[4px]">{[0, 1].map(i => <i key={i} className={cx("h-[4px]", bar)} />)}</div></div>
      </>}
    </div>
  );
}
export function PagesGrid() {
  const kinds = ["dash", "saas", "news"];
  return (
    <section id="pages" aria-label="Pages">
      <div data-reveal className="mb-[22px] mt-[96px] flex items-baseline gap-[14px]">
        <h2 className="text-[20px] font-medium tracking-[-0.02em]">Pages</h2>
        <p className="text-[13.5px] text-ink3">Whole screens built from the parts above.</p>
      </div>
      <div className="grid gap-[16px] md:grid-cols-3">
        {PAGES.map((p, i) => (
          <a key={p.href} href={p.href} data-reveal style={{ "--d": `${i * 160}ms` } as React.CSSProperties}
            className="group block overflow-hidden rounded-[18px] border border-line bg-surface transition-colors duration-700 hover:border-line2">
            <div className="h-[180px] overflow-hidden px-[26px] pt-[26px]"><Thumb kind={kinds[i]} /></div>
            <div className="flex items-baseline gap-[10px] border-t border-line px-[20px] py-[16px]">
              <span className="text-[14px] font-medium">{p.title}</span>
              <span className="text-[12.5px] text-ink3">{p.desc}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

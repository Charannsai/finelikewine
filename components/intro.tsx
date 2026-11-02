"use client";
import React from "react";
import { CATEGORIES, SECTIONS } from "./registry";
import { BlurText } from "./motion";
import { CopyButton } from "./ui";

export function Intro() {
  return (
    <header className="px-[20px] pb-[16px] pt-[72px] sm:px-[40px] lg:pt-[112px]">
      <h1 className="max-w-[620px] text-[clamp(30px,4vw,46px)] font-medium leading-[1.12] tracking-[-0.035em]">
        <BlurText text="Components you can take apart." step={90} />
      </h1>
      <p data-reveal className="mt-[22px] max-w-[520px] text-[15px] leading-[1.7] text-ink3" style={{ "--d": "600ms" } as React.CSSProperties}>
        Each one is a single React file, running live on this page. Try it, open it full size, then copy the code or the prompt that builds it.
      </p>
      <div data-reveal className="mt-[30px] flex flex-wrap items-center gap-[14px]" style={{ "--d": "800ms" } as React.CSSProperties}>
        <div className="inline-flex h-[40px] items-center gap-[10px] rounded-[10px] border border-line pl-[14px] pr-[6px] font-mono text-[12.5px] text-ink2">
          git clone github.com/Charannsai/finelikewine
          <CopyButton text="git clone https://github.com/Charannsai/finelikewine.git" />
        </div>
        <span className="text-[12.5px] text-ink3">{SECTIONS.length} components · React 19 · Tailwind 4</span>
      </div>
    </header>
  );
}

export function CategoryHeader({ id }: { id: string }) {
  const c = CATEGORIES.find(x => x.id === id)!;
  return (
    <div data-reveal className="mb-[22px] mt-[88px] flex items-baseline gap-[14px]">
      <h2 className="text-[20px] font-medium tracking-[-0.02em]">{c.title}</h2>
      <p className="text-[13.5px] text-ink3">{c.line}</p>
    </div>
  );
}

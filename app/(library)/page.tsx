import React from "react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Intro } from "@/components/intro";
import { Catalog } from "@/components/catalog";
import { PagesGrid } from "@/components/pages-grid";
import { MotionRoot } from "@/components/motion";
import { SECTIONS } from "@/components/registry";

/* The code shown and copied for each tile is the real file it renders. */
function readSources() {
  const dir = path.join(process.cwd(), "components", "library");
  return Object.fromEntries(SECTIONS.map(s => [s.id, readFileSync(path.join(dir, `${s.id}.tsx`), "utf8")]));
}

export default function Home() {
  const sources = readSources();
  return (
    <>
      <Intro />
      <div className="px-[20px] pb-[80px] sm:px-[40px]">
        <Catalog sources={sources} />
        <PagesGrid />
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-[10px] px-[20px] py-[40px] text-[12.5px] text-ink3 sm:px-[40px]">
        <span>FineLikeWine. Icons from <a className="underline underline-offset-2 hover:text-ink" href="https://hugeicons.com">Hugeicons</a> (MIT).</span>
        <a className="hover:text-ink" href="https://github.com/Charannsai/finelikewine">github.com/Charannsai/finelikewine</a>
      </footer>
      <MotionRoot />
    </>
  );
}

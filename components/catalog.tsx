"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { CATEGORIES, SECTIONS } from "./registry";
import { Tile, type Demo } from "./section";
import { CategoryHeader } from "./intro";

import Accordion from "./library/accordion";
import Avatars from "./library/avatars";
import Button from "./library/button";
import Calendar from "./library/calendar";
import Card from "./library/card";
import Chart from "./library/chart";
import Chat from "./library/chat";
import Command from "./library/command";
import Compare from "./library/compare";
import Dialog from "./library/dialog";
import Dock from "./library/dock";
import Dropzone from "./library/dropzone";
import Feedback from "./library/feedback";
import Input from "./library/input";
import Keyboard from "./library/keyboard";
import Like from "./library/like";
import Magnetic from "./library/magnetic";
import Marquee from "./library/marquee";
import Menu from "./library/menu";
import Popover from "./library/popover";
import Rating from "./library/rating";
import Reveal from "./library/reveal";
import Ring from "./library/ring";
import Scramble from "./library/scramble";
import Select from "./library/select";
import Sortable from "./library/sortable";
import Spotlight from "./library/spotlight";
import Stepper from "./library/stepper";
import Table from "./library/table";
import Tabs from "./library/tabs";
import Ticker from "./library/ticker";
import Tilt from "./library/tilt";
import Timeline from "./library/timeline";
import Toast from "./library/toast";
import Toggle from "./library/toggle";

const DEMOS: Record<string, Demo> = {
  accordion: Accordion, avatars: Avatars, button: Button, calendar: Calendar, card: Card, chart: Chart, chat: Chat, command: Command,
  compare: Compare, dialog: Dialog, dock: Dock, dropzone: Dropzone, feedback: Feedback, input: Input, keyboard: Keyboard, like: Like,
  magnetic: Magnetic, marquee: Marquee, menu: Menu, popover: Popover, rating: Rating, reveal: Reveal, ring: Ring, scramble: Scramble,
  select: Select, sortable: Sortable, spotlight: Spotlight, stepper: Stepper, table: Table, tabs: Tabs, ticker: Ticker, tilt: Tilt,
  timeline: Timeline, toast: Toast, toggle: Toggle,
};

type Meta = (typeof SECTIONS)[number];
type Placed = { meta: Meta; col: number; span: number; row: number };

/* Pinboard packing. Tiles go into the shortest column. Before a wide tile is placed, any gap it
   would leave above it is filled with a later single tile, so columns end level. */
function pack(items: Meta[], cols: number): Placed[] {
  const h = Array(cols).fill(0);
  const queue = [...items];
  const out: Placed[] = [];
  const placeAt = (meta: Meta, col: number, span: number) => {
    const row = Math.max(...h.slice(col, col + span));
    out.push({ meta, col, span, row });
    for (let k = col; k < col + span; k++) h[k] = row + meta.rows;
  };
  while (queue.length) {
    const next = queue[0];
    const span = Math.min(next.cols ?? 1, cols);
    if (span === 1) { queue.shift(); placeAt(next, h.indexOf(Math.min(...h)), 1); continue; }
    let best = 0, bestTop = Infinity;
    for (let c = 0; c + span <= cols; c++) { const top = Math.max(...h.slice(c, c + span)); if (top < bestTop) { bestTop = top; best = c; } }
    const gaps = h.slice(best, best + span).map(v => bestTop - v);
    const filler = Math.max(...gaps) > 0 ? queue.findIndex((m, i) => i > 0 && Math.min(m.cols ?? 1, cols) === 1) : -1;
    if (filler > 0) {
      const lowest = best + gaps.indexOf(Math.max(...gaps));
      placeAt(queue.splice(filler, 1)[0], lowest, 1);
      continue;
    }
    queue.shift();
    placeAt(next, best, span);
  }
  return out;
}

function Board({ items, sources }: { items: Meta[]; sources: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => { const w = el.clientWidth; setCols(w >= 1020 ? 3 : w >= 620 ? 2 : 1); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (cols === 1) {
    return (
      <div ref={ref} className="flex flex-col">
        {items.map(m => <Tile key={m.id} meta={m} code={sources[m.id] ?? ""} Comp={DEMOS[m.id]} place={{ height: m.rows * 8 }} />)}
      </div>
    );
  }
  const placed = pack(items, cols);
  return (
    <div ref={ref} className="grid auto-rows-[8px] gap-x-[16px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {placed.map(p => (
        <Tile key={p.meta.id} meta={p.meta} code={sources[p.meta.id] ?? ""} Comp={DEMOS[p.meta.id]}
          place={{ gridColumn: `${p.col + 1} / span ${p.span}`, gridRow: `${p.row + 1} / span ${p.meta.rows}` }} />
      ))}
    </div>
  );
}

export function Catalog({ sources }: { sources: Record<string, string> }) {
  return (
    <>
      {CATEGORIES.map(c => (
        <section key={c.id} id={`cat-${c.id}`} aria-label={c.title}>
          <CategoryHeader id={c.id} />
          <Board items={SECTIONS.filter(s => s.cat === c.id)} sources={sources} />
        </section>
      ))}
    </>
  );
}

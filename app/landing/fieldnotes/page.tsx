"use client";
import React, { useState } from "react";
import { Icon } from "@/components/icons";
import { Button, useToast } from "@/components/ui";

const ISSUES = [
  { n: "No. 142", t: "The case for boring interfaces", d: "Why the best tools feel like they were always there, and what \"boring\" actually costs to build.", date: "Dec 16" },
  { n: "No. 141", t: "Notes on deleting features", d: "A field guide to removing things without breaking trust, including the email you should send first.", date: "Dec 9" },
  { n: "No. 140", t: "Defaults are a design decision", d: "Most users never change a setting. That makes your defaults the product, whether you meant it or not.", date: "Dec 2" },
  { n: "No. 139", t: "In defense of the humble table", d: "Charts are charming. Tables are honest. When to reach for each.", date: "Nov 25" },
];

export default function Fieldnotes() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-[880px] items-center gap-[10px] px-[20px] py-[13px]">
          <a href="/landing/fieldnotes" className="flex items-center gap-[9px] text-[15px] font-semibold"><span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-wine text-[11px] font-bold text-paper">Fn</span>Fieldnotes</a>
          <span className="flex-1" />
          <a href="#archive" className="text-[13.5px] font-medium text-ink2 hover:text-ink">Archive</a>
          <a href="#about" className="text-[13.5px] font-medium text-ink2 hover:text-ink">About</a>
          <a href="/" className="text-[13px] text-ink3 hover:text-ink">FineLikeWine</a>
          <Button size="sm" onClick={() => toast("This is a design demo")}>Subscribe</Button>
        </div>
      </nav>

      <header className="mx-auto max-w-[880px] px-[20px] pb-[30px] pt-[80px] text-center">
        <span className="inline-flex items-center rounded-full border border-line bg-surface px-[12px] py-[5px] text-[12px] text-ink2">Every Tuesday · 4 minute read</span>
        <h1 className="mx-auto mt-[20px] max-w-[640px] font-display text-[clamp(38px,5.6vw,60px)] leading-[1.06] tracking-[-0.01em]">One good idea about craft, <em className="italic text-wine">every week.</em></h1>
        <p className="mx-auto mt-[18px] max-w-[480px] text-[15.5px] leading-[1.6] text-ink2">Fieldnotes is a short letter on design, tools and doing careful work. No growth hacks, no hot takes, no threads.</p>
        <form className="mx-auto mt-[26px] flex max-w-[440px] gap-[8px]" onSubmit={e => { e.preventDefault(); if (email) { toast("Welcome aboard. Check your inbox."); setEmail(""); } }}>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2 text-ink3"><Icon name="mail-01" className="h-[15px] w-[15px]" /></span>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full rounded-[10px] border border-line2 bg-surface py-[10px] pl-[34px] pr-[12px] text-[13.5px] placeholder:text-ink3 focus:border-wine focus:outline-none focus:ring-[3px] focus:ring-wine/15" />
          </div>
          <Button type="submit">Subscribe</Button>
        </form>
        <p className="mt-[12px] text-[12px] text-ink3">Free forever. Unsubscribe in one click.</p>
      </header>

      <section className="mx-auto max-w-[880px] border-t border-line px-[20px] py-[44px]">
        <div className="grid grid-cols-3 gap-[14px] text-center">
          {[["18,402", "readers"], ["142", "issues sent"], ["61%", "average open rate"]].map(([v, l]) => (
            <div key={l}><div className="text-[28px] font-semibold tracking-[-0.02em] tabular-nums">{v}</div><div className="mt-[3px] text-[12px] text-ink3">{l}</div></div>
          ))}
        </div>
      </section>

      <section id="archive" className="mx-auto max-w-[880px] px-[20px] pb-[60px]">
        <h2 className="mb-[18px] text-[17px] font-semibold">Recent issues</h2>
        <div className="divide-y divide-line rounded-[14px] border border-line bg-surface">
          {ISSUES.map(i => (
            <a key={i.n} href="#" onClick={e => { e.preventDefault(); toast("This is a design demo"); }} className="group flex gap-[20px] px-[20px] py-[18px] transition-colors hover:bg-surface2">
              <span className="w-[44px] flex-none pt-[2px] font-mono text-[11px] leading-[1.5] text-ink3">{i.n}</span>
              <div className="flex-1">
                <h3 className="text-[14.5px] font-semibold group-hover:text-wine">{i.t}</h3>
                <p className="mt-[3px] max-w-[560px] text-[12.5px] leading-[1.55] text-ink2">{i.d}</p>
              </div>
              <span className="flex-none pt-[2px] text-[12px] text-ink3">{i.date}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[880px] flex-wrap justify-between gap-[10px] px-[20px] py-[26px] text-[12.5px] text-ink3">
          <span>Fieldnotes · a FineLikeWine landing design</span>
          <span>Demo copy, not a real newsletter</span>
        </div>
      </footer>
    </div>
  );
}

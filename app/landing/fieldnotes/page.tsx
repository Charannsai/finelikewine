"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { BlurText, Magnetic, MotionRoot, NumberTicker, Scramble } from "@/components/motion";
import { Avatar, Button, Spinner, ThemeToggle, cx, useToast } from "@/components/ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const ISSUES = [
  { n: "142", t: "The case for boring interfaces", d: "Why the best tools feel like they were always there, and what “boring” costs to build.", date: "Dec 16", min: 4 },
  { n: "141", t: "Notes on deleting features", d: "Removing things without breaking trust, including the email you should send first.", date: "Dec 9", min: 5 },
  { n: "140", t: "Defaults are a design decision", d: "Most people never change a setting. Your defaults are the product.", date: "Dec 2", min: 3 },
  { n: "139", t: "In defense of the humble table", d: "Charts are charming. Tables are honest. When to reach for each.", date: "Nov 25", min: 4 },
  { n: "138", t: "Loading states people forgive", d: "Skeletons, spinners and the half second that decides how fast you feel.", date: "Nov 18", min: 6 },
];

function Signup({ onJoin }: { onJoin: () => void }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setState("busy");
    setTimeout(() => { setState("done"); onJoin(); }, 900);
  };
  return (
    <form onSubmit={submit} className={cx("relative mx-auto mt-[30px] flex h-[52px] max-w-[440px] items-center overflow-hidden rounded-[14px] border bg-surface p-[5px] transition-[border-color,box-shadow] duration-300", state === "done" ? "border-green/50 shadow-[0_0_0_4px_var(--green-bg)]" : "border-line2 focus-within:border-wine focus-within:shadow-[0_0_0_4px_var(--accent-bg)]")}>
      <div className={cx("flex flex-1 items-center gap-[8px] pl-[10px] transition-all duration-500", state === "done" && "-translate-y-[40px] opacity-0 blur-[6px]")}>
        <Icon name="mail-01" className="h-[15px] w-[15px] text-ink3" />
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" className="h-full w-full bg-transparent text-[14px] placeholder:text-ink3 focus:outline-none" />
      </div>
      <Button type="submit" className={cx("h-[40px] px-[16px] transition-all duration-500", state === "done" && "translate-y-[40px] opacity-0")} disabled={state !== "idle"}>
        {state === "busy" ? <Spinner /> : "Subscribe"}
      </Button>
      <div className={cx("absolute inset-0 flex items-center justify-center gap-[8px] text-[14px] font-medium text-green transition-all duration-500", state === "done" ? "translate-y-0 opacity-100 blur-0" : "translate-y-[30px] opacity-0 blur-[6px]")}>
        <Icon name="checkmark-circle-01" className="h-[17px] w-[17px]" />You’re in. First letter arrives Tuesday.
      </div>
    </form>
  );
}

export default function Fieldnotes() {
  const toast = useToast();
  const [readers, setReaders] = useState(18402);
  return (
    <div className="min-h-screen bg-paper">
      <nav className="mx-auto flex max-w-[880px] items-center gap-[12px] px-[20px] py-[16px]">
        <a href="/landing/fieldnotes" className="flex items-center gap-[9px] text-[15px] font-semibold tracking-[-0.02em]"><span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-wine text-[11px] font-bold text-onink">Fn</span>Fieldnotes</a>
        <span className="flex-1" />
        <a href="#archive" className="text-[13.5px] font-medium text-ink2 hover:text-ink">Archive</a>
        <a href="#about" className="text-[13.5px] font-medium text-ink2 hover:text-ink">About</a>
        <Link href="/" className="hidden text-[13px] text-ink3 hover:text-ink sm:block">FineLikeWine</Link>
        <ThemeToggle />
      </nav>

      <header className="relative mx-auto max-w-[880px] px-[20px] pb-[40px] pt-[80px] text-center">
        <span data-reveal className="inline-flex items-center rounded-[6px] border border-line bg-surface px-[10px] py-[4px] font-mono text-[11.5px] text-ink3">Every Tuesday · 4 minute read</span>
        <h1 className="mx-auto mt-[22px] max-w-[700px] text-[clamp(32px,4.6vw,54px)] font-medium leading-[1.06] tracking-[-0.04em]">
          <BlurText text="One good idea about craft," /> <span className="text-ink3"><BlurText text="every week." delay={300} /></span>
        </h1>
        <p data-reveal className="mx-auto mt-[20px] max-w-[460px] text-[15.5px] leading-[1.6] text-ink2" style={d(420)}>A short letter on design, tools and careful work. No growth hacks, no hot takes, no threads.</p>
        <div data-reveal style={d(520)}><Signup onJoin={() => setReaders(r => r + 1)} /></div>
        <p data-reveal className="mt-[12px] text-[12px] text-ink3" style={d(600)}>Free. Unsubscribe in one click.</p>
      </header>

      <section className="mx-auto max-w-[880px] px-[20px] pb-[50px]">
        <div className="grid grid-cols-3 gap-[1px] overflow-hidden rounded-[18px] border border-line bg-line text-center">
          {([[readers, "readers"], [142, "letters sent"], [61, "% open rate"]] as [number, string][]).map(([v, l], i) => (
            <div key={l} data-reveal style={d(i * 90)} className="bg-surface py-[22px]">
              <div className="text-[clamp(22px,3vw,30px)] font-medium tracking-[-0.03em]"><NumberTicker value={v} /></div>
              <div className="mt-[3px] text-[12px] text-ink3">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="archive" className="mx-auto max-w-[880px] px-[20px] pb-[70px]">
        <div className="mb-[16px] flex items-baseline justify-between">
          <h2 className="text-[22px] font-semibold tracking-[-0.03em]"><BlurText text="Recent letters" /></h2>
          <span className="font-mono text-[12px] text-ink3">hover a number</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          {ISSUES.map((it, i) => (
            <a key={it.n} href="#" data-reveal style={d(i * 80)} onClick={e => { e.preventDefault(); toast({ title: "This is a design demo", kind: "info" }); }}
              className="spot group flex items-start gap-[20px] rounded-[16px] border border-line bg-surface px-[20px] py-[18px] transition-[border-color,transform] duration-700 hover:border-line2">
              <span className="relative z-[1] w-[48px] flex-none pt-[2px] text-[12px] text-ink3"><Scramble text={`No.${it.n}`} /></span>
              <div className="relative z-[1] flex-1">
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-wine">{it.t}</h3>
                <p className="mt-[4px] max-w-[560px] text-[13px] leading-[1.55] text-ink2">{it.d}</p>
              </div>
              <div className="relative z-[1] flex flex-none flex-col items-end gap-[6px] pt-[2px] text-[12px] text-ink3">
                <span>{it.date}</span>
                <span className="flex items-center gap-[4px] opacity-0 transition-all duration-300 group-hover:opacity-100">{it.min} min<Icon name="arrow-right-01" className="h-[12px] w-[12px] transition-transform group-hover:translate-x-[2px]" /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-line">
        <div className="mx-auto grid max-w-[880px] gap-[30px] px-[20px] py-[70px] md:grid-cols-[1fr_1.4fr]">
          <div data-reveal className="flex items-center gap-[14px]">
            <Avatar size={56}>LV</Avatar>
            <div><div className="text-[15px] font-semibold">Lena Varga</div><div className="text-[13px] text-ink3">Designer, 14 years in product</div></div>
          </div>
          <p className="text-[18px] leading-[1.5] tracking-[-0.02em] text-ink2"><BlurText text="I write the letter I wanted when I started: short, specific, and honest about what did not work." step={30} /></p>
        </div>
        <div className="mx-auto max-w-[880px] px-[20px] pb-[70px]">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-[14px] rounded-[18px] border border-line bg-surface px-[22px] py-[18px]">
            <span className="text-[14px] font-medium">Read the latest letter before you decide.</span>
            <Magnetic strength={0.12}><Button variant="secondary" onClick={() => toast({ title: "This is a design demo", kind: "info" })}>Read No.142<Icon name="arrow-right-01" className="h-[14px] w-[14px]" /></Button></Magnetic>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[880px] flex-wrap justify-between gap-[10px] px-[20px] py-[26px] text-[12.5px] text-ink3">
          <span>Fieldnotes · a FineLikeWine landing design</span>
          <span>Demo copy, not a real newsletter</span>
        </div>
      </footer>
      <MotionRoot />
    </div>
  );
}

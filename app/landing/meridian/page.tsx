"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { BlurText, Magnetic, Marquee, MotionRoot, NumberTicker, Tilt, useInView } from "@/components/motion";
import { AvatarStack, Button, Seg, Status, ThemeToggle, cx, useToast } from "@/components/ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const LOGOS: [IconName, string][] = [["globe-02", "Northwind"], ["zap", "Voltline"], ["database-01", "Ledgerly"], ["rocket-01", "Orbital"], ["shield-01", "Keystone"], ["sparkles", "Lumen"], ["layers-01", "Stackwise"]];
const PLANS = [
  { name: "Starter", m: 0, y: 0, per: "forever", feats: ["3 projects", "Weekly digest", "Decision log"], cta: "Start free" },
  { name: "Studio", m: 14, y: 12, per: "per person / month", feats: ["Unlimited projects", "Guests and approvals", "Roadmap timeline"], cta: "Start free", hot: true },
  { name: "Company", m: 28, y: 24, per: "per person / month", feats: ["Client portals", "SSO and audit log", "Priority support"], cta: "Talk to us" },
];

function Roadmap() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const rows = [
    { s: <Status tone="green">On track</Status>, t: "Ship the new onboarding", dsc: "Due Friday · 6 tasks left", v: 72, c: "var(--green)" },
    { s: <Status tone="amber">At risk</Status>, t: "Billing migration", dsc: "Waiting on legal review", v: 34, c: "var(--amber)" },
    { s: <Status tone="neutral">Planned</Status>, t: "Mobile beta", dsc: "Starts next sprint", v: 8, c: "var(--ink3)" },
  ];
  return (
    <div ref={ref} className="overflow-hidden rounded-[20px] border border-line2 bg-surface text-left shadow-[0_40px_80px_-40px_rgba(0,0,0,.55)]">
      <div className="flex items-center gap-[6px] border-b border-line bg-surface2/60 px-[14px] py-[11px]">
        {[0, 1, 2].map(i => <i key={i} className="h-[9px] w-[9px] rounded-full bg-line2" />)}
        <span className="flex-1 text-center font-mono text-[11.5px] text-ink3">meridian.app/acme/roadmap</span>
      </div>
      <div className="grid gap-[12px] p-[16px] md:grid-cols-3">
        {rows.map((r, i) => (
          <div key={r.t} className="rounded-[14px] border border-line bg-paper/40 p-[14px]">
            {r.s}
            <h4 className="mb-[3px] mt-[10px] text-[14px] font-semibold tracking-[-0.01em]">{r.t}</h4>
            <p className="text-[12.5px] text-ink3">{r.dsc}</p>
            <div className="mt-[14px] h-[5px] overflow-hidden rounded-[2px] bg-surface3">
              <div className="h-full rounded-[2px] transition-[width] duration-[1400ms] ease-[cubic-bezier(.2,.9,.25,1)]" style={{ width: inView ? `${r.v}%` : "0%", background: r.c, transitionDelay: `${300 + i * 150}ms` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-[10px] border-t border-line px-[16px] py-[12px] text-[12px] text-ink3">
        <AvatarStack items={["AK", "JR", "+5"]} /> 7 people updated the roadmap this week
      </div>
    </div>
  );
}

const FEATURES: { icon: IconName; title: string; body: string; big?: boolean; extra?: React.ReactNode }[] = [
  { icon: "checkmark-badge-01", title: "Honest progress", body: "Bars computed from real tasks, not vibes. A plan is done when the work is done.", big: true,
    extra: <div className="mt-[18px] flex items-end gap-[6px]">{[30, 45, 38, 62, 70, 66, 84].map((h, i) => <span key={i} data-reveal className="flex-1 rounded-[3px] bg-wine/70" style={{ height: h, ...d(i * 70) }} />)}</div> },
  { icon: "file-01", title: "Decisions, recorded", body: "Every choice gets one line, a name and a date." },
  { icon: "mail-01", title: "Monday digest", body: "What moved, what is stuck, what is next. Forty seconds to read." },
  { icon: "shield-01", title: "Private by default", body: "No ads, no tracking pixels, no training on your plans.", big: true,
    extra: <div className="mt-[18px] flex flex-wrap gap-[6px]">{["Encrypted at rest", "EU hosting", "SSO", "Audit log"].map(t => <span key={t} className="rounded-[6px] border border-line px-[8px] py-[4px] text-[11.5px] text-ink2">{t}</span>)}</div> },
];

export default function Meridian() {
  const toast = useToast();
  const [cycle, setCycle] = useState("Yearly");
  const demo = () => toast({ title: "This is a design demo", kind: "info" });
  return (
    <div className="min-h-screen bg-paper">
      <nav className="sticky top-[10px] z-40 mx-auto mt-[10px] flex max-w-[1080px] items-center gap-[22px] rounded-[14px] border border-line bg-surface/70 px-[14px] py-[9px] backdrop-blur-xl">
        <a href="/landing/meridian" className="flex items-center gap-[9px] text-[15px] font-semibold tracking-[-0.02em]"><span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-wine text-[12px] font-bold text-onink">M</span>Meridian</a>
        {[["Features", "#features"], ["Pricing", "#pricing"], ["Story", "#story"]].map(([l, h]) => (
          <a key={l} href={h} className="group relative hidden text-[13.5px] font-medium text-ink2 hover:text-ink sm:block">{l}<span className="absolute -bottom-[3px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-wine transition-transform duration-300 group-hover:scale-x-100" /></a>
        ))}
        <span className="flex-1" />
        <Link href="/" className="hidden text-[13px] text-ink3 hover:text-ink md:block">FineLikeWine</Link>
        <ThemeToggle />
        <Magnetic strength={0.12}><Button size="sm" onClick={demo}>Start free</Button></Magnetic>
      </nav>

      <header className="relative mx-auto max-w-[1080px] overflow-visible px-[20px] pb-[40px] pt-[90px] text-center">
        <span data-reveal className="relative inline-flex items-center gap-[8px] rounded-[7px] border border-line bg-surface px-[10px] py-[5px] text-[12px] text-ink2"><Status tone="green">New</Status>Monday digests are here</span>
        <h1 className="relative mx-auto mt-[22px] max-w-[820px] text-[clamp(32px,4.6vw,56px)] font-medium leading-[1.06] tracking-[-0.04em]">
          <BlurText text="Project planning that stays" /> <span className="text-ink3"><BlurText text="out of the way." delay={260} /></span>
        </h1>
        <p data-reveal className="relative mx-auto mt-[22px] max-w-[520px] text-[16.5px] leading-[1.6] text-ink2" style={d(420)}>A calm home for your team’s plans, docs and decisions. No noisy feeds, no red badges. Just the work, clearly arranged.</p>
        <div data-reveal className="relative mt-[30px] flex flex-wrap justify-center gap-[10px]" style={d(520)}>
          <Magnetic strength={0.12}><Button size="lg" className="h-[46px] px-[20px]" onClick={demo}>Start free<Icon name="arrow-right-01" className="h-[16px] w-[16px]" /></Button></Magnetic>
          <Magnetic strength={0.12}><Button size="lg" variant="secondary" className="h-[46px] px-[20px]" onClick={demo}>Watch the tour</Button></Magnetic>
        </div>
        <div data-reveal className="relative mx-auto mt-[64px] max-w-[960px]" style={d(650)}>
          <Tilt max={4}><Roadmap /></Tilt>
        </div>
      </header>

      <Marquee speed={80} className="mx-auto max-w-[1080px] gap-[48px] py-[20px]">
        {LOGOS.map(([ic, n]) => <span key={n} className="flex items-center gap-[8px] text-[18px] font-semibold tracking-[-0.03em] text-ink3 transition-colors hover:text-ink"><Icon name={ic} className="h-[18px] w-[18px]" />{n}</span>)}
      </Marquee>

      <section id="features" className="mx-auto max-w-[1080px] px-[20px] py-[90px]">
        <h2 className="max-w-[560px] text-[clamp(24px,3vw,34px)] font-medium leading-[1.15] tracking-[-0.03em]"><BlurText text="Everything a plan needs. Nothing it doesn’t." /></h2>
        <div className="mt-[36px] grid gap-[14px] md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} data-reveal style={d(i * 90)} className={cx("spot rounded-[20px] border border-line bg-surface p-[22px] transition-[border-color,transform] duration-700 hover:border-line2", f.big && "md:col-span-2")}>
              <div className="relative z-[1]">
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border border-line bg-surface2 text-wine"><Icon name={f.icon} className="h-[18px] w-[18px]" /></span>
                <h3 className="mb-[5px] mt-[16px] text-[16px] font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="max-w-[420px] text-[13.5px] leading-[1.55] text-ink2">{f.body}</p>
                {f.extra}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[14px] grid grid-cols-3 gap-[1px] overflow-hidden rounded-[20px] border border-line bg-line">
          {([[4200, "teams"], [38, "seconds to read a digest"], [99, "percent uptime, 2025"]] as [number, string][]).map(([n, l], i) => (
            <div key={l} data-reveal style={d(i * 90)} className="bg-surface px-[20px] py-[22px]">
              <div className="text-[clamp(24px,3vw,34px)] font-medium tracking-[-0.03em]"><NumberTicker value={n} /></div>
              <div className="mt-[4px] text-[12.5px] text-ink3">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="story" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[760px] px-[20px] py-[90px] text-center">
          <p className="text-[clamp(22px,3vw,32px)] font-medium leading-[1.3] tracking-[-0.035em]"><BlurText text="“We tried four planning tools. Meridian is the first one the whole team opens on a Monday.”" step={35} /></p>
          <div data-reveal className="mt-[24px] text-[13px] text-ink3" style={d(500)}>Priya Nair · head of product, Copperline</div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1080px] px-[20px] py-[90px]">
        <div className="flex flex-wrap items-end justify-between gap-[16px]">
          <h2 className="text-[clamp(24px,3vw,34px)] font-medium leading-[1.15] tracking-[-0.03em]"><BlurText text="Pricing without a spreadsheet." /></h2>
          <Seg options={["Monthly", "Yearly"]} value={cycle} onChange={setCycle} />
        </div>
        <div className="mt-[30px] grid gap-[14px] md:grid-cols-3">
          {PLANS.map((p, i) => {
            const card = (
              <div className={cx("spot h-full rounded-[20px] border bg-surface p-[22px]", p.hot ? "border-transparent" : "border-line")}>
                <div className="relative z-[1]">
                  <div className="flex items-center justify-between"><h3 className="text-[15px] font-semibold">{p.name}</h3>{p.hot && <span className="rounded-[6px] bg-ink px-[7px] py-[3px] text-[11px] font-medium text-onink">Most teams</span>}</div>
                  <div className="mt-[16px] flex items-baseline gap-[6px]"><span className="text-[36px] font-medium tracking-[-0.04em]"><NumberTicker value={cycle === "Yearly" ? p.y : p.m} format={n => `$${n}`} /></span><span className="text-[12.5px] text-ink3">{p.per}</span></div>
                  <div className="mt-[18px] flex flex-col gap-[10px] border-t border-line pt-[16px]">
                    {p.feats.map(f => <div key={f} className="flex items-center gap-[9px] text-[13.5px] text-ink2"><Icon name="tick-01" className="h-[15px] w-[15px] text-wine" />{f}</div>)}
                  </div>
                  <Button className="mt-[20px] w-full" variant={p.hot ? "primary" : "secondary"} onClick={demo}>{p.cta}</Button>
                </div>
              </div>
            );
            return <div key={p.name} data-reveal style={d(i * 90)}>{p.hot ? <div className="beam h-full rounded-[21px] p-px">{card}</div> : card}</div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-[20px] pb-[90px]">
        <div data-reveal className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-[24px] py-[64px] text-center">
          
          <h2 className="relative text-[clamp(26px,3.4vw,40px)] font-medium tracking-[-0.035em]"><BlurText text="Plan less. Ship more." /></h2>
          <div className="relative mt-[24px] flex justify-center"><Magnetic strength={0.12}><Button size="lg" className="h-[48px] px-[24px]" onClick={demo}>Start free, no card<Icon name="arrow-right-01" className="h-[16px] w-[16px]" /></Button></Magnetic></div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1080px] flex-wrap justify-between gap-[10px] px-[20px] py-[26px] text-[12.5px] text-ink3">
          <span>Meridian · a FineLikeWine landing design</span>
          <span>Demo copy, not a real product</span>
        </div>
      </footer>
      <MotionRoot />
    </div>
  );
}

"use client";
import React from "react";
import { Icon, type IconName } from "@/components/icons";
import { Button, Badge, Card, CardBody, Progress, AvatarStack, useToast } from "@/components/ui";

const FEATURES: { icon: IconName; bg: string; title: string; body: string }[] = [
  { icon: "checkmark-badge-01", bg: "var(--color-greenbg)", title: "Honest progress", body: "Progress bars computed from real tasks, not vibes. A plan is done when the work is done." },
  { icon: "file-01", bg: "var(--color-bluebg)", title: "Decisions, recorded", body: "Every choice gets a one-line record with a name and a date. No more archaeology in chat threads." },
  { icon: "mail-01", bg: "var(--color-amberbg)", title: "Weekly digest", body: "One calm email on Monday: what moved, what's stuck, what's next. Skimmable in forty seconds." },
  { icon: "shield-01", bg: "var(--color-violetbg)", title: "Private by default", body: "Your plans stay in your workspace. No ads, no tracking pixels, no surprise AI training." },
];
const PLANS = [
  { name: "Starter", price: "$0", per: "forever", feats: ["3 projects", "Weekly digest", "Decision log"], cta: "Start free" },
  { name: "Studio", price: "$12", per: "per person / month", feats: ["Unlimited projects", "Guests and approvals", "Roadmap timeline"], cta: "Start free", hot: true },
  { name: "Company", price: "$24", per: "per person / month", feats: ["Client portals", "SSO and audit log", "Priority support"], cta: "Talk to us" },
];

export default function Meridian() {
  const toast = useToast();
  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-[1080px] items-center gap-[22px] px-[20px] py-[13px]">
          <a href="/landing/meridian" className="flex items-center gap-[9px] text-[15px] font-semibold"><span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-wine text-[12px] font-bold text-paper">M</span>Meridian</a>
          {[["Features", "#features"], ["Pricing", "#pricing"], ["Story", "#story"]].map(([l, h]) => <a key={l} href={h} className="text-[13.5px] font-medium text-ink2 hover:text-ink">{l}</a>)}
          <span className="flex-1" />
          <a href="/" className="text-[13px] text-ink3 hover:text-ink">FineLikeWine</a>
          <Button size="sm" onClick={() => toast("This is a design demo")}>Start free</Button>
        </div>
      </nav>

      <header className="mx-auto max-w-[1080px] px-[20px] pb-[40px] pt-[88px] text-center">
        <Badge color="green" dot>New: weekly digests</Badge>
        <h1 className="mx-auto mt-[18px] max-w-[760px] font-display text-[clamp(38px,5.6vw,62px)] leading-[1.05] tracking-[-0.01em]">Project planning that stays <em className="italic text-wine">out of the way.</em></h1>
        <p className="mx-auto mt-[18px] max-w-[540px] text-[16.5px] text-ink2">Meridian is a calm home for your team's plans, docs and decisions. No noisy feeds, no red badges. Just the work, clearly arranged.</p>
        <div className="mt-[26px] flex flex-wrap justify-center gap-[10px]">
          <Button size="lg" onClick={() => toast("This is a design demo")}>Start free<Icon name="arrow-right-01" className="h-[16px] w-[16px]" /></Button>
          <Button size="lg" variant="secondary" onClick={() => toast("This is a design demo")}>Watch the tour</Button>
        </div>

        <div className="mx-auto mt-[56px] max-w-[960px] overflow-hidden rounded-[18px] border border-line bg-surface text-left shadow-[0_24px_50px_-24px_rgba(27,25,23,.25)]">
          <div className="flex items-center gap-[6px] border-b border-line bg-surface2 px-[14px] py-[11px]">
            <i className="h-[9px] w-[9px] rounded-full bg-[#ddd8cf]" /><i className="h-[9px] w-[9px] rounded-full bg-[#ddd8cf]" /><i className="h-[9px] w-[9px] rounded-full bg-[#ddd8cf]" />
            <span className="flex-1 text-center font-mono text-[11.5px] text-ink3">meridian.app/acme/roadmap</span>
          </div>
          <div className="grid gap-[14px] p-[18px] md:grid-cols-3">
            {[
              { s: <Badge color="green">On track</Badge>, t: "Ship the new onboarding", d: "Due Friday · 6 tasks left", v: 72 },
              { s: <Badge color="amber">At risk</Badge>, t: "Billing migration", d: "Waiting on legal review", v: 34, c: "#e2603f" },
              { s: <Badge>Planned</Badge>, t: "Mobile beta", d: "Starts next sprint", v: 8 },
            ].map((c, i) => (
              <Card key={i} className="shadow-none"><CardBody>
                {c.s}<h4 className="mb-[4px] mt-[10px] text-[14px] font-semibold">{c.t}</h4><p className="text-[12.5px] text-ink3">{c.d}</p>
                <div className="mt-[12px]"><Progress value={c.v} color={c.c} /></div>
              </CardBody></Card>
            ))}
          </div>
          <div className="flex items-center gap-[10px] border-t border-line px-[18px] py-[12px] text-[12px] text-ink3">
            <AvatarStack items={["AK", "JR", "+5"]} /> 7 people updated the roadmap this week
          </div>
        </div>
        <div className="mx-auto mt-[44px] flex max-w-[820px] flex-wrap items-center justify-center gap-[34px] text-[13px] font-medium text-[#b9b4ab]">
          {["Nortide", "Halvard", "Copperline", "Fern & Co", "Atlas Labs", "Mercury Rd"].map(x => <span key={x}>{x}</span>)}
        </div>
      </header>

      <section id="features" className="mx-auto max-w-[1080px] px-[20px] py-[70px]">
        <h2 className="text-center font-display text-[34px]">Everything a plan needs. Nothing it doesn't.</h2>
        <div className="mt-[36px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(f => (
            <Card key={f.title} hover><CardBody>
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px]" style={{ background: f.bg }}><Icon name={f.icon} className="h-[17px] w-[17px]" /></span>
              <h3 className="mb-[5px] mt-[13px] text-[14px] font-semibold">{f.title}</h3>
              <p className="text-[12.5px] leading-[1.55] text-ink2">{f.body}</p>
            </CardBody></Card>
          ))}
        </div>
      </section>

      <section id="story" className="border-y border-line bg-surface2">
        <div className="mx-auto max-w-[720px] px-[20px] py-[70px] text-center">
          <Icon name="sparkles" className="mx-auto mb-[18px] h-[26px] w-[26px] text-wineline" />
          <p className="font-display text-[24px] leading-[1.45]">"We tried four planning tools. Meridian is the first one the whole team actually opens on a Monday."</p>
          <div className="mt-[20px] text-[13px] text-ink3">Priya Nair · head of product, Copperline</div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1080px] px-[20px] py-[70px]">
        <h2 className="text-center font-display text-[34px]">Pricing that doesn't need a spreadsheet</h2>
        <div className="mt-[36px] grid gap-[14px] md:grid-cols-3">
          {PLANS.map(p => (
            <Card key={p.name} className={p.hot ? "border-ink shadow-[0_18px_36px_-20px_rgba(27,25,23,.3)]" : ""}>
              <CardBody>
                <div className="flex items-center justify-between"><h3 className="text-[14.5px] font-semibold">{p.name}</h3>{p.hot && <Badge color="solid">Popular</Badge>}</div>
                <div className="mt-[12px]"><span className="text-[30px] font-semibold tracking-[-0.02em]">{p.price}</span> <span className="text-[12px] text-ink3">{p.per}</span></div>
                <div className="mt-[16px] flex flex-col gap-[9px]">
                  {p.feats.map(f => <div key={f} className="flex items-center gap-[9px] text-[13px] text-ink2"><Icon name="tick-01" className="h-[15px] w-[15px] text-green" />{f}</div>)}
                </div>
                <Button className="mt-[18px] w-full" variant={p.hot ? "primary" : "secondary"} onClick={() => toast("This is a design demo")}>{p.cta}</Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1080px] flex-wrap justify-between gap-[10px] px-[20px] py-[26px] text-[12.5px] text-ink3">
          <span>Meridian · a FineLikeWine landing design</span>
          <span>Demo copy, not a real product</span>
        </div>
      </footer>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { Icon, iconNames, type IconName } from "@/components/icons";
import { Button, Badge, Tag, Kbd, Card, CardHead, CardBody, CardFoot, StatCard, Field, Input, Textarea, Select, SearchInput, Toggle, Checkbox, Radio, Seg, Tabs, Dropdown, MenuItem, Modal, ModalHead, ModalFoot, TableWrap, Tbl, Tr, Pagination, Alert, EmptyState, Avatar, AvatarStack, Progress, Spark, StackedBars, Donut, Legend, Code, useToast } from "@/components/ui";

export const SWATCHES: [string, string, boolean][] = [["ink","#1b1917",false],["paper","#f6f5f2",true],["surface","#ffffff",true],["positive","var(--color-greenbg)",true],["warning","var(--color-amberbg)",true],["danger","var(--color-redbg)",true],["info","var(--color-bluebg)",true],["wine","var(--color-winebg)",true]];

export function Sec({ id, num, title, lede, code, prompt, children }: { id: string; num: string; title: string; lede: string; code?: string; prompt?: string; children: React.ReactNode }) {
  const toast = useToast();
  const copy = (text: string, what: string) => { navigator.clipboard?.writeText(text); toast(what + " copied"); };
  return (
    <section id={id} className="pt-[10px]">
      <div className="mb-[26px] flex flex-wrap items-end gap-[18px] border-b border-line pb-[16px]">
        <span className="min-w-[56px] font-display text-[44px] italic leading-none text-wine">{num}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{title}</h2>
          <p className="mt-[6px] max-w-[560px] text-[13.5px] text-ink2">{lede}</p>
        </div>
        <div className="flex gap-[8px]">
          {code && <button onClick={() => copy(code, "Code")} className="flex items-center gap-[6px] rounded-[9px] border border-line bg-surface px-[11px] py-[6px] text-[12px] font-medium text-ink2 transition-all hover:border-wineline hover:text-winedeep"><Icon name="copy-01" className="h-[13px] w-[13px]" />Copy code</button>}
          {prompt && <button onClick={() => copy(prompt, "Prompt")} className="flex items-center gap-[6px] rounded-[9px] border border-line bg-surface px-[11px] py-[6px] text-[12px] font-medium text-ink2 transition-all hover:border-wineline hover:text-winedeep"><Icon name="sparkles" className="h-[13px] w-[13px]" />Copy prompt</button>}
        </div>
      </div>
      {children}
    </section>
  );
}
export function Stage({ children, col }: { children: React.ReactNode; col?: boolean }) {
  return <div className={`flex ${col ? "flex-col" : "flex-wrap items-center"} gap-[12px] rounded-[12px] border border-line bg-surface p-[22px]`}>{children}</div>;
}

export function Hero() {
  const toast = useToast();
  const [digest, setDigest] = useState(true);
  const [alerts, setAlerts] = useState(false);
  return (
      <header id="overview" className="relative overflow-visible py-[64px] pb-[40px]">
        <span className="inline-flex items-center gap-[8px] rounded-full border border-wineline bg-winebg px-[13px] py-[6px] text-[12.5px] font-medium text-winedeep">
          <Icon name="sparkles" className="h-[14px] w-[14px] text-wine" />Open source UI library · components need no extra UI packages
        </span>
        <h1 className="mt-[22px] max-w-[640px] font-display text-[clamp(44px,6.4vw,76px)] leading-[1.02] tracking-[-0.01em]">
          Interfaces that <em className="italic text-wine">age well.</em>
        </h1>
        <p className="mt-[18px] max-w-[480px] text-[15.5px] leading-[1.6] text-ink2">
          FineLikeWine is a small, opinionated library of components, pages and landing designs, built with Next.js, TypeScript and Tailwind. Warm neutrals, fine borders, tight spacing. Everything below is live, not a screenshot.
        </p>
        <div className="mt-[28px] flex flex-wrap items-center gap-[10px]">
          <a href="#buttons"><Button size="lg">Browse components<Icon name="arrow-right-01" className="h-[16px] w-[16px]" /></Button></a>
          <a href="https://github.com/Charannsai/finelikewine"><Button variant="secondary" size="lg"><Icon name="github" className="h-[16px] w-[16px]" />Star on GitHub</Button></a>
        </div>
        <div className="mt-[34px] flex flex-wrap gap-[26px]">
          {[["12", "sections"], ["4", "pages"], ["80", "icons"], ["0", "extra UI packages"]].map(([b, s]) => (
            <div key={s} className="flex flex-col gap-[2px]"><b className="text-[19px] font-semibold tabular-nums">{b}</b><span className="text-[12px] text-ink3">{s}</span></div>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-[38px] hidden w-[46%] max-w-[470px] xl:block">
          <div className="float-card pointer-events-auto absolute right-[190px] top-[6px] w-[180px] rounded-[14px] border border-line bg-surface p-[14px] shadow-[0_18px_40px_-18px_rgba(27,25,23,.22)]" style={{ "--r": "-3deg", animationDelay: "-1.2s" } as React.CSSProperties}>
            <div className="flex items-center gap-[8px]"><span className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-winebg text-wine"><Icon name="activity-01" className="h-[15px] w-[15px]" /></span><span className="text-[11.5px] text-ink3">Uptime, 30 days</span></div>
            <div className="mt-[8px] text-[22px] font-semibold tabular-nums">99.98%</div>
            <div className="mt-[3px] text-[12px]"><span className="font-medium text-green">↗ +0.01</span></div>
          </div>
          <div className="float-card pointer-events-auto absolute right-[6px] top-0 w-[158px] rounded-[14px] border border-line bg-surface p-[14px] shadow-[0_18px_40px_-18px_rgba(27,25,23,.22)]" style={{ "--r": "2.5deg", animationDelay: "-3.4s" } as React.CSSProperties}>
            <div className="flex items-center justify-between"><span className="text-[12.5px] font-medium">Digest</span><Toggle checked={digest} onChange={setDigest} /></div>
            <div className="mt-[10px] flex items-center justify-between"><span className="text-[12.5px] font-medium text-ink2">Alerts</span><Toggle checked={alerts} onChange={setAlerts} /></div>
          </div>
          <div className="float-card pointer-events-auto absolute right-[110px] top-[120px] w-[200px] rounded-[14px] border border-line bg-surface p-[14px] shadow-[0_18px_40px_-18px_rgba(27,25,23,.22)]" style={{ "--r": "-1.5deg", animationDelay: "-5.1s" } as React.CSSProperties}>
            <div className="flex flex-wrap gap-[6px]"><Badge color="green" dot>Up</Badge><Badge color="amber" dot>Degraded</Badge><Badge>Draft</Badge></div>
            <div className="mt-[12px] flex gap-[8px]"><Button size="sm" onClick={() => toast("Changes saved")}>Save</Button><Button size="sm" variant="secondary">Cancel</Button></div>
          </div>
          <div className="float-card pointer-events-auto absolute -right-[8px] top-[132px] w-[150px] rounded-[14px] border border-line bg-surface p-[14px] shadow-[0_18px_40px_-18px_rgba(27,25,23,.22)]" style={{ "--r": "2deg", animationDelay: "-2.2s" } as React.CSSProperties}>
            <div className="text-[11px] text-ink3">Apdex</div>
            <div className="mb-[6px] mt-[2px] text-[18px] font-semibold">0.94</div>
            <Spark points="M4 52 C 30 48, 40 30, 62 34 S 96 44, 118 28 160 10, 196 14" className="h-[36px] w-full" />
          </div>
        </div>
      </header>
  );
}

export function GetCodeStrip() {
  return (
      <div className="mb-[26px] flex flex-wrap items-center gap-x-[10px] gap-y-[6px] rounded-[14px] border border-wineline bg-winebg px-[18px] py-[13px] text-[13px] leading-[1.55] text-winedeep">
        <Icon name="github" className="h-[15px] w-[15px] shrink-0" />
        <span>Take what you need: every component lives in <span className="font-mono text-[12px]">components/ui.tsx</span>, icons in <span className="font-mono text-[12px]">components/icons.tsx</span> and the app shell in <span className="font-mono text-[12px]">components/chrome.tsx</span>. Copy the files into your own Next.js + Tailwind project; there is no component package to install.</span>
        <a href="https://github.com/Charannsai/finelikewine" className="ml-auto shrink-0 font-medium underline underline-offset-2">Browse the repo</a>
      </div>
  );
}

export function ColorsSec() {
  const toast = useToast();
  return (<>
      <Sec id="colors" num="01" title="Color" lede="A warm neutral base, one wine accent, and muted status tones. Nothing shouts." prompt={"Design a warm neutral UI palette with one deep merlot accent (#722E3F), muted green/amber/red/blue status tones, 1px hairline borders and paper-tinted backgrounds. Show each color as a rounded swatch with its token name and hex."}>
        <Stage>
          {SWATCHES.map(([n, c, border]) => (
            <div key={n} className="min-w-[120px] flex-1">
              <div className="h-[56px] rounded-[10px]" style={{ background: c, border: border ? "1px solid var(--color-line)" : "none" }} />
              <div className="mt-[6px] font-mono text-[11.5px] text-ink3">{n}{c.startsWith("#") ? ` · ${c}` : ""}</div>
            </div>
          ))}
        </Stage>
      </Sec>
  </>);
}

export function TypeSec() {
  const toast = useToast();
  return (<>
      <Sec id="type" num="02" title="Typography" lede="Inter for the interface, Instrument Serif for moments that deserve a voice." prompt={"Design a typography scale for a calm product UI: Inter for interface text at 14px, an elegant italic serif for display headlines, tabular numerals for metrics, mono for meta labels. Show each style with a short spec caption."}>
        <Stage col>
          <div><div className="font-display text-[38px] leading-tight">Design that gets out of the way</div><div className="mt-[4px] font-mono text-[11.5px] text-ink3">display · Instrument Serif</div></div>
          <div className="h-px w-full bg-line" />
          <div><div className="text-[19px] font-semibold tracking-[-0.02em]">Section heading</div><div className="mt-[4px] font-mono text-[11.5px] text-ink3">h2 · Inter 19 / 600</div></div>
          <div className="h-px w-full bg-line" />
          <div><p className="max-w-[520px] text-[14px] leading-[1.55] text-ink2">Body copy sits at 14px with a 1.55 line height. Long enough to read comfortably, short enough to keep dense product screens calm and scannable.</p><div className="mt-[4px] font-mono text-[11.5px] text-ink3">body · Inter 14 / 400</div></div>
          <div className="h-px w-full bg-line" />
          <div><div className="text-[26px] font-semibold tabular-nums">99.98%</div><div className="mt-[4px] font-mono text-[11.5px] text-ink3">metric · 26 / 600 / tabular-nums</div></div>
        </Stage>
      </Sec>
  </>);
}

export function ButtonsSec() {
  const toast = useToast();
  return (<>
      <Sec id="buttons" num="03" title="Buttons" lede="One ink primary. Quiet secondaries. Sizes that nest inside toolbars and tables." code={`import { Button } from "@/components/ui";
import { Icon } from "@/components/icons";

<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
<Button size="lg">Get started<Icon name="arrow-right-01" /></Button>`} prompt={"Design a button set for a refined product UI: one ink-black primary with a soft press state, quiet secondary and ghost variants, a danger option, small and large sizes, plus an icon-only toolbar button. 10px radii, 1px borders, no gradients."}>
        <Stage>
          <Button onClick={() => toast("Changes saved")}>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="danger">Delete</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" iconOnly aria-label="Settings"><Icon name="settings-02" /></Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Get started<Icon name="arrow-right-01" /></Button>
        </Stage>
        <Code>{`import { Button } from "@/components/ui";
import { Icon } from "@/components/icons";

<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
<Button size="lg">Get started<Icon name="arrow-right-01" /></Button>`}</Code>
      </Sec>
  </>);
}

export function BadgesSec() {
  const toast = useToast();
  return (<>
      <Sec id="badges" num="04" title="Badges & tags" lede="Status at a glance. Tags are toggleable filters." code={`import { Badge, Tag } from "@/components/ui";

<Badge color="green" dot>Up</Badge>
<Tag on>Design</Tag>`} prompt={"Design status badges and tags: soft tinted backgrounds with a 1px ring, an optional pulse dot for live states, and dismissible filter tags with a small close icon."}>
        <Stage>
          <Badge color="green" dot>Paid</Badge>
          <Badge color="amber" dot>Pending</Badge>
          <Badge color="red" dot>Failed</Badge>
          <Badge color="blue" dot>Sponsorship</Badge>
          <Badge color="violet" dot>Beta</Badge>
          <Badge>Draft</Badge>
          <Badge color="solid">New</Badge>
          <Badge color="wine" dot>Cellar</Badge>
          <span className="w-full" />
          <Tag on>Design</Tag><Tag>Engineering</Tag><Tag>Research</Tag>
          <Kbd>⌘K</Kbd> <Kbd>Esc</Kbd> <Kbd>↑</Kbd>
        </Stage>
        <Code>{`import { Badge, Tag } from "@/components/ui";

<Badge color="green" dot>Up</Badge>
<Tag on>Design</Tag>`}</Code>
      </Sec>
  </>);
}

export function FormsSec() {
  const toast = useToast();
  const [seg, setSeg] = useState("Month");
  const [digest, setDigest] = useState(true);
  const [alerts, setAlerts] = useState(false);
  return (<>
      <Sec id="forms" num="05" title="Inputs & controls" lede="Fine 1px borders, a soft wine focus ring, and honest error states." code={`import { Toggle, Field, Input } from "@/components/ui";

<Toggle checked={on} onChange={setOn} />
<Field label="Email" hint="We never share your address.">
  <Input type="email" placeholder="you@studio.com" />
</Field>`} prompt={"Design form controls for a calm dashboard: labeled text inputs with hint text, a textarea, a select, a search input with prefix icon, an iOS-style toggle, checkboxes, radios and a segmented Day/Month/Year control. Focus rings in soft merlot."}>
        <Stage>
          <Field label="Email" hint="We never share your address."><Input type="email" placeholder="you@studio.com" /></Field>
          <Field label="Search"><SearchInput placeholder="Search components..." /></Field>
          <Field label="Plan"><Select><option>Monthly</option><option>Annual</option><option>Founding</option></Select></Field>
          <Field label="Workspace slug" error="Lowercase letters, numbers and dashes only."><Input defaultValue="Fine Like Wine!!" error /></Field>
          <Field label="Notes"><Textarea rows={2} placeholder="Anything we should know?" /></Field>
          <span className="w-full" />
          <Toggle checked={digest} onChange={setDigest} />
          <Toggle checked={alerts} onChange={setAlerts} />
          <Checkbox label="Email me a receipt" defaultChecked />
          <Checkbox label="Include usage data" />
          <Radio name="r1" label="Monthly" defaultChecked />
          <Radio name="r1" label="Annual" />
          <span className="w-full" />
          <Seg options={["Day", "Month", "Year"]} value={seg} onChange={setSeg} />
        </Stage>
        <Code>{`import { Toggle, Field, Input } from "@/components/ui";

<Toggle checked={on} onChange={setOn} />
<Field label="Email" hint="We never share your address.">
  <Input type="email" placeholder="you@studio.com" />
</Field>`}</Code>
      </Sec>
  </>);
}

export function CardsSec() {
  const toast = useToast();
  return (<>
      <Sec id="cards" num="06" title="Cards" lede="White on warm paper, one-pixel borders, headers that carry their own actions." code={`import { Card, CardHead, CardBody, CardFoot, Badge, Button } from "@/components/ui";

<Card>
  <CardHead><h3>Project brief</h3><Badge color="violet">In review</Badge></CardHead>
  <CardBody>...</CardBody>
  <CardFoot><Button size="sm">Open</Button></CardFoot>
</Card>`} prompt={"Design dashboard cards: white surfaces on warm paper, 1px borders, headers with their own actions, a stat card with icon tile, delta and sparkline, a project card with progress and avatar stack, and an on-call card with hand-off action."}>
        <div className="grid gap-[14px] md:grid-cols-3">
          <StatCard icon="activity-01" iconBg="var(--color-greenbg)" label="Uptime, 30 days" value="99.98%" delta="↗ +0.01" deltaUp sub="11 min downtime total" />
          <StatCard icon="zap" iconBg="var(--color-bluebg)" label="Avg response" value="182 ms" delta="↗ -12 ms" deltaUp sub="p95 sits at 410 ms" />
          <StatCard icon="alert-02" iconBg="var(--color-amberbg)" label="Active incidents" value="2" delta="↘ +1 today" sub="1 acknowledged" />
        </div>
        <div className="mt-[14px] grid gap-[14px] md:grid-cols-2">
          <Card hover>
            <CardHead><h3 className="text-[13.5px] font-semibold">Project brief</h3><span className="flex-1" /><Badge color="violet">In review</Badge></CardHead>
            <CardBody>
              <p className="text-[13.5px] text-ink2">A quiet redesign of the onboarding flow. Fewer steps, bigger type, and a progress bar that tells the truth.</p>
              <div className="mt-[14px] flex justify-between text-[12.5px] text-ink3"><span>Progress</span><span>68%</span></div>
              <div className="mt-[6px]"><Progress value={68} /></div>
            </CardBody>
            <CardFoot><AvatarStack items={["AK", "JR", "+3"]} /><span className="flex-1" /><Button variant="secondary" size="sm">Open</Button></CardFoot>
          </Card>
          <Card hover>
            <CardHead><h3 className="text-[13.5px] font-semibold">On-call now</h3><span className="flex-1" /><Button variant="ghost" size="sm" iconOnly aria-label="More"><Icon name="more-horizontal" className="h-[15px] w-[15px]" /></Button></CardHead>
            <CardBody>
              {[["Primary", "Dana, until 6 PM"], ["Escalates to", "Platform team"], ["Channel", "#vigil-incidents"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-[7px] text-[13px] first:pt-0 last:pb-0"><span className="text-ink3">{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </CardBody>
            <CardFoot><Button size="sm" onClick={() => toast("Handoff note sent to Dana")}>Hand off</Button><Button variant="ghost" size="sm">Rotation</Button></CardFoot>
          </Card>
        </div>
        <Code>{`import { Card, CardHead, CardBody, CardFoot, Badge, Button } from "@/components/ui";

<Card>
  <CardHead><h3>Project brief</h3><Badge color="violet">In review</Badge></CardHead>
  <CardBody>...</CardBody>
  <CardFoot><Button size="sm">Open</Button></CardFoot>
</Card>`}</Code>
      </Sec>
  </>);
}

export function TablesSec() {
  const toast = useToast();
  return (<>
      <Sec id="tables" num="07" title="Tables" lede="Sticky-quiet headers, hover rows, right-aligned numbers, status badges inline." prompt={"Design a data table for an uptime dashboard: quiet sticky header, hover rows, right-aligned tabular numbers, inline status badges, per-row menu and a footer with row count and pagination."}>
        <TableWrap>
          <Tbl head={["Monitor", "Type", "Region", "Latency", "Uptime", "Status", ""]}>
            {[
              ["AG", "var(--color-bluebg)", "API gateway", "api.fernwood.dev/health", <Badge key="t" color="blue" dot>HTTP</Badge>, "us-east", "84 ms", "99.99%", <Badge key="s" color="amber">Degraded</Badge>],
              ["CO", "var(--color-redbg)", "Checkout", "checkout.fernwood.dev", <Badge key="t" color="blue" dot>HTTP</Badge>, "eu-west", "n/a", "99.71%", <Badge key="s" color="red">Down</Badge>],
              ["WH", "var(--color-greenbg)", "Webhooks worker", "queue.fernwood.internal:6380", <Badge key="t" color="violet" dot>TCP</Badge>, "ap-south", "41 ms", "100%", <Badge key="s" color="green">Up</Badge>],
            ].map((r, i) => (
              <Tr key={i}>
                <td><div className="flex items-center gap-[10px]"><Avatar bg={r[1] as string}>{r[0]}</Avatar><div><div className="font-medium">{r[2]}</div><div className="text-[11.5px] text-ink3">{r[3]}</div></div></div></td>
                <td>{r[4]}</td><td className="text-ink2">{r[5]}</td><td className="text-right tabular-nums">{r[6]}</td><td className="text-right tabular-nums">{r[7]}</td><td>{r[8]}</td>
                <td><Button variant="ghost" size="sm" iconOnly aria-label="More"><Icon name="more-horizontal" className="h-[15px] w-[15px]" /></Button></td>
              </Tr>
            ))}
          </Tbl>
        </TableWrap>
        <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[10px]">
          <span className="text-[12.5px] text-ink3">3 of 24 monitors</span>
          <Pagination current={1} total={3} />
        </div>
      </Sec>
  </>);
}

export function NavSec() {
  const toast = useToast();
  return (<>
      <Sec id="navigation" num="08" title="Tabs & menus" lede="Underline tabs, dropdown menus with keyboard hints, and breadcrumbs." prompt={"Design navigation components: underline tabs with an animated active indicator, a dropdown menu with icons, keyboard hints and a danger item, and a breadcrumbs row."}>
        <Stage col>
          <Tabs tabs={["Overview", "Members", "Settings"]} panels={[
            <span key="a">Overview panel. Panels swap without a page load.</span>,
            <span key="b">1,284 members, 64 new this week.</span>,
            <span key="c">Workspace settings live here.</span>,
          ]} />
        </Stage>
        <div className="mt-[14px]">
          <Stage>
            <Dropdown label="Actions">
              <div className="px-[9px] pb-[4px] pt-[6px] text-[10.5px] font-semibold uppercase tracking-[.08em] text-ink3">Record</div>
              <MenuItem icon="copy-01" kbd="⌘D" onClick={() => toast("Duplicated")}>Duplicate</MenuItem>
              <MenuItem icon="link-01" onClick={() => toast("Link copied")}>Copy link</MenuItem>
              <div className="my-[4px] h-px bg-line" />
              <MenuItem icon="delete-02" danger onClick={() => toast("Archived")}>Archive</MenuItem>
            </Dropdown>
            <span className="text-[13px] text-ink3">Workspace › Audience › <b className="text-ink">Segments</b></span>
          </Stage>
        </div>
      </Sec>
  </>);
}

export function OverlaysSec() {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [monitorModal, setMonitorModal] = useState(false);
  return (<>
      <Sec id="overlays" num="09" title="Modal, toast & palette" lede="Overlays arrive with a short spring and leave quietly. Focus is trapped, Escape closes. Try each one." prompt={"Design overlay components: a spring-in modal with header icon tile, radio choice list and footer actions, a slide-up toast with icon, and a command palette with grouped actions and keyboard hints."}>
        <Stage>
          <Button onClick={() => setModal(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => toast("Invite sent to dana@fernwood.dev")}>Show toast</Button>
          <Button variant="secondary" onClick={() => setMonitorModal(true)}>New monitor modal</Button>
          <span className="text-[12.5px] text-ink3">Press <Kbd>⌘K</Kbd> anywhere for the palette</span>
        </Stage>
      </Sec>
      <Modal open={modal} onClose={() => setModal(false)} label="Acknowledge incident">
        <ModalHead icon="alert-02" iconBg="var(--color-amberbg)" title="Acknowledge incident" sub="Checkout has failed 3 health checks in a row in eu-west." onClose={() => setModal(false)} />
        <div className="px-[18px] py-[16px]">
          {[["Monitor", "checkout.fernwood.dev"], ["Started", "14:02 IST · 6 min ago"]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-[7px] text-[13px]"><span className="text-ink3">{k}</span><span className="font-medium">{v}</span></div>
          ))}
          <div className="mt-[10px] flex flex-col gap-[8px]">
            <label className="flex cursor-pointer items-start gap-[10px] rounded-[11px] border border-ink bg-surface2 p-[12px]"><input type="radio" name="po" defaultChecked className="mt-[3px]" /><span><span className="block text-[13px] font-medium">Fix is deploying</span><span className="block text-[12px] text-ink3">Auto-resolve when checks pass again.</span></span></label>
            <label className="flex cursor-pointer items-start gap-[10px] rounded-[11px] border border-line p-[12px]"><input type="radio" name="po" className="mt-[3px]" /><span><span className="block text-[13px] font-medium">Monitoring only</span><span className="block text-[12px] text-ink3">Acknowledge, but keep paging until it recovers.</span></span></label>
          </div>
        </div>
        <ModalFoot>
          <span className="mr-auto text-[12px] text-ink3">Logged to the incident timeline</span>
          <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          <Button onClick={() => { setModal(false); toast("Incident acknowledged, paging paused"); }}>Acknowledge</Button>
        </ModalFoot>
      </Modal>
      <Modal open={monitorModal} onClose={() => setMonitorModal(false)} label="New monitor">
        <ModalHead icon="add-01" iconBg="var(--color-winebg)" title="New monitor" sub="Vigil checks it every 30 seconds from three regions." onClose={() => setMonitorModal(false)} />
        <div className="flex flex-col gap-[14px] px-[18px] py-[16px]">
          <Field label="URL"><Input placeholder="https://api.yoursite.com/health" /></Field>
          <Field label="Alert after"><Select><option>3 consecutive failures</option><option>First failure</option><option>5 consecutive failures</option></Select></Field>
        </div>
        <ModalFoot>
          <Button variant="secondary" onClick={() => setMonitorModal(false)}>Cancel</Button>
          <Button onClick={() => { setMonitorModal(false); toast("Monitor created"); }}>Create monitor</Button>
        </ModalFoot>
      </Modal>
  </>);
}

export function ChartsSec() {
  const toast = useToast();
  const [chartRange, setChartRange] = useState("Monthly");
  return (<>
      <Sec id="charts" num="10" title="Charts" lede="Hand-drawn SVG: stacked bars, sparklines and donut. Flat fills, rounded caps, no grid spaghetti." prompt={"Design lightweight SVG charts in one merlot accent: a stacked bar chart with grid lines, legend and range toggle, a smooth sparkline, and a donut with center total."}>
        <div className="grid gap-[14px] lg:grid-cols-2">
          <Card>
            <CardHead><h3 className="text-[13.5px] font-semibold">Requests by status</h3><span className="flex-1" /><Seg small options={["Weekly", "Monthly"]} value={chartRange} onChange={setChartRange} /></CardHead>
            <CardBody>
              <div className="mb-[14px]"><Legend items={[{ label: "2xx success", color: "#8fce6e" }, { label: "4xx client errors", color: "#f2b45c" }, { label: "5xx server errors", color: "#e2603f" }]} /></div>
              <StackedBars
                data={[[30,10,4],[34,11,5],[36,12,5],[42,13,6],[44,14,6],[50,15,7],[58,17,7],[64,18,8],[72,19,8],[78,20,9],[84,21,9],[92,22,10]]}
                labels={["J","F","M","A","M","J","J","A","S","O","N","D"]}
                colors={["#8fce6e", "#f2b45c", "#e2603f"]} />
            </CardBody>
          </Card>
          <div className="flex flex-col gap-[14px]">
            <Card><CardBody className="flex items-center gap-[18px]">
              <div><div className="text-[12.5px] text-ink3">Apdex score</div><div className="text-[24px] font-semibold">0.94</div><span className="text-[12px] font-medium text-green">↗ +0.02</span></div>
              <Spark points="M4 52 C 30 48, 40 30, 62 34 S 96 44, 118 28 160 10, 196 14" className="h-[64px] flex-1" />
            </CardBody></Card>
            <Card><CardBody className="flex items-center gap-[18px]">
              <Donut parts={[{ label: "us-east", value: 54, color: "#8fce6e" }, { label: "eu-west", value: 37, color: "#7ea6f5" }, { label: "ap-south", value: 9, color: "#f2b45c" }]} center="54%" centerSub="us-east" />
              <Legend col items={[{ label: "us-east · 54%", color: "#8fce6e" }, { label: "eu-west · 37%", color: "#7ea6f5" }, { label: "ap-south · 9%", color: "#f2b45c" }]} />
            </CardBody></Card>
          </div>
        </div>
      </Sec>
  </>);
}

export function FeedbackSec() {
  const toast = useToast();
  return (<>
      <Sec id="feedback" num="11" title="Feedback & states" lede="Alerts, skeletons and empty states that say what happened and what to do next." prompt={"Design feedback states: inline alert banners with icon and action, a friendly empty state with illustration and call to action, skeleton loading rows, and a progress meter."}>
        <Stage col>
          <Alert kind="success" title="Monitor recovered.">checkout.fernwood.dev is responding in 96 ms.</Alert>
          <Alert kind="warn" title="Error budget 65% consumed.">Deploys pause automatically at 80%.</Alert>
          <Alert kind="error" title="3 consecutive failures.">checkout.fernwood.dev is down in eu-west.</Alert>
          <Alert kind="info" title="Maintenance window.">eu-west checks pause Saturday 02:00 to 02:30 IST.</Alert>
        </Stage>
        <div className="mt-[14px] grid gap-[14px] md:grid-cols-2">
          <Card><CardBody>
            <EmptyState icon="empty" title="No open incidents" body="When a monitor starts failing, the incident and its timeline land here."
              action={<Button size="sm" onClick={() => toast("Monitor created")}>New monitor</Button>} />
          </CardBody></Card>
          <Card><CardBody className="flex flex-col gap-[12px]">
            <div className="skel h-[14px] w-[40%]" /><div className="skel h-[14px]" /><div className="skel h-[14px] w-[85%]" />
            <div className="flex items-center gap-[10px]"><div className="skel h-[34px] w-[34px] rounded-full" /><div className="flex-1"><div className="skel h-[11px] w-[55%]" /><div className="skel mt-[6px] h-[11px] w-[35%]" /></div></div>
          </CardBody></Card>
        </div>
      </Sec>
  </>);
}

export function PagesSec() {
  const toast = useToast();
  return (<>
      <Sec id="pages" num="13" title="Pages" lede="Full compositions built from the same components. Open one, resize it, break it." prompt={"Design three showcase cards that preview full page designs: a monitoring dashboard, a SaaS landing page and a newsletter landing, each with a small wireframe thumbnail, description and hover lift."}>
        <div className="grid gap-[14px] md:grid-cols-3">
          {([
            { href: "/dashboard", icon: "grid-view" as IconName, name: "Vigil dashboard", desc: "Sidebar app shell, stats, charts, table", mock: "dash" },
            { href: "/landing/meridian", icon: "rocket-01" as IconName, name: "Meridian landing", desc: "SaaS marketing page with pricing", mock: "saas" },
            { href: "/landing/fieldnotes", icon: "mail-01" as IconName, name: "Fieldnotes landing", desc: "Newsletter page with signup capture", mock: "news" },
          ]).map(p => (
            <a key={p.href} href={p.href} className="group block overflow-hidden rounded-[16px] border border-line bg-surface transition-all hover:-translate-y-[4px] hover:border-wineline hover:shadow-[0_24px_44px_-22px_rgba(27,25,23,.28)]">
              <div className="h-[150px] overflow-hidden border-b border-line bg-paper px-[18px] pt-[18px]">
                <div className="flex h-full flex-col gap-[7px] rounded-t-[10px] border border-b-0 border-line bg-surface p-[10px]">
                  {p.mock === "dash" && (<>
                    <div className="flex items-center gap-[6px]"><span className="h-[8px] w-[8px] rounded-full bg-wine" /><span className="h-[6px] w-[52px] rounded-[3px] bg-line" /><span className="flex-1" /><span className="h-[6px] w-[30px] rounded-[3px] bg-line" /></div>
                    <div className="flex flex-1 gap-[6px]"><div className="flex w-[34px] flex-col gap-[5px] border-r border-line pt-[4px]"><span className="h-[6px] w-[18px] rounded-[3px] bg-line" /><span className="h-[6px] w-[18px] rounded-[3px] bg-line" /><span className="h-[6px] w-[18px] rounded-[3px] bg-line" /></div>
                    <div className="flex flex-1 flex-col gap-[6px] pt-[4px]"><div className="flex gap-[5px]"><span className="h-[16px] w-[34px] rounded-[3px] bg-line" /><span className="h-[16px] w-[34px] rounded-[3px] bg-line" /><span className="h-[16px] w-[34px] rounded-[3px] bg-line" /></div><span className="h-[26px] w-full rounded-[3px] bg-winebg" /><span className="h-[6px] w-[80%] rounded-[3px] bg-line" /></div></div>
                  </>)}
                  {p.mock === "saas" && (<>
                    <div className="flex items-center gap-[6px]"><span className="h-[8px] w-[8px] rounded-full bg-wine" /><span className="flex-1" /><span className="h-[6px] w-[22px] rounded-[3px] bg-line" /><span className="h-[6px] w-[22px] rounded-[3px] bg-line" /><span className="h-[6px] w-[34px] rounded-[3px] bg-wine" /></div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-[7px]"><span className="h-[9px] w-[60%] rounded-[3px] bg-line" /><span className="h-[6px] w-[42%] rounded-[3px] bg-line" /><span className="h-[12px] w-[26%] rounded-[3px] bg-winebg" /></div>
                  </>)}
                  {p.mock === "news" && (<>
                    <div className="flex items-center gap-[6px]"><span className="h-[8px] w-[8px] rounded-full bg-wine" /><span className="h-[6px] w-[40px] rounded-[3px] bg-line" /><span className="flex-1" /><span className="h-[6px] w-[22px] rounded-[3px] bg-line" /></div>
                    <div className="flex flex-1 flex-col justify-center gap-[7px]"><span className="h-[9px] w-[55%] rounded-[3px] bg-line" /><span className="h-[6px] w-[70%] rounded-[3px] bg-line" /><div className="mt-[2px] flex gap-[5px]"><span className="h-[14px] w-[60%] rounded-[3px] border border-line bg-surface" /><span className="h-[14px] w-[26%] rounded-[3px] bg-wine" /></div></div>
                  </>)}
                </div>
              </div>
              <div className="flex items-center gap-[10px] px-[18px] py-[16px]">
                <Icon name={p.icon} className="h-[17px] w-[17px] text-wine" />
                <div><h3 className="text-[14.5px] font-semibold">{p.name}</h3><p className="mt-[2px] text-[12px] text-ink3">{p.desc}</p></div>
                <span className="ml-auto text-ink3 transition-all group-hover:translate-x-[3px] group-hover:text-wine"><Icon name="arrow-up-right-01" className="h-[16px] w-[16px]" /></span>
              </div>
            </a>
          ))}
        </div>
      </Sec>
  </>);
}

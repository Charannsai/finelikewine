"use client";
import React, { useState } from "react";
import { Icon } from "@/components/icons";
import { MotionRoot, NumberTicker } from "@/components/motion";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
import { Sidebar, Topbar, Shell, type NavGroup } from "@/components/chrome";
import { Button, Badge, Card, CardHead, CardBody, StatCard, Dropdown, MenuItem, Modal, ModalHead, ModalFoot, Field, Input, Select, TableWrap, Tbl, Tr, Seg, Avatar, Legend, StackedBars, useToast } from "@/components/ui";

const NAV: NavGroup[] = [
  { label: "Observe", items: [
    { href: "#monitors", label: "Monitors", icon: "activity-01" },
    { href: "#incidents", label: "Incidents", icon: "alert-02", count: 2 },
    { href: "#status", label: "Status pages", icon: "globe-02" },
    { href: "#alerts", label: "Alert rules", icon: "bell-01" },
    { href: "#oncall", label: "On-call", icon: "clock-01" },
  ]},
  { label: "Configure", items: [
    { href: "#regions", label: "Regions", icon: "map-pin", count: 3 },
    { href: "#maintenance", label: "Maintenance", icon: "wrench-01" },
    { href: "#tokens", label: "API tokens", icon: "key-01" },
    { href: "#integrations", label: "Integrations", icon: "plug-01" },
  ]},
  { items: [{ href: "/", label: "Back to library", icon: "arrow-left-01" }] },
];

const LAT = [
  [110,120,180],[105,125,175],[120,130,200],[115,135,205],[100,125,190],[125,140,215],
  [110,130,195],[130,145,225],[120,135,205],[135,150,230],[125,140,210],[140,155,240],
];
const HOURS = ["0h","2h","4h","6h","8h","10h","12h","14h","16h","18h","20h","22h"];

export default function Dashboard() {
  const toast = useToast();
  const [ack, setAck] = useState(false);
  const [newMon, setNewMon] = useState(false);
  const [perc, setPerc] = useState("p95");
  return (
    <Shell
      sidebar={<Sidebar groups={NAV} brand="Vigil" />}
      topbar={<Topbar crumbs={<>Workspace › <b className="text-ink">Monitors</b></>} actions={[
        { label: "New monitor", icon: "add-01", onSelect: () => setNewMon(true), group: "Actions" },
        { label: "Acknowledge incident", icon: "checkmark-circle-01", onSelect: () => setAck(true), group: "Actions" },
        { label: "Back to library", icon: "arrow-left-01", href: "/", group: "Go to" },
      ]} />}
    >
      <div id="monitors" data-reveal className="mb-[20px] flex flex-wrap items-end gap-[14px] pt-[26px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.01em]">Monitors</h1>
          <p className="mt-[4px] text-[13.5px] text-ink2"><NumberTicker value={24} /> checks across 3 regions, every 30 seconds.</p>
        </div>
        <span className="flex-1" />
        <Dropdown label="Last 24 hours" icon="clock-01" right>
          <MenuItem>Last hour</MenuItem><MenuItem>Last 24 hours</MenuItem><MenuItem>Last 7 days</MenuItem><MenuItem>Last 30 days</MenuItem>
        </Dropdown>
        <Button variant="secondary" size="sm" onClick={() => toast("Status page link copied")}><Icon name="link-01" className="h-[14px] w-[14px]" />Status page</Button>
        <Button size="sm" onClick={() => setNewMon(true)}><Icon name="add-01" className="h-[14px] w-[14px]" />New monitor</Button>
      </div>

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <div data-reveal style={d(0)}><StatCard icon="activity-01" iconBg="var(--color-greenbg)" label="Uptime, 30 days" value="99.98%" delta="↗ +0.01" deltaUp sub="11 min downtime total" /></div>
        <div data-reveal style={d(80)}><StatCard icon="zap" iconBg="var(--color-bluebg)" label="Avg response" value="182 ms" delta="↗ -12 ms" deltaUp sub="p95 sits at 410 ms" /></div>
        <div data-reveal style={d(160)}><StatCard icon="alert-02" iconBg="var(--color-amberbg)" label="Active incidents" value="2" delta="↘ +1 today" sub="1 acknowledged" /></div>
        <div data-reveal style={d(240)}><StatCard icon="shield-01" iconBg="var(--color-violetbg)" label="Error budget left" value="63%" delta="↘ -9 pts" sub="deploys pause at 20%" /></div>
      </div>

      <div data-reveal style={d(320)} className="mt-[14px] grid gap-[14px] xl:grid-cols-[1fr_300px]">
        <Card>
          <CardHead>
            <div><h3 className="text-[13.5px] font-semibold">Response time by region</h3><div className="mt-[1px] text-[11.5px] font-normal text-ink3">Median check latency, last 12 hours.</div></div>
            <span className="flex-1" />
            <Seg small options={["p50", "p95"]} value={perc} onChange={setPerc} />
          </CardHead>
          <CardBody>
            <div className="mb-[14px]"><Legend items={[{ label: "us-east", color: "var(--chart-1)" }, { label: "eu-west", color: "var(--chart-2)" }, { label: "ap-south", color: "var(--chart-3)" }]} /></div>
            <StackedBars data={LAT} labels={HOURS} colors={["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]} />
          </CardBody>
        </Card>

        <Card>
          <CardHead><h3 className="text-[13.5px] font-semibold">Active incidents</h3><span className="flex-1" /><Badge color="red">2 open</Badge></CardHead>
          <CardBody className="flex flex-col gap-[12px]">
            <div className="rounded-[11px] border border-red/25 bg-redbg p-[12px]">
              <div className="flex items-center justify-between"><span className="text-[12.5px] font-semibold">checkout.fernwood.dev</span><span className="text-[11px] font-semibold text-red">Down</span></div>
              <div className="mt-[3px] text-[11.5px] text-ink2">3 consecutive failures in eu-west · 6 min</div>
              <Button size="sm" variant="secondary" className="mt-[9px]" onClick={() => setAck(true)}>Acknowledge</Button>
            </div>
            <div className="flex items-start justify-between gap-[10px]">
              <div><div className="text-[12.5px] font-semibold">api.fernwood.dev</div><div className="mt-[2px] text-[11.5px] text-ink3">p95 above 800 ms · acknowledged by Dana, 14:07</div></div>
              <Badge color="amber">Degraded</Badge>
            </div>
            <div className="h-px bg-line" />
            <div className="flex items-center gap-[10px] text-[12px]">
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-surface2 text-ink3"><Icon name="calendar-01" className="h-[14px] w-[14px]" /></span>
              <div><div className="text-ink3">Next maintenance</div><div className="font-medium">Sat 02:00, eu-west</div></div>
              <span className="ml-auto text-ink3">30 min</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div data-reveal style={d(420)} className="mt-[14px]">
        <Card>
          <CardHead><h3 className="text-[13.5px] font-semibold">Monitors</h3><span className="flex-1" /><Button variant="secondary" size="sm">View all</Button></CardHead>
          <TableWrap>
            <Tbl head={["Monitor", "Type", "Region", "Latency", "Uptime", "Status", ""]}>
              {[
                ["AG", "var(--color-bluebg)", "API gateway", "api.fernwood.dev/health", <Badge key="t" color="blue" dot>HTTP</Badge>, "us-east", "84 ms", "99.99%", <Badge key="s" color="amber">Degraded</Badge>],
                ["CO", "var(--color-redbg)", "Checkout", "checkout.fernwood.dev", <Badge key="t" color="blue" dot>HTTP</Badge>, "eu-west", "n/a", "99.71%", <Badge key="s" color="red">Down</Badge>],
                ["WH", "var(--color-greenbg)", "Webhooks worker", "queue.fernwood.internal:6380", <Badge key="t" color="violet" dot>TCP</Badge>, "ap-south", "41 ms", "100%", <Badge key="s" color="green">Up</Badge>],
                ["LG", "var(--color-violetbg)", "Login page", "fernwood.dev/signin", <Badge key="t" color="blue" dot>HTTP</Badge>, "us-east", "112 ms", "99.99%", <Badge key="s" color="green">Up</Badge>],
              ].map((r, i) => (
                <Tr key={i}>
                  <td><div className="flex items-center gap-[10px]"><Avatar bg={r[1] as string}>{r[0]}</Avatar><div><div className="font-medium">{r[2]}</div><div className="text-[11.5px] text-ink3">{r[3]}</div></div></div></td>
                  <td>{r[4]}</td><td className="text-ink2">{r[5]}</td><td className="text-right tabular-nums">{r[6]}</td><td className="text-right tabular-nums">{r[7]}</td><td>{r[8]}</td>
                  <td><Button variant="ghost" size="sm" iconOnly aria-label="More"><Icon name="more-horizontal" className="h-[15px] w-[15px]" /></Button></td>
                </Tr>
              ))}
            </Tbl>
          </TableWrap>
        </Card>
      </div>

      <Modal open={ack} onClose={() => setAck(false)} label="Acknowledge incident">
        <ModalHead icon="alert-02" iconBg="var(--color-amberbg)" title="Acknowledge incident" sub="Checkout has failed 3 health checks in a row in eu-west." onClose={() => setAck(false)} />
        <div className="px-[18px] py-[16px]">
          {[["Monitor", "checkout.fernwood.dev"], ["Started", "14:02 IST · 6 min ago"]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-[7px] text-[13px]"><span className="text-ink3">{k}</span><span className="font-medium">{v}</span></div>
          ))}
        </div>
        <ModalFoot>
          <Button variant="secondary" onClick={() => setAck(false)}>Cancel</Button>
          <Button onClick={() => { setAck(false); toast("Incident acknowledged, paging paused"); }}>Acknowledge</Button>
        </ModalFoot>
      </Modal>

      <Modal open={newMon} onClose={() => setNewMon(false)} label="New monitor">
        <ModalHead icon="add-01" iconBg="var(--color-winebg)" title="New monitor" sub="Vigil checks it every 30 seconds from three regions." onClose={() => setNewMon(false)} />
        <div className="flex flex-col gap-[14px] px-[18px] py-[16px]">
          <Field label="URL"><Input placeholder="https://api.yoursite.com/health" /></Field>
          <Field label="Alert after"><Select><option>3 consecutive failures</option><option>First failure</option><option>5 consecutive failures</option></Select></Field>
        </div>
        <ModalFoot>
          <Button variant="secondary" onClick={() => setNewMon(false)}>Cancel</Button>
          <Button onClick={() => { setNewMon(false); toast("Monitor created"); }}>Create monitor</Button>
        </ModalFoot>
      </Modal>
      <MotionRoot />
    </Shell>
  );
}

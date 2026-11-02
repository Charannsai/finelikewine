"use client";
/**
 * Card · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Metric" | "Pricing" | "Integration"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const SERIES = [42, 48, 45, 52, 58, 55, 63, 61, 70, 68, 76, 82, 79, 88];
function Metric() {
  const [hi, setHi] = useState<number | null>(null);
  const W = 320, H = 96, MIN = 30, MAX = 100;
  const pts = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * W, H - ((v - MIN) / (MAX - MIN)) * H] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const cur = hi ?? SERIES.length - 1;
  const change = cur ? ((SERIES[cur] - SERIES[cur - 1]) / SERIES[cur - 1]) * 100 : 0;
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-line2 bg-surface">
      <div className="px-4 pt-4">
        <div className="flex justify-between text-[12.5px] text-ink3"><span>Revenue</span><span className="font-mono">{hi === null ? "last 14 days" : `day ${cur + 1}`}</span></div>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="text-[28px] font-semibold tracking-tight tabular-nums">${(SERIES[cur] * 142).toLocaleString()}</span>
          <span className={cx("text-[12.5px] font-medium tabular-nums transition-colors duration-300", change < 0 ? "text-red" : "text-green")}>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 4}`} className="mt-2.5 block w-full cursor-crosshair" onMouseLeave={() => setHi(null)}
        onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setHi(Math.round(((e.clientX - r.left) / r.width) * (SERIES.length - 1))); }}>
        <defs><linearGradient id="metric-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".25" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
        <path d={`${line} L ${W} ${H + 4} L 0 ${H + 4} Z`} fill="url(#metric-fill)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinejoin="round" />
        {hi !== null && <>
          <line x1={pts[hi][0]} x2={pts[hi][0]} y1="0" y2={H + 4} stroke="var(--line2)" strokeDasharray="3 3" />
          <circle cx={pts[hi][0]} cy={pts[hi][1]} r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
        </>}
      </svg>
    </div>
  );
}

function Pricing() {
  const [cycle, setCycle] = useState<"Monthly" | "Yearly">("Yearly");
  const target = cycle === "Yearly" ? 19 : 24;
  const [shown, setShown] = useState(target);
  const [chosen, setChosen] = useState(false);
  useEffect(() => {
    if (shown === target) return;
    const t = setTimeout(() => setShown(s => s + Math.sign(target - s)), 70);
    return () => clearTimeout(t);
  }, [shown, target]);
  return (
    <div className="w-full max-w-xs rounded-xl border border-line2 bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Pro</span>
        <div className="flex rounded-lg border border-line bg-surface2 p-0.5">
          {(["Monthly", "Yearly"] as const).map(c => (
            <button key={c} onClick={() => setCycle(c)} className={cx("h-6 rounded-md px-2 text-[11.5px] transition-colors duration-500", cycle === c ? "bg-surface text-ink shadow-sm" : "text-ink3")}>{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-1.5"><span className="text-[38px] font-semibold tracking-tight tabular-nums">${shown}</span><span className="text-[12.5px] text-ink3">per seat / month</span></div>
      <div className={cx("h-4 text-xs text-green transition-opacity duration-500", cycle === "Yearly" ? "opacity-100" : "opacity-0")}>You save $60 a year per seat</div>
      <ul className="mt-3.5 flex flex-col gap-2 border-t border-line pt-3.5">
        {["Unlimited projects", "Private share links", "Version history, 90 days"].map(f => (
          <li key={f} className="flex items-center gap-2 text-[13px] text-ink2">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M20 6 9 17l-5-5" /></svg>{f}
          </li>
        ))}
      </ul>
      <button onClick={() => setChosen(c => !c)} className={cx("mt-4 h-9 w-full rounded-lg text-[13px] font-medium transition-colors duration-500", chosen ? "bg-greenbg text-green" : "bg-ink text-onink hover:bg-ink/85")}>
        {chosen ? `Trial started, billed ${cycle.toLowerCase()}` : "Start 14-day trial"}
      </button>
    </div>
  );
}

const APPS = [
  { name: "Webhooks", desc: "POST events to any URL", d: "M8 12h8M12 8v8M4 4h16v16H4z" },
  { name: "Postgres", desc: "Sync tables hourly", d: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" },
  { name: "Calendar", desc: "Deadlines on your calendar", d: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" },
];
type Conn = "off" | "busy" | "on";
function Integrations() {
  const [st, setSt] = useState<Record<string, Conn>>({ Webhooks: "on", Postgres: "off", Calendar: "off" });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const flip = (k: string) => {
    if (st[k] === "on") return setSt(s => ({ ...s, [k]: "off" }));
    setSt(s => ({ ...s, [k]: "busy" }));
    timers.current.push(setTimeout(() => setSt(s => ({ ...s, [k]: "on" })), 1300));
  };
  const dot = { on: "bg-green", busy: "bg-amber animate-pulse", off: "bg-ink3" };
  const label = { on: "Connected", busy: "Connecting", off: "Not connected" };
  return (
    <div className="grid w-full max-w-2xl gap-2.5 sm:grid-cols-3">
      {APPS.map(a => (
        <div key={a.name} className="flex flex-col rounded-xl border border-line2 bg-surface p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface2 text-ink2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[17px] w-[17px]"><path d={a.d} /></svg>
            </span>
            <button role="switch" aria-checked={st[a.name] === "on"} aria-label={`Connect ${a.name}`} disabled={st[a.name] === "busy"} onClick={() => flip(a.name)}
              className={cx("relative h-5 w-[34px] rounded-md border transition-colors duration-500", st[a.name] === "off" ? "border-line2 bg-surface3" : "border-wine bg-wine")}>
              <span className={cx("absolute top-0.5 h-3.5 w-3.5 rounded bg-white shadow transition-[left] duration-500", st[a.name] === "off" ? "left-0.5" : "left-4")} />
            </button>
          </div>
          <div className="mt-3.5 text-[13.5px] font-medium">{a.name}</div>
          <div className="mt-0.5 text-xs text-ink3">{a.desc}</div>
          <div className="mt-3.5 flex items-center gap-1.5 border-t border-line pt-2.5 text-xs text-ink2">
            <i className={cx("h-1.5 w-1.5 rounded-full", dot[st[a.name]])} />{label[st[a.name]]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CardDemo({ variant = "Metric" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {variant === "Metric" && <Metric />}
      {variant === "Pricing" && <Pricing />}
      {variant === "Integration" && <Integrations />}
    </div>
  );
}

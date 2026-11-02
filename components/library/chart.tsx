"use client";
/**
 * Chart · finelikewine
 * Plain SVG, React + Tailwind, no chart library. Colors come from the theme tokens in app/globals.css
 * (--accent, --chart-2, --chart-3, --line, --ink3 ...).
 * Variants: "Bars" | "Area" | "Donut"
 */
import React, { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

function Tip({ x, flip, title, rows }: { x: number; flip: boolean; title: string; rows: [string, string, number | string][] }) {
  return (
    <div className="pointer-events-none absolute top-0 z-10 min-w-[130px] rounded-lg border border-line2 bg-surface px-2.5 py-2 text-xs shadow-[var(--shadow-pop)] transition-[left] duration-300 ease-out"
      style={{ left: `${x}%`, transform: `translateX(${flip ? "calc(-100% - 14px)" : "14px"})` }}>
      <div className="mb-1 font-medium">{title}</div>
      {rows.map(([label, color, v]) => (
        <div key={label} className="flex items-center gap-1.5 py-px text-ink2"><i className="h-2 w-2 rounded-sm" style={{ background: color }} />{label}<span className="ml-auto pl-3 font-mono text-ink">{v}</span></div>
      ))}
    </div>
  );
}

const BARS = [[42, 18, 6], [48, 20, 5], [51, 17, 8], [60, 22, 7], [58, 24, 9], [66, 21, 6], [72, 26, 8], [70, 28, 11], [78, 25, 9], [84, 30, 10], [88, 29, 12], [96, 33, 10]];
const SERIES = [["2xx", "var(--accent)"], ["4xx", "var(--chart-2)"], ["5xx", "var(--chart-3)"]];
function Bars() {
  const [hi, setHi] = useState<number | null>(null);
  const W = 640, H = 220, L = 34, R = 6, T = 8, B = 24;
  const top = Math.ceil(Math.max(...BARS.map(v => v[0] + v[1] + v[2])) / 50) * 50;
  const iw = W - L - R, ih = H - T - B, step = iw / BARS.length, bw = step * 0.5;
  return (
    <div className="relative" onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Requests by status, stacked by month">
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <g key={f}>
            <line x1={L} x2={W - R} y1={T + ih * f} y2={T + ih * f} stroke="var(--line)" strokeDasharray={f === 1 ? "" : "2 4"} />
            <text x={L - 8} y={T + ih * f + 4} textAnchor="end" fontSize="10.5" fill="var(--ink3)" fontFamily={MONO}>{Math.round(top * (1 - f))}</text>
          </g>
        ))}
        {BARS.map((v, i) => {
          const c = L + i * step + step / 2;
          let y = T + ih;
          return (
            <g key={i} onMouseEnter={() => setHi(i)} style={{ opacity: hi === null || hi === i ? 1 : 0.35, transition: "opacity .5s" }}>
              <rect x={L + i * step} y={T} width={step} height={ih} fill={hi === i ? "var(--surface2)" : "transparent"} />
              {v.map((p, j) => { const h = (p / top) * ih; y -= h; return <rect key={j} x={c - bw / 2} y={y + (j < 2 ? 1 : 0)} width={bw} height={Math.max(0, h - 1.5)} rx="2.5" fill={SERIES[j][1]} />; })}
              <text x={c} y={H - 7} textAnchor="middle" fontSize="10.5" fill="var(--ink3)" fontFamily={MONO}>{MONTHS[i][0]}</text>
            </g>
          );
        })}
      </svg>
      {hi !== null && <Tip x={((L + hi * step + step / 2) / W) * 100} flip={hi > 6} title={MONTHS[hi]} rows={SERIES.map(([l, c], j) => [l, c, `${BARS[hi][j]}k`])} />}
    </div>
  );
}

const THIS = [30, 34, 31, 40, 46, 43, 52, 58, 55, 63, 70, 74];
const LAST = [22, 25, 27, 26, 31, 35, 33, 38, 42, 41, 47, 50];
function Area() {
  const [hi, setHi] = useState<number | null>(null);
  const W = 600, H = 210, P = 28, MAX = 80;
  const x = (i: number) => P + (i / 11) * (W - P * 2);
  const y = (v: number) => 10 + (1 - v / MAX) * (H - 36);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <div className="relative" onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Active users this year against last year"
        onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W; setHi(Math.max(0, Math.min(11, Math.round(((px - P) / (W - P * 2)) * 11)))); }}>
        <defs><linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".22" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
        {[0, 20, 40, 60, 80].map(v => (
          <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray={v ? "2 4" : ""} /><text x={P - 8} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--ink3)" fontFamily={MONO}>{v}</text></g>
        ))}
        <path d={`${path(THIS)} L ${x(11)} ${y(0)} L ${x(0)} ${y(0)} Z`} fill="url(#area-fill)" />
        <path d={path(LAST)} fill="none" stroke="var(--ink3)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={path(THIS)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
        {MONTHS.map((m, i) => i % 2 === 0 && <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--ink3)" fontFamily={MONO}>{m}</text>)}
        {hi !== null && (
          <g>
            <line x1={x(hi)} x2={x(hi)} y1="10" y2={y(0)} stroke="var(--line2)" />
            <circle cx={x(hi)} cy={y(LAST[hi])} r="3.5" fill="var(--surface)" stroke="var(--ink3)" strokeWidth="1.5" />
            <circle cx={x(hi)} cy={y(THIS[hi])} r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hi !== null && <Tip x={(x(hi) / W) * 100} flip={hi > 6} title={MONTHS[hi]} rows={[["This year", "var(--accent)", `${THIS[hi]}k`], ["Last year", "var(--ink3)", `${LAST[hi]}k`]]} />}
    </div>
  );
}

const PARTS = [{ label: "Direct", value: 46, color: "var(--accent)" }, { label: "Search", value: 31, color: "var(--chart-2)" }, { label: "Referral", value: 15, color: "var(--blue)" }, { label: "Social", value: 8, color: "var(--chart-3)" }];
function Donut() {
  const [hi, setHi] = useState<number | null>(null);
  const total = PARTS.reduce((a, p) => a + p.value, 0);
  const R = 46, C = 2 * Math.PI * R;
  const lens = PARTS.map(p => (p.value / total) * C);
  const offs = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  const cur = hi !== null ? PARTS[hi] : null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-2">
      <svg viewBox="0 0 120 120" className="w-40 overflow-visible" onMouseLeave={() => setHi(null)}>
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--surface2)" strokeWidth="12" />
        {PARTS.map((p, i) => (
          <circle key={p.label} cx="60" cy="60" r={R} fill="none" stroke={p.color} strokeWidth={hi === i ? 16 : 12} strokeDasharray={`${Math.max(0, lens[i] - 2.5)} ${C}`} strokeDashoffset={-offs[i]}
            transform="rotate(-90 60 60)" onMouseEnter={() => setHi(i)} style={{ transition: "stroke-width .5s, opacity .5s", opacity: hi === null || hi === i ? 1 : 0.35, cursor: "pointer" }} />
        ))}
        <text x="60" y="60" textAnchor="middle" fontSize="17" fontWeight="600" fill="var(--ink)">{cur ? `${cur.value}%` : "12.4k"}</text>
        <text x="60" y="75" textAnchor="middle" fontSize="9.5" fill="var(--ink3)">{cur ? cur.label : "visits"}</text>
      </svg>
      <div className="flex min-w-[180px] flex-col gap-2.5">
        <div className="text-[13.5px] font-medium">Traffic sources</div>
        {PARTS.map((p, i) => (
          <div key={p.label} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} className="flex cursor-default items-center gap-2 text-[13px] transition-opacity duration-500" style={{ opacity: hi === null || hi === i ? 1 : 0.45 }}>
            <i className="h-2 w-2 rounded-sm" style={{ background: p.color }} /><span className="text-ink2">{p.label}</span><span className="ml-auto font-mono">{p.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartDemo({ variant = "Bars" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl border border-line2 bg-surface p-4">
        {variant !== "Donut" && (
          <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2">
            <div><div className="text-[13.5px] font-medium">{variant === "Bars" ? "Requests by status" : "Active users"}</div><div className="text-xs text-ink3">{variant === "Bars" ? "Thousands per month" : "This year against last"}</div></div>
            {variant === "Bars"
              ? <div className="flex gap-3.5">{SERIES.map(([l, c]) => <span key={l} className="flex items-center gap-1.5 text-xs text-ink2"><i className="h-2 w-2 rounded-sm" style={{ background: c }} />{l}</span>)}</div>
              : <span className="text-xl font-semibold tracking-tight">74k</span>}
          </div>
        )}
        {variant === "Bars" && <Bars />}
        {variant === "Area" && <Area />}
        {variant === "Donut" && <Donut />}
      </div>
    </div>
  );
}

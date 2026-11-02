"use client";
/**
 * Toggle · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Switch" | "Checkbox" | "Radio"
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cx("relative h-5 w-[34px] flex-none rounded-md border transition-colors duration-500", checked ? "border-wine bg-wine" : "border-line2 bg-surface3")}>
      <span className={cx("absolute top-0.5 h-3.5 w-3.5 rounded bg-white shadow transition-[left] duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]", checked ? "left-4" : "left-0.5")} />
    </button>
  );
}

export function Checkbox({ checked, indeterminate, onChange, children }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  const on = checked || indeterminate;
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px]">
      <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : checked} onClick={() => onChange(indeterminate ? true : !checked)}
        className={cx("flex h-[17px] w-[17px] flex-none items-center justify-center rounded-[5px] border transition-colors duration-300", on ? "border-wine bg-wine text-onink" : "border-line2 bg-surface hover:border-ink3")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="h-[11px] w-[11px]">
          {indeterminate ? <path d="M6 12h12" /> : <path d="M20 6 9 17l-5-5" strokeDasharray="24" strokeDashoffset={checked ? 0 : 24} style={{ transition: "stroke-dashoffset .35s ease" }} />}
        </svg>
      </button>
      <span onClick={() => onChange(indeterminate ? true : !checked)}>{children}</span>
    </label>
  );
}

function SwitchList() {
  const [s, setS] = useState({ digest: true, mentions: true, product: false });
  const rows: [keyof typeof s, string, string][] = [
    ["digest", "Weekly digest", "A summary every Monday."],
    ["mentions", "Mentions", "When someone tags you."],
    ["product", "Product news", "About once a month."],
  ];
  const count = Object.values(s).filter(Boolean).length;
  return (
    <div className="w-full max-w-sm">
      <div className="divide-y divide-line rounded-xl border border-line2 bg-surface">
        {rows.map(([k, t, d]) => (
          <div key={k} className="flex items-center gap-3.5 px-4 py-3">
            <div className="flex-1"><div className="text-[13px] font-medium">{t}</div><div className="mt-0.5 text-xs text-ink3">{d}</div></div>
            <Switch checked={s[k]} onChange={v => setS({ ...s, [k]: v })} label={t} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-ink3">{count === 0 ? "You won’t get any email." : `You’ll get ${count} kind${count > 1 ? "s" : ""} of email.`}</p>
    </div>
  );
}

function CheckTree() {
  const [items, setItems] = useState<[string, boolean][]>([["Read", true], ["Comment", true], ["Edit", false], ["Invite people", false]]);
  const all = items.every(i => i[1]), some = items.some(i => i[1]);
  return (
    <div className="w-full max-w-[260px] rounded-xl border border-line2 bg-surface p-4">
      <Checkbox checked={all} indeterminate={some && !all} onChange={() => setItems(items.map(([l]) => [l, !all]))}><span className="font-medium">Editor permissions</span></Checkbox>
      <div className="ml-2 mt-3 flex flex-col gap-2.5 border-l border-line pl-[17px]">
        {items.map(([l, on], i) => <Checkbox key={l} checked={on} onChange={v => setItems(items.map((x, j) => (j === i ? [x[0], v] : x)))}>{l}</Checkbox>)}
      </div>
    </div>
  );
}

const PLANS = [
  { id: "solo", t: "Solo", d: "One seat, unlimited projects", p: 8 },
  { id: "team", t: "Team", d: "Up to 10 seats", p: 24 },
  { id: "org", t: "Organization", d: "SSO and audit log", p: 64 },
];
function RadioCards() {
  const [sel, setSel] = useState("team");
  return (
    <div role="radiogroup" className="flex w-full max-w-sm flex-col gap-2">
      {PLANS.map(o => {
        const on = sel === o.id;
        return (
          <button key={o.id} role="radio" aria-checked={on} onClick={() => setSel(o.id)}
            className={cx("flex items-center gap-3 rounded-xl border bg-surface px-3.5 py-3 text-left transition-[border,box-shadow] duration-500", on ? "border-wine shadow-[0_0_0_3px_var(--accent-bg)]" : "border-line2 hover:border-ink3/50")}>
            <span className={cx("flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full border transition-colors duration-300", on ? "border-wine" : "border-line2")}>
              <i className={cx("h-2 w-2 rounded-full bg-wine transition-transform duration-300", on ? "scale-100" : "scale-0")} />
            </span>
            <span className="flex-1"><span className="block text-[13px] font-medium">{o.t}</span><span className="block text-xs text-ink3">{o.d}</span></span>
            <span className="font-mono text-[13px]">${o.p}<span className="text-ink3">/mo</span></span>
          </button>
        );
      })}
    </div>
  );
}

export default function ToggleDemo({ variant = "Switch" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {variant === "Switch" && <SwitchList />}
      {variant === "Checkbox" && <CheckTree />}
      {variant === "Radio" && <RadioCards />}
    </div>
  );
}

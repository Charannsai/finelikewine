"use client";
/**
 * Stepper · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 */
import React, { useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const STEPS = ["Account", "Workspace", "Invite", "Done"];
const PEOPLE = [["AL", "#c97a8c"], ["BK", "#7d9bd8"], ["CW", "#6fae84"], ["DO", "#c9a35a"]];

export default function Stepper() {
  const [i, setI] = useState(0);
  const [name, setName] = useState("Northwind");
  const [invited, setInvited] = useState(["AL", "BK"]);
  const pct = (i / (STEPS.length - 1)) * 100;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`@keyframes step-in { from { opacity: 0; transform: translateY(6px); filter: blur(4px) } to { opacity: 1; transform: none; filter: none } }`}</style>
      <div className="w-full max-w-lg rounded-xl border border-line2 bg-surface p-5">
        <div className="relative flex justify-between">
          <span className="absolute left-3 right-3 top-3 h-0.5 bg-surface3" />
          <span className="absolute left-3 top-3 h-0.5 bg-wine transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `calc((100% - 24px) * ${pct / 100})` }} />
          {STEPS.map((s, j) => (
            <div key={s} className="relative flex flex-col items-center gap-1.5">
              <span className={cx("flex h-6 w-6 items-center justify-center rounded-[7px] border font-mono text-[11px] transition-all duration-500",
                j < i ? "border-wine bg-wine text-onink" : j === i ? "border-wine bg-surface text-wine shadow-[0_0_0_4px_var(--accent-bg)]" : "border-line2 bg-surface text-ink3")}>
                {j < i ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M20 6 9 17l-5-5" /></svg> : j + 1}
              </span>
              <span className={cx("text-[11.5px] transition-colors duration-500", j <= i ? "text-ink" : "text-ink3")}>{s}</span>
            </div>
          ))}
        </div>

        <div key={i} className="mt-5 min-h-[72px]" style={{ animation: "step-in .6s cubic-bezier(.16,1,.3,1)" }}>
          {i === 0 && <><div className="text-[13.5px] font-medium">Create your account</div><p className="mt-1 text-[12.5px] text-ink3">Signed in as mira@studio.co.</p></>}
          {i === 1 && (
            <>
              <div className="mb-2 text-[13.5px] font-medium">Name your workspace</div>
              <input value={name} onChange={e => setName(e.target.value)} className="h-9 w-full rounded-lg border border-line2 bg-surface px-3 text-[13px] focus:border-wine focus:outline-none focus:ring-[3px] focus:ring-wine/15" />
            </>
          )}
          {i === 2 && (
            <>
              <div className="text-[13.5px] font-medium">Invite your team <span className="font-normal text-ink3">· {invited.length} selected</span></div>
              <div className="mt-2.5 flex gap-2">
                {PEOPLE.map(([a, c]) => {
                  const on = invited.includes(a);
                  return (
                    <button key={a} onClick={() => setInvited(v => (on ? v.filter(x => x !== a) : [...v, a]))} aria-pressed={on}
                      className={cx("flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 transition-all duration-500", on ? "ring-wine" : "opacity-40 ring-transparent")} style={{ background: c }}>{a}</button>
                  );
                })}
              </div>
            </>
          )}
          {i === 3 && (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-greenbg text-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <div><div className="text-[13.5px] font-medium">{name || "Your workspace"} is ready</div><p className="text-[12.5px] text-ink3">{invited.length} {invited.length === 1 ? "person" : "people"} invited.</p></div>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          <button disabled={i === 0} onClick={() => setI(i - 1)} className="h-8 rounded-lg px-3 text-[13px] text-ink2 transition-colors hover:bg-surface2 disabled:opacity-40">Back</button>
          {i < STEPS.length - 1
            ? <button onClick={() => setI(i + 1)} className="h-8 rounded-lg bg-ink px-3.5 text-[13px] font-medium text-onink transition-colors hover:bg-ink/85">Continue</button>
            : <button onClick={() => setI(0)} className="h-8 rounded-lg border border-line2 px-3.5 text-[13px] hover:bg-surface2">Start over</button>}
        </div>
      </div>
    </div>
  );
}

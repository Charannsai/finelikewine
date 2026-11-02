"use client";
/**
 * Input · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Fields" | "Password" | "Code" | "Slider"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const CHECK = "M20 6 9 17l-5-5";
const EYE = "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z";
const Spinner = () => <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />;

const field = "h-9 w-full rounded-lg border bg-surface px-3 text-[13px] text-ink placeholder:text-ink3 transition-[border,box-shadow] duration-300 focus:outline-none focus:ring-[3px]";
const ok = "border-line2 hover:border-ink3/50 focus:border-wine focus:ring-wine/15";
const bad = "border-red focus:border-red focus:ring-red/15";
const Card = ({ children }: { children: React.ReactNode }) => <div className="w-full max-w-sm rounded-xl border border-line2 bg-surface p-4">{children}</div>;
const Label = ({ children }: { children: React.ReactNode }) => <label className="mb-1.5 block text-[12.5px] font-medium text-ink2">{children}</label>;

const TAKEN = ["admin", "root", "wine"];
function Fields() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [user, setUser] = useState("");
  const [check, setCheck] = useState<"idle" | "busy" | "ok" | "taken">("idle");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => setCheck(TAKEN.includes(user.toLowerCase()) ? "taken" : "ok"), 650);
    return () => clearTimeout(t);
  }, [user]);
  return (
    <Card>
      <Label>Email</Label>
      <div className="relative">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)} placeholder="you@company.com" className={cx(field, touched && email && !valid ? bad : ok)} />
        <span className={cx("absolute right-2.5 top-1/2 -translate-y-1/2 text-green transition-all duration-300", valid ? "opacity-100" : "scale-50 opacity-0")}><Icon d={CHECK} /></span>
      </div>
      <p className={cx("mt-1.5 h-4 text-[11.5px] text-red transition-opacity duration-300", touched && email && !valid ? "opacity-100" : "opacity-0")}>That address is missing something.</p>
      <div className="mt-2"><Label>Username</Label></div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-ink3">@</span>
        <input value={user} placeholder="handle" className={cx(field, ok, "pl-7")}
          onChange={e => { const v = e.target.value.replace(/[^a-z0-9_]/gi, ""); setUser(v); setCheck(v ? "busy" : "idle"); }} />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink3">{check === "busy" && <Spinner />}</span>
      </div>
      <p className="mt-1.5 h-4 text-[11.5px]">
        {check === "taken" ? <span className="text-red">@{user} is taken.</span> : check === "ok" ? <span className="text-green">@{user} is available.</span> : <span className="text-ink3">Try “admin” to see a conflict.</span>}
      </p>
    </Card>
  );
}

function Password() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const rules = [
    { ok: pw.length >= 10, label: "At least 10 characters" },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: "Upper and lower case" },
    { ok: /\d/.test(pw), label: "A number" },
    { ok: /[^A-Za-z0-9]/.test(pw), label: "A symbol" },
  ];
  const score = rules.filter(r => r.ok).length;
  const tone = ["var(--line2)", "var(--red)", "var(--amber)", "var(--amber)", "var(--green)"][score];
  return (
    <Card>
      <Label>New password</Label>
      <div className="relative">
        <input type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="Choose something long" className={cx(field, ok, "pr-10")} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
          className={cx("absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors hover:bg-surface2", show ? "text-ink" : "text-ink3")}><Icon d={EYE} /></button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map(i => <span key={i} className="h-[3px] rounded-sm transition-colors duration-500" style={{ background: i < score ? tone : "var(--surface3)" }} />)}
      </div>
      <ul className="mt-3.5 flex flex-col gap-2">
        {rules.map(r => (
          <li key={r.label} className={cx("flex items-center gap-2 text-[12.5px] transition-colors duration-500", r.ok ? "text-ink" : "text-ink3")}>
            <span className={cx("flex h-3.5 w-3.5 items-center justify-center rounded border transition-colors duration-500", r.ok ? "border-green bg-green text-onink" : "border-line2")}>{r.ok && <Icon d={CHECK} className="h-2.5 w-2.5" />}</span>
            {r.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function OneTimeCode() {
  const LEN = 6, ANSWER = "424242";
  const [vals, setVals] = useState<string[]>(Array(LEN).fill(""));
  const [state, setState] = useState<"idle" | "busy" | "ok" | "bad">("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const reset = () => { setVals(Array(LEN).fill("")); setState("idle"); setTimeout(() => refs.current[0]?.focus(), 0); };
  const submit = (code: string) => {
    setState("busy");
    setTimeout(() => {
      if (code === ANSWER) setState("ok");
      else { setState("bad"); setTimeout(reset, 900); }
    }, 700);
  };
  const set = (i: number, v: string) => {
    const next = [...vals];
    next[i] = v;
    setVals(next);
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) submit(next.join(""));
  };
  const paste = (e: React.ClipboardEvent) => {
    const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!d) return;
    e.preventDefault();
    setVals(Array.from({ length: LEN }, (_, i) => d[i] ?? ""));
    if (d.length === LEN) submit(d);
  };
  return (
    <div className="flex flex-col items-center">
      <style>{`@keyframes otp-shake { 0%,100% { transform: none } 20%,60% { transform: translateX(-4px) } 40%,80% { transform: translateX(4px) } }`}</style>
      <div className="text-sm font-medium">Enter the code we sent</div>
      <div className="mt-1 text-[12.5px] text-ink3">The demo code is <span className="font-mono text-ink2">424242</span></div>
      <div className="mt-5 flex items-center gap-2" onPaste={paste} style={state === "bad" ? { animation: "otp-shake .35s ease" } : undefined}>
        {vals.map((v, i) => (
          <React.Fragment key={i}>
            {i === 3 && <span className="h-0.5 w-2 rounded-sm bg-line2" />}
            <input ref={el => { refs.current[i] = el; }} value={v} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`} disabled={state === "busy" || state === "ok"}
              onChange={e => set(i, e.target.value.replace(/\D/g, "").slice(-1))}
              onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) refs.current[i - 1]?.focus(); if (e.key === "ArrowLeft") refs.current[i - 1]?.focus(); if (e.key === "ArrowRight") refs.current[i + 1]?.focus(); }}
              className={cx("h-12 w-10 rounded-lg border bg-surface text-center font-mono text-lg transition-[border,box-shadow] duration-300 focus:outline-none focus:ring-[3px]",
                state === "ok" ? "border-green ring-green/15" : state === "bad" ? "border-red" : "border-line2 focus:border-wine focus:ring-wine/15")} />
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 flex h-5 items-center gap-2 text-[12.5px]">
        {state === "busy" && <span className="flex items-center gap-2 text-ink3"><Spinner />Checking</span>}
        {state === "bad" && <span className="text-red">That code didn’t match.</span>}
        {state === "ok" && <><span className="flex items-center gap-1.5 text-green"><Icon d={CHECK} />Verified</span><button onClick={reset} className="text-ink3 hover:text-ink">Reset</button></>}
      </div>
    </div>
  );
}

function Slider() {
  const [vol, setVol] = useState(64);
  const [seats, setSeats] = useState(3);
  return (
    <Card>
      <div className="flex items-baseline justify-between"><span className="text-[13px] font-medium">Volume</span><span className="font-mono text-[12.5px] text-ink2">{vol}%</span></div>
      <div className="relative mt-3 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-sm bg-surface3" />
        <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-sm bg-wine" style={{ width: `${vol}%` }} />
        <div className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-line2 bg-white shadow" style={{ left: `${vol}%` }} />
        <input type="range" min={0} max={100} value={vol} onChange={e => setVol(+e.target.value)} aria-label="Volume" className="absolute inset-0 w-full cursor-pointer opacity-0" />
      </div>
      <div className="mt-6 flex items-baseline justify-between"><span className="text-[13px] font-medium">Seats</span><span className="font-mono text-[12.5px] text-ink2">{seats} of 8</span></div>
      <div className="relative mt-3 h-5">
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: 8 }, (_, i) => <span key={i} className={cx("h-2.5 w-[3px] rounded-sm transition-colors duration-300", i < seats ? "bg-wine" : "bg-line2")} />)}
        </div>
        <input type="range" min={1} max={8} value={seats} onChange={e => setSeats(+e.target.value)} aria-label="Seats" className="absolute inset-0 w-full cursor-pointer opacity-0" />
      </div>
      <div className="mt-4 flex justify-between border-t border-line pt-3 text-[12.5px]"><span className="text-ink3">Billed monthly</span><span className="font-mono">${seats * 12}.00</span></div>
    </Card>
  );
}

export default function InputDemo({ variant = "Fields" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {variant === "Fields" && <Fields />}
      {variant === "Password" && <Password />}
      {variant === "Code" && <OneTimeCode />}
      {variant === "Slider" && <Slider />}
    </div>
  );
}

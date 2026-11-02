"use client";
/**
 * Button · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css
 * (bg-surface, text-ink, border-line, bg-wine, ...).
 * Variants: "Styles" | "Async" | "Hold" | "Copy"
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const I = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 12l3 3M14.5 4.5C17 2 21 3 21 3s1 4-1.5 6.5L13 16l-5-5 6.5-6.5Z",
  check: "M20 6 9 17l-5-5",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  undo: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
  copy: "M9 9h10v10H9zM5 15V5h10",
};

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconOnly?: boolean;
};
const styles = {
  primary: "bg-ink text-onink hover:bg-ink/85",
  accent: "bg-wine text-onink hover:bg-wine/85",
  secondary: "border border-line2 bg-surface text-ink hover:bg-surface2",
  ghost: "text-ink2 hover:bg-surface2 hover:text-ink",
  danger: "border border-red/20 bg-redbg text-red hover:bg-red/15",
};
const sizes = { sm: "h-7 px-2.5 text-xs gap-1.5", md: "h-9 px-3.5 text-[13px] gap-2", lg: "h-10 px-4 text-sm gap-2" };
const square = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-10 w-10" };

export function Button({ variant = "primary", size = "md", loading, iconOnly, className = "", children, disabled, ...props }: BtnProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cx("relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-medium transition-[background,border,color,transform] duration-300 active:scale-[.97] disabled:pointer-events-none disabled:opacity-45", styles[variant], iconOnly ? square[size] : sizes[size], className)}
      {...props}>
      {loading ? (
        <>
          <span className="invisible inline-flex items-center gap-2">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          </span>
        </>
      ) : children}
    </button>
  );
}

function Styles() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button onClick={() => setSaved(s => !s)}>{saved ? <><Icon d={I.check} />Saved</> : "Save changes"}</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Preview</Button>
        <Button variant="accent">Upgrade</Button>
        <Button variant="danger">Delete</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button size="sm" variant="secondary">Small</Button>
        <Button variant="secondary">Medium</Button>
        <Button size="lg" variant="secondary">Large<Icon d={I.arrow} /></Button>
        <Button variant="secondary" iconOnly aria-label="Settings"><Icon d={I.gear} /></Button>
        <Button variant="secondary" loading>Saving</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
}

function Async() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    setState("busy");
    timers.current.push(setTimeout(() => setState("done"), 1600), setTimeout(() => setState("idle"), 3600));
  };
  const layer = (on: boolean, before: boolean) => cx("absolute flex items-center gap-2 transition-all duration-500", on ? "translate-y-0 opacity-100" : before ? "translate-y-3 opacity-0" : "-translate-y-3 opacity-0");
  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={run} disabled={state !== "idle"}
        className={cx("relative flex h-10 w-36 items-center justify-center overflow-hidden rounded-lg text-sm font-medium transition-colors duration-500",
          state === "done" ? "bg-greenbg text-green" : "bg-ink text-onink", state === "idle" && "hover:bg-ink/85 active:scale-[.97]")}>
        <span className={layer(state === "idle", false)}><Icon d={I.rocket} />Deploy</span>
        <span className={layer(state === "busy", state === "idle")}><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />Deploying</span>
        <span className={layer(state === "done", true)}><Icon d={I.check} />Live</span>
      </button>
      <span className="text-xs text-ink3">{state === "idle" ? "Press to deploy" : state === "busy" ? "Building and uploading" : "acme-web.app is live"}</span>
    </div>
  );
}

function Hold() {
  const [p, setP] = useState(0);
  const [gone, setGone] = useState(false);
  const raf = useRef(0);
  const start = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const begin = () => {
    start.current = performance.now();
    const step = (t: number) => {
      const v = Math.min(1, (t - start.current) / 1100);
      setP(v);
      if (v < 1) raf.current = requestAnimationFrame(step);
      else setGone(true);
    };
    raf.current = requestAnimationFrame(step);
  };
  const cancel = () => { cancelAnimationFrame(raf.current); setP(v => (v < 1 ? 0 : v)); };

  if (gone) {
    return (
      <div className="flex w-56 items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-[13px]">
        <span className="flex-1 text-ink2">Branch deleted</span>
        <button onClick={() => { setGone(false); setP(0); }} className="flex items-center gap-1 text-ink hover:text-wine"><Icon d={I.undo} className="h-3.5 w-3.5" />Undo</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onPointerDown={begin} onPointerUp={cancel} onPointerLeave={cancel}
        onKeyDown={e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) begin(); }} onKeyUp={cancel}
        className="relative h-10 w-52 select-none overflow-hidden rounded-lg border border-red/25 bg-redbg text-sm font-medium text-red">
        <span className="absolute inset-y-0 left-0 bg-red/20" style={{ width: `${p * 100}%` }} />
        <span className="relative flex items-center justify-center gap-2"><Icon d={I.trash} />{p > 0 ? "Keep holding" : "Hold to delete"}</span>
      </button>
      <span className="text-xs text-ink3">Hold for one second. Let go to cancel.</span>
    </div>
  );
}

function CopyField() {
  const [done, setDone] = useState(false);
  const cmd = "git clone https://github.com/Charannsai/finelikewine.git";
  return (
    <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-line2 bg-surface py-1.5 pl-3.5 pr-1.5 font-mono text-[12.5px]">
      <span className="text-ink3">$</span>
      <span className="truncate text-ink">git clone …/finelikewine</span>
      <button onClick={() => { navigator.clipboard?.writeText(cmd); setDone(true); setTimeout(() => setDone(false), 1500); }} aria-label="Copy command"
        className="relative ml-auto flex h-7 w-7 items-center justify-center rounded-md text-ink3 hover:bg-surface2 hover:text-ink">
        <span className={cx("absolute transition-all duration-300", done ? "scale-50 opacity-0" : "opacity-100")}><Icon d={I.copy} className="h-3.5 w-3.5" /></span>
        <span className={cx("absolute text-green transition-all duration-300", done ? "opacity-100" : "scale-50 opacity-0")}><Icon d={I.check} className="h-4 w-4" /></span>
      </button>
    </div>
  );
}

export default function ButtonDemo({ variant = "Styles" }: { variant?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {variant === "Styles" && <Styles />}
      {variant === "Async" && <Async />}
      {variant === "Hold" && <Hold />}
      {variant === "Copy" && <CopyField />}
    </div>
  );
}

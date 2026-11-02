"use client";
import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Icon, type IconName } from "./icons";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

/* ---------- Spinner ---------- */
export function Spinner({ className = "h-[14px] w-[14px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx("spin", className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Button ---------- */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  loading?: boolean;
};
const btnVariants = {
  primary: "bg-ink text-onink hover:bg-ink/85 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]",
  accent: "bg-wine text-onink hover:bg-wine/85",
  secondary: "bg-surface text-ink border border-line2 hover:bg-surface2 hover:border-ink3/40",
  ghost: "text-ink2 hover:bg-surface2 hover:text-ink",
  danger: "bg-redbg text-red border border-red/20 hover:bg-red/15",
};
const btnSizes = { sm: "h-[28px] text-[12.5px] px-[10px] gap-[6px]", md: "h-[34px] text-[13px] px-[13px] gap-[7px]", lg: "h-[40px] text-[14px] px-[17px] gap-[8px]" };
const iconSizes = { sm: "h-[28px] w-[28px]", md: "h-[34px] w-[34px]", lg: "h-[40px] w-[40px]" };
export function Button({ variant = "primary", size = "md", iconOnly, loading, className = "", children, disabled, ...p }: BtnProps) {
  return (
    <button
      className={cx("relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-[8px] font-medium transition-[background,border,color,transform] duration-150 active:scale-[.97] disabled:pointer-events-none disabled:opacity-45", ring, btnVariants[variant], iconOnly ? iconSizes[size] : btnSizes[size], className)}
      disabled={disabled || loading}
      {...p}
    >
      {loading ? <><span className="invisible inline-flex items-center gap-[inherit]">{children}</span><span className="absolute inset-0 flex items-center justify-center"><Spinner /></span></> : children}
    </button>
  );
}

/* ---------- Badge (squared, never a pill) ---------- */
const badgeColors = {
  green: "text-green bg-greenbg", amber: "text-amber bg-amberbg", red: "text-red bg-redbg",
  blue: "text-blue bg-bluebg", violet: "text-violet bg-violetbg", neutral: "text-ink2 bg-surface2",
  solid: "text-onink bg-ink", wine: "text-wine bg-winebg",
};
export function Badge({ color = "neutral", dot, children }: { color?: keyof typeof badgeColors; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex h-[22px] items-center gap-[6px] rounded-[5px] px-[7px] text-[11.5px] font-medium", badgeColors[color])}>
      {dot && <span className="h-[6px] w-[6px] rounded-[2px] bg-current" />}
      {children}
    </span>
  );
}
export function Status({ tone, children }: { tone: "green" | "amber" | "red" | "neutral"; children: React.ReactNode }) {
  const c = { green: "bg-green", amber: "bg-amber", red: "bg-red", neutral: "bg-ink3" }[tone];
  return (
    <span className="inline-flex items-center gap-[7px] text-[12.5px] text-ink2">
      <span className="relative flex h-[7px] w-[7px]">
        {tone !== "neutral" && <span className={cx("absolute inset-0 animate-ping rounded-full opacity-40", c)} style={{ animationDuration: "2s" }} />}
        <span className={cx("relative h-[7px] w-[7px] rounded-full", c)} />
      </span>
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[4px] border border-line2 bg-surface2 px-[5px] font-mono text-[10.5px] text-ink3 shadow-[0_1px_0_var(--line2)]">{children}</kbd>;
}

/* ---------- Card ---------- */
export function Card({ children, className = "", hover }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={cx("rounded-[12px] border border-line bg-surface", hover && "transition-[border,transform] duration-200 hover:-translate-y-[2px] hover:border-line2", className)}>{children}</div>;
}
export function CardHead({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[10px] border-b border-line px-[16px] py-[12px] text-[13.5px] font-medium">{children}</div>;
}
export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("px-[16px] py-[15px]", className)}>{children}</div>;
}
export function CardFoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[10px] border-t border-line px-[16px] py-[11px]">{children}</div>;
}
export function StatCard({ icon, label, value, delta, deltaUp, sub }: { icon: IconName; iconBg?: string; label: string; value: string; delta?: string; deltaUp?: boolean; sub?: string }) {
  return (
    <Card className="p-[16px]">
      <div className="flex items-center gap-[8px] text-[12.5px] text-ink3"><Icon name={icon} className="h-[15px] w-[15px]" />{label}</div>
      <div className="mt-[12px] text-[26px] font-semibold tracking-[-0.03em] tabular-nums">{value}</div>
      <div className="mt-[4px] flex items-center gap-[7px] text-[12px] text-ink3">
        {delta && <span className={cx("font-medium tabular-nums", deltaUp ? "text-green" : "text-red")}>{delta}</span>}
        {sub}
      </div>
    </Card>
  );
}

/* ---------- Form fields ---------- */
export function Field({ label, hint, error, children, className = "" }: { label: string; hint?: React.ReactNode; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex w-full flex-col gap-[6px]", className)}>
      <label className="text-[12.5px] font-medium text-ink2">{label}</label>
      {children}
      {error ? <span className="anim-fade text-[11.5px] text-red">{error}</span> : hint ? <span className="text-[11.5px] text-ink3">{hint}</span> : null}
    </div>
  );
}
export const inputCls = "h-[36px] w-full rounded-[8px] border border-line2 bg-surface px-[11px] text-[13px] text-ink placeholder:text-ink3 transition-[border,box-shadow] duration-150 hover:border-ink3/50 focus:border-wine focus:outline-none focus:ring-[3px] focus:ring-wine/15";
export function Input({ error, className = "", ...p }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input className={cx(inputCls, error && "border-red focus:border-red focus:ring-red/15", className)} {...p} />;
}
export function Textarea({ className = "", ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(inputCls, "h-auto py-[9px] leading-[1.5]", className)} {...p} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(inputCls, "appearance-none pr-[30px]")} {...props} />
      <Icon name="arrow-down-01" className="pointer-events-none absolute right-[10px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-ink3" />
    </div>
  );
}
export function SearchInput({ placeholder, className = "", value, onChange, onFocus }: { placeholder: string; className?: string; value?: string; onChange?: (v: string) => void; onFocus?: () => void }) {
  return (
    <div className={cx("relative", className)}>
      <Icon name="search-01" className="pointer-events-none absolute left-[10px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink3" />
      <input value={value} onChange={e => onChange?.(e.target.value)} onFocus={onFocus} placeholder={placeholder} className={cx(inputCls, "pl-[32px]")} />
    </div>
  );
}

/* ---------- Switch / Checkbox / Radio ---------- */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange?.(!checked)}
      className={cx("relative h-[20px] w-[34px] flex-none rounded-[6px] border transition-colors duration-200", ring, checked ? "border-wine bg-wine" : "border-line2 bg-surface3")}>
      <span className={cx("absolute top-[2px] h-[14px] w-[14px] rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,.3)] transition-[left] duration-200 ease-[cubic-bezier(.3,1.4,.5,1)]", checked ? "left-[16px]" : "left-[2px]")} />
    </button>
  );
}
export const Switch = Toggle;

export function Checkbox({ label, checked, defaultChecked, indeterminate, onChange }: { label?: React.ReactNode; checked?: boolean; defaultChecked?: boolean; indeterminate?: boolean; onChange?: (v: boolean) => void }) {
  const [inner, setInner] = useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = () => { const v = indeterminate ? true : !on; if (checked === undefined) setInner(v); onChange?.(v); };
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-[9px] text-[13px] text-ink">
      <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : on} onClick={toggle}
        className={cx("flex h-[17px] w-[17px] flex-none items-center justify-center rounded-[5px] border transition-colors duration-150", ring, on || indeterminate ? "border-wine bg-wine text-onink" : "border-line2 bg-surface hover:border-ink3")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="h-[11px] w-[11px]">
          {indeterminate ? <path d="M6 12h12" /> : <path d="M20 6 9 17l-5-5" strokeDasharray="24" strokeDashoffset={on ? 0 : 24} style={{ transition: "stroke-dashoffset .22s ease" }} />}
        </svg>
      </button>
      {label && <span onClick={toggle}>{label}</span>}
    </label>
  );
}
export function Radio({ label, name, checked, defaultChecked, onChange }: { label?: React.ReactNode; name: string; checked?: boolean; defaultChecked?: boolean; onChange?: () => void }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-[9px] text-[13px]">
      <input type="radio" name={name} checked={checked} defaultChecked={defaultChecked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-line2 bg-surface transition-colors peer-checked:border-wine peer-focus-visible:ring-2 peer-focus-visible:ring-wine/50 [&>i]:scale-0 peer-checked:[&>i]:scale-100">
        <i className="h-[8px] w-[8px] rounded-full bg-wine transition-transform duration-200" />
      </span>
      {label}
    </label>
  );
}

/* ---------- Sliding indicator hook ---------- */
function useIndicator<T extends HTMLElement>(index: number, deps: unknown[] = []) {
  const refs = useRef<(T | null)[]>([]);
  const [box, setBox] = useState({ left: 0, width: 0, top: 0, height: 0, ready: false });
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[index];
      if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight, ready: true });
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach(r => r && ro.observe(r));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, ...deps]);
  return { refs, box };
}

/* ---------- Segmented control ---------- */
export function Seg({ options, value, onChange, small, className = "" }: { options: string[]; value: string; onChange?: (v: string) => void; small?: boolean; className?: string }) {
  const i = Math.max(0, options.indexOf(value));
  const { refs, box } = useIndicator<HTMLButtonElement>(i, [options.join()]);
  return (
    <div role="tablist" className={cx("relative inline-flex rounded-[9px] border border-line bg-surface2 p-[3px]", className)}>
      <span aria-hidden className={cx("absolute rounded-[6px] border border-line2 bg-surface shadow-[0_1px_2px_rgba(0,0,0,.08)]", box.ready && "transition-[left,width] duration-300 ease-[cubic-bezier(.3,1.2,.4,1)]")}
        style={{ left: box.left, width: box.width, top: 3, bottom: 3 }} />
      {options.map((o, j) => (
        <button key={o} ref={el => { refs.current[j] = el; }} role="tab" aria-selected={value === o} onClick={() => onChange?.(o)}
          className={cx("relative z-[1] rounded-[6px] font-medium transition-colors", ring, small ? "h-[24px] px-[9px] text-[11.5px]" : "h-[28px] px-[12px] text-[12.5px]", value === o ? "text-ink" : "text-ink3 hover:text-ink2")}>{o}</button>
      ))}
    </div>
  );
}

/* ---------- Tabs (underline) ---------- */
export function Tabs({ tabs, panels, className = "" }: { tabs: string[]; panels: React.ReactNode[]; className?: string }) {
  const [i, setI] = useState(0);
  const { refs, box } = useIndicator<HTMLButtonElement>(i);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { const n = (i + 1) % tabs.length; setI(n); refs.current[n]?.focus(); }
    if (e.key === "ArrowLeft") { const n = (i - 1 + tabs.length) % tabs.length; setI(n); refs.current[n]?.focus(); }
  };
  return (
    <div className={className}>
      <div role="tablist" onKeyDown={onKey} className="relative flex gap-[20px] border-b border-line">
        {tabs.map((t, j) => (
          <button key={t} ref={el => { refs.current[j] = el; }} role="tab" aria-selected={i === j} tabIndex={i === j ? 0 : -1} onClick={() => setI(j)}
            className={cx("pb-[10px] text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:text-ink", i === j ? "text-ink" : "text-ink3 hover:text-ink2")}>{t}</button>
        ))}
        <span aria-hidden className={cx("absolute -bottom-px h-[2px] rounded-[1px] bg-ink", box.ready && "transition-[left,width] duration-300 ease-[cubic-bezier(.3,1.2,.4,1)]")} style={{ left: box.left, width: box.width }} />
      </div>
      <div key={i} role="tabpanel" className="anim-in pt-[14px] text-[13.5px] text-ink2">{panels[i]}</div>
    </div>
  );
}

/* ---------- Click outside ---------- */
export function useOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) fn(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, fn, active]);
}

/* ---------- Menu ---------- */
export function MenuPanel({ children, onClose, className = "", style }: { children: React.ReactNode; onClose: () => void; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(); }, []);
  const onKey = (e: React.KeyboardEvent) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(at + 1) % items.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(at - 1 + items.length) % items.length]?.focus(); }
    if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); onClose(); }
  };
  return (
    <div ref={ref} role="menu" onKeyDown={onKey} onClick={onClose} style={style}
      className={cx("anim-in z-50 min-w-[200px] rounded-[10px] border border-line2 bg-surface p-[4px] shadow-[var(--shadow-pop)]", className)}>
      {children}
    </div>
  );
}
export function MenuItem({ icon, kbd, danger, onClick, children }: { icon?: IconName; kbd?: string; danger?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button role="menuitem" tabIndex={-1} onClick={onClick}
      className={cx("flex h-[32px] w-full items-center gap-[9px] rounded-[6px] px-[8px] text-left text-[13px] outline-none transition-colors", danger ? "text-red hover:bg-redbg focus:bg-redbg" : "text-ink2 hover:bg-surface2 hover:text-ink focus:bg-surface2 focus:text-ink")}>
      {icon && <Icon name={icon} className="h-[15px] w-[15px] opacity-80" />}
      {children}
      {kbd && <span className="ml-auto font-mono text-[11px] text-ink3">{kbd}</span>}
    </button>
  );
}
export function MenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-[8px] pb-[4px] pt-[7px] text-[11px] font-medium text-ink3">{children}</div>;
}
export function MenuSep() { return <div className="mx-[-4px] my-[4px] h-px bg-line" />; }

export function Dropdown({ label, icon, children, right, trigger }: { label?: string; icon?: IconName; children: React.ReactNode; right?: boolean; trigger?: (p: { open: boolean; toggle: () => void }) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutside(ref, close, open);
  const toggle = () => setOpen(o => !o);
  return (
    <div className="relative" ref={ref}>
      {trigger ? trigger({ open, toggle }) : (
        <Button variant="secondary" size="sm" onClick={toggle} aria-haspopup="menu" aria-expanded={open}>
          {icon && <Icon name={icon} className="h-[14px] w-[14px]" />}{label}
          <Icon name="arrow-down-01" className={cx("h-[13px] w-[13px] transition-transform duration-200", open && "rotate-180")} />
        </Button>
      )}
      {open && <MenuPanel onClose={() => { close(); ref.current?.querySelector<HTMLElement>("button")?.focus(); }} className={cx("absolute mt-[6px]", right ? "right-0" : "left-0")}>{children}</MenuPanel>}
    </div>
  );
}

/* ---------- Tooltip ---------- */
export function Tooltip({ tip, children, side = "top" }: { tip: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" }) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span role="tooltip" className={cx("pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-ink px-[8px] py-[5px] text-[11.5px] font-medium text-onink opacity-0 transition-[opacity,transform] duration-150 group-hover/tt:opacity-100 group-hover/tt:delay-300 group-focus-within/tt:opacity-100",
        side === "top" ? "bottom-full mb-[7px] translate-y-[3px] group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0" : "top-full mt-[7px] -translate-y-[3px] group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0")}>
        {tip}
      </span>
    </span>
  );
}

/* ---------- Toasts ---------- */
type ToastKind = "success" | "error" | "info" | "loading";
type ToastData = { title: string; desc?: string; kind?: ToastKind; action?: { label: string; onClick: () => void }; duration?: number };
type ToastItem = ToastData & { id: number; leaving?: boolean };
type ToastFn = ((t: string | ToastData) => number) & { update: (id: number, t: ToastData) => void; dismiss: (id: number) => void };
type ToastApi = { push: (t: string | ToastData) => number; update: (id: number, t: ToastData) => void; dismiss: (id: number) => void };
const ToastCtx = createContext<ToastApi>({ push: () => 0, update: () => {}, dismiss: () => {} });
export function useToast(): ToastFn {
  const api = useContext(ToastCtx);
  return useMemo(() => Object.assign((t: string | ToastData) => api.push(t), { update: api.update, dismiss: api.dismiss }), [api]);
}

const toastIcon: Record<ToastKind, React.ReactNode> = {
  success: <Icon name="checkmark-circle-01" className="h-[16px] w-[16px] text-green" />,
  error: <Icon name="alert-circle" className="h-[16px] w-[16px] text-red" />,
  info: <Icon name="information-circle" className="h-[16px] w-[16px] text-blue" />,
  loading: <Spinner className="h-[15px] w-[15px] text-ink3" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [hover, setHover] = useState(false);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, leaving: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 200);
  }, []);
  const schedule = useCallback((id: number, d: ToastData) => {
    clearTimeout(timers.current.get(id));
    if (d.kind === "loading") return;
    timers.current.set(id, setTimeout(() => dismiss(id), d.duration ?? 4000));
  }, [dismiss]);

  const push = useCallback((input: string | ToastData) => {
    const d: ToastData = typeof input === "string" ? { title: input, kind: "success" } : { kind: "success", ...input };
    const id = ++idRef.current;
    setToasts(t => [...t.slice(-4), { ...d, id }]);
    schedule(id, d);
    return id;
  }, [schedule]);
  const update = useCallback((id: number, d: ToastData) => { setToasts(t => t.map(x => x.id === id ? { ...d, id, kind: d.kind ?? "success" } : x)); schedule(id, d); }, [schedule]);
  const api = useMemo(() => ({ push, update, dismiss }), [push, update, dismiss]);

  const shown = toasts.slice(-4);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <section aria-live="polite" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="fixed bottom-[18px] right-[18px] z-[95] w-[min(360px,calc(100vw-36px))]" style={{ height: shown.length ? (hover ? shown.length * 70 : 72 + Math.min(shown.length - 1, 2) * 8) : 0 }}>
        {shown.map((t, i) => {
          const fromTop = shown.length - 1 - i;
          const y = hover ? -fromTop * 70 : -fromTop * 8;
          const s = hover ? 1 : 1 - fromTop * 0.05;
          return (
            <div key={t.id} className="absolute bottom-0 left-0 right-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ transform: `translateY(${y}px) scale(${s})`, opacity: t.leaving ? 0 : fromTop > 2 && !hover ? 0 : 1, zIndex: i, transformOrigin: "bottom center" }}>
              <div className="anim-in flex min-h-[62px] items-start gap-[11px] rounded-[11px] border border-line2 bg-surface px-[14px] py-[12px] shadow-[var(--shadow-pop)]">
                <span className="mt-[1px]">{toastIcon[t.kind ?? "success"]}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink">{t.title}</div>
                  {t.desc && <div className="mt-[2px] truncate text-[12px] text-ink3">{t.desc}</div>}
                </div>
                {t.action && <button onClick={() => { t.action!.onClick(); dismiss(t.id); }} className="h-[26px] rounded-[6px] border border-line2 px-[9px] text-[12px] font-medium text-ink hover:bg-surface2">{t.action.label}</button>}
                <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded-[5px] p-[3px] text-ink3 hover:bg-surface2 hover:text-ink"><Icon name="cancel-01" className="h-[13px] w-[13px]" /></button>
              </div>
            </div>
          );
        })}
      </section>
    </ToastCtx.Provider>
  );
}

/* ---------- Overlay base (focus trap, escape, scroll lock) ---------- */
function useOverlay(open: boolean, onClose: () => void, boxRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => boxRef.current?.querySelector<HTMLElement>("[data-autofocus], input, button:not([aria-label=Close]), [href]")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && boxRef.current) {
        const f = Array.from(boxRef.current.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")).filter(el => !el.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const ov = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.body.style.overflow = ov; prev?.focus(); };
  }, [open, onClose, boxRef]);
}

export function Modal({ open, onClose, label, children, width = 440 }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode; width?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, boxRef);
  if (!open) return null;
  return (
    <div className="anim-fade fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[2px]" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-label={label} className="anim-in w-full overflow-hidden rounded-[14px] border border-line2 bg-surface shadow-[var(--shadow-pop)]" style={{ maxWidth: width }}>
        {children}
      </div>
    </div>
  );
}
export function ModalHead({ title, sub, onClose }: { icon?: IconName; iconBg?: string; title: string; sub?: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-[12px] px-[20px] pb-[4px] pt-[18px]">
      <div className="min-w-0 flex-1"><h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>{sub && <p className="mt-[4px] text-[13px] leading-[1.5] text-ink3">{sub}</p>}</div>
      <button onClick={onClose} aria-label="Close" className="-mr-[6px] -mt-[2px] rounded-[6px] p-[5px] text-ink3 hover:bg-surface2 hover:text-ink"><Icon name="cancel-01" className="h-[15px] w-[15px]" /></button>
    </div>
  );
}
export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-[20px] py-[14px]">{children}</div>;
}
export function ModalFoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-[8px] border-t border-line bg-surface2/60 px-[20px] py-[12px]">{children}</div>;
}

export function Drawer({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, boxRef);
  if (!open) return null;
  return (
    <div className="anim-fade fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-label={label} className="anim-drawer absolute inset-y-[8px] right-[8px] flex w-[min(400px,calc(100vw-16px))] flex-col overflow-hidden rounded-[14px] border border-line2 bg-surface shadow-[var(--shadow-pop)]">
        {children}
      </div>
    </div>
  );
}

/* ---------- Command palette ---------- */
export type CmdkAction = { label: string; icon?: IconName; href?: string; kbd?: string; onSelect?: () => void; group: string; hint?: string };
export function CmdkList({ actions, onDone, autoFocus = true, className = "" }: { actions: CmdkAction[]; onDone?: () => void; autoFocus?: boolean; className?: string }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = actions.filter(a => (a.label + " " + a.group).toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(filtered.map(a => a.group))];
  const ordered = groups.flatMap(g => filtered.filter(a => a.group === g));
  const run = (a: CmdkAction) => { onDone?.(); if (a.onSelect) a.onSelect(); else if (a.href) window.location.assign(a.href); };
  useEffect(() => {
    const box = listRef.current, el = box?.querySelector<HTMLElement>(`[data-i="${sel}"]`);
    if (!box || !el) return;
    if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop - 28;
    else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight + 6;
  }, [sel]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { setSel(s => Math.min(s + 1, ordered.length - 1)); e.preventDefault(); }
    if (e.key === "ArrowUp") { setSel(s => Math.max(s - 1, 0)); e.preventDefault(); }
    if (e.key === "Enter" && ordered[sel]) { e.preventDefault(); run(ordered[sel]); }
  };
  let idx = -1;
  return (
    <div className={cx("flex flex-col", className)} onKeyDown={onKey}>
      <div className="flex items-center gap-[10px] border-b border-line px-[14px]">
        <Icon name="search-01" className="h-[16px] w-[16px] text-ink3" />
        <input autoFocus={autoFocus} value={q} onChange={e => { setQ(e.target.value); setSel(0); }} placeholder="Type a command or search"
          className="h-[46px] w-full bg-transparent text-[14px] text-ink placeholder:text-ink3 focus:outline-none" />
      </div>
      <div ref={listRef} className="scroll-thin relative max-h-[300px] overflow-y-auto p-[6px]">
        {groups.map(g => (
          <div key={g}>
            <div className="px-[8px] pb-[4px] pt-[8px] text-[11px] font-medium text-ink3">{g}</div>
            {filtered.filter(a => a.group === g).map(a => {
              idx++;
              const mine = idx;
              return (
                <button key={a.group + a.label} data-i={mine} onMouseMove={() => setSel(mine)} onClick={() => run(a)}
                  className={cx("flex h-[36px] w-full items-center gap-[10px] rounded-[7px] px-[9px] text-left text-[13px] transition-colors", sel === mine ? "bg-surface2 text-ink" : "text-ink2")}>
                  {a.icon && <Icon name={a.icon} className={cx("h-[15px] w-[15px]", sel === mine ? "text-ink" : "text-ink3")} />}
                  {a.label}
                  {a.hint && <span className="text-[12px] text-ink3">{a.hint}</span>}
                  <span className="ml-auto flex gap-[4px]">{a.kbd ? <Kbd>{a.kbd}</Kbd> : sel === mine ? <Icon name="arrow-right-01" className="h-[14px] w-[14px] text-ink3" /> : null}</span>
                </button>
              );
            })}
          </div>
        ))}
        {!filtered.length && <div className="px-[10px] py-[28px] text-center text-[13px] text-ink3">No results for “{q}”</div>}
      </div>
      <div className="flex items-center gap-[14px] border-t border-line px-[14px] py-[8px] text-[11.5px] text-ink3">
        <span className="flex items-center gap-[5px]"><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
        <span className="flex items-center gap-[5px]"><Kbd>↵</Kbd> open</span>
        <span className="ml-auto flex items-center gap-[5px]"><Kbd>esc</Kbd> close</span>
      </div>
    </div>
  );
}
export function Cmdk({ open, onClose, actions }: { open: boolean; onClose: () => void; actions: CmdkAction[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, boxRef);
  if (!open) return null;
  return (
    <div className="anim-fade fixed inset-0 z-[85] flex items-start justify-center bg-black/50 px-[16px] pt-[14vh] backdrop-blur-[2px]" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-label="Command menu" className="anim-in w-full max-w-[560px] overflow-hidden rounded-[14px] border border-line2 bg-surface shadow-[var(--shadow-pop)]">
        <CmdkList actions={actions} onDone={onClose} />
      </div>
    </div>
  );
}

/* ---------- Table ---------- */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="scroll-thin overflow-x-auto">{children}</div>;
}
export function Tbl({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead><tr className="border-b border-line text-left text-[12px] text-ink3">{head.map((h, i) => <th key={i} className="h-[38px] px-[14px] font-medium">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export function Tr({ children, selected, onClick }: { children: React.ReactNode; selected?: boolean; onClick?: () => void }) {
  return <tr onClick={onClick} className={cx("border-b border-line transition-colors last:border-0 [&>td]:h-[48px] [&>td]:px-[14px] [&>td]:align-middle", selected ? "bg-winebg" : "hover:bg-surface2/70")}>{children}</tr>;
}
export function Pagination({ current, total, onChange }: { current: number; total: number; onChange?: (p: number) => void }) {
  const go = (p: number) => onChange?.(Math.min(total, Math.max(1, p)));
  return (
    <div className="flex items-center gap-[2px]">
      <Button variant="ghost" size="sm" iconOnly aria-label="Previous page" disabled={current <= 1} onClick={() => go(current - 1)}><Icon name="arrow-left-01" className="h-[14px] w-[14px]" /></Button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => go(p)} aria-current={p === current ? "page" : undefined}
          className={cx("h-[28px] min-w-[28px] rounded-[6px] px-[6px] font-mono text-[12px] tabular-nums transition-colors", p === current ? "bg-surface2 text-ink ring-1 ring-line2" : "text-ink3 hover:text-ink")}>{p}</button>
      ))}
      <Button variant="ghost" size="sm" iconOnly aria-label="Next page" disabled={current >= total} onClick={() => go(current + 1)}><Icon name="arrow-right-01" className="h-[14px] w-[14px]" /></Button>
    </div>
  );
}

/* ---------- Alert / Empty / Avatar / Progress ---------- */
const alertStyles = {
  success: { bar: "bg-green", icon: "checkmark-circle-01" as IconName, tint: "text-green" },
  warn: { bar: "bg-amber", icon: "alert-02" as IconName, tint: "text-amber" },
  error: { bar: "bg-red", icon: "alert-circle" as IconName, tint: "text-red" },
  info: { bar: "bg-blue", icon: "information-circle" as IconName, tint: "text-blue" },
};
export function Alert({ kind, title, children, onClose, action }: { kind: keyof typeof alertStyles; title: string; children?: React.ReactNode; onClose?: () => void; action?: React.ReactNode }) {
  const s = alertStyles[kind];
  return (
    <div role="status" className="anim-in relative flex w-full items-start gap-[11px] overflow-hidden rounded-[10px] border border-line bg-surface py-[12px] pl-[16px] pr-[12px] text-[13px]">
      <span className={cx("absolute inset-y-0 left-0 w-[3px]", s.bar)} />
      <Icon name={s.icon} className={cx("mt-[1px] h-[16px] w-[16px] flex-none", s.tint)} />
      <div className="min-w-0 flex-1"><div className="font-medium text-ink">{title}</div>{children && <div className="mt-[2px] text-ink3">{children}</div>}</div>
      {action}
      {onClose && <button onClick={onClose} aria-label="Dismiss" className="rounded-[5px] p-[3px] text-ink3 hover:bg-surface2 hover:text-ink"><Icon name="cancel-01" className="h-[13px] w-[13px]" /></button>}
    </div>
  );
}
export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-[20px] py-[30px] text-center">
      <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[11px] border border-dashed border-line2 text-ink3"><Icon name={icon} className="h-[20px] w-[20px]" /></span>
      <h4 className="mt-[14px] text-[14px] font-medium">{title}</h4>
      <p className="mt-[4px] max-w-[280px] text-[12.5px] leading-[1.5] text-ink3">{body}</p>
      {action && <div className="mt-[16px]">{action}</div>}
    </div>
  );
}
const avatarTints = ["#c97a8c", "#7d9bd8", "#7fbf94", "#d6a957", "#a68bd6", "#6fb5b8"];
export function Avatar({ children, size = 28 }: { children: React.ReactNode; bg?: string; size?: number }) {
  const s = String(children);
  const tint = avatarTints[(s.charCodeAt(0) + (s.charCodeAt(1) || 0)) % avatarTints.length];
  return <span className="flex flex-none items-center justify-center rounded-full text-[10.5px] font-semibold text-white" style={{ width: size, height: size, background: s.startsWith("+") ? "var(--surface3)" : tint, color: s.startsWith("+") ? "var(--ink2)" : "#fff" }}>{children}</span>;
}
export function AvatarStack({ items }: { items: string[] }) {
  return <div className="flex -space-x-[7px]">{items.map((a, i) => <span key={i} className="rounded-full ring-2 ring-surface"><Avatar>{a}</Avatar></span>)}</div>;
}
export function Progress({ value, color }: { value: number; color?: string }) {
  return <div className="h-[5px] w-full overflow-hidden rounded-[2px] bg-surface3"><div className="h-full rounded-[2px] transition-[width] duration-500 ease-out" style={{ width: `${value}%`, background: color || "var(--ink)" }} /></div>;
}

/* ---------- Charts ---------- */
export function Spark({ points, className = "" }: { points: string; className?: string }) {
  return <svg viewBox="0 0 200 64" className={className}><path d={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" /></svg>;
}

export function StackedBars({ data, labels, colors, names, height = 220 }: { data: number[][]; labels: string[]; colors: string[]; names?: string[]; height?: number; max?: number }) {
  const [hi, setHi] = useState<number | null>(null);
  const W = 640, H = height, pad = { l: 36, r: 8, t: 10, b: 26 };
  const totals = data.map(v => v.reduce((a, b) => a + b, 0));
  const top = Math.ceil(Math.max(...totals) / 50) * 50;
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, step = iw / data.length, bw = Math.min(26, step * 0.55);
  return (
    <div className="relative" onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Stacked bar chart">
        {[0, .25, .5, .75, 1].map(f => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * f} y2={pad.t + ih * f} stroke="var(--line)" strokeDasharray={f === 1 ? "" : "2 4"} />
            <text x={pad.l - 8} y={pad.t + ih * f + 4} textAnchor="end" fontSize="10.5" fill="var(--ink3)" fontFamily="var(--font-geist-mono)">{Math.round(top * (1 - f))}</text>
          </g>
        ))}
        {data.map((v, i) => {
          const cx0 = pad.l + i * step + step / 2;
          let y = pad.t + ih;
          return (
            <g key={i} onMouseEnter={() => setHi(i)} style={{ opacity: hi === null || hi === i ? 1 : 0.35, transition: "opacity .2s" }}>
              <rect x={pad.l + i * step} y={pad.t} width={step} height={ih} fill={hi === i ? "var(--surface2)" : "transparent"} />
              {v.map((p, j) => { const h = (p / top) * ih; y -= h; return <rect key={j} x={cx0 - bw / 2} y={y + (j < v.length - 1 ? 1 : 0)} width={bw} height={Math.max(0, h - 1.5)} rx="2.5" fill={colors[j]} />; })}
              <text x={cx0} y={H - 8} textAnchor="middle" fontSize="10.5" fill="var(--ink3)" fontFamily="var(--font-geist-mono)">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
      {hi !== null && (
        <div className="pointer-events-none absolute top-[4px] z-10 min-w-[130px] rounded-[8px] border border-line2 bg-surface px-[10px] py-[8px] text-[12px] shadow-[var(--shadow-pop)]"
          style={{ left: `${((pad.l + hi * step + step / 2) / W) * 100}%`, transform: `translateX(${hi > data.length / 2 ? "calc(-100% - 14px)" : "14px"})` }}>
          <div className="mb-[5px] font-medium">{labels[hi]}</div>
          {data[hi].map((v, j) => (
            <div key={j} className="flex items-center gap-[7px] py-[1px] text-ink2"><i className="h-[8px] w-[8px] rounded-[2px]" style={{ background: colors[j] }} />{names?.[j] ?? `Series ${j + 1}`}<span className="ml-auto pl-[10px] font-mono tabular-nums text-ink">{v}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Donut({ parts, center, centerSub, size = 132 }: { parts: { label: string; value: number; color: string }[]; center: string; centerSub: string; size?: number }) {
  const [hi, setHi] = useState<number | null>(null);
  const total = parts.reduce((a, p) => a + p.value, 0);
  const R = 46, C = 2 * Math.PI * R;
  const lens = parts.map(p => (p.value / total) * C);
  const offs = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  const cur = hi !== null ? parts[hi] : null;
  return (
    <svg viewBox="0 0 120 120" style={{ width: size }} className="flex-none overflow-visible" onMouseLeave={() => setHi(null)}>
      <circle cx="60" cy="60" r={R} fill="none" stroke="var(--surface2)" strokeWidth="12" />
      {parts.map((p, i) => {
        const len = lens[i], off = offs[i];
        return <circle key={i} cx="60" cy="60" r={R} fill="none" stroke={p.color} strokeWidth={hi === i ? 16 : 12} strokeDasharray={`${Math.max(0, len - 2.5)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 60 60)"
          onMouseEnter={() => setHi(i)} style={{ transition: "stroke-width .2s, opacity .2s", opacity: hi === null || hi === i ? 1 : 0.35, cursor: "pointer" }} />;
      })}
      <text x="60" y="60" textAnchor="middle" fontSize="17" fontWeight="600" fill="var(--ink)" fontFamily="var(--font-geist)">{cur ? `${Math.round((cur.value / total) * 100)}%` : center}</text>
      <text x="60" y="75" textAnchor="middle" fontSize="9.5" fill="var(--ink3)" fontFamily="var(--font-geist)">{cur ? cur.label : centerSub}</text>
    </svg>
  );
}
export function Legend({ items, col }: { items: { label: string; color: string }[]; col?: boolean }) {
  return (
    <div className={cx("flex", col ? "flex-col gap-[8px]" : "flex-wrap gap-x-[16px] gap-y-[6px]")}>
      {items.map(i => <span key={i.label} className="flex items-center gap-[7px] text-[12px] text-ink2"><i className="h-[8px] w-[8px] rounded-[2px]" style={{ background: i.color }} />{i.label}</span>)}
    </div>
  );
}

/* ---------- Code with light syntax tint ---------- */
const TOKEN = /(\/\/.*$)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*)|\b(import|from|export|const|let|return|function|default|useState|true|false)\b/gm;
export function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0, m: RegExpExecArray | null, k = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? "text-ink3 italic" : m[2] ? "text-green" : m[3] ? "text-wine" : "text-violet";
    out.push(<span key={k++} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}
export function Code({ children, className = "" }: { children: string; className?: string }) {
  return <pre className={cx("scroll-thin overflow-x-auto font-mono text-[12.5px] leading-[1.7] text-ink2", className)}>{highlight(children)}</pre>;
}

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400); }}
      aria-label={label} className={cx("relative flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-ink3 transition-colors hover:bg-surface2 hover:text-ink", ring, className)}>
      <span className={cx("absolute transition-all duration-200", done ? "scale-50 opacity-0" : "scale-100 opacity-100")}><Icon name="copy-01" className="h-[14px] w-[14px]" /></span>
      <span className={cx("absolute text-green transition-all duration-200", done ? "scale-100 opacity-100" : "scale-50 opacity-0")}><Icon name="tick-01" className="h-[15px] w-[15px]" /></span>
    </button>
  );
}

/* ---------- Theme ---------- */
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, () => (document.documentElement.dataset.theme === "light" ? "light" : "dark"), () => "dark") as "dark" | "light";
  const set = (t: "dark" | "light") => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("flw-theme", t); } catch {}
  };
  return [theme, set] as const;
}
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <div role="radiogroup" aria-label="Color theme" className="relative inline-flex rounded-[9px] border border-line bg-surface2 p-[3px]">
      <span aria-hidden className="absolute top-[3px] h-[26px] w-[30px] rounded-[6px] border border-line2 bg-surface shadow-[0_1px_2px_rgba(0,0,0,.1)] transition-[left] duration-300 ease-[cubic-bezier(.3,1.2,.4,1)]" style={{ left: theme === "light" ? 3 : 33 }} />
      {(["light", "dark"] as const).map(t => (
        <button key={t} role="radio" aria-checked={theme === t} aria-label={`${t} theme`} onClick={() => setTheme(t)}
          className={cx("relative z-[1] flex h-[26px] w-[30px] items-center justify-center transition-colors", theme === t ? "text-ink" : "text-ink3 hover:text-ink2")}>
          {t === "light"
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-[14px] w-[14px]"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className="h-[14px] w-[14px]"><path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5a8.5 8.5 0 1 0 10.6 10.6Z" /></svg>}
        </button>
      ))}
    </div>
  );
}

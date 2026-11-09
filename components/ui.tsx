"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./icons";

/* ---------- Button ---------- */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
};
const btnBase = "inline-flex items-center justify-center gap-[7px] font-medium rounded-[9px] transition-colors select-none whitespace-nowrap disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine";
const btnVariants = {
  primary: "bg-ink text-paper hover:bg-[#2c2824]",
  secondary: "bg-surface text-ink border border-line2 hover:border-[#c9c3b8]",
  ghost: "text-ink2 hover:bg-black/[.05]",
  danger: "bg-redbg text-red hover:bg-[#f6dcdc]",
};
const btnSizes = { sm: "text-[12.5px] px-[11px] py-[6px]", md: "text-[13px] px-[14px] py-[8px]", lg: "text-[14px] px-[18px] py-[11px] rounded-[11px]" };
export function Button({ variant = "primary", size = "md", iconOnly, className = "", ...p }: BtnProps) {
  return <button className={`${btnBase} ${btnVariants[variant]} ${iconOnly ? "p-[8px]" : btnSizes[size]} ${className}`} {...p} />;
}

/* ---------- Badge ---------- */
const badgeColors = {
  green: "bg-greenbg text-green", amber: "bg-amberbg text-amber", red: "bg-redbg text-red",
  blue: "bg-bluebg text-blue", violet: "bg-violetbg text-violet", neutral: "bg-black/[.05] text-ink2",
  solid: "bg-ink text-paper", wine: "bg-winebg text-winedeep",
};
export function Badge({ color = "neutral", dot, children }: { color?: keyof typeof badgeColors; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[9px] py-[3px] text-[11.5px] font-medium ${badgeColors[color]}`}>
      {dot && <span className="h-[6px] w-[6px] rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

/* ---------- Tag / Kbd ---------- */
export function Tag({ on, children, onClick }: { on?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-[11px] py-[4px] text-[12px] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line2 bg-surface text-ink2 hover:border-[#c9c3b8]"}`}>{children}</button>
  );
}
export function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-[5px] border border-line2 bg-surface2 px-[5px] py-[1px] font-mono text-[10.5px] text-ink3 shadow-[0_1px_0_var(--color-line2)]">{children}</span>;
}

/* ---------- Card ---------- */
export function Card({ children, className = "", hover }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={`rounded-[14px] border border-line bg-surface ${hover ? "transition-all hover:-translate-y-[2px] hover:shadow-[0_16px_30px_-18px_rgba(27,25,23,.25)]" : ""} ${className}`}>{children}</div>;
}
export function CardHead({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[10px] border-b border-line px-[18px] py-[13px] text-[13.5px] font-semibold">{children}</div>;
}
export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-[18px] py-[16px] ${className}`}>{children}</div>;
}
export function CardFoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[10px] border-t border-line px-[18px] py-[12px]">{children}</div>;
}

/* ---------- Stat card ---------- */
export function StatCard({ icon, iconBg, label, value, delta, deltaUp, sub }: { icon: IconName; iconBg: string; label: string; value: string; delta?: string; deltaUp?: boolean; sub?: string }) {
  return (
    <Card className="p-[18px]">
      <div className="flex items-center gap-[9px]">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px]" style={{ background: iconBg }}><Icon name={icon} className="h-[16px] w-[16px]" /></span>
        <span className="text-[12.5px] text-ink3">{label}</span>
      </div>
      <div className="mt-[10px] text-[24px] font-semibold tracking-[-0.01em] tabular-nums">{value}</div>
      <div className="mt-[4px] flex items-center gap-[7px] text-[12px] text-ink3">
        {delta && <span className={`font-medium ${deltaUp ? "text-green" : "text-red"}`}>{delta}</span>}
        {sub}
      </div>
    </Card>
  );
}

/* ---------- Forms ---------- */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-[280px] flex-col gap-[6px]">
      <label className="text-[12.5px] font-medium">{label}</label>
      {children}
      {error ? <span className="text-[11.5px] text-red">{error}</span> : hint ? <span className="text-[11.5px] text-ink3">{hint}</span> : null}
    </div>
  );
}
export const inputCls = "w-full rounded-[9px] border border-line2 bg-surface px-[11px] py-[8px] text-[13px] placeholder:text-ink3 focus:border-wine focus:outline-none focus:ring-[3px] focus:ring-wine/15 transition-shadow";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, className = "", ...p } = props;
  return <input className={`${inputCls} ${error ? "border-red ring-[3px] ring-red/10" : ""} ${className}`} {...p} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={inputCls} {...props} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${inputCls} appearance-none pr-[30px] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222.4%22 stroke-linecap=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_10px_center]`} {...props} />;
}
export function SearchInput({ placeholder, className = "", onFocus }: { placeholder: string; className?: string; onFocus?: () => void }) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-ink3"><Icon name="search-01" className="h-[15px] w-[15px]" /></span>
      <input onFocus={onFocus} placeholder={placeholder} className={`${inputCls} pl-[32px]`} />
    </div>
  );
}

/* ---------- Toggle / Checkbox / Radio / Seg ---------- */
export function Toggle({ checked, onChange }: { checked: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange?.(!checked)}
      className={`relative h-[22px] w-[38px] rounded-full transition-colors ${checked ? "bg-ink" : "bg-black/[.14]"}`}>
      <span className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow transition-all ${checked ? "left-[19px]" : "left-[3px]"}`} />
    </button>
  );
}
export function Checkbox({ label, defaultChecked }: { label?: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-[9px] text-[13px]">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[5px] border border-line2 bg-surface text-transparent transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" className="h-[11px] w-[11px]"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      {label}
    </label>
  );
}
export function Radio({ label, name, defaultChecked }: { label?: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-[9px] text-[13px]">
      <input type="radio" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-line2 bg-surface transition-colors peer-checked:border-[5.5px] peer-checked:border-ink" />
      {label}
    </label>
  );
}
export function Seg({ options, value, onChange, small }: { options: string[]; value: string; onChange?: (v: string) => void; small?: boolean }) {
  return (
    <div className="inline-flex rounded-[9px] border border-line bg-surface2 p-[3px]">
      {options.map(o => (
        <button key={o} onClick={() => onChange?.(o)} className={`rounded-[6px] ${small ? "px-[9px] py-[3px] text-[11.5px]" : "px-[12px] py-[5px] text-[12.5px]"} font-medium transition-colors ${value === o ? "bg-surface shadow-sm text-ink" : "text-ink3 hover:text-ink2"}`}>{o}</button>
      ))}
    </div>
  );
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, panels }: { tabs: string[]; panels: React.ReactNode[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="flex gap-[18px] border-b border-line">
        {tabs.map((t, j) => (
          <button key={t} onClick={() => setI(j)} className={`-mb-px border-b-2 pb-[9px] text-[13px] font-medium transition-colors ${i === j ? "border-ink text-ink" : "border-transparent text-ink3 hover:text-ink2"}`}>{t}</button>
        ))}
      </div>
      <div className="pt-[14px] text-[13.5px] text-ink2">{panels[i]}</div>
    </div>
  );
}

/* ---------- Dropdown ---------- */
export function Dropdown({ label, icon, children, right }: { label: string; icon?: IconName; children: React.ReactNode; right?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(!open)} aria-expanded={open}>
        {icon && <Icon name={icon} className="h-[14px] w-[14px]" />}{label}<Icon name="arrow-down-01" className="h-[13px] w-[13px]" />
      </Button>
      {open && (
        <div className={`absolute z-40 mt-[6px] min-w-[190px] rounded-[11px] border border-line bg-surface p-[5px] shadow-[0_16px_36px_-14px_rgba(27,25,23,.3)] ${right ? "right-0" : "left-0"}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
export function MenuItem({ icon, kbd, danger, onClick, children }: { icon?: IconName; kbd?: string; danger?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-[9px] rounded-[7px] px-[9px] py-[7px] text-left text-[12.5px] hover:bg-black/[.045] ${danger ? "text-red" : "text-ink2"}`}>
      {icon && <Icon name={icon} className="h-[15px] w-[15px]" />}
      {children}
      {kbd && <span className="ml-auto"><Kbd>{kbd}</Kbd></span>}
    </button>
  );
}

/* ---------- Toast ---------- */
type Toast = { id: number; msg: string };
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = useCallback((msg: string) => {
    const id = ++idRef.current;
    setToasts(t => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-[22px] left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-[8px]">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-[9px] rounded-[10px] bg-ink px-[14px] py-[10px] text-[13px] text-paper shadow-lg" style={{ animation: "flw-toast-in .25s ease" }}>
            <Icon name="checkmark-circle-01" className="h-[15px] w-[15px] text-[#8fce6e]" />{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, label, children, width = 460 }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode; width?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement;
    boxRef.current?.querySelector<HTMLElement>("button, input, [href]")?.focus();
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
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; prev?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/[.32] p-[18px]" style={{ animation: "flw-overlay-in .18s ease" }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-label={label} className="w-full rounded-[16px] border border-line bg-surface shadow-[0_30px_70px_-20px_rgba(27,25,23,.45)]" style={{ maxWidth: width, animation: "flw-modal-in .22s cubic-bezier(.2,.9,.3,1.2)" }}>
        {children}
      </div>
    </div>
  );
}
export function ModalHead({ icon, iconBg, title, sub, onClose }: { icon: IconName; iconBg: string; title: string; sub: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-[12px] border-b border-line px-[18px] py-[16px]">
      <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]" style={{ background: iconBg }}><Icon name={icon} className="h-[17px] w-[17px]" /></span>
      <div className="min-w-0"><h3 className="text-[14.5px] font-semibold">{title}</h3><p className="mt-[2px] text-[12.5px] text-ink3">{sub}</p></div>
      <button onClick={onClose} aria-label="Close" className="ml-auto rounded-[7px] p-[5px] text-ink3 hover:bg-black/[.05] hover:text-ink"><Icon name="cancel-01" className="h-[15px] w-[15px]" /></button>
    </div>
  );
}
export function ModalFoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-[9px] border-t border-line px-[18px] py-[13px]">{children}</div>;
}

/* ---------- Command palette ---------- */
export type CmdkAction = { label: string; icon?: IconName; href?: string; kbd?: string; onSelect?: () => void; group: string };
export function Cmdk({ open, onClose, actions }: { open: boolean; onClose: () => void; actions: CmdkAction[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) { setQ(""); setSel(0); } }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open ? onClose() : undefined; }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  const filtered = actions.filter(a => a.label.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(filtered.map(a => a.group))];
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { setSel(s => Math.min(s + 1, filtered.length - 1)); e.preventDefault(); }
      if (e.key === "ArrowUp") { setSel(s => Math.max(s - 1, 0)); e.preventDefault(); }
      if (e.key === "Enter" && filtered[sel]) { const a = filtered[sel]; onClose(); a.onSelect ? a.onSelect() : a.href && (window.location.href = a.href); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, onClose]);
  if (!open) return null;
  let idx = -1;
  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center bg-black/[.32] px-[18px] pt-[14vh]" style={{ animation: "flw-overlay-in .15s ease" }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-label="Command palette" className="w-full max-w-[540px] overflow-hidden rounded-[14px] border border-line bg-surface shadow-[0_30px_70px_-20px_rgba(27,25,23,.45)]" style={{ animation: "flw-modal-in .18s ease" }}>
        <div className="flex items-center gap-[10px] border-b border-line px-[15px] py-[12px] text-ink3">
          <Icon name="search-01" className="h-[16px] w-[16px]" />
          <input autoFocus value={q} onChange={e => { setQ(e.target.value); setSel(0); }} placeholder="Search components, pages and actions..." className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink3 focus:outline-none" />
        </div>
        <div ref={listRef} className="max-h-[320px] overflow-y-auto p-[7px]">
          {groups.map(g => (
            <div key={g}>
              <div className="px-[9px] pb-[4px] pt-[9px] text-[10.5px] font-semibold uppercase tracking-[.08em] text-ink3">{g}</div>
              {filtered.filter(a => a.group === g).map(a => {
                idx++;
                const mine = idx;
                return (
                  <button key={a.label} onMouseEnter={() => setSel(mine)} onClick={() => { onClose(); a.onSelect ? a.onSelect() : a.href && (window.location.href = a.href); }}
                    className={`flex w-full items-center gap-[10px] rounded-[8px] px-[9px] py-[8px] text-left text-[13px] ${sel === mine ? "bg-winebg text-winedeep" : "text-ink2"}`}>
                    {a.icon && <Icon name={a.icon} className="h-[15px] w-[15px]" />}
                    {a.label}
                    {a.kbd && <span className="ml-auto"><Kbd>{a.kbd}</Kbd></span>}
                  </button>
                );
              })}
            </div>
          ))}
          {!filtered.length && <div className="px-[10px] py-[20px] text-center text-[12.5px] text-ink3">Nothing matches that search.</div>}
        </div>
        <div className="flex gap-[14px] border-t border-line px-[14px] py-[8px] text-[10.5px] text-ink3"><span>↑↓ to move</span><span>↵ to open</span><span>esc to close</span></div>
      </div>
    </div>
  );
}

/* ---------- Table / Pagination ---------- */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-[12px] border border-line bg-surface">{children}</div>;
}
export function Tbl({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead><tr className="border-b border-line bg-surface2 text-left text-[10.5px] font-semibold uppercase tracking-[.07em] text-ink3">{head.map((h, i) => <th key={i} className="px-[14px] py-[10px] font-semibold">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-line last:border-0 hover:bg-surface2/60 [&>td]:px-[14px] [&>td]:py-[11px] [&>td]:align-middle">{children}</tr>;
}
export function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-[4px]">
      {["‹", ...Array.from({ length: total }, (_, i) => i + 1), "›"].map((p, i) => (
        <button key={i} className={`h-[28px] min-w-[28px] rounded-[7px] px-[6px] text-[12px] ${p === current ? "bg-ink text-paper" : "text-ink2 hover:bg-black/[.05]"}`}>{p}</button>
      ))}
    </div>
  );
}

/* ---------- Alert / Empty / Avatar / Progress ---------- */
const alertStyles = {
  success: { cls: "border-[#c3e5d0] bg-greenbg text-green", icon: "checkmark-circle-01" as IconName },
  warn: { cls: "border-[#f0ddba] bg-amberbg text-amber", icon: "alert-02" as IconName },
  error: { cls: "border-[#f3c8c8] bg-redbg text-red", icon: "cancel-circle" as IconName },
  info: { cls: "border-[#c9d8f8] bg-bluebg text-blue", icon: "information-circle" as IconName },
};
export function Alert({ kind, title, children }: { kind: keyof typeof alertStyles; title: string; children: React.ReactNode }) {
  const s = alertStyles[kind];
  return (
    <div className={`flex w-full items-start gap-[11px] rounded-[11px] border px-[14px] py-[12px] text-[13px] ${s.cls}`}>
      <Icon name={s.icon} className="mt-[1px] h-[16px] w-[16px] flex-none" />
      <div className="text-ink"><span className="font-semibold">{title}</span> <span className="text-ink2">{children}</span></div>
    </div>
  );
}
export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-[20px] py-[34px] text-center">
      <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-surface2 text-ink3"><Icon name={icon} className="h-[20px] w-[20px]" /></span>
      <h4 className="mt-[12px] text-[14px] font-semibold">{title}</h4>
      <p className="mt-[4px] max-w-[300px] text-[12.5px] text-ink3">{body}</p>
      {action && <div className="mt-[14px]">{action}</div>}
    </div>
  );
}
export function Avatar({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-line text-[10.5px] font-semibold text-ink2" style={{ background: bg || "var(--color-surface2)" }}>{children}</span>;
}
export function AvatarStack({ items }: { items: string[] }) {
  return <div className="flex -space-x-[8px]">{items.map((a, i) => <span key={i} className="ring-2 ring-surface rounded-full"><Avatar>{a}</Avatar></span>)}</div>;
}
export function Progress({ value, color }: { value: number; color?: string }) {
  return <div className="h-[6px] w-full overflow-hidden rounded-full bg-black/[.07]"><div className="h-full rounded-full" style={{ width: `${value}%`, background: color || "var(--color-ink)" }} /></div>;
}

/* ---------- Charts ---------- */
export function Spark({ points, className = "" }: { points: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 64" className={className}>
      <path d={points} fill="none" stroke="var(--color-wine)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function StackedBars({ data, labels, colors, height = 225, max = 100 }: { data: number[][]; labels: string[]; colors: string[]; height?: number; max?: number }) {
  const W = 640, x0 = 56, step = (620 - x0) / data.length;
  const total = (v: number[]) => v.reduce((a, b) => a + b, 0);
  const top = Math.max(...data.map(total));
  const scale = max === 100 ? height / top : height / max;
  return (
    <svg viewBox={`0 0 ${W} 260`} className="w-full" role="img" aria-label="Stacked bar chart">
      {[0, 0.33, 0.66, 1].map(f => (
        <g key={f}>
          <line x1="40" y1={30 + (height - 30) * f} x2="620" y2={30 + (height - 30) * f} stroke="#eceae5" />
          <text x="30" y={34 + (height - 30) * f} textAnchor="end" fontSize="11" fill="#8a857c" fontFamily="Inter,sans-serif">{Math.round(top * (1 - f))}</text>
        </g>
      ))}
      {data.map((v, i) => {
        const x = x0 + i * step + step / 2 - 14;
        let y = height;
        return (
          <g key={i}>
            {v.map((p, j) => {
              const h = p * scale;
              y -= h + 2;
              return <rect key={j} x={x} y={y} width="28" height={h} rx="4" fill={colors[j]} />;
            })}
            <text x={x + 14} y="245" textAnchor="middle" fontSize="11" fill="#8a857c" fontFamily="Inter,sans-serif">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}
export function Donut({ parts, center, centerSub }: { parts: { label: string; value: number; color: string }[]; center: string; centerSub: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const C = 2 * Math.PI * 46;
  let off = 0;
  return (
    <svg viewBox="0 0 120 120" className="w-[104px] flex-none">
      <circle cx="60" cy="60" r="46" fill="none" stroke="#eceae5" strokeWidth="14" />
      {parts.map((p, i) => {
        const len = (p.value / total) * C - 4;
        const el = <circle key={i} cx="60" cy="60" r="46" fill="none" stroke={p.color} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 60 60)" />;
        off += (p.value / total) * C;
        return el;
      })}
      <text x="60" y="58" textAnchor="middle" fontSize="17" fontWeight="650" fontFamily="Inter,sans-serif" fill="#1b1917">{center}</text>
      <text x="60" y="74" textAnchor="middle" fontSize="9.5" fontFamily="Inter,sans-serif" fill="#8a857c">{centerSub}</text>
    </svg>
  );
}
export function Legend({ items, col }: { items: { label: string; color: string }[]; col?: boolean }) {
  return (
    <div className={`flex ${col ? "flex-col gap-[8px]" : "gap-[16px] flex-wrap"}`}>
      {items.map(i => (
        <span key={i.label} className="flex items-center gap-[7px] text-[12px] text-ink2"><i className="h-[9px] w-[9px] rounded-[3px]" style={{ background: i.color }} />{i.label}</span>
      ))}
    </div>
  );
}

/* ---------- Code block with copy ---------- */
export function Code({ children }: { children: string }) {
  const toast = useToast();
  return (
    <div className="group relative mt-[10px]">
      <pre className="overflow-x-auto rounded-[10px] border border-line bg-surface2 px-[13px] py-[11px] font-mono text-[11.5px] leading-relaxed text-ink2">{children}</pre>
      <button onClick={() => { navigator.clipboard?.writeText(children); toast("Copied to clipboard"); }}
        className="absolute right-[8px] top-[8px] rounded-[6px] border border-line bg-surface p-[5px] text-ink3 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100" aria-label="Copy code">
        <Icon name="copy-01" className="h-[13px] w-[13px]" />
      </button>
    </div>
  );
}

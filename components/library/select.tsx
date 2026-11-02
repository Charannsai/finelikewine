"use client";
/**
 * Select · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Select" | "Combobox" | "Multiple"
 */
import React, { useCallback, useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-3.5 w-3.5" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);

type Option = { value: string; label: string; meta?: string };

export function Listbox({ options, value, onChange, multiple, searchable, placeholder }: {
  options: Option[]; value: string[]; onChange: (v: string[]) => void; multiple?: boolean; searchable?: boolean; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => { setOpen(false); setQ(""); }, []);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, close]);

  const list = options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
  const openAt = () => { setOpen(true); setHi(Math.max(0, options.findIndex(o => o.value === value[0]))); };
  const pick = (o: Option) => {
    if (multiple) onChange(value.includes(o.value) ? value.filter(v => v !== o.value) : [...value, o.value]);
    else { onChange([o.value]); close(); }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "Enter", " "].includes(e.key)) { e.preventDefault(); openAt(); return; }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, list.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && list[hi]) { e.preventDefault(); pick(list[hi]); }
    if (e.key === "Escape") close();
  };
  const mark = (label: string) => {
    const i = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
    return i < 0 ? label : <>{label.slice(0, i)}<span className="text-wine">{label.slice(i, i + q.length)}</span>{label.slice(i + q.length)}</>;
  };
  const chosen = options.filter(o => value.includes(o.value));

  return (
    <div ref={ref} className="relative w-full" onKeyDown={onKey}>
      {searchable && open ? (
        <div className="flex h-9 items-center gap-2 rounded-lg border border-wine bg-surface px-3 ring-[3px] ring-wine/15">
          <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5" className="h-3.5 w-3.5 text-ink3" />
          <input autoFocus value={q} onChange={e => { setQ(e.target.value); setHi(0); }} placeholder="Search" className="w-full bg-transparent text-[13px] focus:outline-none" />
        </div>
      ) : (
        <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => (open ? close() : openAt())}
          className={cx("flex min-h-9 w-full flex-wrap items-center gap-1 rounded-lg border bg-surface py-1 pl-3 pr-8 text-left text-[13px] transition-[border,box-shadow] duration-300",
            open ? "border-wine ring-[3px] ring-wine/15" : "border-line2 hover:border-ink3/50")}>
          {!chosen.length && <span className="text-ink3">{placeholder}</span>}
          {!multiple && chosen[0] && <span>{chosen[0].label}</span>}
          {multiple && chosen.map(o => (
            <span key={o.value} className="inline-flex h-6 items-center gap-1 rounded-md border border-line bg-surface2 pl-2 pr-0.5 text-xs">
              {o.label}
              <span role="button" aria-label={`Remove ${o.label}`} onClick={e => { e.stopPropagation(); pick(o); }} className="flex h-4 w-4 items-center justify-center rounded text-ink3 hover:bg-surface3 hover:text-ink">
                <Icon d="M18 6 6 18M6 6l12 12" className="h-2.5 w-2.5" />
              </span>
            </span>
          ))}
          <span className={cx("absolute right-2.5 top-2.5 text-ink3 transition-transform duration-300", open && "rotate-180")}><Icon d="m6 9 6 6 6-6" /></span>
        </button>
      )}
      {open && (
        <div role="listbox" aria-multiselectable={multiple} className="absolute left-0 right-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-line2 bg-surface p-1 shadow-[var(--shadow-pop)]">
          {list.map((o, i) => (
            <div key={o.value} role="option" aria-selected={value.includes(o.value)} onMouseMove={() => setHi(i)} onMouseDown={e => { e.preventDefault(); pick(o); }}
              className={cx("flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-[13px] transition-colors", i === hi ? "bg-surface2 text-ink" : "text-ink2")}>
              <span className="flex-1 truncate">{mark(o.label)}</span>
              {o.meta && <span className="font-mono text-[11px] text-ink3">{o.meta}</span>}
              <span className={cx("text-wine transition-opacity", value.includes(o.value) ? "opacity-100" : "opacity-0")}><Icon d="M20 6 9 17l-5-5" /></span>
            </div>
          ))}
          {!list.length && <div className="px-2 py-3 text-[12.5px] text-ink3">No match for “{q}”.</div>}
        </div>
      )}
    </div>
  );
}

const ROLES: Option[] = [{ value: "owner", label: "Owner", meta: "all access" }, { value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer", meta: "read only" }];
const ZONES: Option[] = [
  { value: "la", label: "Los Angeles", meta: "UTC−8" }, { value: "ny", label: "New York", meta: "UTC−5" }, { value: "ldn", label: "London", meta: "UTC+0" },
  { value: "ber", label: "Berlin", meta: "UTC+1" }, { value: "hyd", label: "Hyderabad", meta: "UTC+5:30" }, { value: "sg", label: "Singapore", meta: "UTC+8" },
  { value: "tyo", label: "Tokyo", meta: "UTC+9" }, { value: "syd", label: "Sydney", meta: "UTC+10" },
];
const STACK: Option[] = ["Next.js", "Remix", "Astro", "SvelteKit", "Vite", "Tailwind", "Prisma", "Drizzle"].map(s => ({ value: s, label: s }));

export default function SelectDemo({ variant = "Select" }: { variant?: string }) {
  const [role, setRole] = useState(["editor"]);
  const [zone, setZone] = useState<string[]>([]);
  const [stack, setStack] = useState(["Next.js", "Tailwind"]);
  const caption =
    variant === "Select" ? `New members join as ${ROLES.find(r => r.value === role[0])?.label.toLowerCase()}s.` :
    variant === "Combobox" ? (zone[0] ? `Meetings show in ${ZONES.find(z => z.value === zone[0])?.label} time.` : "Type to filter, arrows to move.") :
    `${stack.length} selected${stack.length ? `: ${stack.join(", ")}` : ""}`;
  return (
    <div className="relative flex h-full w-full justify-center pt-10">
      <div className="w-full max-w-xs">
        <label className="mb-1.5 block text-[12.5px] font-medium text-ink2">{variant === "Select" ? "Default role" : variant === "Combobox" ? "Time zone" : "Stack"}</label>
        {variant === "Select" && <Listbox placeholder="Pick a role" value={role} onChange={setRole} options={ROLES} />}
        {variant === "Combobox" && <Listbox searchable placeholder="Search cities" value={zone} onChange={setZone} options={ZONES} />}
        {variant === "Multiple" && <Listbox multiple placeholder="Add tools" value={stack} onChange={setStack} options={STACK} />}
        <p className="mt-2 text-xs text-ink3">{caption}</p>
      </div>
    </div>
  );
}

"use client";
/**
 * Dialog · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Variants: "Modal" | "Drawer" | "Confirm". Each dialog opens inside this component's own frame
 * (absolute, not fixed), so it stays in place and the result shows right where you clicked.
 * For a page-level dialog, change `absolute` to `fixed` on the backdrop.
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const X = "M18 6 6 18M6 6l12 12";
const field = "w-full rounded-lg border border-line2 bg-surface px-3 text-[13px] placeholder:text-ink3 focus:border-wine focus:outline-none focus:ring-[3px] focus:ring-wine/15";
const KEYFRAMES = `
@keyframes dlg-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes dlg-in { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: none } }
@keyframes dlg-drawer { from { transform: translateX(100%) } to { transform: none } }`;

function Layer({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef(onClose);
  useEffect(() => { latest.current = onClose; });
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("textarea, input")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") latest.current(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div ref={ref} role="dialog" aria-label={label} className="absolute inset-0 z-20 overflow-hidden rounded-xl bg-paper/60 backdrop-blur-[3px]"
      style={{ animation: "dlg-fade .4s ease" }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

function Head({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-3 px-4 pb-1 pt-4">
      <div className="flex-1"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-[12.5px] leading-relaxed text-ink3">{sub}</p></div>
      <button onClick={onClose} aria-label="Close" className="-mr-1 rounded-md p-1 text-ink3 hover:bg-surface2 hover:text-ink"><Icon d={X} className="h-3.5 w-3.5" /></button>
    </div>
  );
}
const Foot = ({ children }: { children: React.ReactNode }) => <div className="flex justify-end gap-2 border-t border-line bg-surface2/60 px-4 py-2.5">{children}</div>;
const Btn = ({ kind = "primary", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "danger" }) => (
  <button {...p} className={cx("h-8 rounded-lg px-3 text-[13px] font-medium transition-colors duration-300 disabled:opacity-40",
    kind === "primary" ? "bg-ink text-onink hover:bg-ink/85" : kind === "danger" ? "border border-red/25 bg-redbg text-red hover:bg-red/15" : "text-ink2 hover:bg-surface2")} />
);

export default function DialogDemo({ variant = "Modal" }: { variant?: string }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [emails, setEmails] = useState("");
  const [typed, setTyped] = useState("");
  const [profile, setProfile] = useState({ name: "Mira Sato", title: "Product designer" });
  const [draft, setDraft] = useState(profile);
  const close = () => { setOpen(false); setTyped(""); };

  const trigger = variant === "Modal" ? "Invite people" : variant === "Drawer" ? "Edit profile" : "Delete project";
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl">
      <style>{KEYFRAMES}</style>

      {variant === "Drawer" && (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9a86c9] text-[11px] font-semibold text-white">{profile.name.split(" ").map(s => s[0]).join("").slice(0, 2)}</span>
          <div><div className="text-[13px] font-medium">{profile.name}</div><div className="text-xs text-ink3">{profile.title}</div></div>
        </div>
      )}

      <button onClick={() => { setDraft(profile); setOpen(true); }}
        className={cx("h-9 rounded-lg px-3.5 text-[13px] font-medium transition-colors duration-300", variant === "Confirm" ? "border border-red/25 bg-redbg text-red hover:bg-red/15" : "border border-line2 bg-surface hover:bg-surface2")}>
        {trigger}
      </button>
      <p className="h-4 text-xs text-ink3">{result ?? "Opens inside this frame"}</p>

      {open && variant === "Modal" && (
        <Layer onClose={close} label="Invite people">
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-xl border border-line2 bg-surface shadow-[var(--shadow-pop)]" style={{ animation: "dlg-in .5s cubic-bezier(.16,1,.3,1)" }}>
              <Head title="Invite people" sub="They’ll get an email with a link to join." onClose={close} />
              <div className="px-4 py-3">
                <textarea rows={3} value={emails} onChange={e => setEmails(e.target.value)} placeholder="ana@northwind.co, li@northwind.co" className={cx(field, "py-2")} />
              </div>
              <Foot>
                <Btn kind="ghost" onClick={close}>Cancel</Btn>
                <Btn disabled={!emails.trim()} onClick={() => { const n = emails.split(",").filter(s => s.trim()).length; setResult(`${n} invite${n > 1 ? "s" : ""} sent`); setEmails(""); close(); }}>Send invites</Btn>
              </Foot>
            </div>
          </div>
        </Layer>
      )}

      {open && variant === "Drawer" && (
        <Layer onClose={close} label="Edit profile">
          <div className="absolute inset-y-2 right-2 flex w-[min(300px,calc(100%-16px))] flex-col overflow-hidden rounded-xl border border-line2 bg-surface shadow-[var(--shadow-pop)]" style={{ animation: "dlg-drawer .6s cubic-bezier(.16,1,.3,1)" }}>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h3 className="text-sm font-semibold">Edit profile</h3>
              <button onClick={close} aria-label="Close" className="rounded-md p-1 text-ink3 hover:bg-surface2 hover:text-ink"><Icon d={X} className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              <label className="text-[12.5px] font-medium text-ink2">Display name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={cx(field, "mt-1.5 h-9")} /></label>
              <label className="text-[12.5px] font-medium text-ink2">Title<input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className={cx(field, "mt-1.5 h-9")} /></label>
            </div>
            <Foot>
              <Btn kind="ghost" onClick={close}>Cancel</Btn>
              <Btn disabled={!draft.name.trim()} onClick={() => { setProfile(draft); setResult("Profile updated"); close(); }}>Save</Btn>
            </Foot>
          </div>
        </Layer>
      )}

      {open && variant === "Confirm" && (
        <Layer onClose={close} label="Delete project">
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-xl border border-line2 bg-surface shadow-[var(--shadow-pop)]" style={{ animation: "dlg-in .5s cubic-bezier(.16,1,.3,1)" }}>
              <Head title="Delete this project?" sub="This removes 214 files and all deploy history. It can’t be undone." onClose={close} />
              <div className="px-4 py-3">
                <label className="text-[12.5px] text-ink3">Type <span className="font-mono text-ink2">acme-web</span> to confirm</label>
                <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="acme-web" className={cx(field, "mt-1.5 h-9 font-mono")} />
              </div>
              <Foot>
                <Btn kind="ghost" onClick={close}>Cancel</Btn>
                <Btn kind="danger" disabled={typed !== "acme-web"} onClick={() => { setResult("acme-web was deleted"); close(); }}>Delete project</Btn>
              </Foot>
            </div>
          </div>
        </Layer>
      )}
    </div>
  );
}

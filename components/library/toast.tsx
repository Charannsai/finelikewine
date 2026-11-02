"use client";
/**
 * Toast · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * The stack lives inside its own frame here. For app-wide toasts, render <Stack> in a fixed corner.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);

type Kind = "success" | "error" | "info" | "loading";
type Toast = { id: number; title: string; desc?: string; kind: Kind; action?: { label: string; run: () => void }; leaving?: boolean };

const ICON: Record<Kind, React.ReactNode> = {
  success: <span className="text-green"><Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8 12l3 3 5-6" /></span>,
  error: <span className="text-red"><Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8v5M12 16v.5" /></span>,
  info: <span className="text-blue"><Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8v.5" /></span>,
  loading: <span className="mt-0.5 block h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink3 border-r-transparent" />,
};

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const id = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  useEffect(() => { const t = timers.current; return () => t.forEach(clearTimeout); }, []);
  const dismiss = useCallback((tid: number) => {
    setToasts(ts => ts.map(t => (t.id === tid ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== tid)), 400);
  }, []);
  const schedule = useCallback((tid: number, kind: Kind) => {
    clearTimeout(timers.current.get(tid));
    if (kind !== "loading") timers.current.set(tid, setTimeout(() => dismiss(tid), 4000));
  }, [dismiss]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const tid = ++id.current;
    setToasts(ts => [...ts.slice(-3), { ...t, id: tid }]);
    schedule(tid, t.kind);
    return tid;
  }, [schedule]);
  const update = useCallback((tid: number, t: Omit<Toast, "id">) => { setToasts(ts => ts.map(x => (x.id === tid ? { ...t, id: tid } : x))); schedule(tid, t.kind); }, [schedule]);
  return { toasts, push, update, dismiss };
}

function Stack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  const [spread, setSpread] = useState(false);
  return (
    <section aria-live="polite" onMouseEnter={() => setSpread(true)} onMouseLeave={() => setSpread(false)}
      className="absolute bottom-3 left-3 right-3 z-10" style={{ height: toasts.length ? (spread ? toasts.length * 66 : 62 + Math.min(toasts.length - 1, 2) * 8) : 0, transition: "height .5s cubic-bezier(.16,1,.3,1)" }}>
      {toasts.map((t, i) => {
        const back = toasts.length - 1 - i;
        return (
          <div key={t.id} className="absolute bottom-0 left-0 right-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ transform: `translateY(${spread ? -back * 66 : -back * 8}px) scale(${spread ? 1 : 1 - back * 0.05})`, opacity: t.leaving || (back > 2 && !spread) ? 0 : 1, zIndex: i, transformOrigin: "bottom center" }}>
            <div className="flex min-h-[58px] items-start gap-2.5 rounded-xl border border-line2 bg-surface px-3.5 py-2.5 shadow-[var(--shadow-pop)]" style={{ animation: "toast-in .5s cubic-bezier(.16,1,.3,1)" }}>
              <span className="mt-0.5">{ICON[t.kind]}</span>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-medium">{t.title}</div>{t.desc && <div className="truncate text-xs text-ink3">{t.desc}</div>}</div>
              {t.action && <button onClick={() => { t.action!.run(); dismiss(t.id); }} className="h-6 rounded-md border border-line2 px-2 text-xs font-medium hover:bg-surface2">{t.action.label}</button>}
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded-md p-1 text-ink3 hover:bg-surface2 hover:text-ink"><Icon d="M18 6 6 18M6 6l12 12" className="h-3 w-3" /></button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default function ToastDemo() {
  const { toasts, push, update, dismiss } = useToasts();
  const [inbox, setInbox] = useState(12);
  const fire: [string, () => void][] = [
    ["Success", () => push({ kind: "success", title: "Changes saved", desc: "Workspace settings are up to date." })],
    ["Error", () => push({ kind: "error", title: "Payment failed", desc: "The card ending 4242 was declined." })],
    ["Undo", () => { setInbox(n => Math.max(0, n - 3)); push({ kind: "info", title: "3 messages archived", action: { label: "Undo", run: () => setInbox(n => n + 3) } }); }],
    ["Promise", () => { const id = push({ kind: "loading", title: "Uploading report.pdf", desc: "2.4 MB" }); setTimeout(() => update(id, { kind: "success", title: "Upload complete", desc: "report.pdf is in Shared files" }), 1800); }],
  ];
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl pt-6">
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(10px); filter: blur(4px) } to { opacity: 1; transform: none; filter: none } }`}</style>
      <div className="grid w-full max-w-[280px] grid-cols-2 gap-2">
        {fire.map(([label, fn]) => <button key={label} onClick={fn} className="h-9 rounded-lg border border-line2 bg-surface text-[13px] transition-colors duration-300 hover:bg-surface2">{label}</button>)}
      </div>
      <p className="mt-3 text-xs text-ink3">Inbox: <span className={cx("font-mono", "text-ink2")}>{inbox}</span> · hover the stack to spread it</p>
      <Stack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

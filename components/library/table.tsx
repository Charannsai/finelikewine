"use client";
/**
 * Table · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Search, sort, select, bulk actions with undo, and pagination.
 */
import React, { useMemo, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Status = "Active" | "Invited" | "Suspended";
type Row = { id: number; name: string; email: string; role: string; status: Status; seen: number };
const ROWS: Row[] = [
  { id: 1, name: "Ana Lopes", email: "ana@northwind.co", role: "Owner", status: "Active", seen: 2 },
  { id: 2, name: "Bilal Khan", email: "bilal@northwind.co", role: "Admin", status: "Active", seen: 15 },
  { id: 3, name: "Chen Wei", email: "chen@northwind.co", role: "Editor", status: "Invited", seen: 4320 },
  { id: 4, name: "Dara Okafor", email: "dara@northwind.co", role: "Editor", status: "Active", seen: 60 },
  { id: 5, name: "Elif Demir", email: "elif@northwind.co", role: "Viewer", status: "Suspended", seen: 20160 },
  { id: 6, name: "Felix Braun", email: "felix@northwind.co", role: "Editor", status: "Active", seen: 240 },
  { id: 7, name: "Grace Ito", email: "grace@northwind.co", role: "Viewer", status: "Invited", seen: 2880 },
  { id: 8, name: "Hugo Martin", email: "hugo@northwind.co", role: "Admin", status: "Active", seen: 8 },
  { id: 9, name: "Isha Rao", email: "isha@northwind.co", role: "Editor", status: "Active", seen: 95 },
];
const HUES = ["#c97a8c", "#7d9bd8", "#6fae84", "#c9a35a", "#9a86c9", "#6fa9ab"];
const DOT: Record<Status, string> = { Active: "bg-green", Invited: "bg-amber", Suspended: "bg-red" };
const ago = (m: number) => (m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`);
const PER = 5;

function Check({ checked, mixed, onChange, label }: { checked: boolean; mixed?: boolean; onChange: () => void; label: string }) {
  return (
    <button role="checkbox" aria-checked={mixed ? "mixed" : checked} aria-label={label} onClick={onChange}
      className={cx("flex h-4 w-4 items-center justify-center rounded border transition-colors duration-300", checked || mixed ? "border-wine bg-wine text-onink" : "border-line2 bg-surface hover:border-ink3")}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">{mixed ? <path d="M6 12h12" /> : checked && <path d="M20 6 9 17l-5-5" />}</svg>
    </button>
  );
}

type Key = "name" | "role" | "seen";
export default function Table() {
  const [rows, setRows] = useState(ROWS);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: Key; dir: 1 | -1 }>({ k: "name", dir: 1 });
  const [sel, setSel] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [undo, setUndo] = useState<{ rows: Row[]; n: number; verb: string } | null>(null);

  const filtered = useMemo(() => rows
    .filter(r => (r.name + r.email + r.role).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.dir), [rows, q, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const cur = Math.min(page, pages);
  const view = filtered.slice((cur - 1) * PER, cur * PER);
  const all = view.length > 0 && view.every(r => sel.includes(r.id));
  const some = view.some(r => sel.includes(r.id));

  const head = (k: Key, label: string, right?: boolean) => (
    <button onClick={() => setSort(s => ({ k, dir: s.k === k ? (s.dir === 1 ? -1 : 1) : 1 }))}
      className={cx("inline-flex items-center gap-1 transition-colors duration-300 hover:text-ink", sort.k === k && "text-ink", right && "flex-row-reverse")}>
      {label}
      <svg viewBox="0 0 10 14" className="h-[11px] w-2"><path d="M5 1 1.5 5h7Z" fill="currentColor" opacity={sort.k === k && sort.dir === 1 ? 1 : 0.3} /><path d="M5 13 1.5 9h7Z" fill="currentColor" opacity={sort.k === k && sort.dir === -1 ? 1 : 0.3} /></svg>
    </button>
  );
  const bulk = (verb: string, change: (r: Row) => Row | null) => {
    setUndo({ rows, n: sel.length, verb });
    setRows(rs => rs.flatMap(r => (sel.includes(r.id) ? (change(r) ? [change(r)!] : []) : [r])));
    setSel([]);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-line2 bg-surface">
        <div className="flex h-[52px] items-center gap-2.5 border-b border-line px-3.5">
          {sel.length ? (
            <>
              <span className="text-[13px] font-medium tabular-nums">{sel.length} selected</span>
              <button onClick={() => bulk("Suspended", r => ({ ...r, status: "Suspended" }))} className="h-7 rounded-md border border-line2 px-2.5 text-xs hover:bg-surface2">Suspend</button>
              <button onClick={() => bulk("Removed", () => null)} className="h-7 rounded-md border border-red/25 bg-redbg px-2.5 text-xs text-red hover:bg-red/15">Remove</button>
              <button onClick={() => setSel([])} className="ml-auto text-[12.5px] text-ink3 hover:text-ink">Clear</button>
            </>
          ) : undo ? (
            <>
              <span className="text-[13px] text-ink2">{undo.verb} {undo.n} member{undo.n > 1 ? "s" : ""}.</span>
              <button onClick={() => { setRows(undo.rows); setUndo(null); }} className="h-7 rounded-md border border-line2 px-2.5 text-xs hover:bg-surface2">Undo</button>
              <button onClick={() => setUndo(null)} className="ml-auto text-[12.5px] text-ink3 hover:text-ink">Dismiss</button>
            </>
          ) : (
            <>
              <div className="relative flex-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink3"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5" /></svg>
                <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search members" aria-label="Search members"
                  className="h-8 w-full max-w-64 rounded-lg border border-line bg-transparent pl-8 pr-2.5 text-[13px] placeholder:text-ink3 focus:border-line2 focus:outline-none" />
              </div>
              <span className="font-mono text-xs text-ink3">{filtered.length} members</span>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink3">
                <th className="h-9 w-11 pl-3.5"><Check checked={all} mixed={some && !all} label="Select page"
                  onChange={() => setSel(s => (all ? s.filter(id => !view.some(r => r.id === id)) : [...new Set([...s, ...view.map(r => r.id)])]))} /></th>
                <th className="px-2.5 font-medium">{head("name", "Name")}</th>
                <th className="px-2.5 font-medium">{head("role", "Role")}</th>
                <th className="px-2.5 font-medium">Status</th>
                <th className="px-3.5 text-right font-medium">{head("seen", "Last seen", true)}</th>
              </tr>
            </thead>
            <tbody>
              {view.map(r => {
                const on = sel.includes(r.id);
                return (
                  <tr key={r.id} className={cx("border-b border-line transition-colors duration-300 last:border-0", on ? "bg-winebg" : "hover:bg-surface2/70")}>
                    <td className="h-[50px] pl-3.5"><Check checked={on} label={`Select ${r.name}`} onChange={() => setSel(s => (s.includes(r.id) ? s.filter(x => x !== r.id) : [...s, r.id]))} /></td>
                    <td className="px-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: HUES[r.id % HUES.length] }}>{r.name.split(" ").map(s => s[0]).join("")}</span>
                        <div><div className="font-medium">{r.name}</div><div className="text-xs text-ink3">{r.email}</div></div>
                      </div>
                    </td>
                    <td className="px-2.5 text-ink2">{r.role}</td>
                    <td className="px-2.5"><span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink2"><i className={cx("h-1.5 w-1.5 rounded-full", DOT[r.status])} />{r.status}</span></td>
                    <td className="px-3.5 text-right font-mono text-xs text-ink3">{ago(r.seen)}</td>
                  </tr>
                );
              })}
              {!view.length && <tr><td colSpan={5} className="py-9 text-center text-[13px] text-ink3">No one matches “{q}”.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line px-3.5 py-2">
          <span className="font-mono text-xs text-ink3">Page {cur} of {pages}</span>
          <div className="flex items-center gap-0.5">
            <button disabled={cur <= 1} onClick={() => setPage(cur - 1)} aria-label="Previous page" className="h-7 w-7 rounded-md text-ink3 hover:bg-surface2 hover:text-ink disabled:opacity-30">‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} aria-current={p === cur ? "page" : undefined}
                className={cx("h-7 min-w-7 rounded-md px-1.5 font-mono text-xs transition-colors duration-300", p === cur ? "bg-surface2 text-ink ring-1 ring-line2" : "text-ink3 hover:text-ink")}>{p}</button>
            ))}
            <button disabled={cur >= pages} onClick={() => setPage(cur + 1)} aria-label="Next page" className="h-7 w-7 rounded-md text-ink3 hover:bg-surface2 hover:text-ink disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

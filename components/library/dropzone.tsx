"use client";
/**
 * Dropzone · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Files are read locally for their name and size only. Nothing is uploaded.
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={d} /></svg>
);
const size = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`);

type Item = { id: number; name: string; size: number; p: number };
const SAMPLE: Item[] = [{ id: -1, name: "brand-guidelines.pdf", size: 4404019, p: 100 }];

export default function Dropzone() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<Item[]>(SAMPLE);
  const input = useRef<HTMLInputElement>(null);
  const id = useRef(0);

  useEffect(() => {
    if (!files.some(f => f.p < 100)) return;
    const t = setTimeout(() => setFiles(fs => fs.map(f => (f.p < 100 ? { ...f, p: Math.min(100, f.p + 7 + ((f.id * 37) % 11)) } : f))), 110);
    return () => clearTimeout(t);
  }, [files]);

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const next = Array.from(list).map(f => ({ id: ++id.current, name: f.name, size: f.size, p: 0 }));
    setFiles(fs => [...next, ...fs].slice(0, 4));
  };
  const done = files.filter(f => f.p >= 100).length;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <button
          onClick={() => input.current?.click()}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
          className={cx("flex flex-col items-center rounded-2xl border border-dashed px-4 py-6 text-center transition-all duration-500", over ? "scale-[1.02] border-wine bg-winebg" : "border-line2 bg-surface hover:border-ink3/50")}>
          <span className={cx("flex h-10 w-10 items-center justify-center rounded-xl border bg-surface transition-all duration-500", over ? "-translate-y-1 border-wine text-wine" : "border-line text-ink3")}>
            <Icon d="M12 16V4M7 9l5-5 5 5M5 20h14" />
          </span>
          <span className="mt-2.5 text-[13px] font-medium">{over ? "Let go to add" : "Drop files here"}</span>
          <span className="mt-0.5 text-xs text-ink3">or click to browse. Files stay on your device.</span>
        </button>
        <input ref={input} type="file" multiple className="hidden" onChange={e => { add(e.target.files); e.target.value = ""; }} />

        <div className="mt-1 flex items-center justify-between px-1 text-xs text-ink3">
          <span>{done} of {files.length} ready</span>
          {files.length > 0 && <button onClick={() => setFiles([])} className="hover:text-ink">Clear</button>}
        </div>
        {files.map(f => (
          <div key={f.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2">
            <span className="text-ink3"><Icon d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-[12.5px]"><span className="truncate">{f.name}</span><span className="ml-2 flex-none font-mono text-[11px] text-ink3">{f.p >= 100 ? size(f.size) : `${Math.floor(f.p)}%`}</span></div>
              <div className="mt-1.5 h-[3px] overflow-hidden rounded-sm bg-surface3">
                <div className="h-full transition-[width,background] duration-300" style={{ width: `${f.p}%`, background: f.p >= 100 ? "var(--green)" : "var(--accent)" }} />
              </div>
            </div>
            <button onClick={() => setFiles(fs => fs.filter(x => x.id !== f.id))} aria-label={`Remove ${f.name}`} className="rounded-md p-1 text-ink3 hover:bg-surface2 hover:text-ink">
              <Icon d="M18 6 6 18M6 6l12 12" className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

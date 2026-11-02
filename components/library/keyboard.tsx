"use client";
/**
 * Keyboard · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Mirrors real key presses by KeyboardEvent.code; keys can also be clicked.
 */
import React, { useEffect, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Key = [code: string, label: string, width?: number];
const ROWS: Key[][] = [
  [["Escape", "esc"], ["Digit1", "1"], ["Digit2", "2"], ["Digit3", "3"], ["Digit4", "4"], ["Digit5", "5"], ["Digit6", "6"], ["Digit7", "7"], ["Digit8", "8"], ["Digit9", "9"], ["Digit0", "0"], ["Minus", "-"], ["Equal", "="], ["Backspace", "delete", 1.8]],
  [["Tab", "tab", 1.5], ["KeyQ", "Q"], ["KeyW", "W"], ["KeyE", "E"], ["KeyR", "R"], ["KeyT", "T"], ["KeyY", "Y"], ["KeyU", "U"], ["KeyI", "I"], ["KeyO", "O"], ["KeyP", "P"], ["BracketLeft", "["], ["BracketRight", "]"], ["Backslash", "\\", 1.3]],
  [["CapsLock", "caps", 1.8], ["KeyA", "A"], ["KeyS", "S"], ["KeyD", "D"], ["KeyF", "F"], ["KeyG", "G"], ["KeyH", "H"], ["KeyJ", "J"], ["KeyK", "K"], ["KeyL", "L"], ["Semicolon", ";"], ["Quote", "'"], ["Enter", "return", 2]],
  [["ShiftLeft", "shift", 2.3], ["KeyZ", "Z"], ["KeyX", "X"], ["KeyC", "C"], ["KeyV", "V"], ["KeyB", "B"], ["KeyN", "N"], ["KeyM", "M"], ["Comma", ","], ["Period", "."], ["Slash", "/"], ["ShiftRight", "shift", 2.5]],
  [["ControlLeft", "ctrl", 1.3], ["AltLeft", "alt", 1.3], ["MetaLeft", "cmd", 1.5], ["Space", "", 6.4], ["MetaRight", "cmd", 1.5], ["ArrowLeft", "←"], ["ArrowDown", "↓"], ["ArrowRight", "→"]],
];

export default function Keyboard() {
  const [down, setDown] = useState<string[]>([]);
  const [heat, setHeat] = useState<Record<string, number>>({});
  const [typed, setTyped] = useState("");

  const press = (code: string, key?: string) => {
    setDown(d => (d.includes(code) ? d : [...d, code]));
    setHeat(h => ({ ...h, [code]: (h[code] ?? 0) + 1 }));
    if (key === "Backspace") setTyped(s => s.slice(0, -1));
    else if (key && key.length === 1) setTyped(s => (s + key).slice(-28));
  };
  const release = (code: string) => setDown(d => d.filter(c => c !== code));

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName);
      press(e.code, typing ? undefined : e.key);
    };
    const onUp = (e: KeyboardEvent) => release(e.code);
    const clear = () => setDown([]);
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    window.addEventListener("blur", clear);
    return () => { document.removeEventListener("keydown", onDown); document.removeEventListener("keyup", onUp); window.removeEventListener("blur", clear); };
  }, []);

  const max = Math.max(1, ...Object.values(heat));
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <style>{`@keyframes kb-caret { 50% { opacity: 0 } }`}</style>
      <div className="flex h-7 items-center font-mono text-[15px]">
        {typed ? <>{typed}<span className="ml-px inline-block h-[18px] w-[2px] bg-wine" style={{ animation: "kb-caret 1s step-end infinite" }} /></> : <span className="text-ink3">Start typing anywhere on the page</span>}
      </div>
      <div className="flex w-full max-w-[760px] flex-col gap-1.5 rounded-2xl border border-line2 bg-surface2/60 p-2">
        {ROWS.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.map(([code, label, w = 1]) => {
              const on = down.includes(code);
              const h = (heat[code] ?? 0) / max;
              return (
                <button key={code} style={{ flex: w }}
                  onPointerDown={() => press(code, code === "Space" ? " " : label.length === 1 ? label.toLowerCase() : code === "Backspace" ? "Backspace" : undefined)}
                  onPointerUp={() => release(code)} onPointerLeave={() => release(code)}
                  className={cx("relative flex h-9 items-end overflow-hidden rounded-lg border px-1.5 pb-1 font-mono text-[10px] transition-[transform,background,border,box-shadow] duration-100",
                    on ? "translate-y-0.5 border-wine bg-wine text-onink" : "border-line2 bg-surface text-ink3 shadow-[0_2px_0_var(--line2)]")}>
                  {!on && h > 0 && <span className="absolute inset-0 bg-wine transition-opacity duration-700" style={{ opacity: h * 0.2 }} />}
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <span className="text-xs text-ink3">The tint shows the keys you press most.{typed && <button onClick={() => { setTyped(""); setHeat({}); }} className="ml-2 underline-offset-2 hover:text-ink hover:underline">Clear</button>}</span>
    </div>
  );
}
